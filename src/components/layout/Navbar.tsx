import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "@/components/auth/UserMenu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen
        ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center bg-primary rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Lightbulb className="w-5 h-5 text-primary-foreground" />
              <div className="absolute inset-0 bg-primary/50 blur-lg rounded-lg -z-10 group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              ida
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors outline-none">
                Marketplace <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/marketplace?category=SaaS" className="cursor-pointer">
                    SaaS Ideas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/marketplace?category=Mobile%20Apps" className="cursor-pointer">
                    Mobile Apps
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/marketplace?category=AI%20Tools" className="cursor-pointer">
                    AI Tools
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/marketplace?category=E-commerce" className="cursor-pointer">
                    E-commerce
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/marketplace" className="cursor-pointer font-medium">
                    View All
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/submit-idea"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sell Your Idea
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search"
                className="h-9 w-64 rounded-full bg-muted/50 border border-border/50 focus:border-primary/50 pl-9 pr-12 text-sm outline-none transition-all focus:bg-background focus:w-72 focus:ring-2 focus:ring-primary/20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>

            <ThemeToggle />

            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" className="rounded-full px-6" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border/50 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <Link
                to="/marketplace"
                className="text-lg font-medium py-2 border-b border-border/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to="/how-it-works"
                className="text-lg font-medium py-2 border-b border-border/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>

              <div className="py-2 flex items-center justify-between border-b border-border/10">
                <span className="text-lg font-medium">Theme</span>
                <ThemeToggle />
              </div>

              {user ? (
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex items-center gap-3 py-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.email?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">My Account</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  <Button variant="outline" asChild className="w-full justify-start">
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      Profile
                    </Link>
                  </Button>
                  {/* Sign out handled by UserMenu component usually, but for mobile we might need direct access or just reuse UserMenu if adapted */}
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
