import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Suspense, lazy } from "react";

// Lazy load recharts to prevent blocking
const ChartComponent = lazy(() => import("@/components/atoms/DashboardChart"));

const Dashboard = () => {
  const navigate = useNavigate();

  // Simplified mock data
  const assets = [
    {
      symbol: "ETH",
      name: "Ethereum",
      icon: "⟠",
      balance: "1.25 ETH",
      valueUSD: "$2,000.00",
      change24h: "+2.5%",
      prediction: "HIGH",
      predictionColor: "bg-green-500",
      apy: "5.0%",
      trend: "up",
      link: "/asset/ETH"
    },
    {
      symbol: "OCTO",
      name: "OctoFi",
      icon: "🐙",
      balance: "10,000 OCTO",
      valueUSD: "$500.00",
      change24h: "-1.2%",
      prediction: "MEDIUM",
      predictionColor: "bg-yellow-500",
      apy: "12.0%",
      trend: "down"
    },
    {
      symbol: "DAI",
      name: "Dai",
      icon: "◈",
      balance: "5,000 DAI",
      valueUSD: "$5,000.00",
      change24h: "+0.1%",
      prediction: "LOW",
      predictionColor: "bg-gray-500",
      apy: "2.0%",
      trend: "up"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Portfolio Summary */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm text-muted-foreground mb-2">Portfolio Summary</h2>
                  <div className="text-4xl font-black">$12,345.67</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-green-500 font-semibold">+$123.45 (+1.02%)</span>
                    <span className="text-muted-foreground text-sm">Last 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-md">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-medium">+2.5% in 24h</span>
                  </div>
                </div>
              </div>
              
              {/* Gas Fee Indicator */}
              <div className="space-y-2">
                <h2 className="text-sm text-muted-foreground mb-2">Gas Fee (Gwei)</h2>
                <div className="text-3xl font-bold">32.5</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-muted-foreground">Optimal time for transactions: in ~15 mins</span>
                </div>
              </div>

              {/* Chart - Lazy loaded */}
              <div className="h-64 mt-6 md:col-span-2">
                <Suspense fallback={
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Loading chart...
                  </div>
                }>
                  <ChartComponent />
                </Suspense>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Status & Gas Fees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Agent Status</h3>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                  ● ACTIVE
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Last action: Swap ETH for OCTO - 2023-10-27 10:30 AM
              </p>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => navigate("/agent-status")}
              >
                Pause Agent
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold">Gas Fee (Gwei)</h3>
              <div className="text-4xl font-black">55 <span className="text-xl text-muted-foreground">Gwei</span></div>
              <p className="text-sm text-muted-foreground">
                Optimal time for transactions: <span className="text-foreground">in ~15 mins</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assets Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <h3 className="font-bold mb-6">Assets</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Asset</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Balance</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Value (USD)</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">24h %</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">AI Prediction</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">APY</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset, i) => (
                    <tr 
                      key={i}
                      className="border-b border-border/30 hover:bg-muted/20 cursor-pointer transition-colors"
                      onClick={() => navigate(asset.link || `/asset/${asset.symbol.toLowerCase()}`)}
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                            {asset.icon}
                          </div>
                          <div>
                            <div className="font-semibold">{asset.symbol}</div>
                            <div className="text-sm text-muted-foreground">{asset.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 font-medium">{asset.balance}</td>
                      <td className="py-4 px-2 font-semibold">{asset.valueUSD}</td>
                      <td className="py-4 px-2">
                        <span className={asset.trend === "up" ? "text-green-500" : "text-red-500"}>
                          {asset.change24h}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <Badge className={`${asset.predictionColor} border-0`}>
                          {asset.prediction}
                        </Badge>
                      </td>
                      <td className="py-4 px-2 font-semibold">{asset.apy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
