import { MetricType } from "./types";
import { format } from "date-fns";
import { getTimeConfig, TimeConfig } from "./TimeIntervalUtils";

const generateRandomValue = (baseValue: number, variance: number) => {
  return Math.floor(baseValue + (Math.random() - 0.5) * variance);
};

const getBaseMetricValue = (metric: MetricType): number => {
  switch (metric) {
    case "views":
      return 45000;
    case "likes":
      return 3200;
    case "comments":
      return 180;
    case "shares":
      return 95;
    case "saves":
      return 420;
    case "engagement":
      return 8.5;
    case "followers":
      return 12500;
    case "reach":
      return 45200;
    default:
      return 1000;
  }
};

const getVariance = (metric: MetricType): number => {
  switch (metric) {
    case "views":
      return 10000;
    case "likes":
      return 800;
    case "comments":
      return 50;
    case "shares":
      return 25;
    case "saves":
      return 100;
    case "engagement":
      return 2;
    case "followers":
      return 300;
    case "reach":
      return 5000;
    default:
      return 200;
  }
};

export const generateTimeData = (
  interval: string, 
  metric: MetricType, 
  isComparison = false,
  timeOffset = 0
) => {
  const baseValue = getBaseMetricValue(metric);
  const variance = getVariance(metric);
  const now = new Date();
  const data = [];

  const comparisonBaseValue = isComparison ? baseValue * 0.85 : baseValue;
  const timeConfig: TimeConfig = getTimeConfig(interval as any);
  
  // Calculate the start date based on the offset
  const startDate = timeConfig.subtractTime(
    now, 
    timeConfig.points * timeOffset
  );

  // Generate data points with consistent intervals
  for (let i = timeConfig.points - 1; i >= 0; i--) {
    const date = timeConfig.subtractTime(startDate, i);
    
    data.push({
      date: format(date, timeConfig.formatString),
      value: generateRandomValue(comparisonBaseValue, variance),
      timestamp: date.getTime() // Add timestamp for sorting
    });
  }

  return data;
};
