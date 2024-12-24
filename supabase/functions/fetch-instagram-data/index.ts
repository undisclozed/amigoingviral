import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { ApifyClient } from 'npm:apify-client';

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

    // Initialize the ApifyClient with API token
    const client = new ApifyClient({
      token: apiKey,
    });

    console.log('Initialized Apify client')

    // Prepare Actor input exactly as in the example
    const input = {
      "username": [username],
      "resultsLimit": 30
    };

    console.log('Running actor with input:', input)

    try {
      // Run the Actor and wait for it to finish - using their exact actor ID
      const run = await client.actor("xMc5Ga1oCONPmWJIa").call(input);
      console.log('Actor run completed, dataset ID:', run.defaultDatasetId)

      // Fetch results from the dataset
      console.log('Fetching results from dataset')
      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      console.log('Raw dataset items:', items)

      if (!items || items.length === 0) {
        throw new Error('No data returned from Instagram scraper')
      }

      const profileData = items[0]
      console.log('Profile data:', profileData)

      // Transform the data into our expected format
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
      console.error('Error in Apify execution:', error)
      throw new Error(`Failed to fetch Instagram data: ${error.message}`)
    }

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