// Pulse Collaboration, Channels, Customer Chats, and Kudos Data

export const PULSE_CHANNELS = [
  {
    id: 'ch-callcentre-team',
    name: 'callcentre-team',
    category: 'channel',
    unreadCount: 2,
    topic: 'Shift coordination & QA scores',
    needsInput: {
      id: 'input-qa-greeting',
      title: 'QA Greeting Score Under Target',
      stakeholders: '@You (Arvind R.), whole call centre shift',
      issue: 'Greeting-in-first-10s QA score is at 71% this week, below our 85% target.',
      suggestedResolution: 'Open every call with the brand greeting script: "Hello, this is [Name] from The Sleep Company..."',
      resolved: false,
      resolutionText: null
    },
    messages: [
      {
        id: 'msg-1',
        sender: 'Sunita Rao',
        initials: 'SR',
        isBot: false,
        bg: '#faeeda',
        color: '#854f0b',
        time: '2:05 PM',
        text: 'Team, please review the pinned greeting score note above. We need everyone hitting 85%+ this Friday.'
      },
      {
        id: 'msg-2',
        sender: 'You',
        initials: 'AR',
        isBot: false,
        isSelf: true,
        bg: '#1d9e75',
        color: '#ffffff',
        time: '2:10 PM',
        text: 'On it Sunita! Will ensure 100% adherence on all my calls today.'
      },
      {
        id: 'msg-3',
        sender: 'Sunita Rao',
        initials: 'SR',
        isBot: false,
        bg: '#faeeda',
        color: '#854f0b',
        time: '2:14 PM',
        text: 'Great attitude Arvind! 🌟 You are currently leading the shift in conversion rate.'
      }
    ]
  },
  {
    id: 'ch-all-stores',
    name: 'all-stores',
    category: 'channel',
    unreadCount: 0,
    topic: 'Company-wide retail updates',
    messages: [
      {
        id: 'msg-as-1',
        sender: 'Retail Ops Bot',
        initials: '📢',
        isBot: true,
        bg: '#e8f0fe',
        color: '#1d4ed8',
        time: '10:22 AM',
        text: 'New festive campaign live! Free waterproof mattress protector bundled with every King Size Ortho GRID order.'
      }
    ]
  },
  {
    id: 'ch-emi-push-nudges',
    name: 'emi-push-nudges',
    category: 'agent',
    agentName: 'EMI Push Nudge',
    icon: '💳',
    meta: 'EMI mentioned in 4/11 calls this shift (36%) — below 60% target',
    badge: 1,
    messages: [
      {
        id: 'msg-emi-1',
        sender: 'EMI Agent',
        initials: '💳',
        isBot: true,
        bg: '#f1ecff',
        color: '#7c3aed',
        time: '1:15 PM',
        text: '💡 Nudge: Customers who hear about 6-month no-cost EMI in the first 2 minutes convert 34% more often. Try introducing EMI as soon as budget is touched upon.'
      }
    ]
  },
  {
    id: 'ch-leads-escalation',
    name: 'leads-escalation',
    category: 'channel',
    unreadCount: 0,
    topic: 'Escalations requiring store manager assistance',
    messages: [
      {
        id: 'msg-esc-1',
        sender: 'Fahmy (L&D)',
        initials: 'FM',
        isBot: false,
        bg: '#e1f5ee',
        color: '#0f6e56',
        time: 'Yesterday',
        text: 'Store manager Sunita is available to co-call on high-ticket custom size inquiries.'
      }
    ]
  }
];

export const PULSE_CUSTOMER_CHATS = [
  {
    id: 'cust-1',
    name: 'Mukunda R.',
    initials: 'MK',
    phone: '+91 98765 43210',
    avatarBg: '#0f6e56',
    status: 'Hot Lead · Relayed via WhatsApp Business',
    messages: [
      { id: 'cm-1', sender: 'customer', text: 'Hi, is the Ortho GRID mattress in stock in Queen size?', time: '2:12 PM' },
      { id: 'cm-2', sender: 'staff', text: 'Yes it is! We have immediate stock for delivery within 48 hours 👍 Sending quotation link now.', time: '2:18 PM' },
      { id: 'cm-3', sender: 'system', isSystem: true, text: 'Official quotation for Ortho GRID Pro (₹42,000) sent via WhatsApp.', time: '2:19 PM' },
      { id: 'cm-4', sender: 'customer', text: 'Great. Let me check with my wife on dimensions and confirm.', time: '2:40 PM' }
    ]
  },
  {
    id: 'cust-2',
    name: 'Kavitha R.',
    initials: 'KR',
    phone: '+91 97654 32109',
    avatarBg: '#c8860a',
    status: 'Ageing · SLA at risk',
    messages: [
      { id: 'ck-1', sender: 'customer', text: 'When can I come see the hybrid mattress in your Indiranagar store?', time: '11:02 AM' },
      { id: 'ck-2', sender: 'call', isCall: true, callStatus: 'Answered', duration: '2m 14s', text: 'Call to confirm store visit slot', time: '11:15 AM' },
      { id: 'ck-3', sender: 'customer', text: 'Thanks Arvind, see you at 4:30 PM tomorrow.', time: '11:20 AM' }
    ]
  },
  {
    id: 'cust-3',
    name: 'Ali Mansoor',
    initials: 'AM',
    phone: '+91 90000 11122',
    avatarBg: '#c0392b',
    status: 'Missed Call · Not returned',
    messages: [
      { id: 'ca-1', sender: 'call', isCall: true, callStatus: 'Missed', duration: '0s', text: 'Incoming call from Ali Mansoor', time: '9:40 AM' },
      { id: 'ca-2', sender: 'system', isSystem: true, text: 'Auto-reply sent: "Sorry we missed your call. Arvind from The Sleep Company will call you back shortly."', time: '9:41 AM' }
    ]
  }
];

export const KUDOS_FEED = [
  {
    id: 'kudos-1',
    giver: 'Sunita Rao (Store Manager)',
    receiver: 'Arvind R. (You)',
    icon: '🏆',
    title: 'Top Converter of the Week',
    desc: 'Closed 8 mattress orders in 3 shifts with 100% SOP adherence on EMI disclosure!',
    time: '2h ago'
  },
  {
    id: 'kudos-2',
    giver: 'Mukunda (Founder)',
    receiver: 'Call Centre Shift A',
    icon: '⚡',
    title: 'Walk-in Recovery Milestone',
    desc: 'Recovered 4 abandoned store walk-ins within 2 hours of shopper departure.',
    time: '5h ago'
  },
  {
    id: 'kudos-3',
    giver: 'Priya Krishnan',
    receiver: 'Raju Kumar',
    icon: '🔥',
    title: 'Elev8 Recliner Cross-sell',
    desc: 'Sold bundled ergonomic accessories raising AOV by ₹14,000!',
    time: 'Yesterday'
  }
];

export const AVANI_BOT_ACTIONS = [
  { id: 'act-1', text: 'Review 3 missed calls with expected value over ₹30,000', completed: false },
  { id: 'act-2', text: 'Call back Mukunda R. regarding WhatsApp quote at 3:30 PM', completed: false },
  { id: 'act-3', text: 'Acknowledge greeting score QA feedback in #callcentre-team', completed: false }
];
