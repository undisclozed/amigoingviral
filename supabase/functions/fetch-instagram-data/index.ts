import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, maxPosts, userId } = await req.json();
    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!username) {
      throw new Error('Username is required');
    }

    console.log('Fetching reels for:', username, 'max posts:', maxPosts);

    // Create Supabase client with service role key for database operations
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get the user_id either from the request or find it in profiles
    let profileId = userId;
    if (!profileId) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('instagram_account', username)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw new Error('Failed to find profile');
      }
      
      if (!profile) {
        throw new Error('Profile not found. Please ensure your profile is set up with your Instagram account.');
      }

      profileId = profile.id;
    }

    console.log('Found profile ID:', profileId);

    const response = await fetch('https://api.apify.com/v2/acts/apify~instagram-reel-scraper/run-sync-get-dataset-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIFY_API_KEY}`,
      },
      body: JSON.stringify({
        "username": [username],
        "resultsLimit": maxPosts || 10,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Apify API error:', errorText);
      throw new Error(`Apify API returned status ${response.status}: ${errorText}`);
    }

    const rawData = await response.json();
    console.log('Raw response from Apify:', JSON.stringify(rawData).substring(0, 500) + '...');

    // Transform and save each reel
    const transformedData = await Promise.all(rawData.map(async (reel: any) => {
      // Create a unique composite ID using user ID and reel ID
      const uniqueReelId = `${profileId}_${reel.id}`;
      
      const reelData = {
        user_id: profileId,
        instagram_account: username,
        reel_id: uniqueReelId, // Use the composite ID
        caption: reel.caption || '',
        url: reel.url,
        thumbnail_url: reel.previewImageUrl || reel.displayUrl,
        timestamp: reel.timestamp,
        video_duration: reel.videoDuration,
        comments_count: reel.commentsCount || 0,
        likes_count: reel.likesCount || 0,
        views_count: reel.playsCount || reel.videoPlayCount || 0,
        is_sponsored: reel.isSponsored || false
      };

      // Upsert the reel data using the composite ID
      const { error: upsertError } = await supabase
        .from('instagram_reels')
        .upsert(reelData, {
          onConflict: 'instagram_account,reel_id',
          ignoreDuplicates: false // This ensures we update existing records
        });

      if (upsertError) {
        console.error('Error upserting reel:', upsertError);
        throw upsertError;
      }

      return reelData;
    }));

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