import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { STOREFRONT_NAV } from '../../config/nav';
import { BRAND } from '../../config/brand.config';
import { useStore } from '../../store/useStore';

export const Navbar: React.FC = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const cart = useStore((s) => s.cart);
  const setCartDrawerOpen = useStore((s) => s.setCartDrawerOpen);

  useEffect(() => {
    const onScroll = () => {
      setHasScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 h-[72px] transition-colors duration-150 ${
          hasScrolled
            ? 'bg-[#F6F3EE]/95 border-b border-[#E3DED5]'
            : 'bg-[#F6F3EE] border-b border-transparent'
        }`}
      >
        <div className="max-w-[1200px] h-full mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Typographic wordmark + folded corner icon */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#1F2421] group focus-visible:outline-2 focus-visible:outline-secondary"
          >
            <svg
              className="w-6 h-6 text-[#24473B] transition-transform duration-150 group-hover:-translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="13" y2="17" />
            </svg>
            <span className="font-display text-2xl font-medium tracking-tight text-[#1F2421]">
              {BRAND.name}
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {STOREFRONT_NAV.map((item) => {
              const isControlRoom = item.href === '/app';
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`transition-colors hover:text-[#24473B] ${
                    location.pathname === item.href
                      ? 'text-[#24473B] font-semibold underline underline-offset-4 decoration-2'
                      : 'text-[#4A524D]'
                  } ${
                    isControlRoom
                      ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#E4ECE7] text-[#24473B] hover:bg-[#d5e3da]'
                      : ''
                  }`}
                >
                  <span>{item.label}</span>
                  {isControlRoom && <ArrowRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>

          {/* Cart and Mobile Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2 rounded-sm text-[#1F2421] hover:bg-[#EFEBE4] transition-colors focus-visible:outline-2"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#B5654A] text-white text-[10px] font-mono font-medium flex items-center justify-center">
                  1
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-sm text-[#1F2421] hover:bg-[#EFEBE4] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-30 bg-[#F6F3EE] md:hidden p-6 flex flex-col justify-between border-t border-[#E3DED5]">
          <nav className="flex flex-col gap-4 text-lg">
            {STOREFRONT_NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="py-2 text-[#1F2421] font-medium border-b border-[#E3DED5] flex items-center justify-between"
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 text-[#7A817B]" />
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-[#E3DED5] flex flex-col gap-3">
            <div className="text-xs text-[#7A817B] font-mono">
              ENVIRONMENT: {BRAND.environment}
            </div>
            <Link
              to="/app"
              className="w-full py-3 bg-[#24473B] text-white text-center rounded-sm font-medium text-sm flex items-center justify-center gap-2"
            >
              <span>Open Control Room</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
