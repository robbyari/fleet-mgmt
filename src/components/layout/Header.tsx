import React from 'react'
import { Bus } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Fleet Management System
              </h1>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Pemantauan Armada & Lokasi Real-Time Transit
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
