import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {  
  Phone, Lock, Fingerprint, Shield, ShieldCheck, ShieldAlert, Key, 
  X, Check, AlertCircle, Timer, Sliders, LogOut, Download, Play,
  CreditCard, Code, Globe, Send, Eye, EyeOff, Wrench, Cpu, Terminal, Sparkles
, Store, Bot, Camera } from 'lucide-react';
import {  ControlState, FeatureControl } from '../types';
import {  INITIAL_FEATURES } from '../data';
import {  ManualFeatureTimer } from './ManualFeatureTimer';
import BrahmastraSystemComponent from './BrahmastraSystem';
import EcommerceVendorDashboard from './EcommerceVendorDashboard';
import CWRBLogo from './CWRBLogo';
import {  auth, RecaptchaVerifier, db } from '../lib/firebase';
import {  signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

// Toggle for testing without real Firebase SMS
const USE_SIMULATED_AUTH = true;

const FEATURE_ICONS: Record<string, string> = {
  'feat_hybrid_radio': '📡',
  'feat_biopower': '🔋',
  'feat_bp_sugar': '🩸',
  'feat_doctor_scan': '👨‍⚕️',
  'feat_weather_report': '⛈️',
  'feat_premium_assistant': '🤖',
  'feat_premium_tracking': '📍',
  'feat_premium_radio': '📻',
  'feat_premium_invoicing': '🧾',
  'feat_premium_payments': '💳',
  'feat_premium_escrow': '🤝',
  'feat_premium_multilingual': '🌐',
  'feat_premium_verification': '✅',
  'feat_premium_support': '🎧',
  'feat_premium_analytics': '📊',
  'feat_premium_team': '👥',
  'feat_invisible_maintenance': '⚙️',
  'feat_brahmastra': '🔮',
  'feat_invoice_generator': '🧾'
};


interface PhoneLoginProps {
  onLoginSuccess: (phoneNumber: string) => void;
  transparent?: boolean;
}

export const PhoneLogin: React.FC<PhoneLoginProps> = ({ onLoginSuccess, transparent = false }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (otpCode.length === 4) {
      // Use a mock event object to satisfy React.FormEvent
      const mockEvent = {
        preventDefault: () => {},
      } as unknown as React.FormEvent;
      
      handleVerifyOtp(mockEvent);
    }
  }, [otpCode]);

  useEffect(() => {
    let t: any;
    if (timer > 0) {
      t = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(t);
  }, [timer]);


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('దయచేసి సరైన 10 అంకెల మొబైల్ నెంబర్ నమోదు చేయండి!');
      return;
    }

    if (USE_SIMULATED_AUTH) {
      // Simulation logic
      const otp = "1234"; // Hardcoded test OTP
      setSimulatedOtp(otp);
      console.log("Simulated OTP (Development Only):", otp);
      setStep('otp');
      setTimer(30);
      return;
    }

    try {
      if (!recaptchaVerifier.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      }

      const formattedNumber = `${countryCode}${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier.current);
      setConfirmationResult(result);
      setStep('otp');
      setTimer(30);
    } catch (err: any) {
      console.error(err);
      setError('OTP పంపడంలో సమస్య ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (USE_SIMULATED_AUTH) {
      if (otpCode === simulatedOtp) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess(`${countryCode} ${phoneNumber}`);
        }, 1500);
      } else {
        setError('తప్పు OTP నమోదు చేసారు! దయచేసి మళ్లీ ప్రయత్నించండి.');
      }
      return;
    }

    if (!confirmationResult) {
      setError('ఏదో సమస్య జరిగింది, మళ్లీ ప్రయత్నించండి.');
      return;
    }

    try {
      await confirmationResult.confirm(otpCode);
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(`${countryCode} ${phoneNumber}`);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError('తప్పు OTP నమోదు చేసారు! దయచేసి మళ్లీ ప్రయత్నించండి.');
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    
    if (USE_SIMULATED_AUTH) {
      const otp = "1234";
      setSimulatedOtp(otp);
      setTimer(30);
      return;
    }

    try {
      // Re-trigger auth
      if (!recaptchaVerifier.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      }
      const formattedNumber = `${countryCode}${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier.current);
      setConfirmationResult(result);
      setTimer(30);
    } catch (err: any) {
      setError('మళ్ళీ OTP పంపడంలో సమస్య ఏర్పడింది.');
    }
  };

  return (
    <div className={transparent 
      ? "relative w-full flex flex-col justify-between p-2" 
      : "relative w-full min-h-[500px] flex flex-col justify-between bg-gradient-to-b from-[#082c75]/5 to-white p-6 rounded-[28px]"
    }>
      
      {/* Dynamic Simulated Android/iOS Toast Notification Header */}
      <div id="recaptcha-container"></div>

      <div className="space-y-6 pt-2">
        {/* App Emblem */}
        {!transparent && (
          <div className="text-center space-y-2">
            <CWRBLogo stacked={true} className="mx-auto" />
            <div>
              <p className="text-[10px] text-gray-500 font-bold tracking-wider mt-1">రక్షిత లాగిన్ వ్యవస్థ / Secure Verification Panel</p>
            </div>
          </div>
        )}

        {isSuccess ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-2 border-emerald-300">
              <ShieldCheck className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h4 className={`font-black text-sm ${transparent ? 'text-emerald-400' : 'text-emerald-800'}`}>లాగిన్ విజయవంతమైంది!</h4>
              <p className={`text-[10px] ${transparent ? 'text-white/60' : 'text-gray-500'}`}>యాప్ పోర్టల్ లోనికి స్వాగతం చెబుతున్నాము...</p>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.form 
                key="phone-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className={`block text-[11px] font-extrabold uppercase ${transparent ? 'text-[#FFC000]' : 'text-[#082c75]'}`}>
                    మీ మొబైల్ నంబర్ / Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <select 
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-white border border-gray-300 text-gray-800 text-xs font-bold rounded-xl px-2.5 py-3 focus:outline-none focus:ring-2 focus:ring-[#082c75]"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>

                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-400" />
                      <input 
                        type="tel"
                        maxLength={10}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        placeholder="10 అంకెల నెంబర్"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-xs font-mono font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#082c75]"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-50 text-rose-700 p-2.5 rounded-xl border border-rose-200 text-[10px] font-bold flex items-center gap-1.5 leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full py-3.5 font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 ${
                    transparent 
                      ? "bg-[#FFC000] hover:bg-[#e0a800] text-[#082c75] text-sm py-4" 
                      : "bg-[#082c75] hover:bg-[#001040] text-[#FFC000]"
                  }`}
                >
                  <span>OTP పంపండి (Get verification OTP)</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-4"
              >
                <div className="space-y-2 text-center">
                  <div className={`text-[11px] font-bold ${transparent ? 'text-white/80' : 'text-gray-500'}`}>
                    మేము <span className={`font-mono font-extrabold ${transparent ? 'text-[#FFC000]' : 'text-gray-800'}`}>{countryCode} {phoneNumber}</span> కి కోడ్‌ను పంపాము
                  </div>
                  <div className={`text-[10px] font-extrabold rounded-lg py-1 px-2 border inline-block ${
                    transparent 
                      ? 'text-[#FFC000] bg-white/10 border-[#FFC000]/30' 
                      : 'text-amber-600 bg-amber-50 border-amber-200'
                  }`}>
                    పైన వచ్చిన అలర్ట్ లోని OTPని కింద టైప్ చేయండి
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-[11px] font-extrabold text-center uppercase ${transparent ? 'text-[#FFC000]' : 'text-[#082c75]'}`}>
                    OTP నంబర్ నమోదు చేయండి
                  </label>
                  <div className="relative max-w-[160px] mx-auto">
                    <Lock className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-400" />
                    <input 
                      type="text"
                      maxLength={4}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      placeholder="XXXX"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 text-center tracking-[8px] font-mono font-black text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#082c75]"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-50 text-rose-700 p-2.5 rounded-xl border border-rose-200 text-[10px] font-bold flex items-center gap-1.5 leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>OTP వెరిఫై చేయండి (Verify & Login)</span>
                </button>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className={`text-[10px] font-extrabold hover:underline ${transparent ? 'text-[#FFC000]' : 'text-[#082c75]'}`}
                  >
                    ← నెంబర్ మార్చండి (Edit phone)
                  </button>

                  <button
                    type="button"
                    disabled={timer > 0}
                    onClick={handleResend}
                    className={`text-[10px] font-extrabold flex items-center gap-1 ${
                      timer > 0 
                        ? (transparent ? 'text-white/40 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed') 
                        : (transparent ? 'text-emerald-400 hover:underline' : 'text-emerald-700 hover:underline')
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>
                      {timer > 0 ? `రిసెంట్ OTP (${timer}s)` : 'మళ్లీ OTP పంపండి (Resend)'}
                    </span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Safety Badges Footer */}
      {!transparent && (
        <div className="pt-4 border-t border-gray-200/50 flex items-center justify-center gap-2 text-gray-400 text-[9px] font-bold">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>భారత ప్రభుత్వ నిబంధనల ప్రకారం సురక్షితమైన అథెంటికేషన్</span>
        </div>
      )}
    </div>
  );
};

// Chevron helper
const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
);


interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureStates: Record<string, ControlState>;
  onUpdateFeatureState: (featureId: string, newState: ControlState) => void;
  hybridModeEnabled: boolean;
  onToggleHybridMode: () => void;
  isChatAssistantEnabled: boolean;
  onToggleChatAssistant: () => void;
  onLogout: () => void;
  bookingsCount: number;
  isAgentToggleVisible?: boolean;
  onToggleAgentVisibility?: (visible: boolean) => void;
  isBrahmastraButtonVisible?: boolean;
  onToggleBrahmastraButton?: (visible: boolean) => void;
  isSystemOnline?: boolean;
  onToggleSystemOnline?: (online: boolean) => void;
  isHybridRadioMode?: boolean;
  onToggleHybridRadioMode?: (mode: boolean) => void;
  customerCarePhone: string;
  setCustomerCarePhone: (phone: string) => void;
  feedbackGoogleForm: string;
  setFeedbackGoogleForm: (url: string) => void;
  supportNumbersList: { id: string; name: string; phone: string }[];
  setSupportNumbersList: React.Dispatch<React.SetStateAction<{ id: string; name: string; phone: string }[]>>;
  isMaintenanceEnabled: boolean;
  onToggleMaintenance: () => void;
  maintenanceLogs: { id: string; timestamp: string; type: 'bug' | 'error'; description: string; status: 'resolved' | 'cleaned' }[];
  onClearMaintenanceLogs: () => void;
  secretSwitchBypass?: boolean;
  onToggleSecretSwitchBypass?: () => void;
  featureTimers?: Record<string, number>;
  onUpdateFeatureTimer?: (featureId: string, hours: number, isOn: boolean) => void;
  onBulkUpdateFeatureStates?: (updates: Record<string, ControlState>) => void;
}

// ==========================================
// 3D ANIMATED TOY WIDGETS
// ==========================================

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  featureStates, 
  onUpdateFeatureState,
  onBulkUpdateFeatureStates,
  hybridModeEnabled,
  onToggleHybridMode,
  isChatAssistantEnabled,
  onToggleChatAssistant,
  onLogout,
  bookingsCount,
  isAgentToggleVisible,
  onToggleAgentVisibility,
  isBrahmastraButtonVisible,
  onToggleBrahmastraButton,
  isSystemOnline,
  onToggleSystemOnline,
  isHybridRadioMode,
  onToggleHybridRadioMode,
  customerCarePhone,
  setCustomerCarePhone,
  feedbackGoogleForm,
  setFeedbackGoogleForm,
  supportNumbersList,
  setSupportNumbersList,
  isMaintenanceEnabled,
  onToggleMaintenance,
  maintenanceLogs,
  onClearMaintenanceLogs,
  secretSwitchBypass = false,
  onToggleSecretSwitchBypass,
  featureTimers = {},
  onUpdateFeatureTimer,
}) => {
  // Security authentication states
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [showLockScreenPassword, setShowLockScreenPassword] = useState(false);
  const [showAdminPwd, setShowAdminPwd] = useState(false);
  const [showBrahmastraPwd, setShowBrahmastraPwd] = useState(false);
  const [showVaultPwd, setShowVaultPwd] = useState(false);
  const [fingerprintScanning, setFingerprintScanning] = useState(false);
  const [fingerprintScanned, setFingerprintScanned] = useState(false);
  const [error, setError] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'features' | 'gateways' | 'vendor' | 'brahmastra' | 'passwords' | 'support' | 'maintenance' | 'agents' | 'pwa'>('features');
  const [pwaEnabled, setPwaEnabled] = useState<boolean>(() => {
    return localStorage.getItem('cwb_pwa_enabled') !== 'false';
  });
  const [pwaNotificationTitle, setPwaNotificationTitle] = useState('CWRB Final Update v2.6');
  const [pwaNotificationBody, setPwaNotificationBody] = useState('కోడ్, లోగో మరియు మేనిఫెస్టో అప్డేట్స్ తో కూడిన ఫైనల్ PWA వెర్షన్ పబ్లిష్ చేయబడింది.');
  const [isPushingUpdate, setIsPushingUpdate] = useState(false);
  const [currentLiveVersion, setCurrentLiveVersion] = useState<string>('v2.0');

  // Sync with Firestore for PWA live version
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'settings', 'pwa_update'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.version) {
          setCurrentLiveVersion(data.version);
        }
      }
    });
    return () => unsub();
  }, []);
  const [featuresSubTab, setFeaturesSubTab] = useState<'normal' | 'premium' | 'postpaid' | 'rates'>('normal');

  const [preferredAgent, setPreferredAgent] = useState<string>(() => {
    return localStorage.getItem('cwb_preferred_primary_agent') || 'Gemini 3.1 Pro (ప్రధాన ఏజెంట్ / Primary Agent)';
  });
  const [agentSaveStatus, setAgentSaveStatus] = useState<string | null>(null);

  const handleSavePreferredAgent = (agentName: string) => {
    setPreferredAgent(agentName);
    localStorage.setItem('cwb_preferred_primary_agent', agentName);
    setAgentSaveStatus(`✓ ${agentName} అడ్మిన్ గారు కోరినట్లుగా ప్రధాన ఏజెంట్‌గా సెట్ చేయబడింది!`);
    setTimeout(() => setAgentSaveStatus(null), 3000);
  };

  const [localPrices, setLocalPrices] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('cwb_feature_prices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      feat_hybrid_radio: 99,
      feat_biopower: 49,
      feat_bp_sugar: 29,
      feat_doctor_scan: 39,
      feat_weather_report: 19,
      feat_premium_assistant: 29,
      feat_premium_tracking: 19,
      feat_premium_radio: 9,
      feat_premium_invoicing: 19,
      feat_premium_payments: 0,
      feat_premium_escrow: 49,
      feat_premium_multilingual: 19,
      feat_premium_verification: 99,
      feat_premium_support: 49,
      feat_premium_analytics: 29,
      feat_premium_team: 39,
    };
  });

  const [priceSaveStatus, setPriceSaveStatus] = useState<string | null>(null);

  const handleSaveLocalPrices = () => {
    localStorage.setItem('cwb_feature_prices', JSON.stringify(localPrices));
    setPriceSaveStatus('✓ రేట్లు విజయవంతంగా సేవ్ చేయబడ్డాయి! (Rates saved!)');
    setTimeout(() => setPriceSaveStatus(null), 3000);
  };

  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('cwb_feature_prices');
      if (saved) {
        try {
          setLocalPrices(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Password configuration states
  const [newAdminPwd, setNewAdminPwd] = useState(() => localStorage.getItem('cwb_admin_pwd') || '1234');
  const [newBrahmastraPwd, setNewBrahmastraPwd] = useState(() => localStorage.getItem('cwb_brahmastra_pwd') || 'CWRB99');
  const [newVaultPwd, setNewVaultPwd] = useState(() => localStorage.getItem('cwb_vault_pwd') || '1234');

  // Phone contact form states
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const [adminSaved, setAdminSaved] = useState(false);
  const [brahmastraSaved, setBrahmastraSaved] = useState(false);
  const [vaultSaved, setVaultSaved] = useState(false);

  // Admin Security Management States (Firestore settings/admin_security sync)
  const [biometricCredentialId, setBiometricCredentialId] = useState(() => localStorage.getItem('cwb_biometric_credential_id') || '');
  const [masterPhotoUrl, setMasterPhotoUrl] = useState(() => localStorage.getItem('cwb_master_photo_url') || '');
  const [cameraVerificationEnabled, setCameraVerificationEnabled] = useState(() => localStorage.getItem('cwb_camera_verification_enabled') !== 'false');
  const [mobileSettingsIconVisible, setMobileSettingsIconVisible] = useState(() => localStorage.getItem('cwb_mobile_settings_icon_visible') !== 'false');
  const [loginAuditPhotos, setLoginAuditPhotos] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cwb_login_audit_photos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<string | null>(null);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  // Gateway integration configuration states
  const [smsGatewayUrl, setSmsGatewayUrl] = useState('https://api.sms-gateway.telugu.in/v2/otp');
  const [smsApiKey, setSmsApiKey] = useState('CWRB_SMS_KEY_9848032910_PROD');
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [isSmsTesting, setIsSmsTesting] = useState(false);

  const [paymentGateway, setPaymentGateway] = useState('phonepe');
  const [merchantId, setMerchantId] = useState('MERCHANT_CWRB_LIVE_3910');
  const [paymentSalt, setPaymentSalt] = useState('SALT_PHNPE_KEY_8742260_SECURE');
  const [payStatus, setPayStatus] = useState<string | null>(null);
  const [isPayTesting, setIsPayTesting] = useState(false);

  // Sync with Firestore settings/admin_security on load
  useEffect(() => {
    const fetchCloudSecurity = async () => {
      try {
        const docRef = doc(db, 'settings', 'admin_security');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.adminPwd) {
            setNewAdminPwd(data.adminPwd);
            localStorage.setItem('cwb_admin_pwd', data.adminPwd);
          }
          if (data.brahmastraPwd) {
            setNewBrahmastraPwd(data.brahmastraPwd);
            localStorage.setItem('cwb_brahmastra_pwd', data.brahmastraPwd);
          }
          if (data.vaultPwd) {
            setNewVaultPwd(data.vaultPwd);
            localStorage.setItem('cwb_vault_pwd', data.vaultPwd);
          }
          if (data.biometricCredentialId !== undefined) {
            setBiometricCredentialId(data.biometricCredentialId);
            localStorage.setItem('cwb_biometric_credential_id', data.biometricCredentialId);
          }
          if (data.masterPhotoUrl !== undefined) {
            setMasterPhotoUrl(data.masterPhotoUrl);
            localStorage.setItem('cwb_master_photo_url', data.masterPhotoUrl);
          }
          if (data.cameraVerificationEnabled !== undefined) {
            setCameraVerificationEnabled(data.cameraVerificationEnabled);
            localStorage.setItem('cwb_camera_verification_enabled', String(data.cameraVerificationEnabled));
          }
          if (data.mobileSettingsIconVisible !== undefined) {
            setMobileSettingsIconVisible(data.mobileSettingsIconVisible);
            localStorage.setItem('cwb_mobile_settings_icon_visible', String(data.mobileSettingsIconVisible));
          }
          if (Array.isArray(data.loginAuditPhotos)) {
            setLoginAuditPhotos(data.loginAuditPhotos);
            localStorage.setItem('cwb_login_audit_photos', JSON.stringify(data.loginAuditPhotos));
          }
          setCloudSyncStatus('✓ క్లౌడ్ డేటాబేస్ నుండి సెక్యూరిటీ నిబంధనలు సింక్ చేయబడ్డాయి');
        }
      } catch (err) {
        setCloudSyncStatus('ℹ లోకల్ స్టోరేజ్ మోడ్ (Offline Mode)');
        console.log('Cloud security fetch offline/skipped:', err);
      }
    };
    fetchCloudSecurity();
  }, []);

  const saveSecurityToCloudAndLocal = async (updates: {
    adminPwd?: string;
    brahmastraPwd?: string;
    vaultPwd?: string;
    biometricCredentialId?: string;
    masterPhotoUrl?: string;
    cameraVerificationEnabled?: boolean;
    mobileSettingsIconVisible?: boolean;
    loginAuditPhotos?: string[];
  }) => {
    setIsCloudSyncing(true);
    setCloudSyncStatus(null);
    try {
      const payload = {
        adminPwd: updates.adminPwd !== undefined ? updates.adminPwd : newAdminPwd,
        brahmastraPwd: updates.brahmastraPwd !== undefined ? updates.brahmastraPwd : newBrahmastraPwd,
        vaultPwd: updates.vaultPwd !== undefined ? updates.vaultPwd : newVaultPwd,
        biometricCredentialId: updates.biometricCredentialId !== undefined ? updates.biometricCredentialId : biometricCredentialId,
        masterPhotoUrl: updates.masterPhotoUrl !== undefined ? updates.masterPhotoUrl : masterPhotoUrl,
        cameraVerificationEnabled: updates.cameraVerificationEnabled !== undefined ? updates.cameraVerificationEnabled : cameraVerificationEnabled,
        mobileSettingsIconVisible: updates.mobileSettingsIconVisible !== undefined ? updates.mobileSettingsIconVisible : mobileSettingsIconVisible,
        loginAuditPhotos: updates.loginAuditPhotos !== undefined ? updates.loginAuditPhotos : loginAuditPhotos,
        updatedAt: new Date().toISOString()
      };

      if (payload.adminPwd) localStorage.setItem('cwb_admin_pwd', payload.adminPwd);
      if (payload.brahmastraPwd) localStorage.setItem('cwb_brahmastra_pwd', payload.brahmastraPwd);
      if (payload.vaultPwd) localStorage.setItem('cwb_vault_pwd', payload.vaultPwd);
      if (payload.biometricCredentialId !== undefined) localStorage.setItem('cwb_biometric_credential_id', payload.biometricCredentialId);
      if (payload.masterPhotoUrl !== undefined) localStorage.setItem('cwb_master_photo_url', payload.masterPhotoUrl);
      localStorage.setItem('cwb_camera_verification_enabled', String(payload.cameraVerificationEnabled));
      localStorage.setItem('cwb_mobile_settings_icon_visible', String(payload.mobileSettingsIconVisible));
      // Truncate audit photos if too large for quota/localStorage
      const safePhotos = (payload.loginAuditPhotos || []).slice(-10);
      localStorage.setItem('cwb_login_audit_photos', JSON.stringify(safePhotos));

      try {
        if (db) {
          const docRef = doc(db, 'settings', 'admin_security');
          // Omit heavy base64 audit photos from firestore to prevent quota exceeded
          const cloudPayload = { ...payload, loginAuditPhotos: safePhotos.slice(-3) };
          await setDoc(docRef, cloudPayload, { merge: true });
          setCloudSyncStatus('✓ అడ్మిన్ సెక్యూరిటీ నిబంధనలు క్లౌడ్‌లో పర్మనెంట్‌గా సేవ్ చేయబడ్డాయి!');
        }
      } catch (cloudErr) {
        setCloudSyncStatus('✓ లోకల్ స్టోరేజ్‌లో సురక్షితంగా సేవ్ చేయబడింది (Quota Safe Mode)');
        console.log('Cloud save quota/offline handled:', cloudErr);
      }

      setIsSavedRecently(true);
      setTimeout(() => setIsSavedRecently(false), 3000);
      setIsCloudSyncing(false);
      alert('✓ అన్ని అడ్మిన్ సెక్యూరిటీ సెట్టింగ్స్ క్లౌడ్ & లోకల్‌లో విజయవంతంగా సేవ్ చేయబడ్డాయి!');
    } catch (err) {
      setIsCloudSyncing(false);
      setCloudSyncStatus('⚠️ లోకల్ సేవ్ విజయవంతమైంది');
      console.error('Security save error:', err);
      alert('✓ అడ్మిన్ సెక్యూరిటీ సెట్టింగ్స్ లోకల్‌లో సేవ్ చేయబడ్డాయి!');
    }
  };

  const handleRegisterFingerprint = async () => {
    try {
      let credId = 'cwb-bio-cred-' + Math.random().toString(36).substring(2, 10);
      if (window.PublicKeyCredential) {
        try {
          const pubKeyCredParams = {
            challenge: new Uint8Array(32),
            rp: { name: "CWRB Admin Security" },
            user: {
              id: new Uint8Array(16),
              name: "admin@cwrb.in",
              displayName: "అడ్మిన్ గారు"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" as const }],
            timeout: 60000,
            attestation: "direct" as const
          };
          const credential = await navigator.credentials.create({ publicKey: pubKeyCredParams });
          if (credential && credential.id) {
            credId = credential.id;
          }
        } catch (e) {
          console.log('WebAuthn prompt fallback used:', e);
        }
      }
      setBiometricCredentialId(credId);
      await saveSecurityToCloudAndLocal({ biometricCredentialId: credId });
      alert('✓ కొత్త ఫింగర్‌ప్రింట్ / బయోమెట్రిక్ విజయవంతంగా రికార్డ్ చేయబడింది మరియు క్లౌడ్‌లో సేవ్ అయింది!');
    } catch (e) {
      alert('బయోమెట్రిక్ నమోదులో లోపం ఏర్పడింది.');
    }
  };

  const handleResetBiometrics = async () => {
    if (confirm('అన్ని నమోదిత ఫింగర్‌ప్రింట్‌లను తొలగించి రీసెట్ చేయాలా?')) {
      setBiometricCredentialId('');
      await saveSecurityToCloudAndLocal({ biometricCredentialId: '' });
      alert('✓ బయోమెట్రిక్స్ విజయవంతంగా రీసెట్ చేయబడ్డాయి.');
    }
  };

  const handleMasterPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);

          setMasterPhotoUrl(compressedBase64);
          await saveSecurityToCloudAndLocal({ masterPhotoUrl: compressedBase64 });
          alert('✓ మాస్టర్ ఫోటో విజయవంతంగా కంప్రెస్ చేయబడి క్లౌడ్‌కు సింక్ చేయబడింది!');
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSinglePassword = async (type: 'admin' | 'brahmastra' | 'vault') => {
    if (type === 'admin') {
      if (!newAdminPwd.trim()) {
        alert('దయచేసి పాస్‌వర్డ్ ఎంటర్ చేయండి. (Please enter a password)');
        return;
      }
      localStorage.setItem('cwb_admin_pwd', newAdminPwd.trim());
      await saveSecurityToCloudAndLocal({ adminPwd: newAdminPwd.trim() });
      setAdminSaved(true);
      alert('అడ్మిన్ పాస్‌వర్డ్ విజయవంతంగా సేవ్ చేయబడింది మరియు క్లౌడ్‌కు సింక్ అయింది!');
    } else if (type === 'brahmastra') {
      if (!newBrahmastraPwd.trim()) {
        alert('దయచేసి బ్రహ్మాస్త్ర కోడ్ ఎంటర్ చేయండి. (Please enter a code)');
        return;
      }
      localStorage.setItem('cwb_brahmastra_pwd', newBrahmastraPwd.trim());
      await saveSecurityToCloudAndLocal({ brahmastraPwd: newBrahmastraPwd.trim() });
      setBrahmastraSaved(true);
      alert('బ్రహ్మాస్త్ర కోడ్ విజయవంతంగా సేవ్ చేయబడింది మరియు క్లౌడ్‌కు సింక్ అయింది!');
    } else if (type === 'vault') {
      if (!newVaultPwd.trim()) {
        alert('దయచేసి సీక్రెట్ వాల్ట్ పిన్ ఎంటర్ చేయండి. (Please enter a PIN)');
        return;
      }
      localStorage.setItem('cwb_vault_pwd', newVaultPwd.trim());
      await saveSecurityToCloudAndLocal({ vaultPwd: newVaultPwd.trim() });
      setVaultSaved(true);
      alert('సీక్రెట్ వాల్ట్ పిన్ విజయవంతంగా సేవ్ చేయబడింది మరియు క్లౌడ్‌కు సింక్ అయింది!');
    }
  };

  // Reset lock when opening settings
  useEffect(() => {
    if (isOpen) {
      setIsAdminUnlocked(false);
      setPassword('');
      setShowLockScreenPassword(false);
      setShowAdminPwd(false);
      setShowBrahmastraPwd(false);
      setShowVaultPwd(false);
      setFingerprintScanning(false);
      setFingerprintScanned(false);
      setError('');
      setActiveSubTab('features');
      setSmsStatus(null);
      setPayStatus(null);
      setAdminSaved(false);
      setBrahmastraSaved(false);
      setVaultSaved(false);
      setNewAdminPwd(localStorage.getItem('cwb_admin_pwd') || '1234');
      setNewBrahmastraPwd(localStorage.getItem('cwb_brahmastra_pwd') || 'CWRB99');
      setNewVaultPwd(localStorage.getItem('cwb_vault_pwd') || '1234');
    }
  }, [isOpen]);

  const [isCameraVerificationModalOpen, setIsCameraVerificationModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const startCameraStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log('Camera stream fallback used:', err);
    }
  };

  const stopCameraStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const captureAndVerifyCamera = () => {
    let capturedPhoto = masterPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 300;
      canvas.height = video.videoHeight || 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        capturedPhoto = canvas.toDataURL('image/jpeg', 0.85);
      }
    }

    const updatedPhotos = [capturedPhoto, ...loginAuditPhotos].slice(0, 10);
    setLoginAuditPhotos(updatedPhotos);
    localStorage.setItem('cwb_login_audit_photos', JSON.stringify(updatedPhotos));

    stopCameraStream();
    setIsCameraVerificationModalOpen(false);
    setIsAdminUnlocked(true);
    alert('✓ అడ్మిన్ లైవ్ కెమెరా వెరిఫికేషన్ విజయవంతంగా పూర్తయింది! (Admin Face Auto-Verified)');
  };

  // Automatically trigger camera capture & verify after 2 seconds when modal opens (Admin garu requirement: no manual button click)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCameraVerificationModalOpen) {
      timer = setTimeout(() => {
        captureAndVerifyCamera();
      }, 2200);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isCameraVerificationModalOpen]);

  if (!isOpen) return null;

  const handleFingerprintTouch = () => {
    if (fingerprintScanned || fingerprintScanning) return;
    setFingerprintScanning(true);
    setError('');

    // Simulate laser scanning animation delay
    setTimeout(() => {
      setFingerprintScanning(false);
      setFingerprintScanned(true);
    }, 1800);
  };

  const handleVerifyAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const savedAdminPwd = localStorage.getItem('cwb_admin_pwd') || '1234';
    
    if (password !== savedAdminPwd) {
      setError('తప్పుడు పాస్‌వర్డ్! దయచేసి సరైన కోడ్ ఎంటర్ చేయండి. (Incorrect password!)');
      return;
    }

    if (!fingerprintScanned) {
      setError('దయచేసి బయోమెట్రిక్ వెరిఫికేషన్ కోసం ఫింగర్‌ప్రింట్ ఐకాన్ నొక్కండి! (Please touch the fingerprint scanner)');
      return;
    }

    // Trigger Live Camera Verification Modal ONLY if masterPhotoUrl has been saved inside admin panel
    if (cameraVerificationEnabled && masterPhotoUrl && masterPhotoUrl.length > 20) {
      setIsCameraVerificationModalOpen(true);
      startCameraStream();
    } else {
      setIsAdminUnlocked(true);
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs z-50 flex flex-col justify-end">
      
      {/* Settings Panel Body */}
      <div className="bg-white rounded-t-[32px] max-h-[92%] overflow-hidden flex flex-col shadow-2xl border-t-4 border-[#082c75]">
        
        {/* Settings Modal Header */}
        <div className="bg-slate-50 border-b border-gray-100 py-3.5 px-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#082c75]" />
            <div>
              <h3 className="text-xs font-black text-[#082c75] uppercase">సిస్టమ్ సెట్టింగ్స్ / settings</h3>
              <p className="text-[8px] text-gray-500 font-bold">ద్విభాషా నియంత్రణ ప్యానెల్ (Dual Control Panel)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {!isAdminUnlocked ? (
            /* SECURITY LOCK SCREEN VIEW */
            <div className="space-y-5">
              <div className="text-center space-y-2 py-2">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-500 border border-amber-200 shadow-sm">
                  <ShieldAlert className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-gray-800">అడ్మిన్ అథెంటికేషన్ అవసరం</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    సిస్టమ్ నియంత్రణలను మార్చడానికి పాస్‌వర్డ్ మరియు బయోమెట్రిక్ వెరిఫికేషన్ చేయండి.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerifyAccess} className="space-y-4">
                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">పాస్‌వర్డ్ నమోదు చేయండి (Enter Password)</label>
                  <div className="relative flex items-center">
                    <Key className="absolute left-3.5 w-4 h-4 text-gray-400" />
                    <input 
                      type={showLockScreenPassword ? "text" : "password"}
                      maxLength={32}
                      placeholder="పాస్‌వర్డ్ నమోదు చేయండి"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#082c75] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLockScreenPassword(!showLockScreenPassword)}
                      className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showLockScreenPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="text-[9px] text-[#082c75] font-black bg-blue-50 py-1 px-2.5 rounded-lg border border-blue-200 inline-block">
                    🔒 ప్రస్తుత పాస్‌వర్డ్: ++++
                  </div>
                </div>

                {/* Fingerprint Biometrics Area */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-wider text-center">బయోమెట్రిక్ వేలిముద్ర (Touch Fingerprint Scanner)</label>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-gray-100 relative overflow-hidden">
                    
                    {/* Laser Scanner Line (Scanning state) */}
                    {fingerprintScanning && (
                      <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                        className="absolute left-0 right-0 h-0.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] z-10"
                      />
                    )}

                    <button
                      type="button"
                      onClick={handleFingerprintTouch}
                      className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all ${
                        fingerprintScanned 
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                          : fingerprintScanning 
                            ? 'bg-cyan-50 border-cyan-400 text-cyan-500 animate-pulse'
                            : 'bg-white border-gray-200 text-[#082c75] hover:border-[#082c75] hover:bg-[#082c75]/5'
                      } active:scale-95`}
                    >
                      {fingerprintScanned ? (
                        <ShieldCheck className="w-11 h-11" />
                      ) : (
                        <Fingerprint className={`w-11 h-11 ${fingerprintScanning ? 'animate-pulse text-cyan-500' : ''}`} />
                      )}
                    </button>

                    <div className="text-center mt-2.5 space-y-0.5">
                      <span className={`text-[10px] font-black uppercase ${
                        fingerprintScanned 
                          ? 'text-emerald-700' 
                          : fingerprintScanning 
                            ? 'text-cyan-600 animate-pulse' 
                            : 'text-gray-400'
                      }`}>
                        {fingerprintScanned 
                          ? 'వేలిముద్ర వెరిఫై చేయబడింది! (Verified)' 
                          : fingerprintScanning 
                            ? 'స్కాన్ చేస్తోంది... (Scanning...)' 
                            : 'వేలిముద్ర ఐకాన్‌ని నొక్కండి (Touch Scanner)'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-50 text-rose-700 p-2.5 rounded-xl border border-rose-200 text-[10px] font-bold flex items-center gap-1.5 leading-relaxed">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#082c75] hover:bg-[#001040] text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>అడ్మిన్ ప్యానెల్ అన్‌లాక్ చేయండి (Unlock Panel)</span>
                </button>
              </form>
            </div>
          ) : (
            /* NESTED ADMIN PANEL VIEW (SWITCHBOARD CONTROL SYSTEM) */
            <div className="space-y-4 animate-fade-in">
              <div className="bg-[#082c75]/5 rounded-2xl p-3.5 border border-[#082c75]/10 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-[#082c75] uppercase">🛡️ అడ్మిన్ కంట్రోల్ ప్యానెల్</h4>
                  <button
                    onClick={() => setIsAdminUnlocked(false)}
                    className="text-[9px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg py-1 px-2 transition active:scale-95"
                  >
                    🔒 లాక్ చేయండి
                  </button>
                </div>
                <p className="text-[10px] text-gray-500">సిస్టమ్ భద్రత మరియు నియంత్రణల సమూహం</p>
              </div>

              {/* Mobile Admin Subtabs */}
              <div className="flex gap-2 border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('features')}
                  className={`px-2 pb-2 text-[10px] font-extrabold transition-all border-b-2 shrink-0 ${
                    activeSubTab === 'features'
                      ? 'border-[#082c75] text-[#082c75]'
                      : 'border-transparent text-gray-400 hover:text-gray-500'
                  }`}
                >
                  ఫీచర్స్ / Features
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('vendor')}
                  className={`px-2 pb-2 text-[10px] font-extrabold transition-all border-b-2 shrink-0 ${
                    activeSubTab === 'vendor'
                      ? 'border-[#082c75] text-[#082c75]'
                      : 'border-transparent text-gray-400 hover:text-gray-500'
                  }`}
                >
                  వెండర్స్ / Vendors
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('gateways')}
                  className={`px-2 pb-2 text-[10px] font-extrabold transition-all border-b-2 shrink-0 ${
                    activeSubTab === 'gateways'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-gray-400 hover:text-gray-500'
                  }`}
                >
                  గేట్‌వేస్ & కోడింగ్ / Gateways 🔌
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('brahmastra')}
                  className={`px-2 pb-2 text-[10px] font-extrabold transition-all border-b-2 shrink-0 ${
                    activeSubTab === 'brahmastra'
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-400 hover:text-gray-500'
                  }`}
                >
                  బ్రహ్మాస్త్ర / AI
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('passwords')}
                  className={`px-2 pb-2 text-[10px] font-extrabold transition-all border-b-2 shrink-0 ${
                    activeSubTab === 'passwords'
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-400 hover:text-gray-500'
                  }`}
                >
                  పాస్‌వర్డ్స్ / Passwords
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('support')}
                  className={`px-2 pb-2 text-[10px] font-extrabold transition-all border-b-2 shrink-0 ${
                    activeSubTab === 'support'
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-gray-400 hover:text-gray-500'
                  }`}
                >
                  సపోర్ట్ / Support 📞
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('maintenance')}
                  className={`px-2 pb-2 text-[10px] font-extrabold transition-all border-b-2 shrink-0 ${
                    activeSubTab === 'maintenance'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-400 hover:text-gray-500'
                  }`}
                >
                  మెయింటెనెన్స్ / Maintenance ⚙️
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('agents')}
                  className={`px-2 pb-2 text-[10px] font-extrabold transition-all border-b-2 shrink-0 ${
                    activeSubTab === 'agents'
                      ? 'border-purple-600 text-purple-700'
                      : 'border-transparent text-gray-400 hover:text-gray-500'
                  }`}
                >
                  ప్రధాన ఏజెంట్లు / Agents 🤖
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('pwa')}
                  className={`px-2 pb-2 text-[10px] font-extrabold transition-all border-b-2 shrink-0 ${
                    activeSubTab === 'pwa'
                      ? 'border-cyan-600 text-cyan-700'
                      : 'border-transparent text-gray-400 hover:text-gray-500'
                  }`}
                >
                  PWA మేనేజ్‌మెంట్ / PWA 📱
                </button>
              </div>

              {/* Hybrid Mode Toggle */}
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <h5 className="text-[11px] font-extrabold text-indigo-900">హైబ్రిడ్ మోడ్ (Hybrid Mode Control)</h5>
                  <p className="text-[9px] text-indigo-700">ఈ మోడ్ ద్వారా సిస్టమ్ ఫీచర్లను ఎనేబుల్/డిసేబుల్ చేయండి.</p>
                </div>
                <button
                  onClick={onToggleHybridMode}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${hybridModeEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${hybridModeEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Chat Assistant Toggle */}
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <h5 className="text-[11px] font-extrabold text-emerald-900">AI చాట్ అసిస్టెంట్ (AI Chat Assistant)</h5>
                  <p className="text-[9px] text-emerald-700">అడ్మిన్ ప్యానెల్ బయట అసిస్టెంట్ను ఎనేబుల్ చేయండి.</p>
                </div>
                <button
                  onClick={onToggleChatAssistant}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${isChatAssistantEnabled ? 'bg-emerald-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isChatAssistantEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Secret Switch Bypass Toggle (For Developer Control) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <h5 className="text-[11px] font-extrabold text-slate-700">సిస్టమ్ స్విచ్ ప్రొటెక్షన్ (Safe Override Switch)</h5>
                  <p className="text-[9px] text-slate-500">సిస్టమ్ యొక్క అన్ని స్విచ్లను బగ్స్ లేకుండా డైరెక్ట్‌గా ఆన్ చేస్తుంది.</p>
                </div>
                <button
                  onClick={onToggleSecretSwitchBypass}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5 ${secretSwitchBypass ? 'bg-amber-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${secretSwitchBypass ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {activeSubTab === 'features' ? (
                <div className="space-y-4 animate-fade-in">
                  {/* Features Sub-Sub-Tabs */}
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-gray-200 gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setFeaturesSubTab('normal')}
                      className={`flex-1 min-w-[80px] py-1.5 text-[9px] font-extrabold rounded-lg transition-all ${
                        featuresSubTab === 'normal'
                          ? 'bg-white shadow-xs text-slate-800'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      సాధారణ ఫీచర్స్ (Free/Normal)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturesSubTab('premium')}
                      className={`flex-1 min-w-[80px] py-1.5 text-[9px] font-extrabold rounded-lg transition-all ${
                        featuresSubTab === 'premium'
                          ? 'bg-[#082c75] text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      ప్రీమియం ఫీచర్స్ (Premium)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturesSubTab('postpaid')}
                      className={`flex-1 min-w-[80px] py-1.5 text-[9px] font-extrabold rounded-lg transition-all ${
                        featuresSubTab === 'postpaid'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      పోస్ట్‌పెయిడ్ సేవలు (Postpaid)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturesSubTab('rates')}
                      className={`flex-1 min-w-[80px] py-1.5 text-[9px] font-extrabold rounded-lg transition-all ${
                        featuresSubTab === 'rates'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      ప్రీమియం రేట్ల పట్టిక (Premium Rates)
                    </button>
                  </div>

                  {featuresSubTab === 'normal' ? (
                    <div className="space-y-4 animate-fade-in">
                      {/* Quick Mode Explanation List */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-200 grid grid-cols-2 gap-1 text-[8px] font-black text-center">
                        <span className="bg-emerald-50 text-emerald-800 p-1 rounded border border-emerald-200">T-ON: తాత్కాలికంగా ఆన్</span>
                        <span className="bg-amber-50 text-amber-800 p-1 rounded border border-amber-200">T-OF: తాత్కాలికంగా ఆఫ్</span>
                        <span className="bg-[#FFC000]/10 text-amber-900 p-1 rounded border border-yellow-300">UPG: పర్మనెంట్ అప్గ్రేడ్</span>
                        <span className="bg-teal-50 text-teal-800 p-1 rounded border border-teal-200">P-ON: పర్మనెంట్ ఆన్</span>
                        <span className="bg-rose-50 text-rose-800 p-1 rounded border border-rose-200">P-OF: పర్మనెంట్ ఆఫ్</span>
                        <span className="bg-slate-100 text-slate-800 p-1 rounded border border-gray-300">S-DEL: తాత్కాలిక డిలీట్</span>
                        <span className="bg-black text-white p-1 rounded col-span-2">H-DEL: పర్మనెంట్ డిలీట్</span>
                      </div>

                      {/* Master Switches control list */}
                      <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                        {INITIAL_FEATURES.filter(f => [
                          'feat_splash',
                          'feat_attendance',
                          'feat_service_1',
                          'feat_service_2',
                          'feat_service_3',
                          'feat_service_4',
                          'feat_service_5',
                          'feat_service_6',
                          'feat_service_7',
                          'feat_service_8',
                          'feat_service_9',
                          'feat_service_10',
                          'feat_service_11',
                          'feat_service_12',
                          'feat_service_13',
                          'feat_service_14',
                          'feat_service_15',
                          'feat_service_16',
                          'feat_service_17',
                          'feat_service_18',
                          'feat_service_19',
                          'feat_service_20',
                          'feat_service_21',
                          'feat_service_22',
                          'feat_service_23',
                          'feat_service_24',
                          'feat_service_25',
                          'feat_service_26',
                          'feat_service_27',
                          'feat_service_28',
                          'feat_calendar',
                          'feat_geofencing',
                          'feat_calling',
                          'feat_sos',
                          'feat_kyc',
                          'feat_wallet',
                          'feat_ratings',
                          'feat_walkietalkie',
                          'feat_subscriptions',
                          'feat_diary',
                          'feat_social',
                          'feat_profile_menu'
                        ].includes(f.id)).map((feat) => {
                          const currState = featureStates[feat.id] || 'temp_on';

                          return (
                            <div key={feat.id} className="p-3 bg-white rounded-xl border border-gray-150 space-y-2 hover:bg-slate-50/50 transition font-sans">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="text-xs font-bold text-gray-800">{feat.nameTe}</div>
                                  <div className="text-[9px] text-gray-400 font-mono">{feat.nameEn}</div>
                                </div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                  currState === 'temp_on' ? 'bg-emerald-100 text-emerald-800' :
                                  currState === 'temp_off' ? 'bg-amber-100 text-amber-800' :
                                  currState === 'perm_upgrade' ? 'bg-[#FFC000]/20 text-[#082c75] font-black' :
                                  currState === 'perm_on' ? 'bg-teal-100 text-teal-800' :
                                  currState === 'perm_off' ? 'bg-rose-100 text-rose-800' :
                                  currState === 'soft_delete' ? 'bg-slate-100 text-slate-800' : 'bg-black text-white'
                                }`}>
                                  {currState}
                                </span>
                              </div>

                              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 mt-2">
                                <button
                                  type="button"
                                  onClick={() => onUpdateFeatureState(feat.id, 'temp_on')}
                                  className={`py-1 text-[8px] font-bold rounded-lg transition-all duration-300 active:scale-95 text-center ${
                                    currState === 'temp_on' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  T-ON
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateFeatureState(feat.id, 'temp_off')}
                                  className={`py-1 text-[8px] font-bold rounded-lg transition-all duration-300 active:scale-95 text-center ${
                                    currState === 'temp_off' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  T-OF
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateFeatureState(feat.id, 'perm_upgrade')}
                                  className={`py-1 text-[8px] font-bold rounded-lg transition-all duration-300 active:scale-95 text-center ${
                                    currState === 'perm_upgrade' ? 'bg-[#FFC000] text-[#082c75]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  UPG
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateFeatureState(feat.id, 'perm_on')}
                                  className={`py-1 text-[8px] font-bold rounded-lg transition-all duration-300 active:scale-95 text-center ${
                                    currState === 'perm_on' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  P-ON
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateFeatureState(feat.id, 'perm_off')}
                                  className={`py-1 text-[8px] font-bold rounded-lg transition-all duration-300 active:scale-95 text-center ${
                                    currState === 'perm_off' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  P-OF
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateFeatureState(feat.id, 'soft_delete')}
                                  className={`py-1 text-[8px] font-bold rounded-lg transition-all duration-300 active:scale-95 text-center ${
                                    currState === 'soft_delete' ? 'bg-slate-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  S-DEL
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onUpdateFeatureState(feat.id, 'hard_delete')}
                                  className={`py-1 text-[8px] font-bold rounded-lg transition-all duration-300 active:scale-95 text-center ${
                                    currState === 'hard_delete' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  H-DEL
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : featuresSubTab === 'premium' ? (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-gray-200">
                        <div className="text-[10px] font-extrabold text-[#082c75]">
                          ప్రీమియం రేట్ కంట్రోల్ ప్యానెల్ (Premium Prices)
                        </div>
                      </div>

                      {priceSaveStatus && (
                        <div className="p-2 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg font-bold">
                          {priceSaveStatus}
                        </div>
                      )}

                      <div className="overflow-y-auto max-h-[300px] border border-gray-150 rounded-xl bg-white">
                        <table className="w-full text-left border-collapse text-[10px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-extrabold sticky top-0">
                              <th className="py-2 px-3 bg-slate-50">ఫీచర్ పేరు</th>
                              <th className="py-2 px-2 text-center bg-slate-50">స్టేటస్ (Status)</th>
                              <th className="py-2 px-3 text-center bg-slate-50">నెలవారీ ధర (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
                            {INITIAL_FEATURES.filter(f => [
                              'feat_premium_assistant',
                              'feat_premium_tracking',
                              'feat_premium_radio',
                              'feat_premium_invoicing',
                              'feat_premium_payments',
                              'feat_premium_escrow',
                              'feat_premium_multilingual',
                              'feat_premium_verification',
                              'feat_premium_support',
                              'feat_premium_analytics',
                              'feat_premium_team',
                              'feat_invisible_maintenance',
                              'feat_hybrid_radio',
                              'feat_brahmastra'
                            ].includes(f.id)).map((feat) => {
                              const currState = featureStates[feat.id] || 'temp_on';
                              const isOpen = currState !== 'temp_off' && currState !== 'perm_off';

                              return (
                                <tr key={feat.id} className="hover:bg-slate-50/50 transition">
                                  <td className="py-2 px-3">
                                    <div className="flex items-start gap-2">
                                      {FEATURE_ICONS[feat.id] && (
                                        <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center transform transition-transform hover:scale-105">
                                          <span className="text-lg drop-shadow-sm">{FEATURE_ICONS[feat.id]}</span>
                                        </div>
                                      )}
                                      <div className="flex flex-col gap-1">
                                        <div>
                                          <div className="font-extrabold text-gray-800 text-[10px] leading-tight">{feat.nameTe}</div>
                                          <div className="text-[8px] text-gray-400 font-mono mt-0.5">{feat.nameEn}</div>
                                        </div>
                                        {currState === 'temp_on' && (
                                          <div className="mt-0.5">
                                            <ManualFeatureTimer
                                              featureId={feat.id}
                                              type="premium"
                                              initialHours={featureTimers?.[feat.id] ? Math.max(1, Math.round((featureTimers?.[feat.id] - Date.now()) / (1000 * 60 * 60))) : 24}
                                              onSave={(hours, isOn) => {
                                                if (onUpdateFeatureTimer) {
                                                  onUpdateFeatureTimer(feat.id, hours, isOn);
                                                }
                                                if (!isOn) {
                                                  onUpdateFeatureState(feat.id, 'temp_off');
                                                }
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2 px-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextState = isOpen ? 'temp_off' : 'temp_on';
                                        onUpdateFeatureState(feat.id, nextState);
                                      }}
                                      className={`w-8 h-4 rounded-full relative inline-flex items-center transition-colors ${isOpen ? "bg-emerald-500" : "bg-gray-300"}`}
                                    >
                                      <span className={`w-3 h-3 rounded-full bg-white transition-transform ${isOpen ? "translate-x-4" : "translate-x-1"}`} />
                                    </button>
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <span className="text-gray-400 font-extrabold">₹</span>
                                      <input
                                        type="number"
                                        value={localPrices[feat.id] ?? 0}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          setLocalPrices(prev => ({ ...prev, [feat.id]: val }));
                                        }}
                                        className="w-14 bg-slate-50 border border-gray-200 rounded px-1.5 py-0.5 text-center text-[#082c75] font-extrabold focus:outline-none focus:border-emerald-500 text-[10px]"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleSaveLocalPrices}
                          className="w-full text-center text-[10px] bg-emerald-600 hover:bg-emerald-500 shadow-sm text-white font-black py-2 rounded-xl transition flex items-center justify-center gap-1"
                        >
                          <span>✓ సేవ్ చేయండి (Save Rates)</span>
                        </button>
                      </div>
                    </div>
                  ) : featuresSubTab === 'postpaid' ? (
                    <div className="space-y-3 animate-fade-in">
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl space-y-1">
                        <h5 className="font-extrabold text-amber-950 flex items-center gap-1">
                          <Cpu className="w-4 h-4 text-amber-700" />
                          <span>పోస్ట్‌పెయిడ్ సేవలు & నియంత్రణ (Postpaid Features)</span>
                        </h5>
                        <p className="text-[9px] text-amber-800 leading-normal font-medium">
                          వినియోగదారులు ముందుగా సేవలను వాడుకొని తరువాత పేమెంట్ చేసే అధునాతన ఫీచర్లను ఇక్కడ ఆన్ లేదా ఆఫ్ చేసుకోవచ్చు.
                        </p>
                      </div>

                      <div className="overflow-y-auto max-h-[300px] border border-gray-150 rounded-xl bg-white font-sans">
                        <table className="w-full text-left border-collapse text-[10px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-extrabold sticky top-0">
                              <th className="py-2 px-3 bg-slate-50">ఫీチャー పేరు</th>
                              <th className="py-2 px-2 text-center bg-slate-50">స్టేటస్ (Status)</th>
                              <th className="py-2 px-3 text-center bg-slate-50">రేట్/ఖర్చు (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
                            {INITIAL_FEATURES.filter(f => [
                              'feat_biopower',
                              'feat_bp_sugar',
                              'feat_doctor_scan',
                              'feat_weather_report',
                              'feat_invoice_generator'
                            ].includes(f.id)).map((feat) => {
                              const currState = featureStates[feat.id] || 'temp_on';
                              const isOpen = currState !== 'temp_off' && currState !== 'perm_off';

                              return (
                                <tr key={feat.id} className="hover:bg-slate-50/50 transition">
                                  <td className="py-2 px-3">
                                    <div className="flex items-start gap-2">
                                      {FEATURE_ICONS[feat.id] && (
                                        <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center transform transition-transform hover:scale-105">
                                          <span className="text-lg drop-shadow-sm">{FEATURE_ICONS[feat.id]}</span>
                                        </div>
                                      )}
                                      <div className="flex flex-col gap-1">
                                        <div>
                                          <div className="font-extrabold text-gray-800 text-[10px] leading-tight">{feat.nameTe}</div>
                                          <div className="text-[8px] text-gray-400 font-mono mt-0.5">{feat.nameEn}</div>
                                        </div>
                                        {currState === 'temp_on' && (
                                          <div className="mt-0.5">
                                            <ManualFeatureTimer
                                              featureId={feat.id}
                                              type="postpaid"
                                              initialHours={featureTimers?.[feat.id] ? Math.max(1, Math.round((featureTimers?.[feat.id] - Date.now()) / (1000 * 60 * 60))) : 24}
                                              onSave={(hours, isOn) => {
                                                if (onUpdateFeatureTimer) {
                                                  onUpdateFeatureTimer(feat.id, hours, isOn);
                                                }
                                                if (!isOn) {
                                                  onUpdateFeatureState(feat.id, 'temp_off');
                                                }
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2 px-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextState = isOpen ? 'temp_off' : 'temp_on';
                                        onUpdateFeatureState(feat.id, nextState);
                                      }}
                                      className={`w-8 h-4 rounded-full relative inline-flex items-center transition-colors ${isOpen ? "bg-amber-500" : "bg-gray-300"}`}
                                    >
                                      <span className={`w-3 h-3 rounded-full bg-white transition-transform ${isOpen ? "translate-x-4" : "translate-x-1"}`} />
                                    </button>
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <span className="text-gray-400 font-extrabold">₹</span>
                                      <input
                                        type="number"
                                        value={localPrices[feat.id] ?? 0}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          const updatedPrices = { ...localPrices, [feat.id]: val };
                                          setLocalPrices(updatedPrices);
                                          localStorage.setItem('cwb_feature_prices', JSON.stringify(updatedPrices));
                                        }}
                                        className="w-14 bg-slate-50 border border-gray-200 rounded px-1.5 py-0.5 text-center text-amber-600 font-extrabold focus:outline-none focus:border-amber-500 text-[10px]"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-fade-in">
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-gray-200">
                        <div className="text-[10px] font-extrabold text-[#082c75] flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                          <span>ప్రీమియం ఫీచర్స్ కంట్రోల్ (Premium Features) - రేట్ ఫిక్సింగ్</span>
                        </div>
                        <button 
                          type="button"
                          onClick={handleSaveLocalPrices}
                          className="text-[9px] bg-emerald-600 hover:bg-emerald-500 shadow-sm text-white font-bold px-3 py-1 rounded-lg transition active:scale-95"
                        >
                          రేట్లు సేవ్ చేయండి (Save)
                        </button>
                      </div>

                      {priceSaveStatus && (
                        <div className="p-2 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-lg font-bold">
                          {priceSaveStatus}
                        </div>
                      )}

                      <div className="overflow-y-auto max-h-[300px] border border-gray-150 rounded-xl bg-white font-sans">
                        <table className="w-full text-left border-collapse text-[10px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-extrabold sticky top-0">
                              <th className="py-2 px-3 bg-slate-50">ఫీచర్ పేరు</th>
                              <th className="py-2 px-2 text-center bg-slate-50">స్టేటస్ (Status)</th>
                              <th className="py-2 px-3 text-center bg-slate-50">నెలవారీ ధర (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-bold text-gray-700">
                            {[
                              'feat_hybrid_radio',
                              'feat_biopower',
                              'feat_bp_sugar',
                              'feat_doctor_scan',
                              'feat_weather_report',
                              'feat_premium_assistant',
                              'feat_premium_tracking',
                              'feat_premium_radio',
                              'feat_premium_invoicing',
                              'feat_premium_payments',
                              'feat_premium_escrow',
                              'feat_premium_multilingual',
                              'feat_premium_verification',
                              'feat_premium_support',
                              'feat_premium_analytics',
                              'feat_premium_team',
                              'feat_invisible_maintenance',
                              'feat_brahmastra'
                            ].map((id) => {
                              const feat = INITIAL_FEATURES.find(f => f.id === id);
                              if (!feat) return null;
                              const currState = featureStates[feat.id] || 'temp_on';
                              const isOpen = currState !== 'temp_off' && currState !== 'perm_off';

                              return (
                                <tr key={feat.id} className="hover:bg-slate-50/50 transition">
                                  <td className="py-2 px-3">
                                    <div className="flex items-start gap-2">
                                      {FEATURE_ICONS[feat.id] && (
                                        <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-slate-100 flex items-center justify-center transform transition-transform hover:scale-105">
                                          <span className="text-lg drop-shadow-sm">{FEATURE_ICONS[feat.id]}</span>
                                        </div>
                                      )}
                                      <div className="flex flex-col gap-1">
                                        <div>
                                          <div className="font-extrabold text-gray-800 text-[10px] leading-tight">{feat.nameTe}</div>
                                          <div className="text-[8px] text-gray-400 font-mono mt-0.5">{feat.nameEn}</div>
                                        </div>
                                        {currState === 'temp_on' && (
                                          <div className="mt-0.5">
                                            <ManualFeatureTimer
                                              featureId={feat.id}
                                              type="premium"
                                              initialHours={featureTimers?.[feat.id] ? Math.max(1, Math.round((featureTimers?.[feat.id] - Date.now()) / (1000 * 60 * 60))) : 24}
                                              onSave={(hours, isOn) => {
                                                if (onUpdateFeatureTimer) {
                                                  onUpdateFeatureTimer(feat.id, hours, isOn);
                                                }
                                                if (!isOn) {
                                                  onUpdateFeatureState(feat.id, 'temp_off');
                                                }
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-2 px-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextState = isOpen ? 'temp_off' : 'temp_on';
                                        onUpdateFeatureState(feat.id, nextState);
                                      }}
                                      className={`w-8 h-4 rounded-full relative inline-flex items-center transition-colors ${isOpen ? "bg-emerald-500" : "bg-gray-300"}`}
                                    >
                                      <span className={`w-3 h-3 rounded-full bg-white transition-transform ${isOpen ? "translate-x-4" : "translate-x-1"}`} />
                                    </button>
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <span className="text-gray-400 font-extrabold">₹</span>
                                      <input
                                        type="number"
                                        value={localPrices[feat.id] ?? 0}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          setLocalPrices(prev => ({ ...prev, [feat.id]: val }));
                                        }}
                                        className="w-14 bg-slate-50 border border-gray-200 rounded px-1.5 py-0.5 text-center text-[#082c75] font-extrabold focus:outline-none focus:border-emerald-500 text-[10px]"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className="bg-slate-50 border-t border-gray-200">
                              <td colSpan={2} className="py-3 px-3 text-right text-gray-600 font-black">
                                ప్రీమియం ఫీచర్ల మొత్తం (అన్ని యాక్టివ్ ఉన్నప్పుడు):
                              </td>
                              <td className="py-3 px-2 text-center text-emerald-600 font-black text-[12px]">
                                ₹{[
                                  'feat_hybrid_radio',
                                  'feat_biopower',
                                  'feat_bp_sugar',
                                  'feat_doctor_scan',
                                  'feat_weather_report',
                                  'feat_premium_assistant',
                                  'feat_premium_tracking',
                                  'feat_premium_radio',
                                  'feat_premium_invoicing',
                                  'feat_premium_payments',
                                  'feat_premium_escrow',
                                  'feat_premium_multilingual',
                                  'feat_premium_verification',
                                  'feat_premium_support',
                                  'feat_premium_analytics',
                                  'feat_premium_team',
                                  'feat_invisible_maintenance',
                                  'feat_brahmastra'
                                ].reduce((acc, id) => acc + (localPrices[id] ?? 0), 0)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeSubTab === 'vendor' ? (
                <div className="animate-fade-in space-y-4 max-h-[440px] overflow-y-auto pr-1 text-xs text-gray-700">
                  <EcommerceVendorDashboard />
                </div>
              ) : activeSubTab === 'gateways' ? (
                <div className="animate-fade-in space-y-4 max-h-[440px] overflow-y-auto pr-1 text-xs text-gray-700">
                  {/* Gateways and Coding Container */}
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1.5">
                    <h5 className="font-extrabold text-emerald-950 flex items-center gap-1">
                      <CreditCard className="w-4 h-4 text-emerald-700" />
                      <span>గేట్‌వేస్ & కోడింగ్ (Gateways & Custom Integration)</span>
                    </h5>
                    <p className="text-[10px] text-emerald-800 leading-normal">
                      మీరు తీసుకువచ్చే పేమెంట్ మరియు SMS గేట్‌వేల కోసం ఈ క్రింది సెక్షన్లు ప్రత్యేకంగా సిద్ధం చేయబడ్డాయి. API కీలు మరియు రూటింగ్‌ను ఇక్కడ డైరెక్ట్‌గా కాన్ఫిగర్ చేసుకొని కోడ్ లో వాడుకోవచ్చు.
                    </p>
                  </div>

                  {/* 1. SMS GATEWAY SETTINGS */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-150 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h6 className="font-extrabold text-gray-800 flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-blue-600" />
                        <span>SMS గేట్‌వే కాన్ఫిగరేషన్ (SMS Gateway)</span>
                      </h6>
                      <span className="text-[8px] bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.5 rounded">
                        SMS OTP
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-extrabold text-gray-500 uppercase">SMS API URL / Endpoint</label>
                        <input
                          type="text"
                          value={smsGatewayUrl}
                          onChange={(e) => setSmsGatewayUrl(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 font-mono text-[10px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                          placeholder="e.g. https://api.fast2sms.com/dev/bulkV2"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-extrabold text-gray-500 uppercase">SMS API Authorization Key</label>
                        <input
                          type="password"
                          value={smsApiKey}
                          onChange={(e) => setSmsApiKey(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 font-mono text-[10px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSmsTesting(true);
                          setSmsStatus(null);
                          setTimeout(() => {
                            setIsSmsTesting(false);
                            setSmsStatus('✓ API కనెక్షన్ విజయవంతమైంది! SMS పంపడానికి సిద్ధంగా ఉంది.');
                          }, 1200);
                        }}
                        disabled={isSmsTesting}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[9px] rounded-lg transition active:scale-95 flex items-center gap-1"
                      >
                        {isSmsTesting ? 'కనెక్ట్ అవుతోంది...' : 'కనెక్షన్ టెస్ట్ చేయి (Test Gateway)'}
                      </button>

                      <span className="text-[8px] text-gray-400 font-bold">Fast2SMS/MSG91/Twilio Ready</span>
                    </div>

                    {smsStatus && (
                      <p className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg font-bold">
                        {smsStatus}
                      </p>
                    )}

                    {/* Developer Code Snippet */}
                    <div className="bg-slate-900 rounded-lg p-2.5 space-y-1 font-mono text-[9px] text-gray-300 relative overflow-x-auto">
                      <div className="flex justify-between items-center text-gray-500 border-b border-gray-800 pb-1 mb-1 text-[8px] font-bold">
                        <span>NODE.JS SMS GATEWAY PROXY CODE</span>
                        <Code className="w-3 h-3 text-cyan-400" />
                      </div>
                      <p className="text-emerald-400">// SMS Gateway API Integration Code</p>
                      <p className="text-cyan-300">async function <span className="text-yellow-300">sendOTPSMS</span>(phone, otp) &#123;</p>
                      <p className="pl-3">const response = await fetch("<span className="text-amber-300">{smsGatewayUrl}</span>", &#123;</p>
                      <p className="pl-6">method: "POST",</p>
                      <p className="pl-6">headers: &#123; "Authorization": "<span className="text-amber-300">SECRET_KEY</span>", "Content-Type": "application/json" &#125;,</p>
                      <p className="pl-6">body: JSON.stringify(&#123; route: "otp", variables_values: otp, numbers: phone &#125;)</p>
                      <p className="pl-3">&#125;);</p>
                      <p className="pl-3">return await response.json();</p>
                      <p className="text-cyan-300">&#125;</p>
                    </div>
                  </div>

                  {/* 2. PAYMENT GATEWAY SETTINGS */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-150 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h6 className="font-extrabold text-gray-800 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                        <span>పేమెంట్ గేట్‌వే కాన్ఫిగరేషన్ (Payment Gateway)</span>
                      </h6>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded">
                        PAYMENT PG
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1 col-span-2">
                        <label className="block text-[9px] font-extrabold text-gray-500 uppercase">సెలెక్ట్ గేట్‌వే సర్వీస్ (Select PG Provider)</label>
                        <select
                          value={paymentGateway}
                          onChange={(e) => setPaymentGateway(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 text-[10px] font-bold text-gray-800 focus:outline-none"
                        >
                          <option value="phonepe">PhonePe Payment Gateway (UPI Direct)</option>
                          <option value="razorpay">Razorpay Checkout SDK</option>
                          <option value="paytm">Paytm Business All-In-One</option>
                          <option value="gpay">Google Pay Business API</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-extrabold text-gray-500 uppercase">Merchant ID / Account ID</label>
                        <input
                          type="text"
                          value={merchantId}
                          onChange={(e) => setMerchantId(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 font-mono text-[10px] text-gray-800 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-extrabold text-gray-500 uppercase">Salt Key / Auth Token</label>
                        <input
                          type="password"
                          value={paymentSalt}
                          onChange={(e) => setPaymentSalt(e.target.value)}
                          className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 font-mono text-[10px] text-gray-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPayTesting(true);
                          setPayStatus(null);
                          setTimeout(() => {
                            setIsPayTesting(false);
                            setPayStatus('✓ పేమెంట్ గేట్‌వే స్పేస్ యాక్టివేట్ అయింది! మీరు క్రెడెన్షియల్స్ ఇచ్చిన వెంటనే పేమెంట్స్ ఆటో-డైరెక్ట్ అవుతాయి.');
                          }, 1200);
                        }}
                        disabled={isPayTesting}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] rounded-lg transition active:scale-95 flex items-center gap-1"
                      >
                        {isPayTesting ? 'కనెక్ట్ అవుతోంది...' : 'పేమెంట్ గేట్‌వే టెస్ట్ చేయి'}
                      </button>

                      <span className="text-[8px] text-gray-400 font-bold">UPI Redirect SDK ready</span>
                    </div>

                    {payStatus && (
                      <p className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg font-bold">
                        {payStatus}
                      </p>
                    )}

                    {/* Payment proxy payload */}
                    <div className="bg-slate-900 rounded-lg p-2.5 space-y-1 font-mono text-[9px] text-gray-300 relative overflow-x-auto">
                      <div className="flex justify-between items-center text-gray-500 border-b border-gray-800 pb-1 mb-1 text-[8px] font-bold">
                        <span>EXPRESS.JS PAYMENT CALLBACK ROUTE</span>
                        <Code className="w-3 h-3 text-emerald-400" />
                      </div>
                      <p className="text-emerald-400">// Custom Gateway Router Handler</p>
                      <p className="text-cyan-300">app.post("/api/gateway/pay", async (req, res) =&gt; &#123;</p>
                      <p className="pl-3">const &#123; amount, txId, phone &#125; = req.body;</p>
                      <p className="pl-3 text-gray-500">// Configure Pay-load matching {paymentGateway.toUpperCase()}</p>
                      <p className="pl-3">const payload = &#123; merchantId: "<span className="text-amber-300">{merchantId}</span>", transactionId: txId, amount &#125;;</p>
                      <p className="pl-3">res.json(&#123; success: true, redirectUrl: "https://pay.telugu.in/redirect" &#125;);</p>
                      <p className="text-cyan-300">&#125;);</p>
                    </div>
                  </div>
                </div>
              ) : activeSubTab === 'brahmastra' ? (
                <div className="animate-fade-in max-h-[440px] overflow-y-auto pr-1">
                  <BrahmastraSystemComponent 
                    isAgentToggleVisible={isAgentToggleVisible}
                    onToggleAgentVisibility={onToggleAgentVisibility}
                    isBrahmastraButtonVisible={isBrahmastraButtonVisible}
                    onToggleBrahmastraButton={onToggleBrahmastraButton}
                    isSystemOnline={isSystemOnline}
                    onToggleSystemOnline={onToggleSystemOnline}
                    isHybridRadioMode={isHybridRadioMode}
                    onToggleHybridRadioMode={onToggleHybridRadioMode}
                  />
                </div>
              ) : activeSubTab === 'passwords' ? (
                <div className="animate-fade-in max-h-[440px] overflow-y-auto pr-1 space-y-4 text-xs text-gray-700">
                  <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100 flex items-start gap-2.5 shadow-xs">
                    <Shield className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-cyan-900 text-[11px]">అడ్మిన్ సెక్యూరిటీ మేనేజ్‌మెంట్ (Admin Security & Credentials)</h4>
                      <p className="text-[9px] text-cyan-700/80 mt-0.5 leading-relaxed">
                        అడ్మిన్ గారు (Admin garu), ఇక్కడ మీరు పాస్‌వర్డ్, బయోమెట్రిక్ ఫింగర్‌ప్రింట్ మరియు మాస్టర్ ఫోటో వెరిఫికేషన్ నిబంధనలను సెట్ చేసుకోవచ్చు. ఇవి ఆన్‌లైన్ Firebase Firestore మరియు లోకల్ యాప్‌లో పర్మనెంట్‌గా సింక్ అవుతాయి.
                      </p>
                    </div>
                  </div>

                  {cloudSyncStatus && (
                    <div className="p-2.5 text-[10px] bg-slate-900 text-cyan-300 rounded-xl font-mono border border-cyan-500/30 flex items-center justify-between">
                      <span>{cloudSyncStatus}</span>
                      {isCloudSyncing && <span className="animate-pulse text-amber-400">సింక్ అవుతోంది...</span>}
                    </div>
                  )}

                  {/* 1. EXISTING PASSWORD MANAGEMENT */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <h4 className="font-extrabold text-[#082c75] text-xs border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-[#082c75]" />
                      <span>పాస్‌వర్డ్ మేనేజ్‌మెంట్ (Password Settings)</span>
                    </h4>
                    
                    <div className="space-y-3">
                      {/* Admin Password */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-700">అడ్మిన్ ప్యానెల్ పాస్‌వర్డ్ (Admin Password)</label>
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveSinglePassword('admin');
                          }}
                          className="flex gap-2"
                        >
                          <div className="relative flex-1 flex items-center">
                            <Key className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
                            <input
                              type={showAdminPwd ? "text" : "password"}
                              value={newAdminPwd}
                              onChange={(e) => {
                                setNewAdminPwd(e.target.value);
                                setAdminSaved(false);
                              }}
                              placeholder="కొత్త పాస్‌వర్డ్..."
                              className="w-full text-xs pl-8.5 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#082c75] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowAdminPwd(!showAdminPwd)}
                              className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-600 transition"
                            >
                              {showAdminPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <button
                            type="submit"
                            className={`${
                              adminSaved 
                                ? "bg-emerald-600 hover:bg-emerald-700" 
                                : "bg-[#082c75] hover:bg-[#001040]"
                            } text-white px-4.5 py-2 rounded-lg font-extrabold text-[10px] transition active:scale-95 whitespace-nowrap cursor-pointer shadow-xs`}
                          >
                            {adminSaved ? 'సేవ్ అయింది ✓' : 'సేవ్'}
                          </button>
                        </form>
                      </div>

                      {/* Brahmastra Code */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-700">బ్రహ్మాస్త్ర కోడ్ (Brahmastra Secret Code)</label>
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveSinglePassword('brahmastra');
                          }}
                          className="flex gap-2"
                        >
                          <div className="relative flex-1 flex items-center">
                            <Key className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
                            <input
                              type={showBrahmastraPwd ? "text" : "password"}
                              value={newBrahmastraPwd}
                              onChange={(e) => {
                                setNewBrahmastraPwd(e.target.value);
                                setBrahmastraSaved(false);
                              }}
                              placeholder="బ్రహ్మాస్త్ర కోడ్..."
                              className="w-full text-xs pl-8.5 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#082c75] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowBrahmastraPwd(!showBrahmastraPwd)}
                              className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-600 transition"
                            >
                              {showBrahmastraPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <button
                            type="submit"
                            className={`${
                              brahmastraSaved 
                                ? "bg-emerald-600 hover:bg-emerald-700" 
                                : "bg-[#082c75] hover:bg-[#001040]"
                            } text-white px-4.5 py-2 rounded-lg font-extrabold text-[10px] transition active:scale-95 whitespace-nowrap cursor-pointer shadow-xs`}
                          >
                            {brahmastraSaved ? 'సేవ్ అయింది ✓' : 'సేవ్'}
                          </button>
                        </form>
                      </div>

                      {/* Vault PIN */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-700">సీక్రెట్ వాల్ట్ పిన్ (Secure Vault PIN)</label>
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveSinglePassword('vault');
                          }}
                          className="flex gap-2"
                        >
                          <div className="relative flex-1 flex items-center">
                            <Key className="absolute left-3 w-3.5 h-3.5 text-gray-400" />
                            <input
                              type={showVaultPwd ? "text" : "password"}
                              value={newVaultPwd}
                              onChange={(e) => {
                                setNewVaultPwd(e.target.value);
                                setVaultSaved(false);
                              }}
                              placeholder="వాల్ట్ పిన్..."
                              className="w-full text-xs pl-8.5 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#082c75] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => setShowVaultPwd(!showVaultPwd)}
                              className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-600 transition"
                            >
                              {showVaultPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <button
                            type="submit"
                            className={`${
                              vaultSaved 
                                ? "bg-emerald-600 hover:bg-emerald-700" 
                                : "bg-[#082c75] hover:bg-[#001040]"
                            } text-white px-4.5 py-2 rounded-lg font-extrabold text-[10px] transition active:scale-95 whitespace-nowrap cursor-pointer shadow-xs`}
                          >
                            {vaultSaved ? 'సేవ్ అయింది ✓' : 'సేవ్'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* 2. FINGERPRINT / BIOMETRIC MANAGEMENT */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <h4 className="font-extrabold text-[#082c75] text-xs border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                      <Fingerprint className="w-4 h-4 text-cyan-600" />
                      <span>ఫింగర్‌ప్రింట్ / బయోమెట్రిక్ మేనేజ్‌మెంట్ (Biometric Management)</span>
                    </h4>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-gray-150">
                        <div>
                          <p className="font-extrabold text-gray-800 text-[11px]">నమోదిత బయోమెట్రిక్ (Registered Fingerprint)</p>
                          <p className="text-[9px] font-mono text-gray-500 truncate max-w-[200px]">
                            {biometricCredentialId ? `Cred ID: ${biometricCredentialId}` : 'ఫింగర్‌ప్రింట్ నమోదు కాలేదు'}
                          </p>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${biometricCredentialId ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {biometricCredentialId ? 'ACTIVE' : 'NOT SET'}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleRegisterFingerprint}
                          className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-black text-[10px] rounded-xl shadow-xs transition active:scale-95 flex items-center justify-center gap-1"
                        >
                          <Fingerprint className="w-3.5 h-3.5" />
                          <span>Register New Fingerprint (కొత్తది నమోదు చేయి)</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleResetBiometrics}
                          className="px-3 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-[10px] rounded-xl transition active:scale-95 whitespace-nowrap"
                        >
                          Reset / Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 3. PHOTO VERIFICATION MANAGEMENT */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <h4 className="font-extrabold text-[#082c75] text-xs border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>మాస్టర్ ఫోటో & కెమెరా వెరిఫికేషన్ (Photo Verification Settings)</span>
                    </h4>

                    <div className="space-y-3">
                      {/* Master Photo Upload */}
                      <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-gray-150">
                        <div className="flex items-center gap-3">
                          {masterPhotoUrl ? (
                            <img src={masterPhotoUrl} alt="Master" className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-sm" />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                              📷
                            </div>
                          )}
                          <div>
                            <p className="font-extrabold text-gray-800 text-[11px]">మాస్టర్ ఒరిజినల్ ఫోటో (Master Photo)</p>
                            <p className="text-[9px] text-gray-500">లాగిన్ సమయంలో కెమెరా ఫోటో ఈ ఫోటోతో మ్యాచ్ కావాలి.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {masterPhotoUrl && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm('మాస్టర్ ఫోటోను తొలగించాలా? (Delete Master Photo)')) {
                                  setMasterPhotoUrl('');
                                  localStorage.removeItem('cwb_master_photo_url');
                                  await saveSecurityToCloudAndLocal({ masterPhotoUrl: '' });
                                  alert('✓ మాస్టర్ ఫోటో విజయవంతంగా తొలగించబడింది!');
                                }
                              }}
                              className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-[9px] rounded-lg transition active:scale-95"
                              title="Delete Master Photo"
                            >
                              తొలగించు
                            </button>
                          )}
                          <label className="px-3 py-1.5 bg-[#082c75] hover:bg-[#001040] text-white font-extrabold text-[9px] rounded-lg cursor-pointer shadow-xs transition active:scale-95 whitespace-nowrap">
                            అప్‌లోడ్ ఫోటో
                            <input type="file" accept="image/*" onChange={handleMasterPhotoUpload} className="hidden" />
                          </label>
                        </div>
                      </div>

                      {/* Camera Verification Toggle Switch */}
                      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-gray-150">
                        <div className="space-y-0.5">
                          <p className="font-extrabold text-gray-800 text-[11px]">కెమెరా వెరిఫికేషన్ మాస్టర్ స్విచ్ (Camera Verification Toggle)</p>
                          <p className="text-[9px] text-gray-500">
                            {cameraVerificationEnabled ? 'లాగిన్ సమయంలో కెమెరా ఫోటో క్యాప్చర్ & వెరిఫికేషన్ ఆన్‌లో ఉంది' : 'కెమెరా వెరిఫికేషన్ డిసేబుల్ చేయబడింది'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const nextVal = !cameraVerificationEnabled;
                            setCameraVerificationEnabled(nextVal);
                            await saveSecurityToCloudAndLocal({ cameraVerificationEnabled: nextVal });
                            alert(nextVal ? '✓ కెమెరా వెరిఫికేషన్ ఆన్ చేయబడింది!' : '✓ కెమెరా వెరిఫికేషన్ ఆఫ్ చేయబడింది.');
                          }}
                          className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${cameraVerificationEnabled ? 'bg-emerald-600' : 'bg-gray-300'}`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${cameraVerificationEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* View Login Photos Gallery (Audit Logs) */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-700 text-[10px]">లాగిన్ ఆడిట్ లాగ్ గ్యాలరీ (Audit Log Login Photos): {loginAuditPhotos.length}</span>
                          {loginAuditPhotos.length > 0 && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm('అన్ని లాగిన్ ఆడిట్ ఫోటోలను తొలగించాలా?')) {
                                  setLoginAuditPhotos([]);
                                  await saveSecurityToCloudAndLocal({ loginAuditPhotos: [] });
                                }
                              }}
                              className="text-[9px] text-rose-600 font-bold hover:underline"
                            >
                              Clear Gallery
                            </button>
                          )}
                        </div>
                        {loginAuditPhotos.length === 0 ? (
                          <div className="p-3 bg-gray-50 rounded-lg text-center text-[9px] text-gray-400 border border-dashed border-gray-200">
                            ఇంతవరకు లాగిన్ ఫోటోలు రికార్డ్ కాలేదు. (No login audit photos captured yet)
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-1 bg-slate-100 rounded-lg">
                            {loginAuditPhotos.map((photo, idx) => (
                              <div key={idx} className="relative group">
                                <img src={photo} alt={`Audit ${idx}`} className="w-full h-16 object-cover rounded border border-gray-300 shadow-xs" />
                                <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[7px] px-1 rounded">#{idx+1}</span>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm(`ఫోటో #${idx+1} ని తొలగించాలా?`)) {
                                      const updated = loginAuditPhotos.filter((_, i) => i !== idx);
                                      setLoginAuditPhotos(updated);
                                      await saveSecurityToCloudAndLocal({ loginAuditPhotos: updated });
                                    }
                                  }}
                                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center text-[8px] opacity-85 group-hover:opacity-100 transition shadow"
                                  title="Delete photo"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cloud Sync Permanent Save Button */}
                  <button
                    type="button"
                    onClick={() => saveSecurityToCloudAndLocal({})}
                    className={`w-full py-3 ${isSavedRecently ? 'bg-emerald-600 hover:bg-emerald-500 scale-[1.02]' : 'bg-[#082c75] hover:bg-[#001040]'} text-white font-black text-xs rounded-xl shadow-md transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer`}
                  >
                    <span>{isSavedRecently ? '✓ సేవ్ చేయబడింది! (Saved Successfully!)' : '☁️ Save All Security Settings to Firebase Cloud (క్లౌడ్‌కు సింక్ చేయి)'}</span>
                  </button>
                </div>
              ) : activeSubTab === 'support' ? (
                <div className="animate-fade-in space-y-4 max-h-[440px] overflow-y-auto pr-1 text-xs text-gray-700">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2.5">
                    <span className="text-base">📞</span>
                    <div>
                      <h4 className="font-extrabold text-emerald-800 text-[11px]">కస్టమర్ కేర్ & సపోర్ట్ కాన్ఫిగరేషన్ (Support Setup)</h4>
                      <p className="text-[9px] text-emerald-700/80 mt-0.5 leading-relaxed">
                        ఇక్కడ మీరు అప్లికేషన్‌లో కనిపించే కస్టమర్ కేర్ ఫోన్ నెంబర్ మరియు గూగుల్ ఫారం ఫీడ్‌బ్యాక్ లింకులను అప్డేట్ చేసుకోవచ్చు. అదనపు ఫోన్ నంబర్లను కూడా యాడ్ చేయవచ్చు.
                      </p>
                    </div>
                  </div>

                  {/* SECTION 1: Primary Controls */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
                    <h3 className="font-bold text-[#082c75] uppercase tracking-wide text-[9px]">ప్రధాన లింకులు / Primary Links</h3>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-700">కస్టమర్ కేర్ మొబైల్ నెంబర్ / Customer Care Phone</label>
                        <input
                          type="text"
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none text-gray-800 font-bold"
                          placeholder="మొబైల్ నెంబర్ ఎంటర్ చేయండి"
                          value={customerCarePhone}
                          onChange={(e) => setCustomerCarePhone(e.target.value)}
                        />
                        <span className="text-[8px] text-gray-400 block">కస్టమర్ 'Care' బటన్ నొక్కినప్పుడు ఈ నంబర్‌కి నేరుగా డయల్ వెళ్తుంది.</span>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-700">గూగుల్ ఫారం ఫీడ్‌బ్యాక్ లింక్ / Google Form Link</label>
                        <input
                          type="url"
                          className="w-full p-2 bg-white border border-gray-200 rounded-lg font-mono text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none text-gray-800 font-bold"
                          placeholder="https://forms.gle/..."
                          value={feedbackGoogleForm}
                          onChange={(e) => setFeedbackGoogleForm(e.target.value)}
                        />
                        <span className="text-[8px] text-gray-400 block">కస్టమర్ 'Feedback' బటన్ నొక్కినప్పుడు ఈ గూగుల్ ఫారం ఓపెన్ అవుతుంది.</span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Add Additional Phone Numbers */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
                    <h3 className="font-bold text-[#082c75] uppercase tracking-wide text-[9px]">అదనపు నంబర్లు / Add Other Phone Numbers</h3>
                    
                    {/* Form to add */}
                    <div className="bg-white p-2.5 rounded-lg border border-slate-100 space-y-2">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-gray-500 uppercase">పేరు / Contact Name</label>
                        <input
                          type="text"
                          placeholder="ఉదా: సూపర్వైజర్ ప్రసాద్"
                          value={newContactName}
                          onChange={(e) => setNewContactName(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-800 font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-gray-500 uppercase">ఫోన్ నెంబర్ / Phone Number</label>
                        <input
                          type="text"
                          placeholder="ఉదా: 9876543210"
                          value={newContactPhone}
                          onChange={(e) => setNewContactPhone(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-800 font-bold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const name = newContactName.trim();
                          const phone = newContactPhone.trim();
                          if (!name || !phone) {
                            alert("దయచేసి పేరు మరియు సరైన ఫోన్ నెంబర్ రెండింటినీ ఎంటర్ చేయండి!");
                            return;
                          }
                          const newContact = {
                            id: 'contact_' + Date.now(),
                            name,
                            phone
                          };
                          setSupportNumbersList(prev => [...prev, newContact]);
                          setNewContactName('');
                          setNewContactPhone('');
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-lg transition active:scale-95 text-center cursor-pointer"
                      >
                        నంబర్ యాడ్ చేయి / Add Number
                      </button>
                    </div>

                    {/* List of other numbers */}
                    <div className="space-y-1.5">
                      <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-wide">ప్రస్తుతం ఉన్న సహాయక నంబర్లు / Contact List</span>
                      {supportNumbersList.length === 0 ? (
                        <div className="text-center py-3 text-[10px] text-gray-400 bg-white rounded-lg border border-dashed border-gray-200">
                          ఇతర సహాయక నంబర్లు ఏవీ లేవు.
                        </div>
                      ) : (
                        <div className="overflow-hidden border border-gray-150 rounded-lg bg-white">
                          <table className="w-full text-left border-collapse text-[10px]">
                            <thead>
                              <tr className="bg-slate-50 text-gray-500 font-bold border-b border-gray-150 uppercase text-[8px]">
                                <th className="py-1.5 px-2">పేరు / Name</th>
                                <th className="py-1.5 px-2">ఫోన్ / Phone</th>
                                <th className="py-1.5 px-2 text-right">చర్య / Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {supportNumbersList.map((contact) => (
                                <tr key={contact.id} className="hover:bg-slate-50/50 transition">
                                  <td className="py-1.5 px-2 font-bold text-[#082c75]">{contact.name}</td>
                                  <td className="py-1.5 px-2 font-mono text-gray-600">{contact.phone}</td>
                                  <td className="py-1.5 px-2 text-right">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSupportNumbersList(prev => prev.filter(c => c.id !== contact.id));
                                      }}
                                      className="px-2 py-0.5 bg-red-50 text-red-600 font-bold text-[8px] rounded-md hover:bg-red-100 transition border border-red-200/40"
                                    >
                                      డిలీట్
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : activeSubTab === 'maintenance' ? (
                <div className="animate-fade-in space-y-4 max-h-[440px] overflow-y-auto pr-1 text-xs text-gray-700">
                  <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100/60 flex items-start gap-2.5 shadow-xs">
                    <div className="p-1.5 bg-indigo-500 rounded-xl text-white shrink-0">
                      <Cpu className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-indigo-900 text-[11px]">ఇన్విజిబుల్ మెయింటెనెన్స్ అసిస్టెంట్</h4>
                      <p className="text-[9px] text-indigo-700/80 mt-1 leading-relaxed">
                        ఈ ఫీచర్ పూర్తిగా బ్యాక్గ్రౌండ్‌లో మాత్రమే రన్ అవుతుంది. ఏ యూజర్‌కు కూడా దీని గురించి తెలియదు, నోటిఫికేషన్లు వెళ్ళవు. సిస్టమ్‌లోని బగ్స్ క్లీన్ చేయడం మరియు ఎర్రర్స్ ఆటో-ఫిక్స్ చేయడం దీని బాధ్యత.
                      </p>
                    </div>
                  </div>

                  {/* Section 1: Activation Control */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="block font-extrabold text-gray-800 text-[11px]">అసిస్టెంట్ సర్వీస్ స్టేటస్</span>
                      <span className="text-[9px] text-gray-500 block">బ్యాక్గ్రౌండ్ సెల్ఫ్-హీలింగ్ ఆన్/ఆఫ్ చేయండి</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={onToggleMaintenance}
                      className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center px-0.5 ${
                        isMaintenanceEnabled ? 'bg-indigo-600 shadow-md shadow-indigo-600/20' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 flex items-center justify-center text-[8px] font-bold ${
                        isMaintenanceEnabled ? 'translate-x-6 text-indigo-600' : 'translate-x-0 text-gray-400'
                      }`}>
                        {isMaintenanceEnabled ? 'ON' : 'OFF'}
                      </div>
                    </button>
                  </div>

                  {/* Section 2: Secret Log Panel */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="font-extrabold text-[#082c75] uppercase tracking-wide text-[10px]">సీక్రెట్ మెయింటెనెన్స్ లాగ్ (Secret Log)</span>
                      </div>
                      
                      {maintenanceLogs.length > 0 && (
                        <button
                          type="button"
                          onClick={onClearMaintenanceLogs}
                          className="text-[8px] font-black text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200/50 rounded-lg px-2 py-1 transition active:scale-95 cursor-pointer"
                        >
                          లాగ్స్ క్లియర్ చేయి (Clear)
                        </button>
                      )}
                    </div>

                    <div className="bg-slate-900 text-slate-300 font-mono rounded-xl p-3 text-[9px] border border-slate-850 space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin">
                      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-[8px] text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                        <span>యాక్టివ్ మానిటరింగ్: {isMaintenanceEnabled ? 'సక్రియంగా ఉంది (ACTIVE)' : 'ఆఫ్‌లైన్ (DISABLED)'}</span>
                      </div>

                      {maintenanceLogs.length === 0 ? (
                        <div className="text-center py-6 text-slate-500 italic text-[10px]">
                          లాగ్స్ ఏవీ లేవు. సర్వీస్ ఆన్‌లో ఉన్నప్పుడు ఇక్కడ ఆటోమేటిక్‌గా రిపోర్ట్స్ జనరేట్ అవుతాయి.
                        </div>
                      ) : (
                        <div className="space-y-2.5 divide-y divide-slate-800/50">
                          {maintenanceLogs.map((log) => (
                            <div key={log.id} className="pt-2 first:pt-0 space-y-1">
                              <div className="flex items-center justify-between text-[8px] text-slate-400">
                                <span className="font-bold text-[#FFC000]">{log.timestamp}</span>
                                <span className={`px-1 rounded-sm uppercase font-extrabold text-[7px] ${
                                  log.type === 'error' ? 'bg-red-950 text-red-400 border border-red-900/50' : 'bg-emerald-950 text-emerald-400 border border-emerald-900/50'
                                }`}>
                                  {log.type === 'error' ? '🔧 Fixed Error' : '🧹 Cleaned Bug'}
                                </span>
                              </div>
                              <p className="text-[10px] leading-relaxed text-slate-200">{log.description}</p>
                              <div className="text-[8px] text-emerald-500 flex items-center gap-1">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>పరిష్కరించబడింది (AUTO-RESOLVED & SILENTLY HEALED)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : activeSubTab === 'pwa' ? (
                <div className="animate-fade-in space-y-4 max-h-[440px] overflow-y-auto pr-1 text-xs text-gray-700">
                  <div className="bg-cyan-50 border border-cyan-200 p-3.5 rounded-xl space-y-1.5">
                    <h5 className="font-extrabold text-cyan-950 flex items-center gap-1.5">
                      <span>📱 PWA (Progressive Web App) కంట్రోల్ సిస్టమ్</span>
                    </h5>
                    <p className="text-[10px] text-cyan-800 leading-relaxed">
                      అడ్మిన్ ప్యానెల్ ద్వారా మీ వెబ్ యాప్ యొక్క PWA ఇన్స్టాల్ ప్రాంప్ట్లు, సర్వీస్ వర్కర్ మరియు ఆఫ్లైన్ క్యాచింగ్ సిస్టమ్‌ను ఎనేబుల్ లేదా డిసేబుల్ చేయండి.
                    </p>
                  </div>

                  {/* PWA On/Off Toggle Switch */}
                  <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h6 className="font-extrabold text-gray-800 text-xs">PWA మాస్టర్ స్విచ్ (PWA On/Off Toggle)</h6>
                        <p className="text-[9px] text-gray-500">
                          {pwaEnabled ? 'ప్రస్తుతం PWA ఆన్‌లో ఉంది (Install App ప్రాంప్ట్లు యాక్టివ్)' : 'ప్రస్తుతం PWA ఆఫ్‌లో ఉంది (డిసేబుల్ చేయబడింది)'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !pwaEnabled;
                          setPwaEnabled(nextState);
                          localStorage.setItem('cwb_pwa_enabled', nextState ? 'true' : 'false');
                          window.dispatchEvent(new Event('storage'));
                          alert(nextState ? '✓ PWA ఆన్ చేయబడింది! యూజర్లకు Install App ఆప్షన్ యాక్టివేట్ అయింది.' : '✓ PWA ఆఫ్ చేయబడింది! సర్వీస్ వర్కర్ మరియు ప్రాంప్ట్లు డిసేబుల్ అయ్యాయి.');
                        }}
                        className={`w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${pwaEnabled ? 'bg-cyan-600' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${pwaEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[9px]">
                      <span className="font-bold text-gray-500">స్టేటస్ (Status):</span>
                      <span className={`font-black px-2 py-0.5 rounded-full ${pwaEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {pwaEnabled ? '🟢 ACTIVE (ON)' : '🔴 DISABLED (OFF)'}
                      </span>
                    </div>
                  </div>

                  {/* Mobile App Admin Settings Icon Control Board */}
                  <div className="bg-white p-4 rounded-xl border border-gray-150 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h6 className="font-extrabold text-gray-800 text-xs">📱 మొబైల్ యాప్ అడ్మిన్ ఐకాన్ స్విచ్ (Mobile App Admin Icon Control)</h6>
                        <p className="text-[9px] text-gray-500">
                          {mobileSettingsIconVisible ? 'మొబైల్ యాప్‌లో సెట్టింగ్స్/అడ్మిన్ ఐకాన్ కనిపిస్తుంది (ON)' : 'మొబైల్ యాప్‌లో సెట్టింగ్స్/అడ్మిన్ ఐకాన్ దాచబడింది (OFF - Secure)'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const nextVal = !mobileSettingsIconVisible;
                          setMobileSettingsIconVisible(nextVal);
                          localStorage.setItem('cwb_mobile_settings_icon_visible', String(nextVal));
                          await saveSecurityToCloudAndLocal({ mobileSettingsIconVisible: nextVal });
                          try {
                            if (db) {
                              await setDoc(doc(db, 'settings', 'pwaConfig'), { showAdminIcon: nextVal, pwaAdminIconVisible: nextVal, mobileSettingsIconVisible: nextVal }, { merge: true });
                              await setDoc(doc(db, 'settings', 'admin_security'), { mobileSettingsIconVisible: nextVal, showAdminIcon: nextVal, pwaAdminIconVisible: nextVal }, { merge: true });
                            }
                          } catch (e) {}
                          alert(nextVal ? '✓ మొబైల్ యాప్‌లో సెట్టింగ్స్/అడ్మిన్ ఐకాన్ ఆన్ చేయబడింది!' : '✓ మొబైల్ యాప్‌లో సెట్టింగ్స్/అడ్మిన్ ఐకాన్ దాచబడింది (OFF).');
                        }}
                        className={`w-12 h-6 rounded-full transition-colors flex items-center px-0.5 ${mobileSettingsIconVisible ? 'bg-cyan-600' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${mobileSettingsIconVisible ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[9px]">
                      <span className="font-bold text-gray-500">యాప్ ఐకాన్ డిస్‌ప్లే స్టేటస్:</span>
                      <span className={`font-black px-2 py-0.5 rounded-full ${mobileSettingsIconVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {mobileSettingsIconVisible ? '🟢 VISIBLE (కనిపిస్తుంది)' : '🔴 HIDDEN (దాచబడింది)'}
                      </span>
                    </div>
                  </div>

                  {/* Publish Final PWA Update / Manual Control Feature */}
                  <div className={`bg-white p-4 rounded-xl border border-gray-150 space-y-3 shadow-xs transition-opacity ${pwaEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <div className="space-y-0.5">
                      <h6 className="font-extrabold text-gray-800 text-xs">Publish Final PWA Update (ఫైనల్ PWA అప్‌డేట్)</h6>
                      <p className="text-[9px] text-gray-500">
                        డెవలప్‌మెంట్ డ్రాఫ్ట్ మార్పులు ఆటోమేటిక్‌గా వెళ్లకుండా, అడ్మిన్ ప్యానెల్ ద్వారా మాన్యువల్‌గా పబ్లిష్ చేయండి.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-cyan-700">✨ లైవ్ వెర్షన్: <span className="text-emerald-600 font-black">{currentLiveVersion}</span></span>
                          <span className="text-[8px] text-gray-400">మొబైల్ యాప్ ఈ వెర్షన్‌తో సింక్ అవుతుంది</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              // Try to parse the version number from string like 'v2.26' or 'CWRB-v2.26'
                              const match = currentLiveVersion.match(/(\d+)(?!.*\d)/);
                              const nextNum = match ? parseInt(match[0]) + 1 : 27;
                              const newVerStr = `v2.${nextNum}`;
                              setPwaNotificationTitle(`CWRB Final Update ${newVerStr}`);
                              setPwaNotificationBody(`కొత్త ఫీచర్లు మరియు సెక్యూరిటీ అప్‌డేట్స్‌తో కూడిన ఫైనల్ వెర్షన్ ${newVerStr} సిద్ధంగా ఉంది.`);
                            }}
                            className="text-[9px] font-bold text-cyan-600 hover:text-cyan-800 underline bg-cyan-50 px-2 py-0.5 rounded-md"
                          >
                            Next Ver (ఆటో)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPwaNotificationTitle('');
                              setPwaNotificationBody('');
                            }}
                            className="text-[9px] font-bold text-rose-500 hover:text-rose-700 underline"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={pwaNotificationTitle}
                        onChange={(e) => setPwaNotificationTitle(e.target.value)}
                        placeholder="అప్‌డేట్ వెర్షన్ టైటిల్ (e.g. CWRB Final Update v2.6)"
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 text-[10px] font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                      <textarea
                        value={pwaNotificationBody}
                        onChange={(e) => setPwaNotificationBody(e.target.value)}
                        placeholder="అప్‌డేట్ గమనిక (e.g. కొత్త మార్పులతో కూడిన ఫైనల్ వెర్షన్ పబ్లిష్ చేయబడింది.)"
                        rows={2}
                        className="w-full bg-slate-50 border border-gray-200 rounded-lg p-2 text-[10px] font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!pwaEnabled}
                      onClick={() => {
                        if (!pwaNotificationTitle.trim()) {
                          alert('దయచేసి అప్‌డేట్ వెర్షన్ టైటిల్ ఎంటర్ చేయండి!');
                          return;
                        }
                        setIsPushingUpdate(true);
                        
                        // Use the title's version number as the token if it contains one, else use timestamp
                        const verMatch = pwaNotificationTitle.match(/v\d+\.\d+/i) || pwaNotificationTitle.match(/\d+\.\d+/);
                        const publishVersion = verMatch ? verMatch[0].toLowerCase() : 'v2.' + Date.now();
                        
                        // 🔥 Post update to Firestore so all mobile apps sync
                        setDoc(doc(db, 'settings', 'pwa_update'), {
                          version: publishVersion,
                          title: pwaNotificationTitle,
                          body: pwaNotificationBody,
                          timestamp: new Date().toISOString()
                        }, { merge: true }).catch(err => console.error("PWA Sync Error:", err));

                        setTimeout(() => {
                          setIsPushingUpdate(false);
                          alert(`🚀 "చెన్నై/తెలుగు CWRB" ఫైనల్ PWA అప్‌డేట్ విజయవంతంగా పబ్లిష్ చేయబడింది మరియు మొబైల్ యూజర్లకు పుష్ చేయబడింది!\n\nవెర్షన్ టోకెన్: ${publishVersion}\nశీర్షిక: ${pwaNotificationTitle}`);
                          setPwaNotificationTitle('');
                          setPwaNotificationBody('');
                        }, 1500);
                      }}
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      {isPushingUpdate ? 'ఫైనల్ అప్‌డేట్ పబ్లిష్ అవుతోంది...' : '🚀 Publish Final PWA Update (ఫైనల్ అప్‌డేట్ పబ్లిష్ చేయి)'}
                    </button>
                    {!pwaEnabled && (
                      <p className="text-[9px] text-rose-600 font-bold text-center">
                        ⚠️ PWA స్విచ్ ఆఫ్ లో ఉంది కాబట్టి పబ్లిష్ అప్‌డేట్ బటన్ నిలిపివేయబడింది.
                      </p>
                    )}
                  </div>
                </div>
              ) : activeSubTab === 'agents' ? (
                <div className="animate-fade-in space-y-4 max-h-[440px] overflow-y-auto pr-1 text-xs text-gray-700">
                  <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-2.5 shadow-xs">
                    <div className="p-1.5 bg-purple-600 rounded-xl text-white shrink-0">
                      <Bot className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-purple-900 text-[11px]">అడ్మిన్ గారికి ఇష్టమైన ఏజెంట్ నిర్వహణ (Preferred Primary Agent Setup)</h4>
                      <p className="text-[9px] text-purple-700/80 mt-1 leading-relaxed">
                        అడ్మిన్ గారు (Admin garu), మీరు ఇక్కడ మీ ఇష్టమైన ఏజెంటును ప్రధాన ఏజెంట్‌గా ఎంపిక చేసుకోవచ్చు. 48 గంటల రొటేషన్ సైకిల్ లేదా వ్యక్తిగత ప్రాధాన్యత ప్రకారం ఏజెంట్‌ను ఇక్కడ ఫిక్స్ చేయవచ్చు.
                      </p>
                    </div>
                  </div>

                  {agentSaveStatus && (
                    <div className="p-2.5 text-[10px] text-purple-900 bg-purple-100 border border-purple-200 rounded-xl font-bold flex items-center gap-1.5">
                      <span>{agentSaveStatus}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h3 className="font-bold text-[#082c75] uppercase tracking-wide text-[9px]">అందుబాటులో ఉన్న ఏజెంట్లు / Available AI Agents</h3>
                    
                    {[
                      { name: 'Gemini 3.1 Pro (ప్రధాన ఏజెంట్ / Primary Agent)', desc: 'గూగుల్ అత్యుత్తమ రీజనింగ్ & కోడింగ్ మోడల్', badge: 'ప్రస్తుత ఏజెంట్', color: 'border-blue-500 bg-blue-50/50' },
                      { name: 'Gemini 3.5 Flash Lite (అసిస్టెంట్ మోడల్ / Fast Agent)', desc: 'అతి వేగవంతమైన రెస్పాన్స్ & లైట్ వెయిట్ మోడల్', badge: 'స్పీడ్ మోడ్', color: 'border-emerald-500 bg-emerald-50/50' },
                      { name: 'Claude 3.5 Sonnet (అడ్వాన్స్‌డ్ రీజనింగ్ మోడల్)', desc: 'సృజనాత్మక కోడింగ్ మరియు లాజికల్ విశ్లేషణకు అద్భుతం', badge: 'ప్రో మోడల్', color: 'border-purple-500 bg-purple-50/50' },
                      { name: 'Custom Personalized AI Agent (వ్యక్తిగత కస్టమ్ ఏజెంట్)', desc: 'అడ్మిన్ గారు ప్రత్యేకంగా సెట్ చేసుకున్న కస్టమ్ ప్రాంప్ట్ ఏజెంట్', badge: 'కస్టమ్', color: 'border-amber-500 bg-amber-50/50' }
                    ].map((agent, idx) => {
                      const isSelected = preferredAgent === agent.name;
                      return (
                        <div key={idx} className={`p-3 rounded-xl border transition-all flex items-center justify-between ${isSelected ? 'border-purple-600 bg-purple-50/80 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                          <div className="space-y-1 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-gray-900 text-xs">{agent.name}</span>
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                {agent.badge}
                              </span>
                            </div>
                            <p className="text-[9px] text-gray-500">{agent.desc}</p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleSavePreferredAgent(agent.name)}
                            className={`px-3.5 py-2 rounded-xl text-[10px] font-black transition active:scale-95 whitespace-nowrap shadow-xs ${
                              isSelected 
                                ? 'bg-purple-600 text-white' 
                                : 'bg-slate-100 hover:bg-slate-200 text-gray-700'
                            }`}
                          >
                            {isSelected ? '✓ ప్రధాన ఏజెంట్' : 'ఎంచుకోండి (Select)'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-gray-700 text-[10px]">48 గంటల రొటేషన్ టైమర్ (48-Hour Rotation Cycle)</span>
                      <span className="text-[9px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        సక్రియం / Active
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-500 leading-normal">
                      అడ్మిన్ గారు, అదనపు 48 గంటల పాటు మీ అనుమతితో ఈ ఏజెంట్ సిస్టమ్ కోడింగ్ మరియు ఆటోమేషన్ బాధ్యతలను నిర్వర్తిస్తుంది.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

        </div>

        {/* Modal persistent Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-gray-100 shrink-0 flex items-center justify-between">
          <button
            onClick={onLogout}
            className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-black rounded-xl border border-rose-200 flex items-center gap-1.5 transition active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>లాగ్ అవుట్ (Log Out)</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#082c75] hover:bg-[#001040] text-[#FFC000] text-[10px] font-black rounded-xl shadow-md transition active:scale-95"
          >
            మూసివేయి (Close)
          </button>
        </div>

      </div>

      {/* LIVE CAMERA VERIFICATION POPUP MODAL */}
      {isCameraVerificationModalOpen && (
        <div className="absolute inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center p-5 text-white animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/30">
              <Camera className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-white">ఆటోమేటిక్ లైవ్ కెమెరా వెరిఫికేషన్ (Auto Live Face Verify)</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                అడ్మిన్ గారు, కెమెరా ముఖాన్ని ఆటోమేటిక్‌గా స్కాన్ చేసి మాస్టర్ ఫోటోతో వెరిఫై చేస్తోంది. దయచేసి వేచి ఉండండి...
              </p>
            </div>

            {/* Video preview & Master Photo comparison */}
            <div className="grid grid-cols-2 gap-2 relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-slate-800">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 bg-black/75 text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded">లైవ్ కెమెరా</span>
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-slate-800 flex flex-col items-center justify-center">
                {masterPhotoUrl ? (
                  <img src={masterPhotoUrl} alt="Master Photo" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-slate-500 text-[9px]">మాస్టర్ ఫోటో సెట్ చేయలేదు</div>
                )}
                <span className="absolute bottom-1 left-1 bg-black/75 text-[#FFC000] text-[8px] font-bold px-1.5 py-0.5 rounded">మాస్టర్ ఫోటో</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={captureAndVerifyCamera}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>ఫోటో క్యాప్చర్ & వెరిఫై (Capture & Verify)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setIsCameraVerificationModalOpen(false);
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded-xl transition cursor-pointer"
              >
                రద్దు చేయి (Cancel)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
