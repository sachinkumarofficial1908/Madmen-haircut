import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Services from './pages/Services';
import Team from './pages/Team';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import { Login, Register } from './pages/Auth';
import MyBookings from './pages/MyBookings';

import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminServices from './pages/admin/AdminServices';
import AdminTeam from './pages/admin/AdminTeam';
import AdminUsers from './pages/admin/AdminUsers';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';

function PublicLayout({ children }) {
  const { pathname } = useLocation();
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      {pathname !== '/booking' && <Link to="/booking" className="mobile-book-cta">Book an appointment</Link>}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3500, style: { fontFamily: 'Inter, sans-serif', fontSize: '0.88rem' } }} />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/team" element={<PublicLayout><Team /></PublicLayout>} />
          <Route path="/booking" element={<PublicLayout><Booking /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User protected */}
          <Route path="/my-bookings" element={<ProtectedRoute><PublicLayout><MyBookings /></PublicLayout></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </SiteProvider>
    </AuthProvider>
  );
}
