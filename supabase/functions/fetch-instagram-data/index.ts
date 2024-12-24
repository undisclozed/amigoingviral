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

    // Use the run-sync endpoint for immediate results
    const apifyUrl = `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/run-sync?token=${Deno.env.get('APIFY_API_KEY')}`
    
    console.log('Calling Apify API with run-sync endpoint...')
    const apifyResponse = await fetch(apifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "username": [cleanUsername], // Changed to array format
        "resultsLimit": 25,
        "reelsDownload": false,
        "proxy": {
          "useApifyProxy": true,
          "apifyProxyGroups": ["RESIDENTIAL"]
        },
        "scrapePostsUntilDate": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
        "maxRequestRetries": 3
      })
    });

    if (!apifyResponse.ok) {
      const errorText = await apifyResponse.text();
      console.error('Apify API error:', errorText);
      throw new Error(`Apify API returned status ${apifyResponse.status}: ${errorText}`);
    }

    const data = await apifyResponse.json();
    console.log('Apify data received:', data);

    if (!Array.isArray(data)) {
      console.error('Invalid data format received:', data);
      throw new Error('Invalid data format received from Apify');
    }

    // Transform the data to match our expected format
    const transformedPosts = data.map(post => ({
      id: post.id || `${post.timestamp}-${Math.random()}`,
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
        engagement: ((post.likesCount + post.commentsCount) / (post.videoViewCount || 1)) || 0,
        followsFromPost: post.followsCount || 0,
        averageWatchPercentage: post.averageWatchPercentage || 0
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