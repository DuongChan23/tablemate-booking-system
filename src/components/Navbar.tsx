
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();

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
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="font-medium text-tablemate-burgundy hover:text-tablemate-burgundy/80 transition-colors">
                    Admin Dashboard
                  </Link>
                )}
                <Button 
                  onClick={logout} 
                  variant="outline" 
                  className="border-tablemate-burgundy text-tablemate-burgundy hover:bg-tablemate-burgundy/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="font-medium hover:text-tablemate-burgundy transition-colors">Login</Link>
                <Link to="/register">
                  <Button className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90">Register</Button>
                </Link>
              </>
            )}
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
              
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="font-medium text-tablemate-burgundy hover:text-tablemate-burgundy/80 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Button 
                    onClick={logout} 
                    variant="outline" 
                    className="border-tablemate-burgundy text-tablemate-burgundy hover:bg-tablemate-burgundy/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="font-medium hover:text-tablemate-burgundy transition-colors">Login</Link>
                  <Link to="/register">
                    <Button className="bg-tablemate-burgundy hover:bg-tablemate-burgundy/90 w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
