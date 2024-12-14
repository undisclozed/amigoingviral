import { Interval, MetricType, ChartData } from './types';

export const generateTimeData = (interval: Interval, metric: MetricType, isComparison: boolean = false): ChartData[] => {
  const now = new Date();
  const data: ChartData[] = [];
  
  const getMetricValue = (base: number) => {
    const multiplier = isComparison ? 0.8 : 1;
    switch(metric) {
      case 'views':
      case 'reached':
        return Math.floor((base + Math.random() * 1000) * multiplier);
      case 'likes':
      case 'growth':
        return Math.floor((base * 0.1 + Math.random() * 100) * multiplier);
      case 'comments':
      case 'followers':
        return Math.floor((base * 0.01 + Math.random() * 50) * multiplier);
      case 'shares':
      case 'engaged':
        return Math.floor((base * 0.05 + Math.random() * 20) * multiplier);
      case 'engagement':
        return Math.floor((base * 0.15 + Math.random() * 5) * multiplier);
      default:
        return 0;
    }
  };

  switch (interval) {
    case '5min':
      for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 5 * 60000);
        data.push({
          date: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: getMetricValue(4000)
        });
      }
      break;

    case 'hourly':
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60000);
        data.push({
          date: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: getMetricValue(4000)
        });
      }
      break;

    case 'daily':
      for (let i = 6; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 24 * 60 * 60000);
        data.push({
          date: time.toLocaleDateString([], { weekday: 'short' }),
          value: getMetricValue(4000)
        });
      }
      break;
      
    case 'weekly':
      for (let i = 7; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 7 * 24 * 60 * 60000);
        data.push({
          date: `Week ${7-i}`,
          value: getMetricValue(4000)
        });
      }
      break;

    case 'monthly':
      for (let i = 11; i >= 0; i--) {
        const time = new Date(now.getFullYear(), now.getMonth() - i, 1);
        data.push({
          date: time.toLocaleDateString([], { month: 'short' }),
          value: getMetricValue(4000)
        });
      }
      break;
  }
  
  return data;
};