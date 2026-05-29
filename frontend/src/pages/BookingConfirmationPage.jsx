import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/services/api';
import {
  CheckCircle2, Calendar, Users, Home, Download, Mail,
  MessageSquare, Phone, MapPin, Clock, CreditCard, Share2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { downloadBookingTicket } from '@/utils/pdfTicket';

export default function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const [downloading, setDownloading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [confettiDone, setConfettiDone] = useState(false);

  useEffect(() => {
    document.title = `Booking Confirmed — ${bookingId} | Silver Key Hotel`;
    // Simple confetti burst via CSS animation trigger
    setTimeout(() => setConfettiDone(true), 3000);
  }, [bookingId]);

  const { data, isLoading } = useQuery({
    queryKey: ['booking-confirm', bookingId],
    queryFn: () => bookingApi.getById(bookingId).then(r => r.data),
    enabled: !!bookingId,
    retry: 2,
  });

  const booking = data?.booking;

  const handleDownloadPDF = async () => {
    if (!booking) return;
    setDownloading(true);
    try {
      await downloadBookingTicket(booking);
      toast.success('Your ticket has been downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please try from My Bookings.');
    } finally {
      setDownloading(false);
    }
  };

  const handleResendEmail = async () => {
    setSendingEmail(true);
    try {
      await bookingApi.resendConfirmation(bookingId, 'email');
      toast.success('Confirmation email resent!');
    } catch {
      toast.error('Could not resend email — check My Bookings or call us.');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleWhatsApp = () => {
    const name = booking?.guest ? `${booking.guest.firstName} ${booking.guest.lastName}` : 'Guest';
    const checkIn = booking ? new Date(booking.checkIn).toLocaleDateString('en-IN') : '';
    const msg = encodeURIComponent(
      `Hi Silver Key Hotel!\n\nMy booking is confirmed:\nBooking ID: ${bookingId}\nGuest: ${name}\nCheck-in: ${checkIn}\n\nThank you!`
    );
    window.open(`https://wa.me/919322800100?text=${msg}`, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Silver Key Hotel — Booking Confirmed',
      text: `My stay at Silver Key Hotel is confirmed! Booking ID: ${bookingId}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const nights = booking?.nights || 1;
  const checkIn  = booking ? new Date(booking.checkIn) : null;
  const checkOut = booking ? new Date(booking.checkOut) : null;
  const fmtDate  = (d) => d?.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-cream pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4">

        {/* Success hero */}
        <div className="text-center mb-8 pt-8">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-200">
              <CheckCircle2 size={36} className="text-emerald-600" />
            </div>
            {/* Gold ring pulse */}
            <div className="absolute inset-0 rounded-full border-2 border-gold-400 animate-ping opacity-30" />
          </div>

          <p className="text-gold-600 text-xs uppercase tracking-[0.3em] mb-3">Reservation Confirmed</p>
          <h1 className="font-display text-4xl text-charcoal-800 mb-3">You're all set!</h1>
          <p className="text-charcoal-500 mb-5">
            Thank you for choosing Silver Key Hotel. A confirmation has been sent to{' '}
            {booking?.guest?.email ? (
              <strong className="text-charcoal-700">{booking.guest.email}</strong>
            ) : 'your email address'}.
          </p>

          {/* Booking ID badge */}
          <div className="inline-block bg-charcoal-900 border border-charcoal-700 rounded-sm px-8 py-4 mb-2">
            <p className="text-charcoal-400 text-xs uppercase tracking-widest mb-1">Booking Reference</p>
            <p className="text-gold-400 font-mono font-bold text-2xl tracking-wider">{bookingId}</p>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white border border-parchment rounded-sm shadow-luxury overflow-hidden mb-5">

          {/* Room image header */}
          {booking?.room?.images?.[0]?.url && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={booking.room.images[0].url}
                alt={booking.room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6 text-white">
                <p className="font-display text-2xl">{booking.room.name}</p>
                {booking.room.type && <p className="text-sm text-white/70 capitalize mt-0.5">{booking.room.type}</p>}
              </div>
            </div>
          )}

          {/* Loading shimmer */}
          {isLoading && !booking && (
            <div className="h-48 bg-charcoal-100 animate-pulse" />
          )}

          <div className="p-8">
            {/* Stay grid */}
            {booking && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-7">
                  {[
                    { icon: Calendar, label: 'Check-in', val: fmtDate(checkIn), sub: 'From 2:00 PM' },
                    { icon: Calendar, label: 'Check-out', val: fmtDate(checkOut), sub: 'Before 12:00 PM' },
                    { icon: Clock, label: 'Duration', val: `${nights} Night${nights !== 1 ? 's' : ''}`, sub: null },
                    {
                      icon: Users, label: 'Guests',
                      val: `${booking.adults} Adult${booking.adults !== 1 ? 's' : ''}${booking.children > 0 ? ` + ${booking.children}` : ''}`,
                      sub: null,
                    },
                  ].map(({ icon: Icon, label, val, sub }) => (
                    <div key={label} className="bg-cream border border-parchment rounded-sm p-4">
                      <p className="text-xs text-charcoal-400 flex items-center gap-1 mb-1">
                        <Icon size={10} /> {label}
                      </p>
                      <p className="font-semibold text-charcoal-800 text-sm leading-tight">{val}</p>
                      {sub && <p className="text-xs text-charcoal-400 mt-0.5">{sub}</p>}
                    </div>
                  ))}
                </div>

                {/* Payment summary */}
                <div className="border border-parchment rounded-sm overflow-hidden mb-7">
                  <div className="px-4 py-3 bg-cream border-b border-parchment">
                    <h3 className="text-xs text-charcoal-500 uppercase tracking-widest font-semibold">Payment Summary</h3>
                  </div>
                  {booking.pricing && (
                    <div className="divide-y divide-parchment text-sm">
                      <div className="flex justify-between px-4 py-2.5">
                        <span className="text-charcoal-500">Room ({nights} nights)</span>
                        <span>₹{(booking.pricing.totalRoomCharge || 0).toLocaleString('en-IN')}</span>
                      </div>
                      {booking.pricing.discount > 0 && (
                        <div className="flex justify-between px-4 py-2.5 text-green-700">
                          <span>Discount</span>
                          <span>−₹{booking.pricing.discount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between px-4 py-2.5">
                        <span className="text-charcoal-500">Taxes & GST</span>
                        <span>₹{(booking.pricing.taxes || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between px-4 py-3 bg-charcoal-900">
                        <span className="font-semibold text-white flex items-center gap-1.5">
                          <CreditCard size={13} /> Total Paid
                        </span>
                        <span className="font-display text-lg text-gold-400">
                          ₹{(booking.pricing.grandTotal || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guest info strip */}
                <div className="bg-cream border border-parchment rounded-sm p-4 text-sm mb-7">
                  <p className="text-xs text-charcoal-400 uppercase tracking-widest mb-3">Guest Information</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-charcoal-700">
                    <span className="font-medium">{booking.guest?.firstName} {booking.guest?.lastName}</span>
                    <span>{booking.guest?.email}</span>
                    {booking.guest?.phone && <span>{booking.guest.phone}</span>}
                  </div>
                  {booking.guest?.specialRequests && (
                    <p className="mt-3 text-xs text-charcoal-500 italic border-t border-parchment pt-3">
                      Special request: "{booking.guest.specialRequests}"
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Checklist / important notes */}
            <div className="bg-gold-50 border border-gold-200 rounded-sm p-5 mb-7">
              <p className="text-gold-700 text-xs uppercase tracking-widest font-semibold mb-3">Before You Arrive</p>
              <ul className="space-y-2 text-sm text-charcoal-600">
                {[
                  'Carry a valid government-issued photo ID at check-in',
                  'Check-in: 2:00 PM · Check-out: 12:00 PM',
                  'Free complimentary breakfast included',
                  'Valet parking available (₹200/day)',
                  'Contact us 24 hrs before for early/late arrangements',
                ].map(note => (
                  <li key={note} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-gold-500 flex-shrink-0 mt-0.5" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDownloadPDF}
                disabled={downloading || !booking}
                className="w-full flex items-center justify-center gap-2 bg-charcoal-900 text-gold-400 border border-charcoal-700 py-3.5 text-sm font-semibold uppercase tracking-widest hover:bg-charcoal-800 transition-colors disabled:opacity-60 rounded-sm"
              >
                <Download size={15} />
                {downloading ? 'Generating Ticket...' : 'Download PDF Ticket'}
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleResendEmail}
                  disabled={sendingEmail}
                  className="flex flex-col items-center gap-1.5 border border-parchment text-charcoal-600 py-3 text-xs font-semibold hover:border-gold-400 hover:text-gold-600 transition-colors disabled:opacity-60 rounded-sm"
                >
                  <Mail size={14} />
                  {sendingEmail ? 'Sending...' : 'Resend Email'}
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex flex-col items-center gap-1.5 border border-green-200 text-green-700 py-3 text-xs font-semibold hover:bg-green-50 transition-colors rounded-sm"
                >
                  <MessageSquare size={14} />
                  WhatsApp
                </button>
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1.5 border border-parchment text-charcoal-600 py-3 text-xs font-semibold hover:border-gold-400 hover:text-gold-600 transition-colors rounded-sm"
                >
                  <Share2 size={14} />
                  Share
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/" className="btn-outline text-xs text-center">
                  <Home size={13} className="inline mr-1.5" /> Back to Home
                </Link>
                <Link to="/my-bookings" className="btn-gold text-xs text-center">
                  View My Bookings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel contact card */}
        <div className="bg-charcoal-900 text-white rounded-sm p-6">
          <p className="text-gold-400 text-xs uppercase tracking-widest mb-4">Silver Key Hotel · Mysuru</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-charcoal-300">
            <a href="tel:+919322800100" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
              <Phone size={13} className="text-gold-600" /> +91 93228 00100
            </a>
            <a
              href="https://wa.me/919322800100"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-400 transition-colors"
            >
              <MessageSquare size={13} className="text-green-500" /> WhatsApp Us
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={13} className="text-gold-600" /> Palace Road, Mysuru
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
