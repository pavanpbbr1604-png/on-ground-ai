import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, MessageSquare, Check, CheckCheck } from 'lucide-react';

export default function CustomerChat({ customer, onBack, onPlaceCall }) {
  const [messages, setMessages] = useState(customer.messages || []);
  const [inputText, setInputText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `cm-${Date.now()}`,
      sender: 'staff',
      text: inputText.trim(),
      time: 'Just now'
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#efeae2', borderRadius: '14px', border: '1px solid #d1d5db', overflow: 'hidden' }}>
      
      {/* WhatsApp Header */}
      <div style={{
        padding: '12px 16px',
        background: '#075e54',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '2px' }}
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: customer.avatarBg || '#128c7e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13.5px' }}>
            {customer.initials}
          </div>

          <div>
            <div style={{ fontSize: '14.5px', fontWeight: 700 }}>{customer.name}</div>
            <div style={{ fontSize: '11px', color: '#cbe7e2' }}>{customer.status}</div>
          </div>
        </div>

        <button
          onClick={() => onPlaceCall && onPlaceCall({ name: customer.name, phone: customer.phone })}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Phone size={14} />
          <span>Call</span>
        </button>
      </div>

      {/* WhatsApp Messages Scroll */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((m) => {
          const isStaff = m.sender === 'staff';
          const isSystem = m.isSystem;
          const isCall = m.isCall;

          if (isSystem) {
            return (
              <div key={m.id} style={{ alignSelf: 'center', background: '#ffeecd', color: '#634a00', padding: '5px 12px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 600, textAlign: 'center', maxWidth: '85%' }}>
                {m.text}
              </div>
            );
          }

          if (isCall) {
            return (
              <div key={m.id} style={{ alignSelf: 'center', background: '#ffffff', border: '1px solid #d1d5db', color: '#1a1a1a', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color={m.callStatus === 'Answered' ? '#0f6e56' : '#e24b4a'} />
                <span>{m.text} · <b>{m.callStatus}</b> ({m.duration})</span>
              </div>
            );
          }

          return (
            <div
              key={m.id}
              style={{
                alignSelf: isStaff ? 'flex-end' : 'flex-start',
                background: isStaff ? '#dcf8c6' : '#ffffff',
                color: '#1a1a1a',
                padding: '8px 12px',
                borderRadius: '8px',
                maxWidth: '75%',
                fontSize: '13.5px',
                lineHeight: 1.4,
                boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
              }}
            >
              <div>{m.text}</div>
              <div style={{ fontSize: '10px', color: '#888', textAlign: 'right', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px' }}>
                <span>{m.time}</span>
                {isStaff && <CheckCheck size={12} color="#4fc3f7" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} style={{ padding: '10px 14px', background: '#f0f0f0', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a WhatsApp message..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '20px',
            border: 'none',
            outline: 'none',
            fontSize: '13.5px',
            background: '#fff'
          }}
        />
        <button
          type="submit"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#075e54',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Send size={16} />
        </button>
      </form>

    </div>
  );
}
