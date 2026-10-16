/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { RoomsSection } from './components/RoomsSection.tsx';
import { AmenitiesSection } from './components/AmenitiesSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { LocationSection } from './components/LocationSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { ConciergeModal } from './components/ConciergeModal.tsx';
import { SearchParams } from './components/BookingSearch.tsx';
import { defaultHotelInfo, defaultRooms, defaultGallery } from './data/defaultHotelData.ts';
import { HotelInfo, RoomType, GalleryPhoto } from './types/hotel.ts';
import { MessageCircle, Sparkles, Calendar } from 'lucide-react';

export default function App() {
  const [hotel, setHotel] = useState<HotelInfo>(defaultHotelInfo);
  const [rooms, setRooms] = useState<RoomType[]>(defaultRooms);
  const [gallery, setGallery] = useState<GalleryPhoto[]>(defaultGallery);

  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<RoomType | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);

  // Load latest live data from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resHotel, resRooms, resGal] = await Promise.all([
          fetch('/api/hotel'),
          fetch('/api/rooms'),
          fetch('/api/gallery'),
        ]);

        const dataHotel = await resHotel.json();
        const dataRooms = await resRooms.json();
        const dataGal = await resGal.json();

        if (dataHotel.success && dataHotel.data) setHotel(dataHotel.data);
        if (dataRooms.success && dataRooms.data) setRooms(dataRooms.data);
        if (dataGal.success && dataGal.data) setGallery(dataGal.data);
      } catch (err) {
        console.warn("Using offline/default initial state:", err);
      }
    };

    fetchData();
  }, []);

  const handleOpenBooking = (room?: RoomType) => {
    if (room) {
      setSelectedRoomForBooking(room);
    } else {
      setSelectedRoomForBooking(rooms[0] || null);
    }
    setIsBookingOpen(true);
  };

  const handleSearchRooms = (params: SearchParams) => {
    setSearchParams(params);
    // Smooth scroll down to rooms section
    const el = document.getElementById('rooms');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectRoomFromSection = (room: RoomType) => {
    setSelectedRoomForBooking(room);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col font-sans selection:bg-[#c59d5f]/20 selection:text-[#8c6721]">
      {/* Navigation */}
      <Navbar
        hotel={hotel}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
      />

      {/* Main Sections */}
      <main className="flex-1">
        <Hero
          hotel={hotel}
          onOpenBooking={() => handleOpenBooking()}
          onExploreRooms={() => {
            const el = document.getElementById('rooms');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onSearchRooms={handleSearchRooms}
        />

        <RoomsSection
          rooms={rooms}
          searchParams={searchParams}
          onSelectRoom={handleSelectRoomFromSection}
        />

        <AmenitiesSection />

        <GallerySection
          gallery={gallery}
          onOpenAdmin={() => setIsAdminOpen(true)}
          googleMapsUrl={hotel.googleMapsUrl}
          agodaUrl={hotel.ota?.agodaUrl}
        />

        <AboutSection
          hotel={hotel}
          onOpenBooking={() => handleOpenBooking()}
        />

        <ReviewsSection hotel={hotel} />

        <LocationSection hotel={hotel} />

        <ContactSection
          hotel={hotel}
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* Footer */}
      <Footer
        hotel={hotel}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {/* Floating Concierge AI Trigger */}
        <button
          onClick={() => setIsConciergeOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#18202a] text-amber-300 border border-amber-500/40 shadow-xl hover:bg-[#202b38] transition-all hover:scale-105 group text-xs font-semibold cursor-pointer"
          title="Pokhara Trip Sherpa & Stay Guide"
        >
          <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Ask AI Concierge</span>
        </button>

        {/* Floating WhatsApp Action */}
        <a
          href={`https://wa.me/${hotel.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl transition-all hover:scale-105 text-xs font-bold"
          title="WhatsApp Hotel Directly"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp Us</span>
        </a>
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        hotel={hotel}
        rooms={rooms}
        initialRoom={selectedRoomForBooking}
        initialParams={searchParams}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        hotel={hotel}
        rooms={rooms}
        onHotelUpdated={(updated) => setHotel(updated)}
        onRoomsUpdated={(updated) => setRooms(updated)}
      />

      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        hotel={hotel}
      />
    </div>
  );
}
