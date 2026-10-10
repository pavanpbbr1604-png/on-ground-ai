import React from 'react';
import { PhoneOutgoing, PhoneIncoming, Clock, Award, ChevronRight, CheckCircle2 } from 'lucide-react';
import { RECENT_CALLS } from '../../data/callsData';

export default function RecentCalls({ onSelectCallForReview }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>Recent Calls Log</div>
          <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>
            Tap any call to inspect conversation SOP compliance & evidence
          </div>
        </div>
        <span style={{ fontSize: '12px', color: '#6b6b74', fontWeight: 600 }}>
          {RECENT_CALLS.length} calls logged today
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {RECENT_CALLS.map((call) => {
          const passCount = call.sopReview ? call.sopReview.filter(r => r.pass).length : 0;
          const totalSteps = call.sopReview ? call.sopReview.length : 6;
          const isHighAdherence = passCount >= 4;

          return (
            <div
              key={call.id}
              onClick={() => onSelectCallForReview(call)}
              style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #eceff4',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cadfd8'; e.currentTarget.style.background = '#fafdfc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#eceff4'; e.currentTarget.style.background = '#fff'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: call.type.includes('Outgoing') ? '#e1f5ee' : '#e8f0fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {call.type.includes('Outgoing') ? (
                    <PhoneOutgoing size={17} color="#0f6e56" />
                  ) : (
                    <PhoneIncoming size={17} color="#185fa5" />
                  )}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1a1a1a' }}>
                    {call.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>
                    {call.time} · Duration: <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{call.duration}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                {/* SOP Pass Rate Tag */}
                <div style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: isHighAdherence ? '#0f6e56' : '#c8860a',
                  background: isHighAdherence ? '#eefaf5' : '#fff8e1',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  {passCount}/{totalSteps} SOP
                </div>

                {/* Outcome Badge */}
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: call.outcomeColor,
                  background: call.outcomeBg,
                  padding: '4px 10px',
                  borderRadius: '16px'
                }}>
                  {call.outcome}
                </div>

                <ChevronRight size={16} color="#8e8e93" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
