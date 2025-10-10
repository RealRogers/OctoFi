import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, CheckCircle2, Fuel, ArrowRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useNavigate } from "react-router-dom";

const AgentStatus = () => {
  const navigate = useNavigate();

  const metrics = [
    { label: "ROI Agente", value: "+12.4%", description: "Excelente rendimiento", color: "text-green-500" },
    { label: "vs Hold", value: "+4.2%", description: "Superando al mercado", color: "text-blue-500" },
    { label: "Éxito Ops", value: "87%", description: "23 de 26 operaciones", color: "text-foreground" },
    { label: "Gas Ahorrado", value: "$145", description: "vs. ejecución manual", color: "text-foreground" }
  ];

  const decisions = [
    {
      title: "Rebalanceó 0.5 ETH → USDC",
      time: "Hace 2 horas",
      reason: "Detectó una alta volatilidad en ETH y movió fondos a una posición estable para mitigar el riesgo.",
      status: "Completado",
      gas: "$4.12"
    },
    {
      title: "Aumentó posición USDC → Aave",
      time: "Hace 6 horas",
      reason: "Las tasas de interés en el pool de USDC en Aave superaron el umbral del 5%, maximizando el rendimiento.",
      status: "Completado",
      gas: "$6.78"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-br from-green-500/10 to-primary/10 border-green-500/20">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black">AGENTE ACTIVO</h1>
                    <p className="text-muted-foreground">Última acción: Hace 45 minutos</p>
                  </div>
                </div>
                <p className="text-lg">Rebalanceó 0.3 ETH → USDC</p>
              </div>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:shadow-[var(--glow-primary)]"
              >
                <Pause className="mr-2 h-5 w-5" />
                PAUSAR AGENTE
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 space-y-2">
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <div className={`text-3xl font-black ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Decisions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">Decisiones Recientes</h2>
          </div>

          <div className="space-y-4">
            {decisions.map((decision, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-bold">{decision.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        <strong>Razón:</strong> {decision.reason}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-muted-foreground">Estado:</span>
                          <span className="font-semibold">{decision.status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Fuel className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">Gas:</span>
                          <span className="font-semibold">{decision.gas}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {decision.time}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              className="text-primary hover:text-primary"
              onClick={() => {}}
            >
              Ver historial completo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AgentStatus;
