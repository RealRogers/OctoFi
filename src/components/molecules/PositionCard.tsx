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
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex flex-col h-full hover:border-primary/50 transition-all duration-300">
      {/* Top Section */}
      <div>
        <img
          src={imageUrl}
          alt={`${tokenName} logo`}
          className="w-16 h-16 rounded-xl mb-4"
        />
        <h3 className="text-xl font-bold text-foreground mb-1">{tokenName}</h3>
        <div className="text-sm text-muted-foreground">APY: {apy}</div>
      </div>

      {/* Middle Section */}
      <div className="mt-6">
        <div className="mb-3">
          <div className="text-sm text-muted-foreground mb-1">Staked Amount</div>
          <div className="text-lg font-semibold text-foreground">{stakedAmount}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Rewards Earned</div>
          <div className="text-lg font-semibold text-foreground">{rewardsEarned}</div>
        </div>
      </div>

      {/* Bottom Section (Footer) */}
      <div className="mt-auto pt-6 flex items-center gap-2 justify-end">
        <Button
          onClick={handleClaim}
          className="bg-muted hover:bg-muted/80 text-foreground min-h-[44px] min-w-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={`Claim rewards for ${tokenName}`}
        >
          Claim
        </Button>
        <Button
          onClick={handleWithdraw}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground min-h-[44px] min-w-[44px] transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={`Withdraw ${tokenName}`}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default PositionCard;
