# Progress Web App

![CyberMilo](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.21-purple)
![Supabase](https://img.shields.io/badge/Supabase-Integrated-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎓 About CyberMilo

CyberMilo EduOS is a next-generation, AI-powered Education Management Operating System designed for schools, colleges, universities, and coaching centers. It provides a complete solution for managing all aspects of educational institutions with modern, intuitive interfaces powered by artificial intelligence.

### 🚀 Key Highlights

- **8 Complete Modules** - Students, Fees, Attendance, Exams, LMS, Communication, Transport, Admissions
- **4 AI-Powered Features** - Tutor, Career Path, Performance Analysis, Fee Recovery
- **Multi-Tenant SaaS** - Support for multiple institutions
- **Real-Time Updates** - Live notifications and data syncing
- **Role-Based Access** - 5 different user roles with granular permissions
- **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Glassmorphism Design** - Modern, aesthetic UI with light blue gradients
- **Scalable Architecture** - Handles 50M+ student records

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Available Routes](#available-routes)
- [Configuration](#configuration)
- [API Integration](#api-integration)
- [Contributing](#contributing)

---

## ✨ Features

### Core Modules

#### 1. **Students Management** (`/students`)
- Add, edit, and delete student records
- Track admission numbers and personal details
- Search and filter functionality
- Bulk import capabilities
- Student dashboard view

#### 2. **Fees Management** (`/fees`)
- Track fee collection and pending amounts
- Multiple fee types support
- Payment history and receipts
- Collection analytics
- Automated reminders
- Custom fee structures

#### 3. **Attendance Management** (`/attendance`)
- Daily attendance marking
- Class and subject-wise tracking
- Attendance percentage calculation
- Low attendance alerts
- Comprehensive reports

#### 4. **Exams & Results** (`/exams`)
- Exam scheduling and management
- Result publication workflow
- Grade calculation
- Merit lists and toppers
- Performance trend analysis
- Result cards generation

#### 5. **Learning Management System** (`/lms`)
- Course creation and management
- Video and document lessons
- Assignment tracking
- Submission monitoring
- Interactive content
- Progress tracking

#### 6. **Communication Center** (`/communication`)
- School announcements
- Direct messaging system
- Parent-teacher messaging
- Assignment notifications
- Holiday schedules
- Mass communication

#### 7. **Transport Management** (`/transport`)
- Route management
- Vehicle tracking
- Driver assignment
- Student-to-route mapping
- Transport fee management
- Route schedules

#### 8. **Admissions Management** (`/admissions`)
- Online application portal
- Document upload and verification
- Application status tracking
- Approval workflow
- Admission letters
- Email communications


### SkillVault Daily Practice (`/skill-vault`)
A standalone web-first planner for saved Facebook/video learning content:
- Manually add or bulk import saved video links, captions, transcripts, or notes.
- Organise items by category, skill/technique, difficulty, priority, and planned practice minutes.
- Generate a daily practice queue, copy the plan, log today’s practice, and export your local data.
- Runs in the browser with localStorage (`cybermilo_skill_vault_v1`), so it does not require Facebook API access, backend setup, or Supabase login for the standalone route.

Private Facebook saved videos should be added by link, caption, transcript, or personal notes because Facebook does not provide reliable normal API access to every private saved profile video.

### AI-Powered Features

#### 1. **AI Tutor** (`/ai-tutor`)
Interactive AI assistant for student learning:
- Subject-specific explanations
- Question answering
- Concept clarification
- Topic suggestions
- Chat history

#### 2. **Career Path Recommendation** (`/career-path`)
AI analyzes academic performance and recommends careers:
- Score-based analysis
- Multiple career suggestions
- Probability scores
- Personalized guidance
- Subject recommendations

#### 3. **Performance Analysis** (`/performance-analysis`)
Comprehensive student performance insights:
- Overall performance scoring
- Subject-wise trends
- Strengths identification
- Weakness identification
- Intervention recommendations

#### 4. **Fee Recovery Assistant** (`/fee-recovery`)
AI-driven fee collection strategies:
- Defaulter identification
- Recovery strategy generation
- Effectiveness scoring
- Payment plan suggestions
- Automated communications

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **Vite 5.4** - Build tool (lightning fast)
- **React Router 6.30** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **React Icons** - Icon library

### Backend & Database
- **Supabase** - PostgreSQL database + Auth
- **PostgreSQL** - Relational database (20 tables)
- **Supabase Realtime** - Real-time subscriptions

### AI Integration
- **OpenRouter API** - Multi-model AI access
- **Claude, GPT-4, Gemini** - Multiple AI models

### State Management
- **React Context API** - Global state (Auth, Data, Notifications)
- **Custom Hooks** - useAuth, useAppData, useNotification

### Additional Libraries
- **Axios** - HTTP client
- **date-fns** - Date utilities
- **UUID** - Unique ID generation
- **Socket.io** - WebSocket support (ready)

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 16+ and npm
```

### Installation

1. **Clone and Setup**
```bash
cd E:\Owais-Bhat\webapp
npm install --legacy-peer-deps
```

2. **Configure Environment**
```bash
# Create .env file with:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
```

3. **Setup Database**
- Open `DATABASE_SCHEMA.sql`
- Copy all SQL and run in Supabase SQL Editor
- Wait for all tables to be created

4. **Start Development**
```bash
npm run dev
```
Visit `http://localhost:5173`

### First Login
- Click "Create Account"
- Fill in details (min 8 char password)
- Get auto-logged in after registration
- Access full dashboard

---

## 📁 Project Structure

```
src/
├── pages/                    # Page components
│   ├── Auth/                # Authentication pages
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── Dashboard/           # Main dashboard
│   │   └── DashboardPage.jsx
│   ├── Modules/             # Core modules
│   │   ├── StudentsPage.jsx
│   │   ├── FeesPage.jsx
│   │   ├── AttendancePage.jsx
│   │   ├── ExamsPage.jsx
│   │   ├── LmsPage.jsx
│   │   ├── CommunicationPage.jsx
│   │   ├── TransportPage.jsx
│   │   └── AdmissionsPage.jsx
│   └── AI/                  # AI feature pages
│       ├── AiTutorPage.jsx
│       ├── CareerPathPage.jsx
│       ├── PerformanceAnalysisPage.jsx
│       └── FeeRecoveryPage.jsx
│
├── components/              # Reusable components
│   ├── Layout/
│   │   ├── TopBar.jsx      # Top navigation
│   │   ├── Sidebar.jsx     # Side navigation
│   │   ├── MainLayout.jsx  # Main layout wrapper
│   │   └── AuthLayout.jsx  # Auth page layout
│   └── Common/
│       ├── Button.jsx      # Custom button
│       ├── Input.jsx       # Form input
│       ├── Badge.jsx       # Status badge
│       ├── GlassCard.jsx   # Card component
│       ├── NotificationCenter.jsx
│       └── ProtectedRoute.jsx
│
├── context/                 # React Context
│   ├── AuthContext.jsx      # Authentication state
│   ├── AppDataContext.jsx   # App data state
│   └── NotificationContext.jsx
│
├── hooks/                   # Custom React hooks
│   ├── useAuth.js
│   ├── useAppData.js
│   └── useNotification.js
│
├── lib/                     # External libraries
│   ├── supabase.js         # Supabase client
│   └── openrouter.js       # OpenRouter API
│
├── utils/                   # Utility functions
│   └── helpers.js          # Helper functions
│
├── config/                  # Configuration
│   └── index.js            # App config
│
├── styles/                  # CSS styles
│   ├── globals.css         # Global styles
│   ├── glassmorphism.css   # Glassmorphism components
│   └── animations.css      # Animations
│
├── App.jsx                 # Root component with routing
└── main.jsx               # Entry point
```

---

## 🛣️ Available Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Require Login)

**Dashboard**
- `/dashboard` - Main dashboard

**Module Routes**
- `/students` - Student management
- `/fees` - Fees management
- `/attendance` - Attendance tracking
- `/exams` - Exams & results
- `/lms` - Learning management
- `/communication` - Communication center
- `/transport` - Transport management
- `/admissions` - Admissions management

**AI Feature Routes**
- `/ai-tutor` - AI tutor
- `/career-path` - Career recommendations
- `/performance-analysis` - Performance insights
- `/fee-recovery` - Fee recovery assistant

---

## ⚙️ Configuration

### Environment Variables (.env)
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxx
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
```

### Application Config (src/config/index.js)
- API endpoints
- Institution types
- User roles
- Color palette
- Menu structure
- Status mappings
- Date formats

---

## 🤖 API Integration

### Supabase Integration
```javascript
// Authentication
await signInUser(email, password)
await signUpUser(email, password, userData)
await signOutUser()

// Database Operations
await insertRecord(table, record)
await updateRecord(table, id, updates)
await deleteRecord(table, id)
await getRecords(table, filters)
```

### OpenRouter AI Integration
```javascript
// AI Functions Available
await callAI(prompt, model)
await admissionChatbot(question)
await generateLessonPlan(subject, class, topic)
await generateQuestionPaper(subject, class, difficulty)
await analyzeStudentRisk(studentData)
await feeRecoveryAssistant(studentData)
await generateTimetable(classData)
await recommendCareerPath(studentData)
await generateMeetingSummary(meetingNotes)
await classifyComplaint(complaintData)
await analyzePerformance(studentData)
```

---

## 🎨 Design System

### Colors
- **Primary**: `#0066FF` (Blue)
- **Accent**: `#00F0FF` (Cyan)
- **Background**: `#0F172A` (Dark Navy)
- **Success**: `#10B981` (Emerald)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)

### Components
- **GlassCard** - Frosted glass card with blur
- **Button** - Gradient button with hover effects
- **Input** - Transparent input with focus state
- **Badge** - Status indicator badge
- **NotificationCenter** - Toast notifications

### Animations
- Fade in/out
- Slide up/down/left/right
- Scale
- Bounce, pulse, glow
- Float, shimmer
- Gradient animation

---

## 👥 User Roles & Permissions

### Super Admin
- Manage all institutions
- System-wide settings
- Subscription management
- Analytics access

### Institution Admin
- Full module access
- Staff management
- Student management
- AI feature access
- Report generation

### Teacher
- Class management
- Attendance marking
- Lesson creation
- Assignment management
- Performance tracking
- AI tutor access

### Student
- Course access
- Assignment submission
- Attendance view
- Exam results
- AI tutor
- Career recommendations

### Parent
- Child monitoring
- Attendance view
- Fee tracking
- Performance view
- Messaging

---

## 📊 Database Schema

### Key Tables (20 total)
1. **user_profiles** - User accounts
2. **institutions** - School/college info
3. **students** - Student records
4. **teachers** - Staff records
5. **classes** - Class sections
6. **attendance** - Attendance logs
7. **exams** - Exam management
8. **exam_results** - Student results
9. **fees** - Fee tracking
10. **lessons** - Course content

[Full schema in DATABASE_SCHEMA.sql]

---

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📝 License

MIT License - Feel free to use for personal and commercial projects

---

## 🆘 Support

- **Documentation**: See `SETUP_GUIDE.md`
- **Issues**: Report bugs via GitHub issues
- **Questions**: Open a discussion

---

## 📈 Roadmap

### Phase 1 (Completed ✅)
- Core module pages
- AI features integration
- Authentication system
- Real-time notifications

### Phase 2 (In Progress 📅)
- Advanced analytics dashboard
- Video conferencing
- Payment gateway integration
- SMS/Email automation

### Phase 3 (Planned 🔮)
- Mobile app (React Native)
- IoT attendance (biometric)
- Blockchain certificates
- AR/VR classroom

---

## 👨‍💻 Tech Stack Details

### Why These Technologies?

**React & Vite**
- Fast development with HMR
- Modern JavaScript features
- Large ecosystem of libraries

**Supabase**
- PostgreSQL power
- Built-in authentication
- Real-time subscriptions
- Perfect for SaaS

**OpenRouter**
- Access multiple AI models
- No vendor lock-in
- Cost-effective
- Easy integration

**Tailwind CSS**
- Rapid UI development
- Consistent design system
- Highly customizable
- Great for responsive design

---

## 📞 Contact

For inquiries or support, contact: `owais.bhat2612@gmail.com`

---

**Built with ❤️ by the CyberMilo Team**

Version: 1.0.0 | Status: Production Ready | Last Updated: July 2024
