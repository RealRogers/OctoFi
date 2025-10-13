import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const MissionSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden"
      aria-labelledby="mission-heading"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-background" />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column - Logo Display */}
          <div className={`flex justify-center lg:justify-start order-2 lg:order-1 transition-all duration-1000 delay-200 ${
            isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8'
          }`}>
            <div className="relative group">
              {/* Main logo container with octopus-circuit design */}
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/10 group-hover:border-primary/30 transition-all duration-500 relative overflow-hidden hover-lift cursor-pointer">
                {/* Animated rings around the logo */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse group-hover:border-primary/40 transition-colors duration-300"></div>
                <div className="absolute inset-4 rounded-full border border-secondary/20 animate-pulse delay-300 group-hover:border-secondary/40 transition-colors duration-300"></div>
                <div className="absolute inset-8 rounded-full border border-accent/20 animate-pulse delay-700 group-hover:border-accent/40 transition-colors duration-300"></div>
                
                {/* Circuit pattern background */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    <defs>
                      <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M0 20h40M20 0v40" stroke="currentColor" strokeWidth="1" className="text-primary/30"/>
                        <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary/50"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="400" fill="url(#circuit)"/>
                  </svg>
                </div>
                
                {/* OctoFi Logo */}
                <div className="relative z-10 text-center">
                  <div className="relative mb-6">
                    {/* Logo container */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-primary/20 p-4 sm:p-6">
                      <img 
                        src="/OctoFi-Logo.png" 
                        alt="OctoFi Logo - Intelligent DeFi Agent" 
                        className="w-full h-full object-contain filter drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  
                  <div className="text-3xl sm:text-4xl font-black text-primary mb-2 group-hover:scale-105 transition-transform duration-300">
                    OctoFi
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Intelligent DeFi Agent
                  </div>
                </div>
              </div>
              
              {/* Floating data nodes */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/30 rounded-full animate-bounce delay-100 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-secondary/30 rounded-full animate-bounce delay-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
              </div>
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-accent/30 rounded-full animate-bounce delay-700 flex items-center justify-center">
                <div className="w-1 h-1 bg-accent rounded-full"></div>
              </div>
              <div className="absolute bottom-1/4 -left-4 w-5 h-5 bg-primary/20 rounded-full animate-bounce delay-200 flex items-center justify-center">
                <div className="w-1 h-1 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Mission Content */}
          <div className={`space-y-8 text-center lg:text-left order-1 lg:order-2 transition-all duration-1000 delay-400 ${
            isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-8'
          }`}>
            <div className="space-y-6">
              <h2 
                id="mission-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight"
              >
                Our{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
              
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto lg:mx-0 rounded-full"></div>
            </div>
            
            {/* Mission content */}
            <div className="space-y-4 sm:space-y-6 leading-relaxed px-4 sm:px-0">
              <p className="text-base sm:text-lg md:text-xl text-foreground/90 font-medium">
                The DeFi ecosystem evolves at breakneck speed, creating extraordinary opportunities but also 
                complex risks that require constant vigilance and informed decisions 24 hours a day.
              </p>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                OctoFi was born to solve this fundamental problem: <strong className="text-foreground">how can an individual investor 
                compete with institutions that have dedicated teams of analysts and sophisticated algorithms?</strong>
              </p>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
                Our answer is simple but revolutionary: democratize access to financial artificial intelligence. 
                Every OctoFi user gets their own autonomous agent that acts as an <em className="text-primary">intelligent copilot</em>, 
                monitoring markets, identifying opportunities and executing optimized strategies while you maintain full control.
              </p>
              
              <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                <p className="text-lg font-medium text-foreground mb-2">
                  "It's not about replacing your judgment, but amplifying your ability to make informed decisions."
                </p>
                <p className="text-sm text-muted-foreground">
                  — OctoFi's core philosophy
                </p>
              </div>
            </div>
            
            {/* Mission highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6">
              {[
                { number: "24/7", label: "Active Monitoring" },
                { number: "100%", label: "User Control" },
                { number: "15+", label: "Supported Protocols" },
                { number: "99.9%", label: "Uptime" }
              ].map((stat, i) => (
                <div 
                  key={i}
                  className="p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 text-center lg:text-left"
                >
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;