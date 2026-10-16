import React, { useState } from 'react';
import { Calendar, Users, Home, Search, Loader2 } from 'lucide-react';
import { RoomType } from '../types/hotel.ts';

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomsCount: number;
}

interface BookingSearchProps {
  onSearch: (params: SearchParams, availableRooms?: (RoomType & { isAvailable: boolean; availableUnits: number })[]) => void;
  className?: string;
}

export const BookingSearch: React.FC<BookingSearchProps> = ({ onSearch, className = '' }) => {
  // Format dates: tomorrow as check-in, 2 days later as check-out
  const getTodayString = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  };

  const [checkIn, setCheckIn] = useState<string>(getTodayString(1));
  const [checkOut, setCheckOut] = useState<string>(getTodayString(3));
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCheckIn(val);
    // If checkOut is before or equal to checkIn, advance checkOut
    if (new Date(checkOut) <= new Date(val)) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOut(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (outDate <= inDate) {
      setErrorMsg('Check-out date must be at least 1 night after check-in.');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        adults: adults.toString(),
        children: children.toString(),
        roomsCount: roomsCount.toString(),
      });

      const res = await fetch(`/api/availability?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        onSearch({ checkIn, checkOut, adults, children, roomsCount }, data.data);
      } else {
        setErrorMsg(data.error || 'Failed to check availability.');
        onSearch({ checkIn, checkOut, adults, children, roomsCount });
      }
    } catch {
      onSearch({ checkIn, checkOut, adults, children, roomsCount });
    } finally {
      setLoading(false);
    }
  };

  const minCheckIn = getTodayString(0);
  const minCheckOut = checkIn ? getTodayString(0) : getTodayString(1);

  return (
    <div className={`bg-[#18202a]/95 backdrop-blur-md rounded-lg shadow-2xl p-4 sm:p-6 border border-amber-500/30 text-stone-100 ${className}`}>
      {errorMsg && (
        <div className="mb-4 text-xs bg-red-950/80 border border-red-500/50 text-red-200 p-2.5 rounded">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
        {/* Check-In */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            Check-In Date
          </label>
          <input
            type="date"
            min={minCheckIn}
            value={checkIn}
            onChange={handleCheckInChange}
            required
            className="w-full bg-[#0f141a] border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
          />
        </div>

        {/* Check-Out */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            Check-Out Date
          </label>
          <input
            type="date"
            min={minCheckOut}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            className="w-full bg-[#0f141a] border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:outline-none focus:border-amber-400 cursor-pointer"
          />
        </div>

        {/* Adults & Children */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            Guests
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="bg-[#0f141a] border border-stone-700 rounded px-2.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
              ))}
            </select>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              className="bg-[#0f141a] border border-stone-700 rounded px-2.5 py-2 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
            >
              {[0, 1, 2, 3].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rooms Count */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-1.5 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-amber-400" />
            Rooms
          </label>
          <select
            value={roomsCount}
            onChange={(e) => setRoomsCount(Number(e.target.value))}
            className="w-full bg-[#0f141a] border border-stone-700 rounded px-3 py-2 text-stone-100 text-sm focus:outline-none focus:border-amber-400"
          >
            {[1, 2, 3, 4].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider rounded transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>SEARCH ROOMS</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
