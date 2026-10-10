import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, Sparkles, CheckCircle2, ShieldCheck, Send, MessageSquare, Clock, AlertCircle, Zap } from 'lucide-react';
import { SOP_ITEMS, LIVE_SIMULATION_TRANSCRIPT, AI_QUICK_REPLIES } from '../../data/callsData';
import { soundFX } from '../../utils/audio';

export default function LiveCallModal({ lead, onClose, onCallCompleted }) {
  const [callDuration, setCallDuration] = useState(0);
  const [transcriptIndex, setTranscriptIndex] = useState(2);
  const [sopChecked, setSopChecked] = useState([true, true, false, false, false, false]);
  const [showWrapup, setShowWrapup] = useState(false);
  const [wrapupOutcome, setWrapupOutcome] = useState('interested');
  const [wrapupSummary, setWrapupSummary] = useState('');

  // Audio start tone & connect chime
  useEffect(() => {
    soundFX.playRingTone();
    const connectTimer = setTimeout(() => {
      soundFX.playConnectChime();
    }, 1200);
    return () => clearTimeout(connectTimer);
  }, []);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate streaming transcript conversation over time
  useEffect(() => {
    if (transcriptIndex < LIVE_SIMULATION_TRANSCRIPT.length) {
      const stepTimer = setTimeout(() => {
        setTranscriptIndex(idx => {
          const next = idx + 1;
          // Progressively check SOP items as transcript advances
          if (next >= 4) setSopChecked(s => [true, true, true, false, false, false]);
          if (next >= 7) setSopChecked(s => [true, true, true, true, false, false]);
          if (next >= 9) setSopChecked(s => [true, true, true, true, true, false]);
          if (next >= 10) setSopChecked(s => [true, true, true, true, true, true]);
          return next;
        });
      }, 4000);
      return () => clearTimeout(stepTimer);
    }
  }, [transcriptIndex]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleEndCall = () => {
    setShowWrapup(true);
    setWrapupSummary(
      `Spoke with ${lead.name || 'customer'} regarding ${lead.product || 'Ortho GRID'}. Discussed spine relief, addressed pricing objection with 6-month zero-cost EMI, and highlighted 100-night trial. Customer requested quote via WhatsApp.`
    );
  };

  const handleSaveWrapup = () => {
    const newCompletedCall = {
      id: `rec-${Date.now()}`,
      name: lead.name || 'Caller',
      type: 'Outgoing Call',
      time: 'Just now',
      duration: formatTime(callDuration),
      outcome: wrapupOutcome === 'interested' ? 'Interested' : wrapupOutcome === 'callback' ? 'Requested callback' : 'Follow-up needed',
      outcomeColor: wrapupOutcome === 'interested' ? '#0f6e56' : '#185fa5',
      outcomeBg: wrapupOutcome === 'interested' ? '#e1f5ee' : '#e8f0fe',
      leadId: lead.id,
      sopReview: SOP_ITEMS.map((item, idx) => ({
        pass: sopChecked[idx] || idx < 4,
        label: item.label,
        evidence: `Verified during live interaction: "${LIVE_SIMULATION_TRANSCRIPT[idx]?.text || 'Checked'}"`
      }))
    };

    if (onCallCompleted) onCallCompleted(newCompletedCall);
    onClose();
  };

  const activeTranscript = LIVE_SIMULATION_TRANSCRIPT.slice(0, transcriptIndex);

  return (
    <div className="modal-overlay" style={{ padding: '10px' }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '960px', 
          height: '88vh', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        
        {/* Top Active Call Bar */}
        <div style={{
          padding: '12px 20px',
          background: '#0a1a14',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 10px #22c55e'
            }} />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800 }}>
                Live Call: {lead.name || 'Prospect Customer'}
              </div>
              <div style={{ fontSize: '12px', color: '#9fe1cb' }}>
                {lead.phone || '+91 98765 43210'} · Retail Mattress Campaign
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 800, color: '#fff' }} className="tabular">
              <Clock size={16} color="#5dcaa5" />
              <span>{formatTime(callDuration)}</span>
            </div>

            <button
              onClick={handleEndCall}
              style={{
                background: '#e24b4a',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <PhoneOff size={15} />
              <span>End Call</span>
            </button>
          </div>
        </div>

        {/* In-Call Body: Split Screen (Left: Transcript, Right: AI Assist) */}
        {!showWrapup ? (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(300px, 1fr)', overflow: 'hidden' }}>
            
            {/* Left: Streaming Speech-To-Text Transcript */}
            <div style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ padding: '10px 16px', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 800, color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                <span>LIVE CALL TRANSCRIPT (SPEECH-TO-TEXT)</span>
                <span style={{ color: '#0f6e56' }}>● Streaming Live</span>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeTranscript.map((t, idx) => {
                  const isStaff = t.speaker === 'staff';
                  return (
                    <div 
                      key={idx}
                      style={{
                        alignSelf: isStaff ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background: isStaff ? '#e1f5ee' : '#ffffff',
                        border: isStaff ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                        borderRadius: isStaff ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        padding: '9px 13px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: isStaff ? '#0f6e56' : '#1e293b' }}>
                          {isStaff ? 'Arvind (You)' : lead.name}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>{t.time}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#0f172a', lineHeight: 1.45 }}>
                        {t.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: AI Assist & Sales SOP Checklist */}
            <div style={{ background: '#ffffff', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
              
              {/* Objective Banner */}
              <div style={{ padding: '14px 16px', background: '#faf8ff', borderBottom: '1px solid #ece2fb' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#6b21a8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={13} />
                  <span>What To Sell On This Call</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e1b4b', marginTop: '2px' }}>
                  {lead.product || 'Ortho GRID Pro Mattress'}
                </div>
                <div style={{ fontSize: '12px', color: '#581c87', marginTop: '2px' }}>
                  Cross-sell: Luxe Pillow pair · 6M No-cost EMI
                </div>
              </div>

              {/* On-Ground.ai Proven Conversion Rule (+23.6pp Lift) */}
              <div style={{ padding: '10px 14px', background: '#eefaf5', borderBottom: '1px solid #cce8de', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Zap size={16} color="#0f6e56" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f6e56', textTransform: 'uppercase' }}>
                    +23.6pp Conversion Rule · Floor AI Insight
                  </div>
                  <div style={{ fontSize: '12px', color: '#134e4a', marginTop: '1px', lineHeight: 1.4 }}>
                    Address shopper directly as <b>"{lead.name?.split(' ')[0] || 'the shopper'}"</b> in your needs discovery question to build psychological ownership.
                  </div>
                </div>
              </div>

              {/* Dynamic SOP Checklist */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Live SOP Compliance (Fills As You Speak)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {SOP_ITEMS.map((item, idx) => {
                    const isChecked = sopChecked[idx];
                    return (
                      <div 
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          background: isChecked ? '#f0fdf4' : '#f8fafc',
                          border: isChecked ? '1px solid #bbf7d0' : '1px solid #f1f5f9',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <CheckCircle2 size={16} color={isChecked ? '#0f6e56' : '#cbd5e1'} />
                        <span style={{ fontSize: '12.5px', fontWeight: isChecked ? 700 : 500, color: isChecked ? '#14532d' : '#64748b' }}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instant AI Suggested Quick Replies */}
              <div style={{ padding: '14px 16px', flex: 1 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Ask AI & One-Click Nudges
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {AI_QUICK_REPLIES.map((reply, rIdx) => (
                    <button
                      key={rIdx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '8px 10px',
                        textAlign: 'left',
                        fontSize: '12.5px',
                        color: '#1e293b',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0f6e56'; e.currentTarget.style.background = '#f0fdf4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                    >
                      <span>{reply}</span>
                      <Send size={13} color="#0f6e56" />
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Post-Call Wrap-up Screen */
          <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a' }}>
              Call Wrap-Up · Log Outcome
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Summary auto-drafted by AI Assist based on the live call transcript
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                Outcome Tag
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                {[
                  { key: 'interested', label: 'Interested', color: '#0f6e56', bg: '#e1f5ee' },
                  { key: 'callback', label: 'Requested Callback', color: '#185fa5', bg: '#e8f0fe' },
                  { key: 'followup', label: 'Follow-Up Needed', color: '#c8860a', bg: '#fff3d6' },
                  { key: 'notinterested', label: 'Not Interested', color: '#e24b4a', bg: '#fdecec' }
                ].map(o => (
                  <button
                    key={o.key}
                    onClick={() => setWrapupOutcome(o.key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: wrapupOutcome === o.key ? `2px solid ${o.color}` : '1.5px solid #e2e8f0',
                      background: wrapupOutcome === o.key ? o.bg : '#fff',
                      color: wrapupOutcome === o.key ? o.color : '#64748b'
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                AI-Drafted Notes & Call Summary
              </label>
              <textarea
                value={wrapupSummary}
                onChange={(e) => setWrapupSummary(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={onClose} className="btn-secondary">
                Discard
              </button>
              <button onClick={handleSaveWrapup} className="btn-primary" style={{ padding: '10px 18px' }}>
                Save Wrap-Up & Return to Shift
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
