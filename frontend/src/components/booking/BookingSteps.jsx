import { useState } from 'react';
import { bookingApi } from '@/services/api';
import { useBookingStore, useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Calendar, Users, CheckCircle2, CreditCard, Lock } from 'lucide-react';

// ── Step 1: Date + availability check ────────────────────────────
export function BookingStepSearch({ room, onConfirm }) {
  const { checkIn, checkOut, adults, setDates, setGuests } = useBookingStore();
  const [loading, setLoading] = useState(false);
  const [localCheckIn, setLocalCheckIn] = useState(checkIn ? checkIn.slice(0, 10) : '');
  const [localCheckOut, setLocalCheckOut] = useState(checkOut ? checkOut.slice(0, 10) : '');
  const [localAdults, setLocalAdults] = useState(adults || 2);

  const today = new Date().toISOString().slice(0, 10);

  const handleCheck = async function () {
    if (!localCheckIn || !localCheckOut) return toast.error('Please select check-in and check-out dates');
    if (localCheckIn >= localCheckOut) return toast.error('Check-out must be after check-in');
    if (!room) return toast.error('No room selected. Please go to Rooms page first.');

    setLoading(true);
    try {
      var res = await bookingApi.checkAvailability({
        roomId: room._id,
        checkIn: localCheckIn,
        checkOut: localCheckOut,
        adults: localAdults,
      });
      var data = res.data;
      if (!data.available) {
        toast.error(data.message || 'Room not available for selected dates');
        return;
      }
      setDates(localCheckIn, localCheckOut);
      setGuests(localAdults, 0);
      toast.success('Room is available! ✓');
      onConfirm(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to check availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-parchment rounded-sm shadow-luxury p-8 max-w-2xl mx-auto">
      {room ? (
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-parchment">
          <img
            src={room.primaryImage || room.images?.[0]?.url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&q=60'}
            alt={room.name}
            className="w-20 h-20 object-cover rounded-sm flex-shrink-0"
          />
          <div>
            <p className="text-gold-600 text-xs uppercase tracking-widest">{room.type}</p>
            <h3 className="font-display text-xl text-charcoal-800 font-bold">{room.name}</h3>
            <p className="text-charcoal-500 text-sm mt-0.5">
              ₹{room.price?.base?.toLocaleString('en-IN')}<span className="text-xs">/night</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-sm text-amber-700 text-sm">
          No room selected. Please <a href="/rooms" className="underline font-bold">browse rooms</a> and click Book.
        </div>
      )}

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">
              <Calendar size={12} className="inline mr-1" />Check-in
            </label>
            <input
              type="date"
              min={today}
              value={localCheckIn}
              onChange={function (e) { setLocalCheckIn(e.target.value); }}
              className="input-luxury"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">
              <Calendar size={12} className="inline mr-1" />Check-out
            </label>
            <input
              type="date"
              min={localCheckIn || today}
              value={localCheckOut}
              onChange={function (e) { setLocalCheckOut(e.target.value); }}
              className="input-luxury"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">
            <Users size={12} className="inline mr-1" />Adults
          </label>
          <select
            value={localAdults}
            onChange={function (e) { setLocalAdults(Number(e.target.value)); }}
            className="input-luxury"
          >
            {[1, 2, 3, 4].map(function (n) { return <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>; })}
          </select>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || !room}
          className="btn-gold w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-charcoal-900/30 border-t-charcoal-900 rounded-full animate-spin" />
              Checking...
            </span>
          ) : 'Check Availability'}
        </button>
      </div>
    </div>
  );
}

