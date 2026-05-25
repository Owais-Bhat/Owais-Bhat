import { NavLink, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import AdmissionsPage from "./pages/AdmissionsPage";
import StudentsPage from "./pages/StudentsPage";
import ModulesPage from "./pages/ModulesPage";
import AttendancePage from "./pages/AttendancePage";
import FeesPage from "./pages/FeesPage";
import CommunicationPage from "./pages/CommunicationPage";
import AcademicsPage from "./pages/AcademicsPage";
import TimetablePage from "./pages/TimetablePage";
import ExamsPage from "./pages/ExamsPage";
import TransportPage from "./pages/TransportPage";
import HostelPage from "./pages/HostelPage";
import LibraryPage from "./pages/LibraryPage";
import PayrollPage from "./pages/PayrollPage";
import InventoryPage from "./pages/InventoryPage";
import IntelligencePage from "./pages/IntelligencePage";
import AutomationPage from "./pages/AutomationPage";
import PredictivePage from "./pages/PredictivePage";

import ModuleLandingPage from "./pages/ModuleLandingPage";
import { moduleCatalog } from "./lib/modules";

const primaryNav = [
  { label: "Dashboard", to: "/" },
  { label: "Admissions", to: "/admissions" },
  { label: "Students", to: "/students" },
  { label: "Modules", to: "/modules" },
];

export default function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>ERP Suite</h1>
        <p>School / College / University</p>
        <nav>
          {primaryNav.map((item) => (
            <NavLink key={item.label} to={item.to} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} end={item.to === "/"}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="module-links">
          {moduleCatalog.slice(3).map((item) => (
            <NavLink key={item.slug} to={`/module/${item.slug}`} className={({ isActive }) => `module-link ${isActive ? "active" : ""}`}>
              {item.name}
            </NavLink>
          ))}
        </div>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/fees" element={<FeesPage />} />
          <Route path="/communication" element={<CommunicationPage />} />
          <Route path="/academics" element={<AcademicsPage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/hostel" element={<HostelPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/intelligence" element={<IntelligencePage />} />
          <Route path="/automation" element={<AutomationPage />} />
          <Route path="/predictive" element={<PredictivePage />} />

          <Route path="/module/:slug" element={<ModuleLandingPage />} />
        </Routes>
      </main>
    </div>
  );
}
