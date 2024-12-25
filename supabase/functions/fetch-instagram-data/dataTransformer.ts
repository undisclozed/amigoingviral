import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export class DataTransformer {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async transformAndSaveReels(rawData: any[], profile: any, username: string): Promise<any[]> {
    console.log('Raw data received:', JSON.stringify(rawData[0], null, 2));
    
    return await Promise.all(rawData.map(async (reel: any) => {
      console.log('Processing reel:', JSON.stringify(reel, null, 2));
      
      const uniqueReelId = `${profile.id}_${reel.id}`;
      
      // Ensure we have a valid timestamp, fallback to current time if not provided
      const timestamp = reel.timestamp ? new Date(reel.timestamp) : new Date();

      // Map duration with the same logic as ApifyClient
      const videoDuration = 
        reel.videoDuration || 
        (reel.videoInfo && reel.videoInfo.duration) ||
        reel.video_duration ||
        (reel.video_versions && reel.video_versions[0] && reel.video_versions[0].duration) ||
        (reel.video_metadata && reel.video_metadata.duration_in_seconds) ||
        (reel.videoData && reel.videoData.duration) ||
        (reel.mediaInfo && reel.mediaInfo.video_duration) ||
        (reel.video_duration_in_ms ? reel.video_duration_in_ms / 1000 : null);

      // Map shares and saves with the same logic as ApifyClient
      const sharesCount = 
        reel.sharesCount || 
        reel.shares_count || 
        reel.shareCount || 
        reel.share_count || 
        0;

      const savesCount = 
        reel.savesCount || 
        reel.saves_count || 
        reel.saveCount || 
        reel.save_count || 
        0;
      
      // Transform the reel data with additional fields
      const reelData = {
        user_id: profile.id,
        instagram_account: username,
        reel_id: uniqueReelId,
        caption: reel.caption || '',
        url: reel.url || '',
        thumbnail_url: reel.thumbnailUrl || reel.displayUrl || '',
        timestamp: timestamp.toISOString(),
        video_duration: videoDuration,
        comments_count: reel.commentsCount || 0,
        likes_count: reel.likesCount || 0,
        views_count: reel.videoViewCount || reel.videoPlayCount || reel.viewsCount || 0,
        is_sponsored: reel.isSponsored || false,
        shares_count: sharesCount,
        saves_count: savesCount,
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
        timestamp: timestamp.toISOString()
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