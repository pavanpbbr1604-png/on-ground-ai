import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, ShieldCheck, Sparkles, MessageSquare, Radio } from 'lucide-react';
import { callingService } from '../../utils/callingService';

export default function CustomerPhoneHandset() {
  const [phoneNumber, setPhoneNumber] = useState('9480850001');
  const [callState, setCallState] = useState('ringing'); // 'idle' | 'ringing' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const [micLevel, setMicLevel] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [transcript, setTranscript] = useState([
    { speaker: 'system', text: 'Incoming call from On-Ground.ai retail desk...', time: 'Just now' }
  ]);
  const [customReply, setCustomReply] = useState('');

  const lastPolledCount = useRef(0);
  const audioCtxRef = useRef(null);

  // Play phone ringtone on incoming call
  useEffect(() => {
    let ringInterval;
    if (callState === 'ringing') {
      const playTone = () => {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.value = 440;
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.2);
          }
        } catch (e) {}
      };
      playTone();
      ringInterval = setInterval(playTone, 2500);
    }
    return () => clearInterval(ringInterval);
  }, [callState]);

  // Duration timer
  useEffect(() => {
    let timer;
    if (callState === 'connected') {
      timer = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  // Sync with /api/signal periodically
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/signal?phone=${phoneNumber}`);
        const data = await res.json();
        if (data.success && data.session) {
          // If agent sent new messages, display and speak them on mobile
          const agentMsgs = data.session.agentMessages || [];
          if (agentMsgs.length > lastPolledCount.current) {
            const newMsgs = agentMsgs.slice(lastPolledCount.current);
            newMsgs.forEach(m => {
              setTranscript(prev => [...prev, { speaker: 'agent', text: m.text, time: m.time }]);
              callingService.speakAiResponse(m.text);
            });
            lastPolledCount.current = agentMsgs.length;
          }
        }
      } catch (err) {}
    }, 1200);

    return () => clearInterval(pollInterval);
  }, [phoneNumber]);

  // Accept incoming call on mobile handset
  const handleAnswerCall = async () => {
    setCallState('connected');
    try {
      await fetch('/api/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, action: 'accept', role: 'customer' })
      });
    } catch (e) {}

    // Start mobile phone microphone
    callingService.startMicrophone((level) => {
      setMicLevel(level);
    });

    // Start speech recognition on mobile phone
    callingService.startSpeechRecognition(
      ({ finalTranscript, interimTranscript }) => {
        if (interimTranscript) setInterimText(interimTranscript);
        if (finalTranscript && finalTranscript.trim()) {
          setInterimText('');
          handleSendCustomerSpeech(finalTranscript.trim());
        }
      },
      (err) => console.log('Mobile speech recognition:', err)
    );
  };

  // Send customer spoken words to server so agent sees/hears it
  const handleSendCustomerSpeech = async (text) => {
    if (!text || !text.trim()) return;
    const clean = text.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTranscript(prev => [...prev, { speaker: 'customer', text: clean, time: nowTime }]);

    try {
      await fetch('/api/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          action: 'speak',
          role: 'customer',
          payload: { text: clean }
        })
      });
    } catch (e) {}
  };

  const handleEndCall = async () => {
    setCallState('ended');
    callingService.cleanup();
    try {
      await fetch('/api/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, action: 'end', role: 'customer' })
      });
    } catch (e) {}
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #091e17 0%, #030a08 100%)',
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Smartphone Frame Container */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        minHeight: '680px',
        background: '#0d281e',
        borderRadius: '36px',
        border: '3px solid #1f503f',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 20px rgba(15,110,86,0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Smartphone Speaker Notch */}
        <div style={{
          width: '100px',
          height: '6px',
          background: '#133529',
          borderRadius: '4px',
          margin: '12px auto 6px'
        }} />

        {/* Top Header: Network / E.164 Identity */}
        <div style={{ padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#9fe1cb', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Radio size={12} color="#5dcaa5" className="pulse" />
            <span>Cellular Handset (+91 {phoneNumber})</span>
          </div>
          <span style={{ fontWeight: 700, color: '#5dcaa5' }}>5G HD Voice</span>
        </div>

        {callState === 'ringing' ? (
          /* Incoming Call Screen */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'rgba(29, 158, 117, 0.2)',
              border: '2px solid #5dcaa5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              animation: 'pulse 1.5s infinite'
            }}>
              <Phone size={42} color="#5dcaa5" />
            </div>

            <div style={{ fontSize: '12px', fontWeight: 800, color: '#5dcaa5', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Incoming Retail Call
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, marginTop: '6px', color: '#fff' }}>
              The Sleep Company
            </div>
            <div style={{ fontSize: '13px', color: '#9fe1cb', marginTop: '4px' }}>
              Sales Agent Desk · Koramangala Hub
            </div>
            <div style={{ fontSize: '11.5px', color: '#6ee7b7', marginTop: '12px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '12px' }}>
              Regarding: Ortho GRID Pro Mattress Inquiry
            </div>

            {/* Answer & Decline Controls */}
            <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingTop: '40px' }}>
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleEndCall}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#e24b4a',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(226,75,74,0.4)'
                  }}
                >
                  <PhoneOff size={28} />
                </button>
                <div style={{ fontSize: '11px', color: '#f87171', marginTop: '8px', fontWeight: 700 }}>Decline</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleAnswerCall}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(16,185,129,0.5)',
                    animation: 'bounce 1s infinite'
                  }}
                >
                  <Phone size={28} />
                </button>
                <div style={{ fontSize: '11px', color: '#6ee7b7', marginTop: '8px', fontWeight: 700 }}>Accept Call</div>
              </div>
            </div>
          </div>
        ) : callState === 'connected' ? (
          /* Active Call Screen */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', overflow: 'hidden' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>The Sleep Company</div>
              <div style={{ fontSize: '12px', color: '#5dcaa5', fontWeight: 700, marginTop: '2px' }}>
                Connected · {formatTime(callDuration)}
              </div>
            </div>

            {/* Live Audio Meter */}
            <div style={{ background: '#071d15', borderRadius: '10px', padding: '8px 12px', marginBottom: '10px', border: '1px solid #133529' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9fe1cb', marginBottom: '4px' }}>
                <span>Mobile Mic Input:</span>
                <span>{micLevel}% Volume</span>
              </div>
              <div style={{ height: '6px', background: '#133529', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${micLevel}%`, height: '100%', background: '#10b981', transition: 'width 0.1s ease' }} />
              </div>
            </div>

            {/* Conversation Feed */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '6px', background: '#0a231b', borderRadius: '12px', border: '1px solid #133529' }}>
              {transcript.map((t, idx) => {
                const isCustomer = t.speaker === 'customer';
                return (
                  <div
                    key={idx}
                    style={{
                      alignSelf: isCustomer ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      background: isCustomer ? '#10b981' : '#133529',
                      color: isCustomer ? '#022c22' : '#ecfdf5',
                      padding: '8px 12px',
                      borderRadius: isCustomer ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      lineHeight: 1.4
                    }}
                  >
                    <div style={{ fontSize: '9.5px', opacity: 0.7, marginBottom: '2px' }}>
                      {isCustomer ? 'You (on Phone 📱)' : 'Agent (on Laptop 🎧)'} · {t.time}
                    </div>
                    {t.text}
                  </div>
                );
              })}

              {interimText && (
                <div style={{ alignSelf: 'flex-end', background: 'rgba(16, 185, 129, 0.2)', border: '1px dashed #10b981', color: '#6ee7b7', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontStyle: 'italic' }}>
                  Speaking: "{interimText}"
                </div>
              )}
            </div>

            {/* Quick Pitch Objection Prompts (Click to Speak as Customer) */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '10px', color: '#9fe1cb', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                Tap to Say (Or Speak into Mic):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                {[
                  'I have lower back pain',
                  'Why is it ₹42,000?',
                  'Does memory foam heat up?',
                  'How does the 100-night trial work?'
                ].map((txt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendCustomerSpeech(txt)}
                    style={{
                      background: '#133529',
                      border: '1px solid #235845',
                      color: '#ecfdf5',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    "{txt}"
                  </button>
                ))}
              </div>
            </div>

            {/* End Call Button */}
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <button
                onClick={handleEndCall}
                style={{
                  background: '#e24b4a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 24px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(226,75,74,0.4)'
                }}
              >
                <PhoneOff size={16} />
                <span>End Call</span>
              </button>
            </div>
          </div>
        ) : (
          /* Call Ended Screen */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#133529', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9fe1cb', marginBottom: '16px' }}>
              <PhoneOff size={28} />
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800 }}>Call Ended</div>
            <div style={{ fontSize: '12px', color: '#9fe1cb', marginTop: '4px' }}>
              Duration: {formatTime(callDuration)} · Audio Synced
            </div>
            <button
              onClick={() => { setCallState('ringing'); setCallDuration(0); }}
              style={{
                marginTop: '24px',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Simulate Next Incoming Call
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
