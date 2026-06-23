import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../utils/api';

const empty = { name: '', category: 'Hair', price: '', duration: '', description: '', image: '' };
const CATS = ['Hair', 'Skin', 'Makeup', 'Nails', 'Spa', 'Waxing', 'Other'];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    api.get('/services').then(r => setServices(r.data.services || [])).finally(() => setLoading(false));
  };
  useEffect(fetch, []);

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = (s) => { setForm({ name: s.name, category: s.category, price: s.price, duration: s.duration, description: s.description, image: s.image }); setEditing(s._id); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/services/${editing}`, form);
        toast.success('Service updated');
      } else {
        await api.post('/services', form);
        toast.success('Service added');
      }
      setModal(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this service?')) return;
    await api.delete(`/services/${id}`);
    toast.success('Service removed');
    fetch();
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="admin-content" style={{ padding: '36px' }}>
      <div className="admin-list-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem' }}>Services</h2>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><FiPlus /> Add Service</button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="admin-table-card" style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <table className="responsive-table services-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa' }}>
                {['Service', 'Category', 'Price', 'Duration', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={s._id} style={{ borderTop: '1px solid #f5f5f5', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={s.image} alt={s.name} style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</div>
                        <div style={{ fontSize: '0.77rem', color: '#aaa' }}>{s.description?.slice(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 18px' }}><span className="badge badge-confirmed">{s.category}</span></td>
                  <td style={{ padding: '13px 18px', fontWeight: 700 }}>${s.price}</td>
                  <td style={{ padding: '13px 18px', color: '#666' }}>{s.duration} min</td>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(s)}><FiEdit2 size={14}/></button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s._id)}><FiTrash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="admin-modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="admin-modal" style={{ background: 'white', borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3>{editing ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}><FiX size={22}/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Service Name *</label><input value={form.name} onChange={e => set('name', e.target.value)} required /></div>
              <div className="grid-2">
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Price ($) *</label><input type="number" value={form.price} onChange={e => set('price', e.target.value)} required min={0} /></div>
                <div className="form-group"><label>Duration (min) *</label><input type="number" value={form.duration} onChange={e => set('duration', e.target.value)} required min={15} /></div>
                <div className="form-group"><label>Image URL</label><input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." /></div>
              </div>
              <div className="form-group"><label>Description *</label><textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={3} /></div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Add Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
