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
    const apifyUrl = `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/run-sync?token=${Deno.env.get('APIFY_API_KEY')}`
    
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

    const data = await apifyResponse.json();
    console.log('Apify data received:', data);

    // Transform the data to match our expected format
    const transformedPosts = data.map(post => ({
      id: post.id,
      username: cleanUsername,
      thumbnail: post.previewUrl || post.displayUrl,
      caption: post.caption || '',
      timestamp: post.timestamp,
      type: post.type,
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

    console.log(`Transformed ${transformedPosts.length} posts for ${cleanUsername}`);

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