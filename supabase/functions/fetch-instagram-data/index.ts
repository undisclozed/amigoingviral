import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    console.log('Starting Instagram data fetch for username:', username)

    if (!username) {
      throw new Error('Username is required')
    }

    // Clean up username (remove @ if present)
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username

    // Start the Apify actor run
    const apifyUrl = `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs?token=${Deno.env.get('APIFY_API_KEY')}`
    
    console.log('Calling Apify API...')
    const apifyResponse = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": cleanUsername,
        "resultsLimit": 25,
        "reelsDownload": false,
        "proxy": {
          "useApifyProxy": true
        }
      })
    });

    if (!apifyResponse.ok) {
      console.error('Apify API error:', await apifyResponse.text());
      throw new Error('Failed to fetch Instagram data from Apify');
    }

    const runData = await apifyResponse.json();
    console.log('Apify run started:', runData);

    // Wait for the run to finish and get results
    const datasetId = runData.data.defaultDatasetId;
    const maxAttempts = 10;
    let attempts = 0;
    let posts = [];

    while (attempts < maxAttempts) {
      console.log(`Attempt ${attempts + 1} to fetch dataset...`);
      const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${Deno.env.get('APIFY_API_KEY')}`;
      const datasetResponse = await fetch(datasetUrl);
      
      if (!datasetResponse.ok) {
        console.error('Dataset fetch error:', await datasetResponse.text());
        throw new Error('Failed to fetch dataset');
      }

      posts = await datasetResponse.json();
      console.log(`Found ${posts.length} posts`);
      
      if (posts.length > 0) {
        break;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds between attempts
    }

    // Transform the data to match our expected format
    const transformedPosts = posts.map(post => ({
      id: post.id,
      username: cleanUsername,
      thumbnail: post.previewUrl || post.displayUrl,
      caption: post.caption || '',
      timestamp: post.timestamp,
      metrics: {
        views: post.videoViewCount || 0,
        likes: post.likesCount || 0,
        comments: post.commentsCount || 0,
        shares: post.sharesCount || 0,
        saves: post.savesCount || 0,
        engagement: ((post.likesCount + post.commentsCount) / (post.videoViewCount || 1) * 100) || 0,
        followsFromPost: post.followsCount || 0,
        averageWatchPercentage: post.averageWatchPercentage || 0
      }
    }));

    console.log(`Successfully transformed ${transformedPosts.length} posts`);

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