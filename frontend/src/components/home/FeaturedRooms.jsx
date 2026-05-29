import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Maximize2, Wind, ArrowRight } from 'lucide-react';
import { roomApi } from '@/services/api';

function RoomCard({ room, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="card-luxury group"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={room.primaryImage || `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=75`}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-gold-500 text-charcoal-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
            {room.acType?.toUpperCase()} · {room.type}
          </span>
        </div>

        {/* Rating */}
        {room.ratings?.count > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-charcoal-900/80 backdrop-blur-sm px-2 py-1 rounded-sm">
            <Star size={11} className="fill-gold-500 text-gold-500" />
            <span className="text-white text-xs font-bold">{room.ratings.average}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display text-charcoal-800 text-xl font-semibold">{room.name}</h3>
        </div>

        <p className="text-charcoal-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {room.shortDescription || room.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-5 text-charcoal-400 text-xs">
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-gold-500" />
            Up to {room.capacity?.adults} Adults
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize2 size={13} className="text-gold-500" />
            {room.size} sq.ft
          </span>
          <span className="flex items-center gap-1.5">
            <Wind size={13} className="text-gold-500" />
            {room.bedType?.replace('-', ' ')}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-parchment">
          <div>
            <span className="text-charcoal-400 text-xs">Starting from</span>
            <div className="font-display text-charcoal-800 text-2xl font-semibold">
              ₹{room.price?.base?.toLocaleString('en-IN')}
              <span className="text-charcoal-400 text-xs font-body">/night</span>
            </div>
          </div>
          <Link
            to={`/rooms/${room.slug || room._id}`}
            className="flex items-center gap-2 text-xs font-body font-bold uppercase tracking-widest text-gold-600 hover:text-gold-700 transition-colors group/link"
          >
            View Room
            <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Skeleton loader
function RoomSkeleton() {
  return (
    <div className="bg-white rounded-sm shadow-lg overflow-hidden animate-pulse">
      <div className="h-52 bg-charcoal-100" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-charcoal-100 rounded w-2/3" />
        <div className="h-4 bg-charcoal-100 rounded w-full" />
        <div className="h-4 bg-charcoal-100 rounded w-4/5" />
        <div className="h-8 bg-charcoal-100 rounded w-1/3 mt-4" />
      </div>
    </div>
  );
}

export default function FeaturedRooms() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-rooms'],
    queryFn: () => roomApi.getFeatured().then((r) => r.data.rooms),
  });

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-gold-500 font-body text-xs uppercase tracking-[0.3em] mb-3">Accommodations</p>
          <h2 className="section-heading">Our Featured Rooms</h2>
          <div className="gold-divider" />
          <p className="text-charcoal-500 text-sm max-w-xl mx-auto mt-4">
            Each room is thoughtfully designed for comfort and elegance, whether you're here for business or leisure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array(3).fill(0).map((_, i) => <RoomSkeleton key={i} />)
            : (data || []).map((room, i) => <RoomCard key={room._id} room={room} delay={i * 0.1} />)}
        </div>

        <div className="text-center mt-12">
          <Link to="/rooms" className="btn-outline inline-flex items-center gap-2">
            View All Rooms <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
