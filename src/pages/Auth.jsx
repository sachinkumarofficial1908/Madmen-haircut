import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useSite } from '../context/SiteContext';
import { getErrorMessage } from '../utils/api';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { settings } = useSite();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', paddingTop: '80px' }}>
      <div className="card auth-card" style={{ padding: '48px', width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--secondary)', marginBottom: '6px' }}>
            <span style={{ color: 'var(--primary)' }}>✂</span> {settings.name}
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { settings } = useSite();
  const navigate = useNavigate();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success(`Account created! Welcome to ${settings.name}.`);
      navigate('/');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '100px 20px 40px' }}>
      <div className="card auth-card" style={{ padding: '48px', width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--secondary)', marginBottom: '6px' }}>
            <span style={{ color: 'var(--primary)' }}>✂</span> {settings.name}
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>Create Account</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Your full name" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} required placeholder="Phone number" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} required placeholder="10+ chars, upper/lowercase and number" minLength={10} maxLength={72} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} required placeholder="Repeat password" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '6px' }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
