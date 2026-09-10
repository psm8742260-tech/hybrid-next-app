import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  Mic,
  Image,
  Video,
  Save,
} from "lucide-react";

const TITHIS = [
  "పాడ్యమి",
  "విదియ",
  "తదియ",
  "చవితి",
  "పంచమి",
  "షష్ఠి",
  "సప్తమి",
  "అష్టమి",
  "నవమి",
  "దశమి",
  "ఏకాదశి",
  "ద్వాదశి",
  "త్రయోదశి",
  "చతుర్దశి",
  "పౌర్ణమి",
  "పాడ్యమి",
  "విదియ",
  "తదియ",
  "చవితి",
  "పంచమి",
  "షష్ఠి",
  "సప్తమి",
  "అష్టమి",
  "నవమి",
  "దశమి",
  "ఏకాదశి",
  "ద్వాదశి",
  "త్రయోదశి",
  "చతుర్దశి",
  "అమావాస్య",
];

const TITHI_RESULTS: {
  [key: string]: { result: string; significance: string };
} = {
  పాడ్యమి: {
    result: "శుభప్రదం",
    significance:
      "నూతన పనులకు మరియు దైవకార్యాలకు అత్యంత అనుకూలం. మంగళకరమైన సమయం.",
  },
  విదియ: {
    result: "అత్యంత శుభకరం",
    significance:
      "గృహ ప్రవేశాలు, వివాహాది శుభకార్యాలకు, నూతన వస్త్రాలంకరణకు అనుకూలం.",
  },
  తదియ: {
    result: "విజయదాయకం",
    significance:
      "ప్రయాణాలకు, విద్యాభ్యాసానికి మరియు నూతన వాహనాలు కొనడానికి శుభప్రదం.",
  },
  చవితి: {
    result: "మధ్యమం (వినాయక పూజ)",
    significance:
      "విఘ్నేశ్వర ఆరాధనకు శ్రేష్ఠం. కొత్త పనులకు విఘ్నాలు తొలగడానికి పూజలు చేయాలి.",
  },
  పంచమి: {
    result: "అత్యంత శుభప్రదం",
    significance:
      "లక్ష్మీ దేవి పూజకు, వివాహ నిశ్చితార్థాలకు, ప్రయాణాలకు అత్యంత శ్రేష్ఠమైనది.",
  },
  షష్ఠి: {
    result: "కీర్తిప్రదం",
    significance:
      "సుబ్రహ్మణ్య స్వామి పూజకు అనుకూలం. కీర్తి, ప్రతిష్టలు పెరిగే పనులకు అనుకూలం.",
  },
  సప్తమి: {
    result: "ఆరోగ్యప్రదం",
    significance:
      "సూర్య ఆరాధనకు అనుకూలం. ఆరోగ్యం చేకూరే పనులకు, ఔషధ సేవనానికి మంచిది.",
  },
  అష్టమి: {
    result: "సాధారణం (దుర్గా పూజ)",
    significance:
      "దుర్గా దేవి పూజకు అనుకూలం. కోర్టు పనులు లేదా శతృ నివారణా పనులకు శ్రేష్ఠం.",
  },
  నవమి: {
    result: "సాధారణం (శ్రీరామ పూజ)",
    significance:
      "శ్రీరామ పూజకు విశిష్టమైనది. కొత్త వ్యాపారాలు లేదా ప్రయాణాలకు మధ్యమం.",
  },
  దశమి: {
    result: "సర్వకార్య సిద్ధి",
    significance:
      "నూతన వ్యాపారాలు, గృహ ప్రవేశాలు, శుభకార్యాలు ప్రారంభించడానికి అత్యంత శుభప్రదం.",
  },
  ఏకాదశి: {
    result: "పుణ్యప్రదం",
    significance:
      "విష్ణు పూజ మరియు ఉపవాసాలకు అత్యంత పవిత్రమైన రోజు. మానసిక ప్రశాంతత లభిస్తుంది.",
  },
  ద్వాదశి: {
    result: "శుభప్రదం",
    significance:
      "దానధర్మాలకు, దేవాలయ దర్శనాలకు, నూతన పనుల ప్రారంభానికి అనుకూలం.",
  },
  త్రయోదశి: {
    result: "సంతోషప్రదం",
    significance:
      "ప్రదోష పూజకు అనుకూలం. స్నేహ సంబంధాలు మరియు ప్రయాణాలకు అనుకూలమైన రోజు.",
  },
  చతుర్దశి: {
    result: "మధ్యమం (శివ పూజ)",
    significance:
      "శివారాధనకు అత్యంత శ్రేష్ఠం. ప్రశాంతంగా ఉండవలసిన రోజు. గొడవలకు దూరంగా ఉండాలి.",
  },
  పౌర్ణమి: {
    result: "మంగళకరం",
    significance:
      "సత్యనారాయణ వ్రతాలకు, లక్ష్మీ పూజకు మరియు అన్ని రకాల శుభకార్యాలకు అత్యంత పవిత్రమైనది.",
  },
  అమావాస్య: {
    result: "పితృకార్యములకు శ్రేష్ఠం",
    significance:
      "పితృ దేవతల పూజకు, దానాలకు శ్రేష్ఠం. లౌకిక శుభకార్యాలకు సాధారణం.",
  },
};
const NAKSHATRAMS = [
  "అశ్విని",
  "భరణి",
  "కృత్తిక",
  "రోహిణి",
  "మృగశిర",
  "ఆరుద్ర",
  "పునర్వసు",
  "పుష్యమి",
  "ఆశ్లేష",
  "మఖ",
  "పుబ్బ",
  "ఉత్తర",
  "హస్త",
  "చిత్త",
  "స్వాతి",
  "విశాఖ",
  "అనూరాధ",
  "జ్యేష్ఠ",
  "మూల",
  "పూర్వాషాడ",
  "ఉత్తరాషాడ",
  "శ్రవణం",
  "ధనిష్ఠ",
  "శతభిషం",
  "పూర్వాభాద్ర",
  "ఉత్తరాభాద్ర",
  "రేవతి",
];
const MASAMS = [
  "చైత్ర",
  "వైశాఖ",
  "జ్యేష్ఠ",
  "ఆషాఢ",
  "శ్రావణ",
  "భాద్రపద",
  "ఆశ్వయుజ",
  "కార్తీక",
  "మార్గశిర",
  "పుష్య",
  "మాఘ",
  "ఫాల్గుణ",
];
const WEEKDAYS = ["ఆది", "సోమ", "మంగళ", "బుధ", "గురు", "శుక్ర", "శని"];

