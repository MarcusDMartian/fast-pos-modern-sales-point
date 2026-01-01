import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ArrowRight, ArrowLeft, Check, Scissors, ChevronRight } from 'lucide-react';
import { CartItem } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useStore } from '../store';

interface SplitOrderModalProps {
  items: CartItem[];
  onClose: () => void;
  onConfirm: (mainBill: CartItem[], subBill: CartItem[]) => void;
}

const SplitOrderModal: React.FC<SplitOrderModalProps> = ({ items, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const { enterpriseConfig } = useStore();
  const [mainBill, setMainBill] = useState<CartItem[]>([...items]);
  const [subBill, setSubBill] = useState<CartItem[]>([]);

  const moveToSub = (itemIdx: number) => {
    const item = mainBill[itemIdx];
    if (item.quantity > 1) {
      const newMain = [...mainBill];
      newMain[itemIdx] = { ...item, quantity: item.quantity - 1 };
      setMainBill(newMain);

      const subIdx = subBill.findIndex(i => i.id === item.id);
      if (subIdx > -1) {
        const newSub = [...subBill];
        newSub[subIdx] = { ...newSub[subIdx], quantity: newSub[subIdx].quantity + 1 };
        setSubBill(newSub);
      } else {
        setSubBill([...subBill, { ...item, quantity: 1 }]);
      }
    } else {
      setMainBill(mainBill.filter((_, i) => i !== itemIdx));
      const subIdx = subBill.findIndex(i => i.id === item.id);
      if (subIdx > -1) {
        const newSub = [...subBill];
        newSub[subIdx] = { ...newSub[subIdx], quantity: newSub[subIdx].quantity + 1 };
        setSubBill(newSub);
      } else {
        setSubBill([...subBill, item]);
      }
    }
  };

  const moveToMain = (itemIdx: number) => {
    const item = subBill[itemIdx];
    if (item.quantity > 1) {
      const newSub = [...subBill];
      newSub[itemIdx] = { ...item, quantity: item.quantity - 1 };
      setSubBill(newSub);

      const mainIdx = mainBill.findIndex(i => i.id === item.id);
      if (mainIdx > -1) {
        const newMain = [...mainBill];
        newMain[mainIdx] = { ...newMain[mainIdx], quantity: newMain[mainIdx].quantity + 1 };
        setMainBill(newMain);
      } else {
        setMainBill([...mainBill, { ...item, quantity: 1 }]);
      }
    } else {
      setSubBill(subBill.filter((_, i) => i !== itemIdx));
      const mainIdx = mainBill.findIndex(i => i.id === item.id);
      if (mainIdx > -1) {
        const newMain = [...mainBill];
        newMain[mainIdx] = { ...newMain[mainIdx], quantity: newMain[mainIdx].quantity + 1 };
        setMainBill(newMain);
      } else {
        setMainBill([...mainBill, item]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[var(--primary-700)]/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col h-[85vh]">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-[var(--primary-700)]">{t('cart.split_bill')}</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">{t('cart.split_instruction')}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-full transition-colors"><X /></button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Main Bill */}
          <div className="flex-1 p-10 flex flex-col border-r border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-[var(--primary-700)]">
              <Check className="text-green-500" />
              <h3 className="font-black uppercase tracking-widest text-xs">{t('cart.original_bill')}</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {mainBill.map((item, idx) => (
                <div key={idx} className="p-5 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:bg-white hover:border-[var(--primary-600)] transition-all">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-xs text-[var(--primary-600)] shadow-sm">{item.quantity}x</span>
                    <div>
                      <p className="text-sm font-bold text-[var(--primary-700)]">{item.name}</p>
                      <p className="text-xs text-gray-400">{formatCurrency(item.totalPrice, enterpriseConfig.currency)}</p>
                    </div>
                  </div>
                  <button onClick={() => moveToSub(idx)} className="p-3 bg-white text-[var(--primary-600)] rounded-xl hover:bg-[var(--primary-600)] hover:text-white transition-all shadow-sm"><ArrowRight size={18} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center px-4"><Scissors className="text-gray-300" size={32} /></div>

          {/* Sub Bill */}
          <div className="flex-1 p-10 flex flex-col bg-[#F4F6FF]/30">
            <div className="flex items-center gap-2 mb-6 text-[var(--primary-600)]">
              <h3 className="font-black uppercase tracking-widest text-xs">{t('cart.new_sub_bill')}</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
              {subBill.length > 0 ? subBill.map((item, idx) => (
                <div key={idx} className="p-5 bg-white rounded-3xl border border-[var(--primary-600)]/20 flex items-center justify-between shadow-sm animate-in slide-in-from-right duration-300">
                  <button onClick={() => moveToMain(idx)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"><ArrowLeft size={18} /></button>
                  <div className="flex-1 px-4 text-right">
                    <p className="text-sm font-bold text-[var(--primary-700)]">{item.name}</p>
                    <p className="text-xs text-[var(--primary-600)] font-black">{item.quantity}x • {formatCurrency(item.totalPrice * item.quantity, enterpriseConfig.currency)}</p>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 italic">
                  <p className="text-sm font-bold">{t('cart.move_to_split')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 bg-white border-t border-gray-100 flex gap-4">
          <button onClick={onClose} className="px-10 py-6 text-gray-400 font-black rounded-[2rem] hover:bg-gray-50">{t('common.cancel')}</button>
          <button
            onClick={() => onConfirm(mainBill, subBill)}
            disabled={subBill.length === 0}
            className="flex-1 py-6 bg-[var(--primary-700)] text-white font-black rounded-[2rem] hover:bg-[var(--primary-600)] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {t('cart.confirm_split')} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitOrderModal;
