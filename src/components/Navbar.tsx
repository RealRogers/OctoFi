import { Button } from "@/components/ui/button";
import { Wallet, Menu } from "lucide-react";
import { useState } from "react";
import { ConnectWalletButton } from "@/components/shared/ConnectWalletButton";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Features", href: "#features", isExternal: true },
    { name: "How it Works", href: "#how-it-works", isExternal: true },
    { name: "Documentation", href: "https://docs.octofi.com", isExternal: true },
    { name: "About", href: "/about", isExternal: false }
  ];

  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.isExternal) {
      // For hash links, scroll to section or handle as needed
      if (link.href.startsWith('#')) {
        // If we're not on the home page, navigate there first
        if (window.location.pathname !== '/') {
          navigate('/' + link.href);
        } else {
          // Scroll to the section
          const element = document.querySelector(link.href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else if (link.href.startsWith('http')) {
        // Open external links in new tab
        window.open(link.href, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Use React Router navigation for internal routes
      navigate(link.href);
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => navigate('/')} className="cursor-pointer">
              <img 
                src="/OctoFi-Logo.png" 
                alt="OctoFi Logo" 
                className="h-16 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => handleNavClick(link)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          {/* CTA Button and User Avatar */}
          <div className="hidden md:flex items-center gap-4">
            <ConnectWalletButton />
            <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="User Avatar" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/50">
            {navLinks.map((link, i) => (
              <button
                key={i}
                onClick={() => handleNavClick(link)}
                className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-left w-full"
              >
                {link.name}
              </button>
            ))}
            <ConnectWalletButton className="w-full bg-gradient-to-r from-primary to-accent" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
