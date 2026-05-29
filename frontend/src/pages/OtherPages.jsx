// Consolidated imports for all components in this file
import { useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Download, Home, Calendar, CalendarCheck, MapPin, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

// ── BookingConfirmationPage ───────────────────────────────────────
export function BookingConfirmationPage() {
  const { bookingId } = useParams();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 pt-20 pb-12">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="bg-white rounded-sm shadow-luxury border border-parchment p-10 text-center"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>

          <h1 className="font-display text-3xl text-charcoal-800 mb-2">Booking Confirmed!</h1>
          <p className="text-charcoal-500 text-sm mb-6">
            Your reservation has been confirmed. A confirmation email has been sent to your registered email address.
          </p>

          <div className="bg-charcoal-900 rounded-sm p-4 mb-8">
            <div className="text-charcoal-400 text-xs uppercase tracking-widest mb-1">Booking Reference</div>
            <div className="text-gold-400 font-display text-2xl font-bold">{bookingId}</div>
          </div>

          <div className="space-y-3 text-left mb-8 text-sm">
            <div className="flex items-center gap-3 text-charcoal-600">
              <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
              Confirmation email sent
            </div>
            <div className="flex items-center gap-3 text-charcoal-600">
              <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
              WhatsApp notification sent
            </div>
            <div className="flex items-center gap-3 text-charcoal-600">
              <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
              Check-in: 2:00 PM on your selected date
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/" className="btn-outline flex-1 flex items-center justify-center gap-2 text-xs">
              <Home size={14} /> Home
            </Link>
            <Link to="/my-bookings" className="btn-gold flex-1 flex items-center justify-center gap-2 text-xs">
              <Calendar size={14} /> My Bookings
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── MyBookingsPage ────────────────────────────────────────────────
export function MyBookingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingApi.getMyBookings().then((r) => r.data.bookings),
  });

  const STATUS_COLORS = {
    confirmed: 'text-emerald-600 bg-emerald-50',
    pending: 'text-amber-600 bg-amber-50',
    cancelled: 'text-red-600 bg-red-50',
    checked_in: 'text-blue-600 bg-blue-50',
    checked_out: 'text-charcoal-500 bg-charcoal-50',
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="mb-10">
          <h1 className="font-display text-4xl text-charcoal-800">My Bookings</h1>
          <div className="w-12 h-0.5 bg-gold-500 mt-3" />
        </div>

        {isLoading ? (
          <div className="space-y-4">{Array(3).fill(0).map((_, i) => <div key={i} className="bg-white h-32 rounded-sm animate-pulse" />)}</div>
        ) : data?.length > 0 ? (
          <div className="space-y-5">
            {data.map((booking) => (
              <div key={booking._id} className="bg-white rounded-sm border border-parchment shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-gold-600 font-bold text-sm">{booking.bookingId}</div>
                    <div className="font-display text-charcoal-800 text-xl mt-0.5">{booking.room?.name}</div>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${STATUS_COLORS[booking.status] || 'bg-gray-50 text-gray-600'}`}>
                    {booking.status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><div className="text-charcoal-400 text-xs mb-0.5">Check-in</div><div className="font-medium">{new Date(booking.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div></div>
                  <div><div className="text-charcoal-400 text-xs mb-0.5">Check-out</div><div className="font-medium">{new Date(booking.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div></div>
                  <div><div className="text-charcoal-400 text-xs mb-0.5">Nights</div><div className="font-medium">{booking.nights}</div></div>
                  <div><div className="text-charcoal-400 text-xs mb-0.5">Total Paid</div><div className="font-bold text-gold-600">₹{booking.pricing?.grandTotal?.toLocaleString('en-IN')}</div></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <CalendarCheck size={48} className="text-charcoal-300 mx-auto mb-4" />
            <p className="font-display text-2xl text-charcoal-400 mb-2">No bookings yet</p>
            <p className="text-charcoal-400 text-sm mb-6">Start your Silver Key experience today.</p>
            <Link to="/booking" className="btn-gold text-sm">Book Now</Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ── GalleryPage ───────────────────────────────────────────────────
const GALLERY_CATEGORIES = ['All', 'Rooms', 'Lobby', 'Amenities', 'Dining', 'Exterior'];

const GALLERY_ITEMS = Array(12).fill(0).map((_, i) => ({
  id: i,
  category: GALLERY_CATEGORIES[1 + (i % 5)],
  src: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=75',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=75',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=75',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=75',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=75',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=75',
  ][i % 6],
}));

export function GalleryPage() {
  const [active, setActive] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = active === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i) => i.category === active);

  return (
    <div className="min-h-screen bg-cream pt-24 pb-12">
      <div className="bg-charcoal-900 py-14 mb-10">
        <div className="text-center">
          <p className="text-gold-500 text-xs uppercase tracking-[0.3em] mb-3">Visual Journey</p>
          <h1 className="font-display text-5xl text-white font-bold">Our Gallery</h1>
          <div className="gold-divider" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-sm border transition-all ${
                active === cat ? 'bg-gold-500 text-charcoal-900 border-gold-500' : 'bg-white border-parchment text-charcoal-500 hover:border-gold-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              onClick={() => setLightbox(item)}
              className="break-inside-avoid cursor-pointer overflow-hidden rounded-sm group"
            >
              <img src={item.src} alt={item.category} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </motion.div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 bg-charcoal-900/95 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white"><X size={28} /></button>
          <img src={lightbox.src} alt="" className="max-h-[85vh] max-w-full object-contain rounded-sm shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

// ── ProtectedRoute ────────────────────────────────────────────────
export function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles.length > 0 && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

// ── PageLoader ────────────────────────────────────────────────────
export function PageLoader() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="font-display text-gold-500 text-2xl font-bold tracking-widest mb-4">Silver Key</div>
        <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}

// ── NotFoundPage ──────────────────────────────────────────────────
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display text-8xl text-charcoal-200 font-bold mb-4">404</div>
        <h1 className="font-display text-3xl text-charcoal-800 mb-2">Page Not Found</h1>
        <p className="text-charcoal-500 text-sm mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-gold text-sm">← Back to Home</Link>
      </div>
    </div>
  );
}

export default BookingConfirmationPage;
