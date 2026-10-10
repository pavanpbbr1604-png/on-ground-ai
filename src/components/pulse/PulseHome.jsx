import React, { useState } from 'react';
import { 
  Radio, 
  MessageSquare, 
  Sparkles, 
  Bot, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  CreditCard,
  Hash,
  Users
} from 'lucide-react';
import ChannelChat from './ChannelChat';
import CustomerChat from './CustomerChat';
import KudosFeed from './KudosFeed';
import { PULSE_CHANNELS, PULSE_CUSTOMER_CHATS, AVANI_BOT_ACTIONS } from '../../data/pulseData';

export default function PulseHome({ onPlaceCall }) {
  const [pulseTab, setPulseTab] = useState('channels'); // 'channels' | 'customers' | 'kudos'
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [activeCustomerId, setActiveCustomerId] = useState(null);
  const [channels, setChannels] = useState(PULSE_CHANNELS);
  const [actions, setActions] = useState(AVANI_BOT_ACTIONS);

  const toggleAction = (id) => {
    setActions(actions.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const handleSendMessage = (channelId, text) => {
    setChannels(channels.map(ch => {
      if (ch.id === channelId) {
        return {
          ...ch,
          messages: [
            ...ch.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'You',
              initials: 'AR',
              isSelf: true,
              text: text,
              time: 'Just now'
            }
          ]
        };
      }
      return ch;
    }));
  };

  const handleResolveInput = (channelId, resolutionText) => {
    setChannels(channels.map(ch => {
      if (ch.id === channelId && ch.needsInput) {
        return {
          ...ch,
          needsInput: {
            ...ch.needsInput,
            resolved: true,
            resolutionText: resolutionText
          }
        };
      }
      return ch;
    }));
  };

  // If a channel is open, show channel chat
  if (activeChannelId) {
    const channel = channels.find(c => c.id === activeChannelId);
    return (
      <div style={{ maxWidth: '900px', height: 'calc(100vh - 120px)', margin: '0 auto' }}>
        <ChannelChat
          channel={channel}
          onBack={() => setActiveChannelId(null)}
          onResolveInput={handleResolveInput}
          onSendMessage={handleSendMessage}
        />
      </div>
    );
  }

  // If customer chat is open, show customer chat
  if (activeCustomerId) {
    const customer = PULSE_CUSTOMER_CHATS.find(c => c.id === activeCustomerId);
    return (
      <div style={{ maxWidth: '800px', height: 'calc(100vh - 120px)', margin: '0 auto' }}>
        <CustomerChat
          customer={customer}
          onBack={() => setActiveCustomerId(null)}
          onPlaceCall={onPlaceCall}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Pulse Tabs (Channels, Customers, Kudos) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="subtabs">
          <button
            className={`subtab-btn ${pulseTab === 'channels' ? 'active' : ''}`}
            onClick={() => setPulseTab('channels')}
          >
            Internal Channels
          </button>
          <button
            className={`subtab-btn ${pulseTab === 'customers' ? 'active' : ''}`}
            onClick={() => setPulseTab('customers')}
          >
            Customer DMs (WhatsApp)
          </button>
          <button
            className={`subtab-btn ${pulseTab === 'kudos' ? 'active' : ''}`}
            onClick={() => setPulseTab('kudos')}
          >
            Kudos Feed
          </button>
        </div>
      </div>

      {pulseTab === 'channels' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.3fr) minmax(280px, 1fr)', gap: '16px' }}>
          
          {/* Left Column: Channels & Custom Vertical Agents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Shift Communication Channels
            </div>

            {channels.map((ch) => (
              <div
                key={ch.id}
                onClick={() => setActiveChannelId(ch.id)}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #eceff4',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cadfd8'; e.currentTarget.style.background = '#fafdfc'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#eceff4'; e.currentTarget.style.background = '#fff'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: ch.category === 'agent' ? '#f1ecff' : '#e8f0fe',
                    color: ch.category === 'agent' ? '#7c3aed' : '#185fa5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '15px'
                  }}>
                    {ch.category === 'agent' ? (ch.icon || '🤖') : '#'}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>#{ch.name}</span>
                      {ch.needsInput && !ch.needsInput.resolved && (
                        <span style={{ fontSize: '10px', fontWeight: 800, background: '#fff3d6', color: '#c8860a', padding: '1px 6px', borderRadius: '4px' }}>
                          Needs Input
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8e8e93', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ch.meta || ch.topic}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {ch.unreadCount > 0 && (
                    <span style={{ background: '#1d9e75', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px' }}>
                      {ch.unreadCount}
                    </span>
                  )}
                  <ChevronRight size={16} color="#8e8e93" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: AvaniBot AI Action Center */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="card" style={{ background: 'linear-gradient(160deg, #faf8ff 0%, #fdfcff 100%)', border: '1.5px solid #ece2fb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#4c1d95' }}>Avani AI · Sales Coach</div>
                  <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600 }}>Personalized Assistant</div>
                </div>
              </div>

              <div style={{ fontSize: '12.5px', color: '#444', lineHeight: 1.45, marginBottom: '12px', background: '#fff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #ece2fb' }}>
                "Good afternoon Arvind! Your objection handling on <b>price pushback</b> improved by 14% today. Focus on introducing the zero-cost EMI earlier in the call."
              </div>

              <div style={{ fontSize: '12px', fontWeight: 800, color: '#4c1d95', textTransform: 'uppercase', marginBottom: '8px' }}>
                Shift Action Items
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {actions.map(action => (
                  <div 
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 9px',
                      background: action.completed ? '#f0fdf4' : '#fff',
                      borderRadius: '8px',
                      border: action.completed ? '1px solid #bbf7d0' : '1px solid #ece2fb',
                      cursor: 'pointer'
                    }}
                  >
                    <CheckCircle2 size={16} color={action.completed ? '#0f6e56' : '#d1d5db'} />
                    <span style={{ fontSize: '12px', color: action.completed ? '#8e8e93' : '#1a1a1a', textDecoration: action.completed ? 'line-through' : 'none' }}>
                      {action.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {pulseTab === 'customers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#8e8e93', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>
            Customer Conversations (Relayed via WhatsApp Business)
          </div>

          {PULSE_CUSTOMER_CHATS.map((cust) => (
            <div
              key={cust.id}
              onClick={() => setActiveCustomerId(cust.id)}
              style={{
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid #eceff4',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#cadfd8'; e.currentTarget.style.background = '#fafdfc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#eceff4'; e.currentTarget.style.background = '#fff'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: cust.avatarBg,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cust.initials}
                </div>

                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1a1a1a' }}>
                    {cust.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#0f6e56', fontWeight: 600 }}>
                    {cust.status}
                  </div>
                </div>
              </div>

              <ChevronRight size={16} color="#8e8e93" />
            </div>
          ))}
        </div>
      )}

      {pulseTab === 'kudos' && (
        <KudosFeed />
      )}

    </div>
  );
}
