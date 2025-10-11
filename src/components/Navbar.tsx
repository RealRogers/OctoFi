import { Button } from "@/components/ui/button";
import { Wallet, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Documentation", href: "#docs" },
    { name: "About", href: "#about" }
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              OctoFI
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          {/* CTA Button and User Avatar */}
          <div className="hidden md:flex items-center gap-4">
            <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-[var(--glow-primary)] transition-all duration-300">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
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
              <a
                key={i}
                href={link.href}
                className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button className="w-full bg-gradient-to-r from-primary to-accent">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
