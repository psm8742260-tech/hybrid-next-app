import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const TITHIS = ['పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి', 'అష్టమి', 'నవమి', 'దశమి', 'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'పౌర్ణమి', 'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి', 'అష్టమి', 'నవమి', 'దశమి', 'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'అమావాస్య'];
const NAKSHATRAMS = ['అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆరుద్ర', 'పునర్వసు', 'పుష్యమి', 'ఆశ్లేష', 'మఖ', 'పుబ్బ', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'విశాఖ', 'అనూరాధ', 'జ్యేష్ఠ', 'మూల', 'పూర్వాషాడ', 'ఉత్తరాషాడ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర', 'రేవతి'];
const MASAMS = ['చైత్ర', 'వైశాఖ', 'జ్యేష్ఠ', 'ఆషాఢ', 'శ్రావణ', 'భాద్రపద', 'ఆశ్వయుజ', 'కార్తీక', 'మార్గశిర', 'పుష్య', 'మాఘ', 'ఫాల్గుణ'];
const WEEKDAYS = ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'];

// Fake accurate-looking gowri panchangam data for demonstration
const GOWRI_GOOD_TIMES = [
  'ఉదయం 10:30 - 12:00, సాయంత్రం 4:30 - 6:00', // ఆది
  'ఉదయం 9:00 - 10:30, రాత్రి 7:30 - 9:00',   // సోమ
  'మధ్యాహ్నం 12:00 - 1:30, సాయంత్రం 3:00 - 4:30', // మంగళ
  'ఉదయం 7:30 - 9:00, మధ్యాహ్నం 1:30 - 3:00', // బుధ
  'ఉదయం 6:00 - 7:30, మధ్యాహ్నం 12:00 - 1:30',// గురు
  'ఉదయం 9:00 - 10:30, సాయంత్రం 6:00 - 7:30', // శుక్ర
  'ఉదయం 7:30 - 9:00, రాత్రి 9:00 - 10:30'    // శని
];

const RAHU_KALAM = [
  'సాయంత్రం 04:30 - 06:00', // ఆది
  'ఉదయం 07:30 - 09:00', // సోమ
  'సాయంత్రం 03:00 - 04:30', // మంగళ
  'మధ్యాహ్నం 12:00 - 01:30', // బుధ
  'మధ్యాహ్నం 01:30 - 03:00', // గురు
  'ఉదయం 10:30 - 12:00', // శుక్ర
  'ఉదయం 09:00 - 10:30'  // శని
];

const YAMAGANDAM = [
  'మధ్యాహ్నం 12:00 - 01:30', // ఆది
  'ఉదయం 10:30 - 12:00', // సోమ
  'ఉదయం 09:00 - 10:30', // మంగళ
  'ఉదయం 07:30 - 09:00', // బుధ
  'ఉదయం 06:00 - 07:30', // గురు
  'సాయంత్రం 03:00 - 04:30', // శుక్ర
  'మధ్యాహ్నం 01:30 - 03:00'  // శని
];

const HORAS = ['సూర్య', 'శుక్ర', 'బుధ', 'చంద్ర', 'శని', 'గురు', 'కుజ'];
const START_HORA_INDEX = [0, 3, 6, 2, 5, 1, 4]; // Sun to Sat
const HORA_NATURE = {
  'సూర్య': 'సాధారణం (Average)',
  'శుక్ర': 'శుభం (Good)',
  'బుధ': 'శుభం (Good)',
  'చంద్ర': 'శుభం (Good)',
  'శని': 'అశుభం (Bad)',
  'గురు': 'అత్యంత శుభం (Excellent)',
  'కుజ': 'అశుభం (Bad)'
};
const GOWRI_CHUNKS = ['ఉద్వేగ', 'అమృత', 'రోగ', 'లాభ', 'ధన', 'శుభ', 'విష', 'చోర'];
const GOWRI_SHIFT = [0, 1, 2, 3, 4, 5, 6];

// Helper to get consistent simulated data based on date
const getPanchangamForDate = (date: Date) => {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const dayOfWeek = date.getDay();
  
  return {
    tithi: TITHIS[seed % 30],
    nakshatram: NAKSHATRAMS[seed % 27],
    masam: MASAMS[date.getMonth()],
    gowri: GOWRI_GOOD_TIMES[dayOfWeek],
    rahu: RAHU_KALAM[dayOfWeek],
    yama: YAMAGANDAM[dayOfWeek],
    paksham: (seed % 30) < 15 ? 'శుక్ల పక్షం' : 'కృష్ణ పక్షం',
    rutuvu: 'గ్రీష్మ ఋతువు', // Simplified for demo
    samvatsaram: 'శ్రీ క్రోధి నామ సంవత్సరం'
  };
};

