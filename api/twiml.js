// Vercel Serverless Function: Intelligent Sales Closer IVR & Telephony Engine
// Features: Multi-turn objection handling, deal closing, graceful exit, zero loops, robust body parsing, bulletproof cloud sync

const CLOUD_SESSION_ID = 'ff808181a09d98f701a134e2eff85385';

// Synchronize messages directly to cloud store for instantaneous cockpit display
async function syncToCloudStore(messages, hangup = false) {
  try {
    await fetch(`https://api.restful-api.dev/objects/${CLOUD_SESSION_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'call_9480850001',
        data: {
          messages: messages,
          hangup: hangup,
          updatedAt: Date.now()
        }
      })
    });
  } catch (err) {
    console.error('Cloud store sync error:', err);
  }
}

// Helper: Parse URL-encoded or JSON body across Node.js / Vercel runtimes
async function parseRequestBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }

  let raw = '';
  if (req.body) {
    if (Buffer.isBuffer(req.body)) {
      raw = req.body.toString('utf8');
    } else if (typeof req.body === 'string') {
      raw = req.body;
    }
  } else {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      raw = Buffer.concat(chunks).toString('utf8');
    } catch (e) {
      raw = '';
    }
  }

  if (!raw) return {};

  try {
    const params = new URLSearchParams(raw);
    const result = {};
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    return result;
  } catch (e) {
    try {
      return JSON.parse(raw);
    } catch (e2) {
      return {};
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml');

  const parsedBody = await parseRequestBody(req);
  const { step, phone = '9480850001' } = { ...(req.query || {}), ...parsedBody };
  const cleanPhone = String(phone).replace(/[^0-9]/g, '').slice(-10);

  // 1. Initial Greeting (Opening & Needs Discovery)
  if (!step || step === 'greet') {
    const greetingText = 'Hello Pavan! This is Avani calling from The Sleep Company, Koramangala store. We noticed you recently tested our Ortho GRID Pro mattress and were inquiring about spine support. Are you looking to upgrade your mattress for back pain relief?';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const agentMsg = {
      speaker: 'staff',
      text: greetingText,
      time: nowTime,
      id: `tw-agent-${Date.now()}`
    };

    await syncToCloudStore([agentMsg], false);

    const greetingXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="https://on-groundai.vercel.app/api/twiml?step=reply&amp;phone=${cleanPhone}" method="POST" speechTimeout="auto" timeout="6" bargeIn="true" speechModel="phone_call" language="en-IN">
    <Say voice="Polly.Aditi" language="en-IN">
      ${greetingText}
    </Say>
  </Gather>
  <Gather input="speech" action="https://on-groundai.vercel.app/api/twiml?step=reply&amp;phone=${cleanPhone}" method="POST" speechTimeout="auto" timeout="6" bargeIn="true" speechModel="phone_call" language="en-IN">
    <Say voice="Polly.Aditi" language="en-IN">
      I am listening Pavan. Please tell us what you are looking for in your mattress.
    </Say>
  </Gather>
  <Say voice="Polly.Aditi" language="en-IN">
    Thank you for your time Pavan. Have a wonderful day!
  </Say>
  <Hangup/>
</Response>`;

    return res.status(200).send(greetingXml);
  }

  // 2. Multi-turn Real-time Dialogue & Deal Closing Engine
  if (step === 'reply') {
    const userSpoken = (
      parsedBody.SpeechResult || 
      req.query?.SpeechResult || 
      parsedBody.TranscriptionText || 
      req.query?.TranscriptionText || 
      ''
    ).trim();

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Fetch existing conversation messages from cloud store
    let currentMessages = [];
    try {
      const getRes = await fetch(`https://api.restful-api.dev/objects/${CLOUD_SESSION_ID}`);
      const json = await getRes.json();
      currentMessages = json?.data?.messages || [];
    } catch (e) {
      currentMessages = [];
    }

    if (userSpoken) {
      const custMsg = {
        speaker: 'customer',
        text: userSpoken,
        time: nowTime,
        id: `tw-cust-${Date.now()}`
      };
      currentMessages.push(custMsg);
    }

    const lower = (userSpoken || '').toLowerCase();
    let replyText = '';
    let shouldHangup = false;

    // A. Customer says NO / Not Interested / Cancel / Pass
    if (lower.includes('no') || lower.includes('not interested') || lower.includes("don't want") || lower.includes('dont want') || lower.includes('cancel') || lower.includes('stop') || lower.includes('bye') || lower.includes('quit') || lower.includes('pass')) {
      const hasPreviousNo = currentMessages.filter(m => m.speaker === 'customer' && (m.text.toLowerCase().includes('no') || m.text.toLowerCase().includes('not'))).length > 1;
      if (!hasPreviousNo && !lower.includes('bye') && !lower.includes('stop') && !lower.includes('cancel')) {
        // First gentle objection counter with extra offer
        replyText = 'I completely understand Pavan. Before you decide, we have a special store anniversary offer giving an extra ₹2,000 accessory voucher and a 100-night trial with 100% money-back guarantee. Would you like to check it out on WhatsApp, or would you prefer to pass?';
      } else {
        // Customer insists on No -> Gracefully close and hang up
        replyText = 'No problem at all Pavan! Thank you so much for your time today. If your back pain ever bothers you, feel free to visit our Koramangala store or call us. Have a wonderful day!';
        shouldHangup = true;
      }
    }
    // B. Customer says YES / Agree / Buy / Proceed / WhatsApp / Book / Deal
    else if (lower.includes('whatsapp') || lower.includes('message') || lower.includes('send') || lower.includes('share') || lower.includes('quote')) {
      replyText = 'Perfect Pavan! I have dispatched the complete mattress catalogue, discount voucher, and zero-cost EMI booking quote directly to your WhatsApp at 9480850001 right now. Our team will follow up to assist you with delivery. Thank you for choosing The Sleep Company!';
      shouldHangup = true;
    }
    else if (lower.includes('yes') || lower.includes('book') || lower.includes('buy') || lower.includes('order') || lower.includes('sure') || lower.includes('proceed') || lower.includes('agree') || lower.includes('take it') || lower.includes('done') || lower.includes('close')) {
      replyText = 'Fantastic Pavan! I have locked in your Ortho GRID Pro mattress with the 6-month zero-cost EMI at ₹7,000 a month and 10-year replacement warranty. I am sending the order confirmation directly to your WhatsApp at 9480850001 right now. Thank you for choosing The Sleep Company!';
      shouldHangup = true;
    }
    // C. Customer asks about EMI / Price / Budget / Cost / Expensive / 7000 / 42000
    else if (lower.includes('emi') || lower.includes('cost') || lower.includes('price') || lower.includes('expensive') || lower.includes('wakefit') || lower.includes('budget') || lower.includes('discount') || lower.includes('month') || lower.includes('7000') || lower.includes('42000')) {
      replyText = 'The King size is ₹42,000, and we offer a 6-month zero-cost EMI on HDFC and ICICI cards at just ₹7,000 per month with zero down payment. Unlike regular foam that sags in two years, our SmartGRID has a 10-year warranty with zero sagging. Shall I book your order or send the details to your WhatsApp?';
    }
    // D. Customer asks about 2,500 Air Channels / Heat / Cooling / SnowTec
    else if (lower.includes('heat') || lower.includes('hot') || lower.includes('sweat') || lower.includes('warm') || lower.includes('channel') || lower.includes('air') || lower.includes('cool') || lower.includes('foam')) {
      replyText = 'Traditional memory foam traps body heat and gets hot. Our SmartGRID has 2,500 open air ventilation channels with SnowTec cooling fabric that keeps the mattress 4 degrees cooler all night long. Would you like to test it with our 100-night trial?';
    }
    // E. Customer asks about 100-Night Trial / Returns / Guarantee / Warranty
    else if (lower.includes('trial') || lower.includes('return') || lower.includes('refund') || lower.includes('100') || lower.includes('guarantee') || lower.includes('warranty')) {
      replyText = 'You get a 100-night risk-free trial in your home. If your back pain does not completely improve, we arrange free doorstep pickup and give you a 100% full money-back refund with zero questions asked. Shall I send the booking link to your WhatsApp?';
    }
    // F. Customer asks about Back Pain / Spine / Doctor / Firmness
    else if (lower.includes('pain') || lower.includes('back') || lower.includes('spine') || lower.includes('doctor') || lower.includes('stiff') || lower.includes('firm')) {
      replyText = 'The Ortho GRID is scientifically certified by orthopaedic doctors with 8.5 out of 10 firmness to relieve pressure on your lower spine and eliminate morning stiffness. Would you like to test it with our 100-night in-home trial, or hear about our ₹7,000 monthly zero-cost EMI?';
    }
    // G. Customer asks for Details / Features / Specifications / Offers
    else if (lower.includes('detail') || lower.includes('feature') || lower.includes('spec') || lower.includes('tell me') || lower.includes('offer') || lower.includes('voucher')) {
      replyText = 'Our Ortho GRID Pro features patented Japanese SmartGRID with 2,500 open air ventilation channels and doctor-recommended 8.5 firmness. Plus, we are offering an exclusive ₹2,000 store anniversary voucher and ₹7,000 per month zero-cost EMI. Would you like me to send the complete details to your WhatsApp?';
    }
    // H. Dynamic Fallback
    else {
      const fallbackCount = currentMessages.filter(m => m.speaker === 'staff').length;
      if (fallbackCount <= 2) {
        replyText = 'Our Ortho GRID Pro is engineered with 2,500 air channels and doctor-recommended 8.5 spine firmness. We also offer 6-month zero-cost EMI at ₹7,000 a month. Would you like me to book your order or send the details to WhatsApp?';
      } else if (fallbackCount === 3) {
        replyText = 'Pavan, would you like to take advantage of our 100-night in-home trial, or should I send the full price breakdown to your WhatsApp?';
      } else {
        replyText = 'Thank you for your time today Pavan. Feel free to visit our Koramangala store whenever you are ready. Have a wonderful day!';
        shouldHangup = true;
      }
    }

    const agentMsg = {
      speaker: 'staff',
      text: replyText,
      time: nowTime,
      id: `tw-agent-${Date.now()}`
    };
    currentMessages.push(agentMsg);

    await syncToCloudStore(currentMessages, shouldHangup);

    if (shouldHangup) {
      const closeXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="en-IN">
    ${replyText}
  </Say>
  <Hangup/>
</Response>`;
      return res.status(200).send(closeXml);
    }

    const replyXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="https://on-groundai.vercel.app/api/twiml?step=reply&amp;phone=${cleanPhone}" method="POST" speechTimeout="auto" timeout="6" bargeIn="true" speechModel="phone_call" language="en-IN">
    <Say voice="Polly.Aditi" language="en-IN">
      ${replyText}
    </Say>
  </Gather>
  <Say voice="Polly.Aditi" language="en-IN">
    Thank you for speaking with The Sleep Company, Pavan. Have a wonderful day!
  </Say>
  <Hangup/>
</Response>`;

    return res.status(200).send(replyXml);
  }

  return res.status(200).send('<Response><Hangup/></Response>');
}
