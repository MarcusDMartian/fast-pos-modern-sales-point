
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Banknote, CreditCard, Landmark, BookOpen, ChevronRight, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { PaymentMethod, Customer, CartItem } from '../types';
import { useStore } from '../store';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters';

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
  const { t } = useTranslation();
  const { enterpriseConfig } = useStore();
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
      alert(t('payment.insufficient_amount', 'Số tiền nhận không đủ!'));
      return;
    }
    onConfirm(method, parseFloat(receivedAmount));
  };

  const content = (
    <div className={`bg-[#FFFDF5] h-full flex flex-col md:flex-row overflow-hidden ${!embedded ? 'w-full max-w-6xl shadow-2xl md:rounded-[2.5rem]' : 'w-full'}`}>

      {/* Cột 1: Thông tin tóm tắt - CHỈ HIỆN KHI KHÔNG EMBEDDED TRÊN DESKTOP */}
      {!embedded && (
        <div className="hidden lg:flex w-72 bg-white/50 backdrop-blur-md border-r border-slate-100 flex-col h-full shrink-0">
          <div className="p-8 border-b border-slate-100/50">
            <h2 className="text-xl font-black text-primary uppercase italic tracking-tight text-center">{t('payment.summary')}</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            <div className="space-y-4">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>{t('payment.subtotal')}</span>
                <span className="text-slate-600">{formatCurrency(subtotal, enterpriseConfig.currency)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-red-500 uppercase tracking-wider">
                <span>{t('payment.discount')}</span>
                <span>-{formatCurrency(discountAmount, enterpriseConfig.currency)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>{t('payment.tax')} (10%)</span>
                <span className="text-slate-600">{formatCurrency(tax, enterpriseConfig.currency)}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{t('payment.total')}</p>
              <h3 className="text-3xl font-black text-primary tracking-tighter">{formatCurrency(total, enterpriseConfig.currency)}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Middle Section: Payment Methods */}
      <div className="flex-1 p-6 md:p-10 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar bg-white/30">
        <div className="flex items-center justify-between">
          <div className="animate-in slide-in-from-left duration-500">
            <h2 className="text-xl md:text-2xl font-black text-primary uppercase italic">{t('payment.method')}</h2>
            <p className="text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] mt-0.5">{t('payment.select_method', 'Chọn cách thức thanh toán')}</p>
          </div>
          {embedded && (
            <button onClick={onClose} className="p-2 md:p-3 bg-white text-slate-400 hover:text-red-500 rounded-2xl transition-all shadow-sm border border-slate-100">
              <ArrowLeft size={18} md:size={20} />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {[
            { id: 'Cash', label: t('payment.cash'), icon: Banknote, color: 'text-emerald-500', bg: 'bg-emerald-50', desc: t('payment.cash_desc', 'Tiền giấy') },
            { id: 'Card', label: t('payment.card'), icon: CreditCard, color: 'text-secondary-600', bg: 'bg-secondary-50', desc: t('payment.card_desc', 'Thẻ NH') },
            { id: 'Transfer', label: t('payment.transfer'), icon: Landmark, color: 'text-purple-500', bg: 'bg-purple-50', desc: t('payment.transfer_desc', 'Banking') },
            { id: 'Credit', label: t('payment.credit'), icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-50', disabled: isDebtDisabled, desc: t('payment.credit_desc', 'Sổ nợ') },
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
                className={`p-4 md:p-6 rounded-[2rem] border-2 flex items-center gap-3 md:gap-4 transition-all relative text-left ${isActive
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5 scale-[1.02]'
                  : isDisabled
                    ? 'opacity-30 grayscale cursor-not-allowed border-transparent bg-slate-50'
                    : 'border-white bg-white hover:border-primary/20 hover:bg-primary/5 shadow-sm'
                  }`}
              >
                <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all shrink-0 ${isActive ? 'bg-primary text-white shadow-lg' : m.bg + ' ' + m.color}`}>
                  <Icon size={20} md:size={24} strokeWidth={2.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`text-[11px] md:text-xs font-black uppercase tracking-tight block truncate ${isActive ? 'text-primary' : 'text-slate-900'}`}>{m.label}</span>
                  <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest block truncate">{isActive ? t('common.selected', 'Đã chọn') : m.desc}</span>
                </div>
                {isActive && <div className="absolute top-2 right-2 text-primary animate-in zoom-in"><Check size={16} strokeWidth={5} /></div>}
              </button>
            );
          })}
        </div>

        {customer && (
          <div className="p-5 md:p-6 bg-secondary/5 rounded-[2rem] border border-secondary/10 flex items-center justify-between shadow-sm animate-in slide-up duration-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-xl text-primary shadow-sm border border-secondary/10">
                {customer.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-black text-primary tracking-tight">{customer.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[8px] font-black text-white bg-secondary px-2 py-0.5 rounded-full uppercase tracking-widest">{t('customers.tier', 'Loại')} {customer.tier}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{customer.phone}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{t('customers.balance', 'Số dư')}</p>
              <p className={`text-sm md:text-base font-black ${customer.balance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {formatCurrency(customer.balance, enterpriseConfig.currency)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Section: Keypad & Action */}
      <div className="w-full md:w-[380px] bg-white border-t md:border-t-0 md:border-l border-slate-100 p-6 md:p-10 flex flex-col shrink-0">
        <div className="flex-1 space-y-6 md:space-y-10">
          <div className="text-center md:text-left space-y-1">
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('payment.total')}</p>
            <h3 className="text-4xl md:text-5xl font-black text-primary-900 tracking-tighter italic">{formatCurrency(total, enterpriseConfig.currency)}</h3>
          </div>

          {method === 'Cash' ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">{t('payment.received_amount')}</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-slate-300 group-focus-within:text-primary transition-colors">{getCurrencySymbol(enterpriseConfig.currency)}</span>
                  <input
                    autoFocus
                    type="number"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-12 py-5 md:py-6 rounded-[1.5rem] text-3xl md:text-4xl font-black outline-none border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setReceivedAmount(amt.toString())}
                    className="py-3 md:py-4 bg-white border border-slate-100 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm uppercase tracking-widest active:scale-95"
                  >
                    {formatCurrency(amt, enterpriseConfig.currency)}
                  </button>
                ))}
              </div>

              <div className="p-5 md:p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center justify-between shadow-sm">
                <span className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t('payment.change')}</span>
                <span className="text-2xl md:text-3xl font-black text-emerald-600 tracking-tight">{formatCurrency(change, enterpriseConfig.currency)}</span>
              </div>
            </div>
          ) : method === 'Credit' ? (
            <div className="p-6 md:p-8 bg-orange-50 rounded-[2rem] border border-orange-100 space-y-4 animate-in zoom-in">
              <div className="flex items-center gap-3 text-orange-600">
                <div className="p-2 bg-orange-100 rounded-xl"><BookOpen size={20} /></div>
                <h4 className="font-black text-base uppercase tracking-tight italic">{t('payment.confirm_credit', 'Xác nhận ghi nợ')}</h4>
              </div>
              <p className="text-[10px] md:text-xs font-medium text-orange-800/70 leading-relaxed uppercase tracking-wider">
                {t('payment.credit_message', { amount: formatCurrency(total, enterpriseConfig.currency), name: customer?.name })}
              </p>
            </div>
          ) : (
            <div className="py-12 md:py-20 text-center opacity-40 flex flex-col items-center gap-4 animate-in fade-in">
              <div className="w-16 md:h-16 md:w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <Landmark size={32} />
              </div>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] max-w-[150px] leading-relaxed">{t('payment.waiting_device', 'Kết nối thiết bị thanh toán ngoại vi...')}</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button
            onClick={handleConfirm}
            className="w-full py-5 md:py-6 bg-primary text-white font-black rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center gap-3 md:gap-4 shadow-xl shadow-primary/20 hover:bg-primary-700 transition-all uppercase text-xs md:text-sm tracking-[0.2em] group active:scale-[0.98]"
          >
            <Check size={24} md:size={28} strokeWidth={4} />
            {t('payment.confirm_payment')}
            <ChevronRight size={18} md:size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col justify-end md:justify-center md:items-center bg-primary-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#FFFDF5] w-full max-w-6xl h-[90vh] md:h-5/6 shadow-2xl flex flex-col md:flex-row animate-in slide-in-from-bottom md:slide-in-from-right duration-500 overflow-hidden md:rounded-[3rem] rounded-t-[3rem]">
        {content}
      </div>
    </div>
  );
};

export default PaymentModal;
