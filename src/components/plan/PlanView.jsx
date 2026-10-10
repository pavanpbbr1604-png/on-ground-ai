import React, { useState } from 'react';
import OutgoingCalls from './OutgoingCalls';
import IncomingCalls from './IncomingCalls';
import RecentCalls from './RecentCalls';
import { Phone, Sparkles } from 'lucide-react';

export default function PlanView({ leads, onPlaceCall, onSelectCallForReview, onStartPracticeCall }) {
  const [subTab, setSubTab] = useState('outgoing');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        {/* Subtabs Selector */}
        <div className="subtabs">
          <button 
            className={`subtab-btn ${subTab === 'outgoing' ? 'active' : ''}`}
            onClick={() => setSubTab('outgoing')}
          >
            Calls to Make
          </button>
          <button 
            className={`subtab-btn ${subTab === 'incoming' ? 'active' : ''}`}
            onClick={() => setSubTab('incoming')}
          >
            Incoming (Missed)
          </button>
          <button 
            className={`subtab-btn ${subTab === 'recent' ? 'active' : ''}`}
            onClick={() => setSubTab('recent')}
          >
            Recent Calls
          </button>
        </div>

        {/* Practice Call Bonus Button */}
        <button
          onClick={onStartPracticeCall}
          style={{
            background: 'linear-gradient(135deg, #1d9e75, #0f6e56)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(15, 110, 86, 0.25)'
          }}
        >
          <Sparkles size={15} />
          <span>Practise AI Call (Demo)</span>
        </button>
      </div>

      {/* Active Tab Screen */}
      {subTab === 'outgoing' && (
        <OutgoingCalls leads={leads} onPlaceCall={onPlaceCall} />
      )}
      {subTab === 'incoming' && (
        <IncomingCalls onPlaceCall={onPlaceCall} />
      )}
      {subTab === 'recent' && (
        <RecentCalls onSelectCallForReview={onSelectCallForReview} />
      )}
    </div>
  );
}
