import { Button } from "@/components/ui/button";

interface PositionCardProps {
  imageUrl: string;
  tokenName: string;
  apy: string;
  stakedAmount: string;
  rewardsEarned: string;
}

const PositionCard: React.FC<PositionCardProps> = ({
  imageUrl,
  tokenName,
  apy,
  stakedAmount,
  rewardsEarned,
}) => {
  const handleClaim = () => {
    console.log(`Claim rewards for ${tokenName}`);
  };

  const handleWithdraw = () => {
    console.log(`Withdraw ${tokenName}`);
  };

  return (
    <div className="bg-blue-900/20 rounded-2xl p-6 flex flex-col h-full">
      {/* Top Section */}
      <div>
        <img
          src={imageUrl}
          alt={`${tokenName} logo`}
          className="w-16 h-16 rounded-xl mb-4"
        />
        <h3 className="text-xl font-bold text-white mb-1">{tokenName}</h3>
        <div className="text-sm text-gray-400">APY: {apy}</div>
      </div>

      {/* Middle Section */}
      <div className="mt-6">
        <div className="mb-3">
          <div className="text-sm text-gray-400 mb-1">Monto en Staking</div>
          <div className="text-lg font-semibold text-white">{stakedAmount}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Recompensas Ganadas</div>
          <div className="text-lg font-semibold text-white">{rewardsEarned}</div>
        </div>
      </div>

      {/* Bottom Section (Footer) */}
      <div className="mt-auto pt-6 flex items-center gap-2 justify-end">
        <Button
          onClick={handleClaim}
          className="bg-gray-800 hover:bg-gray-700 text-white min-h-[44px] min-w-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-blue-900/20"
          aria-label={`Claim rewards for ${tokenName}`}
        >
          Reclamar
        </Button>
        <Button
          onClick={handleWithdraw}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white min-h-[44px] min-w-[44px] transition-opacity focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-blue-900/20"
          aria-label={`Withdraw ${tokenName}`}
        >
          Retirar
        </Button>
      </div>
    </div>
  );
};

export default PositionCard;
