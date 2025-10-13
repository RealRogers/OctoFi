import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/about/HeroSection";
import MissionSection from "@/components/about/MissionSection";
import ValuesSection from "@/components/about/ValuesSection";
import TeamSection from "@/components/about/TeamSection";
import CTASection from "@/components/about/CTASection";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main content container with proper spacing */}
      <main 
        className="relative"
        role="main"
        aria-label="About OctoFi page content"
      >
        <HeroSection />
        <MissionSection />
        <ValuesSection />
        <TeamSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;