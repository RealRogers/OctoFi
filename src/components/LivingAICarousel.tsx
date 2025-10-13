import { useState, useEffect } from 'react';
import { BrainCircuit, ArrowRightLeft, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

interface AIFeature {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const aiFeatures: AIFeature[] = [
  {
    id: 1,
    icon: BrainCircuit,
    title: "Predictive Market Analysis",
    description: "Our AI analyzes thousands of on-chain data points in real-time to predict market trends before they happen, giving you a strategic advantage.",
    color: "from-primary to-accent"
  },
  {
    id: 2,
    icon: ArrowRightLeft,
    title: "Autonomous Portfolio Rebalancing",
    description: "Based on predictions and your risk profile, the agent automatically reallocates assets, moving funds to stable positions to mitigate risks or to high-potential assets to maximize gains.",
    color: "from-secondary to-primary"
  },
  {
    id: 3,
    icon: Shield,
    title: "Dynamic Risk Optimization",
    description: "The agent constantly monitors volatility and liquidity. If it detects dangerous market conditions, it can pause operations or take defensive actions to protect your capital.",
    color: "from-accent to-secondary"
  }
];

const LivingAICarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveIndex((current) => (current + 1) % aiFeatures.length);
            return 0;
          }
          return prev + 1;
        });
      }, 50); // Update every 50ms for smooth progress

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % aiFeatures.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + aiFeatures.length) % aiFeatures.length);
    setProgress(0);
  };

  const activeFeature = aiFeatures[activeIndex];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Living{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Features
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience the intelligence that never sleeps, constantly evolving to protect and grow your investments.
          </p>
        </div>

        {/* Main Carousel Container */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center max-w-7xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Column - Living AI Core (40% width) */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-xl animate-pulse" />
              
              {/* Main AI Core Container */}
              <div className="group relative w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/30 flex items-center justify-center animate-pulse-glow hover:border-primary/50 transition-all duration-500">
                {/* Animated Circuit Rings */}
                <div className="absolute inset-4 rounded-full border-2 border-primary/40 animate-spin-slow">
                  {/* Circuit nodes */}
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-primary rounded-full"
                      style={{
                        top: i % 2 === 0 ? '-4px' : 'calc(100% - 4px)',
                        left: i < 2 ? '-4px' : 'calc(100% - 4px)',
                      }}
                    />
                  ))}
                </div>
                <div className="absolute inset-8 rounded-full border border-secondary/40 animate-spin-reverse">
                  {/* Inner circuit nodes */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-secondary rounded-full"
                      style={{
                        transform: `rotate(${i * 60}deg) translateY(-50%)`,
                        top: '50%',
                        left: '50%',
                        transformOrigin: '0 50%',
                        marginTop: '-3px'
                      }}
                    />
                  ))}
                </div>
                <div className="absolute inset-12 rounded-full border border-accent/40 animate-pulse" />
                
                {/* Central OctoFi Logo */}
                <div className="relative z-10 w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm border-2 border-primary/30 flex items-center justify-center p-6 group-hover:scale-110 transition-transform duration-500">
                  <img 
                    src="/OctoFi-Logo.png" 
                    alt="OctoFi AI Core" 
                    className="w-full h-full object-contain rounded-full transition-all duration-500 group-hover:rotate-12"
                  />
                  {/* Inner glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Tentacle-like Energy Lines */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1 bg-gradient-to-r ${activeFeature.color} opacity-60 transition-all duration-1000 ease-in-out`}
                    style={{
                      height: '80px',
                      transformOrigin: 'bottom center',
                      transform: `rotate(${i * 45 + (activeIndex * 15)}deg) translateY(-50%)`,
                      top: '50%',
                      left: '50%',
                      marginLeft: '-2px'
                    }}
                  />
                ))}

                {/* Floating Data Particles */}
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${activeFeature.color} animate-float`}
                    style={{
                      top: `${20 + Math.sin(i * 60) * 30}%`,
                      left: `${20 + Math.cos(i * 60) * 30}%`,
                      animationDelay: `${i * 0.5}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Feature Content (60% width) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Feature Content */}
            <div className="space-y-6 animate-fade-in-up">
              {/* Feature Icon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${activeFeature.color} bg-opacity-20 flex items-center justify-center transition-all duration-700 transform hover:scale-110`}>
                <activeFeature.icon className={`w-8 h-8 transition-all duration-500`} style={{ color: `hsl(var(--primary))` }} />
              </div>

              {/* Feature Title */}
              <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent transition-all duration-500">
                {activeFeature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-lg text-muted-foreground leading-relaxed transition-all duration-500 hover:text-foreground/90">
                {activeFeature.description}
              </p>

              {/* Feature Indicator */}
              <div className="flex items-center space-x-2 pt-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeFeature.color} animate-pulse`} />
                <span className="text-sm text-muted-foreground font-medium">
                  AI Feature {activeIndex + 1} of {aiFeatures.length}
                </span>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              {/* Progress Bar */}
              <div className="flex-1 mr-8">
                <div className="flex space-x-2">
                  {aiFeatures.map((_, index) => (
                    <div
                      key={index}
                      className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden"
                    >
                      <div
                        className={`h-full bg-gradient-to-r ${activeFeature.color} transition-all duration-300 rounded-full`}
                        style={{
                          width: index === activeIndex ? `${progress}%` : index < activeIndex ? '100%' : '0%'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex space-x-2">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-lg bg-card/50 hover:bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 group"
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-lg bg-card/50 hover:bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 group"
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LivingAICarousel;