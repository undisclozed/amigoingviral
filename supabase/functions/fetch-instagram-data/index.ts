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

    console.log('Starting process for username:', username)

    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set')
    }

    // Initialize the ApifyClient with API token
    const client = new ApifyClient({
      token: apiKey,
    });

    console.log('Using Apify Instagram Scraper actor')
    
    // Run the Actor and wait for it to finish
    // Using the more comprehensive Instagram scraper
    const run = await client.actor("apify/instagram-scraper").call({
      "directUrls": [`https://www.instagram.com/${username}/`],
      "resultsType": "details",
      "searchType": "user",
      "maxPosts": 30,
      "expandOwners": false,
      "proxy": {
        "useApifyProxy": true
      }
    });

    console.log('Actor run completed, run ID:', run.id)

    // Fetch Actor results from the run's dataset
    console.log('Fetching dataset items...')
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    console.log('Raw dataset items:', JSON.stringify(items))

    if (!items || items.length === 0) {
      throw new Error('No data returned from Instagram scraper')
    }

    return new Response(
      JSON.stringify({ data: items }),
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