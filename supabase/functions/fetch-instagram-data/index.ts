import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { username } = await req.json()
    console.log('Starting Instagram data fetch for username:', username)

    if (!username) {
      throw new Error('Username is required')
    }

    // Clean up username (remove @ if present)
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username

    const apifyUrl = `https://api.apify.com/v2/acts/apify~instagram-scraper/runs?token=${Deno.env.get('APIFY_API_KEY')}`
    
    console.log('Starting Apify run...')
    const startRun = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "usernames": [cleanUsername],
        "resultsLimit": 25,
        "resultsType": "posts",
        "extendOutputFunction": `($) => {
          return {
            posts: $.posts.map(post => ({
              id: post.id,
              caption: post.caption,
              timestamp: post.timestamp,
              url: post.url || post.displayUrl,
              commentsCount: post.commentsCount,
              likesCount: post.likesCount,
              videoViewCount: post.videoViewCount,
              type: post.type
            }))
          }
        }`
      })
    });

    if (!startRun.ok) {
      const errorText = await startRun.text();
      console.error('Apify start run error:', errorText);
      throw new Error(`Failed to start Apify run: ${startRun.status}`);
    }

    const runData = await startRun.json();
    console.log('Run started with ID:', runData.data.id);

    // Wait for the run to finish (poll every 2 seconds)
    const maxAttempts = 30; // 1 minute maximum wait
    let attempts = 0;
    let dataset = null;

    while (attempts < maxAttempts) {
      console.log(`Checking run status (attempt ${attempts + 1}/${maxAttempts})...`);
      
      const statusCheck = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-scraper/runs/${runData.data.id}?token=${Deno.env.get('APIFY_API_KEY')}`
      );
      
      if (!statusCheck.ok) {
        console.error('Status check failed:', await statusCheck.text());
        continue;
      }

      const status = await statusCheck.json();
      console.log('Run status:', status.data.status);

      if (status.data.status === 'SUCCEEDED') {
        // Get the dataset items
        const datasetUrl = `https://api.apify.com/v2/acts/apify~instagram-scraper/runs/${runData.data.id}/dataset/items?token=${Deno.env.get('APIFY_API_KEY')}`;
        const datasetResponse = await fetch(datasetUrl);
        
        if (!datasetResponse.ok) {
          throw new Error('Failed to fetch dataset');
        }

        dataset = await datasetResponse.json();
        break;
      } else if (status.data.status === 'FAILED') {
        throw new Error('Apify run failed');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    if (!dataset) {
      throw new Error('Timeout waiting for Apify run to complete');
    }

    console.log('Successfully retrieved dataset');

    // Transform the data to match our expected format
    const transformedPosts = dataset[0].posts.map(post => ({
      id: post.id,
      username: cleanUsername,
      thumbnail: post.url || post.displayUrl,
      caption: post.caption || '',
      timestamp: post.timestamp,
      metrics: {
        views: post.videoViewCount || 0,
        likes: post.likesCount || 0,
        comments: post.commentsCount || 0,
        shares: 0,
        saves: 0,
        engagement: ((post.likesCount + post.commentsCount) / 1000) || 0,
        followsFromPost: 0,
        averageWatchPercentage: 0
      }
    }));

    console.log(`Successfully transformed ${transformedPosts.length} posts for ${cleanUsername}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: transformedPosts,
        message: 'Instagram data fetched successfully'
      }),
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
        success: false,
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