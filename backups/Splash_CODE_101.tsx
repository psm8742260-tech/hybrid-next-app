import React from 'react';
import { PhoneLogin } from './AuthAndSettings';
import CWRBLogo from './CWRBLogo';

interface SplashProps {
  onComplete: () => void;
  controlState?: string;
  isLoggedIn: boolean;
  onLoginSuccess: (phoneNumber: string) => void;
  onLogout?: () => void;
  activeTab?: 'customer' | 'worker' | 'provider';
  setActiveTab?: (tab: 'customer' | 'worker' | 'provider') => void;
}

export default function Splash({ 
  onComplete, 
  isLoggedIn,
  onLoginSuccess,
}: SplashProps) {
  const handleLocalLoginSuccess = (phone: string) => {
    onLoginSuccess(phone);
    onComplete();
  };

  return (
    <div id="cwb-splash-screen" className="fixed inset-0 z-50 bg-[#072459] flex flex-col items-center justify-center overflow-y-auto py-8 px-4">
      {/* Background dot pattern matching the image */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1e4b96_2px,transparent_2px)] [background-size:40px_40px] pointer-events-none" />
      
      <div className="w-full flex flex-col items-center justify-center z-10 flex-1">
        {/* High Fidelity CWRB Logo exactly as provided */}
        <div className="relative w-full flex items-center justify-center mb-6 mt-4">
          <div className="rounded-full shadow-[0_0_40px_rgba(255,192,0,0.15)]">
            <CWRBLogo iconOnly={true} className="w-36 h-36 md:w-48 md:h-48" />
          </div>
        </div>
        
        {/* Text styling matching the image exactly */}
        <div className="text-center px-4 w-full mt-4">
          <h1 className="text-[#FFC000] text-2xl md:text-3xl font-bold tracking-wide" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            సివిల్ వర్కర్ కస్టమర్ రిలేషన్ బుక్
          </h1>
          <p className="text-[#8ba3c7] text-[11px] md:text-[13px] mt-4 font-medium tracking-[0.2em] uppercase">
            Civil Worker Customer Relation Book
          </p>
        </div>
      </div>

      <div className="w-full max-w-sm z-10 flex flex-col justify-center mb-10">
        {!isLoggedIn ? (
          <div className="w-full">
            <PhoneLogin onLoginSuccess={handleLocalLoginSuccess} transparent={true} />
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#FFC000] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-[#FFC000] text-xs font-bold font-mono">పోర్టల్ లోనికి ప్రవేశిస్తున్నారు...</p>
          </div>
        )}
      </div>
    </div>
  );
}
