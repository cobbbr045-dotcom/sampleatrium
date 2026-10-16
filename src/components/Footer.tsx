import React, { useState } from 'react';
import { HotelInfo } from '../types/hotel.ts';
import { Phone, MessageCircle, Mail, MapPin, ExternalLink, ShieldCheck, Heart, X } from 'lucide-react';

interface FooterProps {
  hotel: HotelInfo;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  onOpenConcierge: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  hotel,
  onOpenBooking,
  onOpenAdmin,
  onOpenConcierge,
}) => {
  const [modalPolicy, setModalPolicy] = useState<'privacy' | 'terms' | 'booking' | null>(null);

  return (
    <>
      <footer className="bg-[#0e131a] text-stone-300 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Col 1 & 2: Brand & About */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 p-1 flex items-center justify-center border border-amber-400/40 overflow-hidden">
                  <img
                    src="/images/hotel/logo1.png"
                    alt="Hotel Atrium Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-serif font-bold text-xl tracking-wider text-white">
                    HOTEL ATRIUM
                  </div>
                  <div className="text-[10px] tracking-widest uppercase text-amber-400/90 font-medium">
                    Lakeside • Pokhara, Nepal
                  </div>
                </div>
              </div>

              <p className="text-stone-400 leading-relaxed text-xs sm:text-sm max-w-sm">
                A serene retreat situated on tranquil Uday Marg, just 250 meters from Phewa Lake. Offering comfortable rooms, panoramic Annapurna mountain views, and authentic Nepali warmth.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onOpenBooking}
                  className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Book Your Stay
                </button>
                <button
                  onClick={onOpenConcierge}
                  className="px-3.5 py-2 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/20 text-[11px] transition-colors cursor-pointer"
                >
                  AI Travel Sherpa
                </button>
              </div>
            </div>

            {/* Col 3: Quick Links */}
            <div>
              <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 text-amber-400">
                Explore
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-400">
                <li><a href="#hero" className="hover:text-amber-300 transition-colors">Home</a></li>
                <li><a href="#rooms" className="hover:text-amber-300 transition-colors">Rooms &amp; Suites</a></li>
                <li><a href="#amenities" className="hover:text-amber-300 transition-colors">Hotel Amenities</a></li>
                <li><a href="#gallery" className="hover:text-amber-300 transition-colors">Photo Gallery</a></li>
                <li><a href="#about" className="hover:text-amber-300 transition-colors">About Us</a></li>
                <li><a href="#reviews" className="hover:text-amber-300 transition-colors">Guest Reviews</a></li>
                <li><a href="#location" className="hover:text-amber-300 transition-colors">Location &amp; Map</a></li>
                <li><a href="#contact" className="hover:text-amber-300 transition-colors">Contact Hotel</a></li>
              </ul>
            </div>

            {/* Col 4: Verified Contact */}
            <div>
              <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 text-amber-400">
                Contact &amp; Help
              </h4>
              <ul className="space-y-3 text-xs text-stone-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{hotel.address}, Pokhara</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href={`tel:${hotel.phonePrimary.replace(/[^0-9+]/g, '')}`} className="hover:text-white">
                    {hotel.phonePrimary}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${hotel.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-300 text-emerald-400 font-medium"
                  >
                    WhatsApp Us
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href={`mailto:${hotel.email}`} className="hover:text-white truncate">
                    {hotel.email}
                  </a>
                </li>
                <li className="pt-1">
                  <a
                    href={hotel.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:underline"
                  >
                    <span>Google Maps Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 5: Policies & Legal */}
            <div>
              <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 text-amber-400">
                Hotel Policies
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button onClick={() => setModalPolicy('booking')} className="hover:text-amber-300 text-left cursor-pointer">
                    Booking &amp; Cancellation Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => setModalPolicy('terms')} className="hover:text-amber-300 text-left cursor-pointer">
                    Terms &amp; Conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => setModalPolicy('privacy')} className="hover:text-amber-300 text-left cursor-pointer">
                    Privacy Policy
                  </button>
                </li>
                <li className="pt-2 border-t border-stone-800 text-[11px] text-stone-500 space-y-1">
                  <div className="text-amber-400/90 font-medium">Verified Channel Listings:</div>
                  <div>Agoda Property: <strong>908532</strong></div>
                  <div>EaseMyTrip ID: <strong>EMTHOTEL-1349532</strong></div>
                  <div>BluePillow: <strong>628668a6f679d12a3a43aa08</strong></div>
                </li>
                <li className="pt-2">
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1.5 text-stone-500 hover:text-amber-300 transition-colors text-[11px]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Hotel Owner Login</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
            <div>
              &copy; {new Date().getFullYear()} Hotel Atrium, Pokhara. All rights reserved. Registered hospitality business in Gandaki Province, Nepal.
            </div>
            <div className="flex items-center gap-1 text-stone-400">
              <span>Warmly welcoming you to Pokhara</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>
      </footer>

      {/* Policies Dialog */}
      {modalPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#18202a] text-stone-100 max-w-lg w-full p-6 rounded-2xl border border-stone-700 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <h4 className="font-serif font-bold text-lg text-white">
                {modalPolicy === 'booking' && 'Booking & Cancellation Policy'}
                {modalPolicy === 'terms' && 'Terms & Conditions'}
                {modalPolicy === 'privacy' && 'Guest Privacy Policy'}
              </h4>
              <button
                onClick={() => setModalPolicy(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-300 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              {modalPolicy === 'booking' && (
                <>
                  <p><strong>Cancellation:</strong> {hotel.policies.cancellation}</p>
                  <p><strong>Check-in:</strong> Check-in begins at {hotel.checkInTime}. Early check-in is subject to room availability.</p>
                  <p><strong>Check-out:</strong> Check-out is at {hotel.checkOutTime}. Late check-out may incur additional hourly charges.</p>
                  <p><strong>Accepted Payments:</strong> Cash (NPR, USD, EUR), Visa, Mastercard, and Nepal digital wallets (eSewa, Khalti, FonePay).</p>
                  <p><strong>Damage &amp; Smoking:</strong> All rooms are non-smoking. Smoking in outdoor garden terraces is permitted.</p>
                </>
              )}
              {modalPolicy === 'terms' && (
                <>
                  <p>All guests are required to present a valid government-issued photo ID or international passport upon check-in.</p>
                  <p>Rates are listed in Nepalese Rupees (NPR / Rs.) and include standard property services unless stated otherwise.</p>
                  <p>Hotel Atrium provides complimentary safe luggage storage during trekking excursions for confirmed staying guests.</p>
                </>
              )}
              {modalPolicy === 'privacy' && (
                <>
                  <p>We respect your privacy. Guest contact details collected during reservation or inquiry are used solely for booking confirmation and customer service.</p>
                  <p>We never sell, rent, or distribute guest personal information to external third parties or advertisers.</p>
                </>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setModalPolicy(null)}
                className="px-4 py-2 rounded-lg bg-amber-600 text-stone-950 font-bold text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
