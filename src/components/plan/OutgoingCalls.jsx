import React, { useState } from 'react';
import { Phone, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CreditCard, Sparkles, ShoppingBag } from 'lucide-react';

export default function OutgoingCalls({ leads = [], onPlaceCall }) {
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  // Sorted by attractivenessScore descending
  const sortedLeads = [...leads].sort((a, b) => (b.attractivenessScore || 0) - (a.attractivenessScore || 0));
  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);
  const currentLeads = sortedLeads.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#0f6e56';
    if (score >= 55) return '#c8860a';
    return '#e24b4a';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>Calls to Make (Priority Ranked)</div>
          <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>
            Sorted by shopper attractiveness score and purchase propensity
          </div>
        </div>

        {/* Pager */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '1px solid #e5e5ea',
              background: '#fff',
              cursor: currentPage === 0 ? 'default' : 'pointer',
              opacity: currentPage === 0 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#6b6b74' }}>
            Page {currentPage + 1} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              border: '1px solid #e5e5ea',
              background: '#fff',
              cursor: currentPage >= totalPages - 1 ? 'default' : 'pointer',
              opacity: currentPage >= totalPages - 1 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {currentLeads.map((lead) => {
          const isExpanded = expandedId === lead.id;
          const scoreColor = getScoreColor(lead.attractivenessScore);

          return (
            <div
              key={lead.id}
              style={{
                background: '#fff',
                borderRadius: '12px',
                border: isExpanded ? '1.5px solid #0f6e56' : '1px solid #eceff4',
                overflow: 'hidden',
                boxShadow: isExpanded ? '0 4px 16px rgba(15, 110, 86, 0.08)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Row Header */}
              <div
                onClick={() => toggleExpand(lead.id)}
                style={{
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  background: isExpanded ? '#f6fcf9' : '#fff'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: lead.avatarBg,
                  color: lead.avatarColor,
                  fontSize: '14px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {lead.initials}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1a1a1a' }}>
                    {lead.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#6b6b74', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.interest}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: scoreColor }} className="tabular">
                    {lead.attractivenessScore}
                  </div>
                  <div style={{ fontSize: '10px', color: '#8e8e93', textTransform: 'uppercase', fontWeight: 700 }}>
                    Score
                  </div>
                </div>

                <div style={{ color: '#8e8e93', paddingLeft: '4px' }}>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Expandable Accordion Body */}
              {isExpanded && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid #eef2f6', background: '#fff' }}>
                  
                  {/* Story So Far */}
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                      Story So Far (Interaction History)
                    </div>
                    <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5, background: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                      {(lead.journey || []).map(j => `${j.date}: ${j.text}`).join(' → ') || 'Enquiry recorded via retail ad campaign.'}
                    </div>
                  </div>

                  {/* Buying Signals */}
                  {lead.signals && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                        Live Buying Signals
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {lead.signals.map((sig, sIdx) => (
                          <div key={sIdx} style={{ fontSize: '12.5px', color: '#1a1a1a', display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#0f6e56', background: '#e1f5ee', padding: '1px 6px', borderRadius: '4px' }}>
                              {sig.type}
                            </span>
                            <span>{sig.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preferred Product & Cross Sell Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '8px 10px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase' }}>Target Product</div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1a1a1a', marginTop: '2px' }}>{lead.product || '—'}</div>
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '8px 10px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase' }}>Cross-Sell Pitch</div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1a1a1a', marginTop: '2px' }}>{lead.crossSell || '—'}</div>
                    </div>
                  </div>

                  {/* EMI Note */}
                  <div style={{ background: '#fff8e1', border: '1px solid #f5cf94', borderRadius: '8px', padding: '8px 10px', marginTop: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#a16207', textTransform: 'uppercase' }}>Financing / EMI</div>
                    <div style={{ fontSize: '12.5px', color: '#7c4a00', marginTop: '2px', fontWeight: 500 }}>{lead.emi}</div>
                  </div>

                  {/* Place Call Action Button */}
                  <button
                    onClick={() => onPlaceCall(lead)}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      marginTop: '14px',
                      padding: '11px',
                      justifyContent: 'center',
                      fontSize: '14px',
                      borderRadius: '10px'
                    }}
                  >
                    <Phone size={16} />
                    <span>Place Call to {lead.name}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
