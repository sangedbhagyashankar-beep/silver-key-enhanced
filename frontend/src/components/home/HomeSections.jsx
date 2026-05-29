// Consolidated imports for GalleryPreview, LocationSection, CTASection
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Navigation, Phone } from 'lucide-react';

// ── GalleryPreview ─────────────────────────────────────────────────
const PREVIEW_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=75', label: 'Deluxe Room', span: 'col-span-2 row-span-2' },
  { src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=75', label: 'Bathroom' },
  { src: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=75', label: 'Reception' },
  { src: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=75', label: 'Dining Area' },
  { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=75', label: 'Exterior' },
];

export function GalleryPreview() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-500 font-body text-xs uppercase tracking-[0.3em] mb-2">Visual Tour</p>
            <h2 className="section-heading">Hotel Gallery</h2>
            <div className="w-12 h-0.5 bg-gold-500 mt-3" />
          </div>
          <Link to="/gallery" className="hidden md:flex items-center gap-2 text-xs font-body font-bold uppercase tracking-widest text-gold-600 hover:text-gold-700 transition-colors">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[420px]">
          {PREVIEW_IMAGES.map(({ src, label, span }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`relative overflow-hidden rounded-sm group cursor-pointer ${span || ''}`}
            >
              <img src={src} alt={label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/40 transition-all duration-300 flex items-end p-3">
                <span className="text-white text-xs font-body font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  {label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link to="/gallery" className="btn-outline inline-flex items-center gap-2 text-xs">
            View Full Gallery <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── LocationSection ────────────────────────────────────────────────
export function LocationSection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-gold-500 font-body text-xs uppercase tracking-[0.3em] mb-3">Find Us</p>
          <h2 className="section-heading mb-4">Conveniently Located</h2>
          <div className="w-12 h-0.5 bg-gold-500 mb-6" />
          <p className="text-charcoal-500 text-sm leading-relaxed mb-8">
            Situated in the heart of Electronic City, we're the perfect base for business travelers visiting Infosys, Wipro, Biocon, and other tech parks.
          </p>

          <div className="space-y-4">
            {[
              { icon: MapPin, label: 'Address', value: 'No.360/257/52-B, Habbagalli, Electronic City Post, Hebbagodi, Karnataka 560135' },
              { icon: Phone, label: 'Phone', value: '+91 93228 00100' },
              { icon: Navigation, label: 'Distance', value: '5 min from Electronic City Phase 1 & 2' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 rounded-sm bg-gold-500/10 flex-shrink-0 flex items-center justify-center">
                  <Icon size={18} className="text-gold-600" />
                </div>
                <div>
                  <div className="text-xs font-body font-bold uppercase tracking-widest text-charcoal-400 mb-0.5">{label}</div>
                  <div className="text-charcoal-700 text-sm">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://maps.google.com/?q=Silver+Key+Hotel+Electronic+City+Bengaluru"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2 mt-8 text-xs"
          >
            <Navigation size={15} /> Get Directions
          </a>
        </div>

        <div className="rounded-sm overflow-hidden shadow-luxury h-80">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0!2d77.66!3d12.84!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDUwJzI0LjAiTiA3N8KwMzknMzYuMCJF!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Silver Key Hotel Location"
          />
        </div>
      </div>
    </section>
  );
}

// ── CTASection ─────────────────────────────────────────────────────
export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=80"
          alt="CTA background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/75" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-white">
        <p className="text-gold-400 font-body text-xs uppercase tracking-[0.3em] mb-4">Ready to Stay?</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Book Your Perfect Room Today
        </h2>
        <div className="w-16 h-0.5 bg-gold-500 mx-auto mb-6" />
        <p className="text-white/70 text-base mb-10 leading-relaxed">
          Experience premium comfort at the best available rate. Direct booking ensures the lowest price and personal service.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/booking" className="btn-gold px-10 py-4 text-sm shadow-gold-glow">
            Reserve Now
          </Link>
          <a href="tel:+919322800100" className="btn-outline px-10 py-4 text-sm flex items-center gap-2">
            <Phone size={15} /> Call Us
          </a>
        </div>
      </div>
    </section>
  );
}

export default GalleryPreview;
