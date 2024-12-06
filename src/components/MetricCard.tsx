import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}

export const MetricCard = ({ title, value, change, icon }: MetricCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="text-gray-600">{icon}</div>
        {change !== undefined && (
          <div className={`flex items-center ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
            <span className="ml-1">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </Card>
  );
};