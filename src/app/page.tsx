import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import QuickLinks from '@/components/home/QuickLinks';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import FeaturedServices from '@/components/home/FeaturedServices';
import AboutSnippet from '@/components/home/AboutSnippet';
import Testimonials from '@/components/home/Testimonials';
import FAQSection from '@/components/home/FAQSection';
import InstagramSection from '@/components/home/InstagramSection';
import MapSection from '@/components/home/MapSection';
import { getContent, getOffers, getGallery, getReviews, getFAQ, getServices } from '@/lib/db';

export const metadata = {
  title: 'Sweksha Beauty | Best Beauty Parlour in Haveli Kharagpur',
  description: 'Experience premium beauty services at Sweksha Beauty. We offer bridal makeup, facials, hair styling, and more in a relaxing ambience.',
};

export default async function Home() {
  // Fetch data directly on the server
  const [content, offers, gallery, reviews, faq, services] = await Promise.all([
    getContent(),
    getOffers(),
    getGallery(),
    getReviews(),
    getFAQ(),
    getServices(),
  ]);

  // Get active banner offer or default
  const activeBannerOffer = offers.find((o: any) => o.active && o.type === 'banner') || {
    title: "WINTER WAXING OFFER FLAT 20% OFF",
    details: "Get smooth skin this winter"
  };

  // Get Instagram images (marked specifically for Instagram)
  const instagramImages = gallery.filter((img: any) => img.isInstagram).slice(0, 6);
  while (instagramImages.length < 6) {
    instagramImages.push({
      id: `placeholder-${instagramImages.length}`,
      url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
      caption: 'Sweksha Beauty',
      isInstagram: false
    });
  }

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: 'Sweksha Beauty',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    url: 'https://swekshabeauty.com',
    telephone: '+919065347011',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Market',
      addressLocality: 'Haveli Kharagpur',
      addressRegion: 'Bihar',
      postalCode: '811213',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.1235882,
      longitude: 86.5487319
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '19:30'
    },
    priceRange: '₹₹'
  };

  return (
    <div className="bg-brand-bg dark:bg-black min-h-screen font-sans transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection content={content} />
      <QuickLinks />
      <WhyChooseUs activeBannerOffer={activeBannerOffer} />
      <FeaturedServices services={services} />
      <AboutSnippet />
      <Testimonials reviews={reviews} />
      <FAQSection faq={faq} />
      <InstagramSection instagramImages={instagramImages} />
      <MapSection />

    </div>
  );
}
