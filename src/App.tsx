import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { UIContextProvider } from './context/UIContext'
import AIChat from './features/ai-chat'
import LoginPage from './features/auth/LoginPage'
import SignupPage from './features/auth/SignupPage'
import DashboardLayout from './features/dashboard/components/DashboardLayout'
import ProjectDetail from './features/projects/components/ProjectDetail'
import ProjectGrid from './features/projects/components/ProjectGrid'

function App() {
  return (
    <AuthProvider>
      <UIContextProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            element={
              <ProtectedRoute requiredRoles={['viewer', 'engineer', 'admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<ProjectGrid />} />
            <Route path="/projects" element={<ProjectGrid />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route
              path="/reports"
              element={<div className="text-center py-10 text-gray-500">گزارش‌ها - در حال توسعه</div>}
            />
            <Route path="/ai-agent" element={<AIChat />} />
            <Route
              path="/settings"
              element={<div className="text-center py-10 text-gray-500">تنظیمات - در حال توسعه</div>}
            />
          </Route>
        </Routes>
      </UIContextProvider>
    </AuthProvider>
  )
}

export default App
