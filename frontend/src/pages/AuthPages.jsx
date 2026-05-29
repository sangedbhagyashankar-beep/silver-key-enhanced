// ── LoginPage.jsx ──────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
    document.title = 'Sign In — Silver Key Hotel';
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      login(data.user, data.accessToken);
      toast.success(`Welcome back, ${data.user.firstName}!`);
      navigate(data.user.role === 'admin' || data.user.role === 'superadmin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Image */}
      <div className="hidden lg:block flex-1 relative">
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80" alt="Hotel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-charcoal-900/60 flex flex-col items-center justify-center text-white p-12">
          <div className="font-display text-gold-400 text-5xl font-bold tracking-widest uppercase mb-2">Silver Key</div>
          <div className="text-white/60 text-xs tracking-[0.3em] uppercase">Hotel & Hospitality</div>
          <div className="w-12 h-0.5 bg-gold-500 my-6" />
          <p className="text-white/70 text-center text-sm leading-relaxed max-w-sm">
            Sign in to manage your bookings, earn loyalty points, and enjoy exclusive member benefits.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center bg-cream px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="block text-center mb-8">
            <div className="font-display text-charcoal-800 text-2xl font-bold">Silver Key</div>
            <div className="text-charcoal-400 text-xs tracking-widest uppercase">Hotel</div>
          </Link>

          <h1 className="font-display text-3xl text-charcoal-800 text-center mb-1">Welcome Back</h1>
          <p className="text-charcoal-400 text-sm text-center mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-luxury"
                placeholder="rahul@email.com"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500">Password</label>
                <Link to="/forgot-password" className="text-xs text-gold-600 hover:text-gold-700">Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-luxury pr-10"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 mt-6">
              {loading ? <span className="w-4 h-4 border-2 border-charcoal-900/30 border-t-charcoal-900 rounded-full animate-spin" /> : <LogIn size={16} />}
              Sign In
            </button>
          </form>

          <p className="text-center text-charcoal-500 text-sm mt-6">
            New guest?{' '}
            <Link to="/register" className="text-gold-600 hover:text-gold-700 font-bold">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── RegisterPage.jsx ───────────────────────────────────────────────
export function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => { document.title = 'Register — Silver Key Hotel'; }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }

    setLoading(true);
    try {
      const { data } = await authApi.register(form);
      login(data.user, data.accessToken);
      toast.success(`Welcome to Silver Key, ${data.user.firstName}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="input-luxury"
        placeholder={placeholder}
        required
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8">
          <div className="font-display text-charcoal-800 text-2xl font-bold">Silver Key Hotel</div>
        </Link>
        <div className="bg-white rounded-sm shadow-luxury border border-parchment p-8">
          <h1 className="font-display text-3xl text-charcoal-800 text-center mb-1">Create Account</h1>
          <p className="text-charcoal-400 text-sm text-center mb-8">Join Silver Key for exclusive benefits</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {field('firstName', 'First Name', 'text', 'Rahul')}
              {field('lastName', 'Last Name', 'text', 'Sharma')}
            </div>
            {field('email', 'Email', 'email', 'rahul@email.com')}
            {field('phone', 'Phone (India)', 'tel', '9876543210')}
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-luxury pr-10"
                  placeholder="Min 8 characters"
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {field('confirmPassword', 'Confirm Password', 'password', 'Re-enter password')}

            <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 mt-2">
              {loading && <span className="w-4 h-4 border-2 border-charcoal-900/30 border-t-charcoal-900 rounded-full animate-spin" />}
              Create Account
            </button>
          </form>

          <p className="text-center text-charcoal-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-600 hover:text-gold-700 font-bold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
