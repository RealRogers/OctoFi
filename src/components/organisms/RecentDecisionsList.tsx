import DecisionCard from "@/components/molecules/DecisionCard";

const RecentDecisionsList = () => {
  const decisions = [
    {
      title: "Rebalanced 0.5 ETH → USDC",
      reason: "Detected high volatility in ETH and moved funds to a stable position to mitigate risk.",
      timestamp: "2 hours ago",
      status: "Completed",
      gasFee: "$4.12",
      aiReasoning: "I detected high volatility in ETH and moved funds to a stable position to mitigate imminent market risk.",
      keyTriggers: ["Volatility: HIGH", "Stochastic RSI: 89"]
    },
    {
      title: "Increased USDC → Aave position",
      reason: "Interest rates in the USDC pool on Aave exceeded the 5% threshold, maximizing yield.",
      timestamp: "6 hours ago",
      status: "Completed",
      gasFee: "$6.78",
      aiReasoning: "Interest rates in the USDC pool on Aave exceeded the 5% threshold, maximizing stable capital yield.",
      keyTriggers: ["Aave APY > 5%", "Pool Liquidity: OPTIMAL"]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Recent Decisions</h2>
      
      <div className="space-y-4">
        {decisions.map((decision, index) => (
          <DecisionCard
            key={index}
            title={decision.title}
            reason={decision.reason}
            timestamp={decision.timestamp}
            status={decision.status}
            gasFee={decision.gasFee}
            aiReasoning={decision.aiReasoning}
            keyTriggers={decision.keyTriggers}
          />
        ))}
      </div>
      
      <div className="text-right">
        <a 
          href="#" 
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          View complete history →
        </a>
      </div>
    </div>
  );
};

export default RecentDecisionsList;