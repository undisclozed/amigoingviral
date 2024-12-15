interface CompetitorInsightsProps {
  insights: string[];
}

export const CompetitorInsights = ({ insights }: CompetitorInsightsProps) => {
  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-medium">Competitive Insights</h4>
      <ul className="space-y-2">
        {insights.map((insight, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
            {insight}
          </li>
        ))}
      </ul>
    </div>
  );
};