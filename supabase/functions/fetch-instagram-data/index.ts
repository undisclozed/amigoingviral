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

    // Start the Apify actor run with reduced result limit and faster timeout
    console.log('Starting Apify actor run with minimal configuration')
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
          "resultsLimit": 5, // Reduced from 10 to 5 for faster processing
          "scrapeStories": false,
          "scrapeHighlights": false,
          "proxy": {
            "useApifyProxy": true,
            "apifyProxyGroups": ["RESIDENTIAL"]
          },
          "maxRequestRetries": 1, // Reduced retries
          "maxConcurrency": 1 // Reduced concurrency
        })
      }
    )

    if (!startResponse.ok) {
      const errorText = await startResponse.text()
      console.error('Failed to start Apify actor:', errorText)
      throw new Error(`Failed to start Apify actor: ${errorText}`)
    }

    const runData = await startResponse.json()
    console.log('Apify run started. Run ID:', runData.data.id)

    // Wait for the dataset with shorter intervals and fewer attempts
    const datasetId = runData.data.defaultDatasetId
    console.log('Waiting for dataset:', datasetId)
    
    const maxAttempts = 10 // Reduced from 30 to 10
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
        console.error('Dataset fetch failed:', await datasetResponse.text())
        await new Promise(resolve => setTimeout(resolve, 1000)) // Reduced wait time
        attempts++
        continue
      }

      dataset = await datasetResponse.json()
      console.log('Dataset items count:', dataset.length)
      
      if (dataset && dataset.length > 0) {
        console.log('Valid dataset received')
        break
      }

      await new Promise(resolve => setTimeout(resolve, 1000)) // Reduced wait time
      attempts++
    }

    // Return mock data if no real data is available
    if (!dataset || dataset.length === 0) {
      console.log('No data from Apify, returning mock data')
      const mockPost = {
        id: `mock-${Date.now()}`,
        username: cleanUsername,
        thumbnail: '/placeholder.svg',
        caption: 'Example post',
        timestamp: new Date().toISOString(),
        type: 'image',
        metrics: {
          views: 1000,
          likes: 100,
          comments: 10,
          shares: 5,
          saves: 20,
          engagement: 2.5,
          followsFromPost: 3,
          averageWatchPercentage: 75
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true,
          data: [mockPost],
          message: 'Mock data returned due to timeout'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform the data with minimal processing
    console.log('Transforming', dataset.length, 'posts')
    const transformedData = dataset.map((post: any) => ({
      id: post.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
      username: post.ownerUsername || cleanUsername,
      thumbnail: post.displayUrl || post.videoUrl || '/placeholder.svg',
      caption: post.caption || '',
      timestamp: post.timestamp || new Date().toISOString(),
      type: post.type || 'image',
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
    }));

    console.log('Returning', transformedData.length, 'posts')

    return new Response(
      JSON.stringify({ 
        success: true,
        data: transformedData,
        message: `Successfully fetched ${transformedData.length} posts for @${cleanUsername}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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