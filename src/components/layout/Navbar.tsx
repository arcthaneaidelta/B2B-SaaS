import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { PersonaSwitcher } from './PersonaSwitcher';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'For Employers', href: '/employers' },
    { label: 'For Professionals', href: '/professionals' },
    { label: 'Verification', href: '/verification-standards' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Security & Privacy', href: '/security' }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-[#F7F6F2] border-[#E5E5DD] shadow-xs'
            : 'bg-[#F7F6F2]/85 backdrop-blur-md border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#24483D] flex items-center justify-center text-white font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
              <ShieldCheck className="w-5 h-5 text-[#E7EEE7]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-[#28332F] text-lg leading-tight">
                VERITY
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#777F79] font-medium leading-none">
                Nordic Verification
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#24483D] font-semibold'
                      : 'text-[#28332F]/80 hover:text-[#24483D]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <PersonaSwitcher compact />
            <Link
              to="/login"
              className="text-sm font-medium text-[#28332F] hover:text-[#24483D] px-2 py-1 transition-colors"
            >
              Sign In
            </Link>
            <Button
              size="sm"
              variant="primary"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              onClick={() => navigate('/app/employer/overview')}
            >
              Explore Platform
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <PersonaSwitcher compact />
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-lg text-[#28332F] hover:bg-[#E5E5DD]/50"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#28332F]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#F7F6F2] shadow-2xl p-6 flex flex-col justify-between border-l border-[#E5E5DD] animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5DD]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#24483D] flex items-center justify-center text-white">
                    <ShieldCheck className="w-4 h-4 text-[#E7EEE7]" />
                  </div>
                  <span className="font-bold text-[#28332F] text-base">VERITY</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 rounded-lg text-[#777F79] hover:text-[#28332F]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-3">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-base font-medium text-[#28332F] hover:text-[#24483D] py-1 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/demo"
                  className="text-base font-medium text-[#356653] flex items-center gap-2 py-1"
                >
                  <Sparkles className="w-4 h-4" />
                  Interactive Demo Guide
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-[#E5E5DD] space-y-3">
              <Link to="/login" className="block text-center text-sm font-semibold text-[#28332F]">
                Sign In
              </Link>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app/employer/overview');
                }}
              >
                Explore Platform
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
