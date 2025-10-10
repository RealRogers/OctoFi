import { Wallet, Search, ArrowRight, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    number: "01",
    title: "Connect Your Wallet",
    description: "Link your favorite Web3 wallet like MetaMask, WalletConnect, or Coinbase Wallet in seconds."
  },
  {
    icon: Search,
    number: "02",
    title: "Explore Opportunities",
    description: "Browse lending pools, staking options, and yield farming strategies across multiple chains."
  },
  {
    icon: ArrowRight,
    number: "03",
    title: "Execute Transactions",
    description: "Invest with one click. Our smart routing ensures you get the best rates automatically."
  },
  {
    icon: CheckCircle2,
    number: "04",
    title: "Track & Optimize",
    description: "Monitor your portfolio in real-time and adjust your strategy to maximize returns."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Get Started in{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Minutes
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to start earning with DeFi
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="relative z-10 text-center space-y-4">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-[var(--glow-primary)]">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                
                <div className="text-5xl font-black text-primary/20">
                  {step.number}
                </div>
                
                <h3 className="text-xl font-bold">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
