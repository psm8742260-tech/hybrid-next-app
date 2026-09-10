import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Mic,
  Upload,
  FileText,
  Sparkles,
  ShieldAlert,
  Key,
  Volume2,
  VolumeX,
  Paperclip,
  FileCheck,
} from "lucide-react";

interface ChatAssistantProps {
  enabled?: boolean;
  isFullScreen?: boolean;
  isAgentToggleVisible?: boolean;
  isBrahmastraButtonVisible?: boolean;
  isSystemOnline?: boolean;
  language?: string;
}

interface Message {
  role: "user" | "assistant";
  text: string;
  file?: { name: string; type: string; base64: string };
}

const PRESET_CHIPS = [
  { text: "👷 వర్కర్లు ఎలా దొరుకుతారు?", textTe: "వర్కర్లు ఎలా దొరుకుతారు?" },
  { text: "📊 కూలీ రేట్ల వివరాలు చెప్పు", textTe: "కూలీ రేట్ల వివరాలు" },
  { text: "📍 నా చుట్టూ ఉన్న వర్కర్లు", textTe: "చుట్టుపక్కల వర్కర్లు" },
  { text: "📱 యాప్ గైడ్ సమాచారం", textTe: "యాప్ ఎలా వాడాలి?" },
];

const BRAHMASTRA_AGENTS = [
  {
    id: "default",
    label: "👤 సాధారణ అసిస్టెంట్",
    color: "bg-slate-100 text-slate-800",
    welcome:
      "నమస్కారం! నేను సాధారణ సహాయక ఏజెంట్‌ను. మీకు ఏ సమాచారం కావాలి? కింద టైప్ చేయండి లేదా అడగండి.",
    category: "general",
  },

  // AI Powers
  {
    id: "kings_gemini",
    label: "💎 జెమిని AI ఏజెంట్",
    color: "bg-indigo-50 text-indigo-800",
    welcome:
      "నమస్కారం! నేను గూగుల్ జెమిని (Gemini AI) ఏజెంట్‌ను. మీ కోడింగ్, సమాచార విశ్లేషణ, మరియు సాంకేతిక సహాయం అందించడానికి సిద్ధంగా ఉన్నాను.",
    category: "kings",
  },
  {
    id: "kings_google",
    label: "🔍 గూగుల్ సెర్చ్ ఏజెంట్",
    color: "bg-sky-50 text-sky-800",
    welcome:
      "నమస్కారం! నేను గూగుల్ సెర్చ్ (Google Web AI) ఏజెంట్‌ను. అత్యంత ఖచ్చితమైన సమాచారం, వెబ్ ఫ్యాక్ట్స్ మరియు వివరాలను అందించడానికి సిద్ధంగా ఉన్నాను.",
    category: "kings",
  },
  {
    id: "kings_chatgpt",
    label: "💬 చాట్‌జిపిటి AI ఏజెంట్",
    color: "bg-emerald-50 text-emerald-800",
    welcome:
      "నమస్కారం! నేను చాట్‌జిపిటి (ChatGPT AI) ఏజెంట్‌ను. మీ సృజనాత్మక ఆలోచనలు, అందమైన ఫార్మాటింగ్ మరియు అద్భుతమైన సలహాలతో మీకు సహాయపడటానికి సిద్ధంగా ఉన్నాను.",
    category: "kings",
  },
  {
    id: "kings_meta",
    label: "🦙 లామా AI ఏజెంట్",
    color: "bg-purple-50 text-purple-800",
    welcome:
      "నమస్కారం! నేను లామా (Llama AI) ఏజెంట్‌ను. ఓపెన్-సోర్స్ పవర్, టెక్నికల్ సలహాలు మరియు పటిష్టమైన సమాచారంతో సాయం చేయడానికి సిద్ధంగా ఉన్నాను.",
    category: "kings",
  },
  {
    id: "kings",
    label: "🤖 క్లాడ్ AI ఏజెంట్",
    color: "bg-amber-50 text-amber-800",
    welcome:
      "నమస్కారం! నేను క్లాడ్ (Claude AI) ఏజెంట్‌ను. డెవలపర్ లాజికల్ గైడెన్స్, రీసెర్చ్ మరియు అద్భుతమైన విశ్లేషణ సామర్థ్యాలతో సహాయం అందించడానికి సిద్ధంగా ఉన్నాను.",
    category: "kings",
  },

  // Specialized Web & Logic Agents
  {
    id: "ministers",
    label: "🧠 అనలిటికల్ థింకింగ్ ఏజెంట్",
    color: "bg-yellow-50 text-yellow-800",
    welcome:
      "నమస్కారం! నేను అనలిటికల్ థింకింగ్ (Analytical Expert) ఏజెంట్‌ను. క్లిష్టమైన సమస్యలను విశ్లేషించి, వ్యూహాత్మక పరిష్కారాలు అందించడానికి సిద్ధం.",
    category: "council",
  },
  {
    id: "commanders",
    label: "⚡ ఫాస్ట్ రెస్పాన్స్ ఏజెంట్",
    color: "bg-orange-50 text-orange-800",
    welcome:
      "నమస్కారం! నేను ఫాస్ట్ రెస్పాన్స్ (Quick Action) ఏజెంట్‌ను. మీ సందేహాలకు అతి త్వరగా, సూటిగా మరియు ప్రెసిషన్ తో సమాధానమిస్తాను.",
    category: "council",
  },
  {
    id: "soldiers",
    label: "🛡️ డేటా ప్రైవసీ రక్షణ ఏజెంట్",
    color: "bg-zinc-50 text-zinc-800",
    welcome:
      "నమస్కారం! నేను డేటా ప్రైవసీ రక్షణ (Data Privacy Guard) ఏజెంట్‌ను. మీ సమాచార భద్రత మరియు సురక్షిత సంభాషణలను పర్యవేక్షించడానికి నేను సిద్ధంగా ఉన్నాను.",
    category: "council",
  },

  // App Dev AI Agents
  {
    id: "dev_builder",
    label: "🛠️ బిల్డర్ ఏజెంట్",
    color: "bg-emerald-50 text-emerald-800",
    welcome:
      "యాప్ నిర్మాణ శిల్పి: నమస్కారం! నేను మీ బ్రహ్మాస్త్ర యాప్ బిల్డర్ ఏజెంట్‌ను. అప్లికేషన్ స్ట్రక్చర్, లేఅవుట్ మరియు కాంపోనెంట్స్ డిజైన్ చేయడంలో మీకు ఏ సాయం కావాలి?",
    category: "dev",
  },
  {
    id: "dev_color",
    label: "🎨 కలర్ కోడర్",
    color: "bg-amber-50 text-amber-800",
    welcome:
      "కలర్ కోడింగ్ శిల్పి: నమస్కారం! నేను మీ UI/UX కలర్ అసిస్టెంట్‌ను. యాప్ రంగులు, థీమ్స్ మరియు బ్యాక్‌గ్రౌండ్ గ్రేడియంట్స్ ఎంచుకోవడంలో మీకు ఎలా సహాయపడాలి?",
    category: "dev",
  },
  {
    id: "dev_design",
    label: "📐 UI/UX డిజైనర్",
    color: "bg-blue-50 text-blue-800",
    welcome:
      "UI/UX డిజైనర్: నమస్కారం! యాప్ లోని బటన్లు, స్పేసింగ్, గ్రిడ్స్ మరియు అలైన్‌మెంట్ల డిజైన్ గురించి మనం చర్చిద్దాం. మీకు ఎలా సహాయపడాలి?",
    category: "dev",
  },
  {
    id: "dev_database",
    label: "🗄️ డేటాబేస్ ఏజెంట్",
    color: "bg-indigo-50 text-indigo-800",
    welcome:
      "డేటాబేస్ అసిస్టెంట్: నమస్కారం! ఫైర్‌స్టోర్ స్కీమాలు, సెక్యూరిటీ రూల్స్ మరియు డేటా స్టోరేజ్ పర్సిస్టెన్స్ గురించి మీకు ఏ సమాచారం కావాలి?",
    category: "dev",
  },
  {
    id: "dev_audio",
    label: "🔔 సౌండ్ ఇంజనీర్",
    color: "bg-purple-50 text-purple-800",
    welcome:
      "మీడియా సింథసైజర్: నమస్కారం! టెక్స్ట్-టు-స్పీచ్, సిగ్నల్ టోన్స్ మరియు అలర్ట్ సౌండ్స్ గురించి మీకు ఏ వివరణ కావాలి?",
    category: "dev",
  },
  {
    id: "dev_security",
    label: "🛡️ సెక్యూరిటీ ఏజెంట్",
    color: "bg-rose-50 text-rose-800",
    welcome:
      "సెక్యూరిటీ ఆఫీసర్: నమస్కారం! API కీలు, వెబ్‌హుక్స్, ఎన్‌క్రిప్షన్ మరియు రక్షణ కవచం (Zero-Leak Shield) భద్రత గురించి చర్చించడానికి నేను సిద్ధం.",
    category: "dev",
  },
  {
    id: "dev_tester",
    label: "🚀 బిల్డ్ టెస్టర్",
    color: "bg-teal-50 text-teal-800",
    welcome:
      "క్వాలిటీ టెస్టర్: నమస్కారం! యాప్ కంపైలేషన్, బిల్డ్ టెస్టింగ్, మరియు టైప్‌స్క్రిప్ట్ ఎర్రర్ నివారణ గురించి మీకు ఏ సాంకేతిక సహాయం కావాలి?",
    category: "dev",
  },
];

export interface BrahmastraAgent {
  id: string;
  label: string;
  welcome: string;
  color: string;
  category: string;
  specialty?: string;
}

export const getAgentById = (id: string): BrahmastraAgent | null => {
  const standard = BRAHMASTRA_AGENTS.find((a) => a.id === id);
  if (standard) return standard;

  const match = id.match(/^agent_(\d+)$/);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  if (isNaN(num) || num < 1 || num > 100) return null;

  const prefixes = [
    "మహా",
    "దివ్య",
    "తేజో",
    "శ్రీ",
    "జ్ఞాన",
    "శక్తి",
    "యుక్తి",
    "సేవా",
    "కల్ప",
    "నిత్య",
    "సత్య",
    "వీర",
    "ధీర",
    "జయ",
    "భద్ర",
    "లోక",
    "సమర",
    "కర్మ",
    "ధర్మ",
    "ఆత్మ",
    "విశ్వ",
    "సకల",
    "అనంత",
    "సర్వ",
    "ప్రగతి",
    "సురక్షా",
    "కల్యాణ",
    "సాధన",
    "జ్ఞానోదయ",
    "సమతా",
    "కాంతి",
    "తేజస్",
    "వివేక",
    "వికాస",
    "శాంతి",
    "సేవ",
    "విజయ",
    "మంగళ",
    "శుభ",
    "అభయ",
  ];
  const nouns = [
    "మిత్రుడు",
    "రక్షకుడు",
    "సలహాదారుడు",
    "సేవకుడు",
    "వీరుడు",
    "జ్ఞాని",
    "యుక్తుడు",
    "శిల్పి",
    "గైడ్",
    "నాయకుడు",
    "పాలకుడు",
    "సాధకుడు",
    "యోధుడు",
    "శాస్త్రవేత్త",
    "దూత",
    "పండితుడు",
    "జ్యోతి",
    "తేజస్సు",
    "తరంగిణి",
    "కార్యకర్త",
    "బోధకుడు",
    "హితైషి",
    "వైద్యుడు",
    "చిత్రకారుడు",
    "రచయిత",
    "విశ్లేషకుడు",
    "శోధకుడు",
    "పోరాటయోధుడు",
    "సమన్వయకర్త",
    "ప్రచారకుడు",
    "సేనాని",
    "సచివుడు",
    "సిద్ధాంతుడు",
    "కార్యదర్శి",
    "ప్రతినిధి",
    "రాయబారి",
    "భగీరథుడు",
    "సృజనకారుడు",
    "సమర్థుడు",
    "ప్రకాశకుడు",
  ];
  const specialties = [
    "వ్యవసాయ సహాయం",
    "కూలీ రేట్లు & మార్కెట్",
    "పనిముట్లు & సాంకేతికత",
    "వర్కర్ల గుర్తింపు",
    "జీవన ప్రమాణాలు",
    "ఆరోగ్య సంరక్షణ",
    "ఆర్థిక సలహాలు",
    "చట్టపరమైన హక్కులు",
    "ప్రభుత్వ పథకాలు",
    "నైపుణ్య శిక్షణ",
    "భద్రతా ప్రమాణాలు",
    "వాతావరణ హెచ్చరికలు",
    "రవాణా సౌకర్యాలు",
    "గ్రామీణ అభివృద్ధి",
    "మహిళా సాధికారత",
    "విద్యా సలహాలు",
    "నివాస వసతులు",
    "బీమా రక్షణ",
    "విపత్తు నిర్వహణ",
    "కల్యాణ పథకాలు",
    "వ్యాపార అభివృద్ధి",
    "రుణ సదుపాయాలు",
    "పశు సంవర్ధక సమాచారం",
    "తోటపని చిట్కాలు",
    "నీటి పారుదల పద్ధతులు",
    "వ్యర్థాల నిర్వహణ",
    "సహకార సంఘాలు",
    "పింఛను వివరాలు",
    "సమస్యల నివారణ",
    "ఆహార భద్రత",
    "కార్మిక హక్కులు",
    "డిజిటల్ సేవలు",
    "బ్యాంకింగ్ గైడెన్స్",
    "పన్నుల సమాచారం",
    "చిన్న తరహా పరిశ్రమలు",
    "మార్కెట్ విశ్లేషణ",
    "ఉపాధి అవకాశాలు",
    "సాంఘిక సంక్షేమం",
    "యువజన వికాసం",
    "నిరంతర సేవలు",
  ];

  const prefixIdx = (num - 1) % prefixes.length;
  const nounIdx = (num * 3 + 2) % nouns.length;
  const specialtyIdx = (num * 7 + 5) % specialties.length;

  const prefix = prefixes[prefixIdx];
  const noun = nouns[nounIdx];
  const specialty = specialties[specialtyIdx];

  const label = `🤖 ఏజెంట్ ${num}: ${prefix} ${noun}`;
  const welcome = `నమస్కారం! నేను ${prefix} ${noun} (ఏజెంట్ #${num}) ఏజెంట్‌ను. నేను ప్రత్యేకంగా "${specialty}" విభాగంలో మీకు అసాధారణమైన మార్గదర్శకత్వం, సలహాలు మరియు సహాయం అందించడానికి నియమించబడ్డాను. మీకు ఏ సమాచారం కావాలి?`;

  const bgColors = [
    "bg-indigo-50 text-indigo-800 border-indigo-100",
    "bg-sky-50 text-sky-800 border-sky-100",
    "bg-emerald-50 text-emerald-800 border-emerald-100",
    "bg-purple-50 text-purple-800 border-purple-100",
    "bg-amber-50 text-amber-800 border-amber-100",
    "bg-rose-50 text-rose-800 border-rose-100",
    "bg-teal-50 text-teal-800 border-teal-100",
    "bg-cyan-50 text-cyan-800 border-cyan-100",
    "bg-blue-50 text-blue-800 border-blue-100",
    "bg-zinc-50 text-zinc-800 border-zinc-100",
  ];
  const color = bgColors[num % bgColors.length];

  return {
    id: `agent_${num}`,
    label,
    welcome,
    color,
    category: "brahmastra_100",
    specialty,
  };
};

