import { addDays, addHours, addMinutes, subDays, subHours, subMinutes, format } from "date-fns";
import { Interval } from "./types";

export interface TimeConfig {
  points: number;
  addTime: (date: Date, amount: number) => Date;
  subtractTime: (date: Date, amount: number) => Date;
  formatString: string;
  intervalMinutes: number;
}

export const getTimeConfig = (interval: Interval): TimeConfig => {
  switch (interval) {
    case "5min":
      return {
        points: 12,
        addTime: addMinutes,
        subtractTime: subMinutes,
        formatString: "HH:mm",
        intervalMinutes: 5
      };
    case "hourly":
      return {
        points: 24,
        addTime: addHours,
        subtractTime: subHours,
        formatString: "HH:mm",
        intervalMinutes: 60
      };
    case "daily":
      return {
        points: 30,
        addTime: addDays,
        subtractTime: subDays,
        formatString: "MMM dd",
        intervalMinutes: 1440
      };
    case "weekly":
      return {
        points: 12,
        addTime: (date: Date, amount: number) => addDays(date, amount * 7),
        subtractTime: (date: Date, amount: number) => subDays(date, amount * 7),
        formatString: "MMM dd",
        intervalMinutes: 10080
      };
    case "monthly":
      return {
        points: 12,
        addTime: (date: Date, amount: number) => addDays(date, amount * 30),
        subtractTime: (date: Date, amount: number) => subDays(date, amount * 30),
        formatString: "MMM dd",
        intervalMinutes: 43200
      };
    default:
      return {
        points: 30,
        addTime: addDays,
        subtractTime: subDays,
        formatString: "MMM dd",
        intervalMinutes: 1440
      };
  }
};