import React from 'react';
import KpiCards from './KpiCards';
import ActivityChart from './ActivityChart';
import TasksList from './TasksList';

export default function Dashboard({ leads, onSelectLeadForModal, onStartCall, onSwitchToPlan }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <KpiCards leads={leads} onSwitchToPlan={onSwitchToPlan} />
      <ActivityChart />
      <TasksList leads={leads} onSelectLeadForModal={onSelectLeadForModal} onStartCall={onStartCall} />
    </div>
  );
}
