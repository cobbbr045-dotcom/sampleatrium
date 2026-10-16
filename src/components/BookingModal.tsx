import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Coffee, ShieldCheck, CheckCircle2, Phone, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import { RoomType, HotelInfo, Booking } from '../types/hotel.ts';
import { SearchParams } from './BookingSearch.tsx';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: HotelInfo;
  rooms: RoomType[];
  initialRoom?: RoomType | null;
  initialParams?: SearchParams | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  hotel,
  rooms,
  initialRoom,
  initialParams,
}) => {
  const getTodayString = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Dates & Room, 2: Guest Details, 3: Success Confirmation
  const [checkIn, setCheckIn] = useState<string>(initialParams?.checkIn || getTodayString(1));
  const [checkOut, setCheckOut] = useState<string>(initialParams?.checkOut || getTodayString(3));
  const [adults, setAdults] = useState<number>(initialParams?.adults || 2);
  const [children, setChildren] = useState<number>(initialParams?.children || 0);
  const [numRooms, setNumRooms] = useState<number>(initialParams?.roomsCount || 1);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(initialRoom?.id || rooms[0]?.id || '');
  const [includeBreakfast, setIncludeBreakfast] = useState<boolean>(false);

  // Guest fields
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (initialRoom) {
      setSelectedRoomId(initialRoom.id);
    }
  }, [initialRoom]);

  useEffect(() => {
    if (initialParams) {
      if (initialParams.checkIn) setCheckIn(initialParams.checkIn);
      if (initialParams.checkOut) setCheckOut(initialParams.checkOut);
      if (initialParams.adults) setAdults(initialParams.adults);
      if (initialParams.children !== undefined) setChildren(initialParams.children);
      if (initialParams.roomsCount) setNumRooms(initialParams.roomsCount);
    }
  }, [initialParams]);

  if (!isOpen) return null;

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));

  const roomSubtotal = (selectedRoom ? selectedRoom.priceNpr : 0) * nights * numRooms;
  const totalGuests = adults + children;
  const breakfastTotal = (includeBreakfast && selectedRoom && !selectedRoom.breakfastIncluded)
    ? (selectedRoom.breakfastPriceNpr * totalGuests * nights)
    : 0;
  const taxableSubtotal = roomSubtotal + breakfastTotal;
  const vatTotal = Math.round(taxableSubtotal * 0.13);
  const grandTotal = taxableSubtotal + vatTotal;

  const handleNextToGuestDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg('Check-out date must be after check-in date.');
      return;
    }
    setStep(2);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setErrorMsg('Please enter your full name, email, and phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          checkIn,
          checkOut,
          numRooms,
          adults,
          children,
          guestName,
          guestEmail,
          guestPhone,
          includeBreakfast,
          specialRequests,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedBooking(data.data);
        setStep(3);
      } else {
        setErrorMsg(data.error || 'Failed to submit booking request. Please check your details.');
      }
    } catch {
      setErrorMsg('Unable to reach server. Please call or WhatsApp the hotel directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#faf8f5] text-stone-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-300 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#141b24] text-stone-100 p-5 sm:p-6 flex items-center justify-between border-b border-stone-800">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
              Hotel Atrium • Lakeside Pokhara
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {step === 3 ? 'Reservation Request Received' : 'Reserve Your Stay'}
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Indicator */}
        {step !== 3 && (
          <div className="bg-[#f0ede6] px-6 py-2.5 border-b border-stone-300 flex items-center justify-between text-xs font-medium text-stone-600">
            <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-amber-800 font-bold' : 'text-stone-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-amber-700 text-white' : 'bg-stone-300 text-stone-700'}`}>1</span>
              <span>Select Dates &amp; Room</span>
            </div>
            <div className="h-px w-8 bg-stone-300 hidden sm:block" />
            <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-amber-800 font-bold' : 'text-stone-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-amber-700 text-white' : 'bg-stone-300 text-stone-700'}`}>2</span>
              <span>Guest Details &amp; Price Summary</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-5 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Dates & Room Selection */}
          {step === 1 && (
            <form onSubmit={handleNextToGuestDetails} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    min={getTodayString(0)}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-sm focus:border-amber-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    min={checkIn || getTodayString(1)}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-sm focus:border-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-700" />
                    Adults
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-sm focus:border-amber-600 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Adult' : 'Adults'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Children
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-sm focus:border-amber-600 focus:outline-none"
                  >
                    {[0, 1, 2, 3].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Child' : 'Children'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Rooms
                  </label>
                  <select
                    value={numRooms}
                    onChange={(e) => setNumRooms(Number(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-sm focus:border-amber-600 focus:outline-none"
                  >
                    {[1, 2, 3].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Room' : 'Rooms'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Room Category Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Select Room Category
                </label>
                <div className="space-y-2.5">
                  {rooms.map((room) => (
                    <label
                      key={room.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        selectedRoomId === room.id
                          ? 'border-amber-600 bg-amber-50/70 shadow-sm ring-1 ring-amber-500'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="selectedRoom"
                          value={room.id}
                          checked={selectedRoomId === room.id}
                          onChange={() => setSelectedRoomId(room.id)}
                          className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                        />
                        <div>
                          <div className="font-semibold text-stone-900 text-sm">{room.name}</div>
                          <div className="text-xs text-stone-500">{room.bedConfig} • {room.viewType}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-amber-800 text-sm">Rs. {room.priceNpr.toLocaleString()}</span>
                        <span className="text-[11px] text-stone-500 block">/ night</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Breakfast Option */}
              {selectedRoom && !selectedRoom.breakfastIncluded && (
                <div className="p-3.5 bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Coffee className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">Add Continental &amp; Nepali Breakfast</span>
                      <span className="text-[11px] text-stone-500">Fresh eggs, toast, fruit, Himalayan tea or coffee (Rs. {selectedRoom.breakfastPriceNpr}/person/day)</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeBreakfast}
                    onChange={(e) => setIncludeBreakfast(e.target.checked)}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                  />
                </div>
              )}

              {/* Estimated Nights Notice */}
              <div className="text-xs text-stone-600 flex justify-between px-1">
                <span>Calculated duration: <strong className="text-stone-900">{nights} {nights === 1 ? 'Night' : 'Nights'}</strong></span>
                <span>Room Subtotal: <strong className="text-amber-900">Rs. {roomSubtotal.toLocaleString()} NPR</strong></span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-95"
              >
                Continue to Guest Details &rarr;
              </button>
            </form>
          )}

          {/* STEP 2: Guest Details & Final Review */}
          {step === 2 && (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-stone-900 text-sm">
                  <span>{selectedRoom.name}</span>
                  <span>Rs. {selectedRoom.priceNpr.toLocaleString()} / night</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Dates: {checkIn} to {checkOut} ({nights} {nights === 1 ? 'Night' : 'Nights'})</span>
                  <span>{numRooms} {numRooms === 1 ? 'Room' : 'Rooms'} • {adults} Adults {children > 0 ? `, ${children} Children` : ''}</span>
                </div>
                <div className="flex justify-between text-stone-600 pt-1 border-t border-amber-200/50">
                  <span>Room Accommodation</span>
                  <span>Rs. {roomSubtotal.toLocaleString()}</span>
                </div>
                {breakfastTotal > 0 && (
                  <div className="flex justify-between text-stone-600">
                    <span>Breakfast ({totalGuests} guests x {nights} days)</span>
                    <span>Rs. {breakfastTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>Applicable 13% Government VAT</span>
                  <span>Rs. {vatTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-950 font-extrabold text-base pt-2 border-t border-amber-300">
                  <span>Total Payable at Hotel</span>
                  <span className="text-amber-900">Rs. {grandTotal.toLocaleString()} NPR</span>
                </div>
              </div>

              {/* Guest Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Smith"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-sm focus:border-amber-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+977 98..."
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-sm focus:border-amber-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-sm focus:border-amber-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Arrival time, flight number, airport pickup request, quiet floor, dietary needs, trek luggage storage..."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-sm focus:border-amber-600 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Policy note */}
              <div className="flex items-start gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>No upfront payment required.</strong> Pay upon arrival at Hotel Atrium reception in cash or card. Free cancellation up to 48 hours prior to check-in.
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>CONFIRM BOOKING REQUEST</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Reservation Request Received Confirmation */}
          {step === 3 && confirmedBooking && (
            <div className="text-center py-4 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold border border-amber-300 mb-2">
                  Reference: {confirmedBooking.bookingReference}
                </span>
                <h4 className="text-2xl font-serif font-bold text-stone-900">
                  Booking Request Received!
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Thank you, <strong>{confirmedBooking.guestName}</strong>. Your reservation request for the <strong>{confirmedBooking.roomName}</strong> from <strong>{confirmedBooking.checkIn}</strong> to <strong>{confirmedBooking.checkOut}</strong> has been saved.
                </p>
              </div>

              {/* Status explanation */}
              <div className="bg-stone-100 p-4 rounded-xl border border-stone-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Current Booking Status:</span>
                  <span className="uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {confirmedBooking.status} Confirmation
                  </span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed pt-1">
                  Our front desk at Hotel Atrium is verifying room assignment. A confirmation WhatsApp message or email will be sent to <strong>{confirmedBooking.guestPhone}</strong> shortly.
                </p>
                <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200 text-sm">
                  <span>Estimated Total Amount:</span>
                  <span className="text-amber-800">Rs. {confirmedBooking.totalNpr.toLocaleString()} NPR</span>
                </div>
              </div>

              {/* Direct Instant Confirmation CTAs */}
              <div className="pt-2 max-w-md mx-auto space-y-2">
                <a
                  href={`https://wa.me/${hotel.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello Hotel Atrium! I just submitted a booking request (Ref: ${confirmedBooking.bookingReference}) for ${confirmedBooking.roomName} from ${confirmedBooking.checkIn} to ${confirmedBooking.checkOut}. My name is ${confirmedBooking.guestName}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Hotel for Instant Confirmation</span>
                </a>

                <a
                  href={`tel:${hotel.phonePrimary.replace(/[^0-9+]/g, '')}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-700" />
                  <span>Call Front Desk ({hotel.phonePrimary})</span>
                </a>
              </div>

              <button
                onClick={handleReset}
                className="text-stone-500 hover:text-stone-800 text-xs underline pt-2 block mx-auto"
              >
                Close &amp; Return to Website
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
