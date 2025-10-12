import MetricCard from "@/components/molecules/MetricCard";

const PerformanceMetricsGrid = () => {
  const metrics = [
    {
      title: "ROI Agente",
      value: "+12.4%",
      subtext: "Excelente rendimiento",
      valueColor: "green" as const
    },
    {
      title: "vs Hold",
      value: "+4.2%",
      subtext: "Superando al mercado",
      valueColor: "blue" as const
    },
    {
      title: "Éxito Ops",
      value: "87%",
      subtext: "23 de 26 operaciones",
      valueColor: "default" as const
    },
    {
      title: "Gas Ahorrado",
      value: "$145",
      subtext: "vs. ejecución manual",
      valueColor: "default" as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          subtext={metric.subtext}
          valueColor={metric.valueColor}
        />
      ))}
    </div>
  );
};

export default PerformanceMetricsGrid;