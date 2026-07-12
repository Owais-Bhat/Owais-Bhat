import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationCenter from './components/Common/NotificationCenter';
import ProtectedRoute from './components/Common/ProtectedRoute';
import RoleGate from './components/Common/RoleGate';
import FeatureGate from './components/Common/FeatureGate';
import UsageTracker from './components/Common/UsageTracker';
import BillingGate from './components/Common/BillingGate';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';

// Dashboard
import DashboardPage from './pages/Dashboard/DashboardPage';
import AdminConsolePage from './pages/Admin/AdminConsolePage';

// Module Pages
import StudentsPage from './pages/Modules/StudentsPage';
import FeesPage from './pages/Modules/FeesPage';
import AttendancePage from './pages/Modules/AttendancePage';
import ExamsPage from './pages/Modules/ExamsPage';
import LmsPage from './pages/Modules/LmsPage';
import CommunicationPage from './pages/Modules/CommunicationPage';
import TransportPage from './pages/Modules/TransportPage';
import AdmissionsPage from './pages/Modules/AdmissionsPage';

// AI Pages
import AiTutorPage from './pages/AI/AiTutorPage';
import CareerPathPage from './pages/AI/CareerPathPage';
import PerformanceAnalysisPage from './pages/AI/PerformanceAnalysisPage';
import FeeRecoveryPage from './pages/AI/FeeRecoveryPage';

// Settings & Profile
import SettingsPage from './pages/Settings/SettingsPage';
import ProfilePage from './pages/Profile/ProfilePage';

function GuardedPage({ path, feature, billing = true, children }) {
  let page = children;

  if (feature) {
    page = <FeatureGate feature={feature}>{page}</FeatureGate>;
  }

  if (billing) {
    page = <BillingGate>{page}</BillingGate>;
  }

  return (
    <ProtectedRoute>
      <RoleGate path={path}>{page}</RoleGate>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <NotificationProvider>
            <NotificationCenter />
            <UsageTracker />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <GuardedPage path="/dashboard">
                    <DashboardPage />
                  </GuardedPage>
                }
              />
              <Route
                path="/admin"
                element={
                  <GuardedPage path="/admin" billing={false}>
                    <AdminConsolePage />
                  </GuardedPage>
                }
              />

              {/* Module Routes */}
              <Route
                path="/students"
                element={
                  <GuardedPage path="/students" feature="students">
                    <StudentsPage />
                  </GuardedPage>
                }
              />
              <Route
                path="/fees"
                element={
                  <GuardedPage path="/fees" feature="fees">
                    <FeesPage />
                  </GuardedPage>
                }
              />
              <Route
                path="/attendance"
                element={
                  <GuardedPage path="/attendance" feature="attendance">
                    <AttendancePage />
                  </GuardedPage>
                }
              />
              <Route
                path="/exams"
                element={
                  <GuardedPage path="/exams" feature="exams">
                    <ExamsPage />
                  </GuardedPage>
                }
              />
              <Route
                path="/lms"
                element={
                  <GuardedPage path="/lms" feature="lms">
                    <LmsPage />
                  </GuardedPage>
                }
              />
              <Route
                path="/communication"
                element={
                  <GuardedPage path="/communication" feature="communication">
                    <CommunicationPage />
                  </GuardedPage>
                }
              />
              <Route
                path="/transport"
                element={
                  <GuardedPage path="/transport" feature="transport">
                    <TransportPage />
                  </GuardedPage>
                }
              />
              <Route
                path="/admissions"
                element={
                  <GuardedPage path="/admissions" feature="admissions">
                    <AdmissionsPage />
                  </GuardedPage>
                }
              />

              {/* AI Routes */}
              <Route
                path="/ai-tutor"
                element={
                  <GuardedPage path="/ai-tutor" feature="ai_tutor">
                    <AiTutorPage />
                  </GuardedPage>
                }
              />
              <Route
                path="/career-path"
                element={
                  <GuardedPage path="/career-path" feature="career_path">
                    <CareerPathPage />
                  </GuardedPage>
                }
              />
              <Route
                path="/performance-analysis"
                element={
                  <GuardedPage path="/performance-analysis" feature="performance_analysis">
                    <PerformanceAnalysisPage />
                  </GuardedPage>
                }
              />
              <Route
                path="/fee-recovery"
                element={
                  <GuardedPage path="/fee-recovery" feature="fee_recovery">
                    <FeeRecoveryPage />
                  </GuardedPage>
                }
              />

              {/* Settings & Profile */}
              <Route
                path="/settings"
                element={
                  <GuardedPage path="/settings" billing={false}>
                    <SettingsPage />
                  </GuardedPage>
                }
              />
              <Route
                path="/profile"
                element={
                  <GuardedPage path="/profile" billing={false}>
                    <ProfilePage />
                  </GuardedPage>
                }
              />

              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch all - redirect to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </NotificationProvider>
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
