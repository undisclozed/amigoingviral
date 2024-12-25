export class ApifyClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchReelsData(username: string, maxPosts: number = 10): Promise<any[]> {
    console.log('Making request to Apify API for', maxPosts, 'posts...');

    const response = await fetch('https://api.apify.com/v2/acts/apify/instagram-scraper/run-sync-get-dataset-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        "username": username,
        "maxPosts": maxPosts,
        "resultsType": "reels",
        "extendOutputFunction": `async ({ page, data }) => {
          const metrics = await page.evaluate(() => {
            const shares = document.querySelector('[data-share-count]')?.getAttribute('data-share-count') || '0';
            const saves = document.querySelector('[data-save-count]')?.getAttribute('data-save-count') || '0';
            const views = document.querySelector('[data-view-count]')?.getAttribute('data-view-count') || '0';
            
            return {
              sharesCount: parseInt(shares),
              savesCount: parseInt(saves),
              viewsCount: parseInt(views)
            };
          });
          
          return {
            ...data,
            ...metrics
          };
        }`,
        "proxy": {
          "useApifyProxy": true,
          "apifyProxyGroups": ["RESIDENTIAL"]
        }
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