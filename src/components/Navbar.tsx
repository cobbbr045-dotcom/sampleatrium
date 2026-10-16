import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, Calendar, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { HotelInfo } from '../types/hotel.ts';

interface NavbarProps {
  hotel: HotelInfo;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenConcierge: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hotel,
  onOpenBooking,
  onOpenAdmin,
  onOpenConcierge,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Rooms & Suites', href: '#rooms' },
    { label: 'Amenities', href: '#amenities' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Location', href: '#location' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#141b24] text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {hotel.address}, Pokhara
            </span>
            <span className="hidden sm:inline-block text-stone-500">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-stone-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              24/7 Front Desk: {hotel.phonePrimary}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${hotel.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1 text-emerald-300 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Us
            </a>
            <span className="text-stone-600">•</span>
            <a
              href={`tel:${hotel.phonePrimary.replace(/[^0-9+]/g, '')}`}
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Hotel
            </a>
            <span className="text-stone-600">•</span>
            <button
              onClick={onOpenAdmin}
              className="text-stone-400 hover:text-amber-200 transition-colors flex items-center gap-1 text-[11px]"
              title="Hotel Owner Portal"
            >
              <ShieldCheck className="w-3 h-3" />
              Owner Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#18202a]/95 backdrop-blur-md shadow-lg py-3 text-stone-100 border-b border-stone-800'
            : 'bg-[#141b24] py-4 text-stone-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm p-1 flex items-center justify-center border border-amber-400/40 group-hover:scale-105 transition-transform overflow-hidden shadow">
              <img
                src="/images/hotel/logo1.png"
                alt="Hotel Atrium Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-serif font-bold text-xl tracking-wider text-white group-hover:text-amber-300 transition-colors">
                HOTEL ATRIUM
              </div>
              <div className="text-[10px] tracking-widest uppercase text-amber-400/90 font-medium">
                Lakeside • Pokhara, Nepal
              </div>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-stone-300 hover:text-amber-400 transition-colors tracking-wide text-[13px] uppercase py-1 relative hover:after:w-full after:w-0 after:h-[2px] after:bg-amber-400 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenConcierge}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-stone-800/80 hover:bg-stone-700 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all"
              title="Pokhara Trip Sherpa & Stay Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Concierge</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-amber-500/20 active:scale-95 flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-950" />
              <span>BOOK NOW</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-amber-400"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#161d26] border-b border-stone-800 px-6 py-5 text-stone-200 space-y-3 animate-fade-in">
            <div className="grid grid-cols-2 gap-2 text-sm pb-4 border-b border-stone-800">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded hover:bg-stone-800 text-stone-300 hover:text-amber-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConcierge();
                }}
                className="w-full py-2.5 px-4 rounded bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Pokhara Concierge & Trip Planner
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Reserve a Room Now
              </button>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <a
                  href={`tel:${hotel.phonePrimary.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-stone-800 text-stone-300"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  Call Hotel
                </a>
                <a
                  href={`https://wa.me/${hotel.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
