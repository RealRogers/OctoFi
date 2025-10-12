import PoolRow from "@/components/molecules/PoolRow";

const AvailablePools: React.FC = () => {
  const pools = [
    {
      iconUrl: "/placeholder.svg",
      assetName: "USD Coin",
      apy: "5.1%",
      totalStaked: "$12.5M",
    },
    {
      iconUrl: "/placeholder.svg",
      assetName: "Tether",
      apy: "4.9%",
      totalStaked: "$25.2M",
    },
    {
      iconUrl: "/placeholder.svg",
      assetName: "Arbitrum",
      apy: "11.3%",
      totalStaked: "$8.1M",
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Pools Disponibles</h2>
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-4 bg-gray-950">
          <div className="text-sm text-gray-400 font-medium col-span-2 sm:col-span-1">Activo</div>
          <div className="text-sm text-gray-400 font-medium">APY</div>
          <div className="text-sm text-gray-400 font-medium">Total Staked (TVL)</div>
          <div className="hidden sm:block"></div>
        </div>

        {/* Table Body */}
        <div>
          {pools.map((pool, index) => (
            <PoolRow
              key={index}
              iconUrl={pool.iconUrl}
              assetName={pool.assetName}
              apy={pool.apy}
              totalStaked={pool.totalStaked}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AvailablePools;
