import React from 'react';
import {
  Wifi,
  Flame,
  UtensilsCrossed,
  Car,
  Mountain,
  SunMedium,
  Clock,
  Sparkles,
  Shirt,
  Compass,
  Luggage,
  Plane,
} from 'lucide-react';

export const AmenitiesSection: React.FC = () => {
  const verifiedAmenities = [
    {
      icon: Wifi,
      title: "High-Speed Wi-Fi",
      desc: "Fast, reliable wireless internet in all guest rooms, garden courtyard, and common areas.",
    },
    {
      icon: Flame,
      title: "24-Hour Hot Solar Water",
      desc: "Dependable high-pressure hot and cold showers powered by solar collectors with electric backup.",
    },
    {
      icon: UtensilsCrossed,
      title: "Restaurant & Bar Lounge",
      desc: "Authentic Nepali Thakali cuisine, freshly baked continental breakfast, coffee, and evening drinks.",
    },
    {
      icon: Mountain,
      title: "Rooftop Himalayan Terrace",
      desc: "Panoramic views of Mt. Machhapuchhre (Fishtail) and the snow-capped Annapurna mountain peaks.",
    },
    {
      icon: SunMedium,
      title: "Quiet Garden Courtyard",
      desc: "A peaceful green courtyard garden away from lakeside traffic, perfect for relaxing with tea or a book.",
    },
    {
      icon: Clock,
      title: "24-Hour Front Desk",
      desc: "Multilingual staff ready to assist with late check-ins, early trek departures, and emergency care.",
    },
    {
      icon: Compass,
      title: "Trekking & Tour Assistance",
      desc: "Assistance with ACAP permits, TIMS registration, Poon Hill/ABC treks, and Sarangkot paragliding bookings.",
    },
    {
      icon: Luggage,
      title: "Safe Trek Luggage Storage",
      desc: "Complimentary, secure locked luggage room to keep your extra baggage safe while you hike the Himalayas.",
    },
    {
      icon: Car,
      title: "Free Onsite Parking",
      desc: "Secure private parking on hotel grounds for cars, SUVs, and rental motorcycles/scooters.",
    },
    {
      icon: Plane,
      title: "Airport & Bus Transfers",
      desc: "Convenient pickup and drop-off to Pokhara International Airport (PIA) and Tourist Bus Park.",
    },
    {
      icon: Shirt,
      title: "Daily Housekeeping & Laundry",
      desc: "Attentive daily room cleaning, fresh cotton linen service, and same-day clothes laundry.",
    },
    {
      icon: Sparkles,
      title: "Power Backup Generator",
      desc: "Continuous power backup ensuring lighting, Wi-Fi, and device charging remain uninterrupted.",
    },
  ];

  return (
    <section id="amenities" className="py-24 bg-[#141b24] text-stone-100 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
            Comfort &amp; Genuine Nepali Hospitality
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Hotel Services &amp; Amenities
          </h2>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mb-5" />
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Thoughtfully curated amenities designed to provide maximum comfort for vacationers, couples, and Himalayan trekking adventurers alike.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {verifiedAmenities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#1a232e] p-6 rounded-xl border border-stone-800 hover:border-amber-500/40 hover:bg-[#1e2937] transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-serif font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Feature Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#1e2937] to-amber-950/60 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-serif font-bold text-white mb-1">
              Heading to the Annapurna Mountains?
            </h4>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              We offer free secure luggage storage for the entire duration of your trek, packed breakfast for early morning departures, and return transport coordination.
            </p>
          </div>
          <a
            href="#contact"
            className="px-6 py-2.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow"
          >
            Ask Travel Desk
          </a>
        </div>
      </div>
    </section>
  );
};
