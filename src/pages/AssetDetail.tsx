import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Smile, Share2, CheckCircle2, XCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";

const AssetDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ai-analysis");

  const assetData = {
    name: "Ethereum",
    symbol: "ETH",
    icon: "⟠",
    balance: "1.5 ETH",
    valueUSD: "$4,500.00",
    change: "+2.34%",
    changeValue: "$1,550.23"
  };

  const aiPrediction = {
    sentiment: "ALCISTA",
    confidence: 78,
    priceRange: {
      min: "$2,950",
      target: "$3,200",
      max: "$3,450"
    },
    reasons: [
      { icon: TrendingUp, text: "Aumento del volumen en exchanges." },
      { icon: CheckCircle2, text: "Señales técnicas positivas." },
      { icon: Smile, text: "Sentimiento positivo en redes sociales." },
      { icon: Share2, text: "Próxima actualización de red con expectativas positivas." }
    ],
    historicalAccuracy: 85,
    last30Days: [85, 90, 80, 88, 92, 87, 90, 85, 95, 88]
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                {assetData.icon}
              </div>
              <div>
                <h1 className="text-3xl font-black">{assetData.name} <span className="text-muted-foreground">{assetData.symbol}</span></h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-green-500 font-semibold">{assetData.change}</span>
                  <span className="text-muted-foreground">({assetData.changeValue})</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-2xl font-bold">{assetData.balance}</div>
            <div className="text-lg text-muted-foreground">{assetData.valueUSD} USD</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full mb-6">
          <div className="flex border-b border-border">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 ${activeTab === "overview" 
                ? "border-b-2 border-primary font-medium" 
                : "text-muted-foreground hover:text-foreground"}`}>
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("ai-analysis")}
              className={`px-4 py-2 ${activeTab === "ai-analysis" 
                ? "border-b-2 border-primary font-medium" 
                : "text-muted-foreground hover:text-foreground"}`}>
              AI Analysis
            </button>
            <button 
              onClick={() => setActiveTab("transactions")}
              className={`px-4 py-2 ${activeTab === "transactions" 
                ? "border-b-2 border-primary font-medium" 
                : "text-muted-foreground hover:text-foreground"}`}>
              Transactions
            </button>
          </div>
        </div>

        {activeTab === "ai-analysis" && (
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prediction Confidence */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 space-y-4">
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    {aiPrediction.sentiment}
                  </Badge>
                  <div className="text-6xl font-black">{aiPrediction.confidence}%</div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Prediction Confidence</div>
                    <Progress value={aiPrediction.confidence} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Why This Prediction */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold">Why this prediction?</h3>
                  <div className="space-y-3">
                    {aiPrediction.reasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <reason.icon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{reason.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Range */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-bold">Expected Price Range</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">Min</div>
                    <div className="text-2xl font-bold">{aiPrediction.priceRange.min}</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">Target</div>
                    <div className="text-3xl font-black text-green-500">{aiPrediction.priceRange.target}</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">Max</div>
                    <div className="text-2xl font-bold">{aiPrediction.priceRange.max}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historical Precision */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Historical Accuracy</h3>
                <p className="text-muted-foreground">{aiPrediction.historicalAccuracy}% accuracy in the last 30 days.</p>
                <div className="flex items-end justify-between gap-2 h-32">
                  {aiPrediction.last30Days.map((accuracy, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t transition-all ${
                        accuracy >= 85 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ height: `${accuracy}%` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "overview" && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-6">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Overview coming soon...</p>
            </CardContent>
          </Card>
        )}

        {activeTab === "transactions" && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Historial de Transacciones</h3>
              <div className="space-y-4">
                {[
                  { date: "2023-10-15", type: "Compra", amount: "0.5 ETH", value: "$1,500.00", status: "Completada" },
                  { date: "2023-09-28", type: "Venta", amount: "0.2 ETH", value: "$580.00", status: "Completada" },
                  { date: "2023-09-15", type: "Compra", amount: "0.3 ETH", value: "$870.00", status: "Completada" },
                  { date: "2023-08-22", type: "Swap", amount: "0.1 ETH → 150 USDC", value: "$290.00", status: "Completada" },
                  { date: "2023-08-10", type: "Compra", amount: "0.4 ETH", value: "$1,160.00", status: "Completada" }
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border/50">
                    <div>
                      <div className="font-medium">{tx.type}</div>
                      <div className="text-sm text-muted-foreground">{tx.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{tx.amount}</div>
                      <div className="text-sm text-muted-foreground">{tx.value}</div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                      {tx.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default AssetDetail;
