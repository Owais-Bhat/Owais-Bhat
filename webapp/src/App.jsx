import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationCenter from './components/Common/NotificationCenter';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Dashboard
import DashboardPage from './pages/Dashboard/DashboardPage';

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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <NotificationProvider>
            <NotificationCenter />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Module Routes */}
              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <StudentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fees"
                element={
                  <ProtectedRoute>
                    <FeesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute>
                    <AttendancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exams"
                element={
                  <ProtectedRoute>
                    <ExamsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lms"
                element={
                  <ProtectedRoute>
                    <LmsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/communication"
                element={
                  <ProtectedRoute>
                    <CommunicationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transport"
                element={
                  <ProtectedRoute>
                    <TransportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admissions"
                element={
                  <ProtectedRoute>
                    <AdmissionsPage />
                  </ProtectedRoute>
                }
              />

              {/* AI Routes */}
              <Route
                path="/ai-tutor"
                element={
                  <ProtectedRoute>
                    <AiTutorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/career-path"
                element={
                  <ProtectedRoute>
                    <CareerPathPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/performance-analysis"
                element={
                  <ProtectedRoute>
                    <PerformanceAnalysisPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/fee-recovery"
                element={
                  <ProtectedRoute>
                    <FeeRecoveryPage />
                  </ProtectedRoute>
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
