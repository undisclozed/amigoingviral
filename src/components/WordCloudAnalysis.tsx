import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReactWordcloud from "react-wordcloud";

// Mock data - in a real app, this would come from analyzing user's posts
const words = [
  { text: "lifestyle", value: 64 },
  { text: "tutorial", value: 55 },
  { text: "creative", value: 43 },
  { text: "art", value: 42 },
  { text: "design", value: 38 },
  { text: "inspiration", value: 35 },
  { text: "digital", value: 32 },
  { text: "artist", value: 30 },
  { text: "create", value: 28 },
  { text: "tips", value: 25 },
  { text: "howto", value: 22 },
  { text: "process", value: 20 },
  { text: "behindthescenes", value: 18 },
  { text: "workflow", value: 15 },
  { text: "creative", value: 12 },
];

const options = {
  rotations: 2,
  rotationAngles: [0, 90],
  fontSizes: [12, 40],
  padding: 5,
  fontFamily: "Inter",
  colors: ["#00F37F", "#1a1a1a", "#333333", "#666666"],
};

export const WordCloudAnalysis = () => {
  return (
    <Card className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Content Analysis</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Most frequently used words in your content, helping you understand your content patterns and SEO optimization opportunities.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ReactWordcloud words={words} options={options} />
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="font-medium text-sm">Key Insights:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
            Your content strongly focuses on lifestyle and tutorial content
          </li>
          <li className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
            Creative and artistic themes are prominent in your posts
          </li>
          <li className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
            Consider incorporating more trending keywords in your niche
          </li>
        </ul>
      </div>
    </Card>
  );
};