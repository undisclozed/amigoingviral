import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();
    if (!username) {
      throw new Error('Username is required');
    }

    console.log('Fetching Instagram data for:', username);
    
    const apiKey = Deno.env.get('APIFY_API_KEY');
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set');
    }

    console.log('APIFY_API_KEY length:', apiKey.length);

    // Using the Instagram Reel Scraper actor directly
    const apifyUrl = `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/run-sync?token=${apiKey}`;

    const input = {
      usernames: [username], // Changed from username to usernames array
      maxPosts: 1,
    };

    console.log('Making request to Apify URL:', apifyUrl);
    console.log('With input:', JSON.stringify(input));

    const response = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Apify API error response:', errorText);
      throw new Error(`Apify API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Raw data received:', JSON.stringify(data, null, 2));

    return new Response(
      JSON.stringify({ data }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Unknown error occurred',
        details: 'Check Supabase logs for more information'
      }),
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