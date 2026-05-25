export const initialLeads = [
  { id: "L-1001", name: "Aarav Sharma", source: "Website", stage: "Enquiry", followUp: "2026-05-25" },
  { id: "L-1002", name: "Fatima Khan", source: "Walk-in", stage: "Demo Booked", followUp: "2026-05-26" },
];

export const initialStudents = [
  { id: "S-2201", name: "Neha Verma", className: "BSc CS - Sem 2", attendance: 94 },
  { id: "S-2202", name: "Vikram Rao", className: "Grade 10 - A", attendance: 88 },
];


export const initialAttendance = [
  { id: "A-1", className: "Grade 10 - A", present: 28, total: 30, date: "2026-05-25" },
  { id: "A-2", className: "BSc CS - Sem 2", present: 46, total: 50, date: "2026-05-25" },
];

export const initialInvoices = [
  { id: "INV-1001", student: "Neha Verma", amount: 1200, status: "Paid" },
  { id: "INV-1002", student: "Vikram Rao", amount: 900, status: "Pending" },
];

export const initialMessages = [
  { id: "MSG-1", channel: "WhatsApp", audience: "Parents", text: "Attendance alert sent" },
  { id: "MSG-2", channel: "Email", audience: "Students", text: "Fee reminder sent" },
];


export const initialSubjects = [
  { id: "SUB-1", name: "Mathematics", className: "Grade 10 - A", teacher: "Ritika Das" },
  { id: "SUB-2", name: "Data Structures", className: "BSc CS - Sem 2", teacher: "Aman Joshi" },
];

export const initialTimetable = [
  { id: "TT-1", day: "Monday", period: "09:00-10:00", className: "Grade 10 - A", subject: "Mathematics" },
  { id: "TT-2", day: "Tuesday", period: "10:00-11:00", className: "BSc CS - Sem 2", subject: "Data Structures" },
];

export const initialExams = [
  { id: "EX-1", name: "Mid Term", className: "Grade 10 - A", subject: "Mathematics", maxMarks: 100 },
  { id: "EX-2", name: "Internal 1", className: "BSc CS - Sem 2", subject: "Data Structures", maxMarks: 50 },
];


export const initialTransport = [
  { id: "TR-1", route: "North Route", vehicle: "Bus 12", driver: "R. Singh" },
  { id: "TR-2", route: "City Center", vehicle: "Bus 08", driver: "M. Khan" },
];

export const initialHostel = [
  { id: "HS-1", student: "Neha Verma", room: "A-102", status: "Allocated" },
  { id: "HS-2", student: "Vikram Rao", room: "B-210", status: "Allocated" },
];

export const initialLibrary = [
  { id: "LB-1", book: "Physics Vol-1", student: "Aarav Sharma", dueDate: "2026-06-01" },
  { id: "LB-2", book: "Data Algorithms", student: "Sara Ali", dueDate: "2026-06-03" },
];

export const initialPayroll = [
  { id: "PR-1", staff: "Ritika Das", month: "May 2026", amount: 1200 },
  { id: "PR-2", staff: "Aman Joshi", month: "May 2026", amount: 1350 },
];

export const initialInventory = [
  { id: "IN-1", item: "Projector", quantity: 8, status: "Available" },
  { id: "IN-2", item: "Lab PC", quantity: 42, status: "In Use" },
];


export const initialAiInsights = [
  { id: "AI-1", type: "Dropout Risk", target: "Grade 10 - A", score: "Medium" },
  { id: "AI-2", type: "Weak Subject", target: "BSc CS - Sem 2", score: "Data Structures" },
];

export const initialAutomation = [
  { id: "AU-1", rule: "Low attendance alert", channel: "WhatsApp", status: "Active" },
  { id: "AU-2", rule: "Fee due reminder", channel: "Email", status: "Active" },
];

export const initialPredictiveFlags = [
  { id: "PF-1", category: "Fee Risk", entity: "Vikram Rao", level: "High" },
  { id: "PF-2", category: "Dropout Risk", entity: "Aarav Sharma", level: "Medium" },
];
