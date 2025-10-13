import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CTASection = () => {
  const navigate = useNavigate();
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const handleLaunchApp = () => {
    // Navigate to main application
    navigate("/dashboard");
  };

  const handleJoinCommunity = () => {
    // Open community link in new tab
    window.open("https://discord.gg/octofi", "_blank", "noopener,noreferrer");
  };

  return (
    <section 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden"
      aria-labelledby="cta-heading"
      role="region"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary" />
      
      {/* Content container */}
      <div className="container relative z-10 px-4 mx-auto text-center">
        <div className={`max-w-3xl mx-auto space-y-8 transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          {/* Main CTA heading */}
          <h2 
            id="cta-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight px-4 sm:px-0"
          >
            Let's Build the Future of Finance Together
          </h2>
          
          {/* Supporting text */}
          <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto px-4 sm:px-0">
            Join thousands of users who are already harnessing the power of AI to optimize their DeFi investments.
          </p>
          
          {/* Action buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 px-4 sm:px-0"
            role="group"
            aria-label="Call to action buttons"
          >
            <Button
              onClick={handleLaunchApp}
              size="lg"
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary font-bold hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-105 hover-lift relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary text-sm sm:text-base"
              aria-describedby="launch-app-description"
            >
              <span className="relative z-10">Launch Application</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <span id="launch-app-description" className="sr-only">
              Navigate to the OctoFi dashboard to start using the application
            </span>
            
            <Button
              onClick={handleJoinCommunity}
              variant="outline"
              size="lg"
              className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-bold hover:bg-white hover:text-primary transition-all duration-300 hover:shadow-lg hover:scale-105 hover-lift relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary text-sm sm:text-base"
              aria-describedby="join-community-description"
            >
              <span className="relative z-10">Join Our Community</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <span id="join-community-description" className="sr-only">
              Opens Discord community in a new tab
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;