import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { ApifyClient } from 'https://esm.sh/apify-client@2.7.1'
import { corsHeaders } from './cors.ts'

console.log('Instagram Data Fetch Function Started')

serve(async (req) => {
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
      "resultsLimit": 30
    }

    console.log('Starting Instagram Scraper actor with input:', JSON.stringify(input))
    
    const run = await client.actor("xMc5Ga1oCONPmWJIa").call(input)
    console.log('Actor run completed, run ID:', run.id)

    const dataset = await client.dataset(run.defaultDatasetId).listItems()
    console.log('Raw dataset retrieved:', dataset)

    // Transform the data into our desired format
    const transformedData = dataset.map((post: any) => {
      // Calculate engagement rate
      const totalEngagements = (post.likesCount || 0) + 
                             (post.commentsCount || 0) + 
                             (post.savesCount || 0) + 
                             (post.sharesCount || 0)
      const engagementRate = post.viewsCount ? 
        (totalEngagements / post.viewsCount) * 100 : 0

      // Calculate ratios
      const likesReachRatio = post.viewsCount ? 
        (post.likesCount / post.viewsCount) * 100 : 0
      const commentsReachRatio = post.viewsCount ? 
        (post.commentsCount / post.viewsCount) * 100 : 0
      const savesReachRatio = post.viewsCount ? 
        (post.savesCount / post.viewsCount) * 100 : 0
      const followsReachRatio = post.viewsCount ? 
        (post.followsFromPost / post.viewsCount) * 100 : 0

      // Calculate virality score (simplified version)
      const viralityScore = Math.round(
        (engagementRate * 50) + 
        (post.viewsCount / 1000) + 
        ((post.sharesCount || 0) * 2)
      )

      return {
        id: post.id,
        username: post.ownerUsername,
        thumbnail: post.thumbnailUrl || post.displayUrl,
        caption: post.caption,
        timestamp: post.timestamp,
        type: post.type,
        url: post.url,
        metrics: {
          virality_score: viralityScore,
          views: post.viewsCount || 0,
          likes: post.likesCount || 0,
          comments: post.commentsCount || 0,
          impressions: post.viewsCount || 0, // Using views as impressions
          reach: post.viewsCount || 0, // Using views as reach since actual reach isn't available
          saves: post.savesCount || 0,
          shares: post.sharesCount || 0,
          engagement_rate: engagementRate,
          likes_reach_ratio: likesReachRatio,
          comments_reach_ratio: commentsReachRatio,
          saves_reach_ratio: savesReachRatio,
          video_duration: post.videoDuration || null,
          avg_watch_percentage: post.videoPlayCount ? 
            (post.videoPlayCount / post.viewsCount) * 100 : null,
          follows_from_post: post.followsFromPost || 0,
          follows_reach_ratio: followsReachRatio
        },
        hashtags: post.hashtags || [],
        mentions: post.mentions || [],
        latestComments: post.latestComments || []
      }
    })

    console.log('Transformed data:', JSON.stringify(transformedData, null, 2))

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
        error: error.message,
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