import { Card } from "@/components/ui/card";

interface GrowthTipsProps {
  score: number;
}

const generateDynamicTips = (score: number): string[] => {
  if (score >= 90) {
    return [
      "Maintain your excellent posting schedule to keep engagement high",
      "Consider mentoring others in your niche to expand influence",
      "Experiment with new content formats while keeping your core style",
      "Look for collaboration opportunities with similar high-performing creators"
    ];
  } else if (score >= 80) {
    return [
      "Increase posting frequency to maintain momentum",
      "Engage more with your audience's comments to boost interaction",
      "Analyze your most successful posts and create similar content",
      "Use trending hashtags relevant to your niche"
    ];
  } else if (score >= 70) {
    return [
      "Post more consistently to improve engagement",
      "Respond to comments within the first hour of posting",
      "Study your analytics to identify peak posting times",
      "Create content series to keep audience coming back"
    ];
  } else {
    return [
      "Establish a regular posting schedule",
      "Focus on creating high-quality, engaging content",
      "Interact with your audience through polls and questions",
      "Research successful content in your niche for inspiration"
    ];
  }
};

export const GrowthTips = ({ score }: GrowthTipsProps) => {
  const growthTips = generateDynamicTips(score);

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold">Tips to Improve Your Score</h4>
      <ul className="space-y-3">
        {growthTips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};