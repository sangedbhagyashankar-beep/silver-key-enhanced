import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';

// Layout
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import PageLoader from '@/components/common/PageLoader';
import ChatBot from '@/components/common/ChatBot';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Pages (lazy loaded for performance)
const HomePage = lazy(() => import('@/pages/HomePage'));
const RoomsPage = lazy(() => import('@/pages/RoomsPage'));
const RoomDetailPage = lazy(() => import('@/pages/RoomDetailPage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const BookingConfirmationPage = lazy(() => import('@/pages/BookingConfirmationPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const MyBookingsPage = lazy(() => import('@/pages/MyBookingsPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminRooms = lazy(() => import('@/pages/admin/AdminRooms'));
const AdminBookings = lazy(() => import('@/pages/admin/AdminBookings'));
const AdminReviews = lazy(() => import('@/pages/admin/AdminReviews'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
    <ChatBot />
  </>
);

const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-charcoal-50 flex">
    {/* Admin sidebar + content */}
    <div className="flex-1">{children}</div>
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/rooms" element={<MainLayout><RoomsPage /></MainLayout>} />
            <Route path="/rooms/:id" element={<MainLayout><RoomDetailPage /></MainLayout>} />
            <Route path="/booking" element={<MainLayout><BookingPage /></MainLayout>} />
            <Route path="/booking/confirmation/:bookingId" element={<MainLayout><BookingConfirmationPage /></MainLayout>} />
            <Route path="/gallery" element={<MainLayout><GalleryPage /></MainLayout>} />
            <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected guest routes */}
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <MainLayout><MyBookingsPage /></MainLayout>
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/rooms" element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <AdminLayout><AdminRooms /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/bookings" element={
              <ProtectedRoute roles={['admin', 'superadmin', 'staff']}>
                <AdminLayout><AdminBookings /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/reviews" element={
              <ProtectedRoute roles={['admin', 'superadmin']}>
                <AdminLayout><AdminReviews /></AdminLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'Lato, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#d4af37', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
