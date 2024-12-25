import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ProfileManager } from "./profileManager.ts";
import { ApifyClient } from "./apifyClient.ts";
import { DataTransformer } from "./dataTransformer.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, userId, maxPosts = 10 } = await req.json();
    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!username) {
      throw new Error('Username is required');
    }

    if (!APIFY_API_KEY) {
      throw new Error('APIFY_API_KEY is not configured');
    }

    console.log('Starting fetch for:', { username, userId, maxPosts });

    // Initialize our service classes
    const profileManager = new ProfileManager(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const apifyClient = new ApifyClient(APIFY_API_KEY);
    const dataTransformer = new DataTransformer(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Find or create the profile
    const profile = await profileManager.findOrCreateProfile(username, userId);

    if (!profile) {
      throw new Error('Profile not found and could not be created');
    }

    // Fetch reels data from Apify with the specified limit
    const rawData = await apifyClient.fetchReelsData(username, parseInt(maxPosts));

    // Transform and save the data
    const transformedData = await dataTransformer.transformAndSaveReels(rawData, profile, username);

    console.log(`Successfully processed ${transformedData.length} reels`);

    return new Response(JSON.stringify({ data: transformedData }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        details: 'Check Supabase logs for more information' 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});