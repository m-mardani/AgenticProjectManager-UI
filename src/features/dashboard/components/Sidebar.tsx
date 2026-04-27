import { Link, useLocation } from 'react-router-dom'
import { useUIContext } from '../../../context/UIContext'
import { cn } from '../../../lib/utils'
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Settings,
  Bot,
  ChevronRight,
  ChevronLeft,
  Zap,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'داشبورد', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'پروژه‌ها', icon: FolderKanban, path: '/projects' },
  { label: 'گزارش‌ها', icon: BarChart3, path: '/reports' },
  { label: 'هوش مصنوعی', icon: Bot, path: '/ai-agent' },
  { label: 'تنظیمات', icon: Settings, path: '/settings' },
]

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIContext()
  const location = useLocation()

  return (
    <aside
      className={cn(
        'flex flex-col bg-gray-900 text-white transition-all duration-300 h-screen sticky top-0',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div>
            <div className="text-sm font-bold text-white leading-tight">PIDMCO</div>
            <div className="text-xs text-gray-400 leading-tight">MC-DSS</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors text-sm font-medium',
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-gray-700 p-3">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title={sidebarCollapsed ? 'باز کردن منو' : 'بستن منو'}
        >
          {sidebarCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  )
}
