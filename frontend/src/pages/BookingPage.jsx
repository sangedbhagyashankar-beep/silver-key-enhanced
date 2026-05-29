import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CreditCard, User, Calendar, ChevronRight } from 'lucide-react';
import { bookingApi, roomApi } from '@/services/api';
import { useBookingStore, useAuthStore } from '@/store/authStore';
import { BookingStepSearch, BookingStepGuest, BookingStepPayment } from '@/components/booking/BookingSteps';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, label: 'Select Dates', icon: Calendar },
  { id: 2, label: 'Guest Details', icon: User },
  { id: 3, label: 'Payment', icon: CreditCard },
];

export default function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { bookingStep, setStep, selectedRoom, checkIn, checkOut, adults } = useBookingStore();
  const { user } = useAuthStore();

  const [availabilityData, setAvailabilityData] = useState(null);
  const [guestDetails, setGuestDetails] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialRequests: '',
  });
  const [pendingBooking, setPendingBooking] = useState(null);

  // Support ?roomId= and ?room= query params
  const roomId = searchParams.get('roomId') || searchParams.get('room') || selectedRoom?._id;

  useEffect(function () { document.title = 'Book Your Stay — Silver Key Hotel'; }, []);

  // Auto-populate guest details when user logs in
  useEffect(function () {
    if (user) {
      setGuestDetails(function (prev) {
        return {
          firstName: prev.firstName || user.firstName || '',
          lastName: prev.lastName || user.lastName || '',
          email: prev.email || user.email || '',
          phone: prev.phone || user.phone || '',
          specialRequests: prev.specialRequests || '',
        };
      });
    }
  }, [user]);

  const { data: room } = useQuery({
    queryKey: ['room-detail', roomId],
    queryFn: function () { return roomApi.getOne(roomId).then(function (r) { return r.data.room; }); },
    enabled: !!roomId,
  });

  const handleAvailabilityConfirm = function (data) {
    setAvailabilityData(data);
    setStep(2);
  };

  const handleGuestSubmit = async function (formData) {
    setGuestDetails(formData);
    try {
      var res = await bookingApi.create({
        roomId: room._id,
        checkIn: checkIn,
        checkOut: checkOut,
        adults: adults,
        children: 0,
        guest: formData,
      });
      // FIX: Store full booking info including guestName for Razorpay prefill
      setPendingBooking({
        ...res.data.booking,
        guestName: formData.firstName + ' ' + formData.lastName,
        guestEmail: formData.email,
        guestPhone: formData.phone,
      });
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create booking. Please try again.');
    }
  };

  const handlePaymentSuccess = function (confirmedBookingId) {
    setStep(1);
    navigate('/booking/confirmation/' + confirmedBookingId);
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <p className="text-gold-500 text-xs uppercase tracking-[0.3em] font-body mb-2">Reservation</p>
          <h1 className="font-display text-4xl text-charcoal-800 font-bold">Book Your Stay</h1>
          <div className="gold-divider" />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map(function (step, i) {
            var Icon = step.icon;
            return (
              <div key={step.id} className="flex items-center">
                <div className={'flex items-center gap-2 px-4 py-2 rounded-full text-xs font-body font-bold uppercase tracking-wider transition-all ' + (
                  bookingStep === step.id ? 'bg-gold-500 text-charcoal-900' :
                    bookingStep > step.id ? 'bg-charcoal-800 text-gold-400' :
                      'bg-white border border-charcoal-200 text-charcoal-400'
                )}>
                  {bookingStep > step.id ? <CheckCircle2 size={14} /> : <Icon size={14} />}
                  <span className="hidden md:block">{step.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={16} className={'mx-1 ' + (bookingStep > step.id ? 'text-gold-500' : 'text-charcoal-300')} />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={bookingStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {bookingStep === 1 && (
              <BookingStepSearch room={room} onConfirm={handleAvailabilityConfirm} />
            )}
            {bookingStep === 2 && (
              <BookingStepGuest
                room={room}
                availabilityData={availabilityData}
                defaultValues={guestDetails}
                onSubmit={handleGuestSubmit}
                onBack={function () { setStep(1); }}
              />
            )}
            {bookingStep === 3 && pendingBooking && (
              <BookingStepPayment
                booking={pendingBooking}
                onSuccess={handlePaymentSuccess}
                onBack={function () { setStep(2); }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
