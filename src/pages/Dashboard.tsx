import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const chartData = [
  { time: "Hace 7d", value: 11500 },
  { time: "Hace 6d", value: 12200 },
  { time: "Hace 5d", value: 11800 },
  { time: "Hace 4d", value: 12800 },
  { time: "Hace 3d", value: 12100 },
  { time: "Ayer", value: 13200 },
  { time: "Hoy", value: 12345 },
];

const assets = [
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "⟠",
    balance: "1.25 ETH",
    valueUSD: "$2,000.00",
    change24h: "+2.5%",
    prediction: "ALTA",
    predictionColor: "bg-green-500",
    apy: "5.0%",
    trend: "up"
  },
  {
    symbol: "OCTO",
    name: "OctoFi",
    icon: "🐙",
    balance: "10,000 OCTO",
    valueUSD: "$500.00",
    change24h: "-1.2%",
    prediction: "MEDIA",
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
    prediction: "BAJA",
    predictionColor: "bg-gray-500",
    apy: "2.0%",
    trend: "up"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Portfolio Summary */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm text-muted-foreground mb-2">Resumen del Portafolio</h2>
                <div className="text-4xl font-black">$12,345.67</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-green-500 font-semibold">+$123.45 (+1.02%)</span>
                  <span className="text-muted-foreground text-sm">Últimas 24 horas</span>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Status & Gas Fees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Estado del Agente</h3>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                  ● ACTIVO
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Última acción: Swap ETH for OCTO - 2023-10-27 10:30 AM
              </p>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => navigate("/agent-status")}
              >
                Pausar Agente
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold">Tarifa de Gas (Gwei)</h3>
              <div className="text-4xl font-black">55 <span className="text-xl text-muted-foreground">Gwei</span></div>
              <p className="text-sm text-muted-foreground">
                Tiempo óptimo para transacciones: <span className="text-foreground">en ~15 mins</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Assets Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <h3 className="font-bold mb-6">Activos</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Asset</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Balance</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Valor (USD)</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">24h %</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">Predicción IA</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground">APY</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset, i) => (
                    <tr 
                      key={i}
                      className="border-b border-border/30 hover:bg-muted/20 cursor-pointer transition-colors"
                      onClick={() => navigate(`/asset/${asset.symbol.toLowerCase()}`)}
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
