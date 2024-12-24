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
      'https://api.apify.com/v2/acts/xMc5Ga1oCONPmWJIa/runs?token=' + apiKey,
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

    const runData = await actorRunResponse.json()
    console.log('Actor run started:', runData)

    // Wait for the dataset to be ready
    const maxAttempts = 10
    let attempt = 0
    let profileData = null

    while (attempt < maxAttempts) {
      console.log(`Checking run status (attempt ${attempt + 1}/${maxAttempts})...`)
      
      try {
        const datasetResponse = await fetch(
          `https://api.apify.com/v2/datasets/${runData.data.defaultDatasetId}/items?token=${apiKey}`
        )
        
        if (!datasetResponse.ok) {
          throw new Error(`Dataset fetch failed: ${await datasetResponse.text()}`)
        }

        const items = await datasetResponse.json()
        console.log('Dataset items:', items)

        if (items && items.length > 0) {
          profileData = items[0]
          break
        }
      } catch (error) {
        console.error('Error fetching dataset:', error)
      }

      attempt++
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    if (!profileData) {
      throw new Error('Failed to fetch Instagram data after maximum attempts')
    }

    // Transform the data into a more usable format
    const transformedData = {
      username: profileData.username || username,
      biography: profileData.bio || '',
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