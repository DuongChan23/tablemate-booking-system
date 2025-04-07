
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm z-10 relative border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-serif font-bold text-tablemate-burgundy">Table<span className="text-tablemate-gold">Mate</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-tablemate-burgundy transition-colors">Home</Link>
            <Link to="/menu" className="font-medium hover:text-tablemate-burgundy transition-colors">Menu</Link>
            <Link to="/reservations" className="font-medium hover:text-tablemate-burgundy transition-colors">Reservations</Link>
            <Link to="/login" className="font-medium hover:text-tablemate-burgundy transition-colors">Login</Link>
            <Link to="/register">
              <Button className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">Register</Button>
            </Link>
          </nav>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 pb-6 border-t animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="font-medium hover:text-tablemate-burgundy transition-colors">Home</Link>
              <Link to="/menu" className="font-medium hover:text-tablemate-burgundy transition-colors">Menu</Link>
              <Link to="/reservations" className="font-medium hover:text-tablemate-burgundy transition-colors">Reservations</Link>
              <Link to="/login" className="font-medium hover:text-tablemate-burgundy transition-colors">Login</Link>
              <Link to="/register">
                <Button className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90 w-full">Register</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
