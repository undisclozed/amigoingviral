export class ApifyClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchReelsData(username: string, maxPosts: number = 10): Promise<any[]> {
    console.log('Making request to Apify API for', maxPosts, 'posts...');

    const response = await fetch('https://api.apify.com/v2/acts/apify~instagram-reel-scraper/run-sync-get-dataset-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        "username": [username],
        "resultsLimit": maxPosts,
        "extendOutputFunction": `async ({ data, item, page, customData }) => {
          // Get additional metrics
          const videoViewCount = await page.evaluate(() => {
            const viewElement = document.querySelector('span[class*="video-view-count"]');
            return viewElement ? parseInt(viewElement.textContent.replace(/[^0-9]/g, '')) : null;
          });
          
          // Get shares and saves counts
          const metrics = await page.evaluate(() => {
            const sharesElement = document.querySelector('span[class*="shares-count"]');
            const savesElement = document.querySelector('span[class*="saves-count"]');
            return {
              sharesCount: sharesElement ? parseInt(sharesElement.textContent.replace(/[^0-9]/g, '')) : 0,
              savesCount: savesElement ? parseInt(savesElement.textContent.replace(/[^0-9]/g, '')) : 0
            };
          });
          
          // Add to the data object
          data.videoViewCount = videoViewCount;
          data.sharesCount = metrics.sharesCount;
          data.savesCount = metrics.savesCount;
          return data;
        }`
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

    return rawData;
  }
}