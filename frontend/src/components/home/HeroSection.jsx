import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronDown, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const videoRef = useRef(null);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] } }),
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
          alt="Silver Key Hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white pt-20">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 backdrop-blur-sm px-4 py-1.5 rounded-full mb-8">
            <MapPin size={12} className="text-gold-400" />
            <span className="text-gold-300 text-xs font-body tracking-widest uppercase">Electronic City, Bengaluru</span>
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-none mb-4"
        >
          Silver Key
          <br />
          <span className="text-gold-400 italic font-normal">Hotel</span>
        </motion.h1>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.35}>
          <div className="w-24 h-0.5 bg-gold-shimmer mx-auto my-6" />
          <p className="font-body text-white/80 text-lg md:text-xl tracking-wider max-w-2xl mx-auto leading-relaxed mb-2">
            Direct Booking · Smarter Stays · Better Experiences
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.5}>
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1,2,3,4].map(i => <Star key={i} size={16} className="fill-gold-500 text-gold-500" />)}
            <Star size={16} className="fill-gold-500/30 text-gold-500" />
            <span className="text-white/60 text-sm ml-1">4.1 · 260+ Verified Reviews</span>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.65} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/booking" className="btn-gold text-sm px-8 py-4 shadow-gold-glow">
            Reserve Your Room
          </Link>
          <Link to="/rooms" className="btn-outline text-sm px-8 py-4">
            Explore Rooms
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          className="mt-16"
        >
          <ChevronDown size={24} className="text-gold-500/60 mx-auto" />
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent z-10" />
    </section>
  );
}
