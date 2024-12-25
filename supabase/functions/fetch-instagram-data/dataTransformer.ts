import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export class DataTransformer {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async transformAndSaveReels(rawData: any[], profile: any, username: string): Promise<any[]> {
    return await Promise.all(rawData.map(async (reel: any) => {
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

      const historicalMetrics = {
        reel_id: uniqueReelId,
        user_id: profile.id,
        views_count: reel.playsCount || reel.videoPlayCount || 0,
        likes_count: reel.likesCount || 0,
        comments_count: reel.commentsCount || 0,
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