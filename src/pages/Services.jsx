import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = ['All', 'Hair', 'Skin', 'Makeup', 'Nails', 'Spa', 'Waxing'];

export default function Services() {
  const [services, setServices] = useState([]);
  const [active, setActive] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services').then(r => { setServices(r.data.services || []); setLoading(false); });
  }, []);

  const filtered = active === 'All' ? services : services.filter(s => s.category === active);

  return (
    <>
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #2c2c2c, #444)', padding: '120px 0 70px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(2rem,5vw,3.5rem)' }}>Our Services</h1>
        <p style={{ color: '#ccc', marginTop: '12px', fontSize: '1rem' }}>Premium beauty treatments tailored for you</p>
      </div>

      <section className="section-pad">
        <div className="container">
          {/* Category filter */}
          <div className="service-filters" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '50px' }}>
            {CATEGORIES.map(cat => (
              <button key={cat}
                className={`btn btn-sm ${active === cat ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActive(cat)}
              >{cat}</button>
            ))}
          </div>

          {loading ? <div className="spinner" /> : (
            <div className="grid-3">
              {filtered.map(s => (
                <div key={s._id} className="card" style={{ transition: 'transform 0.3s, box-shadow 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ height: '210px', overflow: 'hidden' }}>
                    <img src={s.image || 'https://images.unsplash.com/photo-1560066984-138daaa0ad8d?w=400'} alt={s.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '22px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.category}</span>
                    <h3 style={{ fontSize: '1.15rem', margin: '6px 0 10px', fontFamily: 'Playfair Display, serif' }}>{s.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.7 }}>{s.description}</p>
                    <div className="service-price-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                      <div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>${s.price}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.duration} minutes</div>
                      </div>
                      <Link to={`/booking?service=${s._id}`} className="btn btn-sm btn-primary">Book Now</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              No services found in this category.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
