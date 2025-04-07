
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="hero-pattern relative overflow-hidden">
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              <span className="text-tablemate-burgundy">Elevate</span> Your Dining Experience
            </h1>
            <p className="text-lg mb-8 max-w-2xl">
              Reserve your perfect table at the finest restaurants with TableMate. 
              Simple, elegant, and personalized reservation experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/reservations">
                <Button size="lg" className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90 text-white">
                  Book a Table
                </Button>
              </Link>
              <Link to="/menu">
                <Button size="lg" variant="outline" className="border-tablemate-burgundy text-tablemate-burgundy hover:bg-tablemate-burgundy/10">
                  View Menu
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-2 relative">
            <div className="bg-white p-3 shadow-xl rotate-3 transform transition-transform hover:rotate-0">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop"
                alt="Elegant restaurant interior" 
                className="w-full h-auto rounded"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white p-3 shadow-xl -rotate-6 transform transition-transform hover:rotate-0 max-w-[200px] hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=400&auto=format&fit=crop"
                alt="Elegant plated dish" 
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
