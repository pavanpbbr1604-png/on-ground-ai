import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Phone, MessageSquare, ChevronDown, ChevronUp, Sparkles, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';

export default function LeadsModal({ leads, selectedLead, onClose, onStartCall }) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!selectedLead) return 0;
    const idx = leads.findIndex(l => l.id === selectedLead.id);
    return idx >= 0 ? idx : 0;
  });

  const [signalsOpen, setSignalsOpen] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!leads || leads.length === 0) return null;

  const lead = leads[currentIndex] || leads[0];

  const handlePrev = () => {
    setCurrentIndex(i => (i > 0 ? i - 1 : leads.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(i => (i < leads.length - 1 ? i + 1 : 0));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', borderRadius: '16px', overflow: 'hidden' }}
      >
        {/* Modal Top Header */}
        <div style={{ padding: '14px 18px', background: '#0a1a14', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700 }}>Lead Dossier</span>
            <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '2px 7px', borderRadius: '10px', color: '#9fe1cb' }}>
              Lead {currentIndex + 1} of {leads.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Paging */}
            <button
              onClick={handlePrev}
              style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '6px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Lead Profile Banner */}
        <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: lead.avatarBg,
              color: lead.avatarColor,
              fontSize: '16px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {lead.initials}
            </div>

            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>
                {lead.name}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                {lead.phone} · {lead.status}
              </div>
            </div>
          </div>

          {/* ICP & Intent Score Badges */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ textAlign: 'center', padding: '6px 10px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f6e56' }} className="tabular">
                {lead.icpScore}
              </div>
              <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                ICP Score
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '6px 10px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#185fa5' }} className="tabular">
                {lead.intentScore}
              </div>
              <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Intent
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div style={{ padding: '16px 20px', maxHeight: '55vh', overflowY: 'auto' }}>
          
          {/* Target Product & Financing */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
              Primary Purchase Objective
            </div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#14532d', marginTop: '2px' }}>
              {lead.product}
            </div>
            <div style={{ fontSize: '12.5px', color: '#15803d', marginTop: '4px' }}>
              <b>Cross-Sell:</b> {lead.crossSell}
            </div>
            <div style={{ fontSize: '12px', color: '#166534', marginTop: '2px' }}>
              <b>EMI Terms:</b> {lead.emi}
            </div>
          </div>

          {/* Collapsible Buying Signals */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
            <div 
              onClick={() => setSignalsOpen(!signalsOpen)}
              style={{
                padding: '10px 14px',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                Collapsible Buying Signals ({lead.signals?.length || 0})
              </span>
              {signalsOpen ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
            </div>

            {signalsOpen && (
              <div style={{ padding: '12px 14px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(lead.signals || []).map((sig, sIdx) => (
                  <div key={sIdx} style={{ fontSize: '13px', lineHeight: 1.45, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#0f6e56',
                      background: '#e1f5ee',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      flexShrink: 0
                    }}>
                      {sig.type}
                    </span>
                    <span style={{ color: '#1e293b' }}>{sig.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Journey / Notes */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', marginBottom: '6px' }}>
              Interaction Journey
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(lead.journey || []).map((j, jIdx) => (
                <div key={jIdx} style={{ fontSize: '12.5px', color: '#475569', display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: 700, color: '#0f6e56' }}>{j.date}:</span>
                  <span>{j.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rep Guidance */}
          <div style={{ background: '#fff8e1', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px', color: '#854d0e', lineHeight: 1.45 }}>
            <b>Avani AI Coaching Note:</b> {lead.notes}
          </div>

        </div>

        {/* Modal Actions */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', background: '#fff' }}>
          <button
            onClick={() => {
              onClose();
              if (onStartCall) onStartCall(lead);
            }}
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', padding: '11px', fontSize: '13.5px' }}
          >
            <Phone size={15} />
            <span>Launch In-App Call</span>
          </button>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '11px 16px' }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
