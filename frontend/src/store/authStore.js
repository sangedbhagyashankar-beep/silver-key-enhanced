import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAccessToken: (token) => set({ accessToken: token }),

      login: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),

      logout: () => set({ user: null, accessToken: null, isAuthenticated: false }),

      updateUser: (updates) => set({ user: { ...get().user, ...updates } }),

      isAdmin: () => ['admin', 'superadmin'].includes(get().user?.role),
      isStaff: () => ['admin', 'superadmin', 'staff'].includes(get().user?.role),
    }),
    {
      name: 'sk-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Booking store
export const useBookingStore = create((set) => ({
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
  selectedRoom: null,
  bookingStep: 1, // 1: search, 2: room select, 3: guest details, 4: payment, 5: confirmation

  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (adults, children) => set({ adults, children }),
  setSelectedRoom: (room) => set({ selectedRoom: room }),
  setStep: (step) => set({ bookingStep: step }),
  reset: () => set({ checkIn: null, checkOut: null, adults: 2, children: 0, selectedRoom: null, bookingStep: 1 }),
}));
