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
    // Parse and validate request body
    let username;
    try {
      const body = await req.json()
      username = body.username?.replace('@', '')
      if (!username) {
        throw new Error('Username is required')
      }
      console.log('Processing request for username:', username)
    } catch (error) {
      console.error('Error parsing request:', error)
      throw new Error('Invalid request format')
    }

    // Initialize Apify client
    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set')
    }
    const client = new ApifyClient({ token: apiKey })

    // Prepare input for the actor
    const input = {
      "username": [username],
      "resultsLimit": 30,
      "scrapePostsUntilDate": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
    console.log('Starting actor with input:', input)

    // Run the actor and wait for completion
    const run = await client.actor("xMc5Ga1oCONPmWJIa").call(input)
    if (!run || !run.id) {
      throw new Error('Actor did not return a valid response')
    }
    console.log('Actor run started with ID:', run.id)

    // Wait for and validate run status
    if (run.status !== 'SUCCEEDED') {
      throw new Error(`Actor failed with status: ${run.status}`)
    }
    console.log('Actor run completed successfully')

    // Fetch dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems()
    if (!Array.isArray(items)) {
      console.error('Invalid dataset format:', items)
      throw new Error('Invalid dataset format received')
    }
    console.log(`Retrieved ${items.length} items from dataset`)

    // Transform the data
    const transformedData = items.slice(0, 30).map((post: any) => {
      try {
        // Calculate engagement metrics with fallbacks
        const viewsCount = post.viewsCount || 0
        const likesCount = post.likesCount || 0
        const commentsCount = post.commentsCount || 0
        const savesCount = post.savesCount || 0
        const sharesCount = post.sharesCount || 0
        
        const totalEngagements = likesCount + commentsCount + savesCount + sharesCount
        const engagementRate = viewsCount > 0 ? (totalEngagements / viewsCount) * 100 : 0

        // Calculate ratios
        const likesReachRatio = viewsCount > 0 ? (likesCount / viewsCount) * 100 : 0
        const commentsReachRatio = viewsCount > 0 ? (commentsCount / viewsCount) * 100 : 0
        const savesReachRatio = viewsCount > 0 ? (savesCount / viewsCount) * 100 : 0
        const followsFromPost = post.followsFromPost || 0
        const followsReachRatio = viewsCount > 0 ? (followsFromPost / viewsCount) * 100 : 0

        // Calculate virality score
        const viralityScore = Math.round(
          (engagementRate * 50) + 
          (viewsCount / 1000) + 
          (sharesCount * 2)
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
            likes: likesCount,
            comments: commentsCount,
            impressions: viewsCount,
            reach: viewsCount,
            saves: savesCount,
            shares: sharesCount,
            engagement_rate: engagementRate,
            likes_reach_ratio: likesReachRatio,
            comments_reach_ratio: commentsReachRatio,
            saves_reach_ratio: savesReachRatio,
            video_duration: post.videoDuration || null,
            avg_watch_percentage: post.videoPlayCount ? 
              (post.videoPlayCount / viewsCount) * 100 : null,
            follows_from_post: followsFromPost,
            follows_reach_ratio: followsReachRatio
          },
          hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
          mentions: Array.isArray(post.mentions) ? post.mentions : [],
          latestComments: Array.isArray(post.latestComments) ? post.latestComments : []
        }
      } catch (error) {
        console.error('Error processing post:', error, post)
        return null
      }
    }).filter(Boolean)

    console.log('Successfully transformed data')

    return new Response(
      JSON.stringify({ data: transformedData }),
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