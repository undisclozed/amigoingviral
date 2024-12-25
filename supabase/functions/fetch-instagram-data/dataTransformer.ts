import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export class DataTransformer {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async transformAndSaveReels(rawData: any[], profile: any, username: string): Promise<any[]> {
    return await Promise.all(rawData.map(async (reel: any) => {
      const uniqueReelId = `${profile.id}_${reel.id}`;
      
      // Ensure we have a valid timestamp, fallback to current time if not provided
      const timestamp = reel.timestamp ? new Date(reel.timestamp) : new Date();
      
      // Transform the reel data with additional fields
      const reelData = {
        user_id: profile.id,
        instagram_account: username,
        reel_id: uniqueReelId,
        caption: reel.caption || '',
        url: reel.url,
        thumbnail_url: reel.previewImageUrl || reel.displayUrl,
        timestamp: timestamp.toISOString(), // Ensure we're storing as ISO string
        video_duration: reel.videoDuration,
        comments_count: reel.commentsCount || 0,
        likes_count: reel.likesCount || 0,
        views_count: reel.videoViewCount || reel.playsCount || 0, // Try videoViewCount first, fallback to playsCount
        is_sponsored: reel.isSponsored || false,
        shares_count: reel.sharesCount || 0,
        saves_count: reel.savesCount || 0,
        hashtags: reel.hashtags || [],
        mentions: reel.mentions || [],
        music_info: reel.musicInfo || null,
        location_info: reel.locationInfo || null
      };

      console.log('Transformed reel data:', reelData);

      // First, update the instagram_reels table
      const { error: upsertError } = await this.supabase
        .from('instagram_reels')
        .upsert(reelData, {
          onConflict: 'reel_id',
          ignoreDuplicates: false
        });

      if (upsertError) {
        console.error('Error upserting reel:', upsertError);
        throw upsertError;
      }

      // Then, save the metrics history
      const historicalMetrics = {
        reel_id: uniqueReelId,
        user_id: profile.id,
        views_count: reelData.views_count,
        likes_count: reelData.likes_count,
        comments_count: reelData.comments_count,
        shares_count: reelData.shares_count,
        saves_count: reelData.saves_count,
        timestamp: timestamp.toISOString() // Use the same timestamp for consistency
      };

      console.log('Inserting historical metrics:', historicalMetrics);

      const { error: historyError } = await this.supabase
        .from('reel_metrics_history')
        .insert(historicalMetrics);

      if (historyError) {
        console.error('Error inserting historical metrics:', historyError);
        throw historyError;
      }

      return reelData;
    }));
  }
}