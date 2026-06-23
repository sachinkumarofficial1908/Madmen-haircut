import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiCheck } from 'react-icons/fi';
import api, { getErrorMessage } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';

export default function Booking() {
  const [params] = useSearchParams();
  const { user } = useAuth();
  const { settings } = useSite();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [team, setTeam] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [bookedRef, setBookedRef] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    serviceId: params.get('service') || '',
    stylistId: '',
    date: '',
    timeSlot: '',
    notes: '',
  });

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.services || []));
    api.get('/team').then(r => setTeam(r.data.team || []));
  }, []);

  useEffect(() => {
    if (!form.date) return;
    setSlotsLoading(true);
    api.get(`/bookings/slots?date=${form.date}`)
      .then(r => setSlots(r.data.slots || []))
      .finally(() => setSlotsLoading(false));
  }, [form.date]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectedService = services.find(s => s._id === form.serviceId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.serviceId) return toast.error('Please select a service');
    if (!form.date) return toast.error('Please select a date');
    if (!form.timeSlot) return toast.error('Please select a time slot');

    setLoading(true);
    try {
      const { data } = await api.post('/bookings', form);
      setBookedRef(data.booking);
      setDone(true);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Booking failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (done && bookedRef) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', paddingTop: '80px' }}>
        <div className="booking-success-card" style={{ background: 'white', borderRadius: '20px', padding: '50px', textAlign: 'center', maxWidth: '500px', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#d4edda', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FiCheck size={32} color="#28a745" />
          </div>
          <h2 style={{ color: 'var(--secondary)', marginBottom: '10px' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Your appointment has been received. We'll confirm it shortly.
          </p>
          <div style={{ background: 'var(--bg)', borderRadius: '12px', padding: '20px', textAlign: 'left', marginBottom: '28px' }}>
            {[
              ['Service', bookedRef.service?.name],
              ['Date', new Date(bookedRef.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
              ['Time', bookedRef.timeSlot],
              ['Amount', `$${bookedRef.totalAmount}`],
              ['Status', bookedRef.status],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{v}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => { setDone(false); setForm({ customerName: user?.name||'', customerEmail: user?.email||'', customerPhone: user?.phone||'', serviceId: '', stylistId: '', date: '', timeSlot: '', notes: '' }); }}>
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #2c2c2c, #444)', padding: '120px 0 70px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: 'clamp(2rem,5vw,3.5rem)' }}>Book an Appointment</h1>
        <p style={{ color: '#ccc', marginTop: '12px' }}>Choose your service, date and time</p>
      </div>

      <section className="section-pad">
        <div className="container">
          <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
            {/* FORM */}
            <form onSubmit={handleSubmit}>
              <div className="card booking-form-card" style={{ padding: '36px' }}>
                <h3 style={{ marginBottom: '28px', fontSize: '1.3rem' }}>Your Details</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input value={form.customerName} onChange={e => set('customerName', e.target.value)} required placeholder="Your full name" />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" value={form.customerEmail} onChange={e => set('customerEmail', e.target.value)} required placeholder="your@email.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="tel" value={form.customerPhone} onChange={e => set('customerPhone', e.target.value)} required placeholder="Phone number" />
                  </div>
                  <div className="form-group">
                    <label>Service *</label>
                    <select value={form.serviceId} onChange={e => set('serviceId', e.target.value)} required>
                      <option value="">Select a service</option>
                      {services.map(s => (
                        <option key={s._id} value={s._id}>{s.name} — ${s.price} ({s.duration} min)</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Preferred Stylist</label>
                    <select value={form.stylistId} onChange={e => set('stylistId', e.target.value)}>
                      <option value="">No preference</option>
                      {team.map(m => <option key={m._id} value={m._id}>{m.name} — {m.role}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label><FiCalendar style={{ marginRight: '5px' }} />Date *</label>
                    <input type="date" value={form.date} min={today} onChange={e => { set('date', e.target.value); set('timeSlot', ''); }} required />
                  </div>
                </div>

                {/* TIME SLOTS */}
                {form.date && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.88rem', fontWeight: 500 }}>
                      <FiClock style={{ marginRight: '5px' }} />Select Time Slot *
                    </label>
                    {slotsLoading ? <div className="spinner" style={{ margin: '20px auto', width: '28px', height: '28px' }} /> : (
                      slots.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No slots available for this date. Please choose another date.</p>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {slots.map(slot => (
                            <button key={slot} type="button"
                              className={`btn btn-sm ${form.timeSlot === slot ? 'btn-primary' : 'btn-outline'}`}
                              onClick={() => set('timeSlot', slot)}
                            >{slot}</button>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any special requirements or notes..." rows={3} />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '15px' }}>
                  {loading ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>

            {/* SUMMARY */}
            <div>
                <div className="card booking-summary-card" style={{ padding: '28px', position: 'sticky', top: '90px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Booking Summary</h3>
                {selectedService ? (
                  <>
                    <img src={selectedService.image} alt={selectedService.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', marginBottom: '18px' }} />
                    <h4 style={{ marginBottom: '6px' }}>{selectedService.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>{selectedService.description}</p>
                    {[
                      ['Duration', `${selectedService.duration} min`],
                      ['Date', form.date ? new Date(form.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'],
                      ['Time', form.timeSlot || '—'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.88rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                        <span style={{ fontWeight: 500 }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', fontWeight: 700, fontSize: '1.1rem' }}>
                      <span>Total</span>
                      <span style={{ color: 'var(--primary)' }}>${selectedService.price}</span>
                    </div>
                  </>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '30px 0' }}>
                    Select a service to see summary
                  </p>
                )}
              </div>

              <div className="card" style={{ padding: '22px', marginTop: '20px', background: 'var(--bg-dark)', boxShadow: 'none' }}>
                <div style={{ fontWeight: 600, marginBottom: '10px', fontSize: '0.9rem' }}>Salon Location</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{settings.address}, {settings.city} {settings.postalCode}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{settings.phone}</p>
                <a href={settings.mapUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8, color: 'var(--primary)', fontWeight: 600, fontSize: '.85rem' }}>Get directions</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
