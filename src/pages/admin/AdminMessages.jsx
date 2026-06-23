import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import api from '../../utils/api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetch = () => { setLoading(true); api.get('/contacts').then(r => setMessages(r.data.contacts || [])).finally(() => setLoading(false)); };
  useEffect(fetch, []);

  const markRead = async (id) => {
    await api.patch(`/contacts/${id}/read`);
    toast.success('Marked as read');
    fetch();
  };

  return (
    <div className="admin-content admin-messages" style={{ padding: '36px' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '28px' }}>
        Messages ({messages.filter(m => !m.isRead).length} unread)
      </h2>
      {loading ? <div className="spinner" /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map(m => (
            <div key={m._id} className="message-card" style={{
              background: m.isRead ? 'white' : '#fffbf0',
              borderRadius: '12px', padding: '20px', cursor: 'pointer',
              border: m.isRead ? '1px solid #f0f0f0' : '1px solid var(--primary-light)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }} onClick={() => setExpanded(expanded === m._id ? null : m._id)}>
              <div className="message-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="message-sender" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <FiMail color={m.isRead ? '#aaa' : 'var(--primary)'} size={18} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{m.name} <span style={{ fontWeight: 400, color: '#aaa' }}>— {m.email}</span></div>
                    <div style={{ fontSize: '0.82rem', color: '#666' }}>{m.subject}</div>
                  </div>
                </div>
                <div className="message-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#aaa' }}>{new Date(m.createdAt).toLocaleDateString('en-IN')}</span>
                  {!m.isRead && (
                    <button className="btn btn-sm btn-success" onClick={e => { e.stopPropagation(); markRead(m._id); }}>
                      <FiCheckCircle size={13}/> Mark Read
                    </button>
                  )}
                </div>
              </div>
              {expanded === m._id && (
                <div style={{ marginTop: '14px', padding: '14px', background: '#f9f9f9', borderRadius: '8px', fontSize: '0.88rem', color: '#444', lineHeight: 1.7 }}>
                  <strong>Phone:</strong> {m.phone || 'N/A'}<br />
                  <strong>Message:</strong><br />{m.message}
                </div>
              )}
            </div>
          ))}
          {messages.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>No messages yet</div>}
        </div>
      )}
    </div>
  );
}
