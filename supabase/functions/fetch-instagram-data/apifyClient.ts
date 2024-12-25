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
            // Get additional metrics from different possible locations in the response
            const mediaData = item.media || {};
            
            // Log the raw item data for debugging
            console.log('Raw item data:', JSON.stringify(item, null, 2));
            
            // Capture video duration and play count from the root item
            data.videoDuration = item.videoDuration;
            data.videoPlayCount = item.videoPlayCount;
            
            // Try multiple possible paths for other metrics
            data.shares_count = mediaData.share_count || mediaData.reshares_count || 0;
            data.saves_count = mediaData.bookmark_count || mediaData.saved_count || 
                             (mediaData.edge_saved_media && mediaData.edge_saved_media.count) || 0;
            
            return data;
          } catch (error) {
            console.error('Error in extendOutputFunction:', error);
            return data;
          }
        }`,
        "proxy": {
          "useApifyProxy": true,
          "apifyProxyGroups": ["RESIDENTIAL"]
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
      const transformedData = rawData.map(item => {
        return {
          ...item,
          video_duration: item.videoDuration || null,
          shares_count: item.shares_count || 0,
          saves_count: item.saves_count || 0,
          views_count: item.videoPlayCount || item.viewsCount || 0
        };
      });

      console.log('Transformed data (first item):', 
        transformedData[0] ? JSON.stringify(transformedData[0], null, 2) : 'No data');

      return transformedData;
    } catch (error) {
      console.error('Error in fetchReelsData:', error);
      throw error;
    }
  }
}