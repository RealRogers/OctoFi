import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-muted/20" />
      
      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      
      <div className="container relative z-10 px-4 mx-auto text-center pt-20">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <img 
              src="/OctoFi-Logo.png" 
              alt="OctoFi Logo" 
              className="h-24 w-auto md:h-32 lg:h-40 object-contain"
            />
          </div>
          
          <div className="inline-block px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-primary/20 mb-6">
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Personal AI Agent for DeFi
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
            Your Personal AI Agent for{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
              DeFi
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Autonomous yield optimization. You maintain control.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-[var(--glow-primary)] transition-all duration-300 text-lg px-8 py-6"
              onClick={() => navigate("/dashboard")}
            >
              <Wallet className="mr-2 h-5 w-5" />
              Launch App
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary/30 hover:border-primary hover:bg-primary/10 text-lg px-8 py-6 transition-all duration-300"
            >
              View Demo
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary/30 hover:border-primary hover:bg-primary/10 text-lg px-8 py-6 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-3xl mx-auto">
            {[
              { value: "$2.5B+", label: "Total Value Locked" },
              { value: "150K+", label: "Active Users" },
              { value: "15+", label: "Supported Chains" },
              { value: "99.9%", label: "Uptime" }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
