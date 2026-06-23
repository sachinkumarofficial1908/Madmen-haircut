import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import api, { getErrorMessage } from '../utils/api';
import { useSite } from '../context/SiteContext';

export default function Contact() {
  const { settings } = useSite();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to send message. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const info = [
    { icon: FiMapPin, title: 'Visit Us', lines: [settings.address, `${settings.city} ${settings.postalCode}`] },
    { icon: FiPhone, title: 'Call Us', lines: [settings.phone, 'Available during business hours'] },
    ...(settings.email ? [{ icon: FiMail, title: 'Email Us', lines: [settings.email] }] : []),
    { icon: FiClock, title: 'Working Hours', lines: settings.hours.slice(0, 2).map(item => `${item.day}: ${item.hours}`) },
  ];

  return (
    <>
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #2c2c2c, #444)', padding: '120px 0 70px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(2rem,5vw,3.5rem)' }}>Contact Us</h1>
        <p style={{ color: '#ccc', marginTop: '12px' }}>We'd love to hear from you</p>
      </div>

      <section className="section-pad">
        <div className="container">
          <div className="grid-4 contact-info-grid" style={{ marginBottom: '60px' }}>
            {info.map(({ icon: Icon, title, lines }) => (
              <div key={title} className="card" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={22} color="var(--primary)" />
                </div>
                <h4 style={{ marginBottom: '8px', fontFamily: 'Inter, sans-serif', fontSize: '0.95rem' }}>{title}</h4>
                {lines.map(l => <p key={l} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{l}</p>)}
              </div>
            ))}
          </div>

          <div className="profile-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 50 }}>
            <div className="card" style={{ padding: 26 }}><h3 style={{ marginBottom: 14 }}>Opening hours</h3>{settings.hours.map(item => <div key={item.day} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: '.86rem' }}><span>{item.day}</span><strong>{item.hours}</strong></div>)}</div>
            <div className="card" style={{ padding: 26 }}><h3 style={{ marginBottom: 14 }}>Amenities</h3>{settings.amenities.map(item => <p key={item} style={{ color: 'var(--text-muted)', marginBottom: 9 }}>✓ {item}</p>)}</div>
            <div className="card" style={{ padding: 26 }}><h3 style={{ marginBottom: 14 }}>Payments accepted</h3><p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>{settings.payments.join(' · ')}</p>{settings.mapUrl && <a href={settings.mapUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ marginTop: 20 }}>Get directions</a>}</div>
          </div>

          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div className="card contact-form-card" style={{ padding: '40px' }}>
              <h3 style={{ marginBottom: '24px' }}>Send Us a Message</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Name *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="your@email.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="Mobile number" />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input value={form.subject} onChange={e => set('subject', e.target.value)} required placeholder="How can we help?" />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)} required placeholder="Your message..." rows={5} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', minHeight: '400px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219143770706!2d-73.9819631!3d40.7525446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a704d76b97%3A0x7860bbe22efa3cd2!2s315%20Madison%20Ave%2C%20Suite%20506%2C%20New%20York%2C%20NY%2010017!5e0!3m2!1sen!2sus!4v1620000000000"
                width="100%" height="100%" style={{ border: 0, minHeight: '460px' }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="MadMen Haircuts Location"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
