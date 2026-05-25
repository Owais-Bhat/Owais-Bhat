import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  initialAiInsights,
  initialAttendance,
  initialAutomation,
  initialExams,
  initialHostel,
  initialInventory,
  initialInvoices,
  initialLeads,
  initialLibrary,
  initialMessages,
  initialPayroll,
  initialPredictiveFlags,
  initialStudents,
  initialSubjects,
  initialTimetable,
  initialTransport,
} from "../lib/mockData";

const STORAGE_KEY = "erp_webapp_data_v1";
const AppDataContext = createContext(null);

const defaultState = {
  leads: initialLeads,
  students: initialStudents,
  attendance: initialAttendance,
  invoices: initialInvoices,
  messages: initialMessages,
  subjects: initialSubjects,
  timetable: initialTimetable,
  exams: initialExams,
  transport: initialTransport,
  hostel: initialHostel,
  library: initialLibrary,
  payroll: initialPayroll,
  inventory: initialInventory,
  aiInsights: initialAiInsights,
  automationRules: initialAutomation,
  predictiveFlags: initialPredictiveFlags,
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function AppDataProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const prepend = (key, prefix, payload) => {
    setState((prev) => ({
      ...prev,
      [key]: [{ id: `${prefix}-${prev[key].length + 1}`, ...payload }, ...prev[key]],
    }));
  };

  const value = useMemo(
    () => ({
      ...state,
      addLead: (payload) =>
        prepend("leads", "L", {
          followUp: new Date().toISOString().slice(0, 10),
          ...payload,
        }),
      addStudent: (payload) => prepend("students", "S", payload),
      addAttendance: (payload) => prepend("attendance", "A", payload),
      addInvoice: (payload) => prepend("invoices", "INV", payload),
      addMessage: (payload) => prepend("messages", "MSG", payload),
      addSubject: (payload) => prepend("subjects", "SUB", payload),
      addTimetable: (payload) => prepend("timetable", "TT", payload),
      addExam: (payload) => prepend("exams", "EX", payload),
      addTransport: (payload) => prepend("transport", "TR", payload),
      addHostel: (payload) => prepend("hostel", "HS", payload),
      addLibrary: (payload) => prepend("library", "LB", payload),
      addPayroll: (payload) => prepend("payroll", "PR", payload),
      addInventory: (payload) => prepend("inventory", "IN", payload),
      addAiInsight: (payload) => prepend("aiInsights", "AI", payload),
      addAutomationRule: (payload) => prepend("automationRules", "AU", payload),
      addPredictiveFlag: (payload) => prepend("predictiveFlags", "PF", payload),
      resetAllData: () => setState(defaultState),
    }),
    [state]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error("useAppData must be used within AppDataProvider");
  return context;
}
