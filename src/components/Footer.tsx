import { Github, Twitter, MessageCircle, Mail } from "lucide-react";

const Footer = () => {
  const links = {
    product: [
      { name: "Features", href: "#" },
      { name: "Security", href: "#" },
      { name: "Roadmap", href: "#" },
      { name: "Pricing", href: "#" }
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "API", href: "#" },
      { name: "Support", href: "#" },
      { name: "Blog", href: "#" }
    ],
    company: [
      { name: "About", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" }
    ]
  };

  const socials = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: MessageCircle, href: "#", label: "Discord" },
    { icon: Mail, href: "#", label: "Email" }
  ];

  return (
    <footer className="relative border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="container px-4 mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              OctoFI
            </h3>
            <p className="text-muted-foreground max-w-xs">
              The future of decentralized finance. Secure, transparent, and accessible to everyone.
            </p>
            <div className="flex gap-4">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-primary/20 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              {links.product.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              {links.resources.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              {links.company.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 OctoFI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ for the DeFi community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
