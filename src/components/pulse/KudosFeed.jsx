import React from 'react';
import { Award, Heart, Sparkles } from 'lucide-react';
import { KUDOS_FEED } from '../../data/pulseData';

export default function KudosFeed() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontSize: '12px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>
        Store & Shift Recognition Feed
      </div>

      {KUDOS_FEED.map((k) => (
        <div
          key={k.id}
          style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #eceff4',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{
            fontSize: '22px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#faf8ff',
            border: '1px solid #ece2fb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {k.icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1a1a1a' }}>
                {k.title}
              </div>
              <span style={{ fontSize: '11px', color: '#8e8e93' }}>{k.time}</span>
            </div>

            <div style={{ fontSize: '12px', color: '#0f6e56', fontWeight: 600, marginTop: '2px' }}>
              {k.giver} → <span style={{ color: '#1a1a1a', fontWeight: 700 }}>{k.receiver}</span>
            </div>

            <div style={{ fontSize: '13px', color: '#444', marginTop: '6px', lineHeight: 1.45 }}>
              {k.desc}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
