import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiClock, FiInstagram, FiFacebook } from 'react-icons/fi';
import { useSite } from '../../context/SiteContext';

export default function Footer() {
  const { settings } = useSite();
  const openDays = settings.hours.filter(day => !/closed/i.test(day.hours)).slice(0, 2).map(day => `${day.day}: ${day.hours}`).join(' · ');
  return (
    <footer style={{ background: '#1a1a1a', color: '#ccc', padding: '70px 0 30px' }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '50px' }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'white', marginBottom: '14px' }}>
              <span style={{ color: 'var(--primary)' }}>✂</span> {settings.name}
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#aaa' }}>
              {settings.tagline}. Expert cuts, thoughtful service and a relaxed Midtown experience.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" style={{ color: 'var(--primary)', fontSize: '1.3rem' }}><FiInstagram /></a>}
              {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" style={{ color: 'var(--primary)', fontSize: '1.3rem' }}><FiFacebook /></a>}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '18px', fontFamily: 'Inter, sans-serif' }}>Quick Links</h4>
            {[['/', 'Home'], ['/services', 'Services'], ['/team', 'Our Team'], ['/booking', 'Book Appointment'], ['/contact', 'Contact']].map(([to, label]) => (
              <div key={to} style={{ marginBottom: '8px' }}>
                <Link to={to} style={{ fontSize: '0.88rem', color: '#aaa', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                  onMouseLeave={e => e.target.style.color = '#aaa'}>{label}</Link>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '18px', fontFamily: 'Inter, sans-serif' }}>Services</h4>
            {['Haircuts', 'Beard Trim', 'Clipper Cuts', 'Men\'s Manicure', 'Styling', 'Shampoo'].map(s => (
              <div key={s} style={{ marginBottom: '8px', fontSize: '0.88rem', color: '#aaa' }}>{s}</div>
            ))}
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '18px', fontFamily: 'Inter, sans-serif' }}>Contact Us</h4>
            {[
              [FiMapPin, `${settings.address}, ${settings.city} ${settings.postalCode}`],
              [FiPhone, settings.phone],
              ...(settings.email ? [[FiMail, settings.email]] : []),
              [FiClock, openDays || 'See contact page for hours'],
            ].map(([Icon, text], i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '0.88rem', color: '#aaa' }}>
                <Icon style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: '24px', textAlign: 'center', fontSize: '0.82rem', color: '#666' }}>
          © {new Date().getFullYear()} {settings.name}. All rights reserved. | Proud to serve New York City.
        </div>
      </div>
    </footer>
  );
}
