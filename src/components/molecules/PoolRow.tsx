import { Button } from "@/components/ui/button";

interface PoolRowProps {
  iconUrl: string;
  assetName: string;
  apy: string;
  totalStaked: string;
}

const PoolRow: React.FC<PoolRowProps> = ({
  iconUrl,
  assetName,
  apy,
  totalStaked,
}) => {
  const handleStake = () => {
    console.log(`Stake ${assetName}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center py-4 px-6 border-t border-border/50 first:border-t-0 hover:bg-muted/20 transition-colors">
      {/* Column 1: Asset */}
      <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
        <img
          src={iconUrl}
          alt={`${assetName} icon`}
          className="w-10 h-10 rounded-full"
        />
        <span className="text-foreground font-medium">{assetName}</span>
      </div>

      {/* Column 2: APY */}
      <div className="text-green-500 font-semibold">{apy}</div>

      {/* Column 3: Total Staked (TVL) */}
      <div className="text-foreground">{totalStaked}</div>

      {/* Column 4: Action Button */}
      <div className="flex justify-end col-span-2 sm:col-span-1">
        <Button
          onClick={handleStake}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground min-h-[44px] min-w-[44px] transition-opacity focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={`Stake ${assetName}`}
        >
          Stake
        </Button>
      </div>
    </div>
  );
};

export default PoolRow;
