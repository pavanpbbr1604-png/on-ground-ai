import React, { useState, useEffect } from 'react';
import { X, Sparkles, Send, Bot, CheckCircle2, Lightbulb, Zap } from 'lucide-react';

export default function AvaniDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'avani',
      text: 'Good day Arvind! ✨ I\'m **Avani**, your On-Ground sales pitch coach. How can I help you close more retail mattress deals today?',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const promptChips = [
    { label: 'Name the shopper tactic', query: 'Why is naming the shopper important?' },
    { label: 'Counter Wakefit price objection', query: 'Customer says Wakefit is ₹15,000 cheaper' },
    { label: '100-night trial objection', query: 'How does the 100-night trial work?' },
    { label: 'HDFC zero-cost EMI pitch', query: 'Explain 6-month no-cost EMI' }
  ];

  const knowledgeBase = {
    'Why is naming the shopper important?':
      '📊 **On-Ground.ai Floor Insight:** Across 5,000+ analyzed floor conversations, addressing the shopper by their first name (e.g., *"Mukunda, does this firmness support your lower back?"*) yields a **+23.6 percentage-point conversion lift**. It builds instant rapport and psychological ownership.',
    'Customer says Wakefit is ₹15,000 cheaper':
      '💡 **Competitor Counter-Pitch:** Acknowledge first: *"Wakefit uses conventional memory foam which traps body heat and sags over 2-3 years. The Sleep Company uses our patented Japanese SmartGRID with 2,500 air channels that stays cool and isolates motion. At 10 years of warranty, that’s just ₹11 per night for zero back pain."*',
    'How does the 100-night trial work?':
      '🛡️ **Risk Reversal Pitch:** *"You get 100 full nights to sleep on it at home. If you or your spouse don’t experience better spinal alignment, we arrange 100% free doorstep pickup and full refund with no return fee. There is zero risk for you."*',
    'Explain 6-month no-cost EMI':
      '💳 **Financing Pitch:** *"On HDFC and ICICI cards, our 6-month zero-cost EMI breaks ₹42,000 down into just ₹7,000/month with zero interest and zero processing fees. Would you like me to reserve the promo code?"*'
  };

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      from: 'user',
      text: query,
      time: 'Just now'
    };

    const answer = knowledgeBase[query] || 
      `💡 **Avani Advice:** For ${query}, focus on needs discovery first. Never jump straight to discount. Probe on pain points (lower back vs neck), explain the SmartGRID pressure relief layer, and propose the 6-month zero-cost EMI option.`;

    const avaniMsg = {
      id: Date.now() + 1,
      from: 'avani',
      text: answer,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg, avaniMsg]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{ justifyContent: 'flex-end', padding: 0 }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100vh',
          background: '#fff',
          boxShadow: '-4px 0 25px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s ease-out'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #123c30 0%, #0f4d3a 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800 }}>Avani AI · Pitch Coach</div>
              <div style={{ fontSize: '11px', color: '#9fe1cb' }}>On-Ground.ai Retail Copilot</div>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Prompt Chips */}
        <div style={{ padding: '12px 14px', background: '#faf8ff', borderBottom: '1px solid #ece2fb' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Lightbulb size={13} />
            <span>Instant Objection Coaching</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#4c1d95',
                  background: '#fff',
                  border: '1px solid #d8b4fe',
                  borderRadius: '16px',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f3e8ff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Feed */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc' }}>
          {messages.map((m) => {
            const isAvani = m.from === 'avani';
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isAvani ? 'flex-start' : 'flex-end',
                  maxWidth: '90%',
                  background: isAvani ? '#ffffff' : '#0f6e56',
                  color: isAvani ? '#1e293b' : '#ffffff',
                  padding: '11px 14px',
                  borderRadius: isAvani ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  border: isAvani ? '1px solid #e2e8f0' : 'none'
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                <div style={{ fontSize: '10px', color: isAvani ? '#94a3b8' : '#a7f3d0', marginTop: '4px', textAlign: 'right' }}>
                  {m.time}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid #e2e8f0', background: '#fff', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Avani about objections, EMI, products..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSend()}
            style={{
              background: '#0f6e56',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '0 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
