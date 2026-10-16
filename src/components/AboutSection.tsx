import React from 'react';
import { HotelInfo } from '../types/hotel.ts';
import { Heart, Compass, Coffee, Clock, ArrowRight, ShieldCheck, Star, MapPin, CheckCircle2 } from 'lucide-react';

interface AboutSectionProps {
  hotel: HotelInfo;
  onOpenBooking: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ hotel, onOpenBooking }) => {
  return (
    <section id="about" className="py-24 bg-[#f5f2eb] text-stone-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Architectural Editorial Card (No Unverified Stock Images) */}
          <div className="lg:col-span-5">
            <div className="bg-[#141b24] text-stone-100 rounded-3xl p-8 sm:p-10 shadow-2xl border border-amber-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

              {/* Authentic Property Building Facade Photo */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-stone-700 mb-6 relative group">
                <img
                  src="/images/hotel/hotel.jpg"
                  alt="Hotel Atrium Pokhara Building Facade"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#141b24]/90 backdrop-blur-sm text-amber-300 text-[10px] font-semibold px-2.5 py-1 rounded border border-amber-500/30">
                  Hotel Atrium Facade
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-lg bg-white/10 p-1 flex items-center justify-center border border-amber-400/40">
                  <img
                    src="/images/hotel/logo1.png"
                    alt="Hotel Atrium Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
                    Verified Lakeside Establishment
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                    HOTEL ATRIUM
                  </h3>
                </div>
              </div>

              {/* Verified Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-800 text-xs">
                <div className="bg-[#1a232e] p-3 rounded-xl border border-stone-800">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-base mb-0.5">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>4.0 / 5.0</span>
                  </div>
                  <span className="text-[10px] text-stone-400">84 Google Reviews</span>
                </div>

                <div className="bg-[#1a232e] p-3 rounded-xl border border-stone-800">
                  <div className="text-emerald-400 font-bold text-base mb-0.5">
                    6.2 <span className="text-xs text-stone-400 font-normal">/ 10</span>
                  </div>
                  <span className="text-[10px] text-stone-400">Agoda (ID: 908532)</span>
                </div>

                <div className="bg-[#1a232e] p-3 rounded-xl border border-stone-800">
                  <div className="text-amber-300 font-bold text-sm mb-0.5">
                    250 Meters
                  </div>
                  <span className="text-[10px] text-stone-400">To Phewa Lake (3 min)</span>
                </div>

                <div className="bg-[#1a232e] p-3 rounded-xl border border-stone-800">
                  <div className="text-amber-300 font-bold text-sm mb-0.5">
                    13 Rooms
                  </div>
                  <span className="text-[10px] text-stone-400">Intimate Capacity</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800 flex items-center gap-2 text-stone-400 text-xs">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Uday Marg, Lakeside, Pokhara 33700</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Pillars */}
          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-2">
              Our Hospitality &amp; Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-6 leading-tight">
              Quiet Rest in the Heart of Lakeside Pokhara
            </h2>

            <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed mb-8">
              <p>
                Situated on peaceful Uday Marg in Pokhara’s Lakeside area, <strong>Hotel Atrium</strong> offers guests an intimate, tranquil retreat. Its location allows you to step away from the loud vehicle traffic of the main avenue, while staying merely 250 meters (a brief 3-minute stroll) from the picturesque waterfront of Phewa Lake.
              </p>
              <p>
                Whether you are resting before embarking on the Annapurna Circuit, returning from Poon Hill, or visiting Pokhara for leisure, our 24-hour reception desk provides attentive assistance with trekking permits, airport transfers, and secure luggage storage.
              </p>
            </div>

            {/* Pillar highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <Heart className="w-5 h-5 text-amber-700 mb-2" />
                <h4 className="font-semibold text-xs text-stone-900 uppercase tracking-wide">Warm Nepali Hospitality</h4>
                <p className="text-xs text-stone-600 mt-1">Honest, welcoming service with dedicated 24-hour reception staff.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <Compass className="w-5 h-5 text-amber-700 mb-2" />
                <h4 className="font-semibold text-xs text-stone-900 uppercase tracking-wide">Trekker Friendly</h4>
                <p className="text-xs text-stone-600 mt-1">Complimentary luggage holding while you hike the Himalayas.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <Coffee className="w-5 h-5 text-amber-700 mb-2" />
                <h4 className="font-semibold text-xs text-stone-900 uppercase tracking-wide">Restaurant &amp; Bar</h4>
                <p className="text-xs text-stone-600 mt-1">Authentic regional Nepali dishes, continental choices, and drinks.</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-stone-200">
                <Clock className="w-5 h-5 text-amber-700 mb-2" />
                <h4 className="font-semibold text-xs text-stone-900 uppercase tracking-wide">24/7 Hot Water</h4>
                <p className="text-xs text-stone-600 mt-1">Solar hot water system backed up by electricity in all rooms.</p>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Reserve Your Stay at Hotel Atrium</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
