
import React, { useState } from 'react';
import { Banknote, CreditCard, Landmark, BookOpen, ChevronRight, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { PaymentMethod, Customer, CartItem } from '../types';

interface PaymentModalProps {
  total: number;
  subtotal: number;
  discountAmount: number;
  tax: number;
  surcharge: number;
  items: CartItem[];
  customer: Customer | null;
  onClose: () => void;
  onConfirm: (method: PaymentMethod, receivedAmount: number) => void;
  embedded?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  total, subtotal, discountAmount, tax, surcharge, items, customer, onClose, onConfirm, embedded = false 
}) => {
  const [method, setMethod] = useState<PaymentMethod>('Cash');
  const [receivedAmount, setReceivedAmount] = useState<string>(total.toString());
  
  const change = Math.max(0, parseFloat(receivedAmount || '0') - total);
  const isDebtDisabled = !customer;

  const quickAmounts = [
    total,
    Math.ceil(total / 10) * 10,
    Math.ceil(total / 50) * 50,
    Math.ceil(total / 100) * 100,
  ];

  const handleConfirm = () => {
    if (method === 'Cash' && parseFloat(receivedAmount) < total) {
      alert('Số tiền nhận không đủ!');
      return;
    }
    onConfirm(method, parseFloat(receivedAmount));
  };

  const content = (
    <div className={`bg-white h-full flex flex-col md:flex-row overflow-hidden ${!embedded ? 'w-full max-w-6xl shadow-2xl rounded-none' : 'w-full'}`}>
      
      {/* Cột 1: Thông tin tóm tắt - CHỈ HIỆN KHI KHÔNG EMBEDDED */}
      {!embedded && (
        <div className="hidden lg:flex w-72 bg-slate-50 border-r border-slate-100 flex-col h-full shrink-0">
          <div className="p-8 border-b border-slate-200 bg-white">
            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Thanh toán</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>Tạm tính</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-red-400 uppercase">
                <span>Giảm giá</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>Thuế (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cần thanh toán</p>
            <h3 className="text-3xl font-black text-[#0062FF] tracking-tighter">${total.toFixed(2)}</h3>
          </div>
        </div>
      )}

      {/* Middle Section: Payment Methods - Tăng không gian hiển thị */}
      <div className="flex-1 p-10 space-y-10 overflow-y-auto custom-scrollbar bg-white min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase italic">Phương thức</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Chọn cách khách hàng trả tiền</p>
          </div>
          {embedded && (
             <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all shadow-sm">
                <ArrowLeft size={20} />
             </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { id: 'Cash', label: 'Tiền mặt', icon: Banknote, color: 'text-green-500', bg: 'bg-green-50', desc: 'Thanh toán tiền giấy' },
            { id: 'Card', label: 'Thẻ / POS', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Visa, Master, Napas' },
            { id: 'Transfer', label: 'Chuyển khoản', icon: Landmark, color: 'text-purple-500', bg: 'bg-purple-50', desc: 'QR Code, Banking' },
            { id: 'Credit', label: 'Ghi nợ (Debt)', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-50', disabled: isDebtDisabled, desc: 'Lưu vào sổ nợ' },
          ].map((m) => {
            const Icon = m.icon;
            const isActive = method === m.id;
            const isDisabled = m.disabled;

            return (
              <button
                key={m.id}
                disabled={isDisabled}
                onClick={() => {
                  setMethod(m.id as PaymentMethod);
                  if (m.id !== 'Cash') setReceivedAmount(total.toString());
                }}
                className={`p-7 rounded-[2.5rem] border-2 flex items-center gap-5 transition-all relative text-left group ${
                  isActive 
                    ? 'border-[#0062FF] bg-blue-50/20' 
                    : isDisabled 
                      ? 'opacity-30 grayscale cursor-not-allowed border-transparent bg-slate-50' 
                      : 'border-slate-50 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`p-4 rounded-2xl transition-all shrink-0 ${isActive ? 'bg-[#0062FF] text-white shadow-xl scale-110' : m.bg + ' ' + m.color}`}>
                  <Icon size={28} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`text-sm font-black uppercase tracking-tight block truncate ${isActive ? 'text-[#0062FF]' : 'text-slate-900'}`}>{m.label}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block truncate">{m.desc}</span>
                </div>
                
                {m.id === 'Credit' && isDisabled && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-800 text-white text-[7px] px-2 py-0.5 rounded-full font-black">
                    <AlertCircle size={8} /> CẦN CHỌN KHÁCH
                  </div>
                )}
                {isActive && <div className="absolute bottom-4 right-6 text-[#0062FF]"><Check size={24} strokeWidth={4} /></div>}
              </button>
            );
          })}
        </div>

        {customer && (
          <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-center justify-between shadow-sm animate-in zoom-in">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-[#0062FF] shadow-sm border border-blue-100">
                {customer.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 tracking-tight">{customer.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-black text-white bg-[#0062FF] px-2 py-0.5 rounded uppercase tracking-widest">Hạng {customer.tier}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{customer.phone}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Số dư hiện tại</p>
              <p className={`text-xl font-black ${customer.balance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                ${customer.balance.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Section: Keypad & Action - Giữ kích thước cố định */}
      <div className="w-full md:w-[400px] bg-slate-900 p-10 flex flex-col shadow-inner shrink-0">
        <div className="flex-1 space-y-10">
          <div className="text-center space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Tổng trả</p>
            <h3 className="text-6xl font-black text-white tracking-tighter italic">${total.toFixed(2)}</h3>
          </div>

          {method === 'Cash' ? (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-400">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Khách đưa</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-700">$</span>
                  <input 
                    type="number" 
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    className="w-full bg-slate-800 text-white px-12 py-7 rounded-[2rem] text-4xl font-black outline-none border-4 border-transparent focus:border-[#0062FF] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quickAmounts.map((amt) => (
                  <button 
                    key={amt} 
                    onClick={() => setReceivedAmount(amt.toString())}
                    className="py-5 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-black text-white hover:bg-white hover:text-slate-900 transition-all shadow-sm uppercase tracking-widest"
                  >
                    ${amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="p-8 bg-emerald-500/10 rounded-[2.5rem] border border-emerald-500/20 flex items-center justify-between shadow-lg">
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Tiền thừa</span>
                 <span className="text-3xl font-black text-emerald-400">${change.toFixed(2)}</span>
              </div>
            </div>
          ) : method === 'Credit' ? (
            <div className="p-10 bg-orange-500/10 rounded-[3rem] border border-orange-500/20 space-y-6 animate-in zoom-in">
               <div className="flex items-center gap-4 text-orange-400">
                  <div className="p-3 bg-orange-500/20 rounded-2xl"><BookOpen size={28} /></div>
                  <h4 className="font-black text-xl uppercase tracking-tighter italic">Ghi nợ</h4>
               </div>
               <p className="text-sm font-bold text-orange-200/60 leading-relaxed uppercase">
                  Đơn hàng trị giá <span className="text-white">${total.toFixed(2)}</span> sẽ được ghi vào sổ nợ của <span className="text-white">{customer?.name}</span>.
               </p>
            </div>
          ) : (
            <div className="py-24 text-center opacity-40 flex flex-col items-center gap-6 animate-in fade-in">
               <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-white border border-white/10">
                <Landmark size={48} className="text-white" />
               </div>
               <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] max-w-[180px] leading-relaxed">Vui lòng kiểm tra thiết bị thanh toán ngoại vi</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button 
            onClick={handleConfirm}
            className="w-full py-7 bg-[#0062FF] text-white font-black rounded-[2.5rem] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(0,98,255,0.3)] hover:bg-white hover:text-slate-900 transition-all uppercase text-sm tracking-[0.2em] group"
          >
            <Check size={28} strokeWidth={4} />
            XÁC NHẬN
            <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="fixed inset-0 z-[400] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl h-full shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-right duration-500 overflow-hidden">
        {content}
      </div>
    </div>
  );
};

export default PaymentModal;
