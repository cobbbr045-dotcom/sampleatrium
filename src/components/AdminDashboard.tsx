import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Calendar,
  Bed,
  Building,
  Mail,
  Check,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Edit2,
  Trash2,
  Plus,
  Save,
  Phone,
  MessageCircle,
  FileText,
  DollarSign,
  Users,
} from 'lucide-react';
import { HotelInfo, RoomType, Booking, Inquiry, BookingStatus } from '../types/hotel.ts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: HotelInfo;
  rooms: RoomType[];
  onHotelUpdated: (updated: HotelInfo) => void;
  onRoomsUpdated: (updated: RoomType[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  hotel,
  rooms,
  onHotelUpdated,
  onRoomsUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'rooms' | 'hotel' | 'inquiries'>('bookings');

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBookingNotes, setSelectedBookingNotes] = useState<{ [id: string]: string }>({});

  // Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Room editing
  const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState<boolean>(false);
  const [newRoomForm, setNewRoomForm] = useState<Partial<RoomType>>({
    name: '',
    tagline: '',
    description: '',
    priceNpr: 2500,
    maxAdults: 2,
    maxChildren: 1,
    bedConfig: '1 Queen Bed',
    roomSizeSqM: 20,
    viewType: 'Mountain View',
    breakfastIncluded: false,
    breakfastPriceNpr: 650,
    cancellationPolicy: 'Free cancellation up to 48 hours before arrival',
    totalInventory: 5,
    photos: [],
    amenities: ['Free Wi-Fi', '24h Hot Shower', 'Private Ensuite Bath', 'Work Desk'],
  });

  // Hotel info editing form
  const [hotelForm, setHotelForm] = useState<HotelInfo>(hotel);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setHotelForm(hotel);
  }, [hotel]);

  // Load data once authenticated
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [resBookings, resInquiries] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/inquiries'),
      ]);
      const dataBookings = await resBookings.json();
      const dataInquiries = await resInquiries.json();
      if (dataBookings.success) setBookings(dataBookings.data);
      if (dataInquiries.success) setInquiries(dataInquiries.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  // PIN Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid passcode.');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    }
  };

  // Change booking status
  const handleUpdateBookingStatus = async (id: string, newStatus: BookingStatus) => {
    const notes = selectedBookingNotes[id];
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => (b.id === id ? data.data : b)));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Update Hotel Info
  const handleSaveHotelInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/hotel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hotelForm),
      });
      const data = await res.json();
      if (data.success) {
        onHotelUpdated(data.data);
        setSaveSuccessMsg('Hotel settings saved successfully!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save edited room
  const handleSaveRoom = async (room: RoomType) => {
    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room),
      });
      const data = await res.json();
      if (data.success) {
        const updated = rooms.map(r => r.id === room.id ? data.data : r);
        onRoomsUpdated(updated);
        setEditingRoom(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoomForm),
      });
      const data = await res.json();
      if (data.success) {
        onRoomsUpdated([...rooms, data.data]);
        setIsAddingRoom(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete room
  const handleDeleteRoom = async (id: string) => {
    if (!confirm('Are you sure you want to remove this room category?')) return;
    try {
      const res = await fetch(`/api/rooms/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        onRoomsUpdated(rooms.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-[#18202a] text-stone-100 w-full max-w-6xl rounded-2xl shadow-2xl border border-stone-800 flex flex-col h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-[#141b24] border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Hotel Atrium — Management Portal
              </h3>
              <p className="text-xs text-stone-400">
                Lakeside, Pokhara • Direct Bookings, Inventory &amp; Rates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Not Logged In View */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <form onSubmit={handleLogin} className="max-w-sm w-full bg-[#1e2733] p-8 rounded-2xl border border-stone-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-600/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-xl text-white">Owner / Staff Sign-In</h4>
              <p className="text-xs text-stone-400">
                Enter your administrative PIN to manage reservations, room prices, and guest inquiries.
              </p>

              {authError && (
                <div className="p-3 rounded-lg bg-red-950/70 border border-red-500/50 text-red-200 text-xs">
                  {authError}
                </div>
              )}

              <input
                type="password"
                placeholder="Enter PIN (Default: atrium2026)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full bg-[#0f141a] border border-stone-700 rounded-xl p-3 text-center text-stone-100 text-sm tracking-widest focus:outline-none focus:border-amber-400"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs Navigation */}
            <div className="flex bg-[#141b24] border-b border-stone-800 px-6 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-3.5 px-4 font-semibold text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                  activeTab === 'bookings'
                    ? 'border-amber-500 text-amber-400 bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Reservations ({bookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('rooms')}
                className={`py-3.5 px-4 font-semibold text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                  activeTab === 'rooms'
                    ? 'border-amber-500 text-amber-400 bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Bed className="w-4 h-4" />
                <span>Rooms &amp; Rates ({rooms.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('hotel')}
                className={`py-3.5 px-4 font-semibold text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                  activeTab === 'hotel'
                    ? 'border-amber-500 text-amber-400 bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Hotel Details &amp; Policies</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`py-3.5 px-4 font-semibold text-xs uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                  activeTab === 'inquiries'
                    ? 'border-amber-500 text-amber-400 bg-stone-800/40'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Inquiries ({inquiries.length})</span>
              </button>

              <button
                onClick={fetchAdminData}
                className="ml-auto py-2 px-3 text-stone-400 hover:text-amber-400 flex items-center gap-1.5 text-xs transition-colors"
                title="Refresh database records"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* TAB 1: BOOKINGS */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {/* Filter Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1e2733] p-3.5 rounded-xl border border-stone-800">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-stone-400">Filter Status:</span>
                      {['all', 'pending', 'confirmed', 'rejected', 'cancelled'].map(st => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-3 py-1 rounded-full capitalize text-xs font-medium cursor-pointer ${
                            statusFilter === st
                              ? 'bg-amber-600 text-stone-950 font-bold'
                              : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-stone-400">
                      Showing {bookings.filter(b => statusFilter === 'all' || b.status === statusFilter).length} bookings
                    </span>
                  </div>

                  {/* Bookings List */}
                  {bookings.filter(b => statusFilter === 'all' || b.status === statusFilter).length === 0 ? (
                    <div className="text-center py-12 text-stone-500 text-sm bg-[#1e2733] rounded-xl border border-stone-800">
                      No reservations matching "{statusFilter}".
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings
                        .filter(b => statusFilter === 'all' || b.status === statusFilter)
                        .map(b => (
                          <div
                            key={b.id}
                            className="bg-[#1e2733] rounded-xl p-5 border border-stone-800 hover:border-stone-700 transition-all space-y-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2.5">
                                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                                    {b.bookingReference}
                                  </span>
                                  <span
                                    className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                                      b.status === 'confirmed'
                                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                        : b.status === 'pending'
                                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                                        : 'bg-red-950 text-red-300 border border-red-500/30'
                                    }`}
                                  >
                                    {b.status}
                                  </span>
                                </div>
                                <h4 className="text-base font-serif font-bold text-white mt-1">
                                  {b.roomName} • {b.numRooms} Room(s)
                                </h4>
                                <div className="text-xs text-stone-400 mt-0.5">
                                  Stay: <strong className="text-stone-200">{b.checkIn}</strong> to <strong className="text-stone-200">{b.checkOut}</strong> ({b.nights} nights) • {b.adults} Adults {b.children > 0 ? `, ${b.children} Children` : ''}
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-lg font-bold text-amber-400">
                                  Rs. {b.totalNpr.toLocaleString()} NPR
                                </div>
                                <div className="text-[11px] text-stone-400">
                                  {b.includeBreakfast ? 'Breakfast Included' : 'Room Only'} (incl. 13% VAT)
                                </div>
                              </div>
                            </div>

                            {/* Guest Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#141b24] p-3 rounded-lg text-xs text-stone-300 border border-stone-800">
                              <div>
                                <span className="text-stone-500 block text-[10px] uppercase">Guest Name</span>
                                <strong className="text-white">{b.guestName}</strong>
                              </div>
                              <div>
                                <span className="text-stone-500 block text-[10px] uppercase">Phone / WhatsApp</span>
                                <div className="flex items-center gap-2">
                                  <span>{b.guestPhone}</span>
                                  <a
                                    href={`https://wa.me/${b.guestPhone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:text-emerald-300"
                                    title="Open WhatsApp chat with guest"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                              <div>
                                <span className="text-stone-500 block text-[10px] uppercase">Email</span>
                                <a href={`mailto:${b.guestEmail}`} className="text-amber-400 hover:underline">
                                  {b.guestEmail}
                                </a>
                              </div>
                            </div>

                            {b.specialRequests && (
                              <div className="text-xs bg-stone-900/60 p-2.5 rounded border border-stone-800 text-stone-300">
                                <strong className="text-amber-400 font-medium">Guest Special Request:</strong> {b.specialRequests}
                              </div>
                            )}

                            {/* Status Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800">
                              <div className="flex items-center gap-2 flex-1 max-w-md">
                                <input
                                  type="text"
                                  placeholder="Internal notes (e.g., room 302 assigned, airport pickup set)..."
                                  defaultValue={b.adminNotes || ''}
                                  onChange={(e) => setSelectedBookingNotes({ ...selectedBookingNotes, [b.id]: e.target.value })}
                                  className="w-full bg-[#141b24] border border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                {b.status !== 'confirmed' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                                    className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Accept &amp; Confirm</span>
                                  </button>
                                )}

                                {b.status !== 'rejected' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'rejected')}
                                    className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Reject</span>
                                  </button>
                                )}

                                {b.status !== 'cancelled' && (
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                                    className="px-3 py-1.5 rounded bg-rose-950 hover:bg-rose-900 text-rose-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                    <span>Cancel</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ROOMS & RATES */}
              {activeTab === 'rooms' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-white">Room Inventory &amp; Live Rates</h4>
                      <p className="text-xs text-stone-400">Configure nightly price in NPR, maximum guests, and room availability.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingRoom(true)}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Room Category</span>
                    </button>
                  </div>

                  {/* Add New Room Form */}
                  {isAddingRoom && (
                    <form onSubmit={handleCreateRoom} className="bg-[#1e2733] p-5 rounded-xl border border-amber-500/30 space-y-4">
                      <h5 className="font-serif font-bold text-base text-amber-300">Create New Room Type</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-stone-300 mb-1">Room Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Deluxe Balcony Suite"
                            value={newRoomForm.name}
                            onChange={e => setNewRoomForm({ ...newRoomForm, name: e.target.value })}
                            className="w-full bg-[#141b24] border border-stone-700 rounded p-2 text-stone-100"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-300 mb-1">Nightly Rate (NPR)</label>
                          <input
                            type="number"
                            required
                            value={newRoomForm.priceNpr}
                            onChange={e => setNewRoomForm({ ...newRoomForm, priceNpr: Number(e.target.value) })}
                            className="w-full bg-[#141b24] border border-stone-700 rounded p-2 text-stone-100"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-300 mb-1">Total Room Inventory Count</label>
                          <input
                            type="number"
                            required
                            value={newRoomForm.totalInventory}
                            onChange={e => setNewRoomForm({ ...newRoomForm, totalInventory: Number(e.target.value) })}
                            className="w-full bg-[#141b24] border border-stone-700 rounded p-2 text-stone-100"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-300 mb-1">Bed Configuration</label>
                          <input
                            type="text"
                            value={newRoomForm.bedConfig}
                            onChange={e => setNewRoomForm({ ...newRoomForm, bedConfig: e.target.value })}
                            className="w-full bg-[#141b24] border border-stone-700 rounded p-2 text-stone-100"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingRoom(false)}
                          className="px-3 py-1.5 rounded bg-stone-800 text-stone-300 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs"
                        >
                          Save Room Type
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Rooms Cards List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rooms.map(room => (
                      <div key={room.id} className="bg-[#1e2733] rounded-xl p-5 border border-stone-800 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-serif font-bold text-base text-white">{room.name}</h5>
                            <span className="text-xs text-amber-400 font-bold">
                              Rs. {room.priceNpr.toLocaleString()} / night
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setEditingRoom(editingRoom?.id === room.id ? null : room)}
                              className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-400"
                              title="Edit Room"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="p-1.5 rounded bg-stone-800 hover:bg-red-900 text-stone-400 hover:text-red-300"
                              title="Delete Room"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {editingRoom?.id === room.id ? (
                          <div className="space-y-3 pt-2 border-t border-stone-800 text-xs">
                            <div>
                              <label className="text-stone-400 block mb-1">Room Name</label>
                              <input
                                type="text"
                                value={editingRoom.name}
                                onChange={e => setEditingRoom({ ...editingRoom, name: e.target.value })}
                                className="w-full bg-[#141b24] border border-stone-700 rounded p-1.5 text-stone-100"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-stone-400 block mb-1">Rate (NPR)</label>
                                <input
                                  type="number"
                                  value={editingRoom.priceNpr}
                                  onChange={e => setEditingRoom({ ...editingRoom, priceNpr: Number(e.target.value) })}
                                  className="w-full bg-[#141b24] border border-stone-700 rounded p-1.5 text-stone-100"
                                />
                              </div>
                              <div>
                                <label className="text-stone-400 block mb-1">Inventory Units</label>
                                <input
                                  type="number"
                                  value={editingRoom.totalInventory}
                                  onChange={e => setEditingRoom({ ...editingRoom, totalInventory: Number(e.target.value) })}
                                  className="w-full bg-[#141b24] border border-stone-700 rounded p-1.5 text-stone-100"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                onClick={() => setEditingRoom(null)}
                                className="px-3 py-1 rounded bg-stone-800 text-stone-300"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveRoom(editingRoom)}
                                className="px-3 py-1 rounded bg-amber-600 text-stone-950 font-bold"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2 bg-[#141b24] p-3 rounded text-xs text-stone-300">
                            <div>
                              <span className="text-stone-500 block text-[10px]">Inventory</span>
                              <strong>{room.totalInventory} Units</strong>
                            </div>
                            <div>
                              <span className="text-stone-500 block text-[10px]">Max Guests</span>
                              <strong>{room.maxAdults} Adults</strong>
                            </div>
                            <div>
                              <span className="text-stone-500 block text-[10px]">Breakfast</span>
                              <strong>{room.breakfastIncluded ? 'Included' : `+Rs. ${room.breakfastPriceNpr}`}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: HOTEL DETAILS */}
              {activeTab === 'hotel' && (
                <form onSubmit={handleSaveHotelInfo} className="space-y-5 max-w-3xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-white">Hotel Property &amp; Policies</h4>
                      <p className="text-xs text-stone-400">Update official contact details, check-in times, and policies.</p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Hotel Info</span>
                    </button>
                  </div>

                  {saveSuccessMsg && (
                    <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs rounded-lg">
                      {saveSuccessMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-stone-300 block mb-1 font-semibold">Hotel Official Name</label>
                      <input
                        type="text"
                        value={hotelForm.name}
                        onChange={e => setHotelForm({ ...hotelForm, name: e.target.value })}
                        className="w-full bg-[#141b24] border border-stone-700 rounded p-2.5 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="text-stone-300 block mb-1 font-semibold">Address</label>
                      <input
                        type="text"
                        value={hotelForm.address}
                        onChange={e => setHotelForm({ ...hotelForm, address: e.target.value })}
                        className="w-full bg-[#141b24] border border-stone-700 rounded p-2.5 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="text-stone-300 block mb-1 font-semibold">Primary Phone</label>
                      <input
                        type="text"
                        value={hotelForm.phonePrimary}
                        onChange={e => setHotelForm({ ...hotelForm, phonePrimary: e.target.value })}
                        className="w-full bg-[#141b24] border border-stone-700 rounded p-2.5 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="text-stone-300 block mb-1 font-semibold">Secondary Phone</label>
                      <input
                        type="text"
                        value={hotelForm.phoneSecondary}
                        onChange={e => setHotelForm({ ...hotelForm, phoneSecondary: e.target.value })}
                        className="w-full bg-[#141b24] border border-stone-700 rounded p-2.5 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="text-stone-300 block mb-1 font-semibold">WhatsApp Number</label>
                      <input
                        type="text"
                        value={hotelForm.whatsapp}
                        onChange={e => setHotelForm({ ...hotelForm, whatsapp: e.target.value })}
                        className="w-full bg-[#141b24] border border-stone-700 rounded p-2.5 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="text-stone-300 block mb-1 font-semibold">Official Email</label>
                      <input
                        type="email"
                        value={hotelForm.email}
                        onChange={e => setHotelForm({ ...hotelForm, email: e.target.value })}
                        className="w-full bg-[#141b24] border border-stone-700 rounded p-2.5 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="text-stone-300 block mb-1 font-semibold">Check-In Time</label>
                      <input
                        type="text"
                        value={hotelForm.checkInTime}
                        onChange={e => setHotelForm({ ...hotelForm, checkInTime: e.target.value })}
                        className="w-full bg-[#141b24] border border-stone-700 rounded p-2.5 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="text-stone-300 block mb-1 font-semibold">Check-Out Time</label>
                      <input
                        type="text"
                        value={hotelForm.checkOutTime}
                        onChange={e => setHotelForm({ ...hotelForm, checkOutTime: e.target.value })}
                        className="w-full bg-[#141b24] border border-stone-700 rounded p-2.5 text-stone-100"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="text-stone-300 block mb-1 font-semibold">Cancellation Policy</label>
                    <textarea
                      rows={2}
                      value={hotelForm.policies.cancellation}
                      onChange={e => setHotelForm({ ...hotelForm, policies: { ...hotelForm.policies, cancellation: e.target.value } })}
                      className="w-full bg-[#141b24] border border-stone-700 rounded p-2 text-stone-100 resize-none"
                    />
                  </div>
                </form>
              )}

              {/* TAB 4: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <h4 className="font-serif font-bold text-lg text-white">Guest Contact Inquiries</h4>
                  {inquiries.length === 0 ? (
                    <div className="text-center py-12 text-stone-500 text-sm bg-[#1e2733] rounded-xl border border-stone-800">
                      No customer inquiries received yet.
                    </div>
                  ) : (
                    inquiries.map(inq => (
                      <div key={inq.id} className="bg-[#1e2733] p-5 rounded-xl border border-stone-800 space-y-3 text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-white text-sm">{inq.name}</strong>
                            <div className="text-stone-400 mt-0.5">
                              {inq.email} • {inq.phone || 'No phone provided'}
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                            {inq.status}
                          </span>
                        </div>
                        <div className="font-semibold text-amber-300">{inq.subject}</div>
                        <p className="text-stone-300 leading-relaxed bg-[#141b24] p-3 rounded border border-stone-800">
                          {inq.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
