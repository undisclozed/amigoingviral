import { Card } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { MetricSelector } from './charts/MetricSelector';
import { generateTimeData } from './charts/generateTimeData';
import { LineChartProps, Interval, MetricType, metricLabels } from './charts/types';
import { ChartControls } from './charts/ChartControls';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";

export const LineChart = ({ 
  metric = 'views',
  interval = 'daily',
  showComparison = false,
  currentCreator,
  comparisonCreator,
  reelId
}: LineChartProps) => {
  const [currentInterval, setCurrentInterval] = useState<Interval>(interval);
  const [currentMetric, setCurrentMetric] = useState<MetricType>(metric);
  const [data, setData] = useState(() => generateTimeData(interval, metric));
  const [comparisonData, setComparisonData] = useState(() => 
    showComparison ? generateTimeData(interval, metric, true) : []
  );
  const [averagePeriod, setAveragePeriod] = useState<'10' | '25' | '50'>('25');
  const [averageData, setAverageData] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!user?.id || !reelId) {
        // If no reelId is provided, use mock data
        const currentData = generateTimeData(currentInterval, currentMetric);
        setData(currentData);
        
        if (showComparison) {
          setComparisonData(generateTimeData(currentInterval, currentMetric, true));
        }
        return;
      }

      try {
        const { data: historicalData, error } = await supabase
          .from('reel_metrics_history')
          .select('*')
          .eq('reel_id', reelId)
          .order('timestamp', { ascending: true });

        if (error) throw error;

        const formattedData = historicalData.map(record => ({
          date: new Date(record.timestamp).toLocaleDateString(),
          value: record[`${currentMetric}_count`] || 0,
          timestamp: new Date(record.timestamp).getTime()
        }));

        setData(formattedData);

        // Calculate average from historical data
        const numDatasets = parseInt(averagePeriod);
        const totalValues = formattedData.reduce((sum, item) => sum + item.value, 0);
        const avgValue = totalValues / formattedData.length;

        const averagePoints = formattedData.map(item => ({
          date: item.date,
          value: avgValue,
          timestamp: item.timestamp
        }));

        setAverageData(averagePoints);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      }
    };

    fetchHistoricalData();
  }, [currentInterval, currentMetric, showComparison, averagePeriod, user?.id, reelId]);

  const formatYAxisTick = (value: number) => {
    if (currentMetric === 'engagement') {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  const formatTooltipValue = (value: number) => {
    if (currentMetric === 'engagement') {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  return (
    <Card className="w-full h-[400px] flex flex-col">
      <div className="p-6 flex flex-col h-full">
        <div className="flex-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Performance Metrics</h3>
            <ChartControls 
              currentInterval={currentInterval}
              averagePeriod={averagePeriod}
              onTimeframeChange={(value) => setCurrentInterval(value as Interval)}
              onAveragePeriodChange={(value) => setAveragePeriod(value as '10' | '25' | '50')}
            />
          </div>
          <div className="mb-6">
            <MetricSelector 
              currentMetric={currentMetric}
              onMetricChange={(metric) => setCurrentMetric(metric)}
            />
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart 
              data={data} 
              margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                interval="preserveStartEnd"
                tick={{ fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                width={60}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip formatter={formatTooltipValue} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#00F37F" 
                strokeWidth={2}
                dot={{ fill: "#00F37F" }}
                name={currentCreator || metricLabels[currentMetric]}
                isAnimationActive={false}
              />
              {showComparison && comparisonData.length > 0 && (
                <Line 
                  type="monotone" 
                  data={comparisonData}
                  dataKey="value" 
                  stroke="#FF6B6B" 
                  strokeWidth={2}
                  dot={{ fill: "#FF6B6B" }}
                  name={comparisonCreator || "Comparison"}
                  isAnimationActive={false}
                />
              )}
              {averageData.length > 0 && (
                <Line
                  type="monotone"
                  data={averageData}
                  dataKey="value"
                  stroke="#1E40AF"
                  strokeWidth={2}
                  dot={{ fill: "#1E40AF" }}
                  name={`Average (${averagePeriod} posts)`}
                  isAnimationActive={false}
                />
              )}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};