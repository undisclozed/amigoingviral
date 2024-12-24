import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY')

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

    // Clean up username (remove @ if present)
    const cleanUsername = username.startsWith('@') ? username.slice(1) : username
    console.log('Cleaned username:', cleanUsername)

    // Start the Apify actor run
    const startResponse = await fetch(
      'https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs?token=' + APIFY_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "username": cleanUsername,
          "maxPosts": 100,
          "resultsLimit": 100,
          "resultsType": "posts",
          "searchType": "user",
          "proxy": {
            "useApifyProxy": true
          }
        })
      }
    )

    if (!startResponse.ok) {
      const errorText = await startResponse.text()
      console.error('Failed to start Apify actor:', errorText)
      throw new Error(`Failed to start Apify actor: ${errorText}`)
    }

    const startData = await startResponse.json()
    const runId = startData.data.id
    console.log('Apify run started with ID:', runId)

    // Wait for the run to finish (with timeout)
    let attempts = 0
    const maxAttempts = 30 // 5 minutes maximum wait time
    let dataset = null

    while (attempts < maxAttempts) {
      console.log(`Checking run status (attempt ${attempts + 1}/${maxAttempts})`)
      const statusResponse = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs/${runId}?token=${APIFY_API_KEY}`
      )
      
      if (!statusResponse.ok) {
        const errorText = await statusResponse.text()
        console.error('Failed to check run status:', errorText)
        throw new Error('Failed to check run status')
      }

      const statusData = await statusResponse.json()
      const status = statusData.data.status
      console.log('Run status:', status)

      if (status === 'SUCCEEDED') {
        // Fetch the results
        console.log('Run succeeded, fetching results')
        const datasetResponse = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs/${runId}/dataset/items?token=${APIFY_API_KEY}`
        )
        
        if (!datasetResponse.ok) {
          const errorText = await datasetResponse.text()
          console.error('Failed to fetch dataset:', errorText)
          throw new Error('Failed to fetch dataset')
        }

        dataset = await datasetResponse.json()
        console.log(`Successfully fetched ${dataset.length} posts`)
        break
      } else if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
        throw new Error(`Run failed with status: ${status}`)
      }

      await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds before next check
      attempts++
    }

    if (!dataset) {
      throw new Error('Timeout waiting for results')
    }

    return new Response(
      JSON.stringify({ data: dataset }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in fetch-instagram-data function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the function logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})