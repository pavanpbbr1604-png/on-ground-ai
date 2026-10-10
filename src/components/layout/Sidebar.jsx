import React from 'react';
import { 
  LayoutDashboard, 
  PhoneCall, 
  Calendar, 
  Radio, 
  Sparkles,
  Users,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen, unreadCounts }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plan', label: 'Plan', icon: PhoneCall, badge: unreadCounts?.plan || 4 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'pulse', label: 'Pulse', icon: Radio, badge: unreadCounts?.pulse || 2 }
  ];

  return (
    <>
      {mobileOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 95
          }}
        />
      )}
      <aside className={`app-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-badge">OG</div>
          <div>
            <div className="logo-text">On-Ground.ai</div>
            <div style={{ fontSize: '11px', color: '#9fe1cb', fontWeight: 600 }}>Call Centre · Retail</div>
          </div>
          {mobileOpen && (
            <button 
              onClick={() => setMobileOpen(false)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
              >
                <div className="nav-icon">
                  <Icon size={16} />
                </div>
                <span className="in-label">{item.label}</span>
                {item.badge && !isActive && (
                  <span className="nav-badge tabular">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Shift & Role Footer */}
        <div style={{
          marginTop: 'auto',
          padding: '12px 10px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#5dcaa5' }} />
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Shift Active</div>
          </div>
          <div style={{ fontSize: '11.5px', color: '#a9c4ba', marginTop: '4px' }}>
            Store: Koramangala · Desk #4
          </div>
        </div>
      </aside>
    </>
  );
}
