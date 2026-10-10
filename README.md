# On-Ground.ai — Call Centre Staff App (Retail)

Rebuilt from the ground up as a high-performance, modular React web application for the **Forward Deployed Engineer / Agentic Engineer** assignment at **On-Ground.ai**.

---

## 🚀 Live Demo & Quick Start

### Prerequisites
* **Node.js**: v18+ (tested on Node v24 LTS)
* **Package Manager**: npm or yarn

### Running Locally
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd on_ground.ai

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in Google Chrome on your desktop or laptop.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠️ Stack & Architectural Choices

| Technology | Selection | Why Chosen |
| :--- | :--- | :--- |
| **Framework** | **React 18 + Vite** | Explicitly preferred in the assignment brief (`"React or Angular is preferred"`). Vite provides sub-second HMR and optimized production bundles. |
| **Component Architecture** | Modular Functional Components | Decoupled into `layout/`, `dashboard/`, `plan/`, `calendar/`, `pulse/`, `dialer/`, and `leads/`. Zero monolithic spaghetti code. |
| **Styling** | Custom Design System CSS | Implements the exact design tokens from the mock: Inter typography, restrained font sizing, forest green (`#0f4d3a`, `#1d9e75`), gold rank tiers, and micro-animations. |
| **State Management** | React Hooks (`useState`, `useEffect`) | Local and lifted component state for immediate interactive feedback across calls, messages, and SOP reviews. |
| **Data Layer** | Structured Mock Data Modules | Realistic retail lead datasets based on **The Sleep Company** (mattresses, smart beds, ergonomic recliners). No external backend needed. |
| **Icons** | Lucide React | Lightweight, crisp SVG icons matching Tabler Icon geometry. |

---

## 📱 Feature & Screen Matrix

### Core Requirements
| Screen / Requirement | Status | Description & User Experience |
| :--- | :---: | :--- |
| **1. App Shell** | ✅ Complete | Collapsible sidebar with On-Ground.ai branding, active shift indicator, topbar with persistent Gold (`#1`) and Teal (`+84 pts`) rank pills, animated notification bell, and user profile badge. |
| **2. Dashboard** | ✅ Complete | Summary card with aggregate pipeline value (₹2.32L across active leads), in-queue caller wait times (Priya Iyer, Suresh Nair), shift targets, 7-day conversion/SOP charts, and prioritized task list. |
| **3. Plan: Calls to Make** | ✅ Complete | High-intent leads ranked by attractiveness score. Expandable rows showing "Story so far" journey, target product, cross-sell, EMI financing, and pagination. |
| **4. Plan: Incoming** | ✅ Complete | Missed customer calls ranked by value at stake (₹1.20L total at stake) with instant **"Call back"** action on every row. |
| **5. Plan: Recent Calls** | ✅ Complete | Historical calls with duration, outcome badges, and **one-tap SOP inspection**. |
| **6. SOP Review Modal** | ✅ Complete | Inspects calls against the 6 sales SOP checklist items with **verbatim transcript evidence quotes** justifying each pass/fail rating. |
| **7. Calendar** | ✅ Complete | Full October 2026 month grid with event indicator dots, today jump button, month switcher, and selected day callback agenda. |
| **8. Pulse Home** | ✅ Complete | Omnichannel hub with team channels, AvaniBot AI coaching action items, customer WhatsApp threads, and Kudos recognition feed. |
| **9. Channel Chat** | ✅ Complete | Slack-style feed with back button, header, chat bubbles with timestamps, interactive text sending, and pinned **"Needs your input"** card with decision buttons. |
| **10. Leads Modal** | ✅ Complete | Opens directly from the Dashboard task list. Displays customer card, ICP score, lead intent score, collapsible buying signals, and next/previous paging. |

### Bonus Implementations
* **Interactive Channel Messaging**: Send new messages in `#callcentre-team` with live UI state update.
* **"Needs Your Input" Interactive Resolution**: Click "Accept Suggested Resolution" to resolve the QA greeting score card with live feedback.
* **Interactive Live Call Simulator & Call Back**: Clicking "Place Call" or "Practise AI Call" launches a split-screen in-call cockpit with streaming real-time speech-to-text transcript on the left, and live AI Assist SOP checklist ticking off dynamically on the right, ending with an AI-drafted call wrap-up note.
* **Phone-width Responsiveness**: Fully responsive layout with mobile drawer navigation.
* **Interactive 7-Day Performance Analytics**: Toggle between *Calls Made*, *Conversions*, and *SOP Adherence %*.

---

## 🤖 AI Tooling Disclosure

In accordance with the assignment guidelines:
* **Tool Used**: Google Antigravity (powered by Gemini).
* **Role**: Used as an agentic coding pair to accelerate architectural component scaffolding, extract mock data from the static reference file into modular JSON structures, and ensure strict adherence to all rubric specifications.
* **Code Verification**: All components, styling tokens, and interaction flows were verified and built specifically for this repository submission.

---

## 📁 Repository Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx          # App sidebar navigation & shift status
│   │   │   └── Topbar.jsx           # Rank pills, notifications, profile dropdown
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx        # Main dashboard view
│   │   │   ├── KpiCards.jsx         # Pipeline value, in-queue wait times
│   │   │   ├── ActivityChart.jsx    # 7-day metric & SOP adherence chart
│   │   │   └── TasksList.jsx        # Tasks list opening Leads modal
│   │   ├── plan/
│   │   │   ├── PlanView.jsx         # Subtabs router (outgoing, incoming, recent)
│   │   │   ├── OutgoingCalls.jsx    # Ranked leads with expandable rows & paging
│   │   │   ├── IncomingCalls.jsx    # Missed calls with value at stake
│   │   │   └── RecentCalls.jsx      # Call history opening SOP reviews
│   │   ├── sopReview/
│   │   │   └── SopReviewModal.jsx   # 6 SOP steps with verbatim transcript quotes
│   │   ├── calendar/
│   │   │   └── CalendarView.jsx     # Month grid, event dots, today button
│   │   ├── pulse/
│   │   │   ├── PulseHome.jsx        # Channels, AvaniBot actions, WhatsApp, Kudos
│   │   │   ├── ChannelChat.jsx      # Channel chat with "Needs input" card
│   │   │   ├── CustomerChat.jsx     # WhatsApp business customer timeline
│   │   │   └── KudosFeed.jsx        # Team recognition feed
│   │   ├── leads/
│   │   │   └── LeadsModal.jsx       # ICP/Intent scores & collapsible buying signals
│   │   └── dialer/
│   │       └── LiveCallModal.jsx    # Live in-call simulator + AI Assist & wrap-up
│   ├── data/
│   │   ├── leadsData.js             # Retail mattress leads dataset
│   │   ├── callsData.js             # SOP steps, missed calls, transcripts
│   │   ├── pulseData.js             # Channels, messages, kudos, AI actions
│   │   └── calendarData.js          # Scheduled callbacks & appointments
│   ├── styles/
│   │   └── index.css                # On-Ground.ai design system tokens
│   ├── App.jsx                      # App root state & modal controller
│   └── main.jsx                     # Vite React entrypoint
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 📬 Submission Details

* **Author**: Pavan B.R.
* **Role**: Forward Deployed Engineer / Agentic Engineer
* **Recipient**: Mukunda Dwarkanath (`mukunda@on-ground.ai`)
* **Subject**: `Assignment Submission: Pavan B.R.`
