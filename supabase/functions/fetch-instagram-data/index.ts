import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from './cors.ts'
import { fetchProfileData } from './profileScraper.ts'
import { fetchRecentPosts } from './postScraper.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { username } = await req.json()
    
    if (!username) {
      throw new Error('Username is required')
    }

    console.log('Fetching data for Instagram username:', username)

    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set')
    }

    // Fetch profile data
    const profileData = await fetchProfileData(username, apiKey)
    
    // Fetch recent posts
    const postsData = await fetchRecentPosts(username, apiKey)

    return new Response(
      JSON.stringify({
        success: true,
        profile: profileData,
        posts: postsData
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
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