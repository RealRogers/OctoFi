import { TrendingUp, Shield, Zap, Coins, RefreshCw, Lock, Pause, FileText, Brain, Search, ArrowUpRight, ShieldCheck, Settings, Link } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Lock,
    title: "Non-custodial",
    description: "Users always maintain custody of their funds. Your money, your control."
  },
  {
    icon: Pause,
    title: "Pausable Agent",
    description: "The user can stop and resume the AI agent at any time."
  },
  {
    icon: FileText,
    title: "Transparency",
    description: "Access to detailed reports and performance history of your investments."
  },
  {
    icon: Brain,
    title: "AI Market Analysis",
    description: "Analyzes market trends in real-time, using on-chain data for precise insights."
  },
  {
    icon: ArrowUpRight,
    title: "Predictive Intelligence",
    description: "Predicts asset performance with advanced AI models, forecasting gains and risks."
  },
  {
    icon: RefreshCw,
    title: "Autonomous Reallocation",
    description: "Reallocates portfolios automatically to maximize profits and minimize risks in real-time."
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
    icon: TrendingUp,
    title: "Yield Optimization",
    description: "Maximize your returns with our AI-powered yield optimization strategies."
  },
  {
    icon: ShieldCheck,
    title: "Risk Minimization",
    description: "Intelligent risk management, detecting volatility and protecting investments."
  },
  {
    icon: Settings,
    title: "Customizable Strategies",
    description: "Personalize your agent with preferences, from risk tolerance to preferred assets."
  },
  {
    icon: Link,
    title: "On-Chain Autonomy",
    description: "Autonomous agents on Somnia blockchain, with secure and decentralized executions."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-background" />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Powered by{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience the future of DeFi with autonomous AI agents that analyze, predict, and optimize your investments 24/7.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-105"
            >
              {/* Glow effect for AI features */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="relative p-6 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
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
