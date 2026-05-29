import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { reviewApi } from '@/services/api';

const FALLBACK_REVIEWS = [
  { guestName: 'Rahul Sharma', guestLocation: 'Bengaluru', ratings: { overall: 5 }, comment: 'Excellent stay! The room was clean, comfortable and the staff was very helpful. The location is perfect for business travelers visiting Electronic City.', createdAt: '2025-10-15' },
  { guestName: 'Priya Nair', guestLocation: 'Chennai', ratings: { overall: 4 }, comment: 'Great value for money. The AC room was well-maintained, WiFi was fast, and the check-in process was smooth. Will definitely stay again.', createdAt: '2025-11-02' },
  { guestName: 'Amit Gupta', guestLocation: 'Mumbai', ratings: { overall: 5 }, comment: 'One of the best budget hotels near Electronic City. The staff went above and beyond to ensure a comfortable stay. Highly recommended!', createdAt: '2025-12-20' },
];

function ReviewCard({ review, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-white p-7 rounded-sm shadow-lg border border-parchment hover:border-gold-200 transition-all duration-300 relative"
    >
      <Quote size={32} className="text-gold-200 absolute top-5 right-5" />

      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
        {Array(5).fill(0).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < review.ratings.overall ? 'fill-gold-500 text-gold-500' : 'fill-charcoal-200 text-charcoal-200'}
          />
        ))}
      </div>

      <p className="text-charcoal-600 text-sm leading-relaxed mb-6 italic">
        "{review.comment}"
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-parchment">
        <div className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center">
          <span className="font-display text-gold-600 font-bold text-sm">
            {review.guestName.charAt(0)}
          </span>
        </div>
        <div>
          <div className="font-body font-bold text-charcoal-800 text-sm">{review.guestName}</div>
          <div className="text-charcoal-400 text-xs">{review.guestLocation}</div>
        </div>
        <div className="ml-auto text-charcoal-300 text-xs">
          {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const { data } = useQuery({
    queryKey: ['home-reviews'],
    queryFn: () => reviewApi.getAll({ limit: 3 }).then((r) => r.data.reviews),
  });

  const reviews = data?.length ? data : FALLBACK_REVIEWS;

  return (
    <section className="py-20 bg-charcoal-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-gold-500 font-body text-xs uppercase tracking-[0.3em] mb-3">Guest Voices</p>
          <h2 className="section-heading text-white">What Our Guests Say</h2>
          <div className="gold-divider" />
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1,2,3,4].map(i => <Star key={i} size={16} className="fill-gold-500 text-gold-500" />)}
            <Star size={16} className="fill-gold-500/30 text-gold-500" />
            <span className="text-charcoal-300 text-sm ml-2">4.1 out of 5 · 260+ reviews on Google</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {reviews.map((review, i) => (
            <ReviewCard key={i} review={review} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
