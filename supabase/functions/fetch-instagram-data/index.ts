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
    
    if (!username) {
      throw new Error('Username is required')
    }

    console.log('Fetching data for Instagram username:', username)

    // Start profile scraper run
    const profileRunResponse = await fetch(
      'https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token=' + Deno.env.get('APIFY_API_KEY'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "startUrls": [{ "url": `https://www.instagram.com/${username}/` }],
          "resultsLimit": 1
        })
      }
    )

    if (!profileRunResponse.ok) {
      throw new Error('Failed to start profile scraper')
    }

    const profileRunData = await profileRunResponse.json()
    console.log('Profile scraper started with run ID:', profileRunData.data.id)

    // Poll for profile data completion
    let profileData = null
    const maxAttempts = 24 // 2 minutes maximum wait
    let attempts = 0

    while (attempts < maxAttempts) {
      console.log(`Checking profile run status (attempt ${attempts + 1}/${maxAttempts})...`)
      
      const statusCheck = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs/${profileRunData.data.id}?token=${Deno.env.get('APIFY_API_KEY')}`
      )
      
      if (!statusCheck.ok) {
        console.error('Profile status check failed:', await statusCheck.text())
        attempts++
        await new Promise(resolve => setTimeout(resolve, 5000))
        continue
      }

      const status = await statusCheck.json()
      console.log('Profile run status:', status.data.status)

      if (status.data.status === 'SUCCEEDED') {
        const datasetResponse = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs/${profileRunData.data.id}/dataset/items?token=${Deno.env.get('APIFY_API_KEY')}`
        )
        
        if (!datasetResponse.ok) {
          throw new Error('Failed to fetch profile dataset')
        }

        const datasetText = await datasetResponse.text()
        try {
          profileData = JSON.parse(datasetText)
          break
        } catch (error) {
          console.error('Failed to parse profile dataset:', error)
          throw new Error('Failed to parse profile dataset')
        }
      } else if (status.data.status === 'FAILED' || status.data.status === 'ABORTED') {
        throw new Error(`Profile scraper run ${status.data.status.toLowerCase()}`)
      }

      attempts++
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    if (!profileData || !Array.isArray(profileData) || profileData.length === 0) {
      throw new Error('No profile data returned')
    }

    // Start post scraper for recent posts
    const postRunResponse = await fetch(
      'https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs?token=' + Deno.env.get('APIFY_API_KEY'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "username": username,
          "maxPosts": 3
        })
      }
    )

    if (!postRunResponse.ok) {
      throw new Error('Failed to start post scraper')
    }

    const postRunData = await postRunResponse.json()
    console.log('Post scraper started with run ID:', postRunData.data.id)

    // Poll for post data completion
    let postData = null
    attempts = 0

    while (attempts < maxAttempts) {
      console.log(`Checking post run status (attempt ${attempts + 1}/${maxAttempts})...`)
      
      const statusCheck = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs/${postRunData.data.id}?token=${Deno.env.get('APIFY_API_KEY')}`
      )
      
      if (!statusCheck.ok) {
        console.error('Post status check failed:', await statusCheck.text())
        attempts++
        await new Promise(resolve => setTimeout(resolve, 5000))
        continue
      }

      const status = await statusCheck.json()
      console.log('Post run status:', status.data.status)

      if (status.data.status === 'SUCCEEDED') {
        const datasetResponse = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs/${postRunData.data.id}/dataset/items?token=${Deno.env.get('APIFY_API_KEY')}`
        )
        
        if (!datasetResponse.ok) {
          throw new Error('Failed to fetch post dataset')
        }

        const datasetText = await datasetResponse.text()
        try {
          postData = JSON.parse(datasetText)
          break
        } catch (error) {
          console.error('Failed to parse post dataset:', error)
          throw new Error('Failed to parse post dataset')
        }
      } else if (status.data.status === 'FAILED' || status.data.status === 'ABORTED') {
        throw new Error(`Post scraper run ${status.data.status.toLowerCase()}`)
      }

      attempts++
      await new Promise(resolve => setTimeout(resolve, 5000))
    }

    if (!postData || !Array.isArray(postData) || postData.length === 0) {
      throw new Error('No post data returned')
    }

    return new Response(
      JSON.stringify({
        success: true,
        profile: profileData[0],
        posts: postData.slice(0, 3)
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