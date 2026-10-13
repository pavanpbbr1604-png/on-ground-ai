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
    const greetingXml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="en-IN">
    Hello Pavan! This is the retail desk calling from The Sleep Company regarding your visit for our Ortho GRID Pro mattress. Are you experiencing lower back pain or morning stiffness during sleep?
  </Say>
  <Gather input="speech" action="https://on-groundai.vercel.app/api/twiml?step=reply&amp;phone=${cleanPhone}" speechTimeout="auto" speechModel="phone_call" language="en-IN">
    <Pause length="3"/>
  </Gather>
  <Say voice="Polly.Aditi" language="en-IN">
    I did not hear your reply. Please tell us about your sleeping posture or press any key.
  </Say>
  <Gather input="speech" action="https://on-groundai.vercel.app/api/twiml?step=reply&amp;phone=${cleanPhone}" speechTimeout="auto" language="en-IN">
    <Pause length="3"/>
  </Gather>
</Response>`;

    // Log the agent greeting to the active laptop session
    session.agentMessages.push({
      speaker: 'staff',
      text: 'Hello Pavan! This is the retail desk calling from The Sleep Company regarding your visit for our Ortho GRID Pro mattress. Are you experiencing lower back pain or morning stiffness during sleep?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: `tw-agent-${Date.now()}`
    });

    return res.status(200).send(greetingXml);
  }

  // 2. Customer Spoke on Phone (Twilio Speech Recognition result returned)
  if (step === 'reply') {
    const userSpoken = req.body?.SpeechResult || req.query?.SpeechResult || 'Yes, I was looking for back pain support';
    const confidence = req.body?.Confidence || '0.9';

    // Push the customer's actual spoken text into the session for the laptop to display!
    session.customerMessages.push({
      speaker: 'customer',
      text: userSpoken,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: `tw-cust-${Date.now()}`
    });

    const lower = userSpoken.toLowerCase();
    let replyText = '';

    if (lower.includes('price') || lower.includes('cost') || lower.includes('expensive') || lower.includes('wakefit') || lower.includes('budget')) {
      replyText = 'Unlike regular memory foam that sags in two years, our hyper-elastic Japanese SmartGRID comes with a 10-year warranty with zero sagging. With our 6-month zero-cost EMI, it is just ₹7,000 a month on HDFC or ICICI cards.';
    } else if (lower.includes('heat') || lower.includes('hot') || lower.includes('sweat') || lower.includes('warm') || lower.includes('channel')) {
      replyText = 'Traditional memory foam traps body heat, but our SmartGRID features 2,500 open air ventilation channels paired with SnowTec cooling fabric that keeps the mattress 4 degrees cooler all night.';
    } else if (lower.includes('trial') || lower.includes('return') || lower.includes('refund') || lower.includes('100')) {
      replyText = 'You get a 100-night risk-free trial in your home. If your back pain does not completely improve, we arrange free doorstep pickup and give you a 100% full money-back refund.';
    } else {
      replyText = 'Our patented Japanese SmartGRID gives you 8.5 out of 10 firmness, engineered specifically to support your lower back and keep your spine naturally aligned. We also offer 6-month zero-cost EMI at ₹7,000 a month.';
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
  <Say voice="Polly.Aditi" language="en-IN">
    ${replyText}
  </Say>
  <Pause length="1"/>
  <Gather input="speech" action="https://on-groundai.vercel.app/api/twiml?step=reply&amp;phone=${cleanPhone}" speechTimeout="auto" speechModel="phone_call" language="en-IN">
    <Say voice="Polly.Aditi" language="en-IN">
      Would you like us to send the quotation with zero-cost EMI details directly to your WhatsApp?
    </Say>
    <Pause length="3"/>
  </Gather>
  <Say voice="Polly.Aditi" language="en-IN">
    Thank you for speaking with The Sleep Company. Have a wonderful day!
  </Say>
  <Hangup/>
</Response>`;

    return res.status(200).send(replyXml);
  }

  return res.status(200).send('<Response><Hangup/></Response>');
}