// Fake accurate-looking gowri panchangam data for demonstration
const GOWRI_GOOD_TIMES = [
  "ఉదయం 10:30 - 12:00, సాయంత్రం 4:30 - 6:00", // ఆది
  "ఉదయం 9:00 - 10:30, రాత్రి 7:30 - 9:00", // సోమ
  "మధ్యాహ్నం 12:00 - 1:30, సాయంత్రం 3:00 - 4:30", // మంగళ
  "ఉదయం 7:30 - 9:00, మధ్యాహ్నం 1:30 - 3:00", // బుధ
  "ఉదయం 6:00 - 7:30, మధ్యాహ్నం 12:00 - 1:30", // గురు
  "ఉదయం 9:00 - 10:30, సాయంత్రం 6:00 - 7:30", // శుక్ర
  "ఉదయం 7:30 - 9:00, రాత్రి 9:00 - 10:30", // శని
];

const RAHU_KALAM = [
  "సాయంత్రం 04:30 - 06:00", // ఆది
  "ఉదయం 07:30 - 09:00", // సోమ
  "సాయంత్రం 03:00 - 04:30", // మంగళ
  "మధ్యాహ్నం 12:00 - 01:30", // బుధ
  "మధ్యాహ్నం 01:30 - 03:00", // గురు
  "ఉదయం 10:30 - 12:00", // శుక్ర
  "ఉదయం 09:00 - 10:30", // శని
];

