import AppLayout from "@/components/AppLayout";
import UserPositions from "@/components/organisms/UserPositions";
import AvailablePools from "@/components/organisms/AvailablePools";

const Stake = () => {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Stake</h1>
        <UserPositions />
        <AvailablePools />
      </div>
    </AppLayout>
  );
};

export default Stake;
