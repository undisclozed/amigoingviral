import { formatDistanceToNow, parseISO } from 'date-fns';

export const getTimeSincePost = (timestamp: string): string => {
  return formatDistanceToNow(parseISO(timestamp), { addSuffix: true });
};

export const getUpdateInterval = (timestamp: string): number => {
  const postDate = parseISO(timestamp);
  const now = new Date();
  const hoursSincePost = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);

  // Conservative update schedule
  if (hoursSincePost <= 2) return 5; // First 2 hours: Every 5 minutes
  if (hoursSincePost <= 6) return 20; // Hours 3-6: Every 20 minutes
  if (hoursSincePost <= 24) return 60; // Hours 7-24: Every hour
  if (hoursSincePost <= 72) return 180; // Hours 25-72: Every 3 hours
  return 1440; // After 72 hours: Once every 24 hours
};