import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    // Get username from request
    const body = await req.json()
    const username = body.username?.replace('@', '')
    
    if (!username) {
      throw new Error('Username is required')
    }

    console.log('Processing request for username:', username)

    // Initialize Apify client
    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set')
    }

    const client = new ApifyClient({
      token: apiKey,
    })

    // Run the actor
    console.log('Starting actor run for:', username)
    const run = await client.actor("apify/instagram-post-scraper").call({
      username: username,
      resultsLimit: 30,
      searchType: "user",
      searchLimit: 1
    })

    if (!run?.id) {
      throw new Error('Actor run failed to start')
    }

    console.log('Actor run started with ID:', run.id)

    // Get dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems()
    
    if (!Array.isArray(items)) {
      throw new Error('Invalid dataset format received')
    }

    console.log('Processing', items.length, 'posts')

    // Transform data
    const transformedData = items.map(post => ({
      id: post.id || `temp-${Date.now()}-${Math.random()}`,
      username: post.ownerUsername || username,
      thumbnail: post.displayUrl || '',
      caption: post.caption || '',
      timestamp: post.timestamp || new Date().toISOString(),
      metrics: {
        views: post.videoViewCount || 0,
        likes: post.likesCount || 0,
        comments: post.commentsCount || 0,
        engagement: ((post.likesCount || 0) + (post.commentsCount || 0)) / 100,
        saves: post.savesCount || 0,
        shares: post.sharesCount || 0
      }
    }))

    console.log('Successfully transformed', transformedData.length, 'posts')

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