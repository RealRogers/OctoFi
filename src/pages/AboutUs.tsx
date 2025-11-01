/**
 * About Us Page Component
 * 
 * Main page component for the About Us section of OctoFi.
 * Showcases the platform's mission, AI features, community, and core values.
 * 
 * Page Structure:
 * ┌─────────────────────────────────────┐
 * │ Hero Section                        │
 * │ - Title, subtitle, CTA              │
 * ├─────────────────────────────────────┤
 * │ About Us Section                    │
 * │ - Platform description              │
 * ├─────────────────────────────────────┤
 * │ AI Features Section                 │
 * │ - 4 feature cards in grid           │
 * ├─────────────────────────────────────┤
 * │ Community Section                   │
 * │ - Governance, social, metrics       │
 * ├─────────────────────────────────────┤
 * │ Values Section                      │
 * │ - 4 value cards in grid             │
 * ├─────────────────────────────────────┤
 * │ CTA Section                         │
 * │ - Final call to action              │
 * └─────────────────────────────────────┘
 * 
 * @component
 */

import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ValueCard from "@/components/molecules/ValueCard";
import FeatureCard from "@/components/molecules/FeatureCard";
import { aboutData } from "@/lib/aboutData";
import { Link } from "react-router-dom";
import { 
  ExternalLink,
  CheckCircle2
} from "lucide-react";

/**
 * AboutUs Page Component
 * Displays comprehensive information about OctoFi platform
 */
const AboutUs = () => {
  // Set page title and scroll to top on mount
  useEffect(() => {
    document.title = "About Us - OctoFi";
    window.scrollTo(0, 0);
  }, []);
  return (
    <AppLayout>
      <div className="space-y-16 md:space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            {aboutData.hero.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-primary font-semibold">
            {aboutData.hero.subtitle}
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {aboutData.hero.description}
          </p>
          
          <div className="pt-4">
            <Link to="/dashboard">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8 py-6 min-h-[56px]"
              >
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* About Us Section */}
        <section className="max-w-5xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 md:p-12 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {aboutData.about.title}
              </h2>
              
              <div className="space-y-4">
                {aboutData.about.content.map((paragraph, index) => (
                  <p 
                    key={index}
                    className="text-base md:text-lg text-muted-foreground leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Highlights */}
              <div className="pt-6 mt-6 border-t border-border/30">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Key Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {aboutData.about.highlights.map((highlight, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 
                        className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" 
                        aria-hidden="true"
                      />
                      <span className="text-sm md:text-base text-foreground">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* AI Features Section */}
        <section className="max-w-7xl mx-auto" aria-labelledby="ai-features-heading">
          <div className="text-center mb-12">
            <h2 
              id="ai-features-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              AI-Powered Trading Agent
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Leverage cutting-edge artificial intelligence to optimize your DeFi portfolio with autonomous trading strategies.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.aiFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                highlights={feature.highlights}
              />
            ))}
          </div>
        </section>

        {/* Community Section */}
        <section className="max-w-7xl mx-auto" aria-labelledby="community-heading">
          <div className="text-center mb-12">
            <h2 
              id="community-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Community & Governance
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Join a thriving community of DeFi enthusiasts and participate in shaping the future of OctoFi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Governance Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    {(() => {
                      const IconComponent = aboutData.community.social[0].icon;
                      return <IconComponent className="w-6 h-6 text-primary" aria-hidden="true" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {aboutData.community.governance.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {aboutData.community.governance.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 mt-6" role="list">
                  {aboutData.community.governance.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Rewards Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <CheckCircle2 className="w-6 h-6 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {aboutData.community.rewards.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {aboutData.community.rewards.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 mt-6" role="list">
                  {aboutData.community.rewards.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Social Links */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-foreground text-center mb-8">
              Connect With Us
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aboutData.community.social.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  aria-label={`Follow OctoFi on ${social.platform}`}
                >
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-4 rounded-full bg-primary/10 border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
                        <social.icon className="w-8 h-8 text-primary" aria-hidden="true" />
                      </div>
                      <h4 className="text-lg font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                        {social.platform}
                        <ExternalLink className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      </h4>
                      {social.description && (
                        <p className="text-sm text-muted-foreground">
                          {social.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>

          {/* Community Metrics */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground text-center mb-8">
              Community Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {aboutData.community.metrics.map((metric, index) => (
                <Card 
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border-border/50"
                >
                  <CardContent className="p-6 text-center">
                    <metric.icon 
                      className="w-8 h-8 text-primary mx-auto mb-3" 
                      aria-hidden="true"
                    />
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {metric.value}
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      {metric.label}
                    </div>
                    {metric.trend && metric.trend !== 'neutral' && (
                      <div className={`text-xs mt-2 ${
                        metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {metric.trend === 'up' ? '↑' : '↓'} Trending
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values and Principles Section */}
        <section className="max-w-7xl mx-auto" aria-labelledby="values-heading">
          <div className="text-center mb-12">
            <h2 
              id="values-heading"
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Our Principles
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              The core values that guide everything we do at OctoFi.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.values.map((value, index) => (
              <ValueCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                color={value.color}
              />
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section 
          className="max-w-5xl mx-auto"
          aria-labelledby="cta-heading"
        >
          <Card className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 backdrop-blur-sm border-primary/30 overflow-hidden relative">
            {/* Gradient overlay for visual effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 pointer-events-none" />
            
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <h2 
                id="cta-heading"
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                {aboutData.cta.title}
              </h2>
              
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                {aboutData.cta.description}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to={aboutData.cta.primaryButton.link}>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8 py-6 min-h-[56px] w-full sm:w-auto"
                  >
                    {aboutData.cta.primaryButton.text}
                  </Button>
                </Link>
                
                <a
                  href={aboutData.cta.secondaryButton.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-primary/50 hover:bg-primary/10 text-lg px-8 py-6 min-h-[56px] w-full sm:w-auto"
                  >
                    {aboutData.cta.secondaryButton.text}
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
};

export default AboutUs;
