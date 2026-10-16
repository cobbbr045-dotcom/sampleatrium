import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2, Navigation, Calendar } from 'lucide-react';
import { HotelInfo } from '../types/hotel.ts';

interface ContactSectionProps {
  hotel: HotelInfo;
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ hotel, onOpenBooking }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Room Inquiry & Availability');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message || 'Your inquiry has been submitted! Our team will contact you shortly.');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setErrorMsg(data.error || 'Failed to send inquiry.');
      }
    } catch {
      setErrorMsg('Failed to connect to the server. Please call or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#141b24] text-stone-100 scroll-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
            Direct Reservations &amp; Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
            Connect with Hotel Atrium
          </h2>
          <div className="w-16 h-0.5 bg-amber-500 mx-auto mb-5" />
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Our 24-hour reception desk is ready to assist you with room reservations, airport pickup, Annapurna trek permit advice, and special requests.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Direct Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1a232e] rounded-2xl p-6 sm:p-8 border border-stone-800 space-y-6">
              <h3 className="font-serif font-bold text-xl text-white">
                Contact Information
              </h3>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-400 block uppercase font-medium">Telephone (Reception)</span>
                  <a
                    href={`tel:${hotel.phonePrimary.replace(/[^0-9+]/g, '')}`}
                    className="text-stone-100 font-bold hover:text-amber-300 transition-colors block text-sm sm:text-base"
                  >
                    {hotel.phonePrimary}
                  </a>
                  <a
                    href={`tel:${hotel.phoneSecondary.replace(/[^0-9+]/g, '')}`}
                    className="text-stone-300 text-xs hover:text-amber-300 transition-colors block"
                  >
                    {hotel.phoneSecondary} (Line 2)
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-400 block uppercase font-medium">Official WhatsApp</span>
                  <a
                    href={`https://wa.me/${hotel.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-300 font-bold hover:underline block text-sm sm:text-base"
                  >
                    {hotel.whatsapp}
                  </a>
                  <span className="text-[11px] text-stone-400">Available 24/7 for instant chat &amp; booking</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-400 block uppercase font-medium">Email Inquiries</span>
                  <a
                    href={`mailto:${hotel.email}`}
                    className="text-stone-100 font-semibold hover:text-amber-300 transition-colors block text-sm"
                  >
                    {hotel.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-400 block uppercase font-medium">Hotel Address</span>
                  <p className="text-stone-200 text-sm leading-relaxed">
                    {hotel.address}, {hotel.city}, {hotel.province} {hotel.postalCode}, {hotel.country}
                  </p>
                </div>
              </div>

              {/* Reception Hours */}
              <div className="flex items-start gap-4 pt-2 border-t border-stone-800">
                <div className="w-10 h-10 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-stone-400 block uppercase font-medium">Reception Hours</span>
                  <p className="text-stone-200 text-sm font-semibold">{hotel.receptionHours}</p>
                  <p className="text-[11px] text-stone-400">Check-in: {hotel.checkInTime} • Check-out: {hotel.checkOutTime}</p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${hotel.phonePrimary.replace(/[^0-9+]/g, '')}`}
                className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4 text-stone-950" />
                <span>Call Hotel</span>
              </a>

              <a
                href={`https://wa.me/${hotel.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>

              <a
                href={hotel.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-stone-700 transition-all"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Get Directions</span>
              </a>

              <button
                onClick={onOpenBooking}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Stay</span>
              </button>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[#1a232e] rounded-2xl p-6 sm:p-8 border border-stone-800">
            <h3 className="font-serif font-bold text-xl text-white mb-2">
              Send an Inquiry
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Have questions about room availability, airport transfer, or Annapurna trekking advice? Submit your request below.
            </p>

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#111720] border border-stone-700 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#111720] border border-stone-700 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+977..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#111720] border border-stone-700 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#111720] border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Room Inquiry & Availability">Room Inquiry &amp; Availability</option>
                    <option value="Airport Pickup / Transfer">Airport Pickup / Transfer</option>
                    <option value="Trekking & Luggage Storage">Trekking &amp; Luggage Storage</option>
                    <option value="Group Booking / Long Stay">Group Booking / Long Stay</option>
                    <option value="Other Questions">Other Questions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your planned arrival dates, number of guests, or special requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#111720] border border-stone-700 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Inquiry...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SEND MESSAGE TO HOTEL</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
