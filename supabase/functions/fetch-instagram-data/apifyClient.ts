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
          // Get video view count
          const viewCount = await page.evaluate(() => {
            const viewElement = document.querySelector('span._aacl._aacp._aacw._aad0._aad7');
            return viewElement ? parseInt(viewElement.textContent.replace(/[^0-9]/g, '')) : null;
          });
          
          // Get engagement metrics
          const metrics = await page.evaluate(() => {
            const elements = document.querySelectorAll('span._aacl._aacp._aacw._aad0._aad7');
            let shares = 0;
            let saves = 0;
            
            elements.forEach(el => {
              const text = el.textContent.toLowerCase();
              if (text.includes('share')) {
                shares = parseInt(text.replace(/[^0-9]/g, '')) || 0;
              }
              if (text.includes('save')) {
                saves = parseInt(text.replace(/[^0-9]/g, '')) || 0;
              }
            });
            
            return { shares, saves };
          });
          
          // Add metrics to the data object
          data.videoViewCount = viewCount;
          data.sharesCount = metrics.shares;
          data.savesCount = metrics.saves;
          
          // Log the collected metrics for debugging
          console.log('Collected metrics:', {
            videoViewCount: data.videoViewCount,
            sharesCount: data.sharesCount,
            savesCount: data.savesCount,
            likesCount: data.likesCount,
            commentsCount: data.commentsCount
          });
          
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