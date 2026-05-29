// ── QuickBookingBar.jsx ────────────────────────────────────────────
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Users, Search } from 'lucide-react';
import { useBookingStore } from '@/store/authStore';

export function QuickBookingBar() {
  const navigate = useNavigate();
  const { setDates, setGuests } = useBookingStore();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;
    setDates(checkIn, checkOut);
    setGuests(adults, 0);
    navigate('/rooms');
  };

  return (
    <section className="relative z-20 -mt-8 max-w-5xl mx-auto px-4">
      <form onSubmit={handleSearch} className="bg-white shadow-luxury rounded-sm border border-parchment p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-body font-bold uppercase tracking-widest text-charcoal-500 mb-2 block">Check-in</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none" />
            <DatePicker
              selected={checkIn}
              onChange={setCheckIn}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={new Date()}
              placeholderText="Select date"
              className="input-luxury pl-9"
              dateFormat="dd MMM yyyy"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-body font-bold uppercase tracking-widest text-charcoal-500 mb-2 block">Check-out</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none" />
            <DatePicker
              selected={checkOut}
              onChange={setCheckOut}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={checkIn || new Date()}
              placeholderText="Select date"
              className="input-luxury pl-9"
              dateFormat="dd MMM yyyy"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-body font-bold uppercase tracking-widest text-charcoal-500 mb-2 block">Guests</label>
          <div className="relative">
            <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none" />
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="input-luxury pl-9 appearance-none"
            >
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <button type="submit" className="btn-gold w-full gap-2">
            <Search size={16} /> Check Availability
          </button>
        </div>
      </form>
    </section>
  );
}

export default QuickBookingBar;
