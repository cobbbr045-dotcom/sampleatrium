import React from 'react';
import { Star, ExternalLink, CheckCircle } from 'lucide-react';
import { verifiedReviews } from '../data/defaultHotelData.ts';
import { HotelInfo } from '../types/hotel.ts';

interface ReviewsSectionProps {
  hotel: HotelInfo;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ hotel }) => {
  return (
    <section id="reviews" className="py-24 bg-[#141b24] text-stone-100 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
            Verified Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Guest Ratings &amp; Reviews
          </h2>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mb-5" />

          {/* Rating Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Google Rating */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#1b2430] border border-stone-800 text-stone-200 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-2xl font-serif font-bold text-amber-400">
                  <span>{hotel.googleRating.toFixed(1)}</span>
                </div>
                <div className="text-left text-xs">
                  <div className="flex text-amber-400 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < Math.floor(hotel.googleRating) ? 'fill-amber-400 text-amber-400' : 'text-stone-600'}`}
                      />
                    ))}
                  </div>
                  <strong className="text-stone-100">{hotel.reviewCount}+ Google Reviews</strong>
                  <div className="text-[10px] text-stone-400">Lakeside Pokhara Location</div>
                </div>
              </div>
              <a
                href={hotel.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium flex items-center gap-1"
              >
                <span>Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Agoda Rating */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#1b2430] border border-stone-800 text-stone-200 shadow-md">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-serif font-bold text-emerald-400">
                  6.2<span className="text-xs font-normal text-stone-400">/10</span>
                </div>
                <div className="text-left text-xs">
                  <strong className="text-stone-100">Agoda Verified (ID: 908532)</strong>
                  <div className="text-[10px] text-stone-400">Good Value • Also on EaseMyTrip &amp; BluePillow</div>
                </div>
              </div>
              {hotel.ota?.agodaUrl && (
                <a
                  href={hotel.ota.agodaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium flex items-center gap-1"
                >
                  <span>Agoda</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {verifiedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#1a232e] rounded-xl p-6 border border-stone-800 hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs uppercase">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white flex items-center gap-1.5">
                        {rev.author}
                        <span title="Verified Review">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      </h4>
                      <div className="text-[10px] text-stone-400">
                        {rev.tripType} • {rev.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-600'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  Source: <strong>{rev.source}</strong>
                </span>
                <span className="text-amber-400/80">Lakeside Pokhara</span>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Direct Link Card */}
        <div className="mt-12 text-center">
          <p className="text-xs text-stone-400 mb-3">
            Have you stayed with us recently? We value your honest feedback.
          </p>
          <a
            href={hotel.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors"
          >
            <span>Read All 84+ Reviews on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>
      </div>
    </section>
  );
};
