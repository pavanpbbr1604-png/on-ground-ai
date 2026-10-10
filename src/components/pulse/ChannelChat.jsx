import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Bot, Sparkles, PhoneCall } from 'lucide-react';

export default function ChannelChat({ channel, onBack, onResolveInput, onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const [inputCardResponse, setInputCardResponse] = useState('');
  const [cardResolved, setCardResolved] = useState(channel.needsInput?.resolved || false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(channel.id, inputText.trim());
    setInputText('');
  };

  const handleAcceptResolution = () => {
    setCardResolved(true);
    if (onResolveInput) onResolveInput(channel.id, 'Resolution Accepted: Will open every call with standard greeting script.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: '14px', border: '1px solid #e5e5ea', overflow: 'hidden' }}>
      
      {/* Channel Header */}
      <div style={{
        padding: '12px 16px',
        background: '#0a1a14',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#9fe1cb', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>#{channel.name}</span>
          </div>
          <div style={{ fontSize: '11.5px', color: '#9fe1cb', marginTop: '1px' }}>
            {channel.topic || 'Team channel'}
          </div>
        </div>
      </div>

      {/* Pinned "Needs Your Input" Card */}
      {channel.needsInput && (
        <div style={{
          background: cardResolved ? '#f6fcf9' : '#fff8e1',
          borderBottom: cardResolved ? '1.5px solid #a3e2cf' : '1.5px solid #f5cf94',
          padding: '12px 16px',
          transition: 'all 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, background: cardResolved ? '#0f6e56' : '#c8860a', color: '#fff', padding: '2px 7px', borderRadius: '4px' }}>
                {cardResolved ? 'RESOLVED ✓' : 'PINNED · NEEDS YOUR INPUT'}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: cardResolved ? '#0f6e56' : '#1a1a1a' }}>
                {channel.needsInput.title}
              </span>
            </div>
          </div>

          <div style={{ fontSize: '12.5px', color: '#444', lineHeight: 1.45, marginBottom: '8px' }}>
            <b>Issue:</b> {channel.needsInput.issue}
          </div>

          <div style={{ fontSize: '12.5px', color: '#0f6e56', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', padding: '6px 10px', borderRadius: '6px', marginBottom: '10px' }}>
            <b>Suggested Resolution:</b> {channel.needsInput.suggestedResolution}
          </div>

          {!cardResolved ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAcceptResolution}
                style={{
                  background: '#0f6e56',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCircle2 size={13} />
                <span>Accept Suggested Resolution</span>
              </button>

              <button
                onClick={() => setCardResolved(true)}
                style={{
                  background: '#fff',
                  color: '#c8860a',
                  border: '1px solid #f5cf94',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Call Store Manager Sunita
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: '#0f6e56', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} />
              <span>Acknowledged by you: Opening greeting confirmed for remaining shift calls.</span>
            </div>
          )}
        </div>
      )}

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {channel.messages.map((msg) => {
          const isSelf = msg.isSelf;

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isSelf ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                alignSelf: isSelf ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a1a' }}>
                  {msg.sender}
                </span>
                <span style={{ fontSize: '11px', color: '#8e8e93' }}>
                  {msg.time}
                </span>
              </div>

              <div
                style={{
                  background: isSelf ? '#1d9e75' : '#f2f2f7',
                  color: isSelf ? '#fff' : '#1a1a1a',
                  padding: '10px 14px',
                  borderRadius: isSelf ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  fontSize: '13.5px',
                  lineHeight: 1.45,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid #e5e5ea', background: '#fafafa', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message #${channel.name}...`}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid #d1d5db',
            fontSize: '13.5px',
            outline: 'none',
            background: '#fff'
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '10px 16px', borderRadius: '10px' }}
        >
          <Send size={15} />
          <span>Send</span>
        </button>
      </form>

    </div>
  );
}