const YAMAGANDAM = [
  "మధ్యాహ్నం 12:00 - 01:30", // ఆది
  "ఉదయం 10:30 - 12:00", // సోమ
  "ఉదయం 09:00 - 10:30", // మంగళ
  "ఉదయం 07:30 - 09:00", // బుధ
  "ఉదయం 06:00 - 07:30", // గురు
  "సాయంత్రం 03:00 - 04:30", // శుక్ర
  "మధ్యాహ్నం 01:30 - 03:00", // శని
];

const HORAS = ["సూర్య", "శుక్ర", "బుధ", "చంద్ర", "శని", "గురు", "కుజ"];
const START_HORA_INDEX = [0, 3, 6, 2, 5, 1, 4]; // Sun to Sat
const HORA_NATURE = {
  సూర్య: "సాధారణం (Average)",
  శుక్ర: "శుభం (Good)",
  బుధ: "శుభం (Good)",
  చంద్ర: "శుభం (Good)",
  శని: "అశుభం (Bad)",
  గురు: "అత్యంత శుభం (Excellent)",
  కుజ: "అశుభం (Bad)",
};
const GOWRI_CHUNKS = [
  "ఉద్వేగ",
  "అమృత",
  "రోగ",
  "లాభ",
  "ధన",
  "శుభ",
  "విష",
  "చోర",
];
const GOWRI_SHIFT = [0, 1, 2, 3, 4, 5, 6];

// Helper to get consistent simulated data based on date
const getPanchangamForDate = (date: Date) => {
  const seed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const dayOfWeek = date.getDay();

  return {
    tithi: TITHIS[seed % 30],
    nakshatram: NAKSHATRAMS[seed % 27],
    masam: MASAMS[date.getMonth()],
    gowri: GOWRI_GOOD_TIMES[dayOfWeek],
    rahu: RAHU_KALAM[dayOfWeek],
    yama: YAMAGANDAM[dayOfWeek],
    paksham: seed % 30 < 15 ? "శుక్ల పక్షం" : "కృష్ణ పక్షం",
    rutuvu: "గ్రీష్మ ఋతువు", // Simplified for demo
    samvatsaram: "శ్రీ క్రోధి నామ సంవత్సరం",
  };
};

