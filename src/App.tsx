import { Routes, Route, Navigate } from 'react-router-dom'
import { UIContextProvider } from './context/UIContext'
import DashboardLayout from './features/dashboard/components/DashboardLayout'
import ProjectGrid from './features/projects/components/ProjectGrid'
import ProjectDetail from './features/projects/components/ProjectDetail'

function App() {
  return (
    <UIContextProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<ProjectGrid />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Route>
      </Routes>
    </UIContextProvider>
  )
}

export default App
