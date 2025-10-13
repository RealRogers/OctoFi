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
      <h2 className="text-2xl font-bold text-foreground mb-6">Available Pools</h2>
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-4 bg-card/80 border-b border-border/50">
          <div className="text-sm text-muted-foreground font-medium col-span-2 sm:col-span-1">Asset</div>
          <div className="text-sm text-muted-foreground font-medium">APY</div>
          <div className="text-sm text-muted-foreground font-medium">Total Staked (TVL)</div>
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
