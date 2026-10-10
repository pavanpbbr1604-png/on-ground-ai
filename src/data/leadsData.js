// Retail Leads Dataset (The Sleep Company)
export const LEADS_DATA = [
  {
    id: 'lead-1',
    name: 'Mukunda R.',
    initials: 'MK',
    avatarBg: '#e1f5ee',
    avatarColor: '#0f6e56',
    phone: '+91 98765 43210',
    interest: 'Interested: Ortho GRID Pro (₹42,000)',
    product: 'Ortho GRID Pro Mattress, King Size',
    crossSell: 'SmartGRID Luxe Pillow (Pair) + Waterproof Protector',
    emi: '6 months no-cost EMI available (₹7,000/mo)',
    attractivenessScore: 92,
    intentScore: 94,
    icpScore: 88,
    expectedValue: 42000,
    status: 'Hot Lead · Follow-up Due',
    signals: [
      { type: 'Financing', text: 'Asked specifically about zero-cost EMI plans on HDFC/ICICI' },
      { type: 'High Intent', text: 'Visited Koramangala store 2 days ago; spent 25 mins testing mattress' },
      { type: 'Competitor Mention', text: 'Comparing with Sunday Rest latex and Wakefit Ortho' },
      { type: 'Urgency', text: 'Moving into new apartment this weekend; needs delivery by Friday' }
    ],
    journey: [
      { date: '8 Oct', text: 'Store visit at Koramangala flagship' },
      { date: '9 Oct', text: 'WhatsApp quote requested for King size 8-inch' },
      { date: '10 Oct', text: 'Callback scheduled for 3:30pm today' }
    ],
    notes: 'Very interested in spine alignment and motion isolation. Price sensitive on delivery fees.'
  },
  {
    id: 'lead-2',
    name: 'Kavitha R.',
    initials: 'KR',
    avatarBg: '#fff3d6',
    avatarColor: '#c8860a',
    phone: '+91 97654 32109',
    interest: 'Interested: SmartGRID Luxe (₹36,000)',
    product: 'SmartGRID Luxe 8-inch Queen',
    crossSell: 'All-weather Comforter',
    emi: '3 months no-cost EMI (₹12,000/mo)',
    attractivenessScore: 81,
    intentScore: 85,
    icpScore: 78,
    expectedValue: 36000,
    status: 'Ageing · SLA at risk',
    signals: [
      { type: 'Product Fit', text: 'Complained about chronic lower back ache with coir mattress' },
      { type: 'Timeline', text: 'Ready to order within 48 hours if 100-night trial is explained clearly' },
      { type: 'Objection', text: 'Hesitant about heat retention in polymer grid' }
    ],
    journey: [
      { date: '6 Oct', text: 'Web enquiry via Google Ad campaign' },
      { date: '7 Oct', text: 'Attempted call — no answer' },
      { date: '9 Oct', text: 'WhatsApp message: "Can I try before buying?"' }
    ],
    notes: 'Needs reassurance on 2500+ air channels for cooling airflow.'
  },
  {
    id: 'lead-3',
    name: 'Ali Mansoor',
    initials: 'AM',
    avatarBg: '#fdecec',
    avatarColor: '#e24b4a',
    phone: '+91 90000 11122',
    interest: 'Interested: Elev8 Smart Recliner (₹58,000)',
    product: 'Elev8 Smart Adjustable Bed Frame + Mattress',
    crossSell: 'Dual Massage Attachment',
    emi: '12 months low-cost EMI (₹5,100/mo)',
    attractivenessScore: 76,
    intentScore: 70,
    icpScore: 82,
    expectedValue: 58000,
    status: 'Missed Call · Not returned',
    signals: [
      { type: 'High Ticket', text: 'Interested in motorized anti-snore preset and zero-gravity incline' },
      { type: 'Budget', text: 'Asked if old furniture exchange discount applies' }
    ],
    journey: [
      { date: '9 Oct', text: 'Missed incoming call (9:40am)' },
      { date: '9 Oct', text: 'Auto-reply sent via WhatsApp' }
    ],
    notes: 'Elderly parents visiting next month. Prioritizes ease of remote control.'
  },
  {
    id: 'lead-4',
    name: 'Sneha Patel',
    initials: 'SP',
    avatarBg: '#e8f0fe',
    avatarColor: '#185fa5',
    phone: '+91 98111 22334',
    interest: 'Interested: ErgoSmart Chair (₹18,500)',
    product: 'ErgoSmart Executive High-Back Chair with Lumbar Support',
    crossSell: 'Footrest cushion & Desk Mat',
    emi: 'Zero EMI on credit card',
    attractivenessScore: 68,
    intentScore: 72,
    icpScore: 65,
    expectedValue: 18500,
    status: 'Warm Lead · WFH Buyer',
    signals: [
      { type: 'Ergonomics', text: 'Works 10 hours daily from home in software engineering' },
      { type: 'Comparison', text: 'Looking at Featherlite and Green Soul' }
    ],
    journey: [
      { date: '8 Oct', text: 'Cart abandonment at checkout' },
      { date: '9 Oct', text: 'WhatsApp follow-up with ₹1,000 instant coupon' }
    ],
    notes: 'Wants to confirm assembly service availability in Whitefield.'
  },
  {
    id: 'lead-5',
    name: 'Vikram Sethi',
    initials: 'VS',
    avatarBg: '#f1ecff',
    avatarColor: '#7c3aed',
    phone: '+91 98450 99887',
    interest: 'Interested: Tranquo Recliner (₹32,000)',
    product: 'Tranquo Smart Reclining Chair (Leatherette Tan)',
    crossSell: 'Protective Leather Care Kit',
    emi: '6 months no-cost EMI',
    attractivenessScore: 88,
    intentScore: 90,
    icpScore: 84,
    expectedValue: 32000,
    status: 'High Intent · Callback Requested',
    signals: [
      { type: 'Store Walk-in', text: 'Walked in to Indiranagar store, loved the multi-angle lock' },
      { type: 'Payment', text: 'Wants to pay half in cash, half via UPI' }
    ],
    journey: [
      { date: '10 Oct', text: 'Enquiry via WhatsApp store QR' }
    ],
    notes: 'Call back before 5:00 PM.'
  },
  {
    id: 'lead-6',
    name: 'Divya Sharma',
    initials: 'DS',
    avatarBg: '#e1f5ee',
    avatarColor: '#0f6e56',
    phone: '+91 99001 55443',
    interest: 'Interested: Ortho Pro Bundle (₹46,000)',
    product: 'Ortho Pro Mattress + 2 Pillows + Protector',
    crossSell: 'Silk Satin Bed Linen Set',
    emi: 'No-cost EMI 9 months',
    attractivenessScore: 85,
    intentScore: 88,
    icpScore: 80,
    expectedValue: 46000,
    status: 'Qualified · Referral',
    signals: [
      { type: 'Doctor Recommendation', text: 'Orthopedic surgeon recommended firm patented grid' }
    ],
    journey: [
      { date: '7 Oct', text: 'Referral link used from existing customer' }
    ],
    notes: 'Very high trust factor.'
  }
];
