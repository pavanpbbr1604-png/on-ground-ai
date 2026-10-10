import React from 'react';
import { PhoneMissed, Phone, AlertCircle, TrendingUp } from 'lucide-react';
import { INCOMING_CALLS } from '../../data/callsData';

export default function IncomingCalls({ onPlaceCall }) {
  const totalValue = INCOMING_CALLS.reduce((acc, c) => acc + (c.expectedValue || 0), 0);

  return (
    <div>
      {/* Value at Stake Summary Banner */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #eceff4',
        padding: '14px 18px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#e24b4a' }} className="tabular">
            {INCOMING_CALLS.length}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase' }}>
            Missed Today
          </div>
        </div>

        <div style={{ width: '1px', height: '28px', background: '#ece7fa' }} />

        <div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f6e56' }} className="tabular">
            ₹{totalValue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase' }}>
            Expected Value at Stake
          </div>
        </div>
      </div>

      {/* Missed Calls List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {INCOMING_CALLS.map((call) => (
          <div
            key={call.id}
            style={{
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #eceff4',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#fdecec',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <PhoneMissed size={18} color="#e24b4a" />
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1a1a1a' }}>
                  {call.name}
                </div>
                <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>
                  Missed {call.time} · <span style={{ color: '#0f6e56', fontWeight: 600 }}>{call.signalTag}</span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#6b6b74', marginTop: '1px' }}>
                  {call.product}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f6e56' }} className="tabular">
                ₹{call.expectedValue.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '10.5px', color: '#8e8e93', marginBottom: '6px' }}>
                expected
              </div>

              <button
                onClick={() => onPlaceCall({ name: call.name, phone: call.phone, interest: call.product })}
                style={{
                  background: '#0f6e56',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '5px 11px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Phone size={12} />
                <span>Call back</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
