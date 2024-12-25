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
    const { username, userId } = await req.json();
    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!username) {
      throw new Error('Username is required');
    }

    console.log('Starting fetch for:', { username, userId });

    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    // If userId is not provided, try to find the profile by instagram_account
    let profile;
    if (userId) {
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, instagram_account')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile by userId:', profileError);
        throw new Error('Failed to fetch profile by userId');
      }
      profile = userProfile;
    } else {
      const { data: accountProfile, error: accountProfileError } = await supabase
        .from('profiles')
        .select('id, instagram_account')
        .eq('instagram_account', username)
        .single();

      if (accountProfileError) {
        console.error('Error fetching profile by instagram_account:', accountProfileError);
        throw new Error('Failed to fetch profile by instagram_account');
      }
      profile = accountProfile;
    }

    if (!profile) {
      console.error('No profile found for:', { userId, username });
      throw new Error('Profile not found');
    }

    console.log('Found profile:', profile);

    const response = await fetch('https://api.apify.com/v2/acts/apify~instagram-reel-scraper/run-sync-get-dataset-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIFY_API_KEY}`,
      },
      body: JSON.stringify({
        "username": [username],
        "resultsLimit": 10,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Apify API error:', errorText);
      throw new Error(`Apify API returned status ${response.status}`);
    }

    const rawData = await response.json();
    console.log('Raw response from Apify:', JSON.stringify(rawData).substring(0, 500) + '...');

    const transformedData = await Promise.all(rawData.map(async (reel: any) => {
      const uniqueReelId = `${profile.id}_${reel.id}`;
      
      const reelData = {
        user_id: profile.id,
        instagram_account: username,
        reel_id: uniqueReelId,
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

      // Upsert the reel data
      const { error: upsertError } = await supabase
        .from('instagram_reels')
        .upsert(reelData, {
          onConflict: 'reel_id',
          ignoreDuplicates: false
        });

      if (upsertError) {
        console.error('Error upserting reel:', upsertError);
        throw upsertError;
      }

      // Insert historical metrics
      const historicalMetrics = {
        reel_id: uniqueReelId,
        user_id: profile.id,
        views_count: reel.playsCount || reel.videoPlayCount || 0,
        likes_count: reel.likesCount || 0,
        comments_count: reel.commentsCount || 0,
      };

      const { error: historyError } = await supabase
        .from('reel_metrics_history')
        .insert(historicalMetrics);

      if (historyError) {
        console.error('Error inserting historical metrics:', historyError);
        throw historyError;
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