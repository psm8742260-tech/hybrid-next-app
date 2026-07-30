import React, { useState } from 'react';
import logo from '../assets/logo.jpg';

export default function CWRBLogo({ 
  className = '', 
  iconOnly = false,
  stacked = false
}: { 
  className?: string, 
  iconOnly?: boolean,
  stacked?: boolean
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex ${stacked ? 'flex-col items-center text-center' : 'flex-col items-start justify-center'} ${className}`}>
      <div className={`overflow-hidden rounded-full flex items-center justify-center bg-[#072459] shadow-2xl ${iconOnly ? 'w-full h-full' : 'w-14 h-14 sm:w-16 sm:h-16'}`}>
        {!imgError ? (
          <img 
            src={logo} 
            alt="CWRB Logo"
            className="w-full h-full object-cover scale-[0.95] object-center"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-[#FFC000] font-bold text-xl sm:text-2xl tracking-wider">CWRB</span>
        )}
      </div>
      {!iconOnly && (
        <div className={stacked ? "mt-2" : "mt-0.5"}>
          <div className="text-[#FFC000] font-bold text-[13px] leading-tight tracking-wide">CWRB</div>
          <div className="text-[#FFC000] font-semibold text-[8px] sm:text-[9px] leading-tight">Civil Worker Customer Relation Book</div>
        </div>
      )}
    </div>
  );
}
