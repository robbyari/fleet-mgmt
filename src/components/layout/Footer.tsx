import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-1">
        <p>
          Fleet Management Demo Project &bull; Dibuat dengan React 19, TypeScript, dan Tailwind CSS.
        </p>
        <p>
          Data bersumber dari{' '}
          <a
            href="https://api-v3.mbta.com/docs/swagger/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 underline font-medium"
          >
            MBTA V3 REST API
          </a>
          .
        </p>
      </div>
    </footer>
  )
}

