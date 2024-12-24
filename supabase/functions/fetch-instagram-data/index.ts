import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { ApifyClient } from 'https://esm.sh/apify-client@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { username } = await req.json()
    if (!username) {
      throw new Error('Username is required')
    }

    console.log('Fetching data for username:', username)
    
    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set')
    }

    const client = new ApifyClient({
      token: apiKey,
    })

    const input = {
      "username": [username],
      "resultsLimit": 30,
      "scrapePostsUntilDate": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
    }

    console.log('Starting Instagram Scraper actor with input:', JSON.stringify(input))
    
    // Run the actor and handle potential failures
    const run = await client.actor("xMc5Ga1oCONPmWJIa").call(input)
    if (!run || run.status !== 'SUCCEEDED') {
      throw new Error(`Actor failed with status: ${run?.status || 'unknown'}`)
    }
    console.log('Actor run completed, run ID:', run.id)

    // Fetch and validate dataset
    const dataset = await client.dataset(run.defaultDatasetId).listItems()
    if (!Array.isArray(dataset)) {
      throw new Error('Invalid dataset format received')
    }
    console.log('Dataset retrieved, processing items...')

    // Transform the data with proper validation
    const transformedData = dataset.slice(0, 30).map((post: any) => {
      // Calculate engagement metrics with fallbacks
      const totalEngagements = (post.likesCount || 0) + 
                             (post.commentsCount || 0) + 
                             (post.savesCount || 0) + 
                             (post.sharesCount || 0)
      
      const viewsCount = post.viewsCount || 0
      const engagementRate = viewsCount > 0 ? (totalEngagements / viewsCount) * 100 : 0

      // Calculate ratios with safety checks
      const likesReachRatio = viewsCount > 0 ? ((post.likesCount || 0) / viewsCount) * 100 : 0
      const commentsReachRatio = viewsCount > 0 ? ((post.commentsCount || 0) / viewsCount) * 100 : 0
      const savesReachRatio = viewsCount > 0 ? ((post.savesCount || 0) / viewsCount) * 100 : 0
      const followsReachRatio = viewsCount > 0 ? ((post.followsFromPost || 0) / viewsCount) * 100 : 0

      // Calculate virality score with weighted metrics
      const viralityScore = Math.round(
        (engagementRate * 50) + 
        (viewsCount / 1000) + 
        ((post.sharesCount || 0) * 2)
      )

      return {
        id: post.id || `temp-${Date.now()}-${Math.random()}`,
        username: post.ownerUsername || username,
        thumbnail: post.thumbnailUrl || post.displayUrl || '',
        caption: post.caption || '',
        timestamp: post.timestamp || new Date().toISOString(),
        type: post.type || 'unknown',
        url: post.url || '',
        metrics: {
          virality_score: viralityScore,
          views: viewsCount,
          likes: post.likesCount || 0,
          comments: post.commentsCount || 0,
          impressions: viewsCount,
          reach: viewsCount,
          saves: post.savesCount || 0,
          shares: post.sharesCount || 0,
          engagement_rate: engagementRate,
          likes_reach_ratio: likesReachRatio,
          comments_reach_ratio: commentsReachRatio,
          saves_reach_ratio: savesReachRatio,
          video_duration: post.videoDuration || null,
          avg_watch_percentage: post.videoPlayCount ? 
            (post.videoPlayCount / viewsCount) * 100 : null,
          follows_from_post: post.followsFromPost || 0,
          follows_reach_ratio: followsReachRatio
        },
        hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
        mentions: Array.isArray(post.mentions) ? post.mentions : [],
        latestComments: Array.isArray(post.latestComments) ? post.latestComments : []
      }
    })

    console.log('Data transformation completed successfully')

    return new Response(
      JSON.stringify({
        data: transformedData
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
        details: 'Check the function logs for more information'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    )
  }
})