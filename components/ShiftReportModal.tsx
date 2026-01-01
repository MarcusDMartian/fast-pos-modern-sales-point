
import React, { useState, useEffect } from 'react';
import { X, Banknote, Calculator, CheckCircle2, AlertTriangle, Clock, TrendingUp, ShoppingBag, LogOut } from 'lucide-react';
import { Employee, Order } from '../types';
import { useStore } from '../store';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters';

interface ShiftReportModalProps {
  employee: Employee;
  onClose: () => void;
  onConfirm: (reportData: any) => void;
  onLogout?: () => void;
}

const ShiftReportModal: React.FC<ShiftReportModalProps> = ({ employee, onClose, onConfirm, onLogout }) => {
  const { orders, enterpriseConfig } = useStore();
  const [actualCash, setActualCash] = useState('');
  const [step, setStep] = useState<'counting' | 'summary'>('counting');

  // Calculate actual shift data
  const shiftOrders = orders.filter(o => o.createdBy === employee.name); // Simple match for mock
  const totalSales = shiftOrders.reduce((sum, o) => sum + o.total, 0);
  const ordersCount = shiftOrders.length;

  // Calculate duration
  const [duration, setDuration] = useState('0h 0m');
  useEffect(() => {
    if (employee.lastCheckIn) {
      const start = new Date(employee.lastCheckIn).getTime();
      const diff = Date.now() - start;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setDuration(`${h}h ${m}m`);
    }
  }, [employee.lastCheckIn]);

  const expectedCash = totalSales; // Simple mock logic
  const discrepancy = parseFloat(actualCash || '0') - expectedCash;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">Shift Conclusion</h2>
            <p className="text-white/40 font-bold text-[10px] uppercase tracking-widest mt-1">Personnel: {employee.name} • {employee.role}</p>
          </div>
          <div className="flex items-center gap-3">
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all flex items-center gap-2 text-xs font-black uppercase"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            )}
            <button onClick={onClose} className="p-3 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white rounded-full transition-all"><X /></button>
          </div>
        </div>

        <div className="p-10">
          {step === 'counting' ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-500">
              <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 flex items-center gap-8 shadow-inner">
                <div className="w-20 h-20 bg-primary/20 rounded-[1.5rem] flex items-center justify-center text-primary shadow-lg shadow-primary/20"><Banknote size={40} /></div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] block mb-3">Actual Cash Processed</label>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-white/20">{getCurrencySymbol(enterpriseConfig.currency)}</span>
                    <input
                      autoFocus
                      type="number"
                      placeholder="0.00"
                      value={actualCash}
                      onChange={(e) => setActualCash(e.target.value)}
                      className="w-full bg-transparent text-5xl font-black text-white outline-none placeholder:text-white/5"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} className="text-white/20" />
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Expected In System</p>
                  </div>
                  <p className="text-3xl font-black text-white">{formatCurrency(expectedCash, enterpriseConfig.currency)}</p>
                </div>
                <div className={`p-8 rounded-[2rem] border ${discrepancy === 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className="opacity-50" />
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Variance / Discrepancy</p>
                  </div>
                  <p className="text-3xl font-black tracking-tight">{formatCurrency(discrepancy, enterpriseConfig.currency)}</p>
                </div>
              </div>

              <button
                onClick={() => setStep('summary')}
                disabled={!actualCash}
                className="w-full py-6 bg-primary text-white font-black rounded-[2rem] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 disabled:opacity-20 flex items-center justify-center gap-4 text-sm tracking-widest uppercase"
              >
                <Calculator size={22} className="opacity-50" />
                Validate & Show Performance
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/5 text-center">
                  <Clock size={24} className="mx-auto mb-3 text-white/20" />
                  <p className="text-white/30 text-[9px] font-bold uppercase mb-1">Total Duration</p>
                  <p className="text-lg font-black text-white">{duration}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/5 text-center">
                  <ShoppingBag size={24} className="mx-auto mb-3 text-white/20" />
                  <p className="text-white/30 text-[9px] font-bold uppercase mb-1">Orders Count</p>
                  <p className="text-lg font-black text-white">{ordersCount}</p>
                </div>
                <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/5 text-center">
                  <TrendingUp size={24} className="mx-auto mb-3 text-white/20" />
                  <p className="text-white/30 text-[9px] font-bold uppercase mb-1">Revenue</p>
                  <p className="text-lg font-black text-white">{formatCurrency(totalSales, enterpriseConfig.currency)}</p>
                </div>
              </div>

              <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <CheckCircle2 size={12} />
                  Final Audit Summary
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Base Payout (Estimated)</span>
                    <span className="text-lg font-black text-white">{formatCurrency((ordersCount * 10000 + totalSales * 0.05), enterpriseConfig.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-b border-white/5">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Variance Status</span>
                    <span className={`text-sm font-black px-3 py-1 rounded-lg ${discrepancy === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {discrepancy === 0 ? 'PERFECT MATCH' : `${discrepancy > 0 ? 'OVERAGE' : 'SHORTAGE'} DETECTED`}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onConfirm({ totalSales, ordersCount, discrepancy })}
                className="w-full py-6 bg-emerald-500 text-white font-black rounded-[2rem] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-4 text-sm tracking-widest uppercase"
              >
                <CheckCircle2 size={24} className="opacity-50" />
                Submit Payroll & Close Shift
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiftReportModal;
