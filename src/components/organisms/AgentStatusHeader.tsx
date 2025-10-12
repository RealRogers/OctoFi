import { Button } from "@/components/ui/button";
import StatusIndicator from "@/components/atoms/StatusIndicator";
import { Pause } from "lucide-react";

const AgentStatusHeader = () => {
  return (
    <div className="flex items-center justify-between p-6 bg-gray-900/50 rounded-lg border border-gray-700/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <StatusIndicator isActive={true} />
        <div>
          <h1 className="text-2xl font-bold text-white">ACTIVE AGENT</h1>
          <div className="text-sm text-gray-400 mt-1">
            <span>Last action: </span>
            <span className="text-gray-300">45 minutes ago</span>
          </div>
          <div className="text-sm text-gray-300 mt-1">
            Rebalanced 0.3 ETH → USDC
          </div>
        </div>
      </div>
      
      <Button 
        variant="default" 
        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium px-6 py-2 flex items-center gap-2"
      >
        <Pause className="h-4 w-4" />
        PAUSE AGENT
      </Button>
    </div>
  );
};

export default AgentStatusHeader;