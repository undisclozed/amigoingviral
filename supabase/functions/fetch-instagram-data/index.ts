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

    // Make request to Apify API
    const response = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "usernames": [username],
          "resultsLimit": 1,
          "resultsType": "details",
          "extendOutputFunction": "",
          "proxy": {
            "useApifyProxy": true
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Apify API error:', errorText)
      throw new Error(`Apify API error: ${errorText}`)
    }

    const data = await response.json()
    console.log('Raw Apify response:', data)

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No data returned from Apify API')
    }

    const profileData = data[0]
    
    // Transform the data into a more usable format
    const transformedData = {
      userData: {
        username: profileData.username,
        biography: profileData.bio,
        followersCount: profileData.followersCount,
        followingCount: profileData.followingCount,
        postsCount: profileData.postsCount,
        profilePicUrl: profileData.profilePicUrl,
      },
      latestPosts: profileData.latestPosts?.map((post: any) => ({
        id: post.id,
        caption: post.caption,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        timestamp: post.timestamp,
        url: post.url,
      })) || []
    }

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