import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lion from "@/components/brand/Lion";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, ChevronDown, Building2, GraduationCap } from "lucide-react";

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBusinessMenu, setShowBusinessMenu] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowBusinessMenu(false);
    };
    
    if (showUserMenu || showBusinessMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showUserMenu, showBusinessMenu]);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    navigate("/");
  };

  const links = [
    { label: "Modes", href: "#modes" },
    { label: "Domains", href: "#domains" },
    { label: "Method", href: "#method" },
  ];

  return (
    <nav
      data-testid="primary-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/60 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
        <a
          href="#top"
          data-testid="nav-logo"
          className="flex items-center gap-2 sm:gap-3 group"
        >
          <Lion size={28} testId="nav-lion" animate glow className="sm:w-8 sm:h-8" />
          <span className="font-serif text-lg sm:text-2xl tracking-tight text-white">
            Marquee
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-8 xl:gap-12">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className="text-[13px] uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors duration-300 whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
          
          {/* Business Dropdown - Styled like nav links */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBusinessMenu(!showBusinessMenu);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-1 text-[13px] uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors duration-300 whitespace-nowrap group"
            >
              Business
              <ChevronDown size={12} className={`transition-transform duration-200 ${showBusinessMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showBusinessMenu && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-64 bg-black/95 border border-[#D4AF37]/30 backdrop-blur-md z-50 shadow-2xl">
                <Link
                  to="/company-register"
                  className="flex items-center gap-3 px-4 py-3.5 text-white/90 hover:text-white hover:bg-[#D4AF37]/10 transition-colors border-b border-white/10 group"
                  onClick={() => setShowBusinessMenu(false)}
                >
                  <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                    <Building2 size={18} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">For Companies</div>
                    <div className="text-xs text-white/50">Hire top talent</div>
                  </div>
                </Link>
                <Link
                  to="/university-register"
                  className="flex items-center gap-3 px-4 py-3.5 text-white/90 hover:text-white hover:bg-[#D4AF37]/10 transition-colors group"
                  onClick={() => setShowBusinessMenu(false)}
                >
                  <div className="w-9 h-9 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                    <GraduationCap size={18} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">For Universities</div>
                    <div className="text-xs text-white/50">Place your students</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Auth Buttons */}
          {!loading && !user && (
            <>
              <Link
                to="/login"
                className="hidden md:block px-3 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/70 border border-white/20 hover:text-white hover:bg-white/5 hover:border-white/40 transition-all duration-300 whitespace-nowrap"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] bg-[#D4AF37] text-black hover:bg-white transition-colors duration-300 whitespace-nowrap font-semibold"
              >
                Register
              </Link>
            </>
          )}
          
          {/* Start Practice Button */}
          <Link
            to="/practice"
            data-testid="nav-cta-practice"
            className="px-3 sm:px-5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white border border-white/40 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 whitespace-nowrap font-semibold"
          >
            <span className="hidden sm:inline">Start Practice</span>
            <span className="sm:hidden">Practice</span>
          </Link>

          {/* User Profile - Shifted Right with Golden Outline */}
          {!loading && user && (
            <div className="relative ml-2 sm:ml-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                  setShowBusinessMenu(false);
                }}
                className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-transparent flex items-center justify-center text-[#D4AF37] font-bold text-xs sm:text-sm transition-all duration-300 border-2 border-[#D4AF37] hover:border-[#F4D03F] hover:scale-110 hover:shadow-lg hover:shadow-[#D4AF37]/30 group"
              >
                <span className="relative z-10">
                  {user.email?.charAt(0).toUpperCase()}
                </span>
                {/* Glow on hover */}
                <span className="absolute inset-0 rounded-full bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 transition-colors duration-300" />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-64 sm:w-72 bg-black/95 border border-[#D4AF37]/40 backdrop-blur-md z-50 shadow-2xl rounded-lg overflow-hidden"
                  style={{ maxWidth: 'calc(100vw - 2rem)' }}
                >
                  {/* Header with gradient */}
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-b border-[#D4AF37]/20">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-transparent border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-lg sm:text-xl shadow-lg">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        {/* Online indicator */}
                        <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm sm:text-base font-semibold truncate mb-0.5">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-white/60 text-xs truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-green-400 text-xs">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sign out button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 text-white/70 hover:text-white hover:bg-gradient-to-r hover:from-red-500/10 hover:to-transparent transition-all text-sm group border-t border-white/5"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <LogOut size={16} className="text-red-400 group-hover:text-red-300 transition-colors" />
                    </div>
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;