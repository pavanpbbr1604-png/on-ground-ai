// Vercel Serverless Function: Real-time WebRTC Signaling & Telephony Sync
// Bridges Call Centre Agent Desk <-> Mobile Phone Handset via Phone Number

// Global in-memory cache for signaling messages across polling/long-polling
if (!global.callSessions) {
  global.callSessions = {};
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { phone = '9480850001', action, payload, role } = req.body || req.query || {};
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

  if (!global.callSessions[cleanPhone]) {
    global.callSessions[cleanPhone] = {
      phone: cleanPhone,
      status: 'idle', // 'ringing' | 'connected' | 'ended'
      agentMessages: [],
      customerMessages: [],
      agentAudioLevel: 0,
      customerAudioLevel: 0,
      offer: null,
      answer: null,
      iceCandidates: [],
      updatedAt: Date.now()
    };
  }

  const session = global.callSessions[cleanPhone];

  // 1. POST: Agent or Customer sends signal/message/status
  if (req.method === 'POST') {
    if (action === 'ring') {
      session.status = 'ringing';
      session.callerName = payload?.callerName || 'The Sleep Company · Retail Desk';
      session.product = payload?.product || 'Ortho GRID Pro Mattress';
      session.offer = payload?.offer || null;
      session.agentMessages = [];
      session.customerMessages = [];
      session.updatedAt = Date.now();
    } else if (action === 'accept') {
      session.status = 'connected';
      session.answer = payload?.answer || null;
      session.updatedAt = Date.now();
    } else if (action === 'end') {
      session.status = 'ended';
      session.offer = null;
      session.answer = null;
      session.updatedAt = Date.now();
    } else if (action === 'speak') {
      const msg = {
        speaker: role || 'customer',
        text: payload?.text || '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
      };
      if (role === 'customer') {
        session.customerMessages.push(msg);
      } else {
        session.agentMessages.push(msg);
        session.queuedAgentPitch = payload?.text || '';
      }
      session.updatedAt = Date.now();
    } else if (action === 'level') {
      if (role === 'customer') {
        session.customerAudioLevel = payload?.level || 0;
      } else {
        session.agentAudioLevel = payload?.level || 0;
      }
    } else if (action === 'ice') {
      if (payload?.candidate) {
        session.iceCandidates.push({ role, candidate: payload.candidate });
      }
    }

    return res.status(200).json({ success: true, session });
  }

  // 2. GET: Poll current state of call session
  return res.status(200).json({
    success: true,
    session,
    serverTime: Date.now()
  });
}
