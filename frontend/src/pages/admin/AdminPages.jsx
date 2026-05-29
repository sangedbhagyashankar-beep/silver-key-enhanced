// Consolidated imports for all admin components
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Search, Download, Filter } from 'lucide-react';
import { roomApi, bookingApi } from '@/services/api';
import toast from 'react-hot-toast';

// ── AdminRooms ────────────────────────────────────────────────────
export function AdminRooms() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-rooms', page],
    queryFn: () => roomApi.getAll({ page, limit: 15 }).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => roomApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-rooms']);
      toast.success('Room deleted');
    },
    onError: () => toast.error('Failed to delete room'),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isAvailable }) => roomApi.update(id, { isAvailable: !isAvailable }),
    onSuccess: () => queryClient.invalidateQueries(['admin-rooms']),
  });

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-charcoal-800">Rooms Management</h1>
            <p className="text-charcoal-400 text-sm mt-1">{data?.total || 0} rooms total</p>
          </div>
          <button className="btn-gold flex items-center gap-2 text-sm">
            <Plus size={16} /> Add Room
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-sm shadow animate-pulse h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data?.rooms || []).map((room) => (
              <div key={room._id} className="bg-white rounded-sm border border-parchment shadow-sm overflow-hidden group">
                <div className="relative h-40">
                  <img
                    src={room.primaryImage || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=75'}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {room.isFeatured && <span className="bg-gold-500 text-charcoal-900 text-[10px] font-bold px-2 py-0.5 rounded-sm">Featured</span>}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${room.isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                      {room.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-charcoal-800 font-semibold">{room.name}</h3>
                  <div className="flex items-center gap-2 mt-1 mb-3">
                    <span className="text-charcoal-400 text-xs capitalize">{room.type} · {room.acType?.toUpperCase()}</span>
                    {room.ratings?.count > 0 && (
                      <span className="flex items-center gap-1 text-xs text-gold-600">
                        <Star size={11} className="fill-gold-500" />{room.ratings.average}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-charcoal-800 font-bold">₹{room.price?.base?.toLocaleString('en-IN')}<span className="text-charcoal-400 text-xs font-body">/night</span></span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => toggleMutation.mutate({ id: room._id, isAvailable: room.isAvailable })}
                        className="p-1.5 text-charcoal-400 hover:text-gold-600 hover:bg-gold-50 rounded transition-colors"
                        title={room.isAvailable ? 'Mark unavailable' : 'Mark available'}
                      >
                        {room.isAvailable ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button className="p-1.5 text-charcoal-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Edit size={15} />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Delete ${room.name}?`)) deleteMutation.mutate(room._id); }}
                        className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── AdminBookings ─────────────────────────────────────────────────
export function AdminBookings() {
  const [filters, setFilters] = useState({ status: '', page: 1, limit: 20, search: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', filters],
    queryFn: () => bookingApi.getAllBookings(filters).then((r) => r.data),
  });

  const STATUS_COLORS = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    checked_in: 'bg-blue-100 text-blue-700',
    checked_out: 'bg-charcoal-100 text-charcoal-600',
    no_show: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl text-charcoal-800">Bookings</h1>
            <p className="text-charcoal-400 text-sm mt-1">{data?.total || 0} total bookings</p>
          </div>
          <button className="btn-outline flex items-center gap-2 text-xs">
            <Download size={14} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-sm border border-parchment p-4 mb-6 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
              placeholder="Search by booking ID, email, phone..."
              className="input-luxury pl-9 text-xs py-2 w-full"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}
            className="input-luxury text-xs py-2 w-36"
          >
            <option value="">All Status</option>
            {['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'].map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-sm border border-parchment overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-charcoal-900 text-white">
                <tr>
                  {['Booking ID', 'Guest', 'Room', 'Check-in', 'Check-out', 'Nights', 'Total', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(8).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-parchment animate-pulse">
                      {Array(9).fill(0).map((_, j) => (
                        <td key={j} className="py-3 px-4"><div className="h-4 bg-charcoal-100 rounded w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : (data?.bookings || []).map((b) => (
                  <tr key={b._id} className="border-b border-parchment/50 hover:bg-cream/50 transition-colors">
                    <td className="py-3 px-4 text-gold-600 font-bold text-xs whitespace-nowrap">{b.bookingId}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-charcoal-800 text-xs">{b.guest?.firstName} {b.guest?.lastName}</div>
                      <div className="text-charcoal-400 text-[11px]">{b.guest?.email}</div>
                    </td>
                    <td className="py-3 px-4 text-charcoal-600 text-xs">{b.room?.name}</td>
                    <td className="py-3 px-4 text-charcoal-500 text-xs whitespace-nowrap">{new Date(b.checkIn).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 px-4 text-charcoal-500 text-xs whitespace-nowrap">{new Date(b.checkOut).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 px-4 text-center text-charcoal-700 text-xs">{b.nights}</td>
                    <td className="py-3 px-4 font-bold text-charcoal-800 whitespace-nowrap">₹{b.pricing?.grandTotal?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        {b.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-gold-600 text-xs hover:text-gold-700 font-bold">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-parchment">
              <span className="text-charcoal-400 text-xs">Page {filters.page} of {data.pages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                  disabled={filters.page === 1}
                  className="px-3 py-1 text-xs border border-parchment rounded-sm disabled:opacity-40 hover:border-gold-400 transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                  disabled={filters.page === data.pages}
                  className="px-3 py-1 text-xs border border-parchment rounded-sm disabled:opacity-40 hover:border-gold-400 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRooms;
