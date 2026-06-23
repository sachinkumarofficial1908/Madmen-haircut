import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiCalendar, FiScissors, FiUsers, FiMail, FiLogOut, FiUserCheck, FiSettings, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: FiCalendar },
  { to: '/admin/services', label: 'Services', icon: FiScissors },
  { to: '/admin/team', label: 'Team', icon: FiUserCheck },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/messages', label: 'Messages', icon: FiMail },
  { to: '/admin/settings', label: 'Business Settings', icon: FiSettings },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { settings } = useSite();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <button className="admin-menu-button" onClick={() => setOpen(value => !value)} aria-label="Toggle admin navigation">{open ? <FiX /> : <FiMenu />}</button>
      <div className="admin-mobile-bar"><span>{settings.name.replace(/ Haircuts$/i, '')}</span><small>Admin</small></div>
      {open && <button className="admin-overlay" onClick={() => setOpen(false)} aria-label="Close navigation" />}
      {/* Sidebar */}
      <aside className={`admin-sidebar ${open ? 'is-open' : ''}`} style={{ width: '240px', background: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        <div style={{ padding: '28px 24px', borderBottom: '1px solid #333' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'white' }}>
            <span style={{ color: 'var(--primary)' }}>✂</span> {settings.name.replace(/ Haircuts$/i, '')}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>Admin Panel</div>
        </div>
        <nav style={{ flex: 1, padding: '20px 12px' }}>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px',
              borderRadius: '10px', marginBottom: '4px', fontSize: '0.88rem', fontWeight: 500,
              color: isActive ? 'white' : '#aaa',
              background: isActive ? 'var(--primary)' : 'transparent',
              transition: 'all 0.2s',
            })}
              onMouseEnter={e => { if (!e.currentTarget.style.background.includes('primary')) e.currentTarget.style.background = '#2a2a2a'; }}
              onMouseLeave={e => { if (!e.currentTarget.style.background.includes('primary')) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid #333' }}>
          <div style={{ padding: '10px 14px', marginBottom: '6px' }}>
            <div style={{ fontSize: '0.82rem', color: '#aaa' }}>Logged in as</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</div>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '10px 14px', width: '100%', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 500 }}>
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main" style={{ marginLeft: '240px', flex: 1, background: '#f4f5f7', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}
