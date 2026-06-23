import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiDollarSign, FiClock, FiTrendingUp, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import api from '../../utils/api';

const Card = ({ icon: Icon, label, value, color, sub }) => (
  <div className="admin-stat-card" style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a1a1a' }}>{value}</div>
        {sub && <div style={{ fontSize: '0.78rem', color: '#aaa', marginTop: '4px' }}>{sub}</div>}
      </div>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color={color} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/bookings/admin/stats'),
      api.get('/bookings/admin/all?limit=5'),
    ]).then(([s, b]) => {
      setStats(s.data.stats);
      setRecentBookings(b.data.bookings || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '60px' }}><div className="spinner" /></div>;

  return (
    <div className="admin-content admin-dashboard" style={{ padding: '36px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem' }}>Dashboard</h2>
        <p style={{ color: '#888', fontSize: '0.88rem' }}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <Card icon={FiCalendar} label="Total Bookings" value={stats?.totalBookings || 0} color="#c8a97e" />
        <Card icon={FiClock} label="Today's Bookings" value={stats?.todayBookings || 0} color="#3498db" sub="appointments today" />
        <Card icon={FiAlertCircle} label="Pending" value={stats?.pendingBookings || 0} color="#f39c12" />
        <Card icon={FiDollarSign} label="Revenue (Paid)" value={`$${(stats?.revenue || 0).toLocaleString('en-US')}`} color="#27ae60" sub="completed & paid" />
      </div>

      <div className="grid-4" style={{ marginBottom: '36px' }}>
        <Card icon={FiCheckCircle} label="Confirmed" value={stats?.confirmedBookings || 0} color="#3498db" />
        <Card icon={FiTrendingUp} label="Completed" value={stats?.completedBookings || 0} color="#27ae60" />
        <Card icon={FiXCircle} label="Cancelled" value={stats?.cancelledBookings || 0} color="#e74c3c" />
        <Card icon={FiUsers} label="Active Today" value={stats?.todayBookings || 0} color="#9b59b6" />
      </div>

      {/* Recent Bookings */}
      <div className="admin-table-card" style={{ background: 'white', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div className="admin-card-heading" style={{ padding: '20px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>Recent Bookings</h3>
          <Link to="/admin/bookings" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>View All →</Link>
        </div>
        <table className="responsive-table dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              {['Customer', 'Service', 'Date', 'Time', 'Amount', 'Status'].map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((b, i) => (
              <tr key={b._id} style={{ borderTop: '1px solid #f5f5f5', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.customerName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#aaa' }}>{b.customerPhone}</div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: '0.88rem' }}>{b.service?.name}</td>
                <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: '#666' }}>{new Date(b.date).toLocaleDateString('en-IN')}</td>
                <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: '#666' }}>{b.timeSlot}</td>
                <td style={{ padding: '14px 20px', fontSize: '0.88rem', fontWeight: 600 }}>${b.totalAmount}</td>
                <td style={{ padding: '14px 20px' }}><span className={`badge badge-${b.status}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {recentBookings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>No bookings yet</div>
        )}
      </div>
    </div>
  );
}
