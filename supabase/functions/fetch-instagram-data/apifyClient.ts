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