import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ChevronDown, Lightbulb, Sparkles } from "lucide-react";
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
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled || isMobileMenuOpen
        ? "bg-background/70 backdrop-blur-xl border-border/40 shadow-sm"
        : "bg-transparent border-transparent"
        }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-10">
            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-emerald-500 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/25">
              <Lightbulb className="w-6 h-6 text-white" />
              <div className="absolute -inset-1 bg-primary/40 blur-lg rounded-xl dark:opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-black tracking-tight font-outfit">
              ida<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-secondary/50 backdrop-blur-md p-1.5 rounded-full border border-border/50">
            <Link
              to="/marketplace"
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${location.pathname === "/marketplace"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
            >
              Marketplace
            </Link>
            <Link
              to="/submit-idea"
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${location.pathname === "/submit-idea"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
            >
              Sell Idea
            </Link>
            <Link
              to="/how-it-works"
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${location.pathname === "/how-it-works"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
            >
              How It Works
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative hidden lg:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search ideas..."
                className="h-10 w-64 rounded-xl bg-secondary/50 border border-transparent hover:border-border focus:border-primary/50 pl-10 pr-4 text-sm outline-none transition-all focus:bg-background focus:w-72 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="w-px h-6 bg-border/50 mx-2" />
            <ThemeToggle />

            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Button className="rounded-xl px-6 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground relative z-[120] rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 top-0 bg-black/80 backdrop-blur-sm z-[100] md:hidden"
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border z-[110] md:hidden flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-black font-outfit">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <nav className="flex flex-col gap-2">
                  <Link
                    to="/marketplace"
                    className="flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-secondary transition-colors text-lg font-medium min-h-[48px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Marketplace
                  </Link>
                  <Link
                    to="/submit-idea"
                    className="flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-secondary transition-colors text-lg font-medium min-h-[48px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sell Idea
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-secondary transition-colors text-lg font-medium min-h-[48px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link
                    to="/about"
                    className="flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-secondary transition-colors text-lg font-medium min-h-[48px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-secondary transition-colors text-lg font-medium min-h-[48px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </nav>

                <div className="my-6 border-t border-border" />

                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-medium text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-border bg-secondary/30">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.email?.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">My Account</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button className="w-full h-12 rounded-xl" asChild>
                      <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                        Profile Dashboard
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-2" asChild>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button className="w-full h-12 rounded-xl shadow-lg shadow-primary/25" asChild>
                      <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
