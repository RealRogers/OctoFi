import { Linkedin, Twitter } from "lucide-react";
import { TeamMember } from "./TeamSection";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import LazyImage from "@/components/ui/LazyImage";

interface TeamMemberCardProps {
  member: TeamMember;
  index?: number;
}

const TeamMemberCard = ({ member, index = 0 }: TeamMemberCardProps) => {
  const { ref: cardRef, isVisible } = useScrollAnimation({ 
    threshold: 0.3,
    triggerOnce: true 
  });
  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article 
      ref={cardRef}
      className={`group p-4 sm:p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 text-center hover-lift ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
      }}
      role="article"
      aria-labelledby={`team-member-${index}-name`}
      aria-describedby={`team-member-${index}-role`}
    >
      {/* Avatar */}
      <div className="relative mb-4 sm:mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-105 transition-transform duration-500 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <LazyImage
            src={member.avatar}
            alt={`${member.name}, ${member.role} at OctoFi`}
            className="w-full h-full object-cover rounded-full"
            fallbackClassName="w-full h-full rounded-full"
            placeholder={member.name.charAt(0)}
          />
        </div>
      </div>

      {/* Name and Role */}
      <div className="mb-4">
        <h3 
          id={`team-member-${index}-name`}
          className="text-lg sm:text-xl font-bold mb-1 text-foreground"
        >
          {member.name}
        </h3>
        <p 
          id={`team-member-${index}-role`}
          className="text-muted-foreground text-xs sm:text-sm font-medium"
        >
          {member.role}
        </p>
      </div>

      {/* Social Links */}
      <nav 
        className="flex justify-center space-x-3 sm:space-x-4"
        aria-label={`${member.name}'s social media profiles`}
      >
        {member.socialLinks.linkedin && (
          <button
            onClick={() => handleSocialClick(member.socialLinks.linkedin!)}
            className="p-1.5 sm:p-2 rounded-lg bg-background/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background touch-manipulation"
            aria-label={`Visit ${member.name}'s LinkedIn profile (opens in new tab)`}
            type="button"
          >
            <Linkedin size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
          </button>
        )}
        {member.socialLinks.twitter && (
          <button
            onClick={() => handleSocialClick(member.socialLinks.twitter!)}
            className="p-1.5 sm:p-2 rounded-lg bg-background/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background touch-manipulation"
            aria-label={`Visit ${member.name}'s Twitter profile (opens in new tab)`}
            type="button"
          >
            <Twitter size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
          </button>
        )}
      </nav>
    </article>
  );
};

export default TeamMemberCard;