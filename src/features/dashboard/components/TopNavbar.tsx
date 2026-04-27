import { Bell, Search, ChevronDown, User } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'

const BREADCRUMB_MAP: Record<string, string> = {
  '/dashboard': 'داشبورد',
  '/projects': 'پروژه‌ها',
  '/reports': 'گزارش‌ها',
  '/ai-agent': 'هوش مصنوعی',
  '/settings': 'تنظیمات',
}

export default function TopNavbar() {
  const location = useLocation()
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
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium hidden sm:block">مدیر سیستم</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showUserMenu && (
            <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 text-sm text-right">
              <button className="w-full px-4 py-2 text-right hover:bg-gray-50 text-gray-700">پروفایل</button>
              <button className="w-full px-4 py-2 text-right hover:bg-gray-50 text-gray-700">تنظیمات</button>
              <hr className="my-1 border-gray-200" />
              <button className="w-full px-4 py-2 text-right hover:bg-gray-50 text-red-600">خروج</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
