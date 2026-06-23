import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    api.get(`/bookings/admin/all?${filter ? `status=${filter}` : ''}&limit=100`)
      .then(r => setBookings(r.data.bookings || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.patch(`/bookings/admin/${id}`, { status });
      toast.success('Status updated');
      fetchBookings();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  const updatePayment = async (id, paymentStatus) => {
    setUpdating(id);
    try {
      await api.patch(`/bookings/admin/${id}`, { paymentStatus });
      toast.success('Payment updated');
      fetchBookings();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  return (
    <div className="admin-content" style={{ padding: '36px' }}>
      <div className="admin-list-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem' }}>Bookings</h2>
        <div className="admin-filter-scroll" style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn btn-sm ${filter === '' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('')}>All</button>
          {STATUSES.map(s => (
            <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="admin-table-card" style={{ background: 'white', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="responsive-table bookings-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  {['Customer', 'Service', 'Date & Time', 'Amount', 'Status', 'Payment', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '13px 18px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b._id} style={{ borderTop: '1px solid #f5f5f5', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '13px 18px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.77rem', color: '#aaa' }}>{b.customerEmail}</div>
                      <div style={{ fontSize: '0.77rem', color: '#aaa' }}>{b.customerPhone}</div>
                    </td>
                    <td style={{ padding: '13px 18px', fontSize: '0.85rem' }}>{b.service?.name}</td>
                    <td style={{ padding: '13px 18px', fontSize: '0.82rem', color: '#666' }}>
                      {new Date(b.date).toLocaleDateString('en-IN')}<br />{b.timeSlot}
                    </td>
                    <td style={{ padding: '13px 18px', fontWeight: 700, fontSize: '0.9rem' }}>${b.totalAmount}</td>
                    <td style={{ padding: '13px 18px' }}>
                      <select
                        value={b.status}
                        onChange={e => updateStatus(b._id, e.target.value)}
                        disabled={updating === b._id}
                        style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <select
                        value={b.paymentStatus}
                        onChange={e => updatePayment(b._id, e.target.value)}
                        disabled={updating === b._id}
                        style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td style={{ padding: '13px 18px' }}>
                      <span className={`badge badge-${b.status}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bookings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#aaa' }}>No bookings found</div>
          )}
        </div>
      )}
    </div>
  );
}
