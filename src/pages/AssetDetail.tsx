import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Smile, Share2, CheckCircle2, XCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Progress } from "@/components/ui/progress";

const AssetDetail = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();

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
      { icon: TrendingUp, text: "Aumento del volumen en exchanges descentralizados." },
      { icon: CheckCircle2, text: "Señales técnicas positivas en el gráfico de 4 horas." },
      { icon: Smile, text: "Sentimiento positivo en redes sociales." },
      { icon: Share2, text: "Próxima actualización de la red ha generado expectativas positivas." }
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
        <Tabs defaultValue="ai-analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="ai-analysis" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prediction Confidence */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 space-y-4">
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                    {aiPrediction.sentiment}
                  </Badge>
                  <div className="text-6xl font-black">{aiPrediction.confidence}%</div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Confianza de la predicción</div>
                    <Progress value={aiPrediction.confidence} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Why This Prediction */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold">¿Por qué esta predicción?</h3>
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
                <h3 className="text-xl font-bold">Rango de Precio Esperado</h3>
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
                <h3 className="text-xl font-bold">Precisión Histórica</h3>
                <p className="text-muted-foreground">{aiPrediction.historicalAccuracy}% de aciertos en los últimos 30 días.</p>
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
          </TabsContent>

          <TabsContent value="overview">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-6">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Overview coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-6">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Transactions history coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AssetDetail;
