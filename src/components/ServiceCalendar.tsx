import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, AlertTriangle, Sparkles, X, Lock } from 'lucide-react';
import { ServiceCategory, Booking, ControlState } from '../types';
import SecureVault from './SecureVault';

interface ServiceCalendarProps {
  service: ServiceCategory;
  onClose: () => void;
  onBook: (booking: Booking) => void;
  controlState?: ControlState;
}

export default function ServiceCalendar({ service, onClose, onBook, controlState = 'temp_on' }: ServiceCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<'morning' | 'afternoon' | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showVault, setShowVault] = useState(false);

  // Generate dynamic availability for days 1 to 28 (July 2026)
  // Let some days be fully booked (Red) and others available (Green)
  const isDayBooked = (day: number) => {
    // Arbitrary rules for booked days
    return [5, 6, 12, 13, 19, 20, 26, 27, 15, 22].includes(day);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !selectedSlot || !customerName || !customerPhone) return;

    const newBooking: Booking = {
      id: 'b_' + Date.now(),
      serviceId: service.id,
      serviceName: service.nameTe + ' (' + service.nameEn + ')',
      date: `2026-07-${selectedDay.toString().padStart(2, '0')}`,
      slot: selectedSlot,
      status: 'confirmed',
      customerName,
      customerPhone,
    };

    onBook(newBooking);
    setIsSuccess(true);
  };

  if (controlState === 'temp_off' || controlState === 'perm_off') {
    return (
      <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-t-8 border-red-600 text-center relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">షెడ్యూలింగ్ తాత్కాలికంగా నిలిపివేయబడింది</h3>
          <p className="text-sm font-semibold text-red-600 mb-1">Scheduling Temporarily Unavailable</p>
          <p className="text-gray-600 text-xs">
            అడ్మిన్ ద్వారా ఈ సర్వీస్ క్యాలెండర్ ప్రస్తుతం ఆఫ్ చేయబడింది. దయచేసి తర్వాత ప్రయత్నించండి.
          </p>
        </div>
      </div>
    );
  }

  const isUpgraded = controlState === 'perm_upgrade';

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transition-all duration-300 relative ${
        isUpgraded ? 'border-4 border-[#FFC000] ring-4 ring-[#FFC000]/20' : 'border border-gray-100'
      }`}>
        
        {/* Header */}
        <div className="bg-[#082c75] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-[#FFC000]" />
            <div>
              <h3 className="font-bold text-lg">{service.nameTe} బుకింగ్</h3>
              <p className="text-xs text-gray-300 font-mono">Book {service.nameEn} • July 2026</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowVault(!showVault)} className="text-[#FFC000] hover:text-white rounded-full p-1 hover:bg-white/10">
              <Lock className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="text-white/80 hover:text-white rounded-full p-1 hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showVault ? (
          <div className="p-6">
             <SecureVault />
             <button onClick={() => setShowVault(false)} className="mt-4 w-full text-center text-xs text-gray-500 underline">Close Vault</button>
          </div>
        ) : isSuccess ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-scale" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">బుకింగ్ విజయవంతమైంది!</h4>
            <p className="text-green-700 font-semibold text-sm">Booking Confirmed Successfully!</p>
            
            <div className="my-6 p-4 bg-gray-50 rounded-xl text-left text-sm space-y-2 border border-gray-100">
              <div><strong className="text-gray-500">సర్వీస్ / Service:</strong> {service.nameTe}</div>
              <div><strong className="text-gray-500">తేదీ / Date:</strong> July {selectedDay}, 2026</div>
              <div><strong className="text-gray-500">సమయం / Slot:</strong> {selectedSlot === 'morning' ? 'ఉదయం / Morning' : 'మధ్యాహ్నం / Afternoon'}</div>
              <div><strong className="text-gray-500">ధర / Base Price:</strong> ₹{service.basePrice}</div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#082c75] text-[#FFC000] font-bold rounded-lg hover:bg-[#082c75]/90 transition"
            >
              సరే / Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Calendar Grid Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-gray-700">తేదీని ఎంచుకోండి / Select Date:</span>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-emerald-100 border border-emerald-400 rounded-sm inline-block"></span>
                    <span className="text-emerald-700 font-medium">అందుబాటులో ఉంది</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-rose-100 border border-rose-400 rounded-sm inline-block"></span>
                    <span className="text-rose-700 font-medium">పూర్తి అయింది</span>
                  </div>
                </div>
              </div>

              {/* July 2026 calendar simulation starting on Wednesday (July 1st) */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-gray-500 border-b border-gray-100 pb-2">
                <span>Ad</span><span>So</span><span>Ma</span><span>Bu</span><span>Gu</span><span>Sh</span><span>Sh</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 pt-2">
                {/* Empty days for Wed starting July 2026 */}
                <div className="text-transparent"></div>
                <div className="text-transparent"></div>
                
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const booked = isDayBooked(day);
                  const isSelected = selectedDay === day;
                  
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={booked}
                      onClick={() => {
                        setSelectedDay(day);
                        setSelectedSlot(null);
                      }}
                      className={`h-9 rounded-lg flex flex-col items-center justify-center relative font-bold text-sm transition-all ${
                        booked 
                          ? 'bg-rose-50 text-rose-400 border border-rose-200 cursor-not-allowed opacity-70' 
                          : isSelected
                            ? 'bg-[#082c75] text-white ring-2 ring-[#FFC000]' 
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <span>{day}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Morning/Afternoon Slot selector */}
            {selectedDay && (
              <div className="space-y-2">
                <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#082c75]" />
                  <span>సమయ స్లాట్ / Time Slot:</span>
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot('morning')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      selectedSlot === 'morning'
                        ? 'bg-[#082c75] text-white border-[#082c75]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm">ఉదయం / Morning</div>
                    <div className="text-xs opacity-80 mt-0.5">09:00 AM - 12:00 PM</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSlot('afternoon')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      selectedSlot === 'afternoon'
                        ? 'bg-[#082c75] text-white border-[#082c75]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-sm">మధ్యాహ్నం / Afternoon</div>
                    <div className="text-xs opacity-80 mt-0.5">02:00 PM - 05:00 PM</div>
                  </button>
                </div>
              </div>
            )}

            {/* Customer Details Form */}
            {selectedDay && selectedSlot && (
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">కస్టమర్ పేరు / Your Name:</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="కస్టమర్ పేరు రాయండి"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#082c75]"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-600 block">మొబైల్ నెంబర్ / Mobile Number:</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="10 అంకెల మొబైల్ నెంబర్"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#082c75]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Booking Action */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-1.5"
              >
                <span>← వెనుకకు / Go Back</span>
              </button>
              <button
                type="submit"
                disabled={!selectedDay || !selectedSlot || !customerName || !customerPhone}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg text-center transition-all ${
                  (!selectedDay || !selectedSlot || !customerName || !customerPhone)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isUpgraded
                      ? 'bg-[#FFC000] text-[#082c75] shadow-md shadow-[#FFC000]/20 hover:brightness-105'
                      : 'bg-[#082c75] text-[#FFC000] hover:bg-[#082c75]/95'
                }`}
              >
                బుకింగ్ చేయండి / Confirm Booking
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
