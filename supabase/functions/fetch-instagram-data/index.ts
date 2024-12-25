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

    console.log('Fetching Instagram Reels for:', username);
    
    // Get Apify API Key from environment
    const apiKey = Deno.env.get('APIFY_API_KEY');
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set');
    }

    // Instagram Reel Scraper actor ID
    const actorId = 'apify/instagram-reel-scraper';
    const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiKey}`;

    const input = {
      directUrls: [`https://www.instagram.com/${username}/reels/`],
      resultsLimit: 20,
      proxy: { useApifyProxy: true }
    };

    // Call the Apify Instagram Reel Scraper API
    const response = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });

    const runResult = await response.json();

    if (!runResult.defaultDatasetId) {
      throw new Error('Actor run completed, but no dataset was created.');
    }

    // Fetch dataset results from Apify
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/datasets/${runResult.defaultDatasetId}/items?token=${apiKey}`
    );

    const dataset = await datasetResponse.json();

    // Transform data into the format you need
    const transformedData = dataset.map((reel: any) => ({
      id: reel.id || `temp-${Date.now()}`,
      username: reel.ownerUsername || username,
      thumbnail: reel.thumbnailUrl || '',
      caption: reel.caption || '',
      timestamp: reel.timestamp || new Date().toISOString(),
      metrics: {
        views: reel.videoViewCount || 0,
        likes: reel.likesCount || 0,
        comments: reel.commentsCount || 0,
        saves: reel.savesCount || 0,
        shares: reel.sharesCount || 0,
      }
    }));

    return new Response(
      JSON.stringify({ data: transformedData }),
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
