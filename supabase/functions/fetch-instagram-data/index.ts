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
    
    // Retrieve API key from Supabase environment variables
    const apiKey = Deno.env.get('APIFY_API_KEY');
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set');
    }

    const actorId = 'apify/instagram-profile-scraper';

    // Prepare API request to Apify REST API
    const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiKey}`;
    
    const input = {
      usernames: [username],
      resultsLimit: 30,
      scrapePosts: true,
      scrapeStories: true,
      scrapeHighlights: true,
    };

    const response = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input })
    });

    const runResult = await response.json();

    if (!runResult.defaultDatasetId) {
      throw new Error('Actor run completed, but no dataset was created.');
    }

    // Fetch dataset results from Apify
    const datasetResponse = await fetch(`https://api.apify.com/v2/datasets/${runResult.defaultDatasetId}/items?token=${apiKey}`);
    const dataset = await datasetResponse.json();

    // Transform dataset items
    const transformedData = dataset.map((post: any) => ({
      id: post.id || `temp-${Date.now()}`,
      username: post.ownerUsername || username,
      thumbnail: post.displayUrl || '',
      caption: post.caption || '',
      timestamp: post.timestamp || new Date().toISOString(),
      metrics: {
        views: post.videoViewCount || 0,
        likes: post.likesCount || 0,
        comments: post.commentsCount || 0,
        saves: post.savesCount || 0,
        shares: post.sharesCount || 0,
      }
    }));

    console.log('Successfully transformed data:', transformedData.length, 'posts');

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
