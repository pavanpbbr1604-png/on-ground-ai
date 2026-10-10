import React from 'react';
import { CheckCircle2, ChevronRight, Phone, MessageSquare, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function TasksList({ leads = [], onSelectLeadForModal, onStartCall }) {
  const tasks = [
    {
      id: 'task-1',
      leadId: 'lead-1',
      title: 'Priority Call: Mukunda R.',
      product: 'Ortho GRID Pro (₹42,000) · 3:30 PM slot',
      priority: 'urgent',
      type: 'call',
      lead: leads[0]
    },
    {
      id: 'task-2',
      leadId: 'lead-2',
      title: 'SLA Risk Recovery: Kavitha R.',
      product: 'SmartGRID Luxe (₹36,000) · Unanswered enquiry',
      priority: 'high',
      type: 'call',
      lead: leads[1]
    },
    {
      id: 'task-3',
      leadId: 'lead-3',
      title: 'Return Missed Call: Ali Mansoor',
      product: 'Elev8 Smart Bed (₹58,000) · High ticket lead',
      priority: 'high',
      type: 'call',
      lead: leads[2]
    },
    {
      id: 'task-4',
      leadId: 'lead-4',
      title: 'WhatsApp Quote: Sneha Patel',
      product: 'ErgoSmart Chair (₹18,500) · Checkout abandoned',
      priority: 'medium',
      type: 'chat',
      lead: leads[3]
    }
  ];

  const priorityStyles = {
    urgent: { bg: '#fdecec', color: '#e24b4a', label: 'Urgent SLA' },
    high: { bg: '#fff3d6', color: '#c8860a', label: 'High Priority' },
    medium: { bg: '#e8f0fe', color: '#185fa5', label: 'Follow-up' }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>Today's Prioritized Shift Tasks</div>
          <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>
            Clicking any task opens the Lead Dossier & buying signals
          </div>
        </div>
        <span style={{ fontSize: '12px', color: '#0f6e56', fontWeight: 700, background: '#e1f5ee', padding: '3px 8px', borderRadius: '6px' }}>
          4 Pending
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tasks.map((task) => {
          const pStyle = priorityStyles[task.priority];
          return (
            <div
              key={task.id}
              onClick={() => onSelectLeadForModal(task.lead)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: '10px',
                background: '#fbfcfe',
                border: '1px solid #eceff4',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cadfd8'; e.currentTarget.style.background = '#f6fbf9'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#eceff4'; e.currentTarget.style.background = '#fbfcfe'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: task.type === 'call' ? '#e1f5ee' : '#e8f0fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {task.type === 'call' ? <Phone size={15} color="#0f6e56" /> : <MessageSquare size={15} color="#185fa5" />}
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1a1a1a' }}>{task.title}</div>
                  <div style={{ fontSize: '12px', color: '#6b6b74', marginTop: '2px' }}>{task.product}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  background: pStyle.bg,
                  color: pStyle.color,
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  {pStyle.label}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onStartCall) onStartCall(task.lead);
                  }}
                  title="Direct Call"
                  style={{
                    background: '#0f6e56',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#fff',
                    padding: '5px 9px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Phone size={12} />
                  <span>Call</span>
                </button>

                <ChevronRight size={16} color="#8e8e93" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
