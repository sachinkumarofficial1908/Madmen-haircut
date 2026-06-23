import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../utils/api';

const empty = { name: '', role: '', experience: '', bio: '', image: '' };

export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = () => { setLoading(true); api.get('/team').then(r => setTeam(r.data.team || [])).finally(() => setLoading(false)); };
  useEffect(fetch, []);

  const openAdd = () => { setForm(empty); setEditing(null); setModal(true); };
  const openEdit = (m) => { setForm({ name: m.name, role: m.role, experience: m.experience, bio: m.bio, image: m.image }); setEditing(m._id); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      editing ? await api.put(`/team/${editing}`, form) : await api.post('/team', form);
      toast.success(editing ? 'Member updated' : 'Member added');
      setModal(false); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="admin-content" style={{ padding: '36px' }}>
      <div className="admin-list-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem' }}>Team Members</h2>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><FiPlus /> Add Member</button>
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="grid-4">
          {team.map(m => (
            <div key={m._id} style={{ background: 'white', borderRadius: '14px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <img src={m.image || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100'} alt={m.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px', border: '3px solid var(--primary-light)' }} />
              <h4 style={{ marginBottom: '4px', fontSize: '0.95rem' }}>{m.name}</h4>
              <div style={{ color: 'var(--primary)', fontSize: '0.8rem', marginBottom: '8px' }}>{m.role}</div>
              <div style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: '16px' }}>{m.experience} yrs exp</div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button className="btn btn-sm btn-outline" onClick={() => openEdit(m)}><FiEdit2 size={13}/></button>
                <button className="btn btn-sm btn-danger" onClick={async () => { if(window.confirm('Remove?')) { await api.delete(`/team/${m._id}`); toast.success('Removed'); fetch(); } }}><FiTrash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="admin-modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="admin-modal" style={{ background: 'white', borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3>{editing ? 'Edit Member' : 'Add Team Member'}</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><FiX size={22}/></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group"><label>Name *</label><input value={form.name} onChange={e => set('name', e.target.value)} required /></div>
              <div className="form-group"><label>Role *</label><input value={form.role} onChange={e => set('role', e.target.value)} required placeholder="e.g. Senior Hair Stylist" /></div>
              <div className="form-group"><label>Experience (years)</label><input type="number" value={form.experience} onChange={e => set('experience', e.target.value)} min={0} /></div>
              <div className="form-group"><label>Photo URL</label><input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." /></div>
              <div className="form-group"><label>Bio</label><textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} /></div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
