import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import AgentStatusHeader from "@/components/organisms/AgentStatusHeader";
import PerformanceMetricsGrid from "@/components/organisms/PerformanceMetricsGrid";
import AIPredictionGrid from "@/components/organisms/AIPredictionGrid";
import RecentDecisionsList from "@/components/organisms/RecentDecisionsList";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

const AgentDashboardPage = () => {
  // State to control if the agent is active or paused
  const [isAgentActive, setIsAgentActive] = useState(true);
  
  // State to filter recent decisions
  const [decisionFilter, setDecisionFilter] = useState("all");
  
  // State to show/hide additional details
  const [showDetails, setShowDetails] = useState(false);

  // Function to handle agent pause/activation
  const handleAgentToggle = () => {
    setIsAgentActive(!isAgentActive);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Agent Status Header with state management */}
        <div onClick={handleAgentToggle}>
          <AgentStatusHeader />
        </div>
        
        {/* Performance Metrics Grid */}
        <PerformanceMetricsGrid />
        
        {/* AI Prediction Grid */}
        <AIPredictionGrid />
        
        {/* Filters for recent decisions */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Decisions</h2>
          <div className="flex items-center gap-4">
            <Select value={decisionFilter} onValueChange={setDecisionFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All decisions</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Recent Decisions List */}
        <RecentDecisionsList />
        
        {/* Additional details that can be shown/hidden */}
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide details" : "Show more details"}
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showDetails && (
            <Card className="mt-4 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Agent Details</h3>
                  <p className="text-sm text-gray-300">
                    This agent has been operating for 45 days with superior market performance.
                    The implemented strategies have generated significant savings in gas costs
                    and optimized portfolio performance under volatile market conditions.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Creation date:</span>
                      <span className="ml-2 text-white">October 15, 2023</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last update:</span>
                      <span className="ml-2 text-white">Today, 10:45 AM</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total operations:</span>
                      <span className="ml-2 text-white">156</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Risk level:</span>
                      <span className="ml-2 text-white">Moderate</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AgentDashboardPage;