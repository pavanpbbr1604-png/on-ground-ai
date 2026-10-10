// Call Centre Sales SOP & Dialer Data

export const SOP_ITEMS = [
  { id: 'sop-1', label: 'Opening & Intent Confirm', desc: 'Introduce name and brand; confirm if it is a good time to speak' },
  { id: 'sop-2', label: 'Needs Discovery', desc: 'Ask about preferred firmness, current pain points, and room size' },
  { id: 'sop-3', label: 'Product Pitch', desc: 'Highlight patented SmartGRID pressure relief and Japanese polymer layer' },
  { id: 'sop-4', label: 'EMI / Financing Mention', desc: 'Present no-cost EMI options starting from ₹1,200/month' },
  { id: 'sop-5', label: 'Warranty & 100-Night Trial', desc: 'Mention 10-year warranty, free doorstep delivery, and 100-night trial' },
  { id: 'sop-6', label: 'Closing / Callback Booking', desc: 'Send quotation link on WhatsApp and confirm definite next step' }
];

export const INCOMING_CALLS = [
  {
    id: 'inc-1',
    name: 'Vikram Sethi',
    phone: '+91 98450 99887',
    time: '12m ago',
    expectedValue: 32000,
    signalTag: 'Visited store / in CRM',
    product: 'Tranquo Smart Reclining Chair',
    status: 'missed'
  },
  {
    id: 'inc-2',
    name: 'Ali Mansoor',
    phone: '+91 90000 11122',
    time: '45m ago',
    expectedValue: 58000,
    signalTag: 'High value inquiry',
    product: 'Elev8 Smart Adjustable Bed Frame',
    status: 'missed'
  },
  {
    id: 'inc-3',
    name: 'Sneha Patel',
    phone: '+91 98111 22334',
    time: '2h ago',
    expectedValue: 18500,
    signalTag: 'Cart Abandoned (Online)',
    product: 'ErgoSmart Executive Chair',
    status: 'missed'
  },
  {
    id: 'inc-4',
    name: 'Rajesh Kulkarni',
    phone: '+91 98760 11223',
    time: '3h ago',
    expectedValue: 12000,
    signalTag: 'New contact / Web Form',
    product: 'Ortho Luxe Pillow (x4)',
    status: 'missed'
  }
];

export const RECENT_CALLS = [
  {
    id: 'rec-1',
    name: 'Mukunda R.',
    type: 'Outgoing Call',
    time: 'Today, 2:10 PM',
    duration: '4m 32s',
    outcome: 'Interested',
    outcomeColor: '#0f6e56',
    outcomeBg: '#e1f5ee',
    leadId: 'lead-1',
    sopReview: [
      { pass: true, label: 'Opening & Intent Confirm', evidence: '"This is Arvind calling from The Sleep Company, is now an okay time to talk?"' },
      { pass: true, label: 'Needs Discovery', evidence: '"Can I ask what matters most to you — back pain relief or cooling firmness?"' },
      { pass: true, label: 'Product Pitch', evidence: '"The Ortho GRID layer dynamically isolates motion and relieves pressure at your hips."' },
      { pass: true, label: 'EMI / Financing Mention', evidence: '"We have a 6-month zero-cost EMI plan on HDFC cards if that helps."' },
      { pass: false, label: 'Warranty & 100-Night Trial', evidence: 'Agent did not mention the 10-year warranty or 100-night trial period.' },
      { pass: true, label: 'Closing / Callback Booking', evidence: '"I will send the quotation link over WhatsApp and follow up on Thursday."' }
    ]
  },
  {
    id: 'rec-2',
    name: 'Kavitha R.',
    type: 'Incoming Call',
    time: 'Today, 11:15 AM',
    duration: '2m 14s',
    outcome: 'Follow-up needed',
    outcomeColor: '#c8860a',
    outcomeBg: '#fff3d6',
    leadId: 'lead-2',
    sopReview: [
      { pass: true, label: 'Opening & Intent Confirm', evidence: '"Hi Kavitha, calling back regarding your enquiry on SmartGRID Luxe."' },
      { pass: true, label: 'Needs Discovery', evidence: '"You mentioned chronic morning stiffness — how old is your current mattress?"' },
      { pass: false, label: 'Product Pitch', evidence: 'Agent skipped to price discount before fully explaining polymer grid benefits.' },
      { pass: true, label: 'EMI / Financing Mention', evidence: '"There is a 3-month EMI option starting at ₹12,000/month."' },
      { pass: false, label: 'Warranty & 100-Night Trial', evidence: 'Warranty was not discussed during the call.' },
      { pass: false, label: 'Closing / Callback Booking', evidence: 'Call ended abruptly without locking down an appointment slot.' }
    ]
  },
  {
    id: 'rec-3',
    name: 'Harish Varma',
    type: 'Outgoing Call',
    time: 'Today, 10:05 AM',
    duration: '5m 18s',
    outcome: 'Requested callback',
    outcomeColor: '#185fa5',
    outcomeBg: '#e8f0fe',
    leadId: null,
    sopReview: [
      { pass: true, label: 'Opening & Intent Confirm', evidence: '"Good morning Harish, this is Arvind from The Sleep Company."' },
      { pass: true, label: 'Needs Discovery', evidence: '"Understood your requirement for an extra firm mattress for senior parents."' },
      { pass: true, label: 'Product Pitch', evidence: '"Our Ortho Classic provides targeted spine support with high density foam base."' },
      { pass: true, label: 'EMI / Financing Mention', evidence: '"Zero processing fee EMI is active this week."' },
      { pass: true, label: 'Warranty & 100-Night Trial', evidence: '"10-year non-prorated warranty with free doorstep setup."' },
      { pass: true, label: 'Closing / Callback Booking', evidence: '"Confirmed callback for 6:00 PM when spouse is home."' }
    ]
  },
  {
    id: 'rec-4',
    name: 'Pooja Hegde',
    type: 'Outgoing Call',
    time: 'Yesterday, 4:45 PM',
    duration: '1m 20s',
    outcome: 'Not interested',
    outcomeColor: '#e24b4a',
    outcomeBg: '#fdecec',
    leadId: null,
    sopReview: [
      { pass: true, label: 'Opening & Intent Confirm', evidence: '"Hello, calling from The Sleep Company."' },
      { pass: false, label: 'Needs Discovery', evidence: 'Customer said already purchased elsewhere; no discovery possible.' },
      { pass: false, label: 'Product Pitch', evidence: 'N/A' },
      { pass: false, label: 'EMI / Financing Mention', evidence: 'N/A' },
      { pass: false, label: 'Warranty & 100-Night Trial', evidence: 'N/A' },
      { pass: true, label: 'Closing / Callback Booking', evidence: '"Thank you for your time, marked as resolved."' }
    ]
  }
];

