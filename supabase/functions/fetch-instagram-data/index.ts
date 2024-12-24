import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import ApifyClient from 'https://esm.sh/apify-client@2.8.4';

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
    console.log('Apify API Key Loaded');

    // Initialize Apify client (Fixed Initialization)
    const client = new ApifyClient(apiKey);

    // Input configuration for the scraper
    const input = {
      usernames: [username],
      resultsLimit: 30,
      scrapePosts: true,
      scrapeStories: true,
      scrapeHighlights: true,
      scrapeFollowers: false,
      scrapeFollowing: false,
      proxy: { useApifyProxy: true }
    };
    console.log('Apify Scraper Input:', JSON.stringify(input, null, 2));

    // Start the Apify actor (Instagram Profile Scraper)
    const run = await client.actor("apify/instagram-profile-scraper").call(input);
    console.log('Actor Run Response:', JSON.stringify(run, null, 2));

    // Ensure the scraper run produces a dataset
    if (!run.defaultDatasetId) {
      throw new Error('Actor run completed, but no dataset was created.');
    }

    // Retrieve the results from the dataset
    const dataset = await client.dataset(run.defaultDatasetId).listItems();
    console.log('Fetched Dataset:', JSON.stringify(dataset, null, 2));

    // Transform dataset items into a consumable format
    const transformedData = dataset.items.map((post: any) => ({
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
