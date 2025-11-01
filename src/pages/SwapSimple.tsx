import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const SwapSimple = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("0.0");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");

  const handleSwap = () => {
    // Swap tokens
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    
    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setFromAmount(value);
      // Simple conversion (mock)
      const numValue = parseFloat(value) || 0;
      setToAmount((numValue * 1850).toFixed(2));
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Swap Tokens
          </h1>
          <p className="text-muted-foreground mt-2">
            Exchange your tokens instantly
          </p>
        </div>

        {/* Swap Card */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-xl">
          {/* From Section */}
          <div className="space-y-2 mb-4">
            <label className="text-sm text-muted-foreground">From</label>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={handleFromAmountChange}
                  className="bg-transparent text-4xl font-bold text-foreground outline-none w-full placeholder:text-muted-foreground/30"
                />
                <select
                  value={fromToken}
                  onChange={(e) => setFromToken(e.target.value)}
                  className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold cursor-pointer"
                >
                  <option value="ETH">ETH</option>
                  <option value="BTC">BTC</option>
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
              <div className="text-sm text-muted-foreground">
                Balance: 0.0 {fromToken}
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwap}
              className="bg-card border-2 border-border rounded-full p-3 hover:bg-muted transition-all hover:rotate-180 duration-300"
            >
              <ArrowUpDown className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* To Section */}
          <div className="space-y-2 mb-6">
            <label className="text-sm text-muted-foreground">To</label>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-4xl font-bold text-foreground">
                  {toAmount}
                </div>
                <select
                  value={toToken}
                  onChange={(e) => setToToken(e.target.value)}
                  className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold cursor-pointer"
                >
                  <option value="ETH">ETH</option>
                  <option value="BTC">BTC</option>
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
              <div className="text-sm text-muted-foreground">
                Balance: 0.0 {toToken}
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-2 py-4 border-t border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="text-foreground">1 {fromToken} = 1,850 {toToken}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price Impact</span>
              <span className="text-green-500">{"<0.01%"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="text-foreground">~$5.42</span>
            </div>
          </div>

          {/* Swap Button */}
          <Button
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-6 text-lg"
            disabled={!fromAmount || parseFloat(fromAmount) <= 0}
          >
            {!fromAmount || parseFloat(fromAmount) <= 0
              ? "Enter Amount"
              : "Connect Wallet to Swap"}
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-card/30 border border-border/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">🔒 Secure</h3>
            <p className="text-sm text-muted-foreground">
              Your funds are always under your control
            </p>
          </div>
          <div className="bg-card/30 border border-border/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">⚡ Fast</h3>
            <p className="text-sm text-muted-foreground">
              Instant swaps with the best rates
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SwapSimple;
