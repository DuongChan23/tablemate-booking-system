
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UtensilsCrossed, CalendarDays, User as UserIcon, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Reservations', path: '/admin/reservations', icon: <CalendarDays className="h-5 w-5" /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users className="h-5 w-5" /> },
    { name: 'Users', path: '/admin/users', icon: <UserIcon className="h-5 w-5" /> },  // New menu item
    { name: 'Menu', path: '/admin/menu', icon: <UtensilsCrossed className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex items-center justify-center h-16 border-b">
            <h2 className="text-xl font-serif font-bold text-tablemate-burgundy">TableMate Admin</h2>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive(item.path)
                      ? "bg-tablemate-burgundy text-white"
                      : "text-gray-700 hover:bg-tablemate-burgundy/10 hover:text-tablemate-burgundy"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="mr-3">
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={logout}
            >
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <main className="min-h-screen bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
