import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { roomApi } from '@/services/api';
import RoomCard from '@/components/rooms/RoomCard';
import RoomFilters from '@/components/rooms/RoomFilters';

export default function RoomsPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: '',
    acType: '',
    minPrice: '',
    maxPrice: '',
    adults: searchParams.get('adults') || '',
    sort: '-isFeatured',
    page: 1,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    document.title = 'Rooms & Suites — Silver Key Hotel';
  }, []);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['rooms', filters],
    queryFn: () => roomApi.getAll(filters).then((r) => r.data),
    keepPreviousData: true,
  });

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  const clearFilters = () => setFilters({ type: '', acType: '', minPrice: '', maxPrice: '', adults: '', sort: '-isFeatured', page: 1 });
  const hasActiveFilters = filters.type || filters.acType || filters.minPrice || filters.maxPrice || filters.adults;

  return (
    <div className="min-h-screen bg-cream pt-24">
      {/* Page Header */}
      <div className="bg-charcoal-900 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-gold-500 text-xs uppercase tracking-[0.3em] font-body mb-3">Accommodations</p>
          <h1 className="font-display text-4xl md:text-5xl text-white font-bold">Rooms & Suites</h1>
          <div className="gold-divider" />
          <p className="text-charcoal-300 text-sm max-w-lg mx-auto mt-4">
            Choose from our range of thoughtfully designed rooms, each crafted for your comfort.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters – desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-sm shadow-sm border border-parchment p-6 sticky top-28">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-charcoal-800 text-lg">Filters</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-gold-600 text-xs flex items-center gap-1 hover:text-gold-700">
                    <X size={12} /> Clear
                  </button>
                )}
              </div>
              <RoomFilters filters={filters} onChange={updateFilter} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-charcoal-500 text-sm">
                {isLoading ? 'Loading...' : `${data?.total || 0} rooms available`}
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="input-luxury text-xs py-2 w-44"
                >
                  <option value="-isFeatured">Featured First</option>
                  <option value="price.base">Price: Low → High</option>
                  <option value="-price.base">Price: High → Low</option>
                  <option value="-ratings.average">Highest Rated</option>
                </select>
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 btn-outline text-xs py-2"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
              </div>
            </div>

            {/* Rooms grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-sm shadow animate-pulse">
                    <div className="h-48 bg-charcoal-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-charcoal-100 rounded w-2/3" />
                      <div className="h-4 bg-charcoal-100 rounded" />
                      <div className="h-4 bg-charcoal-100 rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.rooms?.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={JSON.stringify(filters)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {data.rooms.map((room, i) => (
                    <RoomCard key={room._id} room={room} delay={i * 0.05} />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-16">
                <p className="font-display text-2xl text-charcoal-400 mb-4">No rooms found</p>
                <p className="text-charcoal-400 text-sm mb-6">Try adjusting your filters.</p>
                <button onClick={clearFilters} className="btn-gold text-xs">Clear Filters</button>
              </div>
            )}

            {/* Pagination */}
            {data?.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array(data.pages).fill(0).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                    className={`w-9 h-9 rounded-sm text-sm font-body font-bold transition-all ${
                      filters.page === i + 1
                        ? 'bg-gold-500 text-charcoal-900'
                        : 'bg-white border border-parchment text-charcoal-500 hover:border-gold-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-charcoal-900/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X size={20} className="text-charcoal-500" />
                </button>
              </div>
              <RoomFilters filters={filters} onChange={updateFilter} />
              <button onClick={() => setMobileFiltersOpen(false)} className="btn-gold w-full mt-6 text-xs">
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
