import React, { useState } from 'react';
import { Menu, Bell, Trophy, Zap, ChevronDown, User, LogOut, CheckCircle2 } from 'lucide-react';

export default function Topbar({ activeTab, onToggleMobile, onOpenLeadsModal }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const screenTitles = {
    dashboard: 'Dashboard · Shift Overview',
    plan: 'Plan · Calling Queue & Dialer',
    calendar: 'Calendar · Scheduled Callbacks',
    pulse: 'Pulse · Customer WhatsApp & Team Channels'
  };

  const notifications = [
    { id: 1, text: 'Sunita Rao mentioned you in #callcentre-team regarding Greeting Score QA', time: '10m ago', unread: true },
    { id: 2, text: 'Mukunda R. requested WhatsApp quotation for Ortho GRID Pro', time: '25m ago', unread: true },
    { id: 3, text: 'Missed incoming call from Vikram Sethi (₹32,000 value at stake)', time: '40m ago', unread: false }
  ];

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onToggleMobile}>
          <Menu size={20} />
        </button>
        <h1 className="topbar-title">{screenTitles[activeTab] || 'Call Centre App'}</h1>
      </div>

      <div className="topbar-right">
        {/* Global Rank Pills */}
        <div className="rank-pill gold">
          <Trophy size={13} />
          <span className="tabular">#1</span>
          <span style={{ fontSize: '10px', opacity: 0.8, marginLeft: '2px' }}>RANK</span>
        </div>

        <div className="rank-pill teal">
          <Zap size={13} />
          <span className="tabular">+84 pts</span>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <div 
            className="notif-bell" 
            title="Notifications"
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setUserDropdownOpen(false);
            }}
          >
            <Bell size={16} color="#fff" />
          </div>

          {notifDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '320px',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              border: '1px solid #e5e5ea',
              zIndex: 500,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '12px 14px', background: '#0a1a14', color: '#fff', fontSize: '13.5px', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                <span>Notifications (2 new)</span>
                <span style={{ fontSize: '11px', color: '#5dcaa5', cursor: 'pointer' }} onClick={() => setNotifDropdownOpen(false)}>Mark read</span>
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ padding: '11px 14px', borderBottom: '1px solid #f2f2f7', background: n.unread ? '#faf8ff' : '#fff', cursor: 'pointer' }}>
                    <div style={{ fontSize: '12.8px', color: '#1a1a1a', lineHeight: 1.4, fontWeight: n.unread ? 600 : 400 }}>
                      {n.text}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8e8e93', marginTop: '4px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Badge with Animated Ring */}
        <div style={{ position: 'relative' }}>
          <div 
            className="profile-badge" 
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setNotifDropdownOpen(false);
            }}
          >
            <div className="profile-badge-ring" />
            <div className="profile-badge-inner">AR</div>
          </div>

          {userDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: 0,
              width: '230px',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              border: '1px solid #e5e5ea',
              zIndex: 500,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '14px', background: '#0a1a14', color: '#fff' }}>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Arvind Rajan</div>
                <div style={{ fontSize: '12px', color: '#9fe1cb', marginTop: '2px' }}>Koramangala Flagship · Sales M0</div>
                <div style={{ fontSize: '11px', color: '#FFD700', marginTop: '4px', fontWeight: 600 }}>Top Performer Shift A</div>
              </div>
              <div style={{ padding: '6px 0' }}>
                <div 
                  onClick={() => { setUserDropdownOpen(false); onOpenLeadsModal && onOpenLeadsModal(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', fontSize: '13.5px', color: '#1a1a1a', cursor: 'pointer' }}
                >
                  <User size={16} color="#0f6e56" />
                  <span>My Assigned Leads</span>
                </div>
                <div 
                  onClick={() => setUserDropdownOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', fontSize: '13.5px', color: '#1a1a1a', cursor: 'pointer', borderTop: '1px solid #f2f2f7' }}
                >
                  <CheckCircle2 size={16} color="#1d9e75" />
                  <span>SOP Compliance: 94%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
