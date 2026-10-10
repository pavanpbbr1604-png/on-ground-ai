import React from 'react';
import { X, CheckCircle2, XCircle, Award, Quote, Clock, Phone } from 'lucide-react';

export default function SopReviewModal({ call, onClose }) {
  if (!call) return null;

  const passedCount = call.sopReview.filter(r => r.pass).length;
  const scorePercent = Math.round((passedCount / call.sopReview.length) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        
        {/* Modal Header */}
        <div style={{ padding: '16px 20px', background: '#0a1a14', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>
              Sales SOP Review · {call.name}
            </div>
            <div style={{ fontSize: '12px', color: '#9fe1cb', marginTop: '2px' }}>
              {call.type} · {call.time} · Duration: {call.duration}
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Score & Summary Banner */}
        <div style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              SOP Compliance Score
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: scorePercent >= 70 ? '#0f6e56' : '#c8860a', marginTop: '2px' }}>
              {scorePercent}% ({passedCount}/{call.sopReview.length} steps satisfied)
            </div>
          </div>

          <div style={{
            background: call.outcomeBg,
            color: call.outcomeColor,
            fontWeight: 700,
            fontSize: '12.5px',
            padding: '6px 12px',
            borderRadius: '20px'
          }}>
            Outcome: {call.outcome}
          </div>
        </div>

        {/* 6 SOP Steps with Evidence Quotes */}
        <div style={{ padding: '16px 20px', maxHeight: '55vh', overflowY: 'auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '10px' }}>
            Checklist & Verbatim Transcript Evidence
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {call.sopReview.map((item, idx) => (
              <div 
                key={idx}
                style={{
                  background: item.pass ? '#fafffd' : '#fffbfa',
                  border: item.pass ? '1px solid #cce8de' : '1px solid #fbdad8',
                  borderRadius: '10px',
                  padding: '12px 14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.pass ? (
                      <CheckCircle2 size={18} color="#0f6e56" />
                    ) : (
                      <XCircle size={18} color="#e24b4a" />
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>
                      {item.label}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: item.pass ? '#e1f5ee' : '#fdecec',
                    color: item.pass ? '#0f6e56' : '#e24b4a'
                  }}>
                    {item.pass ? 'PASS' : 'MISSED'}
                  </span>
                </div>

                <div style={{
                  marginTop: '8px',
                  fontSize: '12.5px',
                  color: item.pass ? '#2d4b41' : '#733230',
                  lineHeight: 1.45,
                  padding: '7px 10px',
                  borderRadius: '6px',
                  background: item.pass ? '#ffffff' : '#ffffff',
                  border: '1px solid rgba(0,0,0,0.06)',
                  fontStyle: 'italic',
                  display: 'flex',
                  gap: '6px'
                }}>
                  <Quote size={14} style={{ flexShrink: 0, opacity: 0.5, marginTop: '2px' }} />
                  <span>{item.evidence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #e5e5ea', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#fff' }}>
          <button 
            className="btn-secondary"
            onClick={onClose}
          >
            Close Review
          </button>
        </div>

      </div>
    </div>
  );
}
