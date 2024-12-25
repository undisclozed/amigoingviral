export class ApifyClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchReelsData(username: string, maxPosts: number = 10): Promise<any[]> {
    console.log('Making request to Apify API for', maxPosts, 'posts from user:', username);

    try {
      const response = await fetch('https://api.apify.com/v2/acts/clockworks~instagram-reels-scraper/runs', {
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

      const runData = await response.json();
      console.log('Run started with ID:', runData.id);

      // Wait for the run to finish and get results
      const datasetUrl = `https://api.apify.com/v2/actor-runs/${runData.id}/dataset/items?token=${this.apiKey}`;
      const maxAttempts = 30;
      let attempt = 0;

      while (attempt < maxAttempts) {
        const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runData.id}?token=${this.apiKey}`);
        const statusData = await statusResponse.json();

        if (statusData.status === 'SUCCEEDED') {
          const dataResponse = await fetch(datasetUrl);
          const rawData = await dataResponse.json();
          console.log('Raw response from Apify:', JSON.stringify(rawData).substring(0, 500) + '...');

          if (!Array.isArray(rawData)) {
            console.error('Unexpected response format from Apify:', rawData);
            throw new Error('Invalid response format from Apify');
          }

          return rawData;
        }

        if (statusData.status === 'FAILED' || statusData.status === 'ABORTED') {
          throw new Error(`Run failed with status: ${statusData.status}`);
        }

        // Wait 5 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
        attempt++;
      }

      throw new Error('Timeout waiting for Apify run to complete');
    } catch (error) {
      console.error('Error in fetchReelsData:', error);
      throw error;
    }
  }
}