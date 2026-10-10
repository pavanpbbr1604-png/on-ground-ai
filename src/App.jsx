import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';
import Dashboard from './components/dashboard/Dashboard';
import PlanView from './components/plan/PlanView';
import CalendarView from './components/calendar/CalendarView';
import PulseHome from './components/pulse/PulseHome';
import LeadsModal from './components/leads/LeadsModal';
import SopReviewModal from './components/sopReview/SopReviewModal';
import LiveCallModal from './components/dialer/LiveCallModal';

import { LEADS_DATA } from './data/leadsData';
import { RECENT_CALLS } from './data/callsData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // App-level state
  const [leads, setLeads] = useState(LEADS_DATA);
  const [recentCalls, setRecentCalls] = useState(RECENT_CALLS);

  // Modals state
  const [selectedLeadForModal, setSelectedLeadForModal] = useState(null);
  const [selectedCallForReview, setSelectedCallForReview] = useState(null);
  const [activeCallLead, setActiveCallLead] = useState(null);

  // Call actions
  const handleStartCall = (lead) => {
    setActiveCallLead(lead || leads[0]);
  };

  const handleCallCompleted = (completedCall) => {
    setRecentCalls([completedCall, ...recentCalls]);
  };

  return (
    <div className="app-container">
      {/* 1. App Shell Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        unreadCounts={{ plan: 4, pulse: 2 }}
      />

      {/* 2. Main Area */}
      <div className="app-main">
        {/* Topbar */}
        <Topbar 
          activeTab={activeTab}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          onOpenLeadsModal={() => setSelectedLeadForModal(leads[0])}
        />

        {/* Dynamic View Content */}
        <main className="app-content">
          {activeTab === 'dashboard' && (
            <Dashboard 
              leads={leads}
              onSelectLeadForModal={(lead) => setSelectedLeadForModal(lead)}
              onStartCall={handleStartCall}
              onSwitchToPlan={() => setActiveTab('plan')}
            />
          )}

          {activeTab === 'plan' && (
            <PlanView 
              leads={leads}
              onPlaceCall={handleStartCall}
              onSelectCallForReview={(call) => setSelectedCallForReview(call)}
              onStartPracticeCall={() => handleStartCall(leads[0])}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView 
              onPlaceCall={handleStartCall}
            />
          )}

          {activeTab === 'pulse' && (
            <PulseHome 
              onPlaceCall={handleStartCall}
            />
          )}
        </main>
      </div>

      {/* 3. Leads Dossier Modal */}
      {selectedLeadForModal && (
        <LeadsModal 
          leads={leads}
          selectedLead={selectedLeadForModal}
          onClose={() => setSelectedLeadForModal(null)}
          onStartCall={handleStartCall}
        />
      )}

      {/* 4. SOP Review Modal */}
      {selectedCallForReview && (
        <SopReviewModal 
          call={selectedCallForReview}
          onClose={() => setSelectedCallForReview(null)}
        />
      )}

      {/* 5. Live In-Call & AI Assist Modal */}
      {activeCallLead && (
        <LiveCallModal 
          lead={activeCallLead}
          onClose={() => setActiveCallLead(null)}
          onCallCompleted={handleCallCompleted}
        />
      )}
    </div>
  );
}
