
import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, User, Phone, StickyNote, History } from 'lucide-react';
import { Table, Reservation } from '../types';

interface ReservationScheduleModalProps {
  table: Table;
  onClose: () => void;
}

const ReservationScheduleModal: React.FC<ReservationScheduleModalProps> = ({ table, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const dailyReservations = useMemo(() => {
    return (table.allReservations || [])
      .filter(res => res.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [table.allReservations, selectedDate]);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[var(--primary-700)]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col h-[75vh]">
        {/* Header */}
        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-[var(--primary-700)]">Lịch bàn {table.number}</h2>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Xem danh sách đặt bàn chi tiết</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Date Selector */}
        <div className="px-10 py-6 bg-slate-50/50 border-b border-slate-50">
          <div className="relative max-w-xs mx-auto">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--primary-600)]" size={18} />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 font-black text-sm text-[var(--primary-700)] outline-none focus:border-[var(--primary-600)] transition-all"
            />
          </div>
        </div>

        {/* Schedule List */}
        <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
          {dailyReservations.length > 0 ? (
            dailyReservations.map((res) => (
              <div key={res.id} className="relative pl-12 before:content-[''] before:absolute before:left-[1.125rem] before:top-8 before:bottom-[-1.5rem] before:w-0.5 before:bg-slate-100 last:before:hidden">
                {/* Time Indicator Circle */}
                <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-blue-50 text-[var(--primary-600)] flex items-center justify-center z-10 border-4 border-white shadow-sm font-black text-[10px]">
                  {res.startTime}
                </div>
                
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-primary-100/50 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-black text-[var(--primary-700)] text-xs">
                           {res.customerName.charAt(0)}
                         </div>
                         <p className="font-black text-[var(--primary-700)]">{res.customerName}</p>
                      </div>
                      <span className="px-3 py-1 bg-white text-emerald-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-50">
                        ĐÃ XÁC NHẬN
                      </span>
                   </div>

                   <div className="grid grid-cols-2 gap-4 text-[10px] font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                         <Clock size={14} className="text-slate-300" />
                         <span>Thời lượng: {res.duration} phút</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <Phone size={14} className="text-slate-300" />
                         <span>{res.customerPhone}</span>
                      </div>
                   </div>

                   {res.notes && (
                     <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2 text-[10px] italic text-slate-400">
                        <StickyNote size={14} className="shrink-0" />
                        <p>{res.notes}</p>
                     </div>
                   )}
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
               <History size={64} className="mb-4" />
               <p className="font-black text-xs uppercase tracking-[0.3em]">Trống lịch trong ngày</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationScheduleModal;
