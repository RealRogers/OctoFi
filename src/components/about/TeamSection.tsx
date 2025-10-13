import TeamMemberCard from "./TeamMemberCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Alex Rodriguez",
    role: "CEO & Founder",
    avatar: "/placeholder.svg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/alexrodriguez-octofi",
      twitter: "https://twitter.com/alexrodriguez_fi"
    }
  },
  {
    name: "Dr. Sarah Chen",
    role: "CTO & AI Research Lead",
    avatar: "/placeholder.svg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahchen-ai",
      twitter: "https://twitter.com/sarahchen_ai"
    }
  },
  {
    name: "Carlos Mendoza",
    role: "Head of DeFi Strategy",
    avatar: "/placeholder.svg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/carlosmendoza-defi",
      twitter: "https://twitter.com/carlosmendoza_fi"
    }
  },
  {
    name: "María González",
    role: "Lead Blockchain Developer",
    avatar: "/placeholder.svg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/mariagonzalez-blockchain",
      twitter: "https://twitter.com/mariagonzalez_dev"
    }
  },
  {
    name: "David Kim",
    role: "Head of Security",
    avatar: "/placeholder.svg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/davidkim-security",
      twitter: "https://twitter.com/davidkim_sec"
    }
  },
  {
    name: "Ana Ruiz",
    role: "UX/UI Design Lead",
    avatar: "/placeholder.svg",
    socialLinks: {
      linkedin: "https://linkedin.com/in/anaruiz-design",
      twitter: "https://twitter.com/anaruiz_design"
    }
  }
];

const TeamSection = () => {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section 
      ref={sectionRef} 
      className="py-24 relative overflow-hidden"
      aria-labelledby="team-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20" />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            id="team-heading"
            className="text-4xl md:text-5xl font-black mb-4"
          >
            The Team Behind{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              OctoFi
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Meet the experts building the future of decentralized finance.
          </p>
        </div>
        
        {/* Responsive grid layout: 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto transition-all duration-1000 delay-300 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}>
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;