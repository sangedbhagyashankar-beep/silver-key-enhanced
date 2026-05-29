import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown, Phone } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/services/api';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Rooms', path: '/rooms' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-charcoal-900/98 backdrop-blur-md shadow-2xl py-3'
          : 'bg-transparent py-5'
      }`}
    >
      {/* Top bar */}
      {!scrolled && (
        <div className="hidden lg:flex items-center justify-end px-8 -mt-1 mb-2">
          <a href="tel:+919322800100" className="flex items-center gap-1.5 text-gold-500 text-xs font-body tracking-wider hover:text-gold-400 transition-colors">
            <Phone size={12} />
            +91 93228 00100
          </a>
        </div>
      )}

      <nav className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-gold-500 text-xl font-bold tracking-[0.2em] uppercase">Silver Key</span>
          <span className="text-white/60 text-[9px] font-body tracking-[0.3em] uppercase mt-0.5">Hotel & Hospitality</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ label, path }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `text-xs font-body font-bold uppercase tracking-widest transition-all duration-200 ${
                    isActive ? 'text-gold-500' : 'text-white/80 hover:text-gold-400'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA / Auth */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-white/80 hover:text-gold-400 transition-colors text-sm font-body"
              >
                <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
                  <User size={16} className="text-gold-400" />
                </div>
                <span>{user?.firstName}</span>
                <ChevronDown size={14} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-charcoal-900 border border-charcoal-700 rounded-sm shadow-2xl py-2">
                  <Link to="/my-bookings" className="block px-4 py-2 text-sm text-white/80 hover:text-gold-400 hover:bg-charcoal-800 transition-colors">
                    My Bookings
                  </Link>
                  {isAdmin() && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gold-500 hover:bg-charcoal-800 transition-colors">
                      Admin Panel
                    </Link>
                  )}
                  <hr className="border-charcoal-700 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-charcoal-800 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-xs text-white/70 hover:text-gold-400 uppercase tracking-widest font-bold transition-colors">
              Sign In
            </Link>
          )}
          <Link to="/booking" className="btn-gold text-xs px-5 py-2.5">
            Book Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-charcoal-900/98 backdrop-blur-md border-t border-charcoal-700 px-4 py-6 flex flex-col gap-4">
          {NAV_LINKS.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `text-sm font-body font-bold uppercase tracking-widest py-2 transition-colors ${
                  isActive ? 'text-gold-500' : 'text-white/80'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <hr className="border-charcoal-700" />
          <Link to="/booking" onClick={() => setIsOpen(false)} className="btn-gold text-center text-xs">
            Reserve Now
          </Link>
          {!isAuthenticated && (
            <Link to="/login" onClick={() => setIsOpen(false)} className="btn-outline text-center text-xs">
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
