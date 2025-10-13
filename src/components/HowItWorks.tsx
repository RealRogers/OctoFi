import { Wallet, Search, Brain, ArrowRight, RefreshCw, Settings } from "lucide-react";

const steps = [
  {
    icon: Wallet,
    number: "01",
    title: "Connect Your Wallet",
    description: "Link your favorite Web3 wallet like MetaMask, WalletConnect, or Coinbase Wallet in seconds.",
    aiFeature: false
  },
  {
    icon: Search,
    number: "02",
    title: "Explore Opportunities",
    description: "Browse lending pools, staking options, and yield farming strategies across multiple chains.",
    aiFeature: false
  },
  {
    icon: Brain,
    number: "03",
    title: "AI Market Analysis",
    description: "Our AI agent analyzes market trends across multiple chains, predicting asset performance using real-time on-chain data and machine learning algorithms.",
    aiFeature: true
  },
  {
    icon: ArrowRight,
    number: "04",
    title: "Execute Transactions",
    description: "Invest with one click. Our smart routing ensures you get the best rates automatically.",
    aiFeature: false
  },
  {
    icon: RefreshCw,
    number: "05",
    title: "Autonomous Reallocation",
    description: "The agent automatically adjusts your portfolio in real-time, minimizing risks and maximizing returns based on market conditions and your preferences.",
    aiFeature: true
  },
  {
    icon: Settings,
    number: "06",
    title: "Customize Your Strategy",
    description: "Set your risk tolerance, investment preferences, and strategy parameters to create a personalized AI agent tailored to your goals.",
    aiFeature: true
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Your{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              AI Agent
            </span>{" "}
            in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience autonomous DeFi decision-making with our intelligent agent that analyzes markets, predicts trends, and optimizes your portfolio in real-time
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8 lg:gap-6 xl:gap-4">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`hidden xl:block absolute top-20 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 ${
                  step.aiFeature || steps[index + 1]?.aiFeature
                    ? 'bg-gradient-to-r from-accent/60 to-primary/30'
                    : 'bg-gradient-to-r from-primary/50 to-transparent'
                }`} />
              )}
              {/* Connector line for 3-column layout */}
              {index < steps.length - 1 && (index + 1) % 3 !== 0 && (
                <div className={`hidden lg:block xl:hidden absolute top-20 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 ${
                  step.aiFeature || steps[index + 1]?.aiFeature
                    ? 'bg-gradient-to-r from-accent/60 to-primary/30'
                    : 'bg-gradient-to-r from-primary/50 to-transparent'
                }`} />
              )}
              
              <div className="relative z-10 text-center space-y-4">
                <div className={`mx-auto w-20 h-20 rounded-2xl backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                  step.aiFeature 
                    ? 'bg-gradient-to-br from-accent/30 to-primary/30 border border-accent/30 group-hover:scale-110 group-hover:shadow-[0_0_40px_hsl(280_85%_68%/0.6)] group-hover:border-accent/50' 
                    : 'bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 group-hover:scale-110 group-hover:shadow-[var(--glow-primary)]'
                }`}>
                  <step.icon className={`w-10 h-10 ${step.aiFeature ? 'text-accent' : 'text-primary'}`} />
                </div>
                
                <div className={`text-5xl font-black ${
                  step.aiFeature ? 'text-accent/30' : 'text-primary/20'
                }`}>
                  {step.number}
                </div>
                
                <h3 className={`text-xl font-bold ${
                  step.aiFeature 
                    ? 'bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent' 
                    : ''
                }`}>
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
