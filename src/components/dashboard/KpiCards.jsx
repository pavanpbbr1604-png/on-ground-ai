import React from 'react';
import { TrendingUp, Users, Clock, Award, PhoneIncoming } from 'lucide-react';
import { CALL_QUEUE_NOW } from '../../data/callsData';

export default function KpiCards({ leads = [], onSwitchToPlan }) {
  const totalValue = leads.reduce((acc, l) => acc + (l.expectedValue || 0), 0);
  const formattedValue = totalValue >= 100000 
    ? `₹${(totalValue / 100000).toFixed(2)}L` 
    : `₹${totalValue.toLocaleString('en-IN')}`;

  const levelColor = { hi: '#e24b4a', mid: '#c8860a', lo: '#0f6e56' };
  const levelBg = { hi: '#fdecec', mid: '#fff3d6', lo: '#e1f5ee' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '18px' }}>
      
      {/* 1. Today's Revenue Pipeline & OG Score Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f4d3a 0%, #123c30 100%)',
        borderRadius: '14px',
        padding: '16px 18px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 14px rgba(15, 77, 58, 0.25)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#9fe1cb', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Pipeline at Stake Today
          </span>
          <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '12px', color: '#fff', fontWeight: 600 }}>
            {leads.length} Active Leads
          </span>
        </div>

        <div style={{ margin: '12px 0 8px' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }} className="tabular">
            {formattedValue}
          </div>
          <div style={{ fontSize: '12.5px', color: '#9fe1cb', marginTop: '2px' }}>
            Potential closure across assigned high-intent retail shoppers
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFD700' }} className="tabular">+84 pts</div>
            <div style={{ fontSize: '11px', color: '#9fe1cb' }}>OG Score™ gain</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }} className="tabular">94%</div>
            <div style={{ fontSize: '11px', color: '#9fe1cb' }}>SOP Compliance</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#5dcaa5' }} className="tabular">#1</div>
            <div style={{ fontSize: '11px', color: '#9fe1cb' }}>Store Rank</div>
          </div>
        </div>
      </div>

      {/* 2. Who is Waiting in Queue Right Now */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} color="#185fa5" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a' }}>Live Calling Queue</div>
              <div style={{ fontSize: '11.5px', color: '#8e8e93' }}>Callers awaiting pickup right now</div>
            </div>
          </div>
          <button 
            className="btn-secondary" 
            style={{ padding: '4px 9px', fontSize: '12px' }}
            onClick={onSwitchToPlan}
          >
            Open Dialer
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CALL_QUEUE_NOW.map((q, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 10px',
              borderRadius: '9px',
              background: '#fbfcfe',
              border: '1px solid #eceff4'
            }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a1a' }}>{q.name}</div>
                <div style={{ fontSize: '11.5px', color: '#8e8e93', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {q.intent}
                </div>
              </div>
              <span style={{
                fontSize: '11.5px',
                fontWeight: 800,
                color: levelColor[q.waitLevel],
                background: levelBg[q.waitLevel],
                padding: '3px 8px',
                borderRadius: '6px',
                flexShrink: 0,
                marginLeft: '8px'
              }} className="tabular">
                {q.wait}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Shift Key Metrics Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', marginBottom: '12px' }}>
          Today's Conversion Targets
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Calls Dialed</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', marginTop: '2px' }} className="tabular">18 / 25</div>
            <div style={{ fontSize: '11px', color: '#0f6e56', marginTop: '2px', fontWeight: 600 }}>72% shift goal</div>
          </div>

          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Orders Closed</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f6e56', marginTop: '2px' }} className="tabular">4</div>
            <div style={{ fontSize: '11px', color: '#0f6e56', marginTop: '2px', fontWeight: 600 }}>+₹1.28L book value</div>
          </div>

          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Avg Handle Time</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a1a', marginTop: '2px' }} className="tabular">3m 42s</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Within 4m SLA</div>
          </div>

          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>EMI Push Rate</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#c8860a', marginTop: '2px' }} className="tabular">36%</div>
            <div style={{ fontSize: '11px', color: '#c8860a', marginTop: '2px', fontWeight: 600 }}>Below 60% target</div>
          </div>
        </div>
      </div>

    </div>
  );
}
