import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../utils/api';
import { useSite } from '../../context/SiteContext';

const empty = { name: '', category: '', tagline: '', description: '', phone: '', email: '', address: '', city: '', postalCode: '', mapUrl: '', rating: 0, reviewCount: 0, heroImage: '', aboutImage: '', instagramUrl: '', facebookUrl: '', hours: [] };

export default function AdminSettings() {
  const { settings, refreshSettings } = useSite();
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setForm({ ...empty, ...settings, hours: settings.hours || [] }); }, [settings]);
  const set = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const setHours = (index, value) => setForm(current => ({ ...current, hours: current.hours.map((entry, i) => i === index ? { ...entry, hours: value } : entry) }));

  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      await api.put('/settings', form);
      await refreshSettings();
      toast.success('Business details updated');
    } catch (error) { toast.error(getErrorMessage(error, 'Could not update business details.')); }
    finally { setSaving(false); }
  };

  return (
    <div className="admin-page">
      <div className="admin-heading"><div><span>Website content</span><h2>Business Settings</h2></div><button form="settings-form" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></div>
      <form id="settings-form" onSubmit={submit} className="admin-panel settings-form">
        <div className="grid-2">
          <div className="form-group"><label>Business name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} /></div>
          <div className="form-group"><label>Category</label><input value={form.category} onChange={e => set('category', e.target.value)} /></div>
        </div>
        <div className="form-group"><label>Tagline</label><input value={form.tagline} maxLength={180} onChange={e => set('tagline', e.target.value)} /></div>
        <div className="form-group"><label>About the business</label><textarea value={form.description} maxLength={2000} rows={5} onChange={e => set('description', e.target.value)} /></div>
        <div className="grid-2">
          <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
          <div className="form-group"><label>Email (optional)</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
          <div className="form-group"><label>Street address</label><input value={form.address} onChange={e => set('address', e.target.value)} /></div>
          <div className="form-group"><label>City / State</label><input value={form.city} onChange={e => set('city', e.target.value)} /></div>
          <div className="form-group"><label>ZIP code</label><input value={form.postalCode} onChange={e => set('postalCode', e.target.value)} /></div>
          <div className="form-group"><label>Google Maps directions URL</label><input type="url" value={form.mapUrl} onChange={e => set('mapUrl', e.target.value)} /></div>
          <div className="form-group"><label>Google rating</label><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => set('rating', Number(e.target.value))} /></div>
          <div className="form-group"><label>Review count</label><input type="number" min="0" value={form.reviewCount} onChange={e => set('reviewCount', Number(e.target.value))} /></div>
          <div className="form-group"><label>Hero image URL</label><input type="url" value={form.heroImage} onChange={e => set('heroImage', e.target.value)} /></div>
          <div className="form-group"><label>About image URL</label><input type="url" value={form.aboutImage} onChange={e => set('aboutImage', e.target.value)} /></div>
        </div>
        <h3 className="settings-subtitle">Opening hours</h3>
        <div className="hours-editor">{form.hours.map((entry, index) => <div key={entry.day} className="hours-row"><strong>{entry.day}</strong><input value={entry.hours} onChange={e => setHours(index, e.target.value)} /></div>)}</div>
      </form>
    </div>
  );
}
