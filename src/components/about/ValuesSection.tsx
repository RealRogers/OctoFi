import { Shield, Eye, Rocket } from "lucide-react";
import ValueCard from "./ValueCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ValuesSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden"
      aria-labelledby="values-heading"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-secondary/5 rounded-full blur-[100px]" />
      
      <div className="container relative z-10 px-4 mx-auto">
        {/* Section Header */}
        <div className={`text-center max-w-4xl mx-auto mb-20 transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-block px-6 py-3 rounded-full bg-muted/50 backdrop-blur-sm border border-primary/20 mb-8">
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Core Principles
            </span>
          </div>
          
          <h2 
            id="values-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
          >
            Built on a{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Foundation of Trust
            </span>
          </h2>
          
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Every line of code, every design decision, and every feature of OctoFi is guided by three 
            fundamental values that define who we are and where we're going.
          </p>
        </div>
        
        {/* Values Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto transition-all duration-1000 delay-300 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}>
          {[
            {
              icon: Shield,
              title: "Security First",
              description: "Our top priority. From audited contracts to secure data management, every line of code is written with a defensive security mindset. We implement multiple layers of protection, continuous audits, and industry best practices to ensure your funds are always protected."
            },
            {
              icon: Eye,
              title: "Radical Transparency",
              description: "We believe AI shouldn't be a black box. Our interface is designed to show you exactly what decisions your agent makes and, most importantly, why. Every transaction, every strategy, and every recommendation comes with clear explanations and verifiable data."
            },
            {
              icon: Rocket,
              title: "Constant Innovation",
              description: "The DeFi space evolves at the speed of light. We're committed to continuous research and development to ensure your agent always has the most advanced models, the most effective strategies, and the latest ecosystem integrations."
            }
          ].map((value, i) => (
            <ValueCard
              key={i}
              icon={value.icon}
              title={value.title}
              description={value.description}
              index={i}
            />
          ))}
        </div>
        
        {/* Bottom section with additional context */}
        <div className="text-center mt-20">
          <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/20">
            <p className="text-lg font-medium text-foreground mb-4">
              These values aren't just words on a webpage.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              They are the principles that guide every technical decision, every user interaction, and every step toward 
              the future of decentralized finance. When you choose OctoFi, you choose a partner committed to 
              excellence, transparency, and responsible innovation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;