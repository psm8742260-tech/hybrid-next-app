import React, { useState, useEffect } from 'react';

interface FeatureTimerBadgeProps {
  expiresAt?: number;
  type: 'premium' | 'postpaid';
  onSimulate?: () => void;
}

export const FeatureTimerBadge: React.FC<FeatureTimerBadgeProps> = ({ expiresAt, type, onSimulate }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!expiresAt) return null;

  const diff = expiresAt - now;
  if (diff <= 0) return null;

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const pad = (n: number) => String(n).padStart(2, '0');
  
  let timeStr = '';
  if (days > 0) {
    timeStr += `${days}d `;
  }
  timeStr += `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  // Alert colors: Less than 10 minutes for temporary free access, or less than 2 days for postpaid
  const isEndingSoon = type === 'premium' ? diff < 10 * 60 * 1000 : diff < 2 * 24 * 60 * 60 * 1000;

  return (
    <div className="flex items-center gap-1 shrink-0 select-none">
      <span 
        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold tracking-tight border transition-colors ${
          isEndingSoon 
            ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' 
            : type === 'premium'
              ? 'bg-blue-50 border-blue-100 text-[#082c75]'
              : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}
      >
        <span>⏳</span>
        <span>{timeStr}</span>
        <span className="text-[7px] uppercase opacity-75 font-black hidden xs:inline ml-0.5">
          {type === 'premium' ? 'Free' : 'Postpaid'}
        </span>
      </span>

      {onSimulate && (
        <button
          type="button"
          onClick={onSimulate}
          className="text-[8px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1 py-0.5 rounded border border-slate-200 active:scale-95 transition font-extrabold cursor-pointer"
          title="సమయాన్ని 10 సెకన్లకు మార్చండి (Simulate 10s Expiry)"
        >
          ⚡ Simulate
        </button>
      )}
    </div>
  );
};
