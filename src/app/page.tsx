'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ArrowRight, CheckCircle, Sparkles, Instagram, Phone, Flower2, Image as ImageIcon, MessageCircle, ShieldCheck, Crown, HandPlatter, Package, Mail, Info, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import AskSwekshaChat from '@/components/AskSwekshaChat';
import FadeIn from '@/components/animations/FadeIn';

export default function Home() {
  const [content, setContent] = useState<any>(null);
  const [offers, setOffers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [faq, setFaq] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [contentData, offersData, galleryData, reviewsData, faqData, servicesData] = await Promise.all([
        fetch('/api/data/content').then(r => r.json()),
        fetch('/api/data/offers').then(r => r.json()),
        fetch('/api/data/gallery').then(r => r.json()),
        fetch('/api/data/reviews').then(r => r.json()),
        fetch('/api/data/faq').then(r => r.json()),
        fetch('/api/data/services').then(r => r.json()),
      ]);
      setContent(contentData);
      setOffers(offersData);
      setGallery(galleryData);
      setReviews(reviewsData);
      setFaq(faqData);
      setServices(servicesData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Services Data:", services);
  }, [services]);

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
                <FadeIn
                  key={i}
                  delay={i * 0.1}
                  className="snap-center shrink-0 w-28 sm:w-auto"
                  width="fit-content"
                >
                  <Link
                    href={item.href}
                    className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition flex flex-col items-center text-center gap-2 sm:gap-3 group h-full justify-center w-full"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary group-hover:bg-brand-secondary/20 transition">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">{item.name}</span>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced Spacing */}
      <section className="py-8 sm:py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center font-serif">
              Why Choose Us
            </h2>
          </FadeIn>

          {/* Offer Banner - Responsive Padding */}
          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-r from-brand-secondary to-brand-primary rounded-xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 text-white text-center relative overflow-hidden shadow-md">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <Sparkles className="w-full h-full" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold relative z-10 uppercase tracking-wide">
                {activeBannerOffer.title}
              </h3>
              <p className="text-sm md:text-base opacity-90 relative z-10 mt-1">{activeBannerOffer.details}</p>
            </div>
          </FadeIn>

          {/* Features Grid - Better Tablet Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-center">
            {[
              { title: 'Experienced Professionals', icon: HandPlatter },
              { title: 'Hygienic & Safe', icon: ShieldCheck },
              { title: 'Premium Products', icon: Crown },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={i} delay={i * 0.2}>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-sm">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h4 className="text-gray-700 font-medium">{feature.title}</h4>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>


      {/* Featured Services */}
      <section className="py-12 px-4 bg-brand-bg/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-serif">Featured Services</h2>
            <p className="text-gray-600">Discover our most popular beauty treatments</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Array.isArray(services) ? services : []).flatMap(cat => cat.services || []).filter(s => s.active && s.image).slice(0, 4).map((service, i) => (
              <FadeIn key={service.id} delay={i * 0.1}>
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group h-full">
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1">{service.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-brand-primary">₹{service.price}</span>
                      <Link href={`/booking?service=${encodeURIComponent(service.name)}`} className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-700 transition">
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/services" className="inline-flex items-center gap-2 text-brand-primary font-medium hover:underline">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <FadeIn className="w-full md:w-1/2">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Sweksha Beauty Salon Interior"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeIn>
            <FadeIn className="w-full md:w-1/2" delay={0.2}>
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 font-serif">Experience Beauty & Relaxation</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  At Sweksha Beauty, we believe that beauty is not just about looking good, but feeling good. Our expert team is dedicated to providing you with the best services in a hygienic and relaxing environment.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CheckCircle className="w-5 h-5 text-brand-primary" /> Expert Stylists
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CheckCircle className="w-5 h-5 text-brand-primary" /> Premium Products
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <CheckCircle className="w-5 h-5 text-brand-primary" /> Hygienic Space
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/about" className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg">
                    Learn More About Us
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-brand-bg/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <Sparkles className="w-full h-full text-brand-primary" />
        </div>
        <div className="container mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center font-serif">What Our Clients Say</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.filter(r => r.active).slice(0, 3).map((review, i) => (
              <FadeIn key={review.id} delay={i * 0.2}>
                <div className="bg-white p-6 rounded-2xl relative shadow-sm h-full">
                  <Quote className="w-8 h-8 text-brand-primary/20 absolute top-4 right-4" />
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, starI) => (
                      <Star key={starI} className={`w-4 h-4 ${starI < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4 text-sm">"{review.text}"</p>
                  <p className="font-bold text-gray-900 text-sm">- {review.name}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/reviews" className="inline-block border border-brand-primary text-brand-primary px-6 py-2 rounded-full text-sm font-medium hover:bg-brand-primary hover:text-white transition">
              Read More Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center font-serif">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faq.map((item, i) => (
              <FadeIn key={item.id} delay={i * 0.1}>
                <div className="bg-brand-bg/20 rounded-xl overflow-hidden">
                  <details className="group">
                    <summary className="flex justify-between items-center p-4 cursor-pointer list-none font-medium text-gray-800">
                      <span>{item.question}</span>
                      <span className="transition group-open:rotate-180">
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </span>
                    </summary>
                    <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100/50 pt-2">
                      {item.answer}
                    </div>
                  </details>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center relative">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 font-serif">
            Instagram @swekshabeauty
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {instagramImages.map((img: any, i: number) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-square relative rounded-xl overflow-hidden bg-gray-100"
                >
                  <Image
                    src={img.url || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'}
                    alt={img.caption || 'Instagram Post'}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </FadeIn>
            ))}
          </div>

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
