
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import MenuPreview from '@/components/MenuPreview';
import TestimonialSection from '@/components/TestimonialSection';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Featured Menu Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-center mb-12">Our Featured Menu</h2>
            <MenuPreview />
          </div>
        </section>
        
        {/* Testimonials Section */}
        <TestimonialSection />
        
        {/* Book a Table CTA */}
        <section className="py-16 bg-tablemate-cream">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif mb-6">Ready to Experience TableMate?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-lg">
              Book a table now and enjoy an unforgettable dining experience with your loved ones.
            </p>
            <div className="flex justify-center">
              <a 
                href="/reservations" 
                className="bg-tablemate-burgundy text-white px-6 py-3 rounded-md hover:bg-tablemate-burgundy/90 transition-colors"
              >
                Book a Table
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