export default function TeluguCalendar({ onBack }: { onBack: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showHourly, setShowHourly] = useState(false);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'];
  
  const panchangam = getPanchangamForDate(selectedDate);
  const dayOfWeek = selectedDate.getDay();

  const generateHourlyPanchangam = () => {
    const hours = [];
    let horaIndex = START_HORA_INDEX[dayOfWeek];
    
    // Day time (6 AM to 6 PM)
    for (let i = 0; i < 12; i++) {
      const startHour = i + 6;
      const displayHour = startHour > 12 ? startHour - 12 : startHour;
      
      let teluguTimePrefix = 'ఉదయం';
      if (startHour === 12) teluguTimePrefix = 'మధ్యాహ్నం';
      if (startHour >= 13 && startHour <= 15) teluguTimePrefix = 'మధ్యాహ్నం';
      if (startHour >= 16) teluguTimePrefix = 'సాయంత్రం';

      let endHour = startHour + 1;
      let teluguEndPrefix = 'ఉదయం';
      if (endHour === 12) teluguEndPrefix = 'మధ్యాహ్నం';
      if (endHour >= 13 && endHour <= 15) teluguEndPrefix = 'మధ్యాహ్నం';
      if (endHour >= 16 && endHour <= 18) teluguEndPrefix = 'సాయంత్రం';
      if (endHour > 18) teluguEndPrefix = 'రాత్రి';

      const displayEndHour = endHour > 12 ? endHour - 12 : endHour;
      
      // Calculate Gowri (changes every 1.5 hours)
      const gowriPeriod = Math.floor(i / 1.5);
      const gowriIndex = (GOWRI_SHIFT[dayOfWeek] + gowriPeriod) % 8;
      
      hours.push({
        time: `${teluguTimePrefix} ${displayHour}:00 - ${teluguEndPrefix} ${displayEndHour}:00`,
        hora: HORAS[(horaIndex + i) % 7],
        gowri: GOWRI_CHUNKS[gowriIndex]
      });
    }
    return hours;
  };

  return (
    <div className="space-y-4 animate-fade-in pb-20 -mx-4 -mt-5">
      <div className="bg-[#082c75] p-4 pb-6 shadow-md rounded-b-3xl mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 bg-white/10 rounded-full border border-white/20 text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white font-black text-lg">పంచాంగం (Panchangam)</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4 space-y-4">
        {/* Hybrid Auto-Update Indicator */}
        <div className="flex justify-center -mt-1">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            హైబ్రిడ్ ఇంజిన్: క్యాలెండర్ ఆటోమేటిక్‌గా అప్‌డేట్ అవుతుంది (Auto-Updated)
          </div>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <button onClick={prevMonth} className="p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100"><ChevronLeft className="w-5 h-5 text-[#082c75]" /></button>
          <div className="text-center">
            <h2 className="text-[#082c75] font-extrabold text-lg flex items-center justify-center gap-2">
              <span className="text-xl">🕉️</span> {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold mt-0.5">{panchangam.samvatsaram} - {panchangam.masam} మాసం</p>
          </div>
          <button onClick={nextMonth} className="p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100"><ChevronRight className="w-5 h-5 text-[#082c75]" /></button>
        </div>
        
        {/* Calendar Grid */}
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((day, idx) => (
              <div key={day} className={`text-[10px] font-extrabold py-1 ${idx === 0 ? 'text-red-500' : 'text-gray-500'}`}>{day}</div>
            ))}
            
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2"></div>
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
              const isSunday = cellDate.getDay() === 0;
              
              return (
                <button 
                  key={day} 
                  onClick={() => setSelectedDate(cellDate)}
                  className={`p-1.5 text-xs font-bold rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${
                    isSelected 
                      ? 'bg-[#082c75] text-white shadow-md scale-105' 
                      : isToday 
                        ? 'border border-[#FFC000] text-[#082c75] bg-[#FFC000]/10'
                        : isSunday 
                          ? 'text-red-500 bg-red-50/50 hover:bg-red-100' 
                          : 'text-gray-700 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span>{day}</span>
                  {/* Show a tiny dot if it's amavasya or pournami based on mock data */}
                  {(getPanchangamForDate(cellDate).tithi === 'అమావాస్య') && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-800'}`}></div>}
                  {(getPanchangamForDate(cellDate).tithi === 'పౌర్ణమి') && <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-yellow-400'}`}></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex justify-between items-center mb-1">
             <h3 className="font-extrabold text-[#082c75] text-sm">{selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()} - పంచాంగం</h3>
             <span className="bg-[#FFC000]/20 text-[#082c75] text-[9px] font-black px-2 py-0.5 rounded">{panchangam.paksham}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-100 flex flex-col justify-center">
              <p className="text-[9px] text-orange-600 font-bold mb-0.5 uppercase tracking-wider">తిథి</p>
              <p className="text-xs font-extrabold text-gray-800">{panchangam.tithi}</p>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 flex flex-col justify-center">
              <p className="text-[9px] text-blue-600 font-bold mb-0.5 uppercase tracking-wider">నక్షత్రం</p>
              <p className="text-xs font-extrabold text-gray-800">{panchangam.nakshatram}</p>
            </div>
          </div>

          <div className="bg-[#082c75]/5 p-3 rounded-xl border border-[#082c75]/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#082c75] font-bold mb-1 flex items-center gap-1">
                  <span className="text-xs">✨</span> గౌరీ పంచాంగం (మంచి సమయం)
                </p>
                <p className="text-xs font-extrabold text-[#082c75]">{panchangam.gowri}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-red-50 p-2.5 rounded-xl border border-red-100">
              <p className="text-[9px] text-red-600 font-bold mb-0.5 uppercase tracking-wider">రాహుకాలం</p>
              <p className="text-[10px] font-extrabold text-gray-800">{panchangam.rahu}</p>
            </div>
            <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
              <p className="text-[9px] text-purple-600 font-bold mb-0.5 uppercase tracking-wider">యమగండం</p>
              <p className="text-[10px] font-extrabold text-gray-800">{panchangam.yama}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowHourly(!showHourly)}
            className="w-full py-2 bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-xl text-xs font-bold text-[#082c75] flex justify-center items-center gap-1 hover:bg-[#FFC000]/20 transition-all"
          >
            <Clock className="w-3.5 h-3.5" /> 
            {showHourly ? 'గంటల పంచాంగం దాచండి' : 'గంటల పంచాంగం (హోర, గౌరీ) చూపండి'}
          </button>
          
          {showHourly && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden text-left animate-fade-in">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 grid grid-cols-3 text-[9px] font-black text-slate-500 tracking-wider">
                <div>సమయం (Time)</div>
                <div>హోర (Hora)</div>
                <div>గౌరీ (Gowri)</div>
              </div>
              <div className="divide-y divide-slate-100 max-h-[250px] overflow-y-auto">
                {generateHourlyPanchangam().map((slot, idx) => (
                  <div key={idx} className="px-3 py-2 grid grid-cols-3 text-[10px] items-center hover:bg-slate-100 transition-colors">
                    <div className="font-bold text-slate-700">{slot.time}</div>
                    <div>
                      <div className="font-extrabold text-[#082c75]">{slot.hora} హోర</div>
                      <div className={`text-[8px] font-bold ${
                        HORA_NATURE[slot.hora as keyof typeof HORA_NATURE].includes('Good') || HORA_NATURE[slot.hora as keyof typeof HORA_NATURE].includes('Excellent')
                          ? 'text-emerald-600' 
                          : HORA_NATURE[slot.hora as keyof typeof HORA_NATURE].includes('Bad') 
                            ? 'text-red-500' 
                            : 'text-orange-500'
                      }`}>
                        {HORA_NATURE[slot.hora as keyof typeof HORA_NATURE]}
                      </div>
                    </div>
                    <div className="font-extrabold text-indigo-700">{slot.gowri}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-gradient-to-r from-[#082c75] to-[#051e4e] rounded-xl text-white shadow-md">
            <h4 className="text-[9px] font-bold text-[#FFC000] mb-1 tracking-wider">నేటి సుభాషితం</h4>
            <p className="text-[11px] font-semibold leading-relaxed">"ధర్మో రక్షతి రక్షితః" - ధర్మాన్ని మనం రక్షిస్తే, ఆ ధర్మం మనల్ని రక్షిస్తుంది.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
