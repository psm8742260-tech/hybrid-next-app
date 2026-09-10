import React, { useState } from "react";
import { ArrowLeft, Clock } from "lucide-react";

interface ManualFeatureTimerProps {
  featureId: string;
  initialHours?: number;
  onSave: (hours: number, isOn: boolean) => void;
  type: "premium" | "postpaid";
}

export const ManualFeatureTimer: React.FC<ManualFeatureTimerProps> = ({
  featureId,
  initialHours = 24,
  onSave,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(initialHours);
  const [isOn, setIsOn] = useState(true);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold tracking-tight border transition-colors ${
          type === "premium"
            ? "bg-blue-50 border-blue-100 text-[#1e3a8a] hover:bg-blue-100"
            : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
        }`}
      >
        <Clock className="w-2.5 h-2.5" />
        <span>సెట్ టైమర్</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1.5 bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="p-1 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
      >
        <ArrowLeft className="w-3 h-3" />
      </button>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-10 h-5 text-[10px] text-center border border-gray-300 rounded font-bold outline-none focus:border-indigo-500"
          min={1}
        />
        <span className="text-[8px] text-gray-500 font-bold">గంటలు</span>
      </div>
      <button
        type="button"
        onClick={() => {
          const newState = !isOn;
          setIsOn(newState);
          onSave(hours, newState);
        }}
        className={`w-7 h-3.5 rounded-full relative inline-flex items-center transition-colors ${isOn ? "bg-emerald-500" : "bg-gray-300"}`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${isOn ? "translate-x-3.5" : "translate-x-0.5"}`}
        />
      </button>
    </div>
  );
};
