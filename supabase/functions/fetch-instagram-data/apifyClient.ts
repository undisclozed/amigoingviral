export class ApifyClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchReelsData(username: string, maxPosts: number = 10): Promise<any[]> {
    console.log('Making request to Apify API for', maxPosts, 'posts from user:', username);

    try {
      const response = await fetch('https://api.apify.com/v2/acts/clockworks~instagram-reels-scraper/run-sync-get-dataset-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          "username": username,
          "maxPosts": maxPosts,
          "resultsLimit": maxPosts,
          "shouldDownloadVideos": false,
          "shouldDownloadCovers": false,
          "extendOutputFunction": `async ({ data, item, page, request, customData }) => {
            const $ = cheerio.load(item.html);
            item.sharesCount = parseInt($('[data-shares-count]').attr('data-shares-count')) || 0;
            item.savesCount = parseInt($('[data-saves-count]').attr('data-saves-count')) || 0;
            item.videoViewCount = parseInt($('[data-video-view-count]').attr('data-video-view-count')) || 0;
            return item;
          }`,
          "proxy": {
            "useApifyProxy": true,
            "apifyProxyGroups": ["RESIDENTIAL"]
          }
        }),
      });

      console.log('Apify API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Apify API error response:', errorText);
        throw new Error(`Apify API returned status ${response.status}`);
      }

      const rawData = await response.json();
      console.log('Raw response from Apify:', JSON.stringify(rawData).substring(0, 500) + '...');

      if (!Array.isArray(rawData)) {
        console.error('Unexpected response format from Apify:', rawData);
        throw new Error('Invalid response format from Apify');
      }

      return rawData;
    } catch (error) {
      console.error('Error in fetchReelsData:', error);
      throw error;
    }
  }
}