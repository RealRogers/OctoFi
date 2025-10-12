import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { WalletModal } from "@/components/modals/WalletModal";
import { Wallet } from "lucide-react";

interface ConnectWalletButtonProps {
  className?: string;
}

export function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className || "bg-gradient-to-r from-primary to-accent hover:shadow-[var(--glow-primary)] transition-all duration-300"}>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <WalletModal />
    </Dialog>
  );
}
