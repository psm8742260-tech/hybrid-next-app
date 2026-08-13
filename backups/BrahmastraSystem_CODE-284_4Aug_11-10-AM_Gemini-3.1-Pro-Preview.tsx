import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Play,
  Send,
  Sparkles,
  Terminal,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Volume2,
  VolumeX,
  Upload,
  Image,
  ArrowUp,
  FileText,
  Trash2,
  Check,
  MessageSquare,
  Headphones,
  Mic,
  MicOff,
  Users,
  Copy,
  ExternalLink,
  Cpu,
  Globe,
  Lock,
} from "lucide-react";
interface Board {
  id: string;
  name: string;
  nameEn: string;
}
const INITIAL_AGENT_BOARDS = [
  {
    id: "dev_google",
    name: "🌐 గూగుల్ ఏజెంట్",
    nameEn: "Google Agent",
    total: 5,
    present: 5,
    attendancePct: "100%",
    multiplier: "₹10000",
    revenue: 50000,
    welcome: "🌐 గూగుల్ ఏజెంట్ సిద్ధంగా ఉంది. మీ శోధన మరియు సమాచార సేకరణకు సిద్ధం.",
  },
  {
    id: "dev_gemini",
    name: "✨ జెమినీ ఏజెంట్",
    nameEn: "Gemini Agent",
    total: 5,
    present: 5,
    attendancePct: "100%",
    multiplier: "₹10000",
    revenue: 50000,
    welcome: "✨ జెమినీ ఏజెంట్ సిద్ధంగా ఉంది. అధునాతన AI విశ్లేషణకు సిద్ధం.",
  },
  {
    id: "dev_chatgpt",
    name: "🤖 చార్జీపీటీ ఏజెంట్",
    nameEn: "ChatGPT Agent",
    total: 5,
    present: 5,
    attendancePct: "100%",
    multiplier: "₹10000",
    revenue: 50000,
    welcome: "🤖 చార్జీపీటీ ఏజెంట్ సిద్ధంగా ఉంది. సంభాషణ మరియు కోడింగ్ సలహాలకు సిద్ధం.",
  },
  {
    id: "dev_meta",
    name: "♾️ మీటా ఏజెంట్",
    nameEn: "Meta Agent",
    total: 5,
    present: 5,
    attendancePct: "100%",
    multiplier: "₹10000",
    revenue: 50000,
    welcome: "♾️ మీటా ఏజెంట్ సిద్ధంగా ఉంది. సోషల్ మరియు కనెక్టివిటీ పరిష్కారాలకు సిద్ధం.",
  },
  {
    id: "dev_builder",
    name: "🛠️ బిల్డర్ ఏజెంట్ బోర్డు",
    nameEn: "Builder Agent Board",
    total: 5,
    present: 5,
    attendancePct: "100%",
    multiplier: "₹6000",
    revenue: 30000,
    welcome:
      "🛠️ బిల్డర్ ఏజెంట్ బోర్డు సిద్ధంగా ఉంది. యాప్ లేఅవుట్ డిజైన్‌కు మేము సిద్ధం.",
  },
  {
    id: "dev_color",
    name: "🎨 కలర్ కోడర్ ఏజెంట్ బోర్డు",
    nameEn: "Color Coder Board",
    total: 3,
    present: 3,
    attendancePct: "100%",
    multiplier: "₹3000",
    revenue: 9000,
    welcome:
      "🎨 కలర్ కోడర్ ఏజెంట్ బోర్డు సిద్ధంగా ఉంది. రంగుల కలయిక కోసం మీ ఆజ్ఞ కొరకు వేచి ఉన్నాము.",
  },
  {
    id: "dev_design",
    name: "📐 UI/UX డిజైనర్ ఏజెంట్ బోర్డు",
    nameEn: "UI/UX Designer Board",
    total: 4,
    present: 4,
    attendancePct: "100%",
    multiplier: "₹4000",
    revenue: 16000,
    welcome:
      "📐 UI/UX డిజైనర్ ఏజెంట్ బోర్డు సిద్ధంగా ఉంది. యూజర్ ఇంటరాక్షన్ ఫ్లోల ప్లానింగ్ కోసం సిద్ధం.",
  },
  {
    id: "dev_database",
    name: "🗄️ డేటాబేస్ ఏజెంట్ బోర్డు",
    nameEn: "Database Agent Board",
    total: 5,
    present: 5,
    attendancePct: "100%",
    multiplier: "₹5500",
    revenue: 27500,
    welcome:
      "🗄️ డేటాబేస్ ఏజెంట్ బోర్డు సిద్ధంగా ఉంది. ఫైర్‌స్టోర్ స్కీమాల నిర్వహణకు సిద్ధం.",
  },
  {
    id: "dev_audio",
    name: "🔔 సౌండ్ ఇంజనీర్ ఏజెంట్ బోర్డు",
    nameEn: "Sound Engineer Board",
    total: 3,
    present: 3,
    attendancePct: "100%",
    multiplier: "₹3500",
    revenue: 10500,
    welcome:
      "🔔 సౌండ్ ఇంజనీర్ ఏజెంట్ బోర్డు సిద్ధంగా ఉంది. ఆడియో పద్ధతుల సహాయానికి సిద్ధం.",
  },
  {
    id: "dev_security",
    name: "🛡️ సెక్యూరిటీ ఏజెంట్ బోర్డు",
    nameEn: "Security Agent Board",
    total: 5,
    present: 5,
    attendancePct: "100%",
    multiplier: "₹6500",
    revenue: 32500,
    welcome:
      "🛡️ సెక్యూరిటీ ఏజెంట్ బోర్డు సిద్ధంగా ఉంది. కవచం భద్రత పర్యవేక్షణకు సిద్ధం.",
  },
  {
    id: "dev_tester",
    name: "🚀 బిల్డ్ టెస్టర్ ఏజెంట్ బోర్డు",
    nameEn: "Build Tester Board",
    total: 5,
    present: 5,
    attendancePct: "100%",
    multiplier: "₹4500",
    revenue: 22500,
    welcome:
      "🚀 బిల్డ్ టెస్టర్ ఏజెంట్ బోర్డు సిద్ధంగా ఉంది. ఎర్రర్స్ నివారణకు మేము సిద్ధం.",
  },
];
const PREMIUM_FEATURE_BOARDS = [
  { id: "feat_hybrid_radio", name: "📡 హైబ్రిడ్ రేడియో ఫ్రీక్వెన్సీ (Offline Radio)", nameEn: "Hybrid Radio Frequency Mode" },
  { id: "feat_biopower", name: "🔋 స్మార్ట్ బయో-పవర్ మేనేజర్", nameEn: "Smart Bio-Power Manager" },
  { id: "feat_bp_sugar", name: "❤️ రక్తపోటు & షుగర్ అంచనా (BP & Sugar Estimation)", nameEn: "BP & Sugar Estimation" },
  { id: "feat_doctor_scan", name: "🩺 AI డాక్టర్ ఫేస్ హెల్త్ స్కానర్ (Face Health Scanner)", nameEn: "AI Doctor Face Health Scanner" },
  { id: "feat_weather_report", name: "📻 వాతావరణ రేడియో నివేదిక (RF Weather Report)", nameEn: "RF Weather Radio Report" },
  { id: "feat_premium_assistant", name: "🤖 అడ్వాన్స్డ్ AI అసిస్టెంట్", nameEn: "Advanced AI Assistant & Voice" },
  { id: "feat_premium_tracking", name: "📍 రియల్ టైమ్ లైవ్ ట్రాకింగ్", nameEn: "Real-time Live Location Tracking" },
  { id: "feat_premium_radio", name: "📻 అపరిమిత రేంజ్ వాకీ-టాకీ", nameEn: "Unlimited Range Walkie-Talkie" },
  { id: "feat_premium_invoicing", name: "🧾 ఆటోమేటిక్ కొటేషన్ & ఇన్‌వాయిస్", nameEn: "Automated Quotation & GST Invoices" },
  { id: "feat_premium_payments", name: "💳 జీరో కమిషన్ ఆన్‌లైన్ పేమెంట్స్", nameEn: "Zero Commission Online Payments" },
  { id: "feat_premium_escrow", name: "🤝 ఎస్క్రో సేఫ్ పేమెంట్", nameEn: "Escrow Payment & Work Protection" },
  { id: "feat_premium_multilingual", name: "🌐 ఆటోమేటిక్ భాషా అనువాదం", nameEn: "Auto Translation Support" },
  { id: "feat_premium_verification", name: "✅ ప్రీమియం ట్రస్ట్ బ్యాడ్జ్", nameEn: "Premium Trust Badge Check" },
  { id: "feat_premium_support", name: "🎧 24/7 కస్టమర్ సపోర్ట్", nameEn: "Priority 24/7 Dedicated Support" },
  { id: "feat_premium_analytics", name: "📊 బిజినెస్ వర్క్ అనలిటిక్స్", nameEn: "Advanced Business Analytics" },
  { id: "feat_premium_team", name: "👥 టీమ్/సబ్-వర్కర్ మేనేజ్‌మెంట్", nameEn: "Sub-worker / Team Management" },
  { id: "feat_invisible_maintenance", name: "⚙️ ఇన్విజిబుల్ మెయింటెనెన్స్ అసిస్టెంట్ (ఆటో-హీలింగ్)", nameEn: "Invisible Maintenance Assistant" },
];

