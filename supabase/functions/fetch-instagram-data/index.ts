import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { username } = await req.json();

  const apiKey = Deno.env.get('APIFY_API_KEY');
  const actorId = 'apify/instagram-reel-scraper';
  const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiKey}`;

  const input = {
    username: [username],
    resultsLimit: 20
  };

  const response = await fetch(apifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });

  const runResult = await response.json();
  const datasetResponse = await fetch(
    `https://api.apify.com/v2/datasets/${runResult.defaultDatasetId}/items?token=${apiKey}`
  );

  const dataset = await datasetResponse.json();

  return new Response(JSON.stringify(dataset), {
    headers: {
      'Content-Type': 'application/json',
    }
  });
});
