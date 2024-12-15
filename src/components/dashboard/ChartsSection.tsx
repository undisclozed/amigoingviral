import { LineChart } from "@/components/LineChart";
import { BarChart } from "@/components/BarChart";

const ChartsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="w-full">
        <LineChart />
      </div>
      <div className="w-full">
        <BarChart />
      </div>
    </div>
  );
};

export default ChartsSection;