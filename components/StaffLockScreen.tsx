
import React, { useState } from 'react';
import { MOCK_EMPLOYEES } from '../constants';
import { Employee, AttendanceRecord } from '../types';
import { Delete, Unlock, Fingerprint, Clock, CheckCircle2, UserCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../store';

interface StaffLockScreenProps {
  onUnlock: (employee: Employee) => void;
}

const StaffLockScreen: React.FC<StaffLockScreenProps> = ({ onUnlock }) => {
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
    showToast(`Welcome, ${verifiedEmployee.name}!`, 'success');
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
      <div className="fixed inset-0 z-[999] bg-[#0F172A] flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-card p-10 flex flex-col items-center animate-in zoom-in-95 duration-500">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-[2.5rem] bg-slate-800 flex items-center justify-center overflow-hidden border-4 border-white/10 shadow-2xl">
              {verifiedEmployee.avatar ? (
                <img src={verifiedEmployee.avatar} alt={verifiedEmployee.name} className="w-full h-full object-cover" />
              ) : (
                <UserCircle2 size={64} className="text-white/20" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-[#0F172A] shadow-lg">
              <CheckCircle2 size={16} className="text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-white mb-1 tracking-tight">Welcome, {verifiedEmployee.name}</h2>
          <p className="text-primary font-bold uppercase tracking-widest text-[10px] mb-8">{verifiedEmployee.role} • Employee Verified</p>

          <div className="w-full grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Shift Start</p>
              <p className="text-white font-black text-sm">08:00 AM</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Scheduled End</p>
              <p className="text-white font-black text-sm">04:00 PM</p>
            </div>
          </div>

          {!isAlreadyCheckedIn ? (
            <button
              onClick={handleCheckIn}
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all scale-105 active:scale-95 group"
            >
              <Clock size={20} />
              CONFIRM CHECK-IN
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handleEnterSystem}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all scale-105 active:scale-95 group"
            >
              <Unlock size={20} />
              ENTER POS SYSTEM
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          <button
            onClick={() => setVerifiedEmployee(null)}
            className="mt-8 text-white/30 hover:text-white/50 font-bold uppercase tracking-widest text-[10px] transition-colors"
          >
            Not you? Switch Employee
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-12 text-center">
          <div className="w-32 h-32 rounded-[3rem] flex items-center justify-center mb-6 mx-auto backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
            <img
              src="https://sv2.anhsieuviet.com/2025/12/30/image3592096a95bf966f.png"
              alt="Fast POS Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter italic uppercase">Fast POS</h1>
          <p className="text-white/50 font-bold uppercase tracking-widest text-[10px]">Enter 4-digit PIN to access system</p>
        </div>

        <div className="flex gap-4 mb-12">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${pin.length > i
                ? 'bg-primary border-primary scale-125 shadow-lg shadow-primary/50'
                : 'border-white/10 bg-white/5'
                } ${error ? 'border-red-500 animate-bounce' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 w-full max-w-[320px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-20 h-20 bg-white/5 hover:bg-white/10 text-white rounded-[2.5rem] text-2xl font-black transition-all active:scale-90 border border-white/5 flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div className="w-20 h-20 bg-transparent text-white/20 flex items-center justify-center"><Fingerprint size={32} /></div>
          <button
            onClick={() => handleNumberClick('0')}
            className="w-20 h-20 bg-white/5 hover:bg-white/10 text-white rounded-[2.5rem] text-2xl font-black transition-all border border-white/5 flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-20 h-20 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-[2.5rem] transition-all flex items-center justify-center"
          >
            <Delete size={28} />
          </button>
        </div>

        {error && <p className="mt-8 text-red-400 font-bold animate-pulse uppercase text-[10px] tracking-widest">Access Denied • Invalid PIN</p>}
      </div>
    </div>
  );
};

export default StaffLockScreen;
