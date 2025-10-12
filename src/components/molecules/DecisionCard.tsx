import { Card, CardContent } from "@/components/ui/card";
import { Check, Fuel, BrainCircuit } from "lucide-react";

interface DecisionCardProps {
  title: string;
  reason: string;
  timestamp: string;
  status: string;
  gasFee: string;
  aiReasoning: string;
  keyTriggers: string[];
}

const DecisionCard = ({ 
  title, 
  reason, 
  timestamp, 
  status, 
  gasFee, 
  aiReasoning, 
  keyTriggers 
}: DecisionCardProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <span className="text-sm text-gray-400">{timestamp}</span>
          </div>
          
          {/* AI Reasoning Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
              <BrainCircuit className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-400">AI Reasoning</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed pl-5">
              {aiReasoning}
            </p>
          </div>
          
          {/* Key Triggers Section */}
          <div className="space-y-2 pl-5">
            <span className="text-sm text-gray-400">Key Triggers:</span>
            <div className="flex flex-wrap gap-2">
              {keyTriggers.map((trigger, index) => (
                <div 
                  key={index}
                  className="px-2 py-1 bg-gray-700/50 border border-gray-600 rounded-md text-xs text-gray-300"
                >
                  {trigger}
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">Status: <span className="text-green-400">{status}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Gas: <span className="text-white">{gasFee}</span></span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DecisionCard;