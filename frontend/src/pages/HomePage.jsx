import { useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import QuickBookingBar from '@/components/home/QuickBookingBar';
import FeaturesSection from '@/components/home/FeaturesSection';
import FeaturedRooms from '@/components/home/FeaturedRooms';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import GalleryPreview from '@/components/home/GalleryPreview';
import LocationSection from '@/components/home/LocationSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  useEffect(() => {
    document.title = 'Silver Key Hotel — Premium Stay in Electronic City, Bengaluru';
  }, []);

  return (
    <>
      <HeroSection />
      <QuickBookingBar />
      <FeaturesSection />
      <FeaturedRooms />
      <GalleryPreview />
      <TestimonialsSection />
      <LocationSection />
      <CTASection />
    </>
  );
}
