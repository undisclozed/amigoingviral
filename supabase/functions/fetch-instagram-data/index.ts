import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { ApifyClient } from 'npm:apify-client';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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

    console.log('Starting Apify client with username:', username)

    const client = new ApifyClient({
      token: apiKey,
    });

    // Exactly match the Apify example input
    const input = {
      "username": [username],
      "resultsLimit": 30
    };

    try {
      console.log('Starting actor run...')
      const run = await client.actor("xMc5Ga1oCONPmWJIa").call(input);
      console.log('Actor run completed, run ID:', run.id)

      console.log('Fetching dataset items...')
      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      console.log('Raw items from dataset:', JSON.stringify(items, null, 2))

      if (!items || items.length === 0) {
        throw new Error('No data returned from Instagram scraper')
      }

      // Get the first item as it contains the profile data
      const profile = items[0];
      console.log('Profile data:', JSON.stringify(profile, null, 2))

      // Return the raw profile data for debugging
      return new Response(
        JSON.stringify(profile),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      )

    } catch (error) {
      console.error('Error in Apify execution:', error)
      throw error
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