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

    const apifyUrl = `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync?token=${Deno.env.get('APIFY_API_KEY')}`
    
    console.log('Calling Apify API...')
    const apifyResponse = await fetch(apifyUrl, {
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
              url: post.url,
              commentsCount: post.commentsCount,
              likesCount: post.likesCount,
              videoViewCount: post.videoViewCount,
              type: post.type
            }))
          }
        }`
      })
    });

    if (!apifyResponse.ok) {
      const errorText = await apifyResponse.text();
      console.error('Apify API error response:', errorText);
      throw new Error(`Apify API returned status ${apifyResponse.status}: ${errorText}`);
    }

    const responseText = await apifyResponse.text();
    console.log('Raw Apify response:', responseText);

    let data;
    try {
      if (!responseText.trim()) {
        throw new Error('Empty response received from Apify');
      }
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('JSON parse error:', error);
      console.error('Response that failed to parse:', responseText);
      throw new Error('Failed to parse Apify response as JSON');
    }

    // Transform the data to match our expected format
    const transformedPosts = data.posts.map(post => ({
      id: post.id,
      username: cleanUsername,
      thumbnail: post.url,
      caption: post.caption || '',
      timestamp: post.timestamp,
      metrics: {
        views: post.videoViewCount || 0,
        likes: post.likesCount || 0,
        comments: post.commentsCount || 0,
        shares: 0, // Not available in basic scraper
        saves: 0, // Not available in basic scraper
        engagement: ((post.likesCount + post.commentsCount) / 1000) || 0, // Basic engagement calculation
        followsFromPost: 0, // Not available in basic scraper
        averageWatchPercentage: 0 // Not available in basic scraper
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