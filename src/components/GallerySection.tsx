import React, { useState } from 'react';
import { GalleryPhoto } from '../types/hotel.ts';
import { Camera, ExternalLink, X, ChevronLeft, ChevronRight, Maximize2, CheckCircle2 } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryPhoto[];
  onOpenAdmin?: () => void;
  googleMapsUrl?: string;
  agodaUrl?: string;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  gallery,
  onOpenAdmin,
  googleMapsUrl = "https://maps.app.goo.gl/m2D4fEDZrGmS4qcY9",
  agodaUrl = "https://www.agoda.com/accom/property?propertyId=908532&countryId=120",
}) => {
  // Only display photos that are authentic and do NOT contain unsplash/stock placeholders
  const authenticPhotos = gallery.filter(
    item => item.url && !item.url.includes('unsplash.com') && !item.url.includes('placeholder')
  );

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const prevPhoto = () => {
    if (lightboxIdx !== null) {
      setLightboxIdx((lightboxIdx - 1 + authenticPhotos.length) % authenticPhotos.length);
    }
  };

  const nextPhoto = () => {
    if (lightboxIdx !== null) {
      setLightboxIdx((lightboxIdx + 1) % authenticPhotos.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#faf8f5] text-stone-900 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold block mb-2">
            Verified Photography • Lakeside Pokhara
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-4">
            Hotel Atrium Genuine Gallery
          </h2>
          <div className="w-16 h-0.5 bg-amber-600 mx-auto mb-5" />
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            All photography displayed depicts the actual Hotel Atrium property on Uday Marg, including its guestrooms, building facade, courtyard, and surrounding Lakeside environment.
          </p>
        </div>

        {/* Authentic Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {authenticPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIdx(idx)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200"
            >
              <img
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold mb-1">
                  Authentic • {photo.category}
                </span>
                <h4 className="font-serif font-semibold text-base mb-1">{photo.title}</h4>
                <p className="text-xs text-stone-300 line-clamp-2">{photo.caption}</p>
                <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full backdrop-blur-sm text-stone-200">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Channel Verified Traveler Photo Links */}
        <div className="max-w-4xl mx-auto bg-[#141b24] text-stone-100 rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Genuine Hotel Assets</span>
                </span>
              </div>
              <h4 className="text-lg font-serif font-bold text-white">
                Explore 84+ Traveler Captures on Official Channels
              </h4>
              <p className="text-xs text-stone-300 max-w-lg">
                View additional unedited traveler photos, room videos, and exterior views on Google Maps and Agoda.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#1e2733] hover:bg-stone-800 border border-stone-700 text-stone-200 hover:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Google Maps Photos</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>

              <a
                href={agodaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Agoda (ID: 908532) Photos</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen Lightbox Modal */}
      {lightboxIdx !== null && authenticPhotos[lightboxIdx] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-stone-300 max-w-6xl mx-auto w-full">
            <div>
              <span className="text-xs uppercase text-amber-400 tracking-wider">
                Photo {lightboxIdx + 1} of {authenticPhotos.length} • Authentic Hotel Atrium
              </span>
              <h4 className="text-sm sm:text-base font-serif font-bold text-white">
                {authenticPhotos[lightboxIdx].title}
              </h4>
            </div>
            <button
              onClick={() => setLightboxIdx(null)}
              className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800/80 hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Photo & Controls */}
          <div className="relative max-w-5xl mx-auto w-full my-auto flex items-center justify-center">
            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:-left-6 z-10 p-3 rounded-full bg-black/60 hover:bg-amber-600 text-white transition-colors cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={authenticPhotos[lightboxIdx].url}
              alt={authenticPhotos[lightboxIdx].title}
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />

            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:-right-6 z-10 p-3 rounded-full bg-black/60 hover:bg-amber-600 text-white transition-colors cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption */}
          <div className="text-center text-xs text-stone-400 max-w-2xl mx-auto pb-2">
            {authenticPhotos[lightboxIdx].caption}
          </div>
        </div>
      )}
    </section>
  );
};
