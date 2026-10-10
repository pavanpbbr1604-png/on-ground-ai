import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronRight, Phone, MessageSquare, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function TasksList({ leads = [], onSelectLeadForModal, onStartCall }) {
  const [completedTaskIds, setCompletedTaskIds] = useState([]);

  const toggleTaskCompleted = (taskId, e) => {
    e.stopPropagation();
    setCompletedTaskIds(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

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

  const pendingCount = tasks.filter(t => !completedTaskIds.includes(t.id)).length;
  const completedCount = completedTaskIds.length;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a' }}>Today's Prioritized Shift Tasks</div>
          <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>
            Check off finished items or click any task to open Lead Dossier
          </div>
        </div>
        <span style={{ 
          fontSize: '12px', 
          color: pendingCount === 0 ? '#0f6e56' : '#185fa5', 
          fontWeight: 700, 
          background: pendingCount === 0 ? '#e1f5ee' : '#e8f0fe', 
          padding: '3px 8px', 
          borderRadius: '6px' 
        }}>
          {pendingCount === 0 
            ? 'All Completed 🎉' 
            : `${pendingCount} Pending${completedCount > 0 ? ` · ${completedCount} Done` : ''}`
          }
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {tasks.map((task) => {
          const isDone = completedTaskIds.includes(task.id);
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
                background: isDone ? '#f4f6f8' : '#fbfcfe',
                border: isDone ? '1px solid #e1e4e8' : '1px solid #eceff4',
                opacity: isDone ? 0.75 : 1,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { 
                if (!isDone) {
                  e.currentTarget.style.borderColor = '#cadfd8'; 
                  e.currentTarget.style.background = '#f6fbf9'; 
                }
              }}
              onMouseLeave={(e) => { 
                if (!isDone) {
                  e.currentTarget.style.borderColor = '#eceff4'; 
                  e.currentTarget.style.background = '#fbfcfe'; 
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                {/* Checkbox Toggle Button */}
                <button
                  onClick={(e) => toggleTaskCompleted(task.id, e)}
                  title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDone ? '#0f6e56' : '#c5c8cf',
                    transition: 'color 0.15s ease'
                  }}
                >
                  {isDone ? <CheckCircle2 size={19} color="#0f6e56" /> : <Circle size={19} />}
                </button>

                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isDone ? '#e2e6ea' : task.type === 'call' ? '#e1f5ee' : '#e8f0fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {task.type === 'call' 
                    ? <Phone size={14} color={isDone ? '#8e8e93' : '#0f6e56'} /> 
                    : <MessageSquare size={14} color={isDone ? '#8e8e93' : '#185fa5'} />
                  }
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '13.5px', 
                    fontWeight: 700, 
                    color: isDone ? '#8e8e93' : '#1a1a1a',
                    textDecoration: isDone ? 'line-through' : 'none'
                  }}>
                    {task.title}
                  </div>
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
