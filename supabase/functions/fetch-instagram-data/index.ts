import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, maxPosts } = await req.json();
    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');

    if (!username) {
      throw new Error('Username is required');
    }

    console.log('Fetching reels for:', username, 'max posts:', maxPosts);

    const response = await fetch('https://api.apify.com/v2/acts/apify~instagram-reel-scraper/run-sync-get-dataset-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIFY_API_KEY}`,
      },
      body: JSON.stringify({
        "username": [username],
        "resultsLimit": maxPosts || 10,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Apify API error:', errorText);
      throw new Error(`Apify API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched reels data');

    return new Response(JSON.stringify({ data }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message, details: 'Check Supabase logs for more information' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});