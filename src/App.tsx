
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import PublicRoutes from "@/routes/PublicRoutes";
import AdminRoutes from "@/routes/AdminRoutes";

// Pages
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Menu from "./pages/Menu";
import Reservations from "./pages/Reservations";
import ReservationHistory from "./pages/ReservationHistory";
import Dashboard from "./pages/admin/Dashboard";
import CustomerList from "./pages/admin/CustomerList";
import MenuList from "./pages/admin/MenuList";
import ReservationPage from "./pages/admin/Reservation"; 
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route element={<PublicRoutes />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            
            {/* Protected Routes (Require authentication) */}
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/reservation-history" element={<ReservationHistory />} />
            
            {/* Admin Routes */}
            <Route element={<AdminRoutes />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/customers" element={<CustomerList />} />
              <Route path="/admin/menu" element={<MenuList />} />
              <Route path="/admin/reservations" element={<ReservationPage />} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
