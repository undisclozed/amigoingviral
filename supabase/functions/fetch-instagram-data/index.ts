import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    
    if (!username) {
      throw new Error('Username is required')
    }

    console.log('Processing request for username:', username)

    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set')
    }

    // Start the Apify actor run
    const actorRunResponse = await fetch(
      'https://api.apify.com/v2/acts/xMc5Ga1oCONPmWJIa/run-sync-get-dataset-items?token=' + apiKey,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "username": [username],
          "resultsLimit": 5
        })
      }
    )

    if (!actorRunResponse.ok) {
      const errorText = await actorRunResponse.text()
      console.error('Apify actor run error:', errorText)
      throw new Error(`Failed to start Apify actor: ${errorText}`)
    }

    const data = await actorRunResponse.json()
    console.log('Raw Apify response:', data)

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No data returned from Apify API')
    }

    const profileData = data[0]
    console.log('Profile data:', profileData)

    // Transform the data into the expected format
    const transformedData = {
      username: profileData.username || username,
      biography: profileData.biography || '',
      followersCount: profileData.followersCount || 0,
      followingCount: profileData.followingCount || 0,
      postsCount: profileData.postsCount || 0,
      profilePicUrl: profileData.profilePicUrl || '',
      latestPosts: (profileData.latestPosts || []).map((post: any) => ({
        id: post.id || '',
        caption: post.caption || '',
        likesCount: post.likesCount || 0,
        commentsCount: post.commentsCount || 0,
        timestamp: post.timestamp || '',
        url: post.url || '',
      }))
    }

    console.log('Transformed data:', transformedData)

    return new Response(
      JSON.stringify(transformedData),
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
        error: error.message,
        details: 'Check the function logs for more information'
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})