// ── Step 2: Guest details form ────────────────────────────────────
export function BookingStepGuest({ room, availabilityData, defaultValues, onSubmit, onBack }) {
  const [form, setForm] = useState({
    firstName: defaultValues?.firstName || '',
    lastName: defaultValues?.lastName || '',
    email: defaultValues?.email || '',
    phone: defaultValues?.phone || '',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = function (e) {
    setForm(function (prev) { return Object.assign({}, prev, { [e.target.name]: e.target.value }); });
  };

  const handleSubmit = async function () {
    if (!form.firstName || !form.lastName || !form.email || !form.phone) {
      return toast.error('Please fill all required fields');
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      return toast.error('Enter a valid 10-digit Indian mobile number');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return toast.error('Enter a valid email address');
    }
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  var pricing = availabilityData?.pricing;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div className="lg:col-span-2 bg-white border border-parchment rounded-sm shadow-luxury p-8">
        <h3 className="font-display text-xl text-charcoal-800 mb-6">Guest Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">First Name *</label>
              <input name="firstName" value={form.firstName} onChange={handleChange} className="input-luxury" placeholder="John" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">Last Name *</label>
              <input name="lastName" value={form.lastName} onChange={handleChange} className="input-luxury" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input-luxury" placeholder="john@example.com" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">Phone * (10-digit)</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input-luxury" placeholder="9876543210" maxLength={10} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">Special Requests</label>
            <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} rows={3} className="input-luxury resize-none" placeholder="Early check-in, extra pillows, etc." />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onBack} className="btn-outline flex-1">← Back</button>
            <button onClick={handleSubmit} disabled={loading} className="btn-gold flex-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-charcoal-900/30 border-t-charcoal-900 rounded-full animate-spin" />
                  Creating Booking...
                </span>
              ) : 'Continue to Payment →'}
            </button>
          </div>
        </div>
      </div>

      {pricing && (
        <div className="bg-white border border-parchment rounded-sm shadow-luxury p-6 h-fit sticky top-24">
          <h4 className="font-display text-lg text-charcoal-800 mb-4">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-charcoal-600">
              <span>Room</span><span className="font-medium text-right text-charcoal-800 text-xs">{room?.name}</span>
            </div>
            <div className="flex justify-between text-charcoal-600">
              <span>Nights</span><span>{availabilityData?.nights}</span>
            </div>
            <div className="flex justify-between text-charcoal-600">
              <span>Room charge</span><span>₹{pricing.totalRoomCharge?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-charcoal-600">
              <span>GST (12%)</span><span>₹{pricing.taxes?.toLocaleString('en-IN')}</span>
            </div>
            {pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span><span>-₹{pricing.discount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="border-t border-parchment pt-2 flex justify-between font-bold text-charcoal-800">
              <span>Total</span><span className="text-gold-600">₹{pricing.grandTotal?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step 3: Payment (Razorpay + Demo fallback) ────────────────────
export function BookingStepPayment({ booking, onSuccess, onBack }) {
  const [loading, setLoading] = useState(false);

  // Demo mode: no real Razorpay order
  const isDemoMode = !booking?.razorpayOrderId || booking.razorpayOrderId.startsWith('demo_') || booking.isDemoMode;

  const handleDemoPayment = async function () {
    setLoading(true);
    try {
      var res = await bookingApi.confirm({
        bookingId: booking.bookingId,
        razorpayOrderId: booking.razorpayOrderId || 'demo_order_' + Date.now(),
        razorpayPaymentId: 'demo_pay_' + Date.now(),
        razorpaySignature: 'demo_sig',
      });
      toast.success('Booking confirmed! 🎉');
      onSuccess(res.data.booking.bookingId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpay = function () {
    if (typeof window.Razorpay === 'undefined') {
      toast.error('Payment gateway not loaded. Switching to demo mode.');
      return handleDemoPayment();
    }

    var options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
      amount: Math.round(booking.amount * 100),
      currency: 'INR',
      name: 'Silver Key Hotel',
      description: 'Booking ' + booking.bookingId,
      order_id: booking.razorpayOrderId,
      prefill: {
        name: booking.guestName || '',
        email: booking.guestEmail || '',
        contact: booking.guestPhone || '',
      },
      theme: { color: '#d4af37' },
      modal: { ondismiss: function () { toast('Payment cancelled', { icon: 'ℹ️' }); } },
      handler: async function (response) {
        setLoading(true);
        try {
          var res = await bookingApi.confirm({
            bookingId: booking.bookingId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          toast.success('Payment successful! 🎉');
          onSuccess(res.data.booking.bookingId);
        } catch (err) {
          toast.error('Payment received but confirmation failed. Call +91 93228 00100');
        } finally {
          setLoading(false);
        }
      },
    };

    var rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      toast.error('Payment failed: ' + (response.error?.description || 'Unknown error'));
    });
    rzp.open();
  };

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-parchment rounded-sm shadow-luxury p-8 text-center">
        <p className="text-charcoal-500">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-parchment rounded-sm shadow-luxury p-8">
        <h3 className="font-display text-xl text-charcoal-800 mb-2">Complete Payment</h3>
        <p className="text-charcoal-500 text-sm mb-6">
          Booking ID: <strong className="text-gold-600 font-mono">{booking.bookingId}</strong>
        </p>

        <div className="bg-cream border border-parchment rounded-sm p-5 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-charcoal-600 font-medium">Amount to Pay</span>
            <span className="font-display text-2xl font-bold text-charcoal-800">
              ₹{booking.amount?.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-charcoal-400 mt-1">Inclusive of all taxes</p>
        </div>

        {isDemoMode ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 text-sm text-amber-800">
              <strong>Demo Mode:</strong> No real payment will be charged. Click below to confirm your booking instantly.
              <br /><span className="text-xs mt-1 block text-amber-600">Add RAZORPAY_KEY_ID to .env to enable real payments.</span>
            </div>
            <button onClick={handleDemoPayment} disabled={loading} className="btn-gold w-full text-base py-4">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-charcoal-900/30 border-t-charcoal-900 rounded-full animate-spin" />
                  Confirming...
                </span>
              ) : '✓ Confirm Booking (Demo)'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={handleRazorpay} disabled={loading} className="btn-gold w-full text-base py-4 flex items-center justify-center gap-2">
              <CreditCard size={18} />
              {loading ? 'Processing...' : `Pay ₹${booking.amount?.toLocaleString('en-IN')} with Razorpay`}
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-charcoal-400">
              <Lock size={11} />
              Secured by Razorpay · UPI · Cards · NetBanking · Wallets
            </div>
          </div>
        )}

        <button onClick={onBack} className="btn-outline w-full mt-3 text-sm">← Back</button>
      </div>
    </div>
  );
}

export default BookingStepSearch;
