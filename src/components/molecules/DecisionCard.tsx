import { Card, CardContent } from "@/components/ui/card";
import { Check, Fuel } from "lucide-react";

interface DecisionCardProps {
  title: string;
  reason: string;
  timestamp: string;
  status: string;
  gasFee: string;
}

const DecisionCard = ({ title, reason, timestamp, status, gasFee }: DecisionCardProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <span className="text-sm text-gray-400">{timestamp}</span>
          </div>
          
          {/* Reason */}
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="font-medium">Razón:</span> {reason}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-300">Estado: <span className="text-green-400">{status}</span></span>
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