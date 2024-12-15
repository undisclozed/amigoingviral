import { MetricType } from "./types";
import { addDays, addHours, addMinutes, format, subDays, subHours, subMinutes } from "date-fns";

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
  timeOffset = 0 // Number of intervals to offset (for historical data)
) => {
  const baseValue = getBaseMetricValue(metric);
  const variance = getVariance(metric);
  const now = new Date();
  const data = [];

  // Adjust base value for comparison data
  const comparisonBaseValue = isComparison ? baseValue * 0.85 : baseValue;

  let points = 30;
  let addTime;
  let subtractTime;

  switch (interval) {
    case "5min":
      points = 12;
      addTime = addMinutes;
      subtractTime = subMinutes;
      break;
    case "hourly":
      points = 24;
      addTime = addHours;
      subtractTime = subHours;
      break;
    case "daily":
      points = 30;
      addTime = addDays;
      subtractTime = subDays;
      break;
    case "weekly":
      points = 12;
      addTime = (date: Date, amount: number) => addDays(date, amount * 7);
      subtractTime = (date: Date, amount: number) => subDays(date, amount * 7);
      break;
    case "monthly":
      points = 12;
      addTime = (date: Date, amount: number) => addDays(date, amount * 30);
      subtractTime = (date: Date, amount: number) => subDays(date, amount * 30);
      break;
    default:
      addTime = addDays;
      subtractTime = subDays;
  }

  // Start from the offset point
  const startDate = subtractTime(now, points * timeOffset);

  for (let i = points - 1; i >= 0; i--) {
    const date = subtractTime(startDate, i);
    let formatString = "MMM dd HH:mm";
    
    if (interval === "daily" || interval === "weekly" || interval === "monthly") {
      formatString = "MMM dd";
    }

    data.push({
      date: format(date, formatString),
      value: generateRandomValue(comparisonBaseValue, variance)
    });
  }

  return data;
};