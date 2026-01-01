
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_EMPLOYEES } from '../constants';
import { Employee, AttendanceRecord } from '../types';
import { Delete, Unlock, Fingerprint, Clock, CheckCircle2, UserCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';

interface StaffLockScreenProps {
  onUnlock: (employee: Employee) => void;
}

const StaffLockScreen: React.FC<StaffLockScreenProps> = ({ onUnlock }) => {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [verifiedEmployee, setVerifiedEmployee] = useState<Employee | null>(null);
  const { checkIn, showToast } = useStore();

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleVerify = () => {
    const staff = MOCK_EMPLOYEES.find(e => e.pin === pin);
    if (staff) {
      setVerifiedEmployee(staff);
      setPin('');
    } else {
      setError(true);
      setPin('');
    }
  };

  if (pin.length === 4 && !verifiedEmployee) {
    setTimeout(handleVerify, 200);
  }

  const handleCheckIn = () => {
    if (!verifiedEmployee) return;

    const record: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      employeeId: verifiedEmployee.id,
      branchId: 'BR-MAIN', // Mock branch
      checkInTime: new Date().toISOString(),
      method: 'pin',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      deviceId: 'TERMINAL-01',
      status: 'active'
    };

    checkIn(record);
    showToast(`${t('common.welcome')}, ${verifiedEmployee.name}!`, 'success');
    onUnlock(verifiedEmployee);
  };

  const handleEnterSystem = () => {
    if (verifiedEmployee) {
      onUnlock(verifiedEmployee);
    }
  };

  if (verifiedEmployee) {
    const isAlreadyCheckedIn = verifiedEmployee.checkInStatus === 'checked_in';

    return (
      <div className="fixed inset-0 z-[999] bg-[#FFFDF5] flex items-center justify-center p-4 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />

        <div className="w-full max-w-md bg-white/40 backdrop-blur-xl border border-white/60 p-10 flex flex-col items-center rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] animate-in zoom-in-95 duration-500">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-[3rem] bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl">
              {verifiedEmployee.avatar ? (
                <img src={verifiedEmployee.avatar} alt={verifiedEmployee.name} className="w-full h-full object-cover" />
              ) : (
                <UserCircle2 size={64} className="text-slate-200" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <CheckCircle2 size={16} className="text-primary-900" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-primary mb-1 tracking-tight">
            {t('lockscreen.welcome_message', { name: verifiedEmployee.name })}
          </h2>
          <p className="text-secondary-600 font-bold uppercase tracking-widest text-[9px] mb-8">
            {verifiedEmployee.role} • {t('lockscreen.ready_message')}
          </p>

          <div className="w-full grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/60 rounded-3xl p-5 border border-white/80 shadow-sm">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider mb-1">{t('lockscreen.shift_start')}</p>
              <p className="text-primary-800 font-black text-sm">08:00 AM</p>
            </div>
            <div className="bg-white/60 rounded-3xl p-5 border border-white/80 shadow-sm">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-wider mb-1">{t('lockscreen.shift_end')}</p>
              <p className="text-primary-800 font-black text-sm">04:00 PM</p>
            </div>
          </div>

          {!isAlreadyCheckedIn ? (
            <button
              onClick={handleCheckIn}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all scale-105 active:scale-95 group"
            >
              <Clock size={20} />
              {t('lockscreen.confirm_checkin')}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handleEnterSystem}
              className="w-full bg-accent text-primary-900 font-black py-5 rounded-[2rem] shadow-xl shadow-accent/20 flex items-center justify-center gap-3 transition-all scale-105 active:scale-95 group"
            >
              <Unlock size={20} />
              {t('lockscreen.enter_pos')}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          <button
            onClick={() => setVerifiedEmployee(null)}
            className="mt-8 text-slate-300 hover:text-primary-500 font-bold uppercase tracking-widest text-[9px] transition-colors"
          >
            {t('lockscreen.switch_employee')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] bg-[#FFFDF5] flex items-center justify-center p-4 overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-md flex flex-col items-center relative">
        <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-28 h-28 rounded-[2.5rem] bg-white flex items-center justify-center mb-8 mx-auto border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
            <img
              src="https://sv2.anhsieuviet.com/2025/12/30/image3592096a95bf966f.png"
              alt="Fast POS Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-black text-primary mb-2 tracking-tighter italic">FastPOS</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[8px] ml-[0.3em]">{t('lockscreen.enter_pin')}</p>
        </div>

        <div className="flex gap-5 mb-14">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${pin.length > i
                ? 'bg-primary border-primary scale-125 shadow-lg shadow-primary/30'
                : 'border-slate-100 bg-white shadow-inner'
                } ${error ? 'border-red-400 animate-bounce bg-red-50' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 w-full max-w-[340px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-20 h-20 bg-white/40 hover:bg-white text-primary rounded-[2.5rem] text-2xl font-black transition-all active:scale-90 border border-white/60 flex items-center justify-center shadow-sm hover:shadow-md"
            >
              {num}
            </button>
          ))}
          <div className="w-20 h-20 bg-transparent text-slate-100 flex items-center justify-center">
            <Fingerprint size={32} strokeWidth={1.5} />
          </div>
          <button
            onClick={() => handleNumberClick('0')}
            className="w-20 h-20 bg-white/40 hover:bg-white text-primary rounded-[2.5rem] text-2xl font-black transition-all border border-white/60 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-20 h-20 bg-red-50 hover:bg-red-100 text-red-500 rounded-[2.5rem] transition-all flex items-center justify-center shadow-sm"
          >
            <Delete size={28} />
          </button>
        </div>

        {error && (
          <div className="mt-10 px-6 py-3 bg-red-50 text-red-500 rounded-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="font-black uppercase text-[9px] tracking-widest flex items-center gap-2">
              <AlertTriangle size={14} />
              {t('lockscreen.invalid_pin')}
            </p>
          </div>
        )}

        <div className="mt-16 opacity-30">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            {t('splash.powered_by')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaffLockScreen;
