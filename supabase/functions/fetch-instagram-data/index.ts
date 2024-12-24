import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Apify } from 'https://esm.sh/apify-client@2.8.4';

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
    const { username, debug } = await req.json();
    if (!username) {
      throw new Error('Username is required');
    }

    console.log('Fetching Instagram data for:', username);
    
    const apiKey = Deno.env.get('APIFY_API_KEY');
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set');
    }
    console.log('Using Apify API Key (partial):', apiKey.substring(0, 5) + '*****');

    const client = new Apify({ token: apiKey });

    const input = {
      "usernames": [username],
      "resultsLimit": 30,
      "scrapePosts": true,
      "scrapeStories": true,
      "scrapeFollowers": true,
      "scrapeFollowing": true,
      "proxy": { "useApifyProxy": true }
    };
    
    let run;
    try {
      run = await client.actor("apify/instagram-profile-scraper").call(input);
      console.log('Actor Run Response:', JSON.stringify(run, null, 2));

      if (run.status !== 'SUCCEEDED') {
        throw new Error(`Actor failed with status: ${run.status}`);
      }
    } catch (error) {
      console.error('Apify Actor Call Failed:', error.message || error);
      throw new Error('Failed to run Apify scraper.');
    }

    let dataset = { items: [] };
    try {
      if (run.defaultDatasetId) {
        dataset = await client.dataset(run.defaultDatasetId).listItems();
        console.log('Fetched Dataset:', JSON.stringify(dataset, null, 2));
      } else {
        console.warn('No dataset found.');
      }
    } catch (error) {
      console.warn('Dataset fetch failed.');
    }

    const transformedData = dataset.items.map((post: any) => ({
      id: post.id || `temp-${Date.now()}`,
      username: post.ownerUsername || username,
      thumbnail: post.displayUrl || '',
      caption: post.caption || '',
      timestamp: post.timestamp || new Date().toISOString(),
    }));

    return new Response(JSON.stringify({ data: transformedData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
