import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';
import { useSite } from '../../context/SiteContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSite();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') setOpen(false); };
    const onResize = () => { if (window.innerWidth > 960) setOpen(false); };
    document.body.style.overflow = open ? 'hidden' : '';
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const handleLogout = () => { setOpen(false); logout(); navigate('/'); };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/team', label: 'Our Team' },
    { to: '/contact', label: 'Contact' },
    { to: '/booking', label: 'Book Now', highlight: true },
  ];

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
          <span className={styles.logoIcon}>✂️</span>
          <span>{settings.name.replace(/ Haircuts$/i, '')}</span>
        </Link>

        {open && <button className={styles.menuBackdrop} aria-label="Close navigation menu" onClick={() => setOpen(false)} />}
        <ul id="primary-navigation" className={`${styles.links} ${open ? styles.open : ''}`}>
          <li className={styles.drawerHeader}>
            <span className={styles.drawerIcon}>✂</span>
            <span><strong>{settings.name.replace(/ Haircuts$/i, '')}</strong><small>Navigation</small></span>
          </li>
          {links.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `${isActive ? styles.active : ''} ${l.highlight ? styles.mobilePrimary : ''}`}
                onClick={() => setOpen(false)}
              >{l.label}</NavLink>
            </li>
          ))}
          {user && (
            <li>
              <NavLink to={isAdmin ? '/admin' : '/my-bookings'} className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setOpen(false)}>
                {isAdmin ? 'Admin' : 'My Bookings'}
              </NavLink>
            </li>
          )}
          <li className={styles.mobileAccount}>
            {user ? (
              <div className={styles.mobileUserBlock}>
                <span><FiUser /> Signed in as <strong>{user.name}</strong></span>
                <button type="button" onClick={handleLogout}><FiLogOut /> Logout</button>
              </div>
            ) : (
              <Link to="/login" className={styles.mobileLogin} onClick={() => setOpen(false)}><FiUser /> Login to your account</Link>
            )}
          </li>
        </ul>

        <div className={styles.actions}>
          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}><FiUser size={14}/> {user.name.split(' ')[0]}</span>
              <button className="btn btn-sm btn-outline" onClick={handleLogout}><FiLogOut size={14}/> Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
              <Link to="/booking" className="btn btn-sm btn-primary"><FiCalendar size={14}/> Book Now</Link>
            </>
          )}
          <button className={styles.burger} onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="primary-navigation">
            {open ? <FiX size={22}/> : <FiMenu size={22}/>}
          </button>
        </div>
      </div>
    </nav>
  );
}
