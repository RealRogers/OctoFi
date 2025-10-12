import PositionCard from "@/components/molecules/PositionCard";

const UserPositions: React.FC = () => {
  const positions = [
    {
      imageUrl: "/placeholder.svg",
      tokenName: "Ethereum",
      apy: "4.5%",
      stakedAmount: "2.5 ETH",
      rewardsEarned: "0.01 ETH",
    },
    {
      imageUrl: "/placeholder.svg",
      tokenName: "Optimism",
      apy: "8.2%",
      stakedAmount: "1,250 OP",
      rewardsEarned: "15.3 OP",
    },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Your Positions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {positions.map((position, index) => (
          <PositionCard
            key={index}
            imageUrl={position.imageUrl}
            tokenName={position.tokenName}
            apy={position.apy}
            stakedAmount={position.stakedAmount}
            rewardsEarned={position.rewardsEarned}
          />
        ))}
      </div>
    </section>
  );
};

export default UserPositions;
