import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import AgentStatusHeader from "@/components/organisms/AgentStatusHeader";
import PerformanceMetricsGrid from "@/components/organisms/PerformanceMetricsGrid";
import RecentDecisionsList from "@/components/organisms/RecentDecisionsList";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";

const AgentDashboardPage = () => {
  // Estado para controlar si el agente está activo o pausado
  const [isAgentActive, setIsAgentActive] = useState(true);
  
  // Estado para filtrar las decisiones recientes
  const [decisionFilter, setDecisionFilter] = useState("all");
  
  // Estado para mostrar/ocultar detalles adicionales
  const [showDetails, setShowDetails] = useState(false);

  // Función para manejar la pausa/activación del agente
  const handleAgentToggle = () => {
    setIsAgentActive(!isAgentActive);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Agent Status Header con manejo de estado */}
        <div onClick={handleAgentToggle}>
          <AgentStatusHeader />
        </div>
        
        {/* Performance Metrics Grid */}
        <PerformanceMetricsGrid />
        
        {/* Filtros para decisiones recientes */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Decisiones Recientes</h2>
          <div className="flex items-center gap-4">
            <Select value={decisionFilter} onValueChange={setDecisionFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filtrar por" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las decisiones</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="failed">Fallidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Recent Decisions List */}
        <RecentDecisionsList />
        
        {/* Detalles adicionales que se pueden mostrar/ocultar */}
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Ocultar detalles" : "Mostrar más detalles"}
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          
          {showDetails && (
            <Card className="mt-4 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Detalles del Agente</h3>
                  <p className="text-sm text-gray-300">
                    Este agente ha estado operando durante 45 días con un rendimiento superior al mercado.
                    Las estrategias implementadas han generado un ahorro significativo en costos de gas
                    y han optimizado el rendimiento de la cartera en condiciones de mercado volátiles.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Fecha de creación:</span>
                      <span className="ml-2 text-white">15 de Octubre, 2023</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Última actualización:</span>
                      <span className="ml-2 text-white">Hoy, 10:45 AM</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Operaciones totales:</span>
                      <span className="ml-2 text-white">156</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Nivel de riesgo:</span>
                      <span className="ml-2 text-white">Moderado</span>
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