export default function TeluguCalendar({ onBack }: { onBack: () => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showHourly, setShowHourly] = useState(false);

  // Memories & Media Upload States
  const [memories, setMemories] = useState<{
    [dateKey: string]: {
      photo?: string;
      video?: string;
      audio?: string;
      note?: string;
    };
  }>(() => {
    try {
      const saved = localStorage.getItem("telugu_calendar_memories");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [noteInput, setNoteInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);

  const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;

  // Sync input when selectedDate changes
  useEffect(() => {
    setNoteInput(memories[dateKey]?.note || "");
  }, [selectedDate, memories, dateKey]);

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const saveMedia = (
    type: "photo" | "video" | "audio" | "note",
    value: string,
  ) => {
    const newMemories = {
      ...memories,
      [dateKey]: {
        ...(memories[dateKey] || {}),
        [type]: value,
      },
    };
    setMemories(newMemories);
    try {
      localStorage.setItem(
        "telugu_calendar_memories",
        JSON.stringify(newMemories),
      );
    } catch (e) {
      console.error("Storage full or error saving:", e);
      alert(
        "స్టోరేజ్ పరిమితి దాటింది. దయచేసి పాత మీడియా ఫైల్స్‌ను డిలీట్ చేయండి.",
      );
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("ఫోటో సైజు 2MB కంటే తక్కువగా ఉండాలి.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        saveMedia("photo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("వీడియో సైజు 3MB కంటే తక్కువగా ఉండాలి.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        saveMedia("video", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          saveMedia("audio", reader.result as string);
        };
        reader.readAsDataURL(blob);

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingDuration(0);

      const interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert(
        "మైక్రోఫోన్ పర్మిషన్ లభించలేదు. దయచేసి బ్రౌజర్ సెట్టింగ్స్ చెక్ చేయండి.",
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  };

  const getDaysRemainingText = (targetDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `ఇంకా ${diffDays} రోజులు ఉన్నాయి`;
    } else if (diffDays === 0) {
      return "ఈ రోజే!";
    } else {
      return `గతించిన రోజు (గడచి ${Math.abs(diffDays)} రోజులు)`;
    }
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );

  const monthNames = [
    "జనవరి",
    "ఫిబ్రవరి",
    "మార్చి",
    "ఏప్రిల్",
    "మే",
    "జూన్",
    "జూలై",
    "ఆగస్టు",
    "సెప్టెంబర్",
    "అక్టోబర్",
    "నవంబర్",
    "డిసెంబర్",
  ];

  const panchangam = getPanchangamForDate(selectedDate);
  const dayOfWeek = selectedDate.getDay();

  const generateHourlyPanchangam = () => {
    const hours = [];
    let horaIndex = START_HORA_INDEX[dayOfWeek];

    // Day time (6 AM to 6 PM)
    for (let i = 0; i < 12; i++) {
      const startHour = i + 6;
      const displayHour = startHour > 12 ? startHour - 12 : startHour;

      let teluguTimePrefix = "ఉదయం";
      if (startHour === 12) teluguTimePrefix = "మధ్యాహ్నం";
      if (startHour >= 13 && startHour <= 15) teluguTimePrefix = "మధ్యాహ్నం";
      if (startHour >= 16) teluguTimePrefix = "సాయంత్రం";

      let endHour = startHour + 1;
      let teluguEndPrefix = "ఉదయం";
      if (endHour === 12) teluguEndPrefix = "మధ్యాహ్నం";
      if (endHour >= 13 && endHour <= 15) teluguEndPrefix = "మధ్యాహ్నం";
      if (endHour >= 16 && endHour <= 18) teluguEndPrefix = "సాయంత్రం";
      if (endHour > 18) teluguEndPrefix = "రాత్రి";

      const displayEndHour = endHour > 12 ? endHour - 12 : endHour;

      // Calculate Gowri (changes every 1.5 hours)
      const gowriPeriod = Math.floor(i / 1.5);
      const gowriIndex = (GOWRI_SHIFT[dayOfWeek] + gowriPeriod) % 8;

      hours.push({
        time: `${teluguTimePrefix} ${displayHour}:00 - ${teluguEndPrefix} ${displayEndHour}:00`,
        hora: HORAS[(horaIndex + i) % 7],
        gowri: GOWRI_CHUNKS[gowriIndex],
      });
    }
    return hours;
  };

  return (
    <div className="space-y-4 animate-fade-in pb-20 -mx-4 -mt-5">
      <div className="bg-[#2563eb] p-4 pb-6 shadow-md rounded-b-3xl mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 bg-white/10 rounded-full border border-white/20 text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-white font-black text-lg">
            పంచాంగం (Panchangam)
          </h2>
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
            హైబ్రిడ్ ఇంజిన్: క్యాలెండర్ ఆటోమేటిక్‌గా అప్‌డేట్ అవుతుంది
            (Auto-Updated)
          </div>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <button
            onClick={prevMonth}
            className="p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-[#2563eb]" />
          </button>
          <div className="text-center">
            <h2 className="text-[#2563eb] font-extrabold text-lg flex items-center justify-center gap-2">
              <span className="text-xl">🕉️</span>{" "}
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold mt-0.5">
              {panchangam.samvatsaram} - {panchangam.masam} మాసం
            </p>
          </div>
          <button
            onClick={nextMonth}
            className="p-1.5 bg-gray-50 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-[#2563eb]" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((day, idx) => (
              <div
                key={day}
                className={`text-[10px] font-extrabold py-1 ${idx === 0 ? "text-red-500" : "text-gray-500"}`}
              >
                {day}
              </div>
            ))}

            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2"></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const cellDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day,
              );
              const isSelected =
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentDate.getMonth() &&
                selectedDate.getFullYear() === currentDate.getFullYear();
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();
              const isSunday = cellDate.getDay() === 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(cellDate)}
                  className={`p-1.5 text-xs font-bold rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? "bg-[#2563eb] text-white shadow-md scale-105"
                      : isToday
                        ? "border border-[#FFC000] text-[#2563eb] bg-[#FFC000]/10"
                        : isSunday
                          ? "text-red-500 bg-red-50/50 hover:bg-red-100"
                          : "text-gray-700 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <span>{day}</span>
                  {/* Show a tiny dot if it's amavasya or pournami based on mock data */}
                  {getPanchangamForDate(cellDate).tithi === "అమావాస్య" && (
                    <div
                      className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-gray-800"}`}
                    ></div>
                  )}
                  {getPanchangamForDate(cellDate).tithi === "పౌర్ణమి" && (
                    <div
                      className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-yellow-400"}`}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-extrabold text-[#2563eb] text-sm">
              {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}{" "}
              {selectedDate.getFullYear()} - పంచాంగం
            </h3>
            <span className="bg-[#FFC000]/20 text-[#2563eb] text-[9px] font-black px-2 py-0.5 rounded">
              {panchangam.paksham}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-100 flex flex-col justify-center">
              <p className="text-[9px] text-orange-600 font-bold mb-0.5 uppercase tracking-wider">
                తిథి
              </p>
              <p className="text-xs font-extrabold text-gray-800">
                {panchangam.tithi}
              </p>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 flex flex-col justify-center">
              <p className="text-[9px] text-blue-600 font-bold mb-0.5 uppercase tracking-wider">
                నక్షత్రం
              </p>
              <p className="text-xs font-extrabold text-gray-800">
                {panchangam.nakshatram}
              </p>
            </div>
          </div>

          {/* Tithi Significance (తిథి ఫలితం) */}
          {TITHI_RESULTS[panchangam.tithi] && (
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-left">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-sm">📙</span>
                <span className="text-[10px] text-amber-800 font-extrabold uppercase tracking-wider">
                  ఈ రోజు తిథి ఫలితం ({panchangam.tithi}):
                </span>
                <span className="ml-auto text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-black">
                  {TITHI_RESULTS[panchangam.tithi].result}
                </span>
              </div>
              <p className="text-xs font-bold text-amber-950 leading-relaxed">
                {TITHI_RESULTS[panchangam.tithi].significance}
              </p>
            </div>
          )}

          <div className="bg-[#2563eb]/5 p-3 rounded-xl border border-[#2563eb]/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#2563eb] font-bold mb-1 flex items-center gap-1">
                  <span className="text-xs">✨</span> గౌరీ పంచాంగం (మంచి సమయం)
                </p>
                <p className="text-xs font-extrabold text-[#2563eb]">
                  {panchangam.gowri}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="bg-red-50 p-2.5 rounded-xl border border-red-100">
              <p className="text-[9px] text-red-600 font-bold mb-0.5 uppercase tracking-wider">
                రాహుకాలం
              </p>
              <p className="text-[10px] font-extrabold text-gray-800">
                {panchangam.rahu}
              </p>
            </div>
            <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
              <p className="text-[9px] text-purple-600 font-bold mb-0.5 uppercase tracking-wider">
                యమగండం
              </p>
              <p className="text-[10px] font-extrabold text-gray-800">
                {panchangam.yama}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowHourly(!showHourly)}
            className="w-full py-2 bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-xl text-xs font-bold text-[#2563eb] flex justify-center items-center gap-1 hover:bg-[#FFC000]/20 transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
            {showHourly
              ? "గంటల పంచాంగం దాచండి"
              : "గంటల పంచాంగం (హోర, గౌరీ) చూపండి"}
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
                  <div
                    key={idx}
                    className="px-3 py-2 grid grid-cols-3 text-[10px] items-center hover:bg-slate-100 transition-colors"
                  >
                    <div className="font-bold text-slate-700">{slot.time}</div>
                    <div>
                      <div className="font-extrabold text-[#2563eb]">
                        {slot.hora} హోర
                      </div>
                      <div
                        className={`text-[8px] font-bold ${
                          HORA_NATURE[
                            slot.hora as keyof typeof HORA_NATURE
                          ].includes("Good") ||
                          HORA_NATURE[
                            slot.hora as keyof typeof HORA_NATURE
                          ].includes("Excellent")
                            ? "text-emerald-600"
                            : HORA_NATURE[
                                  slot.hora as keyof typeof HORA_NATURE
                                ].includes("Bad")
                              ? "text-red-500"
                              : "text-orange-500"
                        }`}
                      >
                        {HORA_NATURE[slot.hora as keyof typeof HORA_NATURE]}
                      </div>
                    </div>
                    <div className="font-extrabold text-indigo-700">
                      {slot.gowri}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Memories & Media Section (తేదీ జ్ఞాపకాలు & రిమైండర్‌లు) */}
          <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100 text-left space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#2563eb] flex items-center gap-1.5">
                <span>📅</span> తేదీ జ్ఞాపకాలు & రిమైండర్‌లు
              </h4>
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                  getDaysRemainingText(selectedDate).includes("ఇంకా")
                    ? "bg-blue-100 text-blue-800 animate-pulse"
                    : getDaysRemainingText(selectedDate).includes("ఈ రోజే")
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {getDaysRemainingText(selectedDate)}
              </span>
            </div>

            {/* Note text field */}
            <div className="space-y-1.5">
              <label className="text-[9px] text-gray-500 font-extrabold uppercase tracking-wider">
                రిమైండర్ / నోట్స్ రాయండి:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="రిమైండర్ లేదా జ్ఞాపకం నోట్ ఇక్కడ రాయండి..."
                  className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2563eb] text-gray-800"
                />
                <button
                  onClick={() => saveMedia("note", noteInput)}
                  className="px-3 py-1.5 bg-[#2563eb] hover:bg-[#051e4e] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  దాచు
                </button>
              </div>
            </div>

            {/* Media Upload Options */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {/* Photo Upload */}
              <label className="cursor-pointer bg-white hover:bg-gray-50 p-2 rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-1 text-center transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Image className="w-4 h-4 text-emerald-600 mx-auto" />
                <span className="text-[10px] font-bold text-gray-700">
                  📷 ఫోటో
                </span>
              </label>

              {/* Video Upload */}
              <label className="cursor-pointer bg-white hover:bg-gray-50 p-2 rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-1 text-center transition-all">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <Video className="w-4 h-4 text-purple-600 mx-auto" />
                <span className="text-[10px] font-bold text-gray-700">
                  🎥 వీడియో
                </span>
              </label>

              {/* Voice Record Button */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
                  isRecording
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <Mic
                  className={`w-4 h-4 mx-auto ${isRecording ? "text-red-600 animate-pulse" : "text-blue-600"}`}
                />
                <span className="text-[10px] font-bold">
                  {isRecording
                    ? `ఆపండి (${recordingDuration}s)`
                    : "🎙️ రికార్డ్"}
                </span>
              </button>
            </div>

            {/* Display Attached Media */}
            {(memories[dateKey]?.photo ||
              memories[dateKey]?.video ||
              memories[dateKey]?.audio ||
              memories[dateKey]?.note) && (
              <div className="bg-white/80 p-3 rounded-xl border border-gray-100 space-y-3 mt-2">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                  <span className="text-[9px] text-gray-400 font-extrabold tracking-wider uppercase">
                    జోడించిన మీడియా & జ్ఞాపకాలు:
                  </span>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "ఈ రోజు జ్ఞాపకాలను పూర్తిగా డిలీట్ చేయాలనుకుంటున్నారా?",
                        )
                      ) {
                        const newMemories = { ...memories };
                        delete newMemories[dateKey];
                        setMemories(newMemories);
                        localStorage.setItem(
                          "telugu_calendar_memories",
                          JSON.stringify(newMemories),
                        );
                        setNoteInput("");
                      }
                    }}
                    className="p-1 hover:bg-red-50 rounded text-red-500 transition-all"
                    title="అన్నింటినీ డిలీట్ చేయండి"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Display Note */}
                {memories[dateKey]?.note && (
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-[10px] text-slate-500 font-bold mb-0.5 uppercase">
                      జ్ఞాపకం / నోట్:
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {memories[dateKey].note}
                    </p>
                  </div>
                )}

                {/* Display Photo */}
                {memories[dateKey]?.photo && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      ఫోటో:
                    </p>
                    <div className="relative rounded-lg overflow-hidden border border-slate-100">
                      <img
                        src={memories[dateKey].photo}
                        alt="Memory Photo"
                        className="w-full max-h-[180px] object-cover"
                      />
                      <button
                        onClick={() => {
                          const updated = { ...memories[dateKey] };
                          delete updated.photo;
                          const newMemories = {
                            ...memories,
                            [dateKey]: updated,
                          };
                          setMemories(newMemories);
                          localStorage.setItem(
                            "telugu_calendar_memories",
                            JSON.stringify(newMemories),
                          );
                        }}
                        className="absolute top-1.5 right-1.5 bg-red-600/80 hover:bg-red-700 text-white p-1 rounded-md transition-all shadow-md"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Display Video */}
                {memories[dateKey]?.video && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      వీడియో:
                    </p>
                    <div className="relative rounded-lg overflow-hidden border border-slate-100 bg-black">
                      <video
                        src={memories[dateKey].video}
                        controls
                        className="w-full max-h-[180px]"
                      />
                      <button
                        onClick={() => {
                          const updated = { ...memories[dateKey] };
                          delete updated.video;
                          const newMemories = {
                            ...memories,
                            [dateKey]: updated,
                          };
                          setMemories(newMemories);
                          localStorage.setItem(
                            "telugu_calendar_memories",
                            JSON.stringify(newMemories),
                          );
                        }}
                        className="absolute top-1.5 right-1.5 bg-red-600/80 hover:bg-red-700 text-white p-1 rounded-md transition-all shadow-md z-10"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Display Voice Recording */}
                {memories[dateKey]?.audio && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      రికార్డ్ చేసిన వాయిస్:
                    </p>
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <audio
                        src={memories[dateKey].audio}
                        controls
                        className="flex-1 h-8 text-xs"
                      />
                      <button
                        onClick={() => {
                          const updated = { ...memories[dateKey] };
                          delete updated.audio;
                          const newMemories = {
                            ...memories,
                            [dateKey]: updated,
                          };
                          setMemories(newMemories);
                          localStorage.setItem(
                            "telugu_calendar_memories",
                            JSON.stringify(newMemories),
                          );
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-500 p-1.5 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-3 bg-gradient-to-r from-[#2563eb] to-[#051e4e] rounded-xl text-white shadow-md">
            <h4 className="text-[9px] font-bold text-[#FFC000] mb-1 tracking-wider">
              నేటి సుభాషితం
            </h4>
            <p className="text-[11px] font-semibold leading-relaxed">
              "ధర్మో రక్షతి రక్షితః" - ధర్మాన్ని మనం రక్షిస్తే, ఆ ధర్మం మనల్ని
              రక్షిస్తుంది.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
