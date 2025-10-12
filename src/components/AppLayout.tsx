import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Menu, X, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Agent Dashboard", href: "/agent-dashboard" },
    { name: "Swap", href: "/swap" },
    { name: "Stake", href: "/stake" },
    { name: "Settings", href: "/settings" }
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-3">
                <span className="text-sm font-black">O</span>
              </div>
              <h1 className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                OctoFi
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Wallet Button */}
            <div className="flex items-center gap-4">
              <Button className="hidden md:flex bg-gradient-to-r from-primary to-accent hover:shadow-[var(--glow-primary)] transition-all duration-300">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>

              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden md:flex w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent items-center justify-center hover:shadow-[var(--glow-primary)] transition-all duration-300 cursor-pointer">
                    <User className="h-5 w-5 text-white" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Portfolio</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/agent-dashboard")}>
                    <span className="mr-2">🤖</span>
                    <span>Dashboard del Agente</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-border/50">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="w-full bg-gradient-to-r from-primary to-accent mt-4">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
              
              {/* Mobile Profile Menu */}
              <div className="pt-4 mt-4 border-t border-border/50 space-y-2">
                <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                  Mi Cuenta
                </div>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors"
                >
                  <User className="mr-2 h-4 w-4" />
                  Mi Portfolio
                </button>
                <button
                  className="w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="container px-4 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
