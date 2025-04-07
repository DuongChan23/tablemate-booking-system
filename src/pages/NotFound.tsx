
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center bg-tablemate-cream">
        <div className="text-center px-6 py-24">
          <h1 className="text-tablemate-burgundy font-serif text-9xl mb-6">404</h1>
          <h2 className="text-2xl font-serif font-medium mb-6">Page Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8">
            We can't seem to find the page you're looking for. 
            Perhaps you'd like to explore our menu or make a reservation?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">
                Return Home
              </Button>
            </Link>
            <Link to="/reservations">
              <Button variant="outline" className="border-tablemate-burgundy text-tablemate-burgundy hover:bg-tablemate-burgundy/10">
                Make a Reservation
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
