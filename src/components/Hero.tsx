import React from 'react';
import { Star, MapPin, Compass, ShieldCheck, ArrowRight, Waves, CheckCircle2 } from 'lucide-react';
import { HotelInfo, RoomType } from '../types/hotel.ts';
import { BookingSearch, SearchParams } from './BookingSearch.tsx';

interface HeroProps {
  hotel: HotelInfo;
  onOpenBooking: () => void;
  onExploreRooms: () => void;
  onSearchRooms: (params: SearchParams, availableRooms?: (RoomType & { isAvailable: boolean; availableUnits: number })[]) => void;
}

export const Hero: React.FC<HeroProps> = ({
  hotel,
  onOpenBooking,
  onExploreRooms,
  onSearchRooms,
}) => {
  return (
    <section id="hero" className="relative min-h-[85vh] flex flex-col justify-between pt-16 pb-14 overflow-hidden bg-[#0b1017]">
      {/* Authentic Hotel Atrium Panorama Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hotel/slide.jpg"
          alt="Hotel Atrium Pokhara Property Panorama"
          className="w-full h-full object-cover object-center transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1017] via-[#0b1017]/85 to-[#0b1017]/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full my-auto py-8">
        <div className="max-w-3xl">
          {/* Verified Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{hotel.googleRating.toFixed(1)} / 5.0</span>
              <span className="text-stone-400 font-normal">({hotel.reviewCount} Google Reviews)</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800/80 border border-stone-700 text-stone-200 text-xs">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Uday Marg, Lakeside Pokhara</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <Waves className="w-3.5 h-3.5" />
              <span>3 Min Walk to Phewa Lake</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[11px] font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>Agoda ID: 908532</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-5 drop-shadow-sm">
            {hotel.heroHeading}
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-stone-300 leading-relaxed mb-8 max-w-2xl font-light">
            {hotel.heroSubheading}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <button
              onClick={onOpenBooking}
              className="px-8 py-3.5 rounded bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:shadow-amber-500/20 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>RESERVE YOUR STAY</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>

            <button
              onClick={onExploreRooms}
              className="px-7 py-3.5 rounded bg-stone-900/90 hover:bg-stone-800 text-stone-100 hover:text-amber-300 font-semibold text-xs uppercase tracking-wider border border-stone-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>VIEW ROOM CATEGORIES</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-800 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Direct Best Rate in NPR</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>24/7 Hot Solar Water</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Safe Trek Luggage Holding</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Search Panel Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full -mb-4">
        <BookingSearch onSearch={onSearchRooms} />
      </div>
    </section>
  );
};
