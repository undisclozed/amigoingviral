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

    if (!APIFY_API_KEY) {
      throw new Error('APIFY_API_KEY is not configured');
    }

    console.log('Starting fetch for:', { username, userId });

    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!
    );

    let profile;
    
    try {
      // First check if this is the user's own profile
      if (userId) {
        console.log('Checking user profile first:', userId);
        const { data: userProfile, error: userProfileError } = await supabase
          .from('profiles')
          .select('id, instagram_account')
          .eq('id', userId)
          .maybeSingle();

        if (userProfileError) {
          console.error('Error checking user profile:', userProfileError);
          throw userProfileError;
        }

        if (userProfile) {
          console.log('Found user profile:', userProfile);
          // If this is the user's profile, update it with the Instagram account if needed
          if (userProfile.instagram_account !== username) {
            const { data: updatedProfile, error: updateError } = await supabase
              .from('profiles')
              .update({ instagram_account: username })
              .eq('id', userId)
              .select()
              .single();

            if (updateError) {
              console.error('Error updating user profile:', updateError);
              throw updateError;
            }
            profile = updatedProfile;
          } else {
            profile = userProfile;
          }
        }
      }

      // If we haven't found a profile yet, check for existing profile by instagram account
      if (!profile) {
        console.log('Checking for existing profile with instagram account:', username);
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('id, instagram_account')
          .eq('instagram_account', username)
          .maybeSingle();

        if (profileError) {
          console.error('Error checking existing profile:', profileError);
          throw profileError;
        }

        if (existingProfile) {
          console.log('Found existing profile:', existingProfile);
          profile = existingProfile;
        } else {
          console.log('Creating new profile for instagram account:', username);
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ instagram_account: username }])
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            throw createError;
          }

          console.log('Created new profile:', newProfile);
          profile = newProfile;
        }
      }
    } catch (error) {
      console.error('Error in profile management:', error);
      throw new Error(`Failed to check existing profile: ${error.message}`);
    }

    if (!profile) {
      throw new Error('Profile not found and could not be created');
    }

    console.log('Making request to Apify API...');

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

    if (!Array.isArray(rawData)) {
      console.error('Unexpected response format from Apify:', rawData);
      throw new Error('Invalid response format from Apify');
    }

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

      console.log('Inserting reel data:', reelData);

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

      const historicalMetrics = {
        reel_id: uniqueReelId,
        user_id: profile.id,
        views_count: reel.playsCount || reel.videoPlayCount || 0,
        likes_count: reel.likesCount || 0,
        comments_count: reel.commentsCount || 0,
      };

      console.log('Inserting historical metrics:', historicalMetrics);

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