
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import MenuPreview from '@/components/MenuPreview';
import TestimonialSection from '@/components/TestimonialSection';

const Index = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        <section className="container mx-auto py-16 px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Why Choose TableMate?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make restaurant reservations simple and elegant. Our platform connects you with the best dining experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in">
              <h3 className="text-xl font-serif font-bold mb-3">Easy Booking</h3>
              <p>Reserve your table in seconds with our streamlined booking process.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-xl font-serif font-bold mb-3">Personalized Experience</h3>
              <p>We remember your preferences to make every visit special.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-xl font-serif font-bold mb-3">Special Occasions</h3>
              <p>Planning a celebration? Let us help make it memorable.</p>
            </div>
          </div>
        </section>
        
        <MenuPreview />
        
        <TestimonialSection />
        
        <section className="bg-tablemate-burgundy text-white py-16">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Experience TableMate?</h2>
            <p className="max-w-2xl mx-auto mb-8">Join thousands of diners who use TableMate to discover and book the perfect table.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-tablemate-burgundy">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-white text-tablemate-burgundy hover:bg-tablemate-cream">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
