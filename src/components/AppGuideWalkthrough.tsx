import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Radio, Wrench, BookOpen, ChevronRight, ChevronLeft, 
  Sparkles, CheckCircle, Smartphone, Compass, Users
} from 'lucide-react';

interface AppGuideWalkthroughProps {
  onClose: () => void;
  accentColor?: string;
}

export default function AppGuideWalkthrough({ onClose, accentColor = 'blue' }: AppGuideWalkthroughProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const pages = [
    {
      id: 1,
      titleTe: "స్క్రీన్ 1 • స్మార్ట్ జియోఫెన్సింగ్ మ్యాప్",
      titleEn: "Screen 1 • Smart Geofencing Map",
      descTe: "మీ చుట్టుపక్కల 5KM, 10KM, లేదా 20KM పరిధిలోనే సివిల్ వర్కర్స్ (మేస్త్రీలు, కూలీలు) యొక్క లైవ్ హాజరు స్థితిని మ్యాప్ పై గుర్తించవచ్చు. వారి ఫోన్ నెంబర్ చూసి నేరుగా కాల్ చేసి మాట్లాడుకోవచ్చు.",
      descEn: "Locate civil workers (masons, laborers) within your 5KM, 10KM, or 20KM radius with live attendance. View their phone numbers and call them directly.",
      icon: <MapPin className="w-10 h-10 text-[#FFC000]" />,
      badge: "లైవ్ లొకేషన్ / Live Location",
      color: "from-blue-600/20 to-indigo-600/20",
      illustration: (
        <div className="relative w-full h-32 bg-slate-900/40 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
          {/* Animated Map Circle */}
          <div className="absolute w-24 h-24 rounded-full border-2 border-blue-500/30 bg-blue-500/5 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-blue-500/50 bg-blue-500/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-[#FFC000] animate-bounce" />
            </div>
          </div>
          {/* Worker pins around */}
          <div className="absolute top-4 left-8 bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-md">
            <span>మేస్త్రీ (5KM)</span>
          </div>
          <div className="absolute bottom-6 right-6 bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-md">
            <span>ప్లంబర్ (8KM)</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      titleTe: "స్క్రీన్ 2 • ఫోన్ కీప్యాడ్ వాకీ-టాకీ",
      titleEn: "Screen 2 • Phone Keypad Walkie-Talkie",
      descTe: "కొత్తగా అప్‌గ్రేడ్ అయిన ఫోన్ కీప్యాడ్ ద్వారా మీకు కావలసిన ఛానల్ నంబర్ డయల్ చేసి, వర్కర్స్ గ్రూప్ మరియు మేస్త్రీలతో ఉచిత వాయిస్ ప్రసారం చేయండి. వాకీ-టాకీ ఆన్ చేసి మాట్లాడవచ్చు.",
      descEn: "Dial your desired channel number on the new phone keypad to make free group voice transmissions with workers and groups. Switch it on and enjoy seamless comms.",
      icon: <Radio className="w-10 h-10 text-emerald-400" />,
      badge: "ఉచిత కమ్యూనికేషన్ / Free Voice",
      color: "from-emerald-600/20 to-teal-600/20",
      illustration: (
        <div className="relative w-full h-32 bg-slate-900/40 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.05)_1px,transparent_1px)] [background-size:12px_12px]" />
          {/* Audio Wave Visualizer */}
          <div className="flex items-end gap-1.5 h-12">
            {[0.4, 0.8, 0.5, 0.9, 0.3, 0.7, 0.9, 0.4, 0.8, 0.5].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [h * 30, h * 45, h * 30] }}
                transition={{ repeat: Infinity, duration: 1 + (i % 3) * 0.2, ease: "easeInOut" }}
                className="w-1.5 bg-emerald-400 rounded-full"
              />
            ))}
          </div>
          <div className="absolute top-2 right-3 flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CHANNEL 7</span>
          </div>
        </div>
      )
    },
    {
      id: 3,
      titleTe: "స్క్రీన్ 3 • 10 ప్రధాన సర్వీసు కేటగిరీలు",
      titleEn: "Screen 3 • 10 Core Services",
      descTe: "ఎలక్ట్రీషియన్, ప్లంబర్, బిల్డింగ్ మేస్త్రీ, పెయింటర్, టైల్స్ వర్కర్ మరియు రాడ్ బెండర్ వంటి పది రకాల ప్రధాన పనులకు సంబంధించిన నమ్మకమైన నిపుణుల ప్రొఫైళ్లను చూసి సులువుగా బుక్ చేసుకోండి.",
      descEn: "Easily view and book verified experts across 10 specialized categories including electricians, plumbers, masons, painters, tile workers, and steel benders.",
      icon: <Wrench className="w-10 h-10 text-[#FFC000]" />,
      badge: "నిపుణుల ఎంపిక / Expert Profiles",
      color: "from-amber-600/20 to-yellow-600/20",
      illustration: (
        <div className="relative w-full h-32 bg-slate-900/40 rounded-2xl border border-white/10 p-3 flex flex-col justify-center gap-2 overflow-hidden">
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {['విద్యుత్', 'ప్లంబర్', 'మేస్త్రీ', 'రంగులు', 'టైల్స్'].map((txt, i) => (
              <div key={i} className="bg-slate-800/80 border border-white/10 rounded-lg p-1 flex flex-col items-center justify-center gap-0.5">
                <div className="w-5 h-5 rounded-full bg-[#082c75] text-[#FFC000] text-[9px] font-bold flex items-center justify-center">
                  {i + 1}
                </div>
                <span className="text-[7px] text-gray-300 font-bold truncate w-full">{txt}</span>
              </div>
            ))}
          </div>
          <div className="text-[9px] text-amber-300 font-black text-center animate-pulse">
            ★ కస్టమర్ రేటింగ్స్ మరియు గతంలో చేసిన పనుల ఫోటోలు చూడవచ్చు
          </div>
        </div>
      )
    },
    {
      id: 4,
      titleTe: "స్క్రీన్ 4 • అకౌంట్స్ లెడ్జర్ & వర్కర్ డైరీ",
      titleEn: "Screen 4 • Ledger Diary & Accounts",
      descTe: "పనివారి జీతాలు, అడ్వాన్సులు, రోజువారీ హాజరు మరియు ఖర్చులను డిజిటల్ లెడ్జర్ ద్వారా నిర్వహించండి. ప్రైవేట్ వర్కర్స్ డైరీ సేవలు పూర్తిగా సురక్షితం మరియు సులభం.",
      descEn: "Manage daily attendance, wages, advances, and business costs safely using the digital ledger book. Personal worker diary is fully encrypted and secure.",
      icon: <BookOpen className="w-10 h-10 text-blue-400" />,
      badge: "భద్రత & పారదర్శకత / Ledger Accounts",
      color: "from-indigo-600/20 to-purple-600/20",
      illustration: (
        <div className="relative w-full h-32 bg-slate-900/40 rounded-2xl border border-white/10 p-2.5 flex flex-col justify-between overflow-hidden">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[9px] bg-slate-800 border-b border-white/5 pb-1 px-1.5 text-gray-300">
              <span className="font-bold">మేస్త్రీ రికార్డ్ ఖాతా</span>
              <span className="text-emerald-400 font-black">₹8,500 Balance</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[8px] px-1 text-gray-400 font-mono">
                <span>జూలై 15 - అడ్వాన్స్ పేమెంట్</span>
                <span className="text-rose-400 font-bold">- ₹2,000</span>
              </div>
              <div className="flex justify-between items-center text-[8px] px-1 text-gray-400 font-mono">
                <span>జూలై 14 - రోజువారీ కూలి</span>
                <span className="text-emerald-400 font-bold">+ ₹1,200</span>
              </div>
            </div>
          </div>
          <div className="text-[8px] bg-[#082c75]/40 text-blue-300 px-2 py-0.5 rounded-lg border border-blue-500/20 text-center">
            🔒 ఎన్‌క్రిప్ట్ చేసిన సురక్షిత స్థానిక నిల్వ సేవ
          </div>
        </div>
      )
    },
    {
      id: 5,
      titleTe: "స్క్రీన్ 5 • అబాకస్ ఎస్టిమేటర్",
      titleEn: "Screen 5 • Abacus Estimator",
      descTe: "నిర్మాణ పనులకు అవసరమైన ఇసుక, సిమెంట్, మరియు ఇటుకల మొత్తాన్ని అబాకస్ ఎస్టిమేటర్ ద్వారా ముందుగానే లెక్కించండి. ఖర్చును సరిగ్గా అంచనా వేయండి.",
      descEn: "Estimate the amount of sand, cement, and bricks needed for construction projects using the Abacus estimator. Accurately plan your budget.",
      icon: <Users className="w-10 h-10 text-emerald-400" />,
      badge: "ఖర్చు అంచనా / Cost Estimation",
      color: "from-emerald-600/20 to-teal-600/20",
      illustration: (
        <div className="relative w-full h-32 bg-slate-900/40 rounded-2xl border border-white/10 p-3 flex items-center justify-center overflow-hidden">
          <div className="text-[10px] text-gray-300 font-bold text-center">
            [ అబాకస్ గ్రాఫిక్ ఇక్కడ ఉంటుంది ]
          </div>
        </div>
      )
    },
    {
      id: 6,
      titleTe: "స్క్రీన్ 6 • సూపర్వైజర్ టూల్స్",
      titleEn: "Screen 6 • Supervisor Tools",
      descTe: "పని జరుగుతున్న తీరును పర్యవేక్షించండి. మేస్త్రీలు, కూలీల పనితీరును మరియు ప్రోగ్రెస్ ని రిపోర్టుల రూపంలో పంపండి.",
      descEn: "Monitor project progress. Submit performance reports for masons, laborers, and ongoing work.",
      icon: <Smartphone className="w-10 h-10 text-blue-400" />,
      badge: "పర్యవేక్షణ / Supervision",
      color: "from-blue-600/20 to-indigo-600/20",
      illustration: (
        <div className="relative w-full h-32 bg-slate-900/40 rounded-2xl border border-white/10 p-3 flex items-center justify-center overflow-hidden">
          <div className="text-[10px] text-gray-300 font-bold text-center">
            [ సూపర్వైజర్ రిపోర్ట్ గ్రాఫిక్ ఇక్కడ ఉంటుంది ]
          </div>
        </div>
      )
    },
    {
      id: 7,
      titleTe: "స్క్రీన్ 7 • మెషినరీ మెకానిక్",
      titleEn: "Screen 7 • Machinery Mechanic",
      descTe: "నిర్మాణ యంత్రాలు, కాంక్రీట్ మిక్సర్లు, మరియు క్రేన్ల మరమ్మతుల కోసం నిపుణులైన మెకానిక్లను వెతకండి మరియు సర్వీసు బుక్ చేయండి.",
      descEn: "Find expert mechanics for construction machinery, concrete mixers, and crane repairs. Book services instantly.",
      icon: <Wrench className="w-10 h-10 text-amber-400" />,
      badge: "యంత్రాల మరమ్మత్తు / Machinery Repair",
      color: "from-amber-600/20 to-yellow-600/20",
      illustration: (
        <div className="relative w-full h-32 bg-slate-900/40 rounded-2xl border border-white/10 p-3 flex items-center justify-center overflow-hidden">
          <div className="text-[10px] text-gray-300 font-bold text-center">
            [ మెకానిక్ టూల్స్ గ్రాఫిక్ ఇక్కడ ఉంటుంది ]
          </div>
        </div>
      )
    },
    {
      id: 8,
      titleTe: "స్క్రీన్ 8 • యాప్‌ని ప్రారంభించండి",
      titleEn: "Screen 8 • Start the App",
      descTe: "అన్ని సౌకర్యాలు మీకు సిద్ధంగా ఉన్నాయి. ఇప్పుడు యాప్‌ని ఉపయోగించి మీ నిర్మాణ పనులను సులభంగా, వేగంగా మరియు భద్రంగా పూర్తి చేయండి.",
      descEn: "All features are ready for you. Start using the app to complete your construction work easily, quickly, and securely.",
      icon: <CheckCircle className="w-10 h-10 text-emerald-400" />,
      badge: "సిద్ధం / Ready to Start",
      color: "from-emerald-600/20 to-teal-600/20",
      illustration: (
        <div className="relative w-full h-32 bg-slate-900/40 rounded-2xl border border-white/10 p-3 flex items-center justify-center overflow-hidden">
          <div className="text-4xl">🚀</div>
        </div>
      )
    }
  ];

  const currentPageData = pages.find(p => p.id === currentPage) || pages[0];

  const getThemeBgColor = () => {
    switch (accentColor) {
      case 'gold': return 'bg-[#FFC000]';
      case 'green': return 'bg-[#10b981]';
      case 'crimson': return 'bg-[#e11d48]';
      case 'blue':
      default:
        return 'bg-[#082c75]';
    }
  };

  const playBeep = (freq = 800, duration = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  const handleNext = () => {
    playBeep(1000, 0.06);
    if (currentPage < pages.length) {
      setCurrentPage(prev => prev + 1);
    } else {
      playBeep(1200, 0.1);
      onClose();
    }
  };

  const handleBack = () => {
    playBeep(700, 0.06);
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
        style={{ minHeight: '480px' }}
      >
        {/* Header Title Section */}
        <div className="bg-[#082c75] text-white p-4 border-b border-white/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#FFC000] animate-bounce" />
            <div>
              <h2 className="text-xs font-black tracking-wider uppercase text-white">స్క్రీన్ గైడ్ / App Guide</h2>
              <p className="text-[8px] text-[#FFC000] font-bold">స్టెప్ బై స్టెప్ స్క్రీన్ల వివరణ</p>
            </div>
          </div>
          <button
            onClick={() => { playBeep(600, 0.05); onClose(); }}
            className="text-[10px] bg-white/10 hover:bg-white/20 text-gray-300 font-extrabold px-2.5 py-1 rounded-lg"
          >
            దాటవేయి / Skip
          </button>
        </div>

        {/* Gesture Area - Swiping instead of buttons */}
        <div 
          className="flex-1 p-5 flex flex-col justify-between space-y-4 overflow-y-auto"
        >
          {/* Progress Indicator Dots */}
          <div className="flex justify-center gap-1.5">
            {pages.map((p) => (
              <div
                key={p.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentPage === p.id ? 'w-6 bg-[#FFC000]' : 'w-1.5 bg-white/20'
                }`}
                onClick={() => setCurrentPage(p.id)}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.2 }}
              className="space-y-4 flex-1 flex flex-col justify-between"
              onTouchStart={(e: any) => {
                const touch = e.touches[0];
                (e.currentTarget as any).dataset.startX = touch.clientX;
              }}
              onTouchEnd={(e: any) => {
                const startX = parseFloat((e.currentTarget as any).dataset.startX);
                const endX = e.changedTouches[0].clientX;
                if (startX - endX > 50) handleNext(); // Swipe Left
                if (endX - startX > 50) handleBack(); // Swipe Right
              }}
            >
              {/* Feature Icon and Badge banner */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center shadow-inner">
                  {currentPageData.icon}
                </div>
                <div>
                  <span className="text-[9px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold">
                    {currentPageData.badge}
                  </span>
                  <h3 className="text-white font-black text-sm mt-0.5">{currentPageData.titleTe}</h3>
                  <p className="text-gray-400 text-[10px] font-mono">{currentPageData.titleEn}</p>
                </div>
              </div>

              {/* Dynamic Animated Illustration */}
              {currentPageData.illustration}

              {/* Descriptions in Telugu and English */}
              <div className="space-y-2 bg-slate-800/40 p-3 rounded-2xl border border-white/5">
                <p className="text-gray-100 text-[11px] leading-relaxed font-bold">
                  {currentPageData.descTe}
                </p>
                <p className="text-gray-400 text-[9px] leading-relaxed italic border-t border-white/5 pt-1.5">
                  {currentPageData.descEn}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between shrink-0 bg-slate-950/40">
          <button
            onClick={handleBack}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 text-[10px] font-bold px-3 py-2 rounded-xl transition ${
              currentPage === 1 
                ? 'text-gray-600 cursor-not-allowed bg-transparent' 
                : 'text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>వెనుకకు / Back</span>
          </button>

          <button
            onClick={handleNext}
            className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl font-black text-[11px] transition shadow-md active:scale-95 cursor-pointer ${
              currentPage === pages.length
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/10 animate-pulse'
                : 'bg-[#FFC000] text-[#082c75] hover:bg-[#ffe060] shadow-[#FFC000]/10'
            }`}
          >
            {currentPage === pages.length ? (
              <>
                <span>యాప్ లోపలికి వెళ్ళండి / Start</span>
                <CheckCircle className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>తరువాతి పేజీ / Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
