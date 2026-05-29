// ── RoomCard.jsx ───────────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Maximize2, Wind, ArrowRight } from 'lucide-react';

export function RoomCard({ room, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card-luxury group"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={room.primaryImage || `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=75`}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-charcoal-900/85 backdrop-blur-sm text-gold-400 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
            {room.acType?.toUpperCase()}
          </span>
          <span className="bg-gold-500 text-charcoal-900 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
            {room.type}
          </span>
        </div>
        {room.ratings?.count > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-charcoal-900/80 backdrop-blur-sm px-2 py-1 rounded-sm">
            <Star size={11} className="fill-gold-500 text-gold-500" />
            <span className="text-white text-xs font-bold">{room.ratings.average}</span>
            <span className="text-charcoal-400 text-[10px]">({room.ratings.count})</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-charcoal-800 text-lg font-semibold mb-1">{room.name}</h3>
        <p className="text-charcoal-500 text-xs leading-relaxed mb-3 line-clamp-2">
          {room.shortDescription || room.description}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-charcoal-400 text-xs">
          <span className="flex items-center gap-1.5"><Users size={12} className="text-gold-500" />{room.capacity?.adults} Adults</span>
          <span className="flex items-center gap-1.5"><Maximize2 size={12} className="text-gold-500" />{room.size} sq.ft</span>
          <span className="flex items-center gap-1.5"><Wind size={12} className="text-gold-500" />{room.bedType?.replace('-', ' ')}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-parchment">
          <div>
            <div className="font-display text-charcoal-800 text-xl font-semibold">
              ₹{room.price?.base?.toLocaleString('en-IN')}
              <span className="text-charcoal-400 text-xs font-body">/night</span>
            </div>
            <div className="text-charcoal-400 text-[10px]">+ taxes & GST</div>
          </div>
          <Link
            to={`/rooms/${room.slug || room._id}`}
            className="btn-gold text-xs px-4 py-2 flex items-center gap-1.5"
          >
            Book <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ── RoomFilters.jsx ────────────────────────────────────────────────
export function RoomFilters({ filters, onChange }) {
  return (
    <div className="space-y-6">
      {/* Room Type */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-3">Room Type</label>
        <div className="space-y-2">
          {[['', 'All Types'], ['single', 'Single'], ['double', 'Double'], ['suite', 'Suite'], ['deluxe', 'Deluxe'], ['family', 'Family']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="type"
                value={val}
                checked={filters.type === val}
                onChange={() => onChange('type', val)}
                className="accent-gold-500"
              />
              <span className={`text-sm transition-colors ${filters.type === val ? 'text-gold-600 font-medium' : 'text-charcoal-600 group-hover:text-charcoal-800'}`}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* AC Type */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-3">AC Type</label>
        <div className="flex gap-2">
          {[['', 'All'], ['ac', 'AC'], ['non-ac', 'Non-AC']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => onChange('acType', val)}
              className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wide rounded-sm border transition-all ${
                filters.acType === val
                  ? 'border-gold-500 bg-gold-500/10 text-gold-600'
                  : 'border-charcoal-200 text-charcoal-500 hover:border-gold-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-3">Price Range (per night)</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) => onChange('minPrice', e.target.value)}
            className="input-luxury text-xs py-2 w-full"
          />
          <span className="text-charcoal-400">–</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) => onChange('maxPrice', e.target.value)}
            className="input-luxury text-xs py-2 w-full"
          />
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-3">Min. Guests</label>
        <select
          value={filters.adults}
          onChange={(e) => onChange('adults', e.target.value)}
          className="input-luxury text-xs py-2 w-full"
        >
          <option value="">Any</option>
          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}+ Adults</option>)}
        </select>
      </div>
    </div>
  );
}

export default RoomCard;
