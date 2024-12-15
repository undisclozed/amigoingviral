import { LineChart } from "@/components/LineChart";

interface GrowthChartProps {
  currentCreator: string;
  comparisonCreator: string;
}

export const GrowthChart = ({ currentCreator, comparisonCreator }: GrowthChartProps) => {
  return (
    <div className="mt-6">
      <h4 className="font-medium mb-4">Growth Comparison</h4>
      <div className="h-[550px]">
        <LineChart 
          metric="followers"
          interval="monthly"
          showComparison={true}
          currentCreator={currentCreator}
          comparisonCreator={comparisonCreator}
        />
      </div>
    </div>
  );
};