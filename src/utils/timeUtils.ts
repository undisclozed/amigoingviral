export const getTimeSincePost = (postDate: string): string => {
  const now = new Date();
  const postTime = new Date(postDate);
  const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
};

export const getUpdateInterval = (postDate: string): number => {
  const now = new Date();
  const postTime = new Date(postDate);
  const diffInHours = (now.getTime() - postTime.getTime()) / (1000 * 60 * 60);

  if (diffInHours <= 2) {
    return 5; // 5 minutes
  } else if (diffInHours <= 6) {
    return 20; // 20 minutes
  } else if (diffInHours <= 24) {
    return 60; // 1 hour
  } else if (diffInHours <= 72) {
    return 180; // 3 hours
  } else {
    return 1440; // 24 hours
  }
};