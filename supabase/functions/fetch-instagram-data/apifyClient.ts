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
        "scrapePostsUntilDate": "2020-01-01",  // Ensure we get enough historical data
        "scrapePostsFromDate": "2023-01-01",   // Recent posts only
        "maxRequestRetries": 5,
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
      const transformedData = rawData.map(item => ({
        ...item,
        sharesCount: item.sharesCount || 0,
        savesCount: item.savesCount || 0,
        videoViewCount: item.videoViewCount || item.viewsCount || 0
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