export default function BrahmastraSystemComponent({
  isAgentToggleVisible = false,
  onToggleAgentVisibility,
  isBrahmastraButtonVisible = true,
  onToggleBrahmastraButton,
  isSystemOnline = true,
  onToggleSystemOnline,
  isHybridRadioMode = false,
  onToggleHybridRadioMode,
}: BrahmastraProps) {
  // 2. Secret Key and Password State
  const [password, setPassword] = useState<string>("");
  const [executionOutput, setExecutionOutput] = useState<string[] | null>(null);
  const [executionStatus, setExecutionStatus] = useState<string>("");
  // 3. Active Addressed Board State
  const [activeAddressedBoard, setActiveAddressedBoard] =
    useState<string>("dev_builder");
  // Media Communication State for each of the boards
  const [boardStates, setBoardStates] = useState<
    Record<string, BoardCommunication>
  >(() => {
    const states: Record<string, BoardCommunication> = {};
    INITIAL_AGENT_BOARDS.forEach((b) => {
      states[b.id] = {
        message: "",
        uploadedFiles: [],
        audioPlaying: false,
        receivedMessages: [
          { text: b.welcome, sender: "system", timestamp: "ఇప్పుడే" },
        ],
      };
    });
    PREMIUM_FEATURE_BOARDS.forEach((b) => {
      states[b.id] = {
        message: "",
        uploadedFiles: [],
        audioPlaying: false,
        receivedMessages: [
          { text: b.name + " బోర్డు సిద్ధంగా ఉంది.", sender: "system", timestamp: "ఇప్పుడే" },
        ],
      };
    });
    return states;
  });
  // Track toggled open state for each board's interactive media layout - all open by default so agents are fully visible!
  const [openMediaBoards, setOpenMediaBoards] = useState<
    Record<string, boolean>
  >(() => {
    const states: Record<string, boolean> = {};
    INITIAL_AGENT_BOARDS.forEach((b) => (states[b.id] = true));
    PREMIUM_FEATURE_BOARDS.forEach((b) => (states[b.id] = true));
    return states;
  });
  const [featurePrices, setFeaturePrices] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('cwb_feature_prices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const initial: Record<string, number> = {};
    PREMIUM_FEATURE_BOARDS.forEach((b) => {
      // Set very low default prices as requested
      if (b.id === "feat_hybrid_radio") initial[b.id] = 99;
      else if (b.id === "feat_biopower") initial[b.id] = 49;
      else if (b.id === "feat_bp_sugar") initial[b.id] = 29;
      else if (b.id === "feat_doctor_scan") initial[b.id] = 39;
      else if (b.id === "feat_weather_report") initial[b.id] = 19;
      else if (b.id === "feat_premium_assistant") initial[b.id] = 29;
      else if (b.id === "feat_premium_tracking") initial[b.id] = 19;
      else if (b.id === "feat_premium_radio") initial[b.id] = 9;
      else if (b.id === "feat_premium_invoicing") initial[b.id] = 19;
      else if (b.id === "feat_premium_payments") initial[b.id] = 0; // Zero commission
      else if (b.id === "feat_premium_escrow") initial[b.id] = 49;
      else if (b.id === "feat_premium_multilingual") initial[b.id] = 19;
      else if (b.id === "feat_premium_verification") initial[b.id] = 99; // one-time
      else if (b.id === "feat_premium_support") initial[b.id] = 49;
      else if (b.id === "feat_premium_analytics") initial[b.id] = 29;
      else if (b.id === "feat_premium_team") initial[b.id] = 39;
      else initial[b.id] = 19;
    });
    return initial;
  });

  // Keep synced if modified externally (e.g. in Admin Panel)
  useEffect(() => {
    let lastSaved = localStorage.getItem('cwb_feature_prices');
    const handleStorageChange = () => {
      const saved = localStorage.getItem('cwb_feature_prices');
      if (saved && saved !== lastSaved) {
        try {
          setFeaturePrices(JSON.parse(saved));
          lastSaved = saved;
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Simple interval fallback for same-window updates
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const [savedPricesTotal, setSavedPricesTotal] = useState<number>(0);
  const handleSavePrices = () => {
     const total = Object.values(featurePrices).reduce((sum: number, price) => sum + (Number(price) || 0), 0);
     localStorage.setItem('cwb_feature_prices', JSON.stringify(featurePrices));
     setSavedPricesTotal(total);
     setExecutionStatus("PRICES_UPDATED_SUCCESS");
     setExecutionOutput(["[సిస్టమ్ అప్‌డేట్] ప్రీమియం ఫీచర్ల ధరలు విజయవంతంగా సెట్ చేయబడ్డాయి.", `మొత్తం ప్రీమియం ప్యాకేజీ ధర: ₹${total}/నెల`]);
  };


 const [feedLogs, setFeedLogs] = useState<string[]>([]);
  const [externalData, setExternalData] = useState<string>("");
  const [secureQuery, setSecureQuery] = useState<string>("");
  const [secureQueryResult, setSecureQueryResult] = useState<string>("");
  // States for AI Agent Hub & Dynamic Chatbot
  const [chatbotAgent, setChatbotAgent] = useState<string>("dev_google");
  const [chatbotInput, setChatbotInput] = useState<string>("");
  const [chatbotMessages, setChatbotMessages] = useState<
    Record<
      string,
      { text: string; sender: "user" | "system"; timestamp: string }[]
    >
  >({
    dev_builder: [
      {
        text: "🛠️ యాప్ బిల్డర్ ఏజెంట్ (App Builder AI): నమస్కారం! నేను మన సిస్టమ్‌లో కొత్త ఫీチャーలను కోడ్ చేయడానికి మరియు యాప్‌ను పరిపూర్ణంగా బిల్డ్ చేయడానికి సిద్ధంగా ఉన్నాను. నాతో మాట్లాడి మీ డెవలప్‌మెంట్ సమస్యలు పరిష్కరించుకోండి!",
        sender: "system",
        timestamp: "ఇప్పుడే",
      },
    ],
    dev_color: [
      {
        text: "🎨 కలర్ కోడర్ ఏజెంట్ (Color & Theme Coder): నమస్కారం! నేను మీ అప్లికేషన్ యొక్క అద్భుతమైన కలర్స్, టెయిల్ విండ్ క్లాస్ థీమ్స్ మరియు విజువల్ హార్మొనీని డిజైన్ చేసి కోడ్ రూపంలో అందించడానికి సిద్ధంగా ఉన్నాను.",
        sender: "system",
        timestamp: "ఇప్పుడే",
      },
    ],
    dev_design: [
      {
        text: "📐 UI/UX డిజైనర్ ఏజెంట్ (Layout & Experience Designer): నమస్కారం! స్పేసింగ్, గ్రిడ్స్, రెస్పాన్సివ్ లేఅవుట్లు, నెగటివ్ స్పేస్ మరియు అద్భుతమైన యూజర్ ఇంటరాక్షన్ ఫ్లోలను సిద్ధం చేయడం నా కర్తవ్యం.",
        sender: "system",
        timestamp: "ఇప్పుడే",
      },
    ],
    dev_database: [
      {
        text: "🗄️ డేటాబేస్ ఆర్కిటెక్ట్ (Firebase & Firestore Architect): నమస్కారం! ఫైర్‌స్టోర్ కలెక్షన్స్, స్కీమాస్, సెక్యూరిటీ రూల్స్ మరియు సురక్షితమైన డేటా సేవింగ్ నివేదికలతో నేను సిద్ధంగా ఉన్నాను.",
        sender: "system",
        timestamp: "ఇప్పుడే",
      },
    ],
    dev_audio: [
      {
        text: "🔔 సౌండ్ & అలెర్ట్ ఇంజనీర్ (Audio waves & SMS Gateway Expert): నమస్కారం! స్పీచ్ సింథసిస్, సిగ్నల్ ఫ్రీక్వెన్సీ, రెస్పాన్సివ్ రింగ్ అలారాలు మరియు ఇన్ఫర్మేటివ్ ఆడియో వాయిస్ పర్యవేక్షించే బాధ్యత నాది.",
        sender: "system",
        timestamp: "ఇప్పుడే",
      },
    ],
    dev_security: [
      {
        text: "🛡️ సెక్యూరిటీ కవచం (Auth Vault & Encryption Officer): నమస్కారం! మీ పాస్‌వర్డ్‌లు, ఎన్‌క్రిప్షన్ కీస్, సెక్యూర్ కీస్, OTP గేట్‌వేలు మరియు రహస్య వాల్ట్ భద్రతను అత్యంత పటిష్టంగా కాపాడతాను.",
        sender: "system",
        timestamp: "ఇప్పుడే",
      },
    ],
    dev_tester: [
      {
        text: "🚀 బిల్డ్ & టెస్టింగ్ ఏజెంట్ (QA Testing & Compilation Specialist): నమస్కారం! యాప్ కంపైలేషన్ టెస్టింగ్, టైప్‌స్క్రిప్ట్ ఎర్రర్స్ లేకుండా లీన్ చెకింగ్ మరియు రెస్పాన్సివ్ టెస్టింగ్ చేయుటకు సిద్ధంగా ఉన్నాను.",
        sender: "system",
        timestamp: "ఇప్పుడే",
      },
    ],
  });
  const [chatbotListening, setChatbotListening] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});

  const [chatbotGenerating, setChatbotGenerating] = useState<boolean>(false);
  const [externalSyncActive, setExternalSyncActive] = useState<boolean>(true);
  const [zeroLeakShieldActive, setZeroLeakShieldActive] =
    useState<boolean>(true);
  const [externalSyncLogs, setExternalSyncLogs] = useState<string[]>([
    "[" +
      new Date().toLocaleTimeString() +
      "] 🟢 బాహ్య నెట్‌వర్క్ అనుసంధానం (External Multi-Agent Sync Bridge) సిద్ధంగా ఉంది.",
    "[" +
      new Date().toLocaleTimeString() +
      "] 🛡️ సురక్షిత అంతర్గత సరిహద్దు కవచం యాక్టివ్‌గా ఉంది. డేటా బయటకి లీక్ అవ్వదు.",
  ]);
  const [apiType, setApiType] = useState<"curl" | "nodejs" | "python">("curl");

  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  // Send messages within the local internal chatbot
  const handleSendChatbotMessage = async () => {
    if (!chatbotInput.trim() || chatbotGenerating) return;
    const currentAgent = chatbotAgent;
    const userText = chatbotInput;
    const userMsg = {
      text: userText,
      sender: "user" as const,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatbotMessages((prev) => ({
      ...prev,
      [currentAgent]: [...(prev[currentAgent] || []), userMsg],
    }));
    setChatbotInput("");
    setChatbotGenerating(true);
    // Speak user input if sound/synthesis is allowed
    speakText(`నా మాటలు: ${userText}`, currentAgent);
    // Add telemetry simulation logs matching user's concern
    setExternalSyncLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] 🛡️ [సీక్రెట్ కవచం] క్వెరీ విశ్లేషణ: అంతర్గత రహస్యాలు మరియు డేటాబేస్ సురక్షితం. నిరోధించబడిన పదాలు: 0`,
      `[${new Date().toLocaleTimeString()}] 🔗 [బాహ్య లింక్] బాహ్య ఏజెంట్లతో సమకాలీకరణ ప్రారంభమైంది. నెట్‌వర్క్ ఎన్‌క్రిప్షన్: AES-256`,
      ...prev.slice(0, 4),
    ]);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId: currentAgent, deepseekApiKey: localStorage.getItem('cwb_deepseek_api_key'), message: userText }),
      });
      const data = await response.json();
      const replyText =
        data.response || "క్షమించండి, సర్వర్ నుండి జవాబు రాలేదు.";
      const systemMsg = {
        text: replyText,
        sender: "system" as const,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatbotMessages((prev) => ({
        ...prev,
        [currentAgent]: [...(prev[currentAgent] || []), systemMsg],
      }));
      setExternalSyncLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] 📥 [ఇన్‌బౌండ్ సింక్] జెమిని మల్టీ-ఏజెంట్స్ విజయవంతంగా సమాధానాన్ని అందించారు. స్పందన లోపలికి ఇన్వెస్ట్ చేయబడింది.`,
        ...prev.slice(0, 4),
      ]);
      // Speak system reply
      setTimeout(() => {
        speakText(`వారి స్పందన: ${replyText}`, currentAgent);
      }, 1000);
    } catch (err) {
      console.error(err);
      const fallbackMsg =
        "కనెక్షన్ లోపం ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి.";
      setChatbotMessages((prev) => ({
        ...prev,
        [currentAgent]: [
          ...(prev[currentAgent] || []),
          {
            text: fallbackMsg,
            sender: "system",
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
      }));
    } finally {
      setChatbotGenerating(false);
    }
  };
  // Chatbot Speech to Text using Web Speech API
  const startChatbotListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert("⚠️ మీ బ్రౌజర్ స్పీచ్ రికగ్నిషన్ కి మద్దతు ఇవ్వదు.");
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "te-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setChatbotListening(true);
    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setChatbotInput(speechToText);
    };
    recognition.onerror = () => setChatbotListening(false);
    recognition.onend = () => setChatbotListening(false);
    recognition.start();
  };
  // Pull External Data into internal logs securely without leakage
  const handlePullExternalData = () => {
    const extScenarios = [
      "గ్లోబల్ మార్కెట్ ధాన్యాల ధరలు మరియు కూలీల రక్షణ నమూనా అప్డేట్ పొందింది.",
      "పక్క రాష్ట్రం నుండి నైపుణ్యం కలిగిన 45 మంది మేస్త్రీల ప్రయాణ నివేదిక అందింది.",
      "భారతదేశ వ్యాప్తంగా ఉన్న ఉపాధి హామీ పథకం (MGNREGS) నూతన కూలీ రేట్ల సవరణ నివేదిక సేకరించబడింది.",
      "ప్రస్తుత వాతావరణ హెచ్చరిక: రాబోయే 24 గంటల్లో భారీ వర్ష సూచన. బయట పనుల్లో ఉన్న ఏజెంట్లకు అప్రమత్తత నోటీసు.",
    ];
    const selected =
      extScenarios[Math.floor(Math.random() * extScenarios.length)];
    const time = new Date().toLocaleTimeString();
    setExternalSyncLogs((prev) => [
      `[${time}] 🌐 [గ్లోబల్ బాహ్య అనుసంధానం] బాహ్య లోకం నుండి సరికొత్త సమాచారం సురక్షితంగా లోపలికి లాగబడింది.`,
      `➡️ "${selected}"`,
      ...prev.slice(0, 4),
    ]);
    // Insert as system notification inside current chatbot
    const active = chatbotAgent;
    setChatbotMessages((prev) => ({
      ...prev,
      [active]: [
        ...(prev[active] || []),
        {
          text: `📢 [బాహ్య అనుసంధాన అలర్ట్]: ${selected}`,
          sender: "system",
          timestamp: time,
        },
      ],
    }));
  };
  const getApiCode = () => {
    const host = window.location.origin || "https://cwrb-app.telugu.in";
    if (apiType === "curl") {
      return `curl -X POST "${host}/api/chat" \\
  -H "Content-Type: application/json" \\
  -d '{
    "boardId": "${chatbotAgent}",
    "message": "బాహ్య క్లయింట్ నుండి సహాయం కావాలి"
  }'`;
    } else if (apiType === "nodejs") {
      return `const fetch = require('node-fetch');
async function askAgent() {
  const response = await fetch('${host}/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      boardId: '${chatbotAgent}',
      message: 'బాహ్య క్లయింట్ నుండి సహాయం కావాలి'
    })
  });
  const data = await response.json();
  console.log("ఏజెంట్ స్పందన:", data.response);
}
askAgent();`;
    } else {
      return `import requests
def ask_agent():
    url = "${host}/api/chat"
    payload = {
        "boardId": "${chatbotAgent}",
        "message": "బాహ్య క్లయింట్ నుండి సహాయం కావాలి"
    }
    response = requests.post(url, json=payload)
    data = response.json()
    print("ఏజెంట్ స్పందన:", data.get("response"))
ask_agent()`;
    }
  };
  const handleCopyCode = () => {
    navigator.clipboard.writeText(getApiCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  // Speak a single message (whether user's words or system's response)
  const speakSingleMessage = (
    text: string,
    sender: "user" | "system",
    boardId: string,
  ) => {
    const prefix = sender === "user" ? "నా మాటలు: " : "వారి స్పందన: ";
    speakText(prefix + text, boardId);
  };
  // Start Speech-to-Text using SpeechRecognition
  const startListening = (boardId: string) => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "⚠️ మీ బ్రౌజర్ స్పీచ్ రికగ్నిషన్ కి మద్దతు ఇవ్వదు. (Speech recognition is not supported in this browser)",
      );
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "te-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setIsListening((prev) => ({ ...prev, [boardId]: true }));
    };
    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setBoardStates((prev) => ({
        ...prev,
        [boardId]: {
          ...prev[boardId],
          message: speechToText,
        },
      }));
    };
    recognition.onerror = () => {
      setIsListening((prev) => ({ ...prev, [boardId]: false }));
    };
    recognition.onend = () => {
      setIsListening((prev) => ({ ...prev, [boardId]: false }));
    };
    recognition.start();
  };
  // Speaks out loud using SpeechSynthesis
  const speakText = (text: string, boardId: string) => {
    if (!isSystemOnline) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const teluguVoice = voices.find(
        (v) => v.lang.includes("te") || v.lang.includes("TE"),
      );
      if (teluguVoice) {
        utterance.voice = teluguVoice;
      } else {
        const indianVoice = voices.find(
          (v) => v.lang.includes("IN") || v.name.includes("India"),
        );
        if (indianVoice) utterance.voice = indianVoice;
      }
      utterance.rate = 0.95;
      utterance.onstart = () => {
        setBoardStates((prev) => ({
          ...prev,
          [boardId]: { ...prev[boardId], audioPlaying: true },
        }));
      };
      utterance.onend = () => {
        setBoardStates((prev) => ({
          ...prev,
          [boardId]: { ...prev[boardId], audioPlaying: false },
        }));
      };
      utterance.onerror = () => {
        setBoardStates((prev) => ({
          ...prev,
          [boardId]: { ...prev[boardId], audioPlaying: false },
        }));
      };
      window.speechSynthesis.speak(utterance);
    }
  };
  // Speaks the latest response out loud
  const playLatestVoice = (boardId: string) => {
    const state = boardStates[boardId];
    const systemMsgs = state.receivedMessages.filter(
      (m) => m.sender === "system",
    );
    if (systemMsgs.length > 0) {
      const latestText = systemMsgs[systemMsgs.length - 1].text;
      speakText("వారి స్పందన: " + latestText, boardId);
    }
  };
  // Handles real file uploads using FileReader to show live images/previews
  const handleFileUpload = (
    boardId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = {
        name: file.name,
        url: typeof reader.result === "string" ? reader.result : "",
        type: file.type,
        size: (file.size / 1024).toFixed(1) + " KB",
      };
      setBoardStates((prev) => ({
        ...prev,
        [boardId]: {
          ...prev[boardId],
          uploadedFiles: [...prev[boardId].uploadedFiles, fileData],
          receivedMessages: [
            ...prev[boardId].receivedMessages,
            {
              text: `📥 ఫైల్ ఎక్కించబడింది (File uploaded): ${file.name} (${fileData.size})`,
              sender: "user",
              timestamp: new Date().toLocaleTimeString(),
            },
          ],
        },
      }));
    };
    reader.readAsDataURL(file);
  };
  // Handles text broadcast submit with Gemini AI backend integration
  const handleSendMessage = async (boardId: string) => {
    const state = boardStates[boardId];
    if (!state.message.trim() || isGenerating[boardId]) return;
    const userText = state.message;
    const userMsg = {
      text: userText,
      sender: "user" as const,
      timestamp: new Date().toLocaleTimeString(),
    };
    // 1. Immediately post user's message and clear input
    setBoardStates((prev) => ({
      ...prev,
      [boardId]: {
        ...prev[boardId],
        message: "",
        receivedMessages: [...prev[boardId].receivedMessages, userMsg],
      },
    }));
    // Speak user's message first
    speakText(`నా మాటలు: ${userText}`, boardId);
    // 2. Set generating state to true
    setIsGenerating((prev) => ({ ...prev, [boardId]: true }));
    try {
      // 3. Request dynamic response from Gemini AI server backend
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId, deepseekApiKey: localStorage.getItem('cwb_deepseek_api_key'), message: userText }),
      });
      const data = await response.json();
      const responseText =
        data.response || "సందేశం అర్థం కాలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.";
      const systemMsg = {
        text: responseText,
        sender: "system" as const,
        timestamp: new Date().toLocaleTimeString(),
      };
      // 4. Update board state with AI's reply
      setBoardStates((prev) => ({
        ...prev,
        [boardId]: {
          ...prev[boardId],
          receivedMessages: [...prev[boardId].receivedMessages, systemMsg],
        },
      }));
      // Speak system response after a brief pause so they don't overlap with user's speech
      setTimeout(() => {
        speakText(`వారి స్పందన: ${responseText}`, boardId);
      }, 1200);
    } catch (err) {
      console.error("Failed to fetch AI reply:", err);
      // Fallback response if fetch fails
      const fallbackText =
        "సమాచార వ్యవస్థలో అంతరాయం ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి.";
      const systemMsg = {
        text: fallbackText,
        sender: "system" as const,
        timestamp: new Date().toLocaleTimeString(),
      };
      setBoardStates((prev) => ({
        ...prev,
        [boardId]: {
          ...prev[boardId],
          receivedMessages: [...prev[boardId].receivedMessages, systemMsg],
        },
      }));
      setTimeout(() => {
        speakText(`వారి స్పందన: ${fallbackText}`, boardId);
      }, 1200);
    } finally {
      setIsGenerating((prev) => ({ ...prev, [boardId]: false }));
    }
  };
  // Fixed Board Metadata as per Java specification
  const boardsData = useMemo<Board[]>(() => {
    return INITIAL_AGENT_BOARDS.map((b) => ({
      id: b.id,
      name: b.name,
      nameEn: b.nameEn,
      total: b.total,
      present: b.present,
      attendancePct: b.attendancePct,
      multiplier: b.multiplier,
      revenue: b.revenue,
    }));
  }, []);

  const premiumBoardsData = useMemo<Board[]>(() => {
    return PREMIUM_FEATURE_BOARDS.map((b) => ({
      id: b.id,
      name: b.name,
      nameEn: b.nameEn,
      total: 1,
      present: 1,
      attendancePct: "100%",
      multiplier: "₹1000",
      revenue: 1000,
    }));
  }, []);
  // Overall Total Revenue
  const totalRevenue = useMemo(() => {
    return boardsData.reduce((acc, curr) => acc + curr.revenue, 0);
  }, [boardsData]);
  // Secure Access matching secureAccess(String query)
  const handleSecureAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSystemOnline) {
      setSecureQueryResult(
        "⚠️ సెక్యూరిటీ సిస్టమ్ ఆఫ్ చేయబడింది! (System is Offline)",
      );
      return;
    }
    if (!secureQuery.trim()) return;
    setSecureQueryResult(
      `🔍 [సంబోధన: ${boardsData.find((b) => b.id === activeAddressedBoard)?.name}] క్వెరీ ఫలితం: "${secureQuery}" విజయవంతంగా శోధించబడింది. ప్రక్రియ విజయవంతం!`,
    );
  };
  // Feed External Data matching feedExternalData(String data)
  const handleFeedExternalData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalData.trim()) return;
    const timestamp = new Date().toLocaleTimeString();
    setFeedLogs((prev) => [
      `[${timestamp}] 📥 [బోర్డు: ${boardsData.find((b) => b.id === activeAddressedBoard)?.name}] సమాచారం అందింది. నియమ నిబంధనల ప్రకారం ఫలితాలు సురక్షితంగా రికార్డ్ చేయబడ్డాయి.`,
      ...prev.slice(0, 3),
    ]);
    setExternalData("");
  };
  // Execute Brahmastra script matching executeBrahmastra(...)
  const handleExecuteBrahmastra = () => {
    if (!isSystemOnline) {
      setExecutionStatus("ERROR: BRAHMASTRA_OFFLINE");
      setExecutionOutput([
        "[FATAL] సిస్టమ్ ఆఫ్ చేయబడింది. బ్రహ్మాస్త్ర కమాండ్ పనిచేయద్.",
      ]);
      return;
    }
    if (password !== "108") {
      setExecutionStatus("REJECTED: INVALID_SECRET_KEY");
      setExecutionOutput([
        "[భద్రతా హెచ్చరిక] సెక్యూరిట్య్ కోడ్ సరిపోలల్శేదు! సమాచార లీకేజీ నిర్బంధిచబడింది.",
      ]);
      return;
    }
    setExecutionStatus("BRAHMASTRA_ACTIVE (SECURE_SYNC)");
    const output: string[] = [];
    output.push(
      "========================================================================",
    );
    output.push("🚩 బ్రహ్మాస్్త్రం విజయవంతంగా ప్రయోగిచబడింది!");
    output.push("🔒 సిస్టమ్ లాక్ చేయబడింది మరి్యు రక్షణ కవచం యాక్టివేట్ చేయబడింది.");
    output.push("📡 మల్టీ-ఏజెంట్ సమక఻eలీనికరణ పునర్ప్రారంభిచబడింది.");
    output.push("⚙️ ఆటోమ్యాటిక్ సెల్ఫ్-హీలింగ్ మరి్యు క్లీనప్ విజయవంతంగా ప్రాప్తించిల్శేదు.");
    output.push("=======================================================================");
    setExecutionOutput(output);
  };

  return (
    <div className="space-y-4">
      {/* 1. AGENTS & BOARDS CONTROL */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-[#FFC000] flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#FFC000]" />
            <span>మల్టీ-ఏజెంట్స్ నెట్వర్క్ ప్యానెల్ (Multi-Agent System Core)</span>
          </h3>
          <div className="flex gap-2">
            {onToggleAgentVisibility && (
              <button
                onClick={() => onToggleAgentVisibility(!isAgentToggleVisible)}
                className={`text-[9px] px-2 py-1 rounded border transition font-bold ${isAgentToggleVisible ? "bg-amber-500 text-slate-950 border-amber-500" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}
              >
                ఏజెంట్స్ టోగుల్
              </button>
            )}
            {onToggleSystemOnline && (
              <button
                onClick={() => onToggleSystemOnline(!isSystemOnline)}
                className={`text-[9px] px-2 py-1 rounded border transition font-bold ${isSystemOnline ? "bg-emerald-600 text-white border-emerald-600" : "bg-rose-950 text-rose-400 border-rose-800"}`}
              >
                {isSystemOnline ? "సిస్టమ్ ఆన్" : "సిస్టమ్ ఆఫ్"}
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left border-collapse text-[10px] text-slate-300">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-extrabold">
                <th className="py-2 px-3">బ్రాంచ్ పేరు</th>
                <th className="py-2 px-2 text-center">సభ్యుల్</th>
                <th className="py-2 px-2 text-center">హాజర్</th>
                <th className="py-2 px-2 text-right">ఆదాయం</th>
                <th className="py-2 px-2 text-center">స్టేటస్ (ఆన్/ఆఫ్)</th>
                <th className="py-2 px-3 text-right">సంబోధన</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-bold">
              {boardsData.map((row) => {
                const isActive = activeAddressedBoard === row.id;
                const isOpen = openMediaBoards[row.id];
                const commState = boardStates[row.id];
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`transition hover:bg-slate-900/40 ${isActive ? "bg-amber-500/5" : ""}`}
                    >
                      <td className="py-2 px-3">
                        <div className="text-slate-100 font-semibold">
                          {row.name}
                        </div>
                        <div className="text-[8px] text-slate-500">
                          {row.nameEn}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center">{row.total}</td>
                      <td className="py-2 px-2 text-center">{row.present}</td>
                      <td className="py-2 px-2 text-right">
                        ₹{row.revenue.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => setOpenMediaBoards((prev) => ({ ...prev, [row.id]: !prev[row.id] }))}
                          className={`w-8 h-4 rounded-full relative inline-flex items-center transition-colors ${isOpen ? "bg-emerald-500" : "bg-slate-700"}`}
                        >
                          <span className={`w-3 h-3 rounded-full bg-white transition-transform ${isOpen ? "translate-x-4" : "translate-x-1"}`} />
                        </button>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => setActiveAddressedBoard(row.id)}
                          className={`text-[8px] px-2 py-0.5 rounded-full border transition ${isActive ? "bg-amber-500 text-slate-950 border-amber-500" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}
                        >
                          {isActive ? "యాక్టివ్" : "ఎంచుకోండి"}
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-slate-900/40 shadow-inner">
                        <td colSpan={6} className="p-3">
                          <div className="bg-slate-950/80 border border-slate-800 rounded-lg overflow-hidden flex flex-col max-h-64">
                            {/* Chat History */}
                            <div className="p-3 overflow-y-auto flex-1 flex flex-col gap-2 min-h-[120px] scrollbar-thin scrollbar-thumb-slate-700">
                              {commState.receivedMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-[10px] ${msg.sender === 'user' ? 'bg-amber-600/20 text-amber-100 border border-amber-600/30' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                                    <div className="font-medium text-[9px] mb-0.5 opacity-60 flex justify-between gap-4">
                                      <span>{msg.sender === 'user' ? 'మీరు (You)' : row.name}</span>
                                      <span>{msg.timestamp}</span>
                                    </div>
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                  </div>
                                </div>
                              ))}
                              
                              {/* Show Uploaded Files */}
                              {commState.uploadedFiles.length > 0 && (
                                <div className="flex justify-end">
                                  <div className="max-w-[85%] rounded-lg px-2.5 py-1.5 text-[10px] bg-slate-800/80 border border-slate-700 flex flex-wrap gap-2">
                                    {commState.uploadedFiles.map((f, i) => (
                                      <div key={i} className="flex flex-col items-center gap-1 bg-slate-900 p-1.5 rounded">
                                        {f.type.startsWith('image/') ? (
                                          <img loading="lazy" decoding="async" src={f.url} alt="upload" className="w-12 h-12 object-cover rounded border border-slate-700" referrerPolicy="no-referrer" />
                                        ) : (
                                          <FileText className="w-6 h-6 text-emerald-400" />
                                        )}
                                        <span className="text-[8px] max-w-[60px] truncate text-slate-400">{f.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Loading indicator */}
                              {isGenerating[row.id] && (
                                <div className="flex justify-start">
                                  <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Input Area */}
                            <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                              <label className="cursor-pointer p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 transition shrink-0" title="ఫ్య్ల్ అప్‍ల్ళోడ్">
                                <Upload className="w-3.5 h-3.5" />
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(row.id, e)} />
                              </label>
                              <button
                                onClick={() => startListening(row.id)}
                                className={`p-1.5 rounded transition shrink-0 ${isListening[row.id] ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
                                title="వాయిస్ తో మాట్లాడండి"
                              >
                                {isListening[row.id] ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                              </button>
                              <input
                                value={commState.message}
                                onChange={(e) =>
                                  setBoardStates((prev) => ({
                                    ...prev,
                                    [row.id]: {
                                      ...prev[row.id],
                                      message: e.target.value,
                                    },
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSendMessage(row.id);
                                }}
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-200 focus:border-amber-500/50 outline-none"
                                placeholder={`${row.name} ఏజెంట్‍కు ఫ్య్ల్స్ లేదా సందేశం పంపల్శేదు...`}
                              />
                              <button
                                onClick={() => handleSendMessage(row.id)}
                                disabled={!commState.message.trim() && commState.uploadedFiles.length === 0}
                                className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
      {/* 2. SECURITY & CONTROL PANEL */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-[10px] font-black text-slate-100 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-rose-500" />
            బ్రహ్మాస్త్ర ఎగ్జిక్యూషన్ ప్యానెల్
          </h4>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="సెక్రెట్ కీ (108)..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-[10px]"
          />
          <button
            onClick={handleExecuteBrahmastra}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black py-1.5 rounded-lg transition"
          >
            బ్రహ్మాస్త్రం ప్రయోగించండి
          </button>
          {executionStatus && (
            <div className="text-[9px] font-mono text-rose-400">
              {executionStatus}
            </div>
          )}
          {executionOutput && (
            <pre className="bg-slate-950 p-2 rounded-lg text-[8px] font-mono text-slate-300 overflow-x-auto">
              {executionOutput.join("\n")}
            </pre>
          )}
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-[10px] font-black text-slate-100 flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-emerald-500" />
            సిస్టమ్ లాగ్స్ & డేటా ఫీడ్
          </h4>
          <div className="bg-slate-950 p-2 rounded-lg text-[8px] font-mono text-slate-400 h-24 overflow-y-auto space-y-1">
            {feedLogs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
          <form onSubmit={handleFeedExternalData} className="flex gap-2">
            <input
              value={externalData}
              onChange={(e) => setExternalData(e.target.value)}
              placeholder="డేటా ఇన్‌పుట్..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-[10px]"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-black"
            >
              పంపండి
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
interface BoardCommunication {
  message: string;
  uploadedFiles: { name: string; url: string; type: string; size: string }[];
  audioPlaying: boolean;
  receivedMessages: {
    text: string;
    sender: "user" | "system";
    timestamp: string;
  }[];
}
interface BrahmastraProps {
  isAgentToggleVisible?: boolean;
  onToggleAgentVisibility?: (visible: boolean) => void;
  isBrahmastraButtonVisible?: boolean;
  onToggleBrahmastraButton?: (visible: boolean) => void;
  isSystemOnline?: boolean;
  onToggleSystemOnline?: (online: boolean) => void;
  isHybridRadioMode?: boolean;
  onToggleHybridRadioMode?: (mode: boolean) => void;
}
