import { Bell, ChevronDown, LogOut, Search, User } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard': 'داشبورد',
  '/projects': 'پروژه‌ها',
  '/reports': 'گزارش‌ها',
  '/ai-agent': 'هوش مصنوعی',
  '/settings': 'تنظیمات',
}

export default function TopNavbar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const currentPage = BREADCRUMB_MAP[location.pathname] || 'پروژه'

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="text-gray-400">PIDMCO</span>
        <span className="text-gray-300">/</span>
        <span className="font-medium text-gray-800">{currentPage}</span>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute right-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="جستجو..."
            className="pr-10 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56 text-right"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(v => !v)}
            className="flex items-center gap-2 p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="hidden md:block text-right text-sm">
              <div className="font-medium text-gray-900">{user?.username || 'کاربر'}</div>
              <div className="text-xs text-gray-500">
                {user?.roles?.[0]
                  ? user.roles[0] === 'admin'
                    ? 'مدیر'
                    : user.roles[0] === 'engineer'
                      ? 'مهندس'
                      : 'بازدیدکننده'
                  : ''}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  {user?.email && <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>}
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    logout()
                  }}
                  className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  خروج از سیستم
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
