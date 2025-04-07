
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Calendar,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // In a real app, we would clear auth state here
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: UtensilsCrossed, label: 'Menu', path: '/admin/menu' },
    { icon: Calendar, label: 'Reservations', path: '/admin/reservations' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop */}
      <aside 
        className={`bg-white border-r border-gray-200 transition-all duration-300 hidden md:block ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            {isSidebarOpen ? (
              <Link to="/admin" className="flex items-center">
                <span className="text-xl font-serif font-bold text-tablemate-burgundy">TableMate</span>
              </Link>
            ) : (
              <Link to="/admin" className="w-full flex justify-center">
                <span className="text-xl font-serif font-bold text-tablemate-burgundy">TM</span>
              </Link>
            )}
            <Button
              variant="ghost" 
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Menu size={20} />
            </Button>
          </div>
          
          <div className="flex-1 py-6 flex flex-col justify-between">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center py-2.5 px-3 rounded-md transition-colors ${
                    isCurrentPath(item.path)
                      ? 'bg-tablemate-burgundy/10 text-tablemate-burgundy'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${!isSidebarOpen ? 'justify-center' : ''}`}
                >
                  <item.icon size={20} className={isSidebarOpen ? 'mr-3' : ''} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              ))}
            </nav>
            
            <div className="px-2">
              <Button
                variant="ghost"
                className={`w-full flex items-center py-2.5 px-3 text-gray-700 hover:bg-gray-100 ${
                  !isSidebarOpen ? 'justify-center' : ''
                }`}
                onClick={handleLogout}
              >
                <LogOut size={20} className={isSidebarOpen ? 'mr-3' : ''} />
                {isSidebarOpen && <span>Logout</span>}
              </Button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${isMobileSidebarOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/30" 
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        ></div>
        
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg border-r">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <Link to="/admin" className="flex items-center">
                <span className="text-xl font-serif font-bold text-tablemate-burgundy">TableMate</span>
              </Link>
              <Button
                variant="ghost" 
                size="icon"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="flex-1 py-6 flex flex-col justify-between">
              <nav className="px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center py-2.5 px-3 rounded-md transition-colors ${
                      isCurrentPath(item.path)
                        ? 'bg-tablemate-burgundy/10 text-tablemate-burgundy'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="px-2">
                <Button
                  variant="ghost"
                  className="w-full flex items-center py-2.5 px-3 text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm z-10 relative">
          <div className="h-16 px-4 flex items-center justify-between md:justify-end">
            {/* Mobile menu button */}
            <Button
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden"
            >
              <Menu size={20} />
            </Button>
            
            <div className="flex items-center">
              <div className="relative">
                <div className="flex items-center">
                  <span className="mr-2 text-sm">Admin User</span>
                  <div className="h-8 w-8 rounded-full bg-tablemate-burgundy text-white flex items-center justify-center">
                    AU
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