export const CALL_QUEUE_NOW = [
  { name: 'Priya Iyer', wait: '4m 20s', waitLevel: 'hi', intent: 'Likely delivery delay dispute — flagged prior shift' },
  { name: 'Suresh Nair', wait: '1m 50s', waitLevel: 'mid', intent: 'Plan upgrade enquiry for SmartGRID King' },
  { name: 'Ananya Roy', wait: '0m 45s', waitLevel: 'lo', intent: 'Inquiry on store demonstration in Indiranagar' }
];

export const LIVE_SIMULATION_TRANSCRIPT = [
  { time: '0:05', speaker: 'staff', text: 'Hello, this is Arvind calling from The Sleep Company. Is now a good time to speak?' },
  { time: '0:12', speaker: 'customer', text: 'Yes, hi Arvind. I was looking at your Ortho GRID mattress on the website.' },
  { time: '0:22', speaker: 'staff', text: 'Wonderful! May I ask what matters most to you right now — back pain relief or a cooler sleeping temperature?' },
  { time: '0:35', speaker: 'customer', text: 'Mainly lower back pain. I wake up stiff every morning with our old memory foam mattress.' },
  { time: '0:48', speaker: 'staff', text: 'I completely understand. The Ortho GRID Pro features our patented SmartGRID polymer layer that adapts dynamically to your spine while letting air flow freely through 2,500 channels.' },
  { time: '1:05', speaker: 'customer', text: 'That sounds promising. But ₹42,000 is quite steep for us right now.' },
  { time: '1:18', speaker: 'staff', text: 'We actually have a 6-month zero-cost EMI option with no processing fee, bringing it to just ₹7,000 per month.' },
  { time: '1:32', speaker: 'customer', text: 'What if it doesn\'t suit us after sleeping on it?' },
  { time: '1:44', speaker: 'staff', text: 'You get our risk-free 100-night trial and a full 10-year warranty. If you don\'t love it, we arrange free doorstep pickup and full refund.' },
  { time: '1:58', speaker: 'customer', text: 'That gives me peace of mind. Can you send the quote on WhatsApp?' },
  { time: '2:10', speaker: 'staff', text: 'Sending the official quote and order link to this number immediately! I will check in with you tomorrow afternoon.' }
];

export const AI_QUICK_REPLIES = [
  'Send official quote on WhatsApp',
  'Offer 6-month zero-cost EMI',
  'Highlight 100-night trial & 10-yr warranty',
  'Book store trial appointment'
];