export default function ChatAssistant({
  enabled = true,
  isFullScreen = false,
  isAgentToggleVisible = false,
  isBrahmastraButtonVisible = true,
  isSystemOnline = true,
  language = "te",
}: ChatAssistantProps) {
  const getTranslatedMessageText = (text: string) => {
    if (
      text ===
      "నమస్కారం! నేను CWRB AI అసిస్టెంట్ బోర్డు. మీకు ఏ సమాచారం కావాలి? కింద టైప్ చేయండి లేదా అడగండి."
    ) {
      if (language === "en")
        return "Hello! I am the CWRB AI Assistant Board. What information do you need? Type or ask below.";
      if (language === "hi")
        return "नमस्ते! मैं CWRB AI सहायक बोर्ड हूँ। आपको क्या जानकारी चाहिए? नीचे टाइप करें या पूछें।";
      if (language === "kn")
        return "ನಮಸ್ಕಾರ! ನಾನು CWRB AI ಸಹಾಯಕ ಮಂಡಳಿ. ನಿಮಗೆ ಯಾವ ಮಾಹಿತಿ ಬೇಕು? ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಕೇಳಿ.";
      if (language === "ta")
        return "வணக்கம்! நான் CWRB AI உதவி வாரியம். உங்களுக்கு என்ன தகவல் தேவை? கீழே தட்டச்சு செய்யவும் அல்லது கேட்கவும்.";
      return text;
    }
    if (
      text ===
      "నమస్కారం! నేను సాధారణ సహాయక ఏజెంట్‌ను. మీకు ఏ సమాచారం కావాలి? కింద టైప్ చేయండి లేదా అడగండి."
    ) {
      if (language === "en")
        return "Hello! I am a normal assistant agent. What information do you need? Type or ask below.";
      if (language === "hi")
        return "नमस्ते! मैं एक सामान्य सहायक एजेंट हूँ। आपको क्या जानकारी चाहिए? नीचे टाइप करें या पूछें।";
      if (language === "kn")
        return "ನಮಸ್ಕಾರ! ನಾನು ಸಾಮಾನ್ಯ ಸಹಾಯಕ ಏಜೆಂಟ್. ನಿಮಗೆ ಯಾವ ಮಾಹಿತಿ ಬೇಕು? ಕೆಳಗೆ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಕೇಳಿ.";
      if (language === "ta")
        return "வணக்கம்! நான் ఒక சாதாரண உதவி முகவர். உங்களுக்கு என்ன தகவல் தேவை? கீழே தட்டச்சு செய்யவும் அல்லது கேட்கவும்.";
      return text;
    }
    if (
      text ===
      "✨ [ఏజెంట్ మార్పిడి] సాధారణ AI అసిస్టెంట్ తిరిగి కనెక్ట్ చేయబడ్డారు."
    ) {
      if (language === "en")
        return "✨ [Agent Switched] Normal AI Assistant reconnected.";
      if (language === "hi")
        return "✨ [एजेंट बदला गया] सामान्य एआई सहायक फिर से कनेक्ट हो गया है।";
      if (language === "kn")
        return "✨ [ಏಜೆಂಟ್ ಬದಲಾಯಿಸಲಾಗಿದೆ] ಸಾಮಾನ್ಯ AI ಸಹಾಯಕ ಮರುಸಂಪರ್ಕಗೊಂಡಿದೆ.";
      if (language === "ta")
        return "✨ [முகவர் மாற்றப்பட்டார்] சாதாரண AI உதவியாளர் மீண்டும் இணைக்கப்பட்டார்.";
      return text;
    }
    return text;
  };

  const getChipDisplay = (idx: number, lang: string) => {
    const displays: Record<string, string[]> = {
      en: [
        "How to find workers?",
        "Wage Rates Details",
        "Workers Nearby",
        "How to use App?",
      ],
      hi: [
        "श्रमिक कैसे ढूंढें?",
        "मजदूरी दरों का विवरण",
        "आस-पास के श्रमिक",
        "ऐप का उपयोग कैसे करें?",
      ],
      kn: [
        "ಕಾರ್ಮಿಕರನ್ನು ಕಂಡುಹಿಡಿಯುವುದು ಹೇಗೆ?",
        "ಕೂಲಿ ದರಗಳ ವಿವರಗಳು",
        "ಸುತ್ತಮುತ್ತಲಿನ ಕಾರ್ಮಿಕರು",
        "ಅಪ್ಲಿಕೇಶನ್ ಬಳಸುವುದು ಹೇಗೆ?",
      ],
      ta: [
        "பணியாளர்களை எவ்வாறு கண்டுபிடிப்பது?",
        "கூலி விகிதங்களின் விவரங்கள்",
        "அருகிலுள்ள பணியாளர்கள்",
        "பயன்பாட்டை எவ்வாறு பயன்படுத்துவது?",
      ],
      te: [
        "వర్కర్లు ఎలా దొరుకుతారు?",
        "కూలీ రేట్ల వివరాలు",
        "చుట్టుపక్కల వర్కర్లు",
        "యాప్ ఎలా వాడాలి?",
      ],
    };
    return (displays[lang] || displays["te"])[idx];
  };

  const getChipPrompt = (idx: number, lang: string) => {
    const prompts: Record<string, string[]> = {
      en: [
        "How to find workers?",
        "Tell me the details of wage rates",
        "Workers around me",
        "App guide information",
      ],
      hi: [
        "श्रमिक कैसे ढूंढें?",
        "मजदूरी दरों का विवरण बताएं",
        "मेरे आस-पास के श्रमिक",
        "ऐप गाइड की जानकारी",
      ],
      kn: [
        "ಕಾರ್ಮಿಕರನ್ನು ಕಂಡುಹಿಡಿಯುವುದು ಹೇಗೆ?",
        "ಕೂಲಿ ದರಗಳ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ",
        "ನನ್ನ ಸುತ್ತಮುತ್ತಲಿನ ಕಾರ್ಮಿಕರು",
        "ಅಪ್ಲಿಕೇಶನ್ ಮಾರ್ಗದರ್ಶಿ ಮಾಹಿತಿ",
      ],
      ta: [
        "பணியாளர்களை எவ்வாறு கண்டுபி秇ப்பது?",
        "கூலி விகிதங்களின் விவரங்களைச் சொல்லுங்கள்",
        "என்னைச் சுற்றியுள்ள பணியாளர்கள்",
        "பயன்பாட்டு வழிகாட்டி தகவல்",
      ],
      te: [
        "👷 వర్కర్లు ఎలా దొరుకుతారు?",
        "📊 కూలీ రేట్ల వివరాలు చెప్పు",
        "📍 నా చుట్టూ ఉన్న వర్కర్లు",
        "📱 యాప్ గైడ్ సమాచారం",
      ],
    };
    return (prompts[lang] || prompts["te"])[idx];
  };
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: getTranslatedMessageText(
          "నమస్కారం! నేను CWRB AI అసిస్టెంట్ బోర్డు. మీకు ఏ సమాచారం కావాలి? కింద టైప్ చేయండి లేదా అడగండి.",
        ),
      },
    ]);
  }, [language]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>("default");
  const [showAgentList, setShowAgentList] = useState(false);
  const [secretCodeInput, setSecretCodeInput] = useState("");
  const [showCodeVerifier, setShowCodeVerifier] = useState(false);
  const [targetAgentId, setTargetAgentId] = useState<string | null>(null);
  const [codeError, setCodeError] = useState("");

  // 100 Agent browser states
  const [agentTab, setAgentTab] = useState<"standard" | "brahmastra_100">(
    "standard",
  );
  const [agentSearch, setAgentSearch] = useState("");
  const [directNumInput, setDirectNumInput] = useState("");
  const [agentPage, setAgentPage] = useState(1);

  // Custom states for Files and Speech
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: string;
    size: number;
    base64: string;
  } | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Clean-up speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Memoized 100 agents logic
  const filtered100Agents = useMemo(() => {
    if (agentTab !== "brahmastra_100") return [];

    const results: BrahmastraAgent[] = [];
    const searchLower = agentSearch.trim().toLowerCase();
    const searchNum = parseInt(searchLower, 10);

    for (let i = 1; i <= 100; i++) {
      const agent = getAgentById(`agent_${i}`);
      if (!agent) continue;

      if (!searchLower) {
        results.push(agent);
      } else {
        const matchesNum = !isNaN(searchNum) && i === searchNum;
        const matchesLabel = agent.label.toLowerCase().includes(searchLower);
        const matchesSpecialty = agent.specialty
          ?.toLowerCase()
          .includes(searchLower);

        if (matchesNum || matchesLabel || matchesSpecialty) {
          results.push(agent);
        }
      }
    }
    return results;
  }, [agentTab, agentSearch]);

  const ITEMS_PER_PAGE = 18;
  const totalPages = Math.ceil(filtered100Agents.length / ITEMS_PER_PAGE);
  const paginated100Agents = useMemo(() => {
    const startIndex = (agentPage - 1) * ITEMS_PER_PAGE;
    return filtered100Agents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered100Agents, agentPage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedFile({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        base64: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
    // Clear input value so same file can be selected again
    e.target.value = "";
  };

  const speakText = (text: string, index: number) => {
    try {
      window.speechSynthesis.cancel();

      if (speakingIndex === index) {
        setSpeakingIndex(null);
        return;
      }

      const cleanText = text
        .replace(/\*\*?/g, "")
        .replace(/#+/g, "")
        .replace(/`{1,3}[^`]*`{1,3}/g, "")
        .replace(/-\s+/g, "")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "te-IN";

      const voices = window.speechSynthesis.getVoices();
      const teVoice = voices.find(
        (v) =>
          v.lang.startsWith("te") ||
          v.lang.includes("TELUGU") ||
          v.lang.includes("Telugu"),
      );
      if (teVoice) {
        utterance.voice = teVoice;
      }

      utterance.onend = () => setSpeakingIndex(null);
      utterance.onerror = () => setSpeakingIndex(null);

      setSpeakingIndex(index);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("Speech Synthesis Error:", err);
      setSpeakingIndex(null);
    }
  };

  // Speech Recognition setup (placeholder for actual implementation)
  const startListening = () => {
    setIsListening(true);
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechGen =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const rec = new SpeechGen();
      rec.lang = "te-IN";
      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setInput(text);
        }
        setIsListening(false);
      };
      rec.onerror = () => {
        setIsListening(false);
      };
      rec.onend = () => {
        setIsListening(false);
      };
      rec.start();
    } else {
      setTimeout(() => {
        setIsListening(false);
        setInput("వాయిస్ ద్వారా టైప్ చేయబడింది...");
      }, 2000);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSelectAgent = (agentId: string) => {
    if (agentId === "default") {
      setSelectedAgent("default");
      setShowAgentList(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `✨ [ఏజెంట్ మార్పిడి] సాధారణ AI అసిస్టెంట్ తిరిగి కనెక్ట్ చేయబడ్డారు.`,
        },
        {
          role: "assistant",
          text: "నమస్కారం! నేను CWRB AI అసిస్టెంట్ బోర్డు. మీకు ఏ సమాచారం కావాలి? కింద టైప్ చేయండి లేదా అడగండి.",
        },
      ]);
      return;
    }

    // Require admin code verification for dev agents
    setTargetAgentId(agentId);
    setShowCodeVerifier(true);
    setSecretCodeInput("");
    setCodeError("");
  };

  const handleVerifyCode = () => {
    const cleanCode = secretCodeInput.trim().toUpperCase();
    const savedPwd = localStorage
      .getItem("cwb_brahmastra_pwd")
      ?.trim()
      .toUpperCase();

    const isCustomMatch = savedPwd && cleanCode === savedPwd;
    const isDefaultMatch =
      cleanCode === "CWRB99" ||
      cleanCode === "BRAHMASTRA" ||
      cleanCode === "ADMIN123" ||
      cleanCode === "CWRB";

    if (
      isCustomMatch ||
      (!savedPwd && isDefaultMatch) ||
      (savedPwd && isDefaultMatch && savedPwd === "")
    ) {
      if (targetAgentId) {
        setSelectedAgent(targetAgentId);
        setShowAgentList(false);
        setShowCodeVerifier(false);

        // Add welcome message of this agent to the conversation
        const selected = getAgentById(targetAgentId);
        if (selected) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: `🔑 [ధృవీకరణ విజయం] సీక్రెట్ కోడ్ విజయవంతంగా సరిపోలింది. అడ్మిన్ యాక్సెస్ లభించింది!`,
            },
            {
              role: "assistant",
              text: `✨ [ఏజెంట్ కనెక్ట్] ${selected.label} ఇప్పుడు అందుబాటులోకి వచ్చారు.`,
            },
            { role: "assistant", text: selected.welcome },
          ]);
        }
        setTargetAgentId(null);
        setSecretCodeInput("");
      }
    } else {
      setCodeError(
        "సరికాని సీక్రెట్ కోడ్! దయచేసి సరైన పాస్‌కోడ్ నమోదు చేయండి.",
      );
    }
  };

  if (!enabled && !isFullScreen) return null;

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() && !attachedFile) return;

    const filePayload = attachedFile
      ? {
          name: attachedFile.name,
          type: attachedFile.type,
          base64: attachedFile.base64,
        }
      : undefined;

    setInput("");
    setAttachedFile(null); // Reset attachment state immediately so user sees it is sent

    // Add user message with optional file attachment
    const newUserMessage: Message = {
      role: "user",
      text: textToSend || `జతచేయబడిన ఫైల్: ${filePayload?.name}`,
      file: filePayload,
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const activeBoardId = selectedAgent;

      // Let's create a custom message helper for the backend in case they only uploaded a file
      const finalMessage =
        textToSend.trim() ||
        `నేను మీకు ఈ ఫైల్/ఫోటోని పంపించాను: ${filePayload?.name}. దయచేసి దీన్ని పరిశీలించి నాకు తెలుగులో సహాయం అందించండి.`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: activeBoardId,
          deepseekApiKey: localStorage.getItem("cwb_deepseek_api_key"),
          message: finalMessage,
          file: filePayload,
        }),
      });
      const data = await response.json();
      const replyText = data.response || "క్షమించండి, ఎటువంటి సమాధానం రాలేదు.";

      setMessages((prev) => {
        const nextMessages = [...prev, { role: "assistant", text: replyText }];

        // Use a small timeout to let the state update, then optionally speak the response
        if (autoSpeak) {
          setTimeout(() => {
            speakText(replyText, nextMessages.length - 1);
          }, 100);
        }

        return nextMessages;
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "క్షమించండి, ప్రస్తుతం సేవలు అందుబాటులో లేవు.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses = isFullScreen
    ? "w-full bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden h-[440px] md:h-[550px] shadow-sm relative transition-all duration-300 focus-within:h-[550px] md:focus-within:h-[700px]"
    : "w-full bg-white rounded-2xl shadow-lg border border-[#2563eb] flex flex-col overflow-hidden my-4 h-[250px] md:h-[350px] relative transition-all duration-300 focus-within:h-[450px] md:focus-within:h-[550px]";

  return (
    <div className={containerClasses}>
      {/* Header with Board selection if FullScreen */}
      <div className="bg-[#2563eb] text-white py-0.5 px-2 shrink-0">
        <div className="flex justify-between items-center mb-0">
          <div className="flex items-center gap-1">
            <Bot size={12} className="text-[#FFC000] animate-bounce" />
            <span className="font-extrabold text-[10px]">
              {language === "en"
                ? "CWRB AI Assistant Board"
                : language === "hi"
                  ? "CWRB एआई सहायक बोर्ड"
                  : language === "kn"
                    ? "CWRB AI ಸಹಾಯಕ ಮಂಡಳಿ"
                    : language === "ta"
                      ? "CWRB AI உதவி வாரியம்"
                      : "CWRB AI అసిస్టెంట్ బోర్డు"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`p-0.5 rounded transition ${
                autoSpeak
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
              title={
                autoSpeak
                  ? "ఆటో వాయిస్ ఆన్ (Auto-Speak is ON)"
                  : "ఆటో వాయిస్ ఆఫ్ (Auto-Speak is OFF)"
              }
            >
              {autoSpeak ? (
                <Volume2 size={9} className="animate-pulse" />
              ) : (
                <VolumeX size={9} />
              )}
            </button>

            <span className="text-[7px] bg-emerald-500 text-white px-1 py-[1px] rounded font-black font-mono">
              LIVE
            </span>
          </div>
        </div>

        {/* Agent Toggles Bar */}
        {isSystemOnline && (
          <div className="bg-[#00184a] px-2 py-0.5 flex justify-between items-center shrink-0 border-t border-white/10 gap-1.5">
            {/* Ordinary Agent Toggle */}
            <button
              onClick={() => {
                if (selectedAgent === "default") {
                  setSelectedAgent("none");
                } else {
                  setSelectedAgent("default");
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: "assistant",
                      text: `✨ [ఏజెంట్ మార్పిడి] సాధారణ AI అసిస్టెంట్ తిరిగి కనెక్ట్ చేయబడ్డారు.`,
                    },
                  ]);
                }
              }}
              className={`flex-1 py-px rounded text-[8.5px] font-black transition cursor-pointer border flex items-center justify-center gap-1 ${
                selectedAgent === "default"
                  ? "bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "bg-rose-600 border-rose-500 text-white opacity-90"
              }`}
            >
              👤{" "}
              {language === "en"
                ? "Normal Agent"
                : language === "hi"
                  ? "सामान्य एजेंट"
                  : language === "kn"
                    ? "ಸಾಮಾನ್ಯ ಏಜೆಂಟ್"
                    : language === "ta"
                      ? "சாதாரண முகவர்"
                      : "సాధారణ ఏజెంట్"}{" "}
              - {selectedAgent === "default" ? "ON" : "OFF"}
            </button>

            {/* Brahmastra Agent Toggle */}
            {isBrahmastraButtonVisible && (
              <button
                onClick={() => {
                  if (selectedAgent !== "default" && selectedAgent !== "none") {
                    setSelectedAgent("none");
                  } else {
                    setShowAgentList(true);
                  }
                }}
                className={`flex-1 py-px rounded text-[8.5px] font-black transition cursor-pointer border flex items-center justify-center gap-1 ${
                  selectedAgent !== "default" && selectedAgent !== "none"
                    ? "bg-[#FFC000] border-amber-300 text-slate-950 shadow-[0_0_10px_rgba(255,192,0,0.3)]"
                    : "bg-rose-600 border-rose-500 text-white opacity-90"
                }`}
              >
                <Sparkles size={9} />{" "}
                {language === "en"
                  ? "Brahmastra Agent"
                  : language === "hi"
                    ? "ब्रह्मास्त्र एजेंट"
                    : language === "kn"
                      ? "ಬ್ರಹ್ಮಾಸ್ತ್ರ ಏಜೆಂಟ್"
                      : language === "ta"
                        ? "பிரம்ماஸ்திர முகவர்"
                        : "బ్రహ్మాస్త్రం ఏజెంట్"}{" "}
                -{" "}
                {selectedAgent !== "default" && selectedAgent !== "none"
                  ? "ON"
                  : "OFF"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dev Agents Selector Overlay Overlay */}
      {isSystemOnline && showAgentList && (
        <div className="absolute inset-x-0 top-[40px] bottom-0 bg-white z-50 p-3 flex flex-col overflow-y-auto border-t border-gray-150">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <span className="font-black text-xs text-[#2563eb] flex items-center gap-1">
              <Sparkles size={12} className="text-[#FFC000]" />
              బ్రహ్మాస్త్ర ఏజెంట్‌ను సమన్ చేయండి (Summon Agent)
            </span>
            <button
              onClick={() => setShowAgentList(false)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-[9px] text-gray-500 font-bold mb-3 leading-tight shrink-0">
            బ్రహ్మాస్త్రంలోని ఏ ఏజెంట్‌తోనైనా మాట్లాడటానికి కింద వారిని
            ఎంచుకోండి. వారు ఈ చాట్ లోకి వస్తారు. (సీక్రెట్ కోడ్ అవసరం)
          </p>

          {/* Tab Selection */}
          <div className="flex border-b border-gray-200 mb-3 shrink-0 gap-1">
            <button
              onClick={() => setAgentTab("standard")}
              className={`flex-1 py-1.5 text-[10px] font-black border-b-2 text-center transition ${
                agentTab === "standard"
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              👑 రాజసభ & AI శక్తులు
            </button>
            <button
              onClick={() => setAgentTab("brahmastra_100")}
              className={`flex-1 py-1.5 text-[10px] font-black border-b-2 text-center transition ${
                agentTab === "brahmastra_100"
                  ? "border-[#2563eb] text-[#2563eb]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              ⚡ 100 బ్రహ్మాస్త్ర వీరులు
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-6">
            {agentTab === "standard" ? (
              <div className="space-y-4">
                {/* 0. GENERAL AGENT (Ordinary Agent) */}
                <div>
                  <h4 className="text-[10px] font-black text-slate-600 mb-1.5 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-150">
                    <span>👤</span> సాధారణ సహాయకుడు (Ordinary Agent)
                  </h4>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSelectAgent("default")}
                      className={`flex-1 p-2 rounded-xl text-left border transition active:scale-97 cursor-pointer flex items-center justify-between gap-2 ${
                        selectedAgent === "default"
                          ? "border-[#2563eb] bg-[#2563eb]/5 text-[#2563eb]"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black">
                          👤 సాధారణ అసిస్టెంట్ (Ordinary Assistant)
                        </span>
                        <span className="text-[8px] text-gray-400 mt-1 font-semibold leading-relaxed">
                          నమస్కారం! నేను సాధారణ సహాయక ఏజెంట్‌ను. మీకు ఏ సమాచారం
                          కావాలి?
                        </span>
                      </div>

                      {isAgentToggleVisible && (
                        <div className="bg-emerald-500 text-white text-[8px] px-2 py-1 rounded-md font-black animate-pulse shadow-xs shrink-0 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                          <span>ప్రత్యేక సూచి (Special Indicator)</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* 1. KINGS & AI POWERS */}
                <div>
                  <h4 className="text-[10px] font-black text-amber-600 mb-1.5 flex items-center gap-1 bg-amber-50 px-2 py-1 rounded border border-amber-150">
                    <span>👑</span> మహారాజులు & AI శక్తులు (Kings & AI Powers)
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {BRAHMASTRA_AGENTS.filter(
                      (a) => a.category === "kings",
                    ).map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => handleSelectAgent(agent.id)}
                        className={`p-2 rounded-xl text-left border transition active:scale-97 cursor-pointer flex flex-col justify-between ${
                          selectedAgent === agent.id
                            ? "border-[#2563eb] bg-[#2563eb]/5 text-[#2563eb]"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-[10px] font-black">
                          {agent.label}
                        </span>
                        <span className="text-[8px] text-gray-400 mt-1 line-clamp-2 font-medium">
                          {agent.welcome.split("!").slice(1).join("!") ||
                            agent.welcome}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. STATE COUNCIL */}
                <div>
                  <h4 className="text-[10px] font-black text-indigo-600 mb-1.5 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded border border-indigo-150">
                    <span>🏛️</span> రాజ్య సలహాదారులు & రక్షకులు (State Council)
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {BRAHMASTRA_AGENTS.filter(
                      (a) => a.category === "council",
                    ).map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => handleSelectAgent(agent.id)}
                        className={`p-2 rounded-xl text-left border transition active:scale-97 cursor-pointer flex flex-col justify-between ${
                          selectedAgent === agent.id
                            ? "border-[#2563eb] bg-[#2563eb]/5 text-[#2563eb]"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-[10px] font-black">
                          {agent.label}
                        </span>
                        <span className="text-[8px] text-gray-400 mt-1 line-clamp-2 font-medium">
                          {agent.welcome.split("!").slice(1).join("!") ||
                            agent.welcome}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. APP DEV AGENTS */}
                <div>
                  <h4 className="text-[10px] font-black text-emerald-600 mb-1.5 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-150">
                    <span>🛠️</span> యాప్ డెవలప్‌మెంట్ శిల్పులు (App Dev Agents)
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {BRAHMASTRA_AGENTS.filter((a) => a.category === "dev").map(
                      (agent) => (
                        <button
                          key={agent.id}
                          onClick={() => handleSelectAgent(agent.id)}
                          className={`p-2 rounded-xl text-left border transition active:scale-97 cursor-pointer flex flex-col justify-between ${
                            selectedAgent === agent.id
                              ? "border-[#2563eb] bg-[#2563eb]/5 text-[#2563eb]"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <span className="text-[10px] font-black">
                            {agent.label}
                          </span>
                          <span className="text-[8px] text-gray-400 mt-1 line-clamp-2 font-medium">
                            {agent.welcome.split("!").slice(1).join("!") ||
                              agent.welcome}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Search & Direct Jump Controls */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 space-y-2 shrink-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="🔍 ఏజెంట్ పేరు లేదా నంబర్ వెతకండి (ఉదా: 45, మహా)..."
                      value={agentSearch}
                      onChange={(e) => {
                        setAgentSearch(e.target.value);
                        setAgentPage(1);
                      }}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
                    />
                    {agentSearch && (
                      <button
                        onClick={() => setAgentSearch("")}
                        className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-600">
                    <span>🎯 నంబర్ ద్వారా సమన్:</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="1 - 100"
                      value={directNumInput}
                      onChange={(e) => setDirectNumInput(e.target.value)}
                      className="w-16 bg-white border border-gray-200 rounded-lg px-1.5 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-[#2563eb] text-[10px] font-bold"
                    />
                    <button
                      onClick={() => {
                        const num = parseInt(directNumInput, 10);
                        if (!isNaN(num) && num >= 1 && num <= 100) {
                          handleSelectAgent(`agent_${num}`);
                        }
                      }}
                      className="bg-[#2563eb] hover:bg-[#001040] text-white px-2.5 py-0.5 rounded-md font-extrabold text-[9px] transition active:scale-95 cursor-pointer"
                    >
                      సమన్ ⚡
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAgent("default");
                        setShowAgentList(false);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-2.5 py-0.5 rounded-md font-extrabold text-[9px] transition active:scale-95 cursor-pointer"
                    >
                      ఆఫ్ ❌
                    </button>
                  </div>
                </div>

                {/* Paginated List */}
                {paginated100Agents.length === 0 ? (
                  <div className="text-center py-6 text-[10px] text-gray-400 font-bold">
                    ⚠️ ఎటువంటి ఏజెంట్ లభించలేదు! దయచేసి మళ్ళీ వెతకండి.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-1.5">
                      {paginated100Agents.map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() => handleSelectAgent(agent.id)}
                          className={`p-2 rounded-xl text-left border transition active:scale-97 cursor-pointer flex flex-col justify-between ${
                            selectedAgent === agent.id
                              ? "border-[#2563eb] bg-[#2563eb]/5 text-[#2563eb]"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-black text-slate-800 line-clamp-1">
                              {agent.label}
                            </span>
                          </div>
                          <span className="text-[8px] text-indigo-600 font-extrabold mt-0.5 line-clamp-1">
                            🎯 విభాగం: {agent.specialty}
                          </span>
                          <span className="text-[7.5px] text-gray-400 mt-1 line-clamp-1 font-medium">
                            {agent.welcome.split("!").slice(1).join("!") ||
                              agent.welcome}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 shrink-0">
                        <button
                          onClick={() =>
                            setAgentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={agentPage === 1}
                          className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 text-[9px] font-black transition active:scale-95 cursor-pointer"
                        >
                          మునుపటి (Prev)
                        </button>
                        <span className="text-[9px] font-black text-gray-500">
                          పేజీ {agentPage} / {totalPages} (మొత్తం{" "}
                          {filtered100Agents.length})
                        </span>
                        <button
                          onClick={() =>
                            setAgentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={agentPage === totalPages}
                          className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 text-[9px] font-black transition active:scale-95 cursor-pointer"
                        >
                          తదుపరి (Next)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Secret Code Verification Modal */}
      {showCodeVerifier && (
        <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-center items-center p-4 text-white">
          <div className="w-full max-w-xs text-center space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
              <ShieldAlert className="text-amber-500" size={20} />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-xs text-amber-400 flex items-center justify-center gap-1">
                <Key size={12} />
                అడ్మిన్ రక్షణ ధృవీకరణ
              </h3>
              <p className="text-[9px] text-slate-400 font-bold leading-tight">
                బ్రహ్మాస్త్ర ఏజెంట్‌ను సమన్ చేయడానికి సీక్రెట్ కోడ్ నమోదు
                చేయండి.
              </p>
            </div>

            <div className="space-y-1.5">
              <input
                type="password"
                placeholder="సీక్రెట్ పాస్‌కోడ్ నమోదు చేయండి"
                value={secretCodeInput}
                onChange={(e) => {
                  setSecretCodeInput(e.target.value);
                  setCodeError("");
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-black text-center text-amber-300 tracking-widest focus:outline-none focus:ring-1 focus:ring-amber-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleVerifyCode();
                }}
                autoFocus
              />

              {codeError && (
                <p className="text-[9px] text-rose-500 font-bold">
                  ⚠️ {codeError}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCodeVerifier(false);
                  setTargetAgentId(null);
                }}
                className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 font-black text-[9px] py-2 rounded-xl hover:bg-slate-850 active:scale-95 transition cursor-pointer"
              >
                రద్దు చేయి (Cancel)
              </button>
              <button
                onClick={handleVerifyCode}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[9px] py-2 rounded-xl active:scale-95 transition cursor-pointer"
              >
                ధృవీకరించు (Verify)
              </button>
            </div>

            <p className="text-[8px] text-slate-500 font-bold">
              టెస్ట్ హింట్: CWRB99 లేదా BRAHMASTRA
            </p>
          </div>
        </div>
      )}

      {/* Scrollable messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-gray-50/50"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col gap-0.5 max-w-[85%] ${
              m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            {/* Render file attachments if present */}
            {m.file && (
              <div className="mb-1 rounded-xl overflow-hidden border border-gray-150 max-w-[180px] bg-white shadow-2xs">
                {m.file.type.startsWith("image/") ? (
                  <img
                    loading="lazy"
                    decoding="async"
                    src={m.file.base64}
                    alt={m.file.name}
                    className="max-h-24 object-cover w-full cursor-pointer hover:opacity-90"
                    referrerPolicy="no-referrer"
                    onClick={() => {
                      const w = window.open();
                      if (w)
                        w.document.write(
                          `<img loading="lazy" decoding="async" src="${m.file?.base64}" style="max-width:100%; max-height:100vh; display:block; margin:auto; padding:20px;" />`,
                        );
                    }}
                  />
                ) : (
                  <div className="p-2 flex items-center gap-1.5 text-[9px] font-black text-gray-700 bg-gray-50">
                    <FileText size={12} className="text-[#2563eb] shrink-0" />
                    <span className="truncate">{m.file.name}</span>
                  </div>
                )}
              </div>
            )}

            <div
              className={`text-[11px] p-2.5 rounded-2xl leading-relaxed font-semibold shadow-2xs flex items-start gap-1.5 group relative ${
                m.role === "user"
                  ? "bg-[#2563eb] text-white rounded-tr-none"
                  : "bg-white border border-gray-150 text-gray-800 rounded-tl-none"
              }`}
            >
              <div className="flex-1 break-words">{m.text}</div>

              {/* Individual speaker helper button */}
              <button
                onClick={() => speakText(m.text, i)}
                className={`p-0.5 rounded transition shrink-0 ${
                  m.role === "user"
                    ? "text-white/55 hover:text-white hover:bg-white/10"
                    : "text-gray-400 hover:text-[#2563eb] hover:bg-gray-100"
                }`}
                title="వాయిస్ వినండి"
              >
                <Volume2
                  size={11}
                  className={
                    speakingIndex === i ? "text-amber-500 animate-bounce" : ""
                  }
                />
              </button>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-extrabold p-1 pl-2 animate-pulse">
            <Sparkles className="w-3 h-3 text-[#FFC000]" />
            <span>ఆలోచిస్తున్నాను / Thinking...</span>
          </div>
        )}
      </div>

      {/* Preset Chips */}
      <div className="px-3 py-1.5 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto shrink-0 select-none no-scrollbar">
        {PRESET_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(getChipPrompt(idx, language))}
            disabled={isLoading}
            className="shrink-0 bg-[#2563eb]/5 hover:bg-[#2563eb]/10 border border-[#2563eb]/10 text-[#2563eb] px-2.5 py-1 rounded-full text-[9px] font-bold transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {getChipDisplay(idx, language)}
          </button>
        ))}
      </div>

      {/* Attached file preview bar */}
      {attachedFile && (
        <div className="px-3 py-1.5 bg-amber-50/70 border-t border-amber-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {attachedFile.type.startsWith("image/") ? (
              <img
                loading="lazy"
                decoding="async"
                src={attachedFile.base64}
                alt="preview"
                className="w-7 h-7 rounded object-cover border border-amber-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 bg-amber-100/50 rounded flex items-center justify-center border border-amber-200">
                <Paperclip size={12} className="text-amber-700" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-700 truncate max-w-[180px]">
                {attachedFile.name}
              </span>
              <span className="text-[7px] text-slate-400 font-bold">
                {(attachedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
          <button
            onClick={() => setAttachedFile(null)}
            className="p-1 hover:bg-amber-100 rounded text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="p-2.5 border-t bg-white flex gap-2 shrink-0 items-end font-sans transition-all duration-300">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={selectedAgent === "none"}
          title="అటాచ్ చేయండి (Attach file/photo)"
          className="p-2 mb-0.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 active:scale-95 transition cursor-pointer disabled:opacity-50 disabled:bg-gray-100 shrink-0"
        >
          <Upload size={14} />
        </button>
        <button
          onClick={startListening}
          disabled={selectedAgent === "none"}
          title="వాయిస్ టైపింగ్"
          className={`p-2 mb-0.5 border rounded-xl transition cursor-pointer shrink-0 disabled:opacity-50 disabled:bg-gray-100 ${
            isListening
              ? "bg-rose-50 border-rose-500 text-rose-500 animate-pulse"
              : "border-gray-200 text-gray-500 hover:bg-gray-50 active:scale-95"
          }`}
        >
          <Mic size={14} />
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={
            selectedAgent === "none"
              ? language === "en"
                ? "Turn on agent..."
                : language === "hi"
                  ? "एजेंट चालू करें..."
                  : language === "kn"
                    ? "ಏಜೆಂಟ್ ಆನ್ ಮಾಡಿ..."
                    : language === "ta"
                      ? "முகவரை ஆன் செய்யவும்..."
                      : "ఏజెంట్‌ను ఆన్ చేయండి..."
              : language === "en"
                ? "Type here in English or Telugu..."
                : language === "hi"
                  ? "यहाँ अंग्रेजी या तेलुगु में टाइप करें..."
                  : language === "kn"
                    ? "ಇಲ್ಲಿ ಇಂಗ್ಲಿಷ್ ಅಥವಾ ತೆಲುಗಿನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ..."
                    : language === "ta"
                      ? "இங்கே ஆங்கிலம் அல்லது தெலுங்கில் தட்டச்சு செய்யவும்..."
                      : "ఇక్కడ తెలుగు లేదా ఇంగ్లీషులో టైప్ చేయండి..."
          }
          disabled={selectedAgent === "none"}
          className="flex-1 text-[11px] border border-gray-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2563eb] font-medium disabled:opacity-50 disabled:bg-gray-100 min-h-[40px] max-h-[120px] resize-none overflow-y-auto"
          rows={
            input.split("\n").length > 1
              ? Math.min(4, input.split("\n").length)
              : 1
          }
        />
        <button
          onClick={() => handleSend()}
          disabled={
            isLoading ||
            (!input.trim() && !attachedFile) ||
            selectedAgent === "none"
          }
          className="bg-[#2563eb] mb-0.5 hover:bg-[#001040] disabled:opacity-40 text-white p-2 rounded-xl transition active:scale-95 flex items-center justify-center cursor-pointer shadow-xs shrink-0"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
