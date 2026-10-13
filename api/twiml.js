// Vercel Serverless Function: Interactive Voice Response (IVR) & Speech-to-Text for Real Twilio Phone Calls
// Handles live telephone dialogue for The Sleep Company retail campaign

if (!global.callSessions) {
  global.callSessions = {};
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'text/xml');

  const { step, phone = '9480850001' } = req.query || {};
  const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

  if (!global.callSessions[cleanPhone]) {
    global.callSessions[cleanPhone] = {
      phone: cleanPhone,
      status: 'connected',
      agentMessages: [],
      customerMessages: [],
      updatedAt: Date.now()
    };
  }

  const session = global.callSessions[cleanPhone];
  session.status = 'connected';

  // 1. If customer just answered the phone (Initial Greeting)
  if (!step || step === 'greet') {
    const greetingText = session.queuedAgentPitch || 'Hello Pavan! This is Avani calling from The Sleep Company, Koramangala store. We noticed you recently tested our Ortho GRID Pro mattress and were inquiring about back support. Are you looking to upgrade your mattress for spine relief?';
    session.queuedAgentPitch = null; // Clear after using

    const greetingXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="https://on-groundai.vercel.app/api/twiml?step=reply&amp;phone=${cleanPhone}" speechTimeout="2" timeout="8" bargeIn="true" speechModel="phone_call" language="en-IN">
    <Say voice="Polly.Aditi" language="en-IN">
      ${greetingText}
    </Say>
    <Pause length="1"/>
  </Gather>
  <Gather input="speech" action="https://on-groundai.vercel.app/api/twiml?step=reply&amp;phone=${cleanPhone}" speechTimeout="2" timeout="8" bargeIn="true" language="en-IN">
    <Say voice="Polly.Aditi" language="en-IN">
      I am listening Pavan. Please tell us what you are looking for in your mattress.
    </Say>
    <Pause length="1"/>
  </Gather>
</Response>`;

    // Log the agent greeting to the active laptop session
    session.agentMessages.push({
      speaker: 'staff',
      text: greetingText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: `tw-agent-${Date.now()}`
    });

    return res.status(200).send(greetingXml);
  }

  // 2. Customer Spoke on Phone (Twilio Speech Recognition result returned)
  if (step === 'reply') {
    const userSpoken = req.body?.SpeechResult || req.query?.SpeechResult || '';
    
    if (userSpoken && userSpoken.trim()) {
      // Push the customer's actual spoken text into the session for the laptop to display!
      session.customerMessages.push({
        speaker: 'customer',
        text: userSpoken.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        id: `tw-cust-${Date.now()}`
      });
    }

    const lower = (userSpoken || '').toLowerCase();
    let replyText = '';

    // Check if the agent queued a manual custom reply from the laptop
    if (session.queuedAgentPitch) {
      replyText = session.queuedAgentPitch;
      session.queuedAgentPitch = null;
    } else if (lower.includes('whatsapp') || lower.includes('message') || lower.includes('quote') || lower.includes('send') || lower.includes('share')) {
      replyText = 'Certainly Pavan! I will share the complete mattress catalogue, discount voucher, and zero-cost EMI quote directly to your WhatsApp at 9480850001 right away.';
    } else if (lower.includes('emi') || lower.includes('cost') || lower.includes('price') || lower.includes('expensive') || lower.includes('wakefit') || lower.includes('budget') || lower.includes('discount') || lower.includes('month') || lower.includes('7000') || lower.includes('42000')) {
      replyText = 'The King size is ₹42,000, and we offer a 6-month zero-cost EMI on HDFC and ICICI cards at just ₹7,000 per month with zero down payment. Plus, unlike cheap foam, our patented SmartGRID comes with a 10-year warranty with zero sagging.';
    } else if (lower.includes('detail') || lower.includes('feature') || lower.includes('spec') || lower.includes('tell me') || lower.includes('need') || lower.includes('give me')) {
      replyText = 'Our Ortho GRID Pro features patented Japanese SmartGRID with 2,500 open air ventilation channels and doctor-recommended 8.5 out of 10 firmness that keeps your spine naturally aligned. Would you like to hear about our ₹7,000 monthly zero-cost EMI?';
    } else if (lower.includes('trial') || lower.includes('return') || lower.includes('refund') || lower.includes('100') || lower.includes('guarantee')) {
      replyText = 'You get a 100-night risk-free trial in your home. If your back pain does not completely improve, we arrange free doorstep pickup and give you a 100% full refund with zero questions asked.';
    } else if (lower.includes('heat') || lower.includes('hot') || lower.includes('sweat') || lower.includes('warm') || lower.includes('channel') || lower.includes('air')) {
      replyText = 'Traditional memory foam traps body heat, but our SmartGRID features 2,500 open air ventilation channels paired with SnowTec cooling fabric that keeps the mattress 4 degrees cooler all night.';
    } else if (lower.includes('pain') || lower.includes('back') || lower.includes('spine') || lower.includes('doctor') || lower.includes('stiff')) {
      replyText = 'The Ortho GRID is scientifically certified by orthopaedic doctors to cradle your hips while maintaining natural lumbar support. Would you like to test it with our 100-night risk-free in-home trial?';
    } else if (lower.includes('yes') || lower.includes('okay') || lower.includes('sure') || lower.includes('hello') || lower.includes('hi')) {
      replyText = 'Wonderful Pavan! We have the Ortho GRID ready in stock at our Koramangala store with free doorstep delivery within 24 hours. Would you like to proceed with the ₹7,000 monthly zero-cost EMI?';
    } else {
      replyText = 'Our Ortho GRID mattress is engineered with 2,500 air channels and doctor-recommended 8.5 out of 10 firmness. We also offer 6-month zero-cost EMI starting at ₹7,000 a month.';
    }

    // Log the agent reply to the laptop session
    session.agentMessages.push({
      speaker: 'staff',
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: `tw-agent-${Date.now()}`
    });

    const replyXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="https://on-groundai.vercel.app/api/twiml?step=reply&amp;phone=${cleanPhone}" speechTimeout="2" timeout="8" bargeIn="true" speechModel="phone_call" language="en-IN">
    <Say voice="Polly.Aditi" language="en-IN">
      ${replyText}
    </Say>
    <Pause length="1"/>
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
