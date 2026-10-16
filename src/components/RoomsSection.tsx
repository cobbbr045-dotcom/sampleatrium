import React from 'react';
import { Users, Bed, Maximize2, Coffee, Check, Shield, Calendar, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import { RoomType } from '../types/hotel.ts';
import { SearchParams } from './BookingSearch.tsx';

interface RoomsSectionProps {
  rooms: RoomType[];
  searchParams?: SearchParams | null;
  onSelectRoom: (room: RoomType) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({
  rooms,
  searchParams,
  onSelectRoom,
}) => {
  const nights = searchParams?.checkIn && searchParams?.checkOut
    ? Math.max(1, Math.ceil((new Date(searchParams.checkOut).getTime() - new Date(searchParams.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  // Filter only authentic photos that do NOT contain stock/unsplash domains
  const getAuthenticPhoto = (photos: string[]): string | null => {
    if (!photos || photos.length === 0) return null;
    const valid = photos.find(p => p && !p.includes('unsplash.com') && !p.includes('placeholder'));
    return valid || null;
  };

  return (
    <section id="rooms" className="py-24 bg-[#faf8f5] text-stone-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-2">
            Verified Property Categories • Lakeside Pokhara
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4">
            Rooms &amp; Suites
          </h2>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto mb-5" />
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            All 13 guestrooms at Hotel Atrium feature comfortable orthopaedic bedding, private ensuite bathrooms with guaranteed 24-hour hot solar showers, high-speed Wi-Fi, and peaceful Lakeside surroundings.
          </p>

          {searchParams?.checkIn && (
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>
                Selected stay: {searchParams.checkIn} to {searchParams.checkOut} ({nights} {nights === 1 ? 'night' : 'nights'})
              </span>
            </div>
          )}
        </div>

        {/* Verified OTA Price Match & Direct Booking Guarantee Banner */}
        <div className="mb-12 p-4 sm:p-5 rounded-2xl bg-[#141b24] text-stone-100 border border-amber-500/30 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-600 text-stone-950">
                  Best Price Guarantee
                </span>
                <span className="text-xs text-stone-300 font-medium">
                  Verified across Agoda (ID: 908532) • EaseMyTrip (EMTHOTEL-1349532) • BluePillow
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Direct booking through Hotel Atrium guarantees the lowest rate in NPR, free cancellation up to 48 hours, and zero OTA service markups.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-amber-300">
              <span className="px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700">✓ Free Trek Luggage Hold</span>
              <span className="px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700">✓ Pay Upon Arrival</span>
              <span className="px-2.5 py-1 rounded-md bg-stone-800/80 border border-stone-700">✓ Free 48h Cancellation</span>
            </div>
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {rooms.map((room) => {
            const authenticPhoto = getAuthenticPhoto(room.photos);
            const estRoomTotal = room.priceNpr * nights * (searchParams?.roomsCount || 1);
            const estVat = Math.round(estRoomTotal * 0.13);
            const estGrandTotal = estRoomTotal + estVat;

            return (
              <div
                key={room.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Display ONLY if authentic photo exists, otherwise clean architectural header */}
                  {authenticPhoto ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                      <img
                        src={authenticPhoto}
                        alt={room.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-[#141b24]/80 backdrop-blur-md text-amber-300 text-[11px] font-medium px-2.5 py-1 rounded flex items-center gap-1 border border-amber-500/30">
                        <Eye className="w-3 h-3 text-amber-400" />
                        <span>{room.viewType}</span>
                      </div>
                    </div>
                  ) : (
                    /* Clean architectural header without stock photography */
                    <div className="p-6 bg-gradient-to-r from-[#141b24] to-[#1c2532] text-stone-100 border-b border-stone-800 relative">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                          <Eye className="w-3 h-3 text-amber-400" />
                          <span>{room.viewType}</span>
                        </span>
                        {room.breakfastIncluded ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            Breakfast Included
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400">
                            Optional Breakfast +Rs. {room.breakfastPriceNpr}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-amber-400/90 font-medium">
                        Verified Category • {room.totalInventory} Units Available
                      </div>
                    </div>
                  )}

                  {/* Room Body */}
                  <div className="p-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                        {room.name}
                      </h3>
                      <div className="text-right">
                        <span className="text-xs text-stone-500 block">Starting from</span>
                        <span className="text-xl sm:text-2xl font-bold text-amber-800">
                          Rs. {room.priceNpr.toLocaleString()}
                        </span>
                        <span className="text-xs text-stone-600 font-medium"> / night</span>
                      </div>
                    </div>

                    <p className="text-xs text-amber-800 font-medium italic mb-3">
                      "{room.tagline}"
                    </p>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5">
                      {room.description}
                    </p>

                    {/* Room Key Specs Bar */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-[#f5f2eb] rounded-lg border border-stone-200 text-xs text-stone-700 mb-5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Up to {room.maxAdults} Adults</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="truncate">{room.bedConfig}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>{room.roomSizeSqM} m²</span>
                      </div>
                    </div>

                    {/* Room Amenities Tag List */}
                    <div className="space-y-1.5 mb-6">
                      <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                        Included Room Amenities
                      </span>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-stone-600">
                        {room.amenities.map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cancellation & Policy */}
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-5 pb-4 border-b border-stone-100">
                      <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{room.cancellationPolicy}</span>
                    </div>

                    {/* Stay Price Estimate if Dates Selected */}
                    {searchParams?.checkIn && (
                      <div className="bg-amber-50/70 p-3 rounded-md border border-amber-200/80 mb-5 text-xs">
                        <div className="flex justify-between items-center text-stone-700">
                          <span>{nights} {nights === 1 ? 'Night' : 'Nights'} x Rs. {room.priceNpr.toLocaleString()}</span>
                          <span className="font-semibold">Rs. {estRoomTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-stone-500 text-[11px] mt-0.5">
                          <span>Applicable 13% Nepal VAT</span>
                          <span>Rs. {estVat.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-stone-900 font-bold text-sm mt-1.5 pt-1.5 border-t border-amber-200">
                          <span>Estimated Stay Total</span>
                          <span className="text-amber-900">Rs. {estGrandTotal.toLocaleString()} NPR</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectRoom(room)}
                    className="w-full py-3 px-4 rounded bg-[#141b24] hover:bg-amber-600 text-stone-100 hover:text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-amber-400 group-hover:text-stone-950" />
                    <span>BOOK THIS ROOM</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
