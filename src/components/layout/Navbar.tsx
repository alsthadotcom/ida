import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, ChevronDown, UserCircle, LogOut, Lightbulb } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProxiedAvatarUrl } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Fetch user profile avatar
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          setAvatarUrl(data.avatar_url);
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar();
  }, [user]);

  // Helper to check active state
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 
        flex items-center justify-between 
        px-6 py-4 md:px-12
        bg-background/80 backdrop-blur-md border-b border-border
        transition-all duration-700
      `}
    >
      {/* Left: Logo */}
      <Link to="/" className="flex items-center select-none w-32 focus:outline-none group">
        <span className="text-4xl text-primary font-handwritten font-bold tracking-tight pb-1 group-hover:text-foreground transition-colors duration-300 cursor-pointer">
          ida.
        </span>
      </Link>

      {/* Center: Main Navigation Links */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center space-x-10">
        <Link
          to="/marketplace"
          className={`relative tracking-wide transition-all duration-300 ${isActive('/marketplace') ? 'text-primary font-medium text-base' : 'text-muted-foreground hover:text-foreground font-normal text-sm group'}`}
        >
          Marketplace
          {isActive('/marketplace') ? (
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]"></span>
          ) : (
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-muted-foreground/30 rounded-full group-hover:bg-primary/50 transition-colors"></span>
          )}
        </Link>
        <Link
          to="/submit-idea"
          className={`relative tracking-wide transition-all duration-300 ${isActive('/submit-idea') ? 'text-primary font-medium text-base' : 'text-muted-foreground hover:text-foreground font-normal text-sm group'}`}
        >
          Sell Your Idea
          {isActive('/submit-idea') ? (
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]"></span>
          ) : (
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-muted-foreground/30 rounded-full group-hover:bg-primary/50 transition-colors"></span>
          )}
        </Link>
        <Link
          to="/how-it-works"
          className={`relative tracking-wide transition-all duration-300 ${isActive('/how-it-works') ? 'text-primary font-medium text-base' : 'text-muted-foreground hover:text-foreground font-normal text-sm group'}`}
        >
          How It Works
          {isActive('/how-it-works') ? (
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]"></span>
          ) : (
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-muted-foreground/30 rounded-full group-hover:bg-primary/50 transition-colors"></span>
          )}
        </Link>
        <Link
          to="/digital-solutions"
          className={`relative tracking-wide transition-all duration-300 ${isActive('/digital-solutions') ? 'text-primary font-medium text-base' : 'text-muted-foreground hover:text-foreground font-normal text-sm group'}`}
        >
          Digital Solutions
          {isActive('/digital-solutions') ? (
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]"></span>
          ) : (
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-muted-foreground/30 rounded-full group-hover:bg-primary/50 transition-colors"></span>
          )}
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-end space-x-6 w-auto md:w-auto">
        {/* Theme Toggle */}
        <ThemeToggle />

        {!user ? (
          <>
            <Link
              to="/submit-idea"
              className="group relative text-xs font-medium text-muted-foreground hover:text-primary transition-colors duration-300 uppercase tracking-wider hidden sm:block"
            >
              Start Selling
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>

            <Link
              to="/login"
              className="px-5 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 whitespace-nowrap"
            >
              Log in
            </Link>
          </>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 rounded-full hover:bg-zinc-800 transition-colors focus:outline-none"
            >
              <Avatar className="w-9 h-9 border border-border transition-all duration-300 hover:border-primary/50">
                <AvatarImage src={getProxiedAvatarUrl(avatarUrl || user.user_metadata?.avatar_url)} alt="User" />
                <AvatarFallback className="bg-secondary text-muted-foreground text-xs">
                  {user.email?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Signed in</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate('/profile?tab=my-ideas'); // Link to My Ideas tab
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-3"
                  >
                    <Lightbulb className="w-5 h-5" />
                    My Ideas
                  </button>

                  <div className="border-t border-border my-2"></div>

                  <button
                    onClick={async () => {
                      setIsDropdownOpen(false);
                      await signOut();
                      navigate('/login');
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-3"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
