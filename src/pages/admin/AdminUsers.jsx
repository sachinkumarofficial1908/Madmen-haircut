import { useEffect, useState } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/users').then(r => setUsers(r.data.users || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleStatus = async (user) => {
    try {
      await api.patch(`/users/${user._id}/status`, { isActive: !user.isActive });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
      load();
    } catch (_) { toast.error('Could not update user status'); }
  };

  return (
    <div className="admin-content" style={{ padding: '36px' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '28px' }}>
        Users ({users.length})
      </h2>
      {loading ? <div className="spinner" /> : (
        <div className="admin-table-card" style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <table className="responsive-table users-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Name', 'Email', 'Phone', 'Joined', 'Status', 'Action'].map(h => (
                  <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} style={{ borderTop: '1px solid #f5f5f5', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '13px 20px', fontWeight: 600, fontSize: '0.9rem' }}>{u.name}</td>
                  <td style={{ padding: '13px 20px', fontSize: '0.85rem', color: '#666' }}>{u.email}</td>
                  <td style={{ padding: '13px 20px', fontSize: '0.85rem', color: '#666' }}>{u.phone}</td>
                  <td style={{ padding: '13px 20px', fontSize: '0.82rem', color: '#aaa' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '13px 20px' }}>
                    <span className={`badge ${u.isActive ? 'badge-completed' : 'badge-cancelled'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td style={{ padding: '13px 20px' }}><button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleStatus(u)}>{u.isActive ? 'Deactivate' : 'Activate'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>No users registered yet</div>}
        </div>
      )}
    </div>
  );
}
