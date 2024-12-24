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
    console.log('Fetching Instagram data for username:', username)

    // Start the Apify actor run
    const startResponse = await fetch(
      'https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs?token=' + APIFY_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "username": username,
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
      console.error('Failed to start Apify actor:', await startResponse.text())
      throw new Error('Failed to start Apify actor')
    }

    const { data: { id: runId } } = await startResponse.json()
    console.log('Apify run started with ID:', runId)

    // Wait for the run to finish (with timeout)
    let attempts = 0
    const maxAttempts = 30 // 5 minutes maximum wait time
    let dataset = null

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs/${runId}?token=${APIFY_API_KEY}`
      )
      
      if (!statusResponse.ok) {
        console.error('Failed to check run status:', await statusResponse.text())
        throw new Error('Failed to check run status')
      }

      const { data: { status } } = await statusResponse.json()
      console.log('Run status:', status)

      if (status === 'SUCCEEDED') {
        // Fetch the results
        const datasetResponse = await fetch(
          `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs/${runId}/dataset/items?token=${APIFY_API_KEY}`
        )
        
        if (!datasetResponse.ok) {
          console.error('Failed to fetch dataset:', await datasetResponse.text())
          throw new Error('Failed to fetch dataset')
        }

        dataset = await datasetResponse.json()
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
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})