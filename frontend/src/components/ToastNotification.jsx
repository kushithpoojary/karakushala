import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setProgress(100);
    const startTime = Date.now();
    const duration = 4000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [toast.id]);

  const typeConfig = {
    success: {
      border: 'border-emerald-300',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-pulse" />,
      barColor: 'bg-emerald-500',
      tag: 'Success (ಯಶಸ್ವಿ)'
    },
    error: {
      border: 'border-rose-300',
      badgeBg: 'bg-rose-100 text-rose-800',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 animate-bounce" />,
      barColor: 'bg-rose-500',
      tag: 'Attention'
    },
    warning: {
      border: 'border-amber-300',
      badgeBg: 'bg-amber-100 text-amber-900',
      icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
      barColor: 'bg-amber-500',
      tag: 'Notice'
    },
    info: {
      border: 'border-indigo-300',
      badgeBg: 'bg-indigo-100 text-indigo-900',
      icon: <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />,
      barColor: 'bg-indigo-500',
      tag: 'Update'
    }
  };

  const config = typeConfig[toast.type] || typeConfig.success;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-full px-3 animate-slideUp">
      <div className={`relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border ${config.border} p-4 flex items-start gap-3 shadow-earth-lg transition-all`}>
        
        {/* Leading Status Icon */}
        <div className="shrink-0 pt-0.5">
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${config.badgeBg}`}>
              {config.tag}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug break-words">
            {toast.message}
          </p>
        </div>

        {/* Dismiss Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-cream-200 transition-colors shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Animated Countdown Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-cream-200">
          <div
            className={`h-full transition-all duration-75 ${config.barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>
    </div>
  );
}
