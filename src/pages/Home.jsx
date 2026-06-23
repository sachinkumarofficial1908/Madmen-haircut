import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar, FiCheck, FiScissors, FiHeart, FiAward } from 'react-icons/fi';
import api from '../utils/api';
import { useSite } from '../context/SiteContext';

const features = [
  { icon: <FiScissors size={28}/>, title: 'Expert Barbers', desc: 'Professional barbers trained in scissor cuts and modern styling techniques.' },
  { icon: <FiHeart size={28}/>, title: 'Premium Care', desc: 'We use premium grooming products for quality cuts and finishes.' },
  { icon: <FiAward size={28}/>, title: '4.8 Rating', desc: 'Rated 4.8/5 stars by 53+ satisfied customers in NYC.' },
  { icon: <FiStar size={28}/>, title: 'Luxury Experience', desc: 'Every visit includes professional service with beautiful Madison Ave views.' },
];

const testimonials = [
  { name: 'Andrew Sokulski', text: 'What an amazing haircut! Blown away by the combination of swiftness, high-level technique, thorough wash, rinse & dry, and smooth conversation. For the price they give you and the service provided, this is a man\'s place to be for all grooming matters.', rating: 5 },
  { name: 'Colin Redmond', text: 'Best men\'s salon in NYC by a mile, and I\'ve tried most in midtown. Jasmine is amazing, best hair cut I\'ve had in a long time.', rating: 5 },
  { name: 'Marcus Anderson', text: 'The professionals here truly care about getting it right. Top notch service every single time!', rating: 5 },
];

export default function Home() {
  const { settings } = useSite();
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.services?.slice(0, 6) || []));
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero-section" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #faf8f5 0%, #f2ede6 50%, #e8ddd0 100%)',
        display: 'flex', alignItems: 'center',
        paddingTop: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="hero-orb hero-orb-right" style={{ position: 'absolute', top: '10%', right: '5%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,169,126,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="hero-orb hero-orb-left" style={{ position: 'absolute', bottom: '10%', left: '3%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,75,107,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container">
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div className="hero-copy">
              <span style={{ display: 'inline-block', background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))', color: 'white', padding: '6px 18px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px' }}>
                ✦ Premium Men's Barber Shop
              </span>
              <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--secondary)', marginBottom: '22px', fontWeight: 700 }}>
                Look Your Best,<br /><em style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Feel Confident</em>
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '450px', marginBottom: '36px', lineHeight: 1.8 }}>
                {settings.tagline}. From sharp scissor cuts to professional styling, enjoy personal service above Madison Avenue.
              </p>
              <div className="hero-actions" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link to="/booking" className="btn btn-primary" style={{ fontSize: '1rem', padding: '15px 36px' }}>
                  Book Appointment <FiArrowRight />
                </Link>
                <Link to="/services" className="btn btn-outline" style={{ fontSize: '1rem', padding: '15px 36px' }}>
                  Our Services
                </Link>
              </div>
              <div className="hero-stats" style={{ display: 'flex', gap: '36px', marginTop: '48px' }}>
                {[[`${settings.reviewCount}+`, 'Google Reviews'], ['3', 'Expert Stylists'], [`${settings.rating}★`, 'Google Rating']].map(([num, label]) => (
                  <div key={label}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Playfair Display, serif' }}>{num}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-visual" style={{ position: 'relative' }}>
              <div className="hero-image" style={{
                borderRadius: '30px 30px 120px 30px',
                overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0,0,0,0.15)',
                height: '520px',
              }}>
                <img src={settings.heroImage} alt={`${settings.name} barber shop`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="hero-rating" style={{
                position: 'absolute', bottom: '40px', left: '-30px',
                background: 'white', borderRadius: '16px', padding: '16px 20px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <div style={{ background: 'var(--primary)', borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiStar color="white" size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{settings.rating} Rating</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{settings.reviewCount} Google Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.hero-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* FEATURES */}
      <section style={{ background: 'var(--secondary)', padding: '70px 0' }}>
        <div className="container">
          <div className="grid-4">
            {features.map(f => (
              <div key={f.title} style={{ textAlign: 'center', padding: '10px' }}>
                <div style={{ color: 'var(--primary)', marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{f.title}</h3>
                <p style={{ color: '#aaa', fontSize: '0.88rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-title">
            <span>What We Offer</span>
            <h2>Our Expert Services</h2>
            <p>Professional barber services including scissor cuts, clipper cuts, beard styling, and manicures.</p>
          </div>
          <div className="grid-3">
            {services.map(s => (
              <div key={s._id} className="card" style={{ transition: 'transform 0.3s, box-shadow 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ height: '200px', overflow: 'hidden' }}>
                  <img src={s.image || 'https://images.unsplash.com/photo-1560066984-138daaa0ad8d?w=400'} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.target.style.transform = ''} />
                </div>
                <div style={{ padding: '20px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.category}</span>
                  <h3 style={{ fontSize: '1.1rem', margin: '6px 0 8px', fontFamily: 'Playfair Display, serif' }}>{s.name}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.6 }}>{s.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>${s.price}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '4px' }}>{s.duration} min</span>
                    </div>
                    <Link to="/booking" className="btn btn-sm btn-primary">Book</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/services" className="btn btn-outline">View All Services <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-pad" style={{ background: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '70px', alignItems: 'center' }}>
            <div className="about-visual" style={{ position: 'relative' }}>
              <div className="about-image" style={{ borderRadius: '30px', overflow: 'hidden', height: '460px' }}>
                <img src={settings.aboutImage} alt={`Inside ${settings.name}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="about-floating-image" style={{ position: 'absolute', top: '-20px', right: '-20px', width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden', border: '6px solid white', boxShadow: 'var(--shadow)' }}>
                <img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '12px' }}>About Us</span>
              <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.6rem)', marginBottom: '18px' }}>Where Beauty Meets Excellence</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: '18px' }}>
                {settings.description}
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: '28px' }}>
                Visit us at {settings.address}, where attentive service and beautiful views of Madison Avenue make every appointment feel personal.
              </p>
              {['Certified & trained beauty professionals', 'Premium international product brands', 'Clean & hygienic environment', 'Personalized care for every client'].map(pt => (
                <div key={pt} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ background: 'var(--primary)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FiCheck color="white" size={12} />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{pt}</span>
                </div>
              ))}
              <div style={{ marginTop: '30px' }}>
                <Link to="/booking" className="btn btn-primary">Book a Session <FiArrowRight /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="section-title">
            <span>Client Love</span>
            <h2>What Our Clients Say</h2>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ padding: '30px' }}>
                <div style={{ color: '#f4c430', marginBottom: '14px', fontSize: '1.1rem' }}>
                  {'★'.repeat(t.rating)}
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '20px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: '16px' }}>Ready for Your Glow-Up?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '32px', fontSize: '1.05rem' }}>Book your appointment today and experience the {settings.name} difference.</p>
          <Link to="/booking" className="btn btn-dark" style={{ fontSize: '1rem', padding: '16px 40px' }}>
            Book Your Appointment <FiArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
