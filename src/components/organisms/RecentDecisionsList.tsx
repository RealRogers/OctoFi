import DecisionCard from "@/components/molecules/DecisionCard";

const RecentDecisionsList = () => {
  const decisions = [
    {
      title: "Rebalanceó 0.5 ETH → USDC",
      reason: "Detectó una alta volatilidad en ETH y movió fondos a una posición estable para mitigar el riesgo.",
      timestamp: "Hace 2 horas",
      status: "Completado",
      gasFee: "$4.12"
    },
    {
      title: "Aumentó posición USDC → Aave",
      reason: "Las tasas de interés en el pool de USDC en Aave superaron el umbral del 5%, maximizando el rendimiento.",
      timestamp: "Hace 6 horas",
      status: "Completado",
      gasFee: "$6.78"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Decisiones Recientes</h2>
      
      <div className="space-y-4">
        {decisions.map((decision, index) => (
          <DecisionCard
            key={index}
            title={decision.title}
            reason={decision.reason}
            timestamp={decision.timestamp}
            status={decision.status}
            gasFee={decision.gasFee}
          />
        ))}
      </div>
      
      <div className="text-right">
        <a 
          href="#" 
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          Ver historial completo →
        </a>
      </div>
    </div>
  );
};

export default RecentDecisionsList;