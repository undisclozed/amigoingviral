export class ApifyClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchReelsData(username: string, maxPosts: number = 10): Promise<any[]> {
    console.log('Making request to Apify API for user:', username);

    try {
      const requestPayload = {
        "username": [username],
        "resultsLimit": maxPosts,
        "shouldDownloadVideos": false,
        "shouldDownloadCovers": false,
        "scrapePostsUntilDate": "2020-01-01",
        "scrapePostsFromDate": "2023-01-01",
        "maxRequestRetries": 5,
        "extendOutputFunction": `async ({ data, item, page, request, customData }) => {
          try {
            // Log the complete raw item data for debugging
            console.log('Raw item data for duration/shares/saves:', {
              duration: item.videoDuration,
              videoInfo: item.videoInfo,
              shares: item.sharesCount,
              saves: item.savesCount
            });
            
            // 1. Basic Reel/Post Information
            data.id = item.id;
            data.shortCode = item.shortCode || item.code;
            data.url = item.url || \`https://www.instagram.com/p/\${item.shortCode}/\`;
            data.caption = item.caption;
            data.thumbnailUrl = item.thumbnailUrl || item.displayUrl;
            data.timestamp = item.timestamp;
            
            // Enhanced Video Duration Mapping
            data.videoDuration = 
              item.videoDuration || 
              (item.videoInfo && item.videoInfo.duration) ||
              (item.video_duration) ||
              (item.video_versions && item.video_versions[0] && item.video_versions[0].duration) ||
              (item.video_metadata && item.video_metadata.duration_in_seconds) ||
              (item.videoData && item.videoData.duration) ||
              (item.mediaInfo && item.mediaInfo.video_duration) ||
              (item.video_duration_in_ms ? item.video_duration_in_ms / 1000 : null);

            console.log('Mapped video duration:', data.videoDuration);

            // 2. Engagement Metrics with enhanced logging
            data.videoViewCount = item.videoViewCount || 
                                item.videoPlayCount || 
                                item.video_play_count || 
                                item.viewsCount || 
                                0;
            data.likesCount = item.likesCount || 0;
            data.commentsCount = item.commentsCount || 0;
            
            // Enhanced shares and saves mapping
            data.sharesCount = item.sharesCount || 
                              item.shares_count || 
                              item.shareCount || 
                              item.share_count || 
                              0;
            
            data.savesCount = item.savesCount || 
                             item.saves_count || 
                             item.saveCount || 
                             item.save_count || 
                             0;

            console.log('Mapped engagement metrics:', {
              shares: data.sharesCount,
              saves: data.savesCount
            });
            
            // Calculate engagement rate
            const totalEngagements = data.likesCount + data.commentsCount + data.savesCount + data.sharesCount;
            data.engagementRate = data.videoViewCount > 0 
              ? (totalEngagements / data.videoViewCount) * 100 
              : 0;

            // 3. Account Information
            data.ownerUsername = item.ownerUsername || item.username;
            data.ownerFullName = item.ownerFullName || item.fullName;
            data.ownerProfilePicUrl = item.ownerProfilePicUrl || item.profilePicUrl;
            data.ownerId = item.ownerId || item.userId;
            data.isVerified = item.isVerified || false;
            data.isBusinessAccount = item.isBusinessAccount || false;
            data.isPrivate = item.isPrivate || false;

            // 4. Hashtags and Mentions
            data.hashtags = item.hashtags || [];
            data.mentions = item.mentions || [];
            data.taggedUsers = item.taggedUsers || [];

            // 5. Location Information
            if (item.location || item.locationInfo) {
              const location = item.location || item.locationInfo;
              data.locationInfo = {
                name: location.name,
                id: location.id,
                lat: location.lat,
                lng: location.lng
              };
            }

            // 6. Music Information
            if (item.musicInfo || item.audio) {
              const music = item.musicInfo || item.audio;
              data.musicInfo = {
                title: music.title || music.audioTitle,
                artist: music.artist || music.audioAuthor,
                url: music.url || music.audioUrl,
                duration: music.duration || music.audioDuration
              };
            }

            // 7. Additional Metadata
            data.reelType = item.type || item.mediaType || 'Reel';
            data.reelPlayCount = data.videoViewCount;
            data.playbackDuration = item.playbackDuration || 
                                  item.average_watch_time || 
                                  null;
            data.device = item.device || null;
            data.uploadSource = item.uploadSource || null;

            return data;
          } catch (error) {
            console.error('Error in extendOutputFunction:', error);
            console.error('Problematic item:', JSON.stringify(item, null, 2));
            return data;
          }
        }`,
        "proxy": {
          "useApifyProxy": true,
          "apifyProxyGroups": ["RESIDENTIAL"]
        },
        "additionalRequests": {
          "videoMetadata": true,
          "expandVideos": true
        }
      };

      console.log('Request payload:', JSON.stringify(requestPayload, null, 2));

      const response = await fetch('https://api.apify.com/v2/acts/apify~instagram-reel-scraper/run-sync-get-dataset-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestPayload),
      });

      console.log('Apify API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Apify API error response:', errorText);
        throw new Error(`Apify API returned status ${response.status}`);
      }

      const rawData = await response.json();
      console.log('Raw response from Apify (first item):', 
        rawData && rawData[0] ? JSON.stringify(rawData[0], null, 2) : 'No data');

      if (!Array.isArray(rawData)) {
        console.error('Unexpected response format from Apify:', rawData);
        throw new Error('Invalid response format from Apify');
      }

      // Transform the data to ensure we have all required fields
      const transformedData = rawData.map(item => ({
        ...item,
        video_duration: item.videoDuration || 
                       item.video_duration || 
                       (item.videoInfo && item.videoInfo.duration) ||
                       (item.video_versions && item.video_versions[0] && item.video_versions[0].duration) ||
                       (item.video_metadata && item.video_metadata.duration_in_seconds) ||
                       (item.videoData && item.videoData.duration) ||
                       (item.mediaInfo && item.mediaInfo.video_duration) ||
                       (item.video_duration_in_ms ? item.video_duration_in_ms / 1000 : null),
        shares_count: item.sharesCount || item.shares_count || item.shareCount || item.share_count || 0,
        saves_count: item.savesCount || item.saves_count || item.saveCount || item.save_count || 0,
        views_count: item.videoViewCount || item.videoPlayCount || item.viewsCount || 0
      }));

      console.log('Transformed data (first item):', 
        transformedData[0] ? JSON.stringify(transformedData[0], null, 2) : 'No data');

      return transformedData;
    } catch (error) {
      console.error('Error in fetchReelsData:', error);
      throw error;
    }
  }
}