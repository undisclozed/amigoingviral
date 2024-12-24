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

    // Validate API key by making a test request
    const testResponse = await fetch(
      'https://api.apify.com/v2/user/me?token=' + APIFY_API_KEY
    )

    if (!testResponse.ok) {
      console.error('Invalid APIFY_API_KEY - API test request failed:', await testResponse.text())
      throw new Error('Invalid APIFY_API_KEY')
    }

    // Clean up username (remove @ if present)
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username
    console.log('Cleaned username:', cleanUsername)

    // Start the Apify actor run
    console.log('Starting Apify actor run...')
    const startResponse = await fetch(
      'https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token=' + APIFY_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "usernames": [cleanUsername],
          "resultsLimit": 10,
          "resultsType": "posts",
          "searchType": "user",
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

    const startData = await startResponse.json()
    const runId = startData.data.id
    console.log('Apify run started with ID:', runId)

    // Wait for the run to finish (with timeout)
    let attempts = 0
    const maxAttempts = 10
    let dataset = null

    while (attempts < maxAttempts) {
      console.log(`Checking run status (attempt ${attempts + 1}/${maxAttempts})`)
      const statusResponse = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs/${runId}?token=${APIFY_API_KEY}`
      )
      
      if (!statusResponse.ok) {
        const errorText = await statusResponse.text()
        console.error('Failed to check run status:', errorText)
        throw new Error('Failed to check run status')
      }

      const statusData = await statusResponse.json()
      const status = statusData.data.status
      console.log('Run status:', status)

      if (status === 'SUCCEEDED') {
        console.log('Run succeeded, fetching results')
        const datasetResponse = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs/${runId}/dataset/items?token=${APIFY_API_KEY}`
        )
        
        if (!datasetResponse.ok) {
          const errorText = await datasetResponse.text()
          console.error('Failed to fetch dataset:', errorText)
          throw new Error(`Failed to fetch dataset: ${errorText}`)
        }

        const responseText = await datasetResponse.text()
        console.log('Dataset response text length:', responseText.length)
        
        if (!responseText) {
          throw new Error('Empty dataset response')
        }

        try {
          dataset = JSON.parse(responseText)
          if (!Array.isArray(dataset)) {
            console.error('Invalid dataset format:', dataset)
            throw new Error('Invalid dataset format received from Apify')
          }
          console.log(`Successfully parsed dataset with ${dataset.length} posts`)
        } catch (error) {
          console.error('Failed to parse dataset JSON:', error)
          throw new Error('Invalid JSON response from dataset')
        }
        break
      } else if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
        console.error(`Run failed with status: ${status}`)
        throw new Error(`Run failed with status: ${status}`)
      }

      await new Promise(resolve => setTimeout(resolve, 10000))
      attempts++
    }

    if (!dataset) {
      throw new Error('Timeout waiting for results')
    }

    // Transform the data
    const transformedData = dataset.map((post: any) => ({
      id: post.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
      username: post.ownerUsername || cleanUsername,
      thumbnail: post.displayUrl || post.previewUrl || '',
      caption: post.caption || '',
      timestamp: post.timestamp || new Date().toISOString(),
      metrics: {
        views: post.videoViewCount || 0,
        likes: post.likesCount || 0,
        comments: post.commentsCount || 0,
        shares: post.sharesCount || 0,
        saves: post.savesCount || 0,
        engagement: ((post.likesCount || 0) + (post.commentsCount || 0)) / (post.videoViewCount || 1) * 100,
        followsFromPost: 0,
        averageWatchPercentage: 0
      }
    }));

    console.log('Transformed data sample:', JSON.stringify(transformedData[0], null, 2));

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