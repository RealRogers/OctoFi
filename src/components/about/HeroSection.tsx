import { useEffect, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref: heroRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Neural network animation variables
    const nodes: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    const connections: Array<{ from: number; to: number; opacity: number }> = [];
    
    // Create nodes
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    // Create connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2)
        );
        if (distance < 150) {
          connections.push({
            from: i,
            to: j,
            opacity: Math.max(0, 1 - distance / 150),
          });
        }
      }
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update node positions
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

        // Keep nodes in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });

      // Update connections
      connections.length = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = Math.sqrt(
            Math.pow(nodes[i].x - nodes[j].x, 2) + Math.pow(nodes[i].y - nodes[j].y, 2)
          );
          if (distance < 150) {
            connections.push({
              from: i,
              to: j,
              opacity: Math.max(0, 0.3 - distance / 500),
            });
          }
        }
      }

      // Draw connections
      connections.forEach((connection) => {
        const fromNode = nodes[connection.from];
        const toNode = nodes[connection.to];
        
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${connection.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139, 92, 246, 0.6)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
      role="banner"
    >
      {/* Animated neural network background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
        style={{ background: "transparent" }}
      />
      
      {/* Static background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-muted/20" />
      
      {/* Animated orbs for additional depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-pulse delay-500" />
      
      {/* Content */}
      <div className="container relative z-10 px-4 mx-auto text-center pt-20">
        <div className={`max-w-5xl mx-auto space-y-12 transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          {/* Vision Badge */}
          <div className="inline-block px-6 py-3 rounded-full bg-muted/50 backdrop-blur-sm border border-primary/20 mb-8">
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Vision for the Future of DeFi
            </span>
          </div>
          
          {/* Main Heading */}
          <h1 
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tight"
          >
            Democratizing{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
              Financial
            </span>
            <br />
            <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent animate-gradient bg-[length:200%_200%] animation-delay-500">
              Intelligence
            </span>
          </h1>
          
          {/* Mission Statement */}
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 font-medium leading-relaxed">
              We believe that advanced financial tools, powered by AI, shouldn't be a privilege for the few.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              OctoFi was created to give every DeFi investor an autonomous agent that works tirelessly to protect and grow their capital, 
              democratizing access to investment strategies that were previously only available to financial institutions.
            </p>
          </div>
          
          {/* Key Features Highlight */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto pt-6 sm:pt-8 px-4 sm:px-0"
            role="list"
            aria-label="Key features of OctoFi"
          >
            {[
              { 
                title: "Autonomous AI", 
                description: "Agents working 24/7 optimizing your portfolio" 
              },
              { 
                title: "Full Control", 
                description: "You maintain complete custody of your funds" 
              },
              { 
                title: "Transparency", 
                description: "Explainable decisions and clear strategies" 
              }
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-3 sm:p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-300 text-center sm:text-left"
                role="listitem"
              >
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {/* Scroll Indicator */}
          <div className="pt-16">
            <div className="flex flex-col items-center space-y-2 text-muted-foreground">
              <span className="text-sm font-medium">Discover more</span>
              <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;