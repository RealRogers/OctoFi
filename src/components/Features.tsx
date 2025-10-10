import { TrendingUp, Shield, Zap, Coins, RefreshCw, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: TrendingUp,
    title: "Lending & Borrowing",
    description: "Earn interest on your assets or borrow against your crypto holdings with competitive rates."
  },
  {
    icon: Coins,
    title: "Staking Rewards",
    description: "Stake your tokens and earn passive income with up to 25% APY on supported assets."
  },
  {
    icon: RefreshCw,
    title: "Token Swaps",
    description: "Trade tokens instantly across multiple DEXs with the best rates and lowest fees."
  },
  {
    icon: Shield,
    title: "Secure Vaults",
    description: "Store your assets in audited smart contracts with institutional-grade security."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Execute transactions in seconds with our optimized blockchain infrastructure."
  },
  {
    icon: Lock,
    title: "Non-Custodial",
    description: "You always maintain full control of your assets. Your keys, your crypto."
  }
];

const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-background" />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Everything You Need in{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              One Platform
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Access a complete suite of DeFi services designed for both beginners and advanced users.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
