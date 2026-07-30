import React, { useState, useEffect } from 'react';
import { Satellite, MapPin, Activity, Power } from 'lucide-react';

export default function GPSTracker({ lat, lng }: { lat: number; lng: number }) {
  const [isActive, setIsActive] = useState(true);
  const [history, setHistory] = useState<{ time: string; lat: number; lng: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setHistory(prev => [
          { time: new Date().toLocaleTimeString(), lat, lng },
          ...prev.slice(0, 4)
        ]);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isActive, lat, lng]);

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Satellite className="w-4 h-4 text-indigo-500" />
          జిపిఎస్ ట్రాకర్ / GPS Tracker
        </h3>
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`p-2 rounded-full ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
        >
          <Power className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2 bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-bold uppercase">Lat</p>
          <p className="font-mono">{lat.toFixed(4)}</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-bold uppercase">Lng</p>
          <p className="font-mono">{lng.toFixed(4)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase">ఇటీవలి ట్రాకింగ్ / Recent Logs</p>
        <div className="space-y-1">
          {history.map((log, i) => (
            <div key={i} className="flex justify-between text-[10px] text-gray-600 font-mono bg-gray-50 p-1 rounded">
              <span>{log.time}</span>
              <span>{log.lat.toFixed(3)},{log.lng.toFixed(3)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
