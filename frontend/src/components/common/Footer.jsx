import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Star } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="mb-6">
            <div className="font-display text-gold-500 text-2xl font-bold tracking-widest uppercase">Silver Key</div>
            <div className="text-charcoal-400 text-[10px] tracking-[0.3em] uppercase mt-1">Hotel & Hospitality</div>
          </div>
          <p className="text-charcoal-300 text-sm leading-relaxed mb-6">
            A premium hotel experience in the heart of Electronic City, Bengaluru. Direct bookings. Smarter stays. Better experiences.
          </p>
          <div className="flex items-center gap-1.5 mb-4">
            {[1,2,3,4].map(i => <Star key={i} size={14} className="fill-gold-500 text-gold-500" />)}
            <Star size={14} className="fill-gold-500/30 text-gold-500" />
            <span className="text-charcoal-400 text-xs ml-1">4.1 / 5 · 260+ Reviews</span>
          </div>
          <div className="flex items-center gap-3 mt-4">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full border border-charcoal-600 flex items-center justify-center text-charcoal-400 hover:border-gold-500 hover:text-gold-500 transition-all duration-200">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display text-gold-500 text-sm font-semibold uppercase tracking-widest mb-6">Quick Links</h4>
          <ul className="space-y-3">
            {[['Home', '/'], ['Our Rooms', '/rooms'], ['Gallery', '/gallery'], ['About Us', '/about'], ['Contact', '/contact'], ['Book Now', '/booking']].map(([label, path]) => (
              <li key={path}>
                <Link to={path} className="text-charcoal-300 text-sm hover:text-gold-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Room Types */}
        <div>
          <h4 className="font-display text-gold-500 text-sm font-semibold uppercase tracking-widest mb-6">Our Rooms</h4>
          <ul className="space-y-3">
            {['Single Room (AC)', 'Single Room (Non-AC)', 'Double Room (AC)', 'Double Room (Non-AC)', 'Deluxe Suite', 'Family Room'].map((type) => (
              <li key={type}>
                <Link to="/rooms" className="text-charcoal-300 text-sm hover:text-gold-400 transition-colors">
                  {type}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-gold-500 text-sm font-semibold uppercase tracking-widest mb-6">Contact Us</h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <MapPin size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
              <p className="text-charcoal-300 text-sm leading-relaxed">
                No.360/257/52-B, Habbagalli Opp to Husnur Gate,<br />
                Electronic City Post, Hebbagodi,<br />
                Karnataka 560135
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gold-500 flex-shrink-0" />
              <a href="tel:+919322800100" className="text-charcoal-300 text-sm hover:text-gold-400 transition-colors">
                +91 93228 00100
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gold-500 flex-shrink-0" />
              <a href="mailto:stay@silverkey.in" className="text-charcoal-300 text-sm hover:text-gold-400 transition-colors">
                stay@silverkey.in
              </a>
            </div>
          </div>

          {/* Check-in info */}
          <div className="mt-6 p-4 border border-charcoal-700 rounded-sm">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-charcoal-400">Check-in</span>
              <span className="text-gold-400 font-bold">2:00 PM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-charcoal-400">Check-out</span>
              <span className="text-gold-400 font-bold">12:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-charcoal-800 py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-charcoal-500 text-xs">
            © {new Date().getFullYear()} Silver Key Hotel. All rights reserved. Built by <span className="text-gold-600">Deplori X Technologies</span>.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} to="#" className="text-charcoal-500 text-xs hover:text-gold-500 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
