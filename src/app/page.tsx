'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ArrowRight, CheckCircle, Sparkles, Instagram, Phone, Flower2, Image as ImageIcon, MessageCircle, ShieldCheck, Crown, HandPlatter, Package, Mail, Info } from 'lucide-react';
import AskSwekshaChat from '@/components/AskSwekshaChat';

export default function Home() {
  const [content, setContent] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [contentData, offersData, galleryData] = await Promise.all([
        fetch('/api/data/content').then(r => r.json()),
        fetch('/api/data/offers').then(r => r.json()),
        fetch('/api/data/gallery').then(r => r.json()),
      ]);
      setContent(contentData);
      setOffers(offersData);
      setGallery(galleryData);
    }
    fetchData();
  }, []);

  if (!content) return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full"></div></div>;

  // Get active banner offer or default
  const activeBannerOffer = offers.find((o: any) => o.active && o.type === 'banner') || {
    title: "WINTER WAXING OFFER FLAT 20% OFF",
    details: "Get smooth skin this winter"
  };

  // Get Instagram images (marked specifically for Instagram)
  const instagramImages = gallery.filter((img: any) => img.isInstagram).slice(0, 6);
  while (instagramImages.length < 6) {
    instagramImages.push({ id: `placeholder-${instagramImages.length}`, url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80', caption: 'Sweksha Beauty', isInstagram: false });
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
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      opens: '10:00',
      closes: '19:30'
    },
    priceRange: '₹₹'
  };

  return (
    <div className="bg-brand-bg min-h-screen font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section - Responsive Heights */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[550px] lg:h-[650px] xl:h-[700px] w-full overflow-hidden">
        {/* Animated Background Image with Ken Burns Effect */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{
            scale: [1.1, 1, 1.05],
            opacity: 1
          }}
          transition={{
            scale: {
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            },
            opacity: {
              duration: 1.5,
              ease: "easeOut"
            }
          }}
        >
          <Image
            src={content.home.heroImage || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'}
            alt="Sweksha Beauty Hero"
            fill
            className="object-cover brightness-75"
            priority
          />
        </motion.div>

        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        ></motion.div>

        {/* Floating Particles/Sparkles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold font-serif mb-2 drop-shadow-md"
          >
            Sweksha Beauty
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl font-medium mb-8 opacity-90"
          >
            – Radiance Awaits You
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/booking"
              className="bg-brand-primary hover:opacity-90 text-white px-8 py-3 rounded-full font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book Appointment
            </Link>
            <a
              href="tel:+919065347011"
              className="bg-brand-secondary hover:opacity-90 text-gray-900 px-8 py-3 rounded-full font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Call Now <Phone className="w-4 h-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 w-full sm:w-auto"
          >
            <AskSwekshaChat
              customTrigger={
                <button className="w-full sm:w-auto bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white px-6 py-3 sm:py-2 rounded-full font-medium transition shadow-lg flex items-center justify-center gap-2 group">
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition" />
                  Ask Sweksha AI Assistant
                </button>
              }
            />
          </motion.div>
        </div>
      </section>

      {/* Quick Links Cards - Horizontal Scroll */}
      <section className="py-8 sm:py-12 -mt-12 sm:-mt-16 relative z-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-6 sm:overflow-visible scrollbar-hide">
            {[
              { name: 'Services', icon: Flower2, href: '/services' },
              { name: 'Packages', icon: Package, href: '/packages' },
              { name: 'Gallery', icon: ImageIcon, href: '/gallery' },
              { name: 'Reviews', icon: MessageCircle, href: '/reviews' },
              { name: 'Contact', icon: Mail, href: '/contact' },
              { name: 'About', icon: Info, href: '/about' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                  className="snap-center shrink-0 w-28 sm:w-auto"
                >
                  <Link
                    href={item.href}
                    className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition flex flex-col items-center text-center gap-2 sm:gap-3 group h-full justify-center"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary group-hover:bg-brand-secondary/20 transition">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced Spacing */}
      <section className="py-8 sm:py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center font-serif"
          >
            Why Choose Us
          </motion.h2>

          {/* Offer Banner - Responsive Padding */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-r from-brand-secondary to-brand-primary rounded-xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 text-white text-center relative overflow-hidden shadow-md"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <Sparkles className="w-full h-full" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold relative z-10 uppercase tracking-wide">
              {activeBannerOffer.title}
            </h3>
            <p className="text-sm md:text-base opacity-90 relative z-10 mt-1">{activeBannerOffer.details}</p>
          </motion.div>

          {/* Features Grid - Better Tablet Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-center">
            {[
              { title: 'Experienced Professionals', icon: HandPlatter },
              { title: 'Hygienic & Safe', icon: ShieldCheck },
              { title: 'Premium Products', icon: Crown },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-sm">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-gray-700 font-medium">{feature.title}</h4>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center relative">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 font-serif">
            Instagram @swekshabeauty
          </h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          >
            {instagramImages.map((img: any, i: number) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="aspect-square relative rounded-xl overflow-hidden bg-gray-100"
              >
                {/* In a real app, these would be real images. Using placeholders for now if no gallery data */}
                <Image
                  src={img.url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'}
                  alt={img.caption || 'Instagram Post'}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </motion.div>

          <a
            href="https://instagram.com/sweksha_beauty"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-bg text-brand-primary px-8 py-2 rounded-full font-bold text-sm hover:bg-brand-secondary transition"
          >
            FOLLOW US
          </a>

          {/* Floating QR Code (Desktop) */}
          <div className="hidden lg:block absolute -right-24 bottom-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100 transform rotate-3 hover:rotate-0 transition">
            <div className="w-24 h-24 bg-gray-900 rounded-lg mb-2 flex items-center justify-center text-white">
              <Instagram className="w-12 h-12" />
            </div>
            <p className="text-xs font-bold text-gray-600">Scan to Follow</p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3612.3578979354434!2d86.54873187407807!3d25.123588234680717!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f19754a0267cbb%3A0xc91aafab24d0bff9!2sSweksha%20New%20Ladies%20Beauty%20Parlour!5e0!3m2!1sen!2sin!4v1764046532072!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full grayscale hover:grayscale-0 transition duration-500"
        ></iframe>
      </section>

    </div>
  );
}

