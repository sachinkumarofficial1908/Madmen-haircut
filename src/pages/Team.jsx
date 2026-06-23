import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/team').then(r => { setTeam(r.data.team || []); setLoading(false); });
  }, []);

  return (
    <>
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #2c2c2c, #444)', padding: '120px 0 70px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(2rem,5vw,3.5rem)' }}>Our Team</h1>
        <p style={{ color: '#ccc', marginTop: '12px' }}>Meet the talented professionals behind your glow</p>
      </div>
      <section className="section-pad">
        <div className="container">
          {loading ? <div className="spinner" /> : (
            <div className="grid-4">
              {team.map(m => (
                <div key={m._id} className="card" style={{ textAlign: 'center', padding: '30px 20px', transition: 'transform 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = ''}>
                  <div style={{ width: '110px', height: '110px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 18px', border: '3px solid var(--primary-light)' }}>
                    <img src={m.image || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200'} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{m.name}</h3>
                  <div style={{ color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '10px' }}>{m.role}</div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{m.bio}</p>
                  <div style={{ marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.experience} yrs experience</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
