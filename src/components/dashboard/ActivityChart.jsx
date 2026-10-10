import React, { useState } from 'react';
import { BarChart3, TrendingUp, CheckCircle } from 'lucide-react';

export default function ActivityChart() {
  const [metric, setMetric] = useState('calls');

  const days = [
    { day: 'Mon', calls: 22, conversions: 3, sop: 88 },
    { day: 'Tue', calls: 26, conversions: 5, sop: 92 },
    { day: 'Wed', calls: 24, conversions: 4, sop: 90 },
    { day: 'Thu', calls: 28, conversions: 6, sop: 95 },
    { day: 'Fri', calls: 30, conversions: 7, sop: 94 },
    { day: 'Sat', calls: 35, conversions: 8, sop: 96 },
    { day: 'Sun (Today)', calls: 18, conversions: 4, sop: 94 }
  ];

  const maxVal = metric === 'calls' ? 40 : metric === 'conversions' ? 10 : 100;

  return (
    <div className="card" style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#0f6e56" />
            <span>7-Day Performance & SOP Compliance</span>
          </div>
          <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>
            Shift progress over the current week (Retail Mattress Vertical)
          </div>
        </div>

        {/* Metric Selector Pills */}
        <div style={{ display: 'flex', background: '#f2f2f7', padding: '3px', borderRadius: '8px', gap: '4px' }}>
          <button
            onClick={() => setMetric('calls')}
            style={{
              padding: '5px 11px',
              fontSize: '12px',
              fontWeight: metric === 'calls' ? 700 : 500,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              background: metric === 'calls' ? '#fff' : 'transparent',
              color: metric === 'calls' ? '#1a1a1a' : '#6b6b74',
              boxShadow: metric === 'calls' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Calls Made
          </button>
          <button
            onClick={() => setMetric('conversions')}
            style={{
              padding: '5px 11px',
              fontSize: '12px',
              fontWeight: metric === 'conversions' ? 700 : 500,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              background: metric === 'conversions' ? '#fff' : 'transparent',
              color: metric === 'conversions' ? '#1a1a1a' : '#6b6b74',
              boxShadow: metric === 'conversions' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Conversions
          </button>
          <button
            onClick={() => setMetric('sop')}
            style={{
              padding: '5px 11px',
              fontSize: '12px',
              fontWeight: metric === 'sop' ? 700 : 500,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              background: metric === 'sop' ? '#fff' : 'transparent',
              color: metric === 'sop' ? '#1a1a1a' : '#6b6b74',
              boxShadow: metric === 'sop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            SOP Adherence %
          </button>
        </div>
      </div>

      {/* SVG-based robust Bar Chart with tooltips and heights */}
      <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '10px 10px 0', borderBottom: '1px solid #e5e5ea' }}>
        {days.map((item, idx) => {
          const val = item[metric];
          const heightPercent = Math.round((val / maxVal) * 100);
          const isToday = idx === days.length - 1;

          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: isToday ? '#0f6e56' : '#6b6b74', marginBottom: '6px' }} className="tabular">
                {metric === 'sop' ? `${val}%` : val}
              </div>
              <div 
                style={{
                  width: '100%',
                  maxWidth: '38px',
                  height: `${heightPercent}%`,
                  background: isToday 
                    ? 'linear-gradient(180deg, #1d9e75 0%, #0f6e56 100%)' 
                    : metric === 'sop' ? '#5dcaa5' : '#cadfd8',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.3s ease',
                  cursor: 'pointer'
                }}
                title={`${item.day}: ${val} ${metric}`}
              />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px 0' }}>
        {days.map((item, idx) => (
          <div key={idx} style={{ flex: 1, textAlign: 'center', fontSize: '11.5px', color: idx === days.length - 1 ? '#0f6e56' : '#8e8e93', fontWeight: idx === days.length - 1 ? 700 : 500 }}>
            {item.day}
          </div>
        ))}
      </div>
    </div>
  );
}
