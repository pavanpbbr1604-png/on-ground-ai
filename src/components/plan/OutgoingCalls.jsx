import React, { useState } from 'react';
import { Phone, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CreditCard, Sparkles, ShoppingBag, Search, UserPlus, X } from 'lucide-react';

export default function OutgoingCalls({ leads = [], onPlaceCall, onAddNewLead }) {
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;

  // Add Contact Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactLocation, setContactLocation] = useState('Bangalore');
  const [contactProduct, setContactProduct] = useState('Ortho GRID Pro (₹42,000)');

  const handleCreateContact = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;

    const newLead = {
      id: `custom-${Date.now()}`,
      name: contactName.trim(),
      phone: contactPhone.trim(),
      city: contactLocation.trim(),
      product: contactProduct.trim(),
      attractivenessScore: 99,
      avatarBg: '#dcfce7',
      avatarColor: '#15803d',
      initials: contactName.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      interest: `Custom contact registered for live calling verification`,
      status: 'Direct Test Lead',
      journey: [
        { date: 'Today', text: `Lead added by agent for live phone verification.` }
      ],
      signals: [
        { type: 'TARGET', text: `Direct phone number: ${contactPhone.trim()}` }
      ],
      crossSell: 'Luxe Pillows Pair',
      emi: '6-Month Zero-Cost EMI (₹7,000/mo)'
    };

    if (onAddNewLead) {
      onAddNewLead(newLead);
    }
    setExpandedId(newLead.id);
    setShowAddModal(false);
    setContactName('');
    setContactPhone('');
  };

  // Filter and sort by attractivenessScore descending
  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.product && l.product.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (l.phone && l.phone.includes(searchQuery))
  );

  const sortedLeads = [...filteredLeads].sort((a, b) => (b.attractivenessScore || 0) - (a.attractivenessScore || 0));
  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage) || 1;
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>Calls to Make (Priority Ranked)</div>
          <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>
            Sorted by shopper attractiveness score and purchase propensity
          </div>
        </div>

        {/* Action Controls: Add Contact + Search Bar + Pager */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Add Contact Button */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#0f6e56',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <UserPlus size={14} />
            <span>+ Add Contact / Friend</span>
          </button>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '180px' }}>
            <Search size={14} color="#8e8e93" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
              placeholder="Search leads..."
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                borderRadius: '8px',
                border: '1px solid #e5e5ea',
                fontSize: '12.5px',
                outline: 'none',
                background: '#fff'
              }}
            />
          </div>

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
              Page {currentPage + 1} of {totalPages}
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
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sortedLeads.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #eceff4',
            padding: '36px 20px',
            textAlign: 'center',
            color: '#6b6b74'
          }}>
            <Search size={28} color="#c5c8cf" style={{ margin: '0 auto 10px', display: 'block' }} />
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>
              No leads matching "{searchQuery}"
            </div>
            <div style={{ fontSize: '12.5px', color: '#8e8e93', marginBottom: '14px' }}>
              Try searching by shopper name, mattress product, or phone digits
            </div>
            <button
              onClick={() => { setSearchQuery(''); setCurrentPage(0); }}
              className="btn-secondary"
              style={{ fontSize: '12.5px', padding: '6px 14px' }}
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          currentLeads.map((lead) => {
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
        })
      )}
      </div>

      {/* Add Contact Modal Popup */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px', borderRadius: '16px', overflow: 'hidden', padding: '0' }}
          >
            <div style={{ padding: '14px 18px', background: '#0f6e56', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 800 }}>
                <UserPlus size={16} />
                <span>Add Contact / Friend For Live Calling</span>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateContact} style={{ padding: '20px' }}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Contact Name (You or Friend) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pavan B R or Rahul"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Mobile Phone Number (E.164 Format) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+919876543210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
                <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'block' }}>
                  Include country code (e.g. +91 for India or +1 for US)
                </span>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Mattress Model / Product Interest
                </label>
                <input
                  type="text"
                  placeholder="Ortho GRID Pro (₹42,000)"
                  value={contactProduct}
                  onChange={(e) => setContactProduct(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  City / Retail Outlet
                </label>
                <input
                  type="text"
                  placeholder="Koramangala, Bangalore"
                  value={contactLocation}
                  onChange={(e) => setContactLocation(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ padding: '8px 14px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>
                  Save & Add to Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
