import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import {
  Hotel, CalendarCheck, Users, TrendingUp, ArrowUpRight,
  DoorOpen, ClipboardList, Star, AlertCircle,
} from 'lucide-react';
import { adminApi } from '@/services/api';

function StatCard({ title, value, icon: Icon, change, color, to }) {
  const card = (
    <div className={`bg-white rounded-sm border border-parchment p-5 hover:shadow-lg transition-all duration-200 ${to ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-bold flex items-center gap-0.5 ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            <ArrowUpRight size={12} className={change < 0 ? 'rotate-90' : ''} />
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="font-display text-2xl text-charcoal-800 font-bold">{value}</div>
      <div className="text-charcoal-400 text-xs mt-1 uppercase tracking-wider">{title}</div>
    </div>
  );
  return to ? <Link to={to}>{card}</Link> : card;
}

const formatCurrency = (val) =>
  val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : `₹${val?.toLocaleString('en-IN')}`;

export default function AdminDashboard() {
  useEffect(() => { document.title = 'Admin Dashboard — Silver Key Hotel'; }, []);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.getDashboard().then((r) => r.data.stats),
    refetchInterval: 30000,
  });

  const { data: revenueData } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => adminApi.getRevenueChart().then((r) => r.data.chartData),
  });

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin Navbar */}
      <header className="bg-charcoal-900 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div>
          <div className="font-display text-gold-500 text-lg font-bold">Silver Key Admin</div>
          <div className="text-charcoal-400 text-xs">Management Dashboard</div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-charcoal-400 text-xs hover:text-gold-400 transition-colors">← View Website</Link>
        </div>
      </header>

      {/* Admin Sidebar */}
      <div className="flex">
        <aside className="w-56 bg-charcoal-900 min-h-[calc(100vh-64px)] p-4 hidden md:block">
          <nav className="space-y-1">
            {[
              { icon: TrendingUp, label: 'Dashboard', path: '/admin' },
              { icon: Hotel, label: 'Rooms', path: '/admin/rooms' },
              { icon: CalendarCheck, label: 'Bookings', path: '/admin/bookings' },
              { icon: Users, label: 'Guests', path: '/admin/guests' },
              { icon: Star, label: 'Reviews', path: '/admin/reviews' },
              { icon: ClipboardList, label: 'Reports', path: '/admin/reports' },
            ].map(({ icon: Icon, label, path }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-charcoal-300 hover:text-gold-400 hover:bg-charcoal-800 transition-all text-sm font-body"
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-display text-2xl text-charcoal-800 mb-1">Dashboard Overview</h1>
            <p className="text-charcoal-400 text-sm mb-8">Welcome back · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>

            {/* Today alerts */}
            {(stats?.today?.checkIns > 0 || stats?.today?.checkOuts > 0) && (
              <div className="bg-gold-500/10 border border-gold-500/30 rounded-sm p-4 mb-6 flex items-center gap-3">
                <AlertCircle size={18} className="text-gold-600 flex-shrink-0" />
                <p className="text-charcoal-700 text-sm">
                  Today: <strong>{stats.today.checkIns} check-ins</strong> and <strong>{stats.today.checkOuts} check-outs</strong> scheduled.
                </p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard title="Monthly Revenue" value={formatCurrency(stats?.revenue?.monthly)} icon={TrendingUp} color="bg-emerald-500" />
              <StatCard title="Total Bookings" value={stats?.bookings?.total?.toLocaleString('en-IN')} icon={CalendarCheck} color="bg-blue-500" to="/admin/bookings" />
              <StatCard title="Pending Approval" value={stats?.bookings?.pending} icon={ClipboardList} color="bg-amber-500" to="/admin/bookings" />
              <StatCard title="Occupancy Rate" value={`${stats?.rooms?.occupancyRate}%`} icon={DoorOpen} color="bg-gold-600" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard title="Total Rooms" value={stats?.rooms?.total} icon={Hotel} color="bg-purple-500" to="/admin/rooms" />
              <StatCard title="Occupied Now" value={stats?.rooms?.occupied} icon={DoorOpen} color="bg-red-500" />
              <StatCard title="Total Guests" value={stats?.guests?.total?.toLocaleString('en-IN')} icon={Users} color="bg-teal-500" />
              <StatCard title="Avg Rating" value={`${stats?.avgRating} ★`} icon={Star} color="bg-gold-500" />
            </div>

            {/* Revenue Chart */}
            {revenueData && (
              <div className="bg-white rounded-sm border border-parchment p-6 mb-8">
                <h2 className="font-display text-xl text-charcoal-800 mb-1">Revenue Overview</h2>
                <p className="text-charcoal-400 text-xs mb-6">{new Date().getFullYear()} monthly breakdown</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#808070' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#808070' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Revenue']}
                      contentStyle={{ fontFamily: 'Lato', fontSize: 12, border: '1px solid #f0ebe0', borderRadius: 4 }}
                    />
                    <Bar dataKey="revenue" fill="#d4af37" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Bookings */}
            <div className="bg-white rounded-sm border border-parchment p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl text-charcoal-800">Recent Bookings</h2>
                <Link to="/admin/bookings" className="text-gold-600 text-xs font-bold uppercase tracking-wider hover:text-gold-700">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-parchment">
                      {['Booking ID', 'Guest', 'Room', 'Check-in', 'Total', 'Status'].map((h) => (
                        <th key={h} className="text-left py-2 px-3 text-xs font-bold uppercase tracking-wider text-charcoal-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.recentBookings || []).map((b) => (
                      <tr key={b._id} className="border-b border-parchment/50 hover:bg-cream/50 transition-colors">
                        <td className="py-3 px-3 text-gold-600 font-bold text-xs">{b.bookingId}</td>
                        <td className="py-3 px-3 text-charcoal-700">{b.guest?.firstName} {b.guest?.lastName}</td>
                        <td className="py-3 px-3 text-charcoal-500 text-xs">{b.room?.name}</td>
                        <td className="py-3 px-3 text-charcoal-500 text-xs">{new Date(b.checkIn).toLocaleDateString('en-IN')}</td>
                        <td className="py-3 px-3 font-bold text-charcoal-800">₹{b.pricing?.grandTotal?.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700'
                            : b.status === 'pending' ? 'bg-amber-100 text-amber-700'
                            : b.status === 'cancelled' ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
