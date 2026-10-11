import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
}) => {
  const isRateLimit = message.toLowerCase().includes('rate limit') || message.includes('429')

  return (
    <div className="bg-white border border-rose-200 rounded-2xl p-8 max-w-xl mx-auto shadow-sm text-center">
      <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">
        {isRateLimit ? 'Batas Panggilan API Tercapai' : 'Gagal Memuat Data Armada'}
      </h3>

      <p className="text-sm text-slate-600 mb-6 leading-relaxed">
        {message}
      </p>

      {isRateLimit && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg p-3 mb-6 text-left">
          <p className="font-semibold mb-1">💡 Info Rate Limit MBTA API:</p>
          <p>
            API publik MBTA memiliki batas 20 permintaan per menit tanpa API key. Silakan tunggu beberapa saat sebelum mencoba kembali.
          </p>
        </div>
      )}

      {onRetry && (
        <div className="flex items-center justify-center">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      )}
    </div>
  )
}
