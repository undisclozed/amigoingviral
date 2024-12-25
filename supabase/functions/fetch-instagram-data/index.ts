import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();
    if (!username) {
      throw new Error('Username is required');
    }

    console.log('Fetching Instagram Reels for:', username);
    
    // Get Apify API Key from environment
    const apiKey = Deno.env.get('APIFY_API_KEY');
    if (!apiKey) {
      throw new Error('APIFY_API_KEY is not set');
    }

    // Instagram Reel Scraper actor ID
    const actorId = 'apify/instagram-reel-scraper';
    const apifyUrl = `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiKey}`;

    // Payload with username as an array
    const input = {
      username: [username],  // Pass username as an array
      resultsLimit: 20,
      proxy: 
