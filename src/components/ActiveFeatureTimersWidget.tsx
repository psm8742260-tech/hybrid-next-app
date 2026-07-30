import React from 'react';
import { Clock } from 'lucide-react';
import { ControlState } from '../types';
import { INITIAL_FEATURES } from '../data';
import { FeatureTimerBadge } from './FeatureTimerBadge';

interface ActiveFeatureTimersWidgetProps {
  featureTimers: Record<string, number>;
  rawFeatureStates: Record<string, ControlState>;
  onSimulateTimer?: (id: string) => void;
}

export const ActiveFeatureTimersWidget: React.FC<ActiveFeatureTimersWidgetProps> = ({ 
  featureTimers, 
  rawFeatureStates, 
  onSimulateTimer 
}) => {
  const activeTimerIds = Object.keys(featureTimers).filter(id => {
    const state = rawFeatureStates[id];
    return state === 'temp_on';
  });

  if (activeTimerIds.length === 0) return null;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-3.5 border border-slate-800 shadow-xl space-y-2.5 animate-fade-in w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-100">
            సక్రియ సేవలు & గడువు సమయాలు / Active Services & Timers
          </span>
        </div>
        <span className="bg-slate-800 text-[8px] font-bold text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
          {activeTimerIds.length} Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {activeTimerIds.map(id => {
          const feat = INITIAL_FEATURES.find(f => f.id === id);
          if (!feat) return null;
          
          const isPostpaid = [
            'feat_biopower',
            'feat_bp_sugar',
            'feat_doctor_scan',
            'feat_weather_report',
            'feat_invoice_generator'
          ].includes(id);

          return (
            <div 
              key={id} 
              className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2 hover:border-slate-700 transition"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[9px] text-slate-200 font-extrabold truncate" title={feat.nameTe}>
                  {feat.nameTe}
                </div>
                <div className="text-[7.5px] text-slate-500 font-mono font-medium truncate" title={feat.nameEn}>
                  {feat.nameEn}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <FeatureTimerBadge 
                  expiresAt={featureTimers[id]} 
                  type={isPostpaid ? 'postpaid' : 'premium'} 
                  onSimulate={onSimulateTimer ? () => onSimulateTimer(id) : undefined}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
