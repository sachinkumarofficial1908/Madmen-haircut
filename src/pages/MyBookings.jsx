import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiTag } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my').then(r => { setBookings(r.data.bookings || []); setLoading(false); });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container">
        <div style={{ marginBottom: '36px' }}>
          <h2>My Appointments</h2>
          <p style={{ color: 'var(--text-muted)' }}>Hello, {user?.name} — here are your bookings.</p>
        </div>

        {loading ? <div className="spinner" /> : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
            <h3>No bookings yet</h3>
            <p style={{ color: 'var(--text-muted)', margin: '10px 0 24px' }}>You haven't booked any appointments.</p>
            <Link to="/booking" className="btn btn-primary">Book Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map(b => (
              <div key={b._id} className="card my-booking-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div className="my-booking-main" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <FiCalendar color="var(--primary)" size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '4px' }}>{b.service?.name}</h4>
                    <div className="my-booking-meta" style={{ display: 'flex', gap: '16px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiCalendar size={12} /> {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiClock size={12} /> {b.timeSlot}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiTag size={12} /> ${b.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className={`badge badge-${b.status}`}>{b.status}</span>
                  <span className={`badge badge-${b.paymentStatus}`}>{b.paymentStatus}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
