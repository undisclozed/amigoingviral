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

    // First validate the API key with a simple request
    console.log('Validating Apify API key...')
    try {
      const testResponse = await fetch('https://api.apify.com/v2/user/me', {
        headers: {
          'Authorization': `Bearer ${APIFY_API_KEY}`,
        },
      })

      if (!testResponse.ok) {
        const errorText = await testResponse.text()
        console.error('Invalid APIFY_API_KEY - API test request failed:', errorText)
        throw new Error('Invalid APIFY_API_KEY')
      }

      const userData = await testResponse.json()
      console.log('Apify API key validation successful. User data:', JSON.stringify(userData, null, 2))
    } catch (error) {
      console.error('Error validating Apify API key:', error)
      throw new Error('Failed to validate Apify API key')
    }

    // Clean up username (remove @ if present)
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username
    console.log('Cleaned username:', cleanUsername)

    // Start the Apify actor run
    console.log('Starting Apify actor run...')
    const startResponse = await fetch(
      'https://api.apify.com/v2/actor-tasks/~instagram_profile_scraper/runs?token=' + APIFY_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": cleanUsername,
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

    let responseData
    try {
      responseData = await startResponse.json()
      console.log('Raw Apify response:', JSON.stringify(responseData, null, 2))
    } catch (error) {
      console.error('Failed to parse Apify response:', error)
      throw new Error('Invalid response format from Apify')
    }

    if (!responseData || !Array.isArray(responseData.posts)) {
      console.error('Invalid response format:', responseData)
      throw new Error('Invalid response format from Apify')
    }

    // Transform the data
    const transformedData = responseData.posts.map((post: any) => ({
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