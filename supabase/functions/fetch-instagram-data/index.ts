import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Apify } from 'https://esm.sh/apify-client@2.8.4'

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
    const { username, debug } = await req.json()
    
    if (!username) {
      throw new Error('Username is required')
    }

    console.log('Starting Instagram data fetch for username:', username)
    
    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set')
    }

    const client = new Apify({ token: apiKey })

    // Start the scraper run with full scraping options
    console.log('Starting scraper with username:', username)
    const input = {
      "usernames": [username],
      "resultsLimit": 30,
      "scrapePosts": true,
      "scrapeStories": true,
      "scrapeHighlights": true,
      "scrapeFollowers": true,
      "scrapeFollowing": true,
      "proxy": {
        "useApifyProxy": true
      }
    }
    console.log('Apify input:', JSON.stringify(input, null, 2))

    try {
      const run = await client.actor("apify/instagram-profile-scraper").call(input)
      console.log('Actor Run Response:', JSON.stringify(run, null, 2))

      if (!run.defaultDatasetId) {
        throw new Error('Actor run completed, but no dataset was created.')
      }

      const dataset = await client.dataset(run.defaultDatasetId).listItems()
      console.log('Fetched Dataset:', JSON.stringify(dataset, null, 2))

      // Transform the data for posts
      const transformedData = dataset.items
        .filter((post: any) => post && (post.type === 'Video' || post.type === 'Photo'))
        .map((post: any) => ({
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
            shares: post.sharesCount || 0,
          }
        }))

      console.log('Successfully transformed', transformedData.length, 'posts')

      return new Response(
        JSON.stringify({
          data: transformedData,
          ...(debug ? { rawApifyResponse: dataset.items } : {})
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        }
      )

    } catch (error) {
      console.error('Error during Apify actor call:', error)
      throw error
    }

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Unknown error occurred',
        details: 'Check the function logs for more information'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    )
  }
})