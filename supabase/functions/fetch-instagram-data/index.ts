import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { username } = await req.json()
    console.log('Starting Instagram data fetch for username:', username)

    if (!username) {
      throw new Error('Username is required')
    }

    if (!APIFY_API_KEY) {
      console.error('APIFY_API_KEY is not configured')
      throw new Error('APIFY_API_KEY is not configured')
    }

    // Clean up username (remove @ if present)
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username
    console.log('Cleaned username:', cleanUsername)

    // Start the Apify actor run
    console.log('Starting Apify actor run...')
    const startResponse = await fetch(
      'https://api.apify.com/v2/acts/zuzka~instagram-profile-scraper/runs',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${APIFY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "usernames": [cleanUsername],
          "resultsLimit": 10,
          "scrapeStories": false,
          "scrapeHighlights": false,
          "proxy": {
            "useApifyProxy": true,
            "apifyProxyGroups": ["RESIDENTIAL"]
          }
        })
      }
    )

    if (!startResponse.ok) {
      const errorText = await startResponse.text()
      console.error('Failed to start Apify actor:', errorText)
      throw new Error(`Failed to start Apify actor: ${errorText}`)
    }

    const runData = await startResponse.json()
    console.log('Apify run started:', JSON.stringify(runData, null, 2))

    // Wait for the dataset to be ready
    const datasetId = runData.data.defaultDatasetId
    const maxAttempts = 30
    let attempts = 0
    let dataset = null

    while (attempts < maxAttempts) {
      console.log(`Checking dataset (attempt ${attempts + 1}/${maxAttempts})...`)
      const datasetResponse = await fetch(
        `https://api.apify.com/v2/datasets/${datasetId}/items`,
        {
          headers: {
            'Authorization': `Bearer ${APIFY_API_KEY}`,
          }
        }
      )

      if (!datasetResponse.ok) {
        const errorText = await datasetResponse.text()
        console.error('Dataset fetch failed:', errorText)
        await new Promise(resolve => setTimeout(resolve, 2000))
        attempts++
        continue
      }

      dataset = await datasetResponse.json()
      console.log('Raw dataset response:', JSON.stringify(dataset, null, 2))
      
      if (dataset && dataset.length > 0) {
        break
      }

      await new Promise(resolve => setTimeout(resolve, 2000))
      attempts++
    }

    if (!dataset || dataset.length === 0) {
      console.error('No data returned from Apify')
      throw new Error('Failed to fetch Instagram data: Dataset empty or timeout')
    }

    // Transform the data
    const transformedData = dataset.map((post: any) => {
      console.log('Processing post:', JSON.stringify(post, null, 2))
      
      // Extract media type and URL
      const mediaType = post.type || 'image'
      const mediaUrl = post.displayUrl || post.videoUrl || ''
      
      return {
        id: post.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
        username: post.ownerUsername || cleanUsername,
        thumbnail: mediaUrl,
        caption: post.caption || '',
        timestamp: post.timestamp || new Date().toISOString(),
        type: mediaType,
        metrics: {
          views: post.videoViewCount || 0,
          likes: post.likesCount || 0,
          comments: post.commentsCount || 0,
          shares: post.sharesCount || 0,
          saves: post.savesCount || 0,
          engagement: ((post.likesCount || 0) + (post.commentsCount || 0)) / (post.videoViewCount || 1) * 100,
          followsFromPost: post.followsCount || 0,
          averageWatchPercentage: post.averageWatchPercentage || 0
        }
      }
    });

    console.log('Transformed data:', JSON.stringify(transformedData, null, 2))

    return new Response(
      JSON.stringify({ 
        success: true,
        data: transformedData,
        message: `Successfully fetched ${transformedData.length} posts for @${cleanUsername}`
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in fetch-instagram-data function:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: 'Check the function logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})