import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Shield, ShieldCheck, CreditCard, Landmark, 
  BookOpen, Plus, Trash2, TrendingUp, TrendingDown, Check,
  Camera, Eye, Lock, Sparkles, AlertCircle, RefreshCw,
  Award, FileText, Calendar, User, Download, Radio, Hash, Wifi, Volume2, Heart, Zap, Activity, Battery, BatteryCharging,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { WalletTransaction, DiaryEntry, WorkerKYC as KYCInterface, ControlState } from '../types';
import CWRBLogo from './CWRBLogo';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

// ==========================================
// 1. GAMING WALKIE TALKIE COMPONENT
// ==========================================
interface WalkieProps {
  controlState?: ControlState;
}
export function WalkieTalkie({ controlState = 'temp_on' }: WalkieProps) {
  const [isTalking, setIsTalking] = useState(false);
  const [activeRange, setActiveRange] = useState<5 | 10 | 20>(5);
  const [dialInput, setDialInput] = useState('1');
  const [connectedChannel, setConnectedChannel] = useState('1');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'dialing' | 'connected'>('connected');
  const [statusMessage, setStatusMessage] = useState('సిగ్నల్ ఆన్లైన్ / Signal Active');

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
    } catch (e) {
      // AudioContext not supported
    }
  };

  const playStaticSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      noise.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {}
  };

  if (controlState === 'temp_off' || controlState === 'perm_off') {
    return (
      <div className="bg-slate-900 rounded-2xl p-6 text-center border-t-4 border-red-500 text-gray-400">
        <MicOff className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h4 className="text-white font-bold">వాకీ-టాకీ నిలిపివేయబడింది</h4>
        <p className="text-xs text-red-400 font-semibold">Walkie-Talkie Suspended</p>
        <p className="text-gray-500 text-xs mt-2">అడ్మినిస్ట్రేటర్ ద్వారా ఈ ఫీచర్ ప్రస్తుతం అందుబాటులో లేదు.</p>
      </div>
    );
  }

  if (controlState === 'soft_delete' || controlState === 'hard_delete') {
    return null;
  }

  const isUpgraded = controlState === 'perm_upgrade';

  // Keypad click handler
  const handleKeyPress = (key: string) => {
    playBeep(900, 0.05);
    if (key === 'C') {
      setDialInput('');
      setConnectionStatus('idle');
      setStatusMessage('నెంబర్ టైప్ చేయండి / Enter Channel No');
    } else {
      if (dialInput.length < 4) {
        setDialInput(prev => (prev === '0' ? key : prev + key));
      }
    }
  };

  // Connect handler
  const handleConnect = () => {
    if (!dialInput) {
      playBeep(400, 0.25);
      setStatusMessage('నెంబర్ ఖాళీగా ఉంది! / Enter a number');
      return;
    }
    
    playBeep(1100, 0.1);
    setTimeout(() => playBeep(1300, 0.1), 100);
    
    setConnectionStatus('dialing');
    setStatusMessage('లింక్ కనెక్ట్ అవుతోంది... Connecting...');
    
    setTimeout(() => {
      setConnectedChannel(dialInput);
      setConnectionStatus('connected');
      playStaticSound();
      setStatusMessage('ఛానల్ కనెక్ట్ అయ్యింది / Channel Connected');
    }, 1200);
  };

  // Pre-defined Channel Labels based on connected Channel No
  const getChannelInfo = (ch: string) => {
    const num = parseInt(ch, 10);
    if (num === 1) return 'ప్రధాన కూడలి / General Workers';
    if (num === 2) return 'మేస్త్రీల సంఘం / Masons Group';
    if (num === 3) return 'రంగుల మేస్త్రీలు / Painters Group';
    if (num === 4) return 'పైప్ లైన్ వర్కర్స్ / Plumbers Group';
    if (num === 5) return 'కరెంట్ మేస్త్రీలు / Electricians Group';
    if (num === 100) return 'అడ్మిన్ సేవలు / CWB Helpdesk';
    if (num === 108) return 'అత్యవసర విభాగం / Emergency SOS';
    return `వ్యక్తిగత ఫ్రీక్వెన్సీ (446.${ch.padStart(3, '0')} MHz)`;
  };

  return (
    <div className={`bg-slate-950 text-white rounded-2xl p-4 md:p-5 shadow-2xl relative overflow-hidden border ${
      isUpgraded ? 'border-[#FFC000] shadow-[0_0_20px_rgba(255,192,0,0.15)]' : 'border-slate-800'
    }`}>
      {/* Background Tech HUD Details */}
      <div className="absolute right-3 top-3 text-[9px] font-mono text-emerald-500/50 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        <span>HUD: ONLINE</span>
      </div>

      <div className="mb-3">
        <h4 className="font-bold text-sm text-[#FFC000] flex items-center gap-1.5">
          <Radio className="w-4.5 h-4.5 text-[#FFC000] animate-pulse" />
          <span>నెంబర్ డయలర్ వాకీ-టాకీ / Channel Dial Walkie-Talkie</span>
        </h4>
        <p className="text-[10px] text-gray-400">మొబైల్ ఫోన్ లాగా ఛానల్ నంబర్ డయల్ చేసి కనెక్ట్ అవ్వండి</p>
      </div>

      {/* LCD Digital Signal Screen */}
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 mb-4 font-mono relative overflow-hidden shadow-inner">
        {/* Decorative Grid Mesh Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:4px_4px] pointer-events-none" />
        
        <div className="flex justify-between items-start text-emerald-400">
          <div className="space-y-0.5">
            <span className="text-[8px] text-emerald-500/60 font-bold tracking-wider uppercase block">WALKIE STATUS</span>
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : connectionStatus === 'dialing' ? 'bg-amber-400 animate-ping' : 'bg-gray-500'}`} />
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-tight">{statusMessage}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[8px] text-emerald-500/60 font-bold tracking-wider uppercase block">FREQ LOCK</span>
            <span className="text-[10px] font-black tracking-wider text-emerald-300">
              {connectionStatus === 'connected' ? `446.${connectedChannel.padStart(3, '0')} MHz` : '---.--- MHz'}
            </span>
          </div>
        </div>

        {/* Big LED Channel numbers */}
        <div className="mt-2.5 flex justify-between items-end border-t border-emerald-500/10 pt-2">
          <div>
            <span className="text-[7.5px] text-emerald-500/50 block">CONNECTED TO:</span>
            <span className="text-[11px] font-extrabold text-emerald-200 tracking-wide block leading-none mt-1">
              {connectionStatus === 'connected' ? getChannelInfo(connectedChannel) : 'ఛానల్ ఎంచుకోండి / Enter Channel'}
            </span>
          </div>
          <div className="text-right pl-2">
            <span className="text-[8px] text-emerald-500/50 block font-mono">CHANNEL DIAL</span>
            <div className="text-2xl font-black text-emerald-300 tracking-widest leading-none">
              CH {dialInput || '___'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Dialpad (Phone Style) & Right Range/PTT */}
      <div className="grid grid-cols-12 gap-3">
        {/* Telephone Dialpad (7 cols) */}
        <div className="col-span-7 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 space-y-2">
          <span className="text-[8.5px] font-bold text-gray-400 tracking-wider block text-center uppercase border-b border-slate-800 pb-1">
            కీప్యాడ్ డయలర్ / Tactile Keypad
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num)}
                className="h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-extrabold text-sm transition font-mono border border-slate-700/50 shadow-xs cursor-pointer flex items-center justify-center"
              >
                {num}
              </button>
            ))}
            {/* Clear Button */}
            <button
              onClick={() => handleKeyPress('C')}
              className="h-9 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 font-extrabold text-xs transition active:scale-95 border border-red-500/20 cursor-pointer flex items-center justify-center"
            >
              CLEAR
            </button>
            {/* Zero Button */}
            <button
              onClick={() => handleKeyPress('0')}
              className="h-9 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-extrabold text-sm transition font-mono border border-slate-700/50 cursor-pointer flex items-center justify-center"
            >
              0
            </button>
            {/* Set/Connect Button */}
            <button
              onClick={handleConnect}
              className="h-9 rounded-lg bg-[#082c75] hover:bg-[#002b80] text-[#FFC000] font-black text-[10px] transition active:scale-95 border border-blue-500/30 shadow-md cursor-pointer flex flex-col items-center justify-center leading-none"
            >
              <Wifi className="w-3 h-3 mb-0.5 text-emerald-400" />
              <span>CONNECT</span>
            </button>
          </div>
        </div>

        {/* Walkie Talkie Range & PTT Button (5 cols) */}
        <div className="col-span-5 bg-slate-900/30 rounded-xl p-2 border border-slate-800/80 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-wider block text-center">
              పరిధి / Range
            </span>
            <div className="flex flex-col gap-1">
              {([5, 10, 20] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => { playBeep(700, 0.04); setActiveRange(range); }}
                  className={`w-full py-1 rounded text-[8.5px] font-bold transition-all ${
                    activeRange === range
                      ? 'bg-[#FFC000] text-[#082c75] font-black'
                      : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800'
                  }`}
                >
                  {range}KM
                </button>
              ))}
            </div>
          </div>

          {/* Transmit Button (Push to Talk) */}
          <div className="flex flex-col items-center pt-2">
            <button
              onMouseDown={() => { playStaticSound(); setIsTalking(true); }}
              onMouseUp={() => setIsTalking(false)}
              onMouseLeave={() => setIsTalking(false)}
              onTouchStart={() => { playStaticSound(); setIsTalking(true); }}
              onTouchEnd={() => setIsTalking(false)}
              disabled={connectionStatus !== 'connected'}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-bold text-[8px] select-none shadow-lg transition-all active:scale-95 cursor-pointer ${
                connectionStatus !== 'connected'
                  ? 'bg-slate-800 text-gray-600 border border-slate-700 cursor-not-allowed opacity-50'
                  : isTalking
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/50 scale-102 font-black'
                    : 'bg-[#FFC000] text-[#082c75] border border-[#FFC000]/60 hover:bg-[#FFE060]'
              }`}
            >
              <Mic className={`w-4 h-4 mb-0.5 ${isTalking ? 'animate-bounce' : ''}`} />
              <span className="leading-none tracking-tight text-center">PTT TALK</span>
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast transmission overlay status */}
      {isTalking && (
        <div className="mt-3 bg-emerald-500/10 border border-emerald-500/20 py-1.5 rounded-lg text-center animate-pulse">
          <span className="text-[10px] text-emerald-400 font-extrabold font-mono tracking-wider flex items-center justify-center gap-1">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            మాట్లాడండి... TRANSMITTING (CH {connectedChannel} • {activeRange}KM)...
          </span>
        </div>
      )}

      <p className="text-[9px] text-gray-500 text-center mt-2.5 leading-relaxed">
        నెంబర్ డయల్ చేసి కనెక్ట్ అయ్యాక, <strong className="text-gray-300">PTT TALK</strong> నొక్కి పట్టుకుని మాట్లాడవచ్చు.
      </p>
    </div>
  );
}

// ==========================================
// 2. KYC & ID VERIFICATION COMPONENT
// ==========================================
const compressBase64Image = (base64Str: string, maxWidth = 300, maxHeight = 300, quality = 0.65): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image')) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

interface KYCProps {
  kycState: KYCInterface;
  onUpdateKYC: (updated: Partial<KYCInterface>) => void;
  controlState?: ControlState;
}
export function WorkerKYC({ kycState, onUpdateKYC, controlState = 'temp_on' }: KYCProps) {
  const [googleLoggedIn, setGoogleLoggedIn] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState<string | null>(kycState.aadhaarImage || null);
  const [panFile, setPanFile] = useState<string | null>(kycState.panImage || null);

  // States for Labour Card & E-Shram Card + dynamic ID generator
  const [cardType, setCardType] = useState<'labour' | 'eshram'>('labour');
  const [cardFile, setCardFile] = useState<string | null>(null);
  const [fullName, setFullName] = useState('రాము ప్రసాద్');
  const [phoneNo, setPhoneNo] = useState('98480 22338');
  const [profession, setProfession] = useState('మేస్త్రీ (Mason)');
  const [registrationDate, setRegistrationDate] = useState('2018-05-12');
  const [regNumber, setRegNumber] = useState(kycState.registrationNumber || 'LBR-5492-2018');
  const [showIdCard, setShowIdCard] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [idCardDataUrl, setIdCardDataUrl] = useState<string | null>(null);

  // Sync state when parent KYC loads asynchronously from Firebase
  useEffect(() => {
    if (kycState.aadhaarImage) setAadhaarFile(kycState.aadhaarImage);
    if (kycState.panImage) setPanFile(kycState.panImage);
    const uploadedCard = kycState.labourCardImage || kycState.eshramCardImage;
    if (uploadedCard) setCardFile(uploadedCard);
    if (kycState.registrationNumber) setRegNumber(kycState.registrationNumber);
    if (kycState.issueDate) setRegistrationDate(kycState.issueDate);
    if (kycState.verified) setShowIdCard(true);
  }, [kycState]);

  // Dynamic service calculation (Current year is 2026)
  const calculateExperience = (dateStr: string): number => {
    if (!dateStr) return 0;
    const year = new Date(dateStr).getFullYear();
    const currentYear = 2026;
    return Math.max(0, currentYear - year);
  };

  const expYears = calculateExperience(registrationDate);

  // 4 ID Card Levels (Super Light Themes)
  let idTier: 'bronze' | 'silver' | 'gold' | 'diamond' = 'bronze';
  let idCardName = 'కంచు ఐడి కార్డ్ (Bronze Card)';
  let idBgGradient = 'from-orange-50 via-amber-100/70 to-orange-200/90 text-slate-800';
  let borderHighlight = 'border-orange-300/80';
  let badgeLabel = '🥉 BRONZE';

  if (expYears >= 10) {
    idTier = 'diamond';
    idCardName = 'డైమండ్ ఐడి కార్డ్ (Diamond Card)';
    idBgGradient = 'from-sky-50 via-sky-100/70 to-sky-200/90 text-slate-800';
    borderHighlight = 'border-sky-300';
    badgeLabel = '💎 DIAMOND';
  } else if (expYears >= 5) {
    idTier = 'gold';
    idCardName = 'బంగారు ఐడి కార్డ్ (Gold Card)';
    idBgGradient = 'from-amber-50 via-yellow-100/70 to-amber-200/90 text-slate-800';
    borderHighlight = 'border-yellow-400/80';
    badgeLabel = '🥇 GOLD';
  } else if (expYears >= 3) {
    idTier = 'silver';
    idCardName = 'వెండి ఐడి కార్డ్ (Silver Card)';
    idBgGradient = 'from-slate-50 via-slate-100/70 to-slate-200/90 text-slate-800';
    borderHighlight = 'border-slate-300';
    badgeLabel = '🥈 SILVER';
  }

  const aadhaarInputRef = useRef<HTMLInputElement | null>(null);
  const panInputRef = useRef<HTMLInputElement | null>(null);
  const cardInputRef = useRef<HTMLInputElement | null>(null);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        const compressed = await compressBase64Image(result, 300, 300, 0.65);
        setAadhaarFile(compressed);
        onUpdateKYC({ aadhaarUploaded: true, aadhaarImage: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        const compressed = await compressBase64Image(result, 300, 300, 0.65);
        setPanFile(compressed);
        onUpdateKYC({ panUploaded: true, panImage: compressed });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        const compressed = await compressBase64Image(result, 300, 300, 0.65);
        setCardFile(compressed);
        setRegistrationDate('2013-01-08');
        if (cardType === 'labour') {
          onUpdateKYC({ labourCardUploaded: true, labourCardImage: compressed, issueDate: '2013-01-08' });
        } else {
          onUpdateKYC({ eshramCardUploaded: true, eshramCardImage: compressed, issueDate: '2013-01-08' });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerMockAadhaar = () => {
    aadhaarInputRef.current?.click();
  };

  const triggerMockPan = () => {
    panInputRef.current?.click();
  };

  const triggerMockCard = () => {
    cardInputRef.current?.click();
  };

  const triggerVerifyAll = async () => {
    const idCardNumber = `CWB-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    onUpdateKYC({ 
      verified: true,
      issueDate: registrationDate,
      experienceYears: expYears,
      idCardType: idTier,
      idCardNumber: idCardNumber,
      registrationNumber: regNumber
    });
    setShowIdCard(true);

    try {
      const docId = `reg_${idCardNumber.split('-')[2]}`;
      await setDoc(doc(db, 'registrations', docId), {
        id: docId,
        fullName: fullName || 'రాము ప్రసాద్',
        phoneNo: phoneNo || '98480 22338',
        profession: profession || 'మేస్త్రీ (Mason)',
        registrationDate: registrationDate || '2018-05-12',
        regNumber: regNumber || 'LBR-5492-2018',
        idCardNumber: idCardNumber,
        idCardType: idTier,
        experienceYears: expYears,
        aadhaarImage: aadhaarFile,
        panImage: panFile,
        cardImage: cardFile,
        verified: true,
        createdAt: new Date().toISOString()
      });
      console.log("Registration successfully saved to Firebase Firestore!");
    } catch (err) {
      console.error("Firestore Save Error:", err);
    }
  };

  const generateIdCardBackground = async () => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
      });
    };

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw rounded rectangle background with gradient
      ctx.save();
      const radius = 24;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(800 - radius, 0);
      ctx.quadraticCurveTo(800, 0, 800, radius);
      ctx.lineTo(800, 500 - radius);
      ctx.quadraticCurveTo(800, 500, 800 - radius, 500);
      ctx.lineTo(radius, 500);
      ctx.quadraticCurveTo(0, 500, 0, 500 - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();

      // Background Gradient - Premium Light Colors (Super Light)
      let gradStart = '#f0f9ff';
      let gradMid = '#e0f2fe';
      let gradEnd = '#bae6fd';
      let accentColor = '#0284c7'; // Solid sky blue
      let titleColor = '#082c75'; // Dark blue for contrast
      let subTitleColor = '#475569'; // Dark slate
      let labelColor = '#64748b'; // Muted dark slate
      let valueColor = '#0f172a'; // Near black
      let highlightColor = '#0369a1'; // Deep sky blue for highlighted text

      if (expYears >= 10) {
        // Diamond Light Sky Blue
        gradStart = '#f0f9ff';
        gradMid = '#e0f2fe';
        gradEnd = '#bae6fd';
        accentColor = '#0284c7';
        highlightColor = '#0369a1';
      } else if (expYears >= 5) {
        // Gold Light Yellow
        gradStart = '#fefbeb';
        gradMid = '#fef3c7';
        gradEnd = '#fde68a';
        accentColor = '#d97706';
        highlightColor = '#b45309';
      } else if (expYears >= 3) {
        // Silver Light Slate
        gradStart = '#f8fafc';
        gradMid = '#f1f5f9';
        gradEnd = '#e2e8f0';
        accentColor = '#475569';
        highlightColor = '#0f172a';
      } else {
        // Bronze Light Peach
        gradStart = '#fff7ed';
        gradMid = '#ffedd5';
        gradEnd = '#fed7aa';
        accentColor = '#ca8a04';
        highlightColor = '#a16207';
      }

      const grad = ctx.createLinearGradient(0, 0, 800, 500);
      grad.addColorStop(0, gradStart);
      grad.addColorStop(0.5, gradMid);
      grad.addColorStop(1, gradEnd);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 500);

      // Card Gloss/Reflection Lines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(350, 0);
      ctx.lineTo(150, 500);
      ctx.lineTo(0, 500);
      ctx.closePath();
      ctx.fill();

      // Outer border line
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, 800, 500);

      // 2. Header: Round Logo & Title
      const logoX = 60;
      const logoY = 55;
      let logoLoaded = false;
      try {
        const logoImg = await loadImage("https://i.ibb.co/7JnVZGLw/1784961900190.png");
        ctx.save();
        ctx.beginPath();
        ctx.arc(logoX, logoY, 26, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(logoImg, logoX - 26, logoY - 26, 52, 52);
        ctx.restore();
        
        // Ring border around logo
        ctx.strokeStyle = '#FFC000';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(logoX, logoY, 26, 0, Math.PI * 2);
        ctx.stroke();
        logoLoaded = true;
      } catch (err) {
        console.error("Failed to load logo", err);
      }

      if (!logoLoaded) {
        ctx.beginPath();
        ctx.arc(logoX, logoY, 22, 0, Math.PI * 2);
        ctx.fillStyle = '#082c75';
        ctx.fill();
        ctx.fillStyle = '#FFC000';
        ctx.font = '900 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CWB', logoX, logoY);
      }

      // Header Texts
      ctx.textAlign = 'left';
      ctx.fillStyle = titleColor;
      ctx.font = 'bold 23px sans-serif';
      ctx.fillText('CWB సివిల్ వర్కర్స్ సమాఖ్య', 100, 48);

      ctx.fillStyle = subTitleColor;
      ctx.font = '900 11px monospace';
      ctx.fillText('CIVIL WORKER RELATION BOOK (CWB)', 100, 72);

      // Badge tag pill
      const badgeText = badgeLabel;
      ctx.font = 'bold 12px sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 24;
      ctx.fillStyle = 'rgba(8, 44, 117, 0.08)';
      ctx.beginPath();
      const rx = 800 - 45 - badgeWidth;
      const ry = 36;
      const rw = badgeWidth;
      const rh = 28;
      ctx.roundRect ? ctx.roundRect(rx, ry, rw, rh, 14) : ctx.rect(rx, ry, rw, rh);
      ctx.fill();
      ctx.strokeStyle = 'rgba(8, 44, 117, 0.15)';
      ctx.stroke();

      ctx.fillStyle = '#082c75';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, rx + rw / 2, ry + rh / 2 + 1);

      // Header bottom border line
      ctx.strokeStyle = 'rgba(8, 44, 117, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(35, 100);
      ctx.lineTo(800 - 35, 100);
      ctx.stroke();

      // 3. Worker Photo Frame
      const frameX = 45;
      const frameY = 130;
      const frameW = 160;
      const frameH = 200;

      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(frameX, frameY, frameW, frameH);
      ctx.strokeStyle = 'rgba(8, 44, 117, 0.15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(frameX, frameY, frameW, frameH);

      // Draw real photo or fallback
      let photoLoaded = false;
      const userPhotoSrc = kycState.panImage || kycState.aadhaarImage || panFile || aadhaarFile;
      if (userPhotoSrc) {
        try {
          const img = await loadImage(userPhotoSrc);
          ctx.drawImage(img, frameX, frameY, frameW, frameH);
          photoLoaded = true;
        } catch (err) {
          console.error("Failed to load worker photo", err);
        }
      }

      if (!photoLoaded) {
        ctx.fillStyle = 'rgba(8, 44, 117, 0.05)';
        ctx.beginPath();
        ctx.arc(frameX + frameW / 2, frameY + frameH / 2 - 10, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = accentColor;
        ctx.stroke();

        ctx.fillStyle = accentColor;
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👷', frameX + frameW / 2, frameY + frameH / 2 - 10);
      }

      // Draw green VERIFIED bar on photo
      ctx.fillStyle = '#10b981';
      ctx.fillRect(frameX, frameY + frameH - 30, frameW, 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VERIFIED CWB', frameX + frameW / 2, frameY + frameH - 15);

      // ID Code under photo
      ctx.fillStyle = labelColor;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('ID CODE', frameX + frameW / 2, frameY + frameH + 12);

      const shortId = kycState.idCardNumber ? kycState.idCardNumber.split('-')[2] : '827493';
      ctx.fillStyle = highlightColor;
      ctx.font = 'bold 15px monospace';
      ctx.fillText(`#${shortId}`, frameX + frameW / 2, frameY + frameH + 28);

      // 4. Details List (aligned next to photo)
      const detailsX = 250;
      const detailsY = 140;

      const drawDetailRow = (label: string, val: string, x: number, y: number, highlight = false) => {
        ctx.fillStyle = labelColor;
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(label, x, y);

        ctx.fillStyle = highlight ? highlightColor : valueColor;
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(val, x, y + 18);
      };

      drawDetailRow('పేరు / Name', fullName, detailsX, detailsY);
      drawDetailRow('వృత్తి / Trade', profession.split(' ')[0], detailsX, detailsY + 50, true);
      drawDetailRow('మొబైల్ / Mobile', phoneNo, detailsX + 220, detailsY + 50);
      drawDetailRow('రిజిస్ట్రేషన్ నెంబర్ / Reg No', kycState.registrationNumber || regNumber, detailsX, detailsY + 100);
      drawDetailRow('అనుభవం / Service', `${expYears} Years`, detailsX, detailsY + 150);
      drawDetailRow('రిజిస్ట్రేషన్ తేదీ / Reg Date', registrationDate, detailsX + 220, detailsY + 150);

      // 5. Card Footer Area with QR Code
      const footerY = 405;
      ctx.strokeStyle = 'rgba(8, 44, 117, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(35, footerY);
      ctx.lineTo(800 - 35, footerY);
      ctx.stroke();

      // Draw Real Scannable QR Code
      const qrX = 45;
      const qrY = footerY + 15;
      const qrSize = 58;

      const verificationUrl = window.location.origin + "/?verify=true&id=" + (kycState.idCardNumber || `CWB-2026-${shortId}`);
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verificationUrl)}`;

      let qrLoaded = false;
      try {
        const qrImg = await loadImage(qrImageUrl);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
        ctx.strokeStyle = 'rgba(8, 44, 117, 0.1)';
        ctx.strokeRect(qrX, qrY, qrSize, qrSize);
        ctx.drawImage(qrImg, qrX + 3, qrY + 3, qrSize - 6, qrSize - 6);
        qrLoaded = true;
      } catch (err) {
        console.error("Failed to load QR code image for Canvas", err);
      }

      if (!qrLoaded) {
        // Fallback: beautiful placeholder QR markers
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(qrX, qrY, qrSize, qrSize);
        ctx.strokeStyle = 'rgba(8, 44, 117, 0.1)';
        ctx.strokeRect(qrX, qrY, qrSize, qrSize);
        ctx.fillStyle = '#000000';
        const drawQRMarker = (mx: number, my: number) => {
          ctx.fillRect(mx, my, 18, 18);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(mx + 3, my + 3, 12, 12);
          ctx.fillStyle = '#000000';
          ctx.fillRect(mx + 6, my + 6, 6, 6);
        };
        drawQRMarker(qrX + 3, qrY + 3);
        drawQRMarker(qrX + qrSize - 21, qrY + 3);
        drawQRMarker(qrX + 3, qrY + qrSize - 21);
      }

      ctx.fillStyle = labelColor;
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('CWRB OFFICIAL DIGITAL ID', qrX + qrSize + 15, qrY + 22);

      const fullRegNo = kycState.idCardNumber || `CWB-2026-${shortId}`;
      ctx.fillStyle = highlightColor;
      ctx.font = 'bold 12px monospace';
      ctx.fillText(fullRegNo, qrX + qrSize + 15, qrY + 42);

      // Active Badge (Bottom-Right)
      const actX = 800 - 45 - 110;
      const actY = qrY + 12;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(actX, actY, 110, 32, 8) : ctx.rect(actX, actY, 110, 32);
      ctx.fill();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(actX + 18, actY + 16, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#059669';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('ACTIVE ID', actX + 32, actY + 20);

      ctx.restore();

      const dataUrl = canvas.toDataURL('image/png');
      setIdCardDataUrl(dataUrl);
    } catch (e) {
      console.error("Failed to pre-render ID card image background", e);
    }
  };

  useEffect(() => {
    if (showIdCard) {
      generateIdCardBackground();
    }
  }, [showIdCard, fullName, phoneNo, profession, registrationDate, regNumber, panFile, aadhaarFile, kycState]);

  const handleDownloadIdCard = async () => {
    setIsDownloading(true);
    try {
      if (idCardDataUrl) {
        const downloadLink = document.createElement('a');
        downloadLink.href = idCardDataUrl;
        const cleanFileName = `CWB_ID_Card_${fullName.replace(/\s+/g, '_')}.png`;
        downloadLink.download = cleanFileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } else {
        await generateIdCardBackground();
        if (idCardDataUrl) {
          const downloadLink = document.createElement('a');
          downloadLink.href = idCardDataUrl;
          const cleanFileName = `CWB_ID_Card_${fullName.replace(/\s+/g, '_')}.png`;
          downloadLink.download = cleanFileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3000);
        }
      }
    } catch (error) {
      console.error("Error downloading ID card:", error);
      alert("డౌన్‌లోడ్ చేయడంలో సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (controlState === 'temp_off' || controlState === 'perm_off') {
    return (
      <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-md">
        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h4 className="text-gray-900 font-bold">KYC వెరిఫికేషన్ నిలిపివేయబడింది</h4>
        <p className="text-xs text-red-500 font-semibold">KYC Verification Blocked</p>
        <p className="text-gray-500 text-xs mt-2">అడ్మిన్ ద్వారా ఈ విభాగం ప్రస్తుతం అందుబాటులో లేదు.</p>
      </div>
    );
  }

  if (controlState === 'soft_delete' || controlState === 'hard_delete') {
    return null;
  }

  const isUpgraded = controlState === 'perm_upgrade';

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-lg border border-gray-100 space-y-4 relative ${
      isUpgraded ? 'ring-2 ring-[#FFC000] border-[#FFC000]' : ''
    }`}>
      {/* Hidden inputs for real photo gallery selection */}
      <input 
        type="file" 
        ref={aadhaarInputRef} 
        onChange={handleAadhaarChange} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={panInputRef} 
        onChange={handlePanChange} 
        accept="image/*" 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={cardInputRef} 
        onChange={handleCardChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div>
        <h4 className="font-bold text-sm text-[#082c75] flex items-center gap-1.5">
          <Shield className="w-4.5 h-4.5 text-[#082c75]" />
          <span>శ్రమ కార్డ్ ధృవీకరణ & ఐడి జారీ</span>
        </h4>
        <p className="text-xs text-gray-500">మీ లేబర్ కార్డు లేదా ఈ-శ్రమ కార్డు వివరాల ద్వారా అనుభవాన్ని నిర్ధారించి ఐడి పొందండి.</p>
      </div>

      {/* Google Authentication Block */}
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border shadow-xs font-bold text-gray-600 font-mono text-sm">
            G
          </div>
          <div>
            <div className="text-xs font-bold text-gray-800">గూగుల్ వెరిఫికేషన్ / Google Auth</div>
            <div className="text-[10px] text-gray-500">
              {googleLoggedIn ? 'ఆమోదించబడింది / Verified' : 'వన్-క్లిక్ వెరిఫై'}
            </div>
          </div>
        </div>
        <button
          onClick={() => setGoogleLoggedIn(true)}
          disabled={googleLoggedIn}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition ${
            googleLoggedIn
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 shadow-xs'
          }`}
        >
          {googleLoggedIn ? '✓ వెరిఫై అయింది' : 'గూగుల్ తో లాగిన్'}
        </button>
      </div>

      {/* Aadhaar and PAN Document Frame Upload Simulator */}
      <div className="grid grid-cols-2 gap-4">
        {/* Aadhaar */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-gray-600 block">ఆధార్ కార్డు / Aadhaar Card</span>
          <div className={`h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden bg-gray-50 relative ${
            aadhaarFile ? 'border-emerald-500' : 'border-[#082c75]/30 hover:border-[#082c75]/60'
          }`}>
            {aadhaarFile ? (
              <>
                <img loading="lazy" decoding="async" src={aadhaarFile} alt="Aadhaar" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                  <button onClick={triggerMockAadhaar} className="bg-white/90 text-[#082c75] p-1.5 rounded-full shadow">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <button type="button" onClick={triggerMockAadhaar} className="flex flex-col items-center text-[#082c75]/70 p-2 text-center">
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold">ఫోటో అప్‌లోడ్ చేయండి</span>
              </button>
            )}
          </div>
        </div>

        {/* PAN */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-gray-600 block">పాన్ కార్డు / PAN Card</span>
          <div className={`h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden bg-gray-50 relative ${
            panFile ? 'border-emerald-500' : 'border-[#082c75]/30 hover:border-[#082c75]/60'
          }`}>
            {panFile ? (
              <>
                <img loading="lazy" decoding="async" src={panFile} alt="PAN Card" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                  <button onClick={triggerMockPan} className="bg-white/90 text-[#082c75] p-1.5 rounded-full shadow">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <button type="button" onClick={triggerMockPan} className="flex flex-col items-center text-[#082c75]/70 p-2 text-center">
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-bold">ఫోటో అప్‌లోడ్ చేయండి</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Labour / E-Shram Card Verification Section */}
      <div className="p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/20 space-y-3">
        <div className="flex items-center gap-1.5 border-b border-amber-500/10 pb-1.5">
          <Award className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-extrabold text-amber-900">లేబర్ / ఈ-శ్రమ కార్డ్ ధృవీకరణ</span>
        </div>

        {/* Worker Details Fields */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-bold text-gray-500 block mb-0.5">పూర్తి పేరు (Full Name)</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-800 font-medium focus:ring-1 focus:ring-[#082c75] outline-hidden"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-gray-500 block mb-0.5">మొబైల్ నంబర్ (Phone)</label>
              <input 
                type="text" 
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="w-full px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-800 font-medium focus:ring-1 focus:ring-[#082c75] outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-bold text-gray-500 block mb-0.5">పని విభాగం (Profession)</label>
              <select 
                value={profession} 
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-1.5 py-1 text-xs rounded border border-gray-300 bg-white text-gray-800 font-medium focus:ring-1 focus:ring-[#082c75] outline-hidden"
              >
                <option value="మేస్త్రీ (Mason)">మేస్త్రీ (Mason)</option>
                <option value="హెల్పర్ (Helper)">హెల్పర్ (Helper)</option>
                <option value="పెయింటర్ (Painter)">పెయింటర్ (Painter)</option>
                <option value="ప్లంబర్ (Plumber)">ప్లంబర్ (Plumber)</option>
                <option value="ఎలక్ట్రీషియన్ (Electrician)">ఎలక్ట్రీషియన్ (Electrician)</option>
                <option value="కార్పెంటర్ (Carpenter)">కార్పెంటర్ (Carpenter)</option>
                <option value="టైల్స్ మేస్త్రీ (Tiles Mason)">టైల్స్ మేస్త్రీ (Tiles)</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] font-bold text-gray-500 block mb-0.5">కార్డు రకం (Card Type)</label>
              <div className="flex bg-white rounded border border-gray-300 overflow-hidden text-[9px]">
                <button 
                  type="button"
                  onClick={() => { setCardType('labour'); setCardFile(null); }}
                  className={`flex-1 py-1 font-extrabold transition ${cardType === 'labour' ? 'bg-[#082c75] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  లేబర్
                </button>
                <button 
                  type="button"
                  onClick={() => { setCardType('eshram'); setCardFile(null); }}
                  className={`flex-1 py-1 font-extrabold transition ${cardType === 'eshram' ? 'bg-[#082c75] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  ఈ-శ్రమ
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Registration Date of Card */}
            <div>
              <label className="text-[9px] font-bold text-gray-500 block mb-0.5">రిజిస్ట్రేషన్/జారీ తేదీ</label>
              <input 
                type="date" 
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
                className="w-full px-2 py-0.5 text-xs rounded border border-gray-300 bg-white text-gray-800 font-mono focus:ring-1 focus:ring-[#082c75] outline-hidden"
              />
            </div>

            {/* Simulated Upload of Card */}
            <div>
              <label className="text-[9px] font-bold text-gray-500 block mb-0.5">కార్డు కాపీ అప్‌లోడ్</label>
              <button 
                type="button"
                onClick={triggerMockCard}
                className={`w-full py-1 px-2 rounded border border-dashed text-center text-[10px] font-bold transition-all ${
                  cardFile ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-white border-amber-300 text-amber-800 hover:bg-amber-100/30'
                }`}
              >
                {cardFile ? '✓ కార్డ్ చేర్చబడింది' : `+ అప్‌లోడ్ (${cardType === 'labour' ? 'లేబర్' : 'ఈ-శ్రమ'})`}
              </button>
            </div>
          </div>

          {/* Registration Number Field - Styled as a stand-out separate card/board */}
          <div className="p-3 bg-white border border-amber-500/20 rounded-xl shadow-xs space-y-1.5">
            <label className="text-[10px] font-black text-[#082c75] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC000]"></span>
              <span>లేబర్ కార్డ్ రిజిస్ట్రేషన్ నెంబర్ / Registration Number</span>
            </label>
            <input 
              type="text" 
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="ఉదాహరణ: LBR-98480-22338"
              className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-300 bg-white text-gray-850 font-bold font-mono focus:ring-1 focus:ring-[#082c75] outline-hidden placeholder:font-sans placeholder:font-normal"
            />
            <p className="text-[8.5px] text-gray-400 leading-tight">
              గమనిక: ఈ రిజిస్ట్రేషన్ నంబర్ ఆధారంగానే మీ డిజిటల్ ఐడెంటిటీ కార్డ్ నంబర్ జారీ చేయబడుతుంది.
            </p>
          </div>
        </div>

        {/* Live dynamic logic badge based on years */}
        <div className="bg-white/85 p-2 rounded-lg border border-amber-200 flex items-center justify-between text-[11px]">
          <div>
            <span className="font-bold text-gray-400 text-[8px] block uppercase">నిర్ధారించిన అనుభవం / Service:</span>
            <span className="font-black text-[#082c75]">{expYears} సంవత్సరాలు ({expYears} Years)</span>
          </div>
          <div className="text-right">
            <span className="font-bold text-gray-400 text-[8px] block uppercase">జారీ అయ్యే ఐడి / ID Tier:</span>
            <span className="px-1.5 py-0.5 bg-[#082c75] text-white font-extrabold text-[9px] rounded-sm uppercase tracking-wider block mt-0.5">
              {expYears >= 10 ? '💎 DIAMOND' : expYears >= 5 ? '🥇 GOLD' : expYears >= 3 ? '🥈 SILVER' : '🥉 BRONZE'}
            </span>
          </div>
        </div>
      </div>

      {/* KYC Final Submission */}
      <button
        onClick={triggerVerifyAll}
        disabled={!googleLoggedIn || !aadhaarFile || !panFile || !cardFile}
        className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 ${
          (googleLoggedIn && aadhaarFile && panFile && cardFile)
            ? 'bg-[#082c75] text-[#FFC000] hover:bg-[#082c75]/95 shadow-md active:scale-[0.99] transition-all cursor-pointer'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <ShieldCheck className="w-4 h-4" />
        <span>
          {kycState.verified ? 'ఐడి కార్డు జారీ చేయబడింది / ID CARD ISSUED' : 'ధృవీకరించి ఐడి కార్డ్ జారీ చేయి / Issue ID Card'}
        </span>
      </button>

      {/* Interactive Issued Digital ID Card Display */}
      {showIdCard && (
        <div className="mt-2 pt-3 border-t border-gray-100 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h5 className="font-extrabold text-[11px] text-[#082c75] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>డిజిటల్ సివిల్ వర్కర్ ఐడి కార్డ్ జారీ అయినది</span>
            </h5>
            <button 
              onClick={() => setShowIdCard(false)}
              className="text-gray-400 hover:text-gray-600 text-xs font-bold"
            >
              దాచు
            </button>
          </div>

          {/* Premium Metallic/Glossy ID Card Layout (Super Light) */}
          <div className={`w-full max-w-sm mx-auto bg-gradient-to-br ${idBgGradient} rounded-2xl p-4 shadow-2xl border-2 ${borderHighlight} relative overflow-hidden text-slate-800`}>
            {/* Glossy Reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
            
            {/* Top Bar of Card */}
            <div className="flex justify-between items-center border-b border-slate-300/60 pb-1.5 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-amber-400 flex-shrink-0 flex items-center justify-center shadow-xs">
                  <img src="https://i.ibb.co/7JnVZGLw/1784961900190.png" alt="CWRB Logo" className="w-full h-full object-contain scale-[1.2]" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="text-[11.5px] font-extrabold tracking-wider text-[#082c75] leading-none">CWB సివిల్ వర్కర్స్ సమాఖ్య</h3>
                  <p className="text-[5.5px] font-mono font-bold tracking-widest text-slate-600 uppercase mt-0.5">CIVIL WORKER RELATION BOOK</p>
                </div>
              </div>
              <span className="text-[7.5px] bg-slate-200/80 px-2.5 py-0.5 rounded-full font-black tracking-wider text-slate-700 border border-slate-300/40">
                {badgeLabel}
              </span>
            </div>

            {/* Middle Section: Avatar and Information */}
            <div className="flex gap-3">
              {/* Photo Area */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-300/70 flex items-center justify-center overflow-hidden relative shadow-sm">
                  {panFile ? (
                    <img src={panFile} alt="Worker Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : aadhaarFile ? (
                    <img src={aadhaarFile} alt="Worker Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : kycState.panImage ? (
                    <img src={kycState.panImage} alt="Worker Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : kycState.aadhaarImage ? (
                    <img src={kycState.aadhaarImage} alt="Worker Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-amber-500 bg-white flex items-center justify-center text-xl shadow-xs">
                      👷
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-[5.5px] py-0.5 text-center font-black text-white tracking-wider">
                    VERIFIED
                  </div>
                </div>
                <span className="text-[5px] font-mono text-slate-500 mt-1 uppercase leading-none">ID CODE</span>
                <span className="text-[8px] font-mono font-black text-slate-700">#{kycState.idCardNumber ? kycState.idCardNumber.split('-')[2] : '827493'}</span>
              </div>

              {/* Data Rows */}
              <div className="flex-1 space-y-1.5 text-[11px] text-slate-800">
                <div>
                  <span className="text-[7px] text-slate-500 block leading-none font-bold">పేరు / Name</span>
                  <span className="font-black text-[12.5px] text-slate-900 leading-tight block">{fullName}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-1 pt-0.5">
                  <div>
                    <span className="text-[7px] text-slate-500 block leading-none font-bold">వృత్తి / Trade</span>
                    <span className="font-bold text-[9.5px] text-blue-800">{profession.split(' ')[0]}</span>
                  </div>
                  <div>
                    <span className="text-[7px] text-slate-500 block leading-none font-bold">మొబైల్ / Mobile</span>
                    <span className="font-bold text-[9.5px] text-slate-800">{phoneNo}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[7px] text-slate-500 block leading-none font-bold">రిజిస్ట్రేషన్ నెంబర్ / Reg No</span>
                  <span className="font-bold font-mono text-[9.5px] text-red-700 block break-all leading-normal">{kycState.registrationNumber || regNumber}</span>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-0.5">
                  <div>
                    <span className="text-[7px] text-slate-500 block leading-none font-bold">అనుభవం / Service</span>
                    <span className="font-black text-[9.5px] text-emerald-700">{expYears} Years</span>
                  </div>
                  <div>
                    <span className="text-[7px] text-slate-500 block leading-none font-bold">రిజిస్ట్రేషన్ తేదీ / Reg Date</span>
                    <span className="font-bold font-mono text-[8px] text-slate-700">{registrationDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                {/* Real Scannable QR Code */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.origin + "/?verify=true&id=" + (kycState.idCardNumber || "CWB-2026-827493"))}`}
                  alt="QR Code" 
                  className="w-8 h-8 bg-white p-0.5 rounded shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div className="leading-tight">
                  <span className="text-[6px] text-slate-500 block font-mono font-bold">CWRB OFFICIAL DIGITAL ID</span>
                  <span className="text-[7.5px] font-mono font-black text-blue-800">#{kycState.idCardNumber ? kycState.idCardNumber : `CWB-2026-${kycState.idCardNumber ? kycState.idCardNumber.split('-')[2] : '827493'}`}</span>
                </div>
              </div>
              <div className="text-[7.5px] font-extrabold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Active ID</span>
              </div>
            </div>
          </div>

          {/* Card Download Actions */}
          {idCardDataUrl && (
            <div className="text-center max-w-sm mx-auto px-2">
              <p className="text-[9.5px] text-slate-600 font-bold bg-slate-100/90 py-1 px-3 rounded-lg border border-slate-200">
                💡 మొబైల్ లో సేవ్ అవ్వకపోతే కార్డు పై నొక్కి పట్టుకుని "Download Image" ఎంచుకోండి! (Long-press image to save)
              </p>
            </div>
          )}
          <div className="flex gap-2 justify-center max-w-sm mx-auto">
            <button
              onClick={handleDownloadIdCard}
              disabled={isDownloading}
              className="flex-1 bg-slate-900 hover:bg-black text-white py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>డౌన్‌లోడ్ అవుతోంది...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">గ్యాలరీ లో సేవ్ అయ్యింది!</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3" />
                  <span>డౌన్‌లోడ్ ఐడి కార్డ్</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                alert(`ప్రింట్ ఆర్డర్ విజయవంతంగా స్వీకరించబడింది! మీ భౌతిక (Physical) ${idCardName} 7 రోజుల్లో మీ చిరునామాకు కొరియర్ ద్వారా పంపబడుతుంది.`);
              }}
              className="px-3 bg-[#FFC000] hover:bg-[#FFE060] text-[#082c75] py-1.5 rounded-lg text-[10px] font-extrabold transition active:scale-[0.98] cursor-pointer"
            >
              పోస్ట్ లో కార్డు పొందండి
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. WORKER WALLET LEDGER SYSTEM
// ==========================================
interface WalletProps {
  balance: number;
  transactions: WalletTransaction[];
  onAddFunds?: (points: number) => void;
  controlState?: ControlState;
}
export function WalletLedger({ balance, transactions, onAddFunds, controlState = 'temp_on' }: WalletProps) {
  if (controlState === 'temp_off' || controlState === 'perm_off') {
    return (
      <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-md">
        <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h4 className="text-gray-900 font-bold">వాలెట్ అందుబాటులో లేదు</h4>
        <p className="text-xs text-red-500 font-semibold">Wallet Suspended</p>
        <p className="text-gray-500 text-xs mt-2">అడ్మినిస్ట్రేటర్ ద్వారా ఈ వాలెట్ ఫీచర్ ప్రస్తుతం ఆఫ్ చేయబడింది.</p>
      </div>
    );
  }

  if (controlState === 'soft_delete' || controlState === 'hard_delete') {
    return null;
  }

  const isUpgraded = controlState === 'perm_upgrade';

  return (
    <div className={`bg-gradient-to-br from-[#082c75] to-slate-900 text-white rounded-2xl p-5 shadow-xl relative overflow-hidden ${
      isUpgraded ? 'ring-4 ring-[#FFC000] border-2 border-[#FFC000]' : ''
    }`}>
      {/* Absolute gold glow */}
      <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#FFC000]/10 rounded-full blur-2xl" />

      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-xs text-gray-300">వర్కర్ డిజిటల్ వాలెట్ / Wallet Balance</h4>
          <div className="text-3xl font-black text-[#FFC000] tracking-wide mt-1 font-mono">
            {balance} <span className="text-xs font-bold text-white">పాయింట్లు / Points</span>
          </div>
        </div>
        <button
          onClick={() => onAddFunds && onAddFunds(500)}
          className="bg-[#FFC000] text-[#082c75] font-bold text-[10px] px-3 py-1.5 rounded-lg hover:brightness-105 transition"
        >
          + 500 రీఛార్జ్ / Add
        </button>
      </div>

      <div className="border-t border-white/10 pt-3">
        <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-2">
          ఖర్చుల వివరాలు / Wallet Statement
        </div>
        <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex justify-between items-center text-xs bg-white/5 p-2 rounded-lg hover:bg-white/10 transition">
              <div>
                <div className="font-bold text-gray-200 text-[11px]">{tx.descriptionTe}</div>
                <div className="text-[9px] text-gray-400 font-mono">{tx.date} • {tx.descriptionEn}</div>
              </div>
              <span className={`font-black font-mono text-[11px] ${
                tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {tx.type === 'credit' ? '+' : ''}{tx.points} PT
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. BUSINESS SUBSCRIPTION TIERS
// ==========================================
interface SubProps {
  controlState?: ControlState;
}
export function SubscriptionTiers({ controlState = 'temp_on' }: SubProps) {
  const [selectedTier, setSelectedTier] = useState<'silver' | 'gold' | 'diamond' | null>(null);
  const [activeSubscription, setActiveSubscription] = useState<'silver' | 'gold' | 'diamond' | null>(() => {
    return (localStorage.getItem('cwb_active_subscription') as 'silver' | 'gold' | 'diamond' | null) || null;
  });
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (controlState === 'temp_off' || controlState === 'perm_off') {
    return (
      <div className="bg-slate-50 rounded-2xl p-6 text-center border text-gray-400">
        <Landmark className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h4 className="text-slate-800 font-bold">సబ్స్క్రిప్షన్ ప్లాన్లు లేవు</h4>
        <p className="text-xs text-red-500 font-semibold">Subscriptions Suspended</p>
      </div>
    );
  }

  if (controlState === 'soft_delete' || controlState === 'hard_delete') {
    return null;
  }

  const isUpgraded = controlState === 'perm_upgrade';

  const tiers = [
    { 
      id: 'silver' as const, 
      nameEn: 'Silver Postpaid Plan', 
      nameTe: 'సిల్వర్ పోస్ట్‌పెయిడ్ ప్లాన్', 
      price: '₹299/Mo', 
      priceVal: 299,
      color: 'from-slate-400 to-slate-500', 
      benefits: ['నెలవారీ 10 లీడ్స్', 'పోస్ట్‌పెయిడ్ బీపీ & షుగర్ రిపోర్ట్', 'ఆధార్ వెరిఫికేషన్'] 
    },
    { 
      id: 'gold' as const, 
      nameEn: 'Gold Postpaid Plan', 
      nameTe: 'గోల్డ్ పోస్ట్‌పెయిడ్ ప్లాన్', 
      price: '₹499/Mo', 
      priceVal: 499,
      color: 'from-amber-400 to-[#FFC000]', 
      benefits: ['నెలవారీ 30 లీడ్స్', 'స్మార్ట్ బయో-పవర్ + AI డాక్టర్', '24/7 పోస్ట్‌పెయిడ్ సపోర్ట్'],
      popular: true
    },
    { 
      id: 'diamond' as const, 
      nameEn: 'Diamond Postpaid Plan', 
      nameTe: 'డైమండ్ పోస్ట్‌పెయిడ్ ప్లాన్', 
      price: '₹899/Mo', 
      priceVal: 899,
      color: 'from-blue-500 to-indigo-600', 
      benefits: ['పరిమితి లేని లీడ్స్ & AI డాక్టర్', 'రౌండ్ 25KM రేంజ్', 'వాయిస్ వాకీటాకీ సపోర్ట్'] 
    }
  ];

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'CWRB50') {
      setPromoApplied(true);
      setDiscountAmount(50);
      setPromoMessage('ప్రోమో కోడ్ విజయవంతంగా జోడించబడింది! 50% నెలవారీ ప్లాన్ తగ్గింపు వర్తించబడుతుంది.');
    } else if (code === 'FREE6') {
      setPromoApplied(true);
      setDiscountAmount(100);
      setPromoMessage('ప్రోమో కోడ్ విజయవంతంగా జోడించబడింది! మొదటి 6 నెలలు పూర్తిగా ఉచితం!');
    } else {
      setPromoApplied(false);
      setDiscountAmount(0);
      setPromoMessage('చెల్లని ప్రోమో కోడ్. దయచేసి సరైన కోడ్ ఇవ్వండి.');
    }
  };

  const handleSubscribe = () => {
    if (!selectedTier) return;
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setActiveSubscription(selectedTier);
      localStorage.setItem('cwb_active_subscription', selectedTier);
      setShowReceipt(true);
    }, 1800);
  };

  const handleCancelSub = () => {
    if (!confirmCancel) {
      setConfirmCancel(true);
      // Auto reset confirm state after 5 seconds if not clicked again
      setTimeout(() => {
        setConfirmCancel(false);
      }, 5000);
      return;
    }
    setActiveSubscription(null);
    localStorage.removeItem('cwb_active_subscription');
    setSelectedTier(null);
    setPromoApplied(false);
    setPromoCode('');
    setPromoMessage('');
    setDiscountAmount(0);
    setConfirmCancel(false);
  };

  return (
    <div className={`space-y-4 ${isUpgraded ? 'p-3 bg-amber-50 rounded-2xl border border-amber-300' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-sm text-[#082c75] flex items-center gap-1.5">
            <Landmark className="w-4.5 h-4.5 text-[#082c75]" />
            <span>ప్రీమియం పోస్ట్‌పెయిడ్ సేవలు & బిల్లింగ్ కార్డులు / Postpaid Premium Plans & Billing</span>
          </h4>
          <p className="text-xs text-gray-500">మొదట వాడుకోండి - ఆపై చెల్లించండి! / Pay-After-Use Postpaid Billing Scheme!</p>
        </div>
        {activeSubscription && (
          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2.5 py-1 rounded-full border border-emerald-200 animate-pulse uppercase">
            యాక్టివ్ పోస్ట్‌పెయిడ్ / Active Postpaid
          </span>
        )}
      </div>

      {/* Active Subscription Banner */}
      {activeSubscription && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[8.5px] font-black text-emerald-700 bg-emerald-200/50 px-2 py-0.5 rounded-full block w-fit mb-1 uppercase">
                పోస్ట్‌పెయిడ్ ప్లాన్ / POSTPAID PLAN
              </span>
              <h5 className="font-extrabold text-xs text-emerald-950">
                {activeSubscription === 'silver' ? 'సిల్వర్ పోస్ట్‌పెయిడ్ ప్లాన్ (Silver Postpaid Plan)' : activeSubscription === 'gold' ? 'గోల్డ్ పోస్ట్‌పెయిడ్ ప్లాన్ (Gold Postpaid Plan)' : 'డైమండ్ పోస్ట్‌పెయిడ్ ప్లాన్ (Diamond Postpaid Plan)'}
              </h5>
              <p className="text-[10px] text-emerald-800/90 leading-tight">
                బిల్లింగ్ స్థితి: మొదటి 3 నెలల ఉచిత ట్రయల్ (తదుపరి బిల్లింగ్ తేదీ: 19 అక్టోబర్, 2026)
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <button 
              onClick={() => setShowReceipt(true)}
              className="px-2.5 py-1 bg-[#082c75] text-white hover:bg-[#061e52] text-[9.5px] font-extrabold rounded-md transition"
            >
              రసీదు / Receipt
            </button>
            <button 
              onClick={handleCancelSub}
              className={`px-2.5 py-1 text-[9.5px] font-extrabold rounded-md transition ${
                confirmCancel 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                  : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
              }`}
            >
              {confirmCancel ? 'నిజంగా రద్దు చేయాలా? (మళ్లీ నొక్కండి)' : 'రద్దు చేయి'}
            </button>
          </div>
        </div>
      )}

      {/* Tiers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tiers.map((tier) => {
          const isActive = activeSubscription === tier.id;
          const isSelected = selectedTier === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => {
                if (!activeSubscription) {
                  setSelectedTier(tier.id);
                }
              }}
              className={`cursor-pointer rounded-xl overflow-hidden border transition-all duration-300 relative ${
                isActive
                  ? 'border-emerald-500 ring-4 ring-emerald-500/20'
                  : isSelected
                  ? 'border-[#082c75] ring-4 ring-[#082c75]/25 scale-[1.02]'
                  : 'border-gray-200 hover:border-gray-350 hover:shadow-xs'
              } bg-white`}
            >
              {/* Active checkmark absolute */}
              {isActive && (
                <div className="absolute right-2 top-10 bg-emerald-600 text-white p-1 rounded-full shadow-md z-10">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* Tier banner head */}
              <div className={`bg-gradient-to-r ${tier.color} text-white px-3 py-2 text-center relative`}>
                {tier.popular && (
                  <span className="absolute left-1.5 top-1.5 bg-[#082c75] text-white text-[7px] font-black px-1 py-0.5 rounded">
                    POPULAR
                  </span>
                )}
                <div className="font-extrabold text-xs">{tier.nameTe}</div>
                <div className="text-[9.5px] opacity-90 font-bold">{tier.nameEn}</div>
              </div>

              <div className="p-3 text-center">
                <div className="text-lg font-black text-gray-900 font-mono">{tier.price}</div>
                <div className="text-[9px] text-gray-400 mt-0.5">మొదటి 3 నెలలు ₹0</div>

                <ul className="mt-2.5 text-[10px] text-gray-600 text-left space-y-1.5 divide-y divide-gray-50">
                  {tier.benefits.map((b, idx) => (
                    <li key={idx} className="pt-1.5 flex items-center gap-1.5">
                      <Check className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-[#082c75]'}`} />
                      <span className="font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic interactive subscription payment checkout card */}
      {selectedTier && !activeSubscription && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-br from-[#082c75]/5 to-[#082c75]/10 border border-[#082c75]/15 rounded-2xl space-y-3 shadow-xs"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-black text-[#082c75] bg-amber-400/25 px-2.5 py-0.5 rounded-full block w-fit mb-1">
                ఎంపిక చేసిన పోస్ట్‌పెయిడ్ ప్లాన్ / SELECTED POSTPAID PLAN
              </span>
              <h5 className="font-extrabold text-xs text-[#082c75]">
                {selectedTier === 'silver' ? 'సిల్వర్ పోస్ట్‌పెయిడ్ ప్లాన్ (Silver Postpaid)' : selectedTier === 'gold' ? 'గోల్డ్ పోస్ట్‌పెయిడ్ ప్లాన్ (Gold Postpaid)' : 'డైమండ్ పోస్ట్‌పెయిడ్ ప్లాన్ (Diamond Postpaid)'}
              </h5>
              <p className="text-[10px] text-gray-500 leading-tight">మొదటి 3 నెలలు పోస్ట్‌పెయిడ్ ట్రయల్ వ్యవధి పూర్తిగా ఉచితం (₹0)</p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-[#082c75] block font-mono">
                {promoApplied && discountAmount === 100 ? '₹0' : promoApplied ? `₹${Math.floor(tiers.find(t => t.id === selectedTier)!.priceVal * (1 - discountAmount / 100))}` : tiers.find(t => t.id === selectedTier)!.price}
                {!promoApplied && <span className="text-[9.5px] font-bold text-gray-400">/నెలకు</span>}
              </span>
              <span className="text-[8.5px] text-emerald-600 font-extrabold block">వాడిన తర్వాతే చెల్లింపు</span>
            </div>
          </div>

          {/* Promocode section */}
          <div className="flex gap-2 items-center pt-2 border-t border-dashed border-[#082c75]/10">
            <input 
              type="text" 
              placeholder="ప్రోమో కోడ్ (ఉదా: CWRB50, FREE6)" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-2.5 py-1.5 text-xs rounded border border-gray-300 bg-white font-bold uppercase placeholder:font-normal placeholder:capitalize focus:outline-hidden text-gray-800"
            />
            <button 
              onClick={handleApplyPromo}
              className="px-3.5 py-1.5 bg-[#082c75] hover:bg-[#061e52] text-white text-xs font-black rounded-lg transition"
            >
              అప్లై / Apply
            </button>
          </div>
          {promoMessage && (
            <p className={`text-[9px] font-bold ${promoApplied ? 'text-emerald-600' : 'text-rose-500'}`}>{promoMessage}</p>
          )}

          {/* Subscribing action button */}
          <button
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="w-full py-3 bg-[#FFC000] hover:bg-[#e0a800] text-[#082c75] font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {isSubscribing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>పోస్ట్‌పెయిడ్ ప్లాన్ యాక్టివేట్ అవుతోంది...</span>
              </>
            ) : (
              <span>పోస్ట్‌పెయిడ్ ఉచితంగా ప్రారంభించండి / Start Free Postpaid Now</span>
            )}
          </button>
        </motion.div>
      )}

      {/* Professional Tax Invoice / Receipt Modal */}
      {showReceipt && activeSubscription && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-gray-800 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-150"
          >
            {/* Receipt Header */}
            <div className="bg-[#082c75] text-white p-5 text-center relative">
              <button 
                onClick={() => setShowReceipt(false)}
                className="absolute left-4 top-4 text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition flex items-center justify-center"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="absolute right-4 top-4 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <Landmark className="w-10 h-10 text-amber-400 mx-auto mb-1.5" />
              <h4 className="font-extrabold text-sm tracking-tight">పోస్ట్‌పెయిడ్ సేవలు & బిల్లింగ్ రసీదు / Invoice</h4>
              <p className="text-[9px] text-white/70">CWRB MULTIPURPOSE SERVICES PVT LTD</p>
            </div>

            <div className="p-5 space-y-4">
              {/* Receipt metadata list */}
              <div className="text-[10.5px] space-y-2 border-b pb-3 border-dashed">
                <div className="flex justify-between">
                  <span className="text-gray-400">రసీదు సంఖ్య / Invoice No:</span>
                  <span className="font-mono font-bold">INV-POST-2026-{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">తేదీ / Date:</span>
                  <span className="font-bold">19 జూలై, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">చెల్లింపు పద్ధతి / Payment:</span>
                  <span className="font-bold text-emerald-600">పోస్ట్‌పెయిడ్ ట్రయల్ (Trial ₹0)</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black text-[#082c75]">
                    {activeSubscription === 'silver' ? 'సిల్వర్ పోస్ట్‌పెయిడ్ ప్లాన్' : activeSubscription === 'gold' ? 'గోల్డ్ పోస్ట్‌పెయిడ్ ప్లాన్' : 'డైమండ్ పోస్ట్‌పెయిడ్ ప్లాన్'}
                  </span>
                  <span className="font-mono font-black text-xs text-gray-700">
                    {tiers.find(t => t.id === activeSubscription)?.price}
                  </span>
                </div>
                <p className="text-[9px] text-gray-500">
                  3 నెలల ఉచిత ట్రయల్ పోస్ట్‌పెయిడ్ వ్యవధి ముగిసేవరకు మీకు ఎటువంటి ఛార్జీలు వర్తించవు.
                </p>
              </div>

              {/* Total Calculation */}
              <div className="space-y-1.5 text-xs pt-1.5">
                <div className="flex justify-between">
                  <span>ఉపమొత్తం / Subtotal</span>
                  <span className="font-mono text-gray-600">{tiers.find(t => t.id === activeSubscription)?.price}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>ట్రయల్ డిస్కౌంట్ / Trial Discount</span>
                  <span className="font-mono">- {tiers.find(t => t.id === activeSubscription)?.price}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600 font-bold text-[10.5px]">
                    <span>ప్రోమో తగ్గింపు / Promo Added ({discountAmount}%)</span>
                    <span className="font-mono">వర్తించబడింది</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-[#082c75] border-t pt-2 mt-2 text-sm">
                  <span>నేడు చెల్లించాల్సిన మొత్తం</span>
                  <span className="font-mono text-lg">₹0</span>
                </div>
              </div>

              {/* Next bill advisory info */}
              <p className="text-[8.5px] text-gray-400 leading-tight text-center">
                తదుపరి బిల్లింగ్ తేదీ 19 అక్టోబర్, 2026 నుండి ప్లాన్ రుసుము వర్తిస్తుంది. మీరు ఏ సమయంలోనైనా సెట్టింగ్స్ ద్వారా దీనిని రద్దు చేసుకోవచ్చు.
              </p>

              {/* Action */}
              <button
                onClick={() => setShowReceipt(false)}
                className="w-full py-2 bg-[#082c75] hover:bg-[#061e52] text-white font-black text-xs rounded-xl shadow-md transition"
              >
                పూర్తయింది / Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
// ==========================================
// 5. MANUAL PAYMENT PRIVATE DIARY
// ==========================================
interface DiaryProps {
  entries: DiaryEntry[];
  onAddEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
  controlState?: ControlState;
}
export function PrivateDiary({ entries, onAddEntry, onDeleteEntry, controlState = 'temp_on' }: DiaryProps) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;

    onAddEntry({
      date: new Date().toISOString().split('T')[0],
      description: desc,
      amount: parseFloat(amount),
      type
    });

    setDesc('');
    setAmount('');
  };

  if (controlState === 'temp_off' || controlState === 'perm_off') {
    return (
      <div className="bg-white rounded-2xl p-6 text-center border text-gray-400">
        <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="text-gray-800 font-bold">వ్యక్తిగత డైరీ నిలిపివేయబడింది</h4>
        <p className="text-xs text-red-500 font-semibold">Expense Diary Suspended</p>
      </div>
    );
  }

  if (controlState === 'soft_delete' || controlState === 'hard_delete') {
    return null;
  }

  const isUpgraded = controlState === 'perm_upgrade';

  // Calculate totals
  const totalIncome = entries.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <div className={`bg-white rounded-2xl p-5 shadow-lg border border-gray-100 space-y-4 ${
      isUpgraded ? 'ring-2 ring-[#FFC000]' : ''
    }`}>
      <div>
        <h4 className="font-bold text-sm text-[#082c75] flex items-center gap-1.5">
          <BookOpen className="w-4.5 h-4.5 text-[#082c75]" />
          <span>వ్యక్తిగత ఖర్చుల డిజిటల్ డైరీ / Private Expense Diary</span>
        </h4>
        <p className="text-xs text-gray-500">వర్కర్ల ఆదాయం మరియు రోజువారీ ఖర్చుల డైరీ</p>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
        <div className="bg-emerald-50 text-emerald-800 p-2 rounded-xl border border-emerald-100">
          <div>ఆదాయం / Income</div>
          <div className="text-sm font-black font-mono mt-0.5">₹{totalIncome}</div>
        </div>
        <div className="bg-rose-50 text-rose-800 p-2 rounded-xl border border-rose-100">
          <div>ఖర్చులు / Expense</div>
          <div className="text-sm font-black font-mono mt-0.5">₹{totalExpense}</div>
        </div>
        <div className="bg-blue-50 text-blue-800 p-2 rounded-xl border border-blue-100">
          <div>నికర లాభం / Net</div>
          <div className="text-sm font-black font-mono mt-0.5">₹{totalBalance}</div>
        </div>
      </div>

      {/* Entry add Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <input
              type="text"
              required
              placeholder="వివరం / Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#082c75]"
            />
          </div>
          <div>
            <input
              type="number"
              required
              placeholder="మొత్తం / ₹"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none font-mono focus:ring-1 focus:ring-[#082c75]"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                type === 'income' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              + ఆదాయం / Income
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                type === 'expense' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              - ఖర్చు / Expense
            </button>
          </div>
          <button
            type="submit"
            className="px-4 py-1 bg-[#082c75] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-[#082c75]/95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>సేవ్ / Save</span>
          </button>
        </div>
      </form>

      {/* Statement table */}
      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
        {entries.map((entry) => (
          <div key={entry.id} className="flex justify-between items-center text-xs p-2 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition">
            <div className="flex items-center gap-2">
              {entry.type === 'income' ? (
                <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <div>
                <div className="font-semibold text-gray-800">{entry.description}</div>
                <div className="text-[9px] text-gray-400 font-mono">{entry.date}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`font-bold font-mono ${
                entry.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {entry.type === 'income' ? '+' : '-'}₹{entry.amount}
              </span>
              <button
                type="button"
                onClick={() => onDeleteEntry(entry.id)}
                className="text-gray-400 hover:text-red-500 rounded p-1 hover:bg-gray-100 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 6. SMART BIO-POWER MANAGER COMPONENT
// ==========================================
export function BioPowerManager({ 
  controlState = 'temp_on',
  onToggleActive
}: { 
  controlState?: ControlState;
  onToggleActive?: () => void;
}) {
  const [bpm, setBpm] = useState(72);
  const [energySaved, setEnergySaved] = useState(0);
  const [history, setHistory] = useState<number[]>(Array(15).fill(72));

  // AI Doctor Health Scan states
  const [scanStep, setScanStep] = useState<'idle' | 'capturing' | 'analyzing' | 'done'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  const startDoctorScan = () => {
    setScanStep('capturing');
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStep('analyzing');
          setTimeout(() => {
            setScanStep('done');
          }, 1500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  useEffect(() => {
    if (controlState === 'perm_off' || controlState === 'temp_off' || controlState === 'soft_delete' || controlState === 'hard_delete') return;
    
    const interval = setInterval(() => {
      // Simulate BPM fluctuation (between 60 and 110)
      setBpm(prev => {
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        let newBpm = prev + change;
        if (newBpm < 55) newBpm = 55;
        if (newBpm > 120) newBpm = 120;
        
        // Update history
        setHistory(h => {
          const newH = [...h.slice(1), newBpm];
          return newH;
        });
        
        return newBpm;
      });
      
      // If BPM is low (< 80), simulate energy saving
      setBpm(currentBpm => {
        if (currentBpm < 80) {
          setEnergySaved(e => e + 0.1);
        }
        return currentBpm;
      });
      
    }, 2000);
    
    return () => clearInterval(interval);
  }, [controlState]);

  if (controlState === 'soft_delete' || controlState === 'hard_delete') return null;

  const isResting = bpm < 80;

  return (
    <div className={`bg-slate-900 border ${isResting ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-slate-800'} rounded-2xl p-4 overflow-hidden relative`}>
      {/* Background glow when resting */}
      {isResting && (
        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse rounded-2xl pointer-events-none"></div>
      )}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="font-black text-white text-sm flex items-center gap-1.5">
            <Zap className={`w-4 h-4 ${isResting ? 'text-emerald-400' : 'text-[#FFC000]'}`} />
            <span>బయో-ఎనర్జీ మానిటర్</span>
          </h3>
          <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-wide">Smart Bio-Power Manager</p>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 border ${isResting ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
          <BatteryCharging className="w-3 h-3" />
          <span>{isResting ? 'SAVING ON' : 'SAVING OFF'}</span>
        </div>
      </div>
      
      {controlState === 'temp_off' || controlState === 'perm_off' ? (
        <div className="py-8 text-center bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col items-center justify-center space-y-3">
          <Activity className="w-8 h-8 text-slate-500 animate-pulse mx-auto" />
          <div className="space-y-1">
            <h4 className="text-slate-300 font-bold text-xs">మానిటర్ ఆఫ్ చేయబడింది (Monitor OFF)</h4>
            <p className="text-[10px] text-slate-500">ఈ సేవ ప్రస్తుతం నిలిపివేయబడింది. దీనిని ఇప్పుడే ఆక్టివేట్ చేసుకోండి.</p>
          </div>
          {onToggleActive && (
            <button
              onClick={onToggleActive}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] rounded-lg tracking-wider active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer mx-auto"
            >
              <Zap className="w-3.5 h-3.5 animate-pulse" /> మానిటర్ ఆన్ చేయి (Turn Monitor ON)
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          {/* Bio Energy Monitor - Postpaid premium feature */}
          <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 space-y-3 relative overflow-hidden">
            <div className="absolute top-1 right-2 text-[7px] bg-[#FFC000] text-slate-950 px-1 rounded-sm font-black uppercase tracking-wider">
              POSTPAID ONLY
            </div>
            <div className="text-[9.5px] text-emerald-400 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> స్మార్ట్ బయో-ఎనర్జీ మానిటర్ (Smart Bio-Energy Monitor)
            </div>
            
            {/* Main Stats */}
            <div className="flex gap-3">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex-1 relative overflow-hidden">
                <div className="text-[9px] text-slate-400 mb-1 flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500 animate-pulse" /> హృదయ స్పందన (BPM)
                </div>
                <div className="text-2xl font-black font-mono text-white flex items-end gap-1">
                  {bpm} <span className="text-[10px] text-slate-500 font-bold mb-1">BPM</span>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-10">
                  <Heart className="w-16 h-16 text-rose-500" />
                </div>
              </div>
              
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex-1 relative overflow-hidden">
                <div className="text-[9px] text-slate-400 mb-1 flex items-center gap-1">
                  <Battery className="w-3 h-3 text-emerald-400" /> బ్యాటరీ ఆదా (Saved)
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400 flex items-end gap-1">
                  {energySaved.toFixed(1)} <span className="text-[10px] text-emerald-600 font-bold mb-1">mWh</span>
                </div>
              </div>
            </div>
            
            {/* Activity Graph */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <div className="text-[9px] text-slate-400 mb-2 flex justify-between">
                <span>శరీర కదలికలు (Activity Graph)</span>
                <span className="text-emerald-500">Live</span>
              </div>
              <div className="h-16 flex items-end justify-between gap-0.5">
                {history.map((val, i) => {
                  const height = `${((val - 50) / 70) * 100}%`;
                  const isHigh = val >= 90;
                  const isOptimal = val < 80;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`w-full rounded-t-sm ${isHigh ? 'bg-rose-500' : isOptimal ? 'bg-emerald-500' : 'bg-[#FFC000]'}`}
                      style={{ opacity: i === history.length - 1 ? 1 : 0.5 + (i * 0.03) }}
                    />
                  );
                })}
              </div>
            </div>

            <button 
              onClick={() => alert("ఈ బయో ఎనర్జీ సేవలు పోస్ట్ పెయిడ్ వినియోగదారులకు (Postpaid Users) మాత్రమే అందుబాటులో ఉంటాయి! / Premium Postpaid Feature Only!")}
              className="w-full py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[9px] sm:text-[9.5px] rounded-lg tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-md shadow-emerald-500/10"
            >
              ఈ సదుపాయాలన్నీ పోస్ట్ పెయిడ్ వినియోగదారులకు మాత్రమే (Postpaid Users Only)
            </button>
          </div>

          {/* BP & Sugar estimation - Postpaid premium features */}
          <div className="bg-slate-950 p-3 rounded-xl border border-sky-500/30 space-y-2 relative overflow-hidden">
            <div className="absolute top-1 right-2 text-[7px] bg-[#FFC000] text-slate-950 px-1 rounded-sm font-black uppercase tracking-wider">
              POSTPAID ONLY
            </div>
            <div className="text-[9px] text-sky-400 font-bold flex items-center gap-1">
              <Activity className="w-3 h-3 text-sky-400 animate-pulse" /> హార్ట్ రేట్ ఆధారిత రక్తపోటు & షుగర్ అంచనా
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[8.5px] text-slate-400 block mb-0.5">రక్తపోటు (Blood Pressure)</span>
                <span className="text-[11px] sm:text-xs font-black font-mono text-white">
                  {110 + Math.floor((bpm - 60) * 0.5)}/{70 + Math.floor((bpm - 60) * 0.3)} <span className="text-[8px] text-slate-500 font-bold">mmHg</span>
                </span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[8.5px] text-slate-400 block mb-0.5">షుగర్ లెవెల్ (Blood Sugar)</span>
                <span className="text-[11.5px] sm:text-xs font-black font-mono text-white">
                  {Math.round(85 + (bpm - 60) * 0.4)} <span className="text-[8px] text-slate-500 font-bold">mg/dL</span>
                </span>
              </div>
            </div>

            <button 
              onClick={() => alert("ఈ సదుపాయాలన్నీ పోస్ట్ పెయిడ్ వినియోగదారులకు (Postpaid Users) మాత్రమే అందుబాటులో ఉంటాయి! / Premium Postpaid Feature Only!")}
              className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-[#FFC000] text-slate-950 font-black text-[9px] sm:text-[10px] rounded-lg tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[#FFC000]/10"
            >
              ఈ సదుపాయాలన్నీ పోస్ట్ పెయిడ్ వినియోగదారులకు మాత్రమే (Postpaid Users Only)
            </button>
          </div>

          {/* AI Doctor Scanner - Postpaid Feature */}
          <div className="bg-slate-950 p-3 rounded-xl border border-rose-500/30 space-y-3 relative overflow-hidden">
            <div className="absolute top-1 right-2 text-[7px] bg-[#FFC000] text-slate-950 px-1 rounded-sm font-black uppercase tracking-wider">
              POSTPAID ONLY
            </div>
            <div className="text-[9.5px] text-rose-400 font-bold flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> AI డాక్టర్ ఫేస్ హెల్త్ స్కానర్ (Doctor Scan)
            </div>
            
            {scanStep === 'idle' && (
              <div className="space-y-2">
                <p className="text-[9px] text-slate-400 leading-normal">
                  వ్యక్తి ఫోటోను తీయడం ద్వారా కృత్రిమ మేధస్సు (AI) తో వారి వాతావరణ ఆధారిత ఆరోగ్య సమస్యలను, అలసట స్థాయిలను మరియు తక్షణ ఉపశమన సలహాలను డాక్టర్ లాగా విశ్లేషిస్తుంది.
                </p>
                <button
                  onClick={startDoctorScan}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] rounded-lg tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-3 h-3" /> ఫేస్ హెల్త్ స్కాన్ ప్రారంభించు (Start AI Scan)
                </button>
              </div>
            )}

            {scanStep === 'capturing' && (
              <div className="bg-slate-900 rounded-lg p-3 text-center space-y-2 relative border border-rose-500/20 overflow-hidden">
                <div className="absolute inset-0 bg-rose-500/5 animate-pulse"></div>
                {/* Simulated viewfinder crosshairs */}
                <div className="w-16 h-16 border-2 border-rose-500/30 border-dashed rounded-full mx-auto flex items-center justify-center animate-spin">
                  <div className="w-10 h-10 border-2 border-rose-500/50 rounded-full"></div>
                </div>
                <div className="text-[10px] text-rose-300 font-bold animate-pulse">
                  కెమెరా ఆన్ అవుతోంది... ముఖాన్ని స్క్రీన్ లో ఉంచండి ({scanProgress}%)
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${scanProgress}%` }}></div>
                </div>
              </div>
            )}

            {scanStep === 'analyzing' && (
              <div className="bg-slate-900 rounded-lg p-4 text-center space-y-2 border border-yellow-500/20">
                <RefreshCw className="w-6 h-6 text-yellow-400 animate-spin mx-auto" />
                <div className="text-[10px] text-yellow-300 font-bold animate-pulse">
                  AI డాక్టర్ విశ్లేషిస్తున్నారు / Diagnosing symptoms with AI Doctor...
                </div>
              </div>
            )}

            {scanStep === 'done' && (
              <div className="bg-slate-900 rounded-lg p-3 border border-emerald-500/20 space-y-2.5">
                <div className="flex items-center justify-between text-emerald-400 text-[9.5px] font-bold pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-bounce" /> AI డాక్టర్ రిపోర్ట్ (Certified AI Prescription)
                  </span>
                  <span className="text-[8px] bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-300">పూర్తయింది</span>
                </div>

                <div className="space-y-2 text-[9.5px]">
                  <div>
                    <span className="text-slate-400 block font-bold">ఆరోగ్య పరిస్థితి / Diagnostic View:</span>
                    <p className="text-white font-semibold">
                      ఎండ తీవ్రత వల్ల శరీర ఉష్ణోగ్రత పెరిగి, కళ్ళు ఎర్రబడటం మరియు తేలికపాటి డీహైడ్రేషన్ (అలసట) సంకేతాలు కనపడుతున్నాయి.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded border border-slate-800 text-center font-mono">
                    <div>
                      <span className="text-[8px] text-slate-500 block font-bold">హార్ట్ రేట్</span>
                      <span className="text-xs text-rose-400 font-black">{bpm} BPM</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 block font-bold">బిపి (BP)</span>
                      <span className="text-xs text-sky-400 font-black">{110 + Math.floor((bpm - 60) * 0.5)}/{70 + Math.floor((bpm - 60) * 0.3)}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 block font-bold">షుగర్ (Sugar)</span>
                      <span className="text-xs text-emerald-400 font-black">{Math.round(85 + (bpm - 60) * 0.4)}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-amber-400 font-bold block">వైద్యుని ఉచిత సలహా & మందులు (Remedies & Prescription):</span>
                    <ul className="list-disc list-inside text-slate-200 space-y-1 mt-1 font-medium">
                      <li>వెంటనే O.R.S (ఓరల్ రీహైడ్రేషన్ సాల్ట్) లేదా గ్లూకోజ్ నీరు త్రాగాలి.</li>
                      <li>తలనొప్పి లేదా జ్వరం ఉంటే నిమ్మరసం లేదా పారాసిటమాల్ 500mg వాడండి.</li>
                      <li>కనీసం 30 నిమిషాల పాటు చల్లని నీడ గల ప్రదేశంలో విశ్రాంతి తీసుకోండి.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-1 flex gap-1.5">
                  <button
                    onClick={startDoctorScan}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[9px] rounded-md transition"
                  >
                    మళ్ళీ స్కాన్ చేయి (Rescan)
                  </button>
                  <button
                    onClick={() => {
                      setScanStep('idle');
                    }}
                    className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold text-[9px] rounded-md transition"
                  >
                    మూసివేయి (Clear)
                  </button>
                </div>

                <button 
                  onClick={() => alert("ఈ పూర్తి మెడికల్ సర్టిఫికేషన్ మరియు నివేదిక డౌన్‌లోడ్ కేవలం పోస్ట్ పెయిడ్ వినియోగదారులకు (Postpaid Users) మాత్రమే అందుబాటులో ఉంటుంది! / Premium Postpaid Feature Only!")}
                  className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-[#FFC000] text-slate-950 font-black text-[9px] sm:text-[9.5px] rounded-lg tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[#FFC000]/10"
                >
                  ఈ సదుపాయాలన్నీ పోస్ట్ పెయిడ్ వినియోగదారులకు మాత్రమే (Postpaid Users Only)
                </button>
              </div>
            )}
          </div>

          {/* Weather Radio Report - Postpaid Feature */}
          <div className="bg-slate-950 p-3 rounded-xl border border-teal-500/30 space-y-3 relative overflow-hidden">
            <div className="absolute top-1 right-2 text-[7px] bg-[#FFC000] text-slate-950 px-1 rounded-sm font-black uppercase tracking-wider">
              POSTPAID ONLY
            </div>
            <div className="text-[9.5px] text-teal-400 font-bold flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> వాతావరణ రేడియో నివేదిక (RF Weather Report)
            </div>
            
            <p className="text-[9px] text-slate-400 leading-normal">
              ప్రస్తుత వాతావరణ పరిస్థితులు మరియు వేడి గాలి తీవ్రత ఆధారంగా కార్మికుల శరీర రక్షణకు అవసరమైన సూచనలు.
            </p>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[8.5px] text-slate-400 block mb-0.5">ఉష్ణోగ్రత / Temp</span>
                <span className="text-[11px] sm:text-xs font-black font-mono text-white">
                  32°C <span className="text-[8px] text-slate-500 font-bold">పాక్షికంగా మేఘావృతం</span>
                </span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <span className="text-[8.5px] text-slate-400 block mb-0.5">తేమ శాతం / Humidity</span>
                <span className="text-[11.5px] sm:text-xs font-black font-mono text-white">
                  62% <span className="text-[8px] text-slate-500 font-bold">గాలి వేగం: 14km/h</span>
                </span>
              </div>
            </div>

            <button 
              onClick={() => alert("ఈ వాతావరణ నివేదిక సేవలు పోస్ట్ పెయిడ్ వినియోగదారులకు (Postpaid Users) మాత్రమే అందుబాటులో ఉంటాయి! / Premium Postpaid Feature Only!")}
              className="w-full py-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black text-[9px] sm:text-[9.5px] rounded-lg tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-md shadow-teal-500/10"
            >
              ఈ సదుపాయాలన్నీ పోస్ట్ పెయిడ్ వినియోగదారులకు మాత్రమే (Postpaid Users Only)
            </button>
          </div>
          
          <div className="text-[8px] text-slate-500 text-center leading-relaxed">
            *గమనిక: యూザー విశ్రాంతి తీసుకుంటున్నప్పుడు (BPM &lt; 80) బ్యాక్‌గ్రౌండ్ ఆక్టివిటీ తగ్గి, బ్యాటరీ ఆదా అవుతుంది.
          </div>
        </div>
      )}
    </div>
  );
}
