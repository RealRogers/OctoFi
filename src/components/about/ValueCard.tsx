import { LucideIcon } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const ValueCard = ({ icon: Icon, title, description, index }: ValueCardProps) => {
  const { ref: cardRef, isVisible } = useScrollAnimation({ 
    threshold: 0.3,
    triggerOnce: true 
  });

  return (
    <div 
      ref={cardRef}
      className={`group relative overflow-hidden p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover-lift cursor-pointer ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        transitionDelay: isVisible ? `${index * 200}ms` : '0ms'
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
              animationDelay: `${i * 300}ms`,
            }}
          />
        ))}
      </div>
      
      {/* Icon container with enhanced styling */}
      <div className="relative z-10 mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative hover-lift">
          {/* Icon glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
          
          <Icon className="w-10 h-10 text-primary relative z-10 group-hover:text-accent transition-colors duration-300" />
          
          {/* Corner accent */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 space-y-4">
        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        
        {/* Animated underline */}
        <div className="w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-16 transition-all duration-500" />
        
        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
          {description}
        </p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-6 right-6 w-2 h-2 bg-primary/30 rounded-full group-hover:bg-primary/60 group-hover:scale-150 transition-all duration-300" />
      <div className="absolute bottom-6 left-6 w-1 h-1 bg-secondary/30 rounded-full group-hover:bg-secondary/60 group-hover:scale-150 transition-all duration-300" />
      
      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/30 transition-colors duration-500" />
    </div>
  );
};

export default ValueCard;