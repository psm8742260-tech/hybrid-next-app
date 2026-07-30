import React from 'react';
import { Home, Map as MapIcon, Music, Lock } from 'lucide-react';

interface BottomNavigationProps {
  currentScreen: 'home' | 'map' | 'entertainment' | 'vault';
  setCurrentScreen: (screen: 'home' | 'map' | 'entertainment' | 'vault') => void;
}

export default function BottomNavigation({ currentScreen, setCurrentScreen }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-2 flex justify-around shadow-lg z-50">
      <button onClick={() => setCurrentScreen('home')} className={`p-2 flex flex-col items-center gap-1 ${currentScreen === 'home' ? 'text-[#082c75]' : 'text-gray-400'}`}>
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-bold">హోమ్</span>
      </button>
      <button onClick={() => setCurrentScreen('map')} className={`p-2 flex flex-col items-center gap-1 ${currentScreen === 'map' ? 'text-[#082c75]' : 'text-gray-400'}`}>
        <MapIcon className="w-6 h-6" />
        <span className="text-[10px] font-bold">మ్యాప్</span>
      </button>
      <button onClick={() => setCurrentScreen('entertainment')} className={`p-2 flex flex-col items-center gap-1 ${currentScreen === 'entertainment' ? 'text-[#082c75]' : 'text-gray-400'}`}>
        <Music className="w-6 h-6" />
        <span className="text-[10px] font-bold">వినోదం</span>
      </button>
      <button onClick={() => setCurrentScreen('vault')} className={`p-2 flex flex-col items-center gap-1 ${currentScreen === 'vault' ? 'text-[#082c75]' : 'text-gray-400'}`}>
        <Lock className="w-6 h-6" />
        <span className="text-[10px] font-bold">వాల్ట్</span>
      </button>
    </div>
  );
}
