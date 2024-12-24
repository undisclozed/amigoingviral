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

    // For now, return consistent mock data for testing
    const mockPosts = Array.from({ length: 5 }).map((_, index) => ({
      id: `post-${index + 1}`,
      username: cleanUsername,
      thumbnail: `https://picsum.photos/400/400?random=${index + 1}`,
      caption: `Example post ${index + 1} with some engaging content #instagram #social #creator`,
      timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
      type: 'image',
      metrics: {
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 1000) + 100,
        comments: Math.floor(Math.random() * 100) + 10,
        shares: Math.floor(Math.random() * 50) + 5,
        saves: Math.floor(Math.random() * 200) + 20,
        engagement: (Math.random() * 5 + 1).toFixed(2),
        followsFromPost: Math.floor(Math.random() * 20) + 1,
        averageWatchPercentage: Math.floor(Math.random() * 30) + 70
      }
    }));

    console.log(`Generated ${mockPosts.length} mock posts for testing`);

    return new Response(
      JSON.stringify({
        success: true,
        data: mockPosts,
        message: 'Mock data for testing'
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