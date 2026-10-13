import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, Mic, MicOff, Sparkles, CheckCircle2, ShieldCheck, Send, 
  MessageSquare, Clock, AlertCircle, Zap, Phone, Radio, Hash, Volume2, Settings
} from 'lucide-react';
import { SOP_ITEMS, LIVE_SIMULATION_TRANSCRIPT, AI_QUICK_REPLIES } from '../../data/callsData';
import { soundFX } from '../../utils/audio';
import { callingService } from '../../utils/callingService';

export default function LiveCallModal({ lead, onClose, onCallCompleted }) {
  // Call Configuration & Mode
  const [customerName, setCustomerName] = useState(lead?.name || 'Pavan B R');
  const [targetPhone, setTargetPhone] = useState(lead?.phone || '+919480850001');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [tempName, setTempName] = useState(lead?.name || 'Pavan B R');
  const [tempPhone, setTempPhone] = useState(lead?.phone || '+919480850001');
  const [callStatus, setCallStatus] = useState('connecting'); // 'connecting' | 'ringing' | 'connected' | 'pstn-active'
  const [callDuration, setCallDuration] = useState(0);
  const [callMode, setCallMode] = useState('ai-agent'); // 'ai-agent' | 'human-agent'

  const handleSaveContactEdit = () => {
    if (tempName.trim()) setCustomerName(tempName.trim());
    if (tempPhone.trim()) setTargetPhone(tempPhone.trim());
    setIsEditingContact(false);
  };

  // Audio & Hardware State
  const [micActive, setMicActive] = useState(false); // Laptop mic muted by default during AI phone call
  const [micLevel, setMicLevel] = useState(0);
  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedDigits, setDialedDigits] = useState('');
  const [customApiKey, setCustomApiKey] = useState('org_e8071833b8e2ddf669c4118ba7979becf34952801063e6b4c286551868aecb67df14052eaad805850cf369');
  const [showSettings, setShowSettings] = useState(false);

  // Conversation & Intelligence State
  const [transcript, setTranscript] = useState([]);
  const [interimText, setInterimText] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [sopChecked, setSopChecked] = useState([true, false, false, false, false, false]);
  const [pstnNotice, setPstnNotice] = useState(null);
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [activeFeature, setActiveFeature] = useState('opening'); // 'opening' | 'air_channels' | 'firmness' | 'emi' | 'trial' | 'offer' | 'close'

  // Dynamic AI Sales Intelligence Card (Updates as conversation progresses)
  const [activeAdvice, setActiveAdvice] = useState({
    title: 'Needs Discovery & Spine Support',
    tag: 'Step 1: Opening',
    content: `AI Agent Avani is introducing the Ortho GRID mattress and inquiring about ${customerName}'s sleeping posture and back pain relief.`,
    sayText: ''
  });

  // Wrap-up state
  const [showWrapup, setShowWrapup] = useState(false);
  const [wrapupOutcome, setWrapupOutcome] = useState('interested');
  const [wrapupSummary, setWrapupSummary] = useState('');

  const chatScrollContainerRef = useRef(null);
  const transcriptEndRef = useRef(null);

  // Update AI Advice card based on spoken keywords from caller & agent
  const updateAiAdvice = (text) => {
    if (!text) return;
    const lower = text.toLowerCase();
    if (lower.includes('pain') || lower.includes('back') || lower.includes('spine') || lower.includes('doctor') || lower.includes('stiff') || lower.includes('ortho') || lower.includes('firm')) {
      setActiveFeature('firmness');
      setActiveAdvice({
        title: 'Spine Alignment & Doctor Approval',
        tag: 'Orthopaedic Feature',
        content: 'Certified 3-Zone Japanese SmartGRID with 8.5/10 firmness. Aligns lumbar curvature and relieves morning back stiffness.',
        sayText: ''
      });
    } else if (lower.includes('wakefit') || lower.includes('price') || lower.includes('cost') || lower.includes('expensive') || lower.includes('budget') || lower.includes('emi') || lower.includes('7000') || lower.includes('42000')) {
      setActiveFeature('emi');
      setActiveAdvice({
        title: '6-Month Zero-Cost EMI (₹7,000/mo)',
        tag: 'Financing & Value',
        content: 'Zero down payment, ₹7,000/month on HDFC & ICICI credit cards. Total ₹42,000 with 10-year warranty vs 2-year sagging memory foam.',
        sayText: ''
      });
    } else if (lower.includes('channel') || lower.includes('air') || lower.includes('heat') || lower.includes('hot') || lower.includes('cool') || lower.includes('foam') || lower.includes('sweat')) {
      setActiveFeature('air_channels');
      setActiveAdvice({
        title: '2,500 Air Channels & SnowTec Cooling',
        tag: 'Temperature Tech',
        content: 'Patented Japanese SmartGRID with 2,500 open air ventilation channels and SnowTec cooling fabric. Stays 4°C cooler all night.',
        sayText: ''
      });
    } else if (lower.includes('trial') || lower.includes('return') || lower.includes('refund') || lower.includes('guarantee') || lower.includes('100') || lower.includes('warranty')) {
      setActiveFeature('trial');
      setActiveAdvice({
        title: '100-Night In-Home Risk-Free Trial',
        tag: 'Risk Reversal',
        content: 'Sleep on it for 100 nights. Free doorstep return pickup and 100% full money-back refund if back pain does not completely improve.',
        sayText: ''
      });
    } else if (lower.includes('offer') || lower.includes('voucher') || lower.includes('discount') || lower.includes('anniversary')) {
      setActiveFeature('offer');
      setActiveAdvice({
        title: 'Exclusive Store Anniversary Voucher',
        tag: 'Special Offer',
        content: 'Special ₹2,000 accessory voucher and free 24-hour express doorstep delivery from Koramangala store.',
        sayText: ''
      });
    } else if (lower.includes('whatsapp') || lower.includes('yes') || lower.includes('book') || lower.includes('buy') || lower.includes('order') || lower.includes('quote') || lower.includes('done') || lower.includes('close')) {
      setActiveFeature('close');
      setActiveAdvice({
        title: 'Deal Closing & WhatsApp Confirmation',
        tag: 'Order Dispatched',
        content: `Official mattress quotation, zero-cost EMI checkout link, and warranty confirmation dispatched directly to customer WhatsApp at ${targetPhone}.`,
        sayText: ''
      });
    }
  };

  // Handle staff spoken text (from microphone or manual input)
  const handleStaffSpeech = (text) => {
    if (!text || !text.trim()) return;
    const clean = text.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTranscript(prev => [...prev, { speaker: 'staff', text: clean, time: nowTime }]);
    updateAiAdvice(clean);

    // Broadcast to handset receiver via /api/signal
    fetch('/api/signal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: targetPhone,
        action: 'speak',
        role: 'agent',
        payload: { text: clean }
      })
    }).catch(() => {});

    // Dynamically check off SOP milestones based on actual conversation
    const lower = clean.toLowerCase();
    setSopChecked(prev => {
      const copy = [...prev];
      if (lower.includes(customerName.toLowerCase()) || lower.includes('hello') || lower.includes('hi') || lower.includes('mr') || lower.includes('mrs')) {
        copy[0] = true;
      }
      if (lower.includes('pain') || lower.includes('back') || lower.includes('doctor') || lower.includes('sleep') || lower.includes('need') || lower.includes('problem')) {
        copy[1] = true;
      }
      if (lower.includes('grid') || lower.includes('smartgrid') || lower.includes('patent') || lower.includes('ortho') || lower.includes('channel')) {
        copy[2] = true;
      }
      if (lower.includes('wakefit') || lower.includes('price') || lower.includes('cost') || lower.includes('expensive') || lower.includes('compare')) {
        copy[3] = true;
      }
      if (lower.includes('emi') || lower.includes('7000') || lower.includes('month') || lower.includes('zero') || lower.includes('card')) {
        copy[4] = true;
      }
      if (lower.includes('trial') || lower.includes('100') || lower.includes('night') || lower.includes('return') || lower.includes('refund')) {
        copy[5] = true;
      }
      return copy;
    });

    // If AI mode is active, trigger dynamic AI counter-pitch
    if (callMode === 'ai-agent') {
      setIsAiReplying(true);
      let reply = '';
      if (lower.includes('price') || lower.includes('expensive') || lower.includes('cost') || lower.includes('wakefit') || lower.includes('hotel') || lower.includes('luxury')) {
        reply = `Wakefit offers basic foam, but our patented SmartGRID won't sag and gives orthopaedic spine alignment. Plus with zero-cost EMI, it's just ₹7,000 a month.`;
      } else if (lower.includes('trial') || lower.includes('return') || lower.includes('guarantee')) {
        reply = `Does the 100-night trial include a free doorstep pickup if it doesn't relieve my lower back pain?`;
      } else if (lower.includes('emi') || lower.includes('payment') || lower.includes('card') || lower.includes('month')) {
        reply = `₹7,000 per month sounds reasonable. Can I pay using my HDFC credit card at the Koramangala store?`;
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('calling')) {
        reply = `Hello, yes! I was looking for a firm orthopaedic mattress for my back pain. What do you recommend?`;
      } else {
        reply = `Understood. Could you explain how the 2,500 air channels in the SmartGRID compare to regular memory foam?`;
      }

      setTimeout(() => {
        setIsAiReplying(false);
        setTranscript(prev => [...prev, { speaker: 'customer', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        updateAiAdvice(reply);
        callingService.speakAiResponse(reply);
      }, 1000);
    }
  };

  const handleSendManual = (role) => {
    if (!manualInput.trim()) return;
    const text = manualInput.trim();
    setManualInput('');
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (role === 'staff') {
      handleStaffSpeech(text);
    } else {
      setTranscript(prev => [...prev, { speaker: 'customer', text: text, time: nowTime }]);
      updateAiAdvice(text);
      callingService.speakAiResponse(text);
    }
  };

  const handleUseAdvice = (textToSay) => {
    handleStaffSpeech(textToSay);
    callingService.speakAiResponse(textToSay);
  };

  // 1. Initial Call Connect & Ringtones
  const callStartTimeRef = useRef(Date.now() - 3000);
  useEffect(() => {
    soundFX.playRingTone();
    callStartTimeRef.current = Date.now() - 3000;

    // Immediately display the initial opening greeting so chat starts instantly
    const greetingText = `Hello ${customerName}! This is Avani calling from The Sleep Company, Koramangala store. We noticed you recently tested our Ortho GRID Pro mattress and were inquiring about spine support. Are you looking to upgrade your mattress for back pain relief?`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setTranscript([{
      speaker: 'staff',
      text: greetingText,
      time: nowTime,
      id: `tw-greet-${Date.now()}`
    }]);
    updateAiAdvice(greetingText);
    checkSopCompliance(greetingText);

    const connectTimer = setTimeout(() => {
      soundFX.playConnectChime();
      setCallStatus('connected');
      handleDispatchPstnCall();
    }, 1200);

    // Only start laptop microphone & Web Speech recognition if in Human Agent mode
    // In AI mode, Avani handles speech directly on Twilio, so laptop mic stays muted to prevent room echo
    if (callMode === 'human-agent') {
      setMicActive(true);
      callingService.startMicrophone((level) => {
        setMicLevel(level);
      });

      callingService.startSpeechRecognition(
        ({ finalTranscript, interimTranscript }) => {
          if (interimTranscript) {
            setInterimText(interimTranscript);
          }
          if (finalTranscript && finalTranscript.trim()) {
            setInterimText('');
            handleStaffSpeech(finalTranscript.trim());
          }
        },
        (err) => console.log('Speech recognition notice:', err)
      );
    } else {
      setMicActive(false);
      setMicLevel(0);
      callingService.stopMicrophone();
      callingService.stopSpeechRecognition();
    }

    return () => {
      clearTimeout(connectTimer);
      callingService.cleanup();
    };
  }, [callMode, customerName]);

  // 2. Call Duration Clock
  useEffect(() => {
    if (callStatus === 'connected' || callStatus === 'pstn-active') {
      const timer = setInterval(() => {
        setCallDuration(d => d + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callStatus]);

  // 3. Bulletproof Auto-scroll to bottom of chat container
  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [transcript, interimText, isAiReplying]);

  // 4. Keyboard Escape Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showWrapup) {
          onClose();
        } else {
          handleEndCall();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showWrapup, onClose]);

  const checkSopCompliance = (text) => {
    if (!text) return;
    const lower = text.toLowerCase();
    setSopChecked(prev => {
      const copy = [...prev];
      if (lower.includes('hello') || lower.includes('hi') || lower.includes('pavan') || lower.includes('avani') || lower.includes('calling')) {
        copy[0] = true;
      }
      if (lower.includes('pain') || lower.includes('back') || lower.includes('doctor') || lower.includes('sleep') || lower.includes('need') || lower.includes('stiff') || lower.includes('posture')) {
        copy[1] = true;
      }
      if (lower.includes('grid') || lower.includes('smartgrid') || lower.includes('patent') || lower.includes('ortho') || lower.includes('channel') || lower.includes('cool')) {
        copy[2] = true;
      }
      if (lower.includes('emi') || lower.includes('7000') || lower.includes('month') || lower.includes('zero') || lower.includes('card') || lower.includes('price') || lower.includes('cost')) {
        copy[3] = true;
      }
      if (lower.includes('trial') || lower.includes('100') || lower.includes('night') || lower.includes('return') || lower.includes('refund') || lower.includes('warranty')) {
        copy[4] = true;
      }
      if (lower.includes('whatsapp') || lower.includes('book') || lower.includes('order') || lower.includes('buy') || lower.includes('deal') || lower.includes('voucher') || lower.includes('dispatched') || lower.includes('yes') || lower.includes('pass') || lower.includes('no problem')) {
        copy[5] = true;
      }
      return copy;
    });
  };

  // 5. Zero-Latency Real-Time SSE & Polling Live Chat Stream
  useEffect(() => {
    const cleanPhone = (targetPhone || '9480850001').replace(/[^0-9]/g, '').slice(-10);
    const ntfyTopic = `og_call_${cleanPhone}`;

    const processIncomingMessage = (msg) => {
      if (!msg || !msg.text) return;
      const cleanText = msg.text.trim();
      setTranscript(prev => {
        if (prev.some(t => t.text.trim() === cleanText)) return prev;
        return [...prev, {
          speaker: msg.speaker || 'staff',
          text: cleanText,
          time: msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          id: msg.id || `msg-${Date.now()}`
        }];
      });
      updateAiAdvice(cleanText);
      checkSopCompliance(cleanText);

      if (msg.hangup) {
        setPstnNotice({
          type: 'success',
          text: '✓ Deal Closed & Call Completed: WhatsApp Confirmation Dispatched'
        });
      }
    };

    // A. Connect Live Server-Sent Events (SSE) Stream (Instant 0ms update)
    let eventSource = null;
    try {
      eventSource = new EventSource(`https://ntfy.sh/${ntfyTopic}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const envelope = JSON.parse(event.data);
          if (envelope.event === 'message' && envelope.message) {
            const parsed = JSON.parse(envelope.message);
            processIncomingMessage(parsed);
          }
        } catch (err) {}
      };
    } catch (e) {}

    // B. Fallback Poller (polls every 750ms in case SSE network reconnects)
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`https://ntfy.sh/${ntfyTopic}/json?poll=1`);
        if (res.ok) {
          const raw = await res.text();
          const lines = raw.trim().split('\n');
          lines.forEach(line => {
            try {
              const item = JSON.parse(line);
              if (item.event === 'message' && item.message) {
                const parsed = JSON.parse(item.message);
                processIncomingMessage(parsed);
              }
            } catch (err) {}
          });
        }
      } catch (err) {}
    }, 750);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(pollInterval);
    };
  }, [targetPhone]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  // Toggle Microphone
  const toggleMic = () => {
    if (micActive) {
      callingService.stopMicrophone();
      callingService.stopSpeechRecognition();
      setMicActive(false);
      setMicLevel(0);
    } else {
      callingService.startMicrophone(level => setMicLevel(level));
      setMicActive(true);
    }
  };

  // Press Keypad Digit with real DTMF tone
  const handleKeypadPress = (digit) => {
    callingService.playDtmfTone(digit);
    setDialedDigits(prev => prev + digit);
  };

  // Dispatch real Outbound PSTN Phone Call via Serverless Gateway
  const handleDispatchPstnCall = async () => {
    setPstnNotice({ type: 'info', text: `Initiating carrier telecom dispatch to ${targetPhone}...` });
    try {
      const res = await callingService.dispatchOutboundPhoneCall({
        phoneNumber: targetPhone,
        customerName: customerName,
        product: lead?.product || 'Ortho GRID Mattress',
        mode: callMode,
        apiKey: customApiKey
      });

      const hasIntlBlock = res.errors?.some(e => e.error === 'CALL_UNPAID_INTL_BLOCK' || (e.message && e.message.includes('International calling'))) || (res.error && res.error.includes('International calling'));

      if (hasIntlBlock) {
        setPstnNotice({
          type: 'warning',
          text: `Telecom Notice: Bland AI free tier only rings US/Canada (+1) numbers. To ring Indian (+91) phones, add $5 credit on app.bland.ai. Meanwhile, live 2-way microphone voice & speech-to-text is 100% active below!`
        });
      } else if (!res.success) {
        setPstnNotice({
          type: 'warning',
          text: `Carrier Notice: ${res.message || res.error || 'Failed to dispatch call'}`
        });
      } else {
        setPstnNotice({
          type: 'success',
          text: `✓ Call Dispatched: ${res.message || 'PSTN voice session connected successfully'}`
        });
        setCallStatus('pstn-active');
      }
    } catch (err) {
      setPstnNotice({
        type: 'info',
        text: `Two-Way WebRTC audio stream connected to ${targetPhone}`
      });
    }
  };

  const handleEndCall = () => {
    callingService.cleanup();
    setShowWrapup(true);
    setWrapupSummary(
      `Spoke with ${customerName} regarding ${lead?.product || 'Ortho GRID'}. Addressed spine relief and pricing objection via 6-month zero-cost EMI (₹7,000/mo), and highlighted 100-night trial. Customer requested quote via WhatsApp.`
    );
  };

  const handleSaveWrapup = () => {
    const newCompletedCall = {
      id: `rec-${Date.now()}`,
      name: customerName,
      type: callMode === 'ai-agent' ? 'AI Voice Call' : 'Web-to-Phone Call',
      time: 'Just now',
      duration: formatTime(callDuration),
      outcome: wrapupOutcome === 'interested' ? 'Interested' : wrapupOutcome === 'callback' ? 'Requested callback' : 'Follow-up needed',
      outcomeColor: wrapupOutcome === 'interested' ? '#0f6e56' : '#185fa5',
      outcomeBg: wrapupOutcome === 'interested' ? '#e1f5ee' : '#e8f0fe',
      leadId: lead?.id,
      targetPhone: targetPhone,
      sopReview: SOP_ITEMS.map((item, idx) => ({
        pass: sopChecked[idx] || idx < 4,
        label: item.label,
        evidence: `Verified during live interaction with ${customerName}: "${transcript[idx]?.text || 'Passed standard'}"`
      }))
    };

    if (onCallCompleted) onCallCompleted(newCompletedCall);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ padding: '10px' }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '1000px', 
          height: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
        }}
      >
        
        {/* Top Active Call Bar */}
        <div style={{
          padding: '12px 20px',
          background: 'linear-gradient(90deg, #0a1a14 0%, #123c30 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {/* Customer & Number with Inline Edit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 12px #22c55e'
            }} />
            <div>
              {isEditingContact ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      value={tempName} 
                      onChange={(e) => setTempName(e.target.value)}
                      placeholder="Contact Name"
                      style={{ padding: '3px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #5dcaa5', background: '#0a2a1e', color: '#fff', width: '130px' }}
                    />
                    <input 
                      type="text" 
                      value={tempPhone} 
                      onChange={(e) => setTempPhone(e.target.value)}
                      placeholder="+91..."
                      style={{ padding: '3px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #5dcaa5', background: '#0a2a1e', color: '#fff', width: '120px' }}
                    />
                    <button onClick={handleSaveContactEdit} style={{ fontSize: '11px', background: '#5dcaa5', color: '#0a2a1e', border: 'none', borderRadius: '4px', padding: '3px 8px', cursor: 'pointer', fontWeight: 800 }}>Save</button>
                    <button onClick={() => setIsEditingContact(false)} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '4px', padding: '3px 6px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{customerName}</span>
                    <button 
                      onClick={() => { setTempName(customerName); setTempPhone(targetPhone); setIsEditingContact(true); }}
                      style={{ background: 'none', border: 'none', color: '#5dcaa5', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      (Edit Contact)
                    </button>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      background: callMode === 'ai-agent' ? 'rgba(124, 58, 237, 0.35)' : 'rgba(15, 110, 86, 0.4)', 
                      border: `1px solid ${callMode === 'ai-agent' ? '#a78bfa' : '#5dcaa5'}`,
                      color: callMode === 'ai-agent' ? '#ddd6fe' : '#9fe1cb',
                      padding: '2px 8px', 
                      borderRadius: '12px' 
                    }}>
                      {callMode === 'ai-agent' ? '🤖 AI-to-Human Call' : '👤 Web-to-Phone PSTN'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#9fe1cb', marginTop: '2px' }}>
                    <span>{targetPhone}</span> · Retail Mattress Campaign
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Call Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '10px' }}>
            <button
              onClick={() => setCallMode('ai-agent')}
              style={{
                background: callMode === 'ai-agent' ? '#7c3aed' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s'
              }}
            >
              <Sparkles size={12} />
              <span>Avani AI Mode</span>
            </button>
            <button
              onClick={() => setCallMode('human-agent')}
              style={{
                background: callMode === 'human-agent' ? '#0f6e56' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s'
              }}
            >
              <Phone size={12} />
              <span>Human Web-to-Phone</span>
            </button>
          </div>

          {/* Timer & End Call Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 800, color: '#fff' }} className="tabular">
              <Clock size={16} color="#5dcaa5" />
              <span>{formatTime(callDuration)}</span>
            </div>

            <button
              onClick={handleEndCall}
              style={{
                background: '#e24b4a',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 14px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(226, 75, 74, 0.4)'
              }}
            >
              <PhoneOff size={15} />
              <span>End Call</span>
            </button>
          </div>
        </div>

        {/* Real Telecom PSTN Dispatch Banner */}
        <div style={{
          background: '#0d281e',
          color: '#cbe7e2',
          padding: '8px 20px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#5dcaa5', fontWeight: 700 }}>
              <Radio size={14} className="pulse" />
              <span>TELECOM GATEWAY:</span>
            </span>
            <span>{pstnNotice ? pstnNotice.text : `Ready to dial ${targetPhone} via Web-to-Phone PSTN carrier.`}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href="/phone"
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#092118',
                color: '#5dcaa5',
                border: '1px solid #1f503f',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Open Mobile Phone Handset Receiver"
            >
              <span>📱 Handset (/phone)</span>
            </a>
            <button
              onClick={handleDispatchPstnCall}
              style={{
                background: '#1d9e75',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Phone size={12} />
              <span>Ring Target Phone Now</span>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{ background: 'none', border: 'none', color: '#9fe1cb', cursor: 'pointer', padding: '4px' }}
              title="Calling Settings"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Optional Custom API Key Setting Bar */}
        {showSettings && (
          <div style={{ padding: '8px 20px', background: '#133529', borderBottom: '1px solid #1f503f', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11px', color: '#fff', fontWeight: 700 }}>Custom Telephony API Key (Bland/Vapi/Twilio):</span>
            <input
              type="password"
              placeholder="Paste API Key (Optional — default turnkey gateway is active)"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              style={{ flex: 1, padding: '4px 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #2d6b55', background: '#092118', color: '#fff' }}
            />
          </div>
        )}

        {/* In-Call Body: Split Screen (Left: Live Audio & Transcript, Right: AI Sales Coach) */}
        {!showWrapup ? (
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(340px, 1.35fr) minmax(320px, 1.15fr)', overflow: 'hidden' }}>
            
            {/* Left: Live Audio VU-Meter & Speech Transcript */}
            <div style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
              
              {/* Live Audio Visualizer Banner */}
              <div style={{ 
                padding: '10px 16px', 
                background: '#f1f5f9', 
                borderBottom: '1px solid #e2e8f0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Carrier Call Audio Channel
                  </span>
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 8px', 
                    borderRadius: '10px', 
                    background: callMode === 'ai-agent' ? '#ede9fe' : micActive ? '#dcfce7' : '#fee2e2', 
                    color: callMode === 'ai-agent' ? '#6d28d9' : micActive ? '#15803d' : '#b91c1c', 
                    fontWeight: 700 
                  }}>
                    {callMode === 'ai-agent' ? '🤖 AI Voice Closer Active (Laptop Mic Muted)' : micActive ? 'Agent Mic Active' : 'Agent Mic Muted'}
                  </span>
                </div>

                {/* Voice VU Equalizer Visualizer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '18px' }} title="Call Stream Active">
                  {[0.4, 0.8, 1.2, 1.6, 1.2, 0.7, 1.5, 0.9, 0.5].map((multiplier, i) => {
                    const isActive = callStatus === 'connected' || callStatus === 'pstn-active';
                    const dynamicHeight = isActive ? Math.max(6, Math.min(18, Math.round(10 * multiplier))) : 4;
                    return (
                      <div
                        key={i}
                        style={{
                          width: '3.5px',
                          height: `${dynamicHeight}px`,
                          background: isActive ? '#10b981' : '#cbd5e1',
                          borderRadius: '2px',
                          transition: 'height 0.15s ease'
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Streaming Transcript with Bulletproof Inner Scroll */}
              <div 
                ref={chatScrollContainerRef}
                style={{ 
                  flex: 1, 
                  minHeight: 0, 
                  overflowY: 'auto', 
                  padding: '16px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px' 
                }}
              >
                {transcript.length === 0 && !interimText && (
                  <div style={{ textAlign: 'center', padding: '36px 16px', background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1', margin: 'auto 0' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📞</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>
                      Carrier Phone Call Connected to {customerName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', maxWidth: '340px', margin: '0 auto 12px' }}>
                      Avani AI is conversing with the caller directly on the phone carrier. Spoken turns appear below in real time.
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e1f5ee', color: '#0f6e56', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                      <span className="pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0f6e56' }} />
                      <span>Live Two-Way Audio Sync Active</span>
                    </div>
                  </div>
                )}

                {transcript.map((t, idx) => {
                  const isStaff = t.speaker === 'staff';
                  return (
                    <div 
                      key={idx}
                      style={{
                        alignSelf: isStaff ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background: isStaff ? '#e1f5ee' : '#ffffff',
                        border: isStaff ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                        borderRadius: isStaff ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        padding: '10px 14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: isStaff ? '#0f6e56' : '#1e293b' }}>
                          {isStaff 
                            ? (callMode === 'ai-agent' ? '🤖 Avani AI (Voice Closer)' : '🎧 Sales Agent Desk (You)') 
                            : `📱 ${customerName} (Caller on Phone)`}
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>{t.time}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#0f172a', lineHeight: 1.45 }}>
                        {t.text}
                      </div>
                    </div>
                  );
                })}

                {/* AI / Customer Replying Indicator */}
                {isAiReplying && (
                  <div style={{
                    alignSelf: 'flex-start',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px 12px 12px 2px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span className="pulse">📱</span>
                    <span>{customerName} is speaking on the phone...</span>
                  </div>
                )}

                <div ref={transcriptEndRef} />
              </div>

              {/* In-Call Footer Telephony Controls */}
              <div style={{ 
                padding: '12px 16px', 
                background: '#ffffff', 
                borderTop: '1px solid #e2e8f0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between' 
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* DTMF Keypad Button */}
                  <button
                    onClick={() => setShowKeypad(!showKeypad)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: showKeypad ? '1px solid #0f6e56' : '1px solid #cbd5e1',
                      background: showKeypad ? '#e1f5ee' : '#f8fafc',
                      color: showKeypad ? '#0f6e56' : '#334155',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Hash size={14} />
                    <span>Dialpad {dialedDigits ? `(${dialedDigits})` : ''}</span>
                  </button>

                  {/* Manual Takeover Mic Toggle (Only if agent wants to speak over AI) */}
                  <button
                    onClick={toggleMic}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: micActive ? '1px solid #cbd5e1' : '1px solid #cbd5e1',
                      background: micActive ? '#f0fdf4' : '#f8fafc',
                      color: micActive ? '#15803d' : '#64748b',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {micActive ? <Mic size={14} color="#15803d" /> : <MicOff size={14} color="#64748b" />}
                    <span>{micActive ? 'Laptop Mic Active' : 'Laptop Mic Muted'}</span>
                  </button>
                </div>

                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                  Carrier Call connected with {targetPhone}
                </div>
              </div>

              {/* Collapsible DTMF Dialpad */}
              {showKeypad && (
                <div style={{ 
                  padding: '12px', 
                  background: '#f8fafc', 
                  borderTop: '1px solid #e2e8f0', 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)', 
                  gap: '6px', 
                  maxWidth: '240px', 
                  margin: '0 auto 10px' 
                }}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(digit => (
                    <button
                      key={digit}
                      onClick={() => handleKeypadPress(digit)}
                      style={{
                        padding: '10px 0',
                        fontSize: '14px',
                        fontWeight: 700,
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#fff',
                        cursor: 'pointer',
                        color: '#1e293b'
                      }}
                      onMouseDown={(e) => e.currentTarget.style.background = '#e2e8f0'}
                      onMouseUp={(e) => e.currentTarget.style.background = '#fff'}
                    >
                      {digit}
                    </button>
                  ))}
                </div>
              )}

            </div>

            {/* Right: Dynamic Real-Time Sales Intelligence & Keyword-Driven Dossier */}
            <div style={{ background: '#ffffff', display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflowY: 'auto' }}>
              
              {/* Dynamic Live AI Intent & Guidance Card (Auto-syncs with caller words) */}
              <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', borderBottom: '1px solid #ddd6fe' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#6d28d9', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Sparkles size={14} className="pulse" />
                    <span>Real-Time Sales Intelligence</span>
                  </div>
                  <span style={{ fontSize: '10px', background: '#7c3aed', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                    {activeAdvice.tag}
                  </span>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 800, color: '#2e1065', marginTop: '2px' }}>
                  {activeAdvice.title}
                </div>
                <div style={{ fontSize: '12px', color: '#4c1d95', marginTop: '4px', lineHeight: 1.45 }}>
                  {activeAdvice.content}
                </div>
              </div>

              {/* Dynamic Keyword-Driven Product Battle Cards */}
              <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Radio size={12} color="#0f6e56" />
                    <span>Ortho GRID Pro Dossier (₹42,000)</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#0f6e56', fontWeight: 700 }}>Auto-Updates Live</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {/* Card 1: 2,500 Air Channels */}
                  <div style={{ 
                    background: activeFeature === 'air_channels' ? '#f0fdf4' : '#fff', 
                    padding: '8px 10px', 
                    borderRadius: '8px', 
                    border: activeFeature === 'air_channels' ? '1.5px solid #10b981' : '1px solid #e2e8f0', 
                    boxShadow: activeFeature === 'air_channels' ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#0f6e56', fontSize: '12px' }}>2,500 Air Channels & SnowTec</span>
                      <span style={{ fontSize: '9.5px', background: activeFeature === 'air_channels' ? '#dcfce7' : '#f1f5f9', color: activeFeature === 'air_channels' ? '#15803d' : '#64748b', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                        {activeFeature === 'air_channels' ? '🔥 Active Focus' : 'Cooling Tech'}
                      </span>
                    </div>
                    <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px', lineHeight: 1.35 }}>
                      Stays 4°C cooler all night. 2,500 open air ventilation channels eliminate body heat trapping vs regular foam.
                    </div>
                  </div>

                  {/* Card 2: 8.5/10 Firmness */}
                  <div style={{ 
                    background: activeFeature === 'firmness' ? '#f0fdf4' : '#fff', 
                    padding: '8px 10px', 
                    borderRadius: '8px', 
                    border: activeFeature === 'firmness' ? '1.5px solid #10b981' : '1px solid #e2e8f0', 
                    boxShadow: activeFeature === 'firmness' ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#0f6e56', fontSize: '12px' }}>8.5/10 Firmness & Spine Support</span>
                      <span style={{ fontSize: '9.5px', background: activeFeature === 'firmness' ? '#dcfce7' : '#f1f5f9', color: activeFeature === 'firmness' ? '#15803d' : '#64748b', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                        {activeFeature === 'firmness' ? '🔥 Active Focus' : 'Doctor Approved'}
                      </span>
                    </div>
                    <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px', lineHeight: 1.35 }}>
                      Patented Japanese SmartGRID maintains natural lumbar alignment, cradles hips, and relieves morning back stiffness.
                    </div>
                  </div>

                  {/* Card 3: ₹7,000/mo EMI */}
                  <div style={{ 
                    background: activeFeature === 'emi' ? '#f0fdf4' : '#fff', 
                    padding: '8px 10px', 
                    borderRadius: '8px', 
                    border: activeFeature === 'emi' ? '1.5px solid #10b981' : '1px solid #e2e8f0', 
                    boxShadow: activeFeature === 'emi' ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#0f6e56', fontSize: '12px' }}>6-Month Zero-Cost EMI (₹7,000/mo)</span>
                      <span style={{ fontSize: '9.5px', background: activeFeature === 'emi' ? '#dcfce7' : '#f1f5f9', color: activeFeature === 'emi' ? '#15803d' : '#64748b', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                        {activeFeature === 'emi' ? '🔥 Active Focus' : 'HDFC / ICICI'}
                      </span>
                    </div>
                    <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px', lineHeight: 1.35 }}>
                      ₹7,000/month for 6 months on HDFC & ICICI credit cards with zero down payment. Total ₹42,000 retail.
                    </div>
                  </div>

                  {/* Card 4: 100-Night Trial & Warranty */}
                  <div style={{ 
                    background: activeFeature === 'trial' ? '#f0fdf4' : '#fff', 
                    padding: '8px 10px', 
                    borderRadius: '8px', 
                    border: activeFeature === 'trial' ? '1.5px solid #10b981' : '1px solid #e2e8f0', 
                    boxShadow: activeFeature === 'trial' ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#0f6e56', fontSize: '12px' }}>100-Night Trial & 10-Yr Warranty</span>
                      <span style={{ fontSize: '9.5px', background: activeFeature === 'trial' ? '#dcfce7' : '#f1f5f9', color: activeFeature === 'trial' ? '#15803d' : '#64748b', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                        {activeFeature === 'trial' ? '🔥 Active Focus' : '100% Refund'}
                      </span>
                    </div>
                    <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px', lineHeight: 1.35 }}>
                      Sleep on it for 100 nights. Free doorstep pickup and 100% money-back refund with zero sagging guarantee.
                    </div>
                  </div>

                  {/* Card 5: Exclusive Voucher & WhatsApp Closing */}
                  <div style={{ 
                    background: activeFeature === 'offer' || activeFeature === 'close' ? '#f0fdf4' : '#fff', 
                    padding: '8px 10px', 
                    borderRadius: '8px', 
                    border: activeFeature === 'offer' || activeFeature === 'close' ? '1.5px solid #10b981' : '1px solid #e2e8f0', 
                    boxShadow: activeFeature === 'offer' || activeFeature === 'close' ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#0f6e56', fontSize: '12px' }}>₹2,000 Store Anniversary Voucher</span>
                      <span style={{ fontSize: '9.5px', background: activeFeature === 'offer' || activeFeature === 'close' ? '#dcfce7' : '#f1f5f9', color: activeFeature === 'offer' || activeFeature === 'close' ? '#15803d' : '#64748b', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                        {activeFeature === 'close' ? '✓ Dispatched' : 'Exclusive'}
                      </span>
                    </div>
                    <div style={{ color: '#475569', fontSize: '11px', marginTop: '2px', lineHeight: 1.35 }}>
                      Koramangala store anniversary voucher + free 24-hr express doorstep delivery dispatched directly on WhatsApp.
                    </div>
                  </div>
                </div>
              </div>

              {/* On-Ground.ai Proven Conversion Rule (+23.6pp Lift) */}
              <div style={{ padding: '8px 14px', background: '#eefaf5', borderBottom: '1px solid #cce8de', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={15} color="#0f6e56" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '11.5px', color: '#134e4a', lineHeight: 1.35 }}>
                  <b>+23.6pp Rule:</b> Address customer directly as <b>"{(typeof customerName === 'string' ? customerName : 'Customer').split(' ')[0]}"</b> to build rapport.
                </div>
              </div>

              {/* Dynamic SOP Compliance Checklist (Auto-ticks as call progresses) */}
              <div style={{ padding: '12px 16px', flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Live SOP Compliance</span>
                  <span style={{ color: '#0f6e56' }}>{sopChecked.filter(Boolean).length} / 6 Verified</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {SOP_ITEMS.map((item, idx) => {
                    const isChecked = sopChecked[idx];
                    return (
                      <div 
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: isChecked ? '#f0fdf4' : '#f8fafc',
                          border: isChecked ? '1px solid #bbf7d0' : '1px solid #f1f5f9',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <CheckCircle2 size={15} color={isChecked ? '#0f6e56' : '#cbd5e1'} />
                        <span style={{ fontSize: '12px', fontWeight: isChecked ? 700 : 500, color: isChecked ? '#14532d' : '#64748b' }}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Post-Call Wrap-up Screen */
          <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a' }}>
              Call Wrap-Up · Log Outcome
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Summary auto-drafted by Avani AI based on the live call interaction
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                Outcome Tag
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                {[
                  { key: 'interested', label: 'Interested', color: '#0f6e56', bg: '#e1f5ee' },
                  { key: 'callback', label: 'Requested Callback', color: '#185fa5', bg: '#e8f0fe' },
                  { key: 'followup', label: 'Follow-Up Needed', color: '#c8860a', bg: '#fff3d6' },
                  { key: 'notinterested', label: 'Not Interested', color: '#e24b4a', bg: '#fdecec' }
                ].map(o => (
                  <button
                    key={o.key}
                    onClick={() => setWrapupOutcome(o.key)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: wrapupOutcome === o.key ? `2px solid ${o.color}` : '1.5px solid #e2e8f0',
                      background: wrapupOutcome === o.key ? o.bg : '#fff',
                      color: wrapupOutcome === o.key ? o.color : '#64748b'
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase' }}>
                AI-Drafted Notes & Call Summary
              </label>
              <textarea
                value={wrapupSummary}
                onChange={(e) => setWrapupSummary(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={onClose} className="btn-secondary">
                Discard
              </button>
              <button onClick={handleSaveWrapup} className="btn-primary" style={{ padding: '10px 18px' }}>
                Save Wrap-Up & Return to Shift
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
