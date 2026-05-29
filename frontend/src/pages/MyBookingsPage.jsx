import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bookingApi } from '@/services/api';
import {
  Calendar, Home, Download, Mail, MessageSquare, X, Clock,
  Users, CreditCard, MapPin, Phone, AlertCircle,
  CheckCircle2, RefreshCw, Eye, Star
} from 'lucide-react';
import toast from 'react-hot-toast';
import { downloadBookingTicket } from '@/utils/pdfTicket';

const STATUS_CONFIG = {
  pending:     { cls: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending', icon: Clock },
  confirmed:   { cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Confirmed', icon: CheckCircle2 },
  checked_in:  { cls: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Checked In', icon: Home },
  checked_out: { cls: 'bg-charcoal-100 text-charcoal-600 border-charcoal-200', label: 'Checked Out', icon: CheckCircle2 },
  cancelled:   { cls: 'bg-red-100 text-red-700 border-red-200', label: 'Cancelled', icon: X },
  no_show:     { cls: 'bg-orange-100 text-orange-700 border-orange-200', label: 'No Show', icon: AlertCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold border ${cfg.cls}`}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

function BookingDetailModal({ booking, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await downloadBookingTicket(booking);
      toast.success('Ticket downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleResendEmail = async () => {
    setSendingEmail(true);
    try {
      await bookingApi.resendConfirmation(booking.bookingId, 'email');
      toast.success('Confirmation email sent!');
    } catch {
      toast.error('Could not resend email — please contact us directly.');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi Silver Key Hotel,\n\nI need assistance with my booking:\nBooking ID: ${booking.bookingId}\nGuest: ${booking.guest?.firstName} ${booking.guest?.lastName}\nCheck-in: ${new Date(booking.checkIn).toLocaleDateString('en-IN')}\n\nPlease assist me.`
    );
    window.open(`https://wa.me/919322800100?text=${msg}`, '_blank');
  };

  const nights = booking.nights || 1;
  const checkIn  = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const fmtDate  = (d) => d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const canDownload = ['confirmed', 'checked_in', 'checked_out'].includes(booking.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl border border-parchment"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-charcoal-900 text-white px-8 py-6 flex items-start justify-between sticky top-0 z-10">
          <div>
            <p className="text-gold-400 text-xs uppercase tracking-widest mb-1">Booking Details</p>
            <h2 className="font-display text-2xl">{booking.room?.name || 'Room'}</h2>
            <p className="text-charcoal-300 font-mono text-sm mt-1">{booking.bookingId}</p>
          </div>
          <button onClick={onClose} className="text-charcoal-400 hover:text-white transition-colors mt-1">
            <X size={22} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={booking.status} />
            <span className="text-charcoal-400 text-xs">
              Booked on {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {canDownload && (
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center gap-2 bg-charcoal-900 text-gold-400 border border-charcoal-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-charcoal-800 transition-colors disabled:opacity-60 rounded-sm"
              >
                <Download size={13} />
                {downloading ? 'Generating PDF...' : 'Download Ticket (PDF)'}
              </button>
            )}
            <button
              onClick={handleResendEmail}
              disabled={sendingEmail}
              className="flex items-center gap-2 border border-parchment text-charcoal-600 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest hover:border-gold-400 hover:text-gold-600 transition-colors disabled:opacity-60 rounded-sm"
            >
              <Mail size={13} />
              {sendingEmail ? 'Sending...' : 'Resend Email'}
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 border border-green-200 text-green-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-green-50 transition-colors rounded-sm"
            >
              <MessageSquare size={13} />
              WhatsApp Support
            </button>
          </div>

          {booking.room?.images?.[0]?.url && (
            <div className="relative rounded-sm overflow-hidden h-44 bg-charcoal-100">
              <img
                src={booking.room.images[0].url}
                alt={booking.room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <p className="font-display text-lg">{booking.room.name}</p>
                {booking.room.type && <p className="text-xs text-white/70 capitalize">{booking.room.type}</p>}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs text-gold-600 uppercase tracking-widest font-semibold mb-4">Stay Information</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Check-in', val: fmtDate(checkIn), sub: 'From 2:00 PM' },
                { label: 'Check-out', val: fmtDate(checkOut), sub: 'Before 12:00 PM' },
                { label: 'Duration', val: `${nights} Night${nights !== 1 ? 's' : ''}`, sub: null },
                {
                  label: 'Guests',
                  val: `${booking.adults} Adult${booking.adults !== 1 ? 's' : ''}${booking.children > 0 ? ` + ${booking.children} Child` : ''}`,
                  sub: null,
                },
              ].map(({ label, val, sub }) => (
                <div key={label} className="bg-cream border border-parchment rounded-sm p-4">
                  <p className="text-xs text-charcoal-400 mb-1">{label}</p>
                  <p className="font-semibold text-charcoal-800 text-sm">{val}</p>
                  {sub && <p className="text-xs text-charcoal-400 mt-0.5">{sub}</p>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs text-gold-600 uppercase tracking-widest font-semibold mb-4">Guest Details</h3>
            <div className="space-y-0 divide-y divide-parchment text-sm">
              {[
                { label: 'Full Name', val: `${booking.guest?.firstName} ${booking.guest?.lastName}` },
                { label: 'Email', val: booking.guest?.email },
                { label: 'Phone', val: booking.guest?.phone || '—' },
                booking.guest?.idType && { label: 'ID Proof', val: `${booking.guest.idType.toUpperCase()} — ${booking.guest.idNumber}` },
              ].filter(Boolean).map(({ label, val }) => (
                <div key={label} className="flex justify-between py-3">
                  <span className="text-charcoal-400">{label}</span>
                  <span className="font-medium text-charcoal-800 text-right max-w-[55%] break-all">{val}</span>
                </div>
              ))}
              {booking.guest?.specialRequests && (
                <div className="py-3">
                  <p className="text-charcoal-400 text-xs mb-2">Special Requests</p>
                  <p className="text-charcoal-700 bg-cream border border-parchment rounded-sm p-3 italic text-sm">
                    "{booking.guest.specialRequests}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs text-gold-600 uppercase tracking-widest font-semibold mb-4">Payment Breakdown</h3>
            <div className="bg-cream border border-parchment rounded-sm overflow-hidden divide-y divide-parchment">
              {booking.pricing && (
                <>
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-charcoal-500">Room Rate / night</span>
                    <span className="font-medium">₹{(booking.pricing.roomRate || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-charcoal-500">Total Room Charge ({nights} nights)</span>
                    <span className="font-medium">₹{(booking.pricing.totalRoomCharge || 0).toLocaleString('en-IN')}</span>
                  </div>
                  {booking.pricing.discount > 0 && (
                    <div className="flex justify-between px-4 py-3 text-sm text-green-700">
                      <span>Discount</span>
                      <span className="font-medium">−₹{booking.pricing.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-charcoal-500">Taxes & GST</span>
                    <span className="font-medium">₹{(booking.pricing.taxes || 0).toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between px-4 py-4 bg-charcoal-900">
                <span className="font-semibold text-white flex items-center gap-1.5"><CreditCard size={14} /> Total Paid</span>
                <span className="font-display text-xl text-gold-400">₹{(booking.pricing?.grandTotal || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
            {booking.payment?.razorpayPaymentId && (
              <p className="mt-2 text-xs text-charcoal-400">
                Transaction: <span className="font-mono text-charcoal-600">{booking.payment.razorpayPaymentId}</span>
              </p>
            )}
          </div>

          <div className="bg-charcoal-900 text-white rounded-sm p-5">
            <p className="text-gold-400 text-xs uppercase tracking-widest mb-3">Hotel Contact</p>
            <div className="space-y-1.5 text-sm text-charcoal-300">
              <p className="flex items-center gap-2"><MapPin size={12} /> #12, Palace Road, Mysuru – 570001</p>
              <p className="flex items-center gap-2"><Phone size={12} /> +91 93228 00100 (24x7)</p>
              <p className="flex items-center gap-2"><Mail size={12} /> reservations@silverkeyhotel.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking, onViewDetails, onCancel, isCancelling }) {
  const canCancel = ['pending', 'confirmed'].includes(booking.status);
  const canDownload = ['confirmed', 'checked_in', 'checked_out'].includes(booking.status);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      await downloadBookingTicket(booking);
      toast.success('Ticket downloaded!');
    } catch {
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const nights = booking.nights || 1;
  const checkIn  = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);

  return (
    <div className="bg-white border border-parchment rounded-sm shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="flex">
        <div className="relative w-28 sm:w-36 flex-shrink-0">
          <img
            src={booking.room?.images?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=70'}
            alt={booking.room?.name || 'Room'}
            className="w-full h-full object-cover min-h-[120px]"
          />
        </div>

        <div className="flex-1 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-display text-lg text-charcoal-800 truncate">{booking.room?.name || 'Room'}</h3>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-gold-600 text-xs font-mono mb-3">{booking.bookingId}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-charcoal-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-gold-500" />
                  {checkIn.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' → '}
                  {checkOut.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={11} className="text-gold-500" />
                  {nights} Night{nights !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={11} className="text-gold-500" />
                  {booking.adults} Adult{booking.adults !== 1 ? 's' : ''}
                  {booking.children > 0 && ` + ${booking.children} Child`}
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-display text-xl font-bold text-charcoal-800">
                ₹{(booking.pricing?.grandTotal || 0).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-charcoal-400 capitalize">{booking.payment?.status || 'pending'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-parchment px-4 sm:px-5 py-3 bg-cream/50 flex flex-wrap items-center gap-3">
        <button
          onClick={() => onViewDetails(booking)}
          className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-gold-600 transition-colors"
        >
          <Eye size={12} /> View Details
        </button>

        {canDownload && (
          <>
            <span className="text-charcoal-200">|</span>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-gold-600 transition-colors disabled:opacity-50"
            >
              <Download size={12} />
              {downloading ? 'Generating...' : 'Download PDF Ticket'}
            </button>
          </>
        )}

        {booking.status === 'checked_out' && (
          <>
            <span className="text-charcoal-200">|</span>
            <Link to="/rooms" className="flex items-center gap-1.5 text-xs font-semibold text-gold-600 hover:text-gold-700">
              <Star size={12} /> Book Again
            </Link>
          </>
        )}

        {canCancel && (
          <button
            onClick={() => onCancel(booking.bookingId)}
            disabled={isCancelling}
            className="ml-auto text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1 rounded-sm transition-colors disabled:opacity-50"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const qc = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { document.title = 'My Bookings — Silver Key Hotel'; }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingApi.getMyBookings().then(r => r.data),
    retry: 2,
    staleTime: 60 * 1000,
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId) => bookingApi.cancel(bookingId, 'Cancelled by guest'),
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      qc.invalidateQueries(['my-bookings']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Cancel failed. Please try again.');
    },
  });

  const handleCancel = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel? This cannot be undone.')) {
      cancelMutation.mutate(bookingId);
    }
  };

  const allBookings = data?.bookings || [];
  const filtered = filterStatus === 'all'
    ? allBookings
    : allBookings.filter(b => b.status === filterStatus);

  const stats = {
    total: allBookings.length,
    upcoming: allBookings.filter(b => ['confirmed','checked_in'].includes(b.status) && new Date(b.checkIn) > new Date()).length,
    completed: allBookings.filter(b => b.status === 'checked_out').length,
    totalSpent: allBookings.filter(b => b.payment?.status === 'paid').reduce((s, b) => s + (b.pricing?.grandTotal || 0), 0),
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      {selectedBooking && (
        <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-gold-600 text-xs uppercase tracking-[0.3em] mb-2">My Account</p>
            <h1 className="font-display text-4xl text-charcoal-800">My Bookings</h1>
            <div className="gold-divider mx-0" />
          </div>
          <button onClick={() => refetch()} className="flex items-center gap-2 text-xs text-charcoal-500 hover:text-gold-600 transition-colors self-start sm:self-auto">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {!isLoading && !isError && allBookings.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Bookings', value: stats.total, icon: Calendar },
              { label: 'Upcoming Stays', value: stats.upcoming, icon: Clock },
              { label: 'Stays Completed', value: stats.completed, icon: CheckCircle2 },
              { label: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString('en-IN')}`, icon: CreditCard },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-white border border-parchment rounded-sm p-4 text-center">
                <Icon size={18} className="text-gold-500 mx-auto mb-2" />
                <p className="font-display text-xl text-charcoal-800">{value}</p>
                <p className="text-xs text-charcoal-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && allBookings.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'confirmed', 'checked_in', 'checked_out', 'pending', 'cancelled'].map(s => {
              const count = s === 'all' ? allBookings.length : allBookings.filter(b => b.status === s).length;
              if (s !== 'all' && count === 0) return null;
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    filterStatus === s
                      ? 'bg-charcoal-900 text-gold-400 border-charcoal-900'
                      : 'bg-white text-charcoal-500 border-parchment hover:border-gold-400'
                  }`}
                >
                  {s === 'all' ? `All (${count})` : `${s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} (${count})`}
                </button>
              );
            })}
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-parchment rounded-sm overflow-hidden animate-pulse">
                <div className="flex">
                  <div className="w-36 h-36 bg-charcoal-100" />
                  <div className="flex-1 p-5 space-y-3">
                    <div className="h-5 bg-charcoal-100 rounded w-1/3" />
                    <div className="h-3 bg-charcoal-100 rounded w-1/4" />
                    <div className="h-3 bg-charcoal-100 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-white border border-red-200 rounded-sm p-10 text-center">
            <AlertCircle size={36} className="mx-auto mb-4 text-red-400" />
            <p className="text-red-600 font-medium mb-1">Failed to load your bookings</p>
            <p className="text-charcoal-400 text-sm mb-6">Please check your connection or contact us.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => refetch()} className="btn-gold text-xs">Try Again</button>
              <a href="tel:+919322800100" className="btn-outline text-xs">Call Us</a>
            </div>
          </div>
        )}

        {!isLoading && !isError && allBookings.length === 0 && (
          <div className="bg-white border border-parchment rounded-sm p-16 text-center">
            <Calendar size={44} className="mx-auto mb-4 text-charcoal-200" />
            <p className="font-display text-xl text-charcoal-600 mb-2">No bookings yet</p>
            <p className="text-charcoal-400 text-sm mb-8">
              Your reservations will appear here once you book a room.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/rooms" className="btn-gold text-xs">Browse Rooms</Link>
              <Link to="/booking" className="btn-outline text-xs">Book Now</Link>
            </div>
          </div>
        )}

        {!isLoading && !isError && allBookings.length > 0 && filtered.length === 0 && (
          <div className="bg-white border border-parchment rounded-sm p-12 text-center">
            <p className="text-charcoal-400">No "{filterStatus.replace(/_/g, ' ')}" bookings found.</p>
            <button onClick={() => setFilterStatus('all')} className="mt-3 text-gold-600 text-sm hover:underline">Show all</button>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map(booking => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onViewDetails={setSelectedBooking}
                onCancel={handleCancel}
                isCancelling={cancelMutation.isPending}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="mt-10 bg-charcoal-900 text-white rounded-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg text-gold-400 mb-1">Need assistance?</p>
              <p className="text-charcoal-300 text-sm">Our team is available 24/7 to help with your booking.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <a href="tel:+919322800100" className="flex items-center gap-2 bg-gold-600 text-charcoal-900 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors rounded-sm">
                <Phone size={12} /> Call Us
              </a>
              <a href="https://wa.me/919322800100" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 border border-green-400 text-green-400 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-green-400 hover:text-charcoal-900 transition-colors rounded-sm">
                <MessageSquare size={12} /> WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
