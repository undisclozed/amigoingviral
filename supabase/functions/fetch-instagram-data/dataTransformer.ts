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
      const timestamp = reel.timestamp ? new Date(reel.timestamp) : new Date();

      // Enhanced thumbnail URL handling
      const thumbnailUrl = 
        reel.thumbnailUrl || 
        reel.displayUrl || 
        reel.thumbnail_url || 
        reel.display_url || 
        reel.mediaUrl ||
        '';

      console.log('Thumbnail URL mapping:', {
        thumbnailUrl,
        originalThumbnailUrl: reel.thumbnailUrl,
        displayUrl: reel.displayUrl,
        mediaUrl: reel.mediaUrl
      });

      // Enhanced duration mapping
      const videoDuration = 
        reel.videoDuration || 
        (reel.videoInfo && reel.videoInfo.duration) ||
        reel.video_duration ||
        (reel.video_versions && reel.video_versions[0] && reel.video_versions[0].duration) ||
        (reel.video_metadata && reel.video_metadata.duration_in_seconds) ||
        (reel.videoData && reel.videoData.duration) ||
        (reel.mediaInfo && reel.mediaInfo.video_duration) ||
        (reel.video_duration_in_ms ? reel.video_duration_in_ms / 1000 : null);

      // Enhanced engagement metrics mapping
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

      const viewsCount = 
        reel.videoViewCount || 
        reel.videoPlayCount || 
        reel.viewsCount || 
        reel.views_count || 
        0;

      // Calculate engagement rate
      const totalEngagements = (reel.likesCount || 0) + (reel.commentsCount || 0) + savesCount + sharesCount;
      const engagementRate = viewsCount > 0 ? (totalEngagements / viewsCount) * 100 : 0;
      
      // Transform the reel data with all available fields
      const reelData = {
        user_id: profile.id,
        instagram_account: username,
        reel_id: uniqueReelId,
        caption: reel.caption || '',
        url: reel.url || `https://www.instagram.com/reel/${reel.shortCode || reel.id}/`,
        thumbnail_url: thumbnailUrl,
        display_url: reel.displayUrl || reel.display_url || thumbnailUrl,
        timestamp: timestamp.toISOString(),
        video_duration: videoDuration,
        comments_count: reel.commentsCount || 0,
        likes_count: reel.likesCount || 0,
        views_count: viewsCount,
        shares_count: sharesCount,
        saves_count: savesCount,
        is_sponsored: reel.isSponsored || false,
        hashtags: reel.hashtags || [],
        mentions: reel.mentions || [],
        music_info: reel.musicInfo || null,
        location_info: reel.locationInfo || null,
        engagement_rate: engagementRate,
        average_watch_time: reel.averageWatchTime || reel.average_watch_time || null,
        reach_count: reel.reachCount || reel.reach_count || 0,
        impressions_count: reel.impressionsCount || reel.impressions_count || 0,
        follows_from_post: reel.followsFromPost || reel.follows_from_post || 0,
        owner_username: reel.ownerUsername || reel.owner_username || username,
        owner_full_name: reel.ownerFullName || reel.owner_full_name || null,
        owner_profile_pic_url: reel.ownerProfilePicUrl || reel.owner_profile_pic_url || null,
        owner_id: reel.ownerId || reel.owner_id || null,
        is_verified: reel.isVerified || false,
        is_business_account: reel.isBusinessAccount || false,
        is_private: reel.isPrivate || false,
        media_type: reel.mediaType || reel.type || 'reel'
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