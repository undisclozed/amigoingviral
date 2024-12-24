export async function fetchRecentPosts(username: string, apiKey: string) {
  console.log('Starting post scraper for username:', username);
  
  const postRunResponse = await fetch(
    'https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs?token=' + apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "username": username,
        "maxPosts": 3
      })
    }
  );

  if (!postRunResponse.ok) {
    const errorText = await postRunResponse.text();
    console.error('Post run response error:', errorText);
    throw new Error(`Failed to start post scraper: ${errorText}`);
  }

  const postRunData = await postRunResponse.json();
  console.log('Post scraper started with run ID:', postRunData.data.id);

  // Poll for post data completion
  let postData = null;
  const maxAttempts = 24; // 2 minutes maximum wait
  let attempts = 0;

  while (attempts < maxAttempts) {
    console.log(`Checking post run status (attempt ${attempts + 1}/${maxAttempts})...`);
    
    const statusCheck = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs/${postRunData.data.id}?token=${apiKey}`
    );
    
    if (!statusCheck.ok) {
      console.error('Post status check failed:', await statusCheck.text());
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000));
      continue;
    }

    const status = await statusCheck.json();
    console.log('Post run status:', status.data.status);

    if (status.data.status === 'SUCCEEDED') {
      const datasetResponse = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-reel-scraper/runs/${postRunData.data.id}/dataset/items?token=${apiKey}`
      );
      
      if (!datasetResponse.ok) {
        const errorText = await datasetResponse.text();
        console.error('Failed to fetch post dataset:', errorText);
        throw new Error('Failed to fetch post dataset');
      }

      const datasetText = await datasetResponse.text();
      try {
        postData = JSON.parse(datasetText);
        break;
      } catch (error) {
        console.error('Failed to parse post dataset:', error);
        throw new Error('Failed to parse post dataset');
      }
    } else if (status.data.status === 'FAILED' || status.data.status === 'ABORTED') {
      throw new Error(`Post scraper run ${status.data.status.toLowerCase()}`);
    }

    attempts++;
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  if (!postData || !Array.isArray(postData) || postData.length === 0) {
    throw new Error('No post data returned');
  }

  return postData.slice(0, 3);
}