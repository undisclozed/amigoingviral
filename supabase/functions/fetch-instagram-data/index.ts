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

    const actorId = 'apify/instagram-profile-scraper';
    const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiKey}`;
    
    const input = {
      usernames: [username],
      resultsLimit: 30,
      scrapePosts: true,
      scrapeStories: true,
      scrapeHighlights: true,
    };

    console.log('Starting Apify actor run with input:', JSON.stringify(input));

    // Start the actor run
    const runResponse = await fetch(apifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });

    const runResult = await runResponse.json();
    console.log('Actor run started:', JSON.stringify(runResult));

    if (!runResult.id) {
      throw new Error('Failed to start actor run');
    }

    // Poll for run completion
    const maxAttempts = 30; // 30 seconds timeout
    let attempts = 0;
    let runStatus;

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(
        `https://api.apify.com/v2/acts/${actorId}/runs/${runResult.id}?token=${apiKey}`
      );
      runStatus = await statusResponse.json();
      console.log(`Run status (attempt ${attempts + 1}):`, runStatus.status);

      if (runStatus.status === 'SUCCEEDED') {
        break;
      } else if (runStatus.status === 'FAILED' || runStatus.status === 'ABORTED') {
        throw new Error(`Actor run ${runStatus.status}`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Actor run timed out');
    }

    if (!runStatus.defaultDatasetId) {
      throw new Error('Actor run completed, but no dataset was created');
    }

    console.log('Fetching dataset:', runStatus.defaultDatasetId);
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/datasets/${runStatus.defaultDatasetId}/items?token=${apiKey}`
    );
    const dataset = await datasetResponse.json();
    console.log('Dataset fetched, items count:', dataset.length);

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