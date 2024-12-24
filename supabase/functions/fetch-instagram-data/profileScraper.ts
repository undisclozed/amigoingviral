import { corsHeaders } from './cors.ts';

export async function fetchProfileData(username: string, apiKey: string) {
  console.log('Starting profile scraper for username:', username);
  
  // Start profile scraper run
  const profileRunResponse = await fetch(
    'https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token=' + apiKey,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "usernames": [username],
        "resultsLimit": 1
      })
    }
  );

  if (!profileRunResponse.ok) {
    const errorText = await profileRunResponse.text();
    console.error('Profile run response error:', errorText);
    throw new Error(`Failed to start profile scraper: ${errorText}`);
  }

  const profileRunData = await profileRunResponse.json();
  console.log('Profile scraper started with run ID:', profileRunData.data.id);

  // Poll for profile data completion
  let profileData = null;
  const maxAttempts = 24; // 2 minutes maximum wait
  let attempts = 0;

  while (attempts < maxAttempts) {
    console.log(`Checking profile run status (attempt ${attempts + 1}/${maxAttempts})...`);
    
    const statusCheck = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs/${profileRunData.data.id}?token=${apiKey}`
    );
    
    if (!statusCheck.ok) {
      console.error('Profile status check failed:', await statusCheck.text());
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 5000));
      continue;
    }

    const status = await statusCheck.json();
    console.log('Profile run status:', status.data.status);

    if (status.data.status === 'SUCCEEDED') {
      const datasetResponse = await fetch(
        `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs/${profileRunData.data.id}/dataset/items?token=${apiKey}`
      );
      
      if (!datasetResponse.ok) {
        const errorText = await datasetResponse.text();
        console.error('Failed to fetch profile dataset:', errorText);
        throw new Error('Failed to fetch profile dataset');
      }

      const datasetText = await datasetResponse.text();
      try {
        profileData = JSON.parse(datasetText);
        break;
      } catch (error) {
        console.error('Failed to parse profile dataset:', error);
        throw new Error('Failed to parse profile dataset');
      }
    } else if (status.data.status === 'FAILED' || status.data.status === 'ABORTED') {
      throw new Error(`Profile scraper run ${status.data.status.toLowerCase()}`);
    }

    attempts++;
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  if (!profileData || !Array.isArray(profileData) || profileData.length === 0) {
    throw new Error('No profile data returned');
  }

  return profileData[0];
}