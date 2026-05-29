import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Wifi, Car, Coffee, Clock } from 'lucide-react';

const FEATURES = [
  { icon: CreditCard, title: 'Direct Booking', desc: 'Best rate guaranteed when you book directly with us. No hidden fees.' },
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'Razorpay-powered payments with 100% transaction security.' },
  { icon: Wifi, title: 'Free High-Speed WiFi', desc: 'Complimentary broadband & WiFi in all rooms and common areas.' },
  { icon: Car, title: 'Free Parking', desc: 'Ample free parking available for all in-house guests.' },
  { icon: Coffee, title: 'Room Service', desc: '24/7 in-room dining and housekeeping on request.' },
  { icon: Clock, title: 'Flexible Check-in', desc: 'Early check-in and late check-out subject to availability.' },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-gold-500 font-body text-xs uppercase tracking-[0.3em] mb-3">Why Choose Us</p>
          <h2 className="section-heading">Hotel Amenities & Services</h2>
          <div className="gold-divider" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-5 p-6 rounded-sm border border-parchment hover:border-gold-300 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-sm bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                <Icon size={22} className="text-gold-600" />
              </div>
              <div>
                <h3 className="font-display text-charcoal-800 text-lg mb-1">{title}</h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
