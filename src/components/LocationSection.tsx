import React from 'react';
import { MapPin, Navigation, ExternalLink, Clock, Compass, Waves, Landmark, Mountain, Plane, Sparkles } from 'lucide-react';
import { HotelInfo } from '../types/hotel.ts';

interface LocationSectionProps {
  hotel: HotelInfo;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ hotel }) => {
  const verifiedPlaces = [
    {
      name: "Phewa (Fewa) Lake Promenade",
      category: "Nature & Waterfront",
      distance: "250 meters",
      travelTime: "3 min walk",
      description: "Pokhara's iconic freshwater lake with colorful wooden boats (doonga) and lakeside promenade.",
      icon: Waves,
    },
    {
      name: "Pokhara Disneyland",
      category: "Family Fun",
      distance: "400 meters",
      travelTime: "5 min walk",
      description: "Amusement park located in the Lakeside area featuring classic rides and evening entertainment.",
      icon: Sparkles,
    },
    {
      name: "Tal Barahi Island Temple",
      category: "Cultural Heritage",
      distance: "500 meters",
      travelTime: "5 min walk + boat",
      description: "Two-story pagoda temple dedicated to Goddess Durga situated on a scenic island in Phewa Lake.",
      icon: Landmark,
    },
    {
      name: "Sarangkot Viewpoint & Paragliding",
      category: "Adventure & Vistas",
      distance: "9.2 km",
      travelTime: "25 min drive",
      description: "Famous hilltop offering world-class sunrise views over Annapurna and premier paragliding launch site.",
      icon: Mountain,
    },
    {
      name: "World Peace Pagoda (Shanti Stupa)",
      category: "Buddhist Landmark",
      distance: "7.0 km",
      travelTime: "20 min drive or hike",
      description: "Monumental white pagoda on Anadu Hill offering panoramic views of Pokhara Valley and Himalayas.",
      icon: Landmark,
    },
    {
      name: "Pokhara Domestic / Old Airport",
      category: "Transport Hub",
      distance: "3.2 km",
      travelTime: "10 min drive",
      description: "Convenient domestic airport hub serving mountain flights and regional connections.",
      icon: Plane,
    },
  ];

  return (
    <section id="location" className="py-24 bg-[#faf8f5] text-stone-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-2">
            Prime Lakeside Address
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4">
            Location &amp; Nearby Highlights
          </h2>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto mb-5" />
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Conveniently situated on Uday Marg, Lakeside Ward 6, Pokhara. Walking distance to Phewa Lake, lakeside cafes, souvenir markets, and tour agencies.
          </p>
        </div>

        {/* Map & Property Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-start">
          {/* Property Address Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-stone-200 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
                Hotel Atrium, Pokhara
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                {hotel.address}, {hotel.city}, {hotel.province} {hotel.postalCode}, {hotel.country}
              </p>

              <div className="space-y-3 text-xs text-stone-700 pb-6 border-b border-stone-100">
                <div className="flex justify-between py-1">
                  <span className="text-stone-500 font-medium">To Phewa Lake:</span>
                  <span className="font-bold text-stone-900">250 meters (3 min walk)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500 font-medium">To Pokhara Disneyland:</span>
                  <span className="font-bold text-stone-900">400 meters (5 min walk)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500 font-medium">To Tourist Bus Park:</span>
                  <span className="font-bold text-stone-900">2.5 km (8 min drive)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500 font-medium">Check-In Time:</span>
                  <span className="font-bold text-stone-900">{hotel.checkInTime}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500 font-medium">Check-Out Time:</span>
                  <span className="font-bold text-stone-900">{hotel.checkOutTime}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={hotel.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Navigation className="w-4 h-4 text-stone-950" />
                <span>GET DIRECTIONS ON GOOGLE MAPS</span>
              </a>
            </div>
          </div>

          {/* Interactive Embedded Map View */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100 min-h-[420px] relative">
            <iframe
              title="Hotel Atrium Location on Google Maps"
              src="https://maps.google.com/maps?q=Hotel+Atrium+Uday+Marg+Pokhara+Nepal&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[420px] border-0"
              loading="lazy"
              allowFullScreen
            />
            {/* Map overlay hint */}
            <div className="absolute top-3 left-3 bg-[#141b24]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Hotel Atrium • Uday Marg, Lakeside</span>
            </div>
          </div>
        </div>

        {/* Nearby Attractions Architectural Cards (No Unverified Stock Images) */}
        <div>
          <h3 className="font-serif font-bold text-2xl text-stone-900 mb-6 flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-700" />
            <span>Key Pokhara Attractions &amp; Distances</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {verifiedPlaces.map((place, idx) => {
              const Icon = place.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md border border-stone-200 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {place.distance}
                        </span>
                        <span className="text-stone-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {place.travelTime}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-1">
                      {place.category}
                    </span>
                    <h4 className="font-serif font-bold text-base text-stone-900 mb-2">
                      {place.name}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {place.description}
                    </p>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Pokhara Nepal')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-amber-800 hover:text-amber-600 flex items-center gap-1 transition-colors pt-2 border-t border-stone-100"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
