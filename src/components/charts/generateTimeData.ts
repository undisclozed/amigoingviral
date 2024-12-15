import { MetricType } from "./types";
import { addDays, addHours, addMinutes, format } from "date-fns";

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

export const generateTimeData = (interval: string, metric: MetricType, isComparison = false) => {
  const baseValue = getBaseMetricValue(metric);
  const variance = getVariance(metric);
  const now = new Date();
  const data = [];

  // Adjust base value for comparison data
  const comparisonBaseValue = isComparison ? baseValue * 0.85 : baseValue;

  let points = 30;
  let addTime;

  switch (interval) {
    case "5min":
      points = 12;
      addTime = addMinutes;
      break;
    case "hourly":
      points = 24;
      addTime = addHours;
      break;
    case "daily":
      points = 30;
      addTime = addDays;
      break;
    case "weekly":
      points = 12;
      addTime = (date: Date, amount: number) => addDays(date, amount * 7);
      break;
    case "monthly":
      points = 12;
      addTime = (date: Date, amount: number) => addDays(date, amount * 30);
      break;
    default:
      addTime = addDays;
  }

  for (let i = points - 1; i >= 0; i--) {
    const date = addTime(now, -i);
    data.push({
      date: format(date, "MMM dd"),
      value: generateRandomValue(comparisonBaseValue, variance)
    });
  }

  return data;
};