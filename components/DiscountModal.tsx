import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Percent, Check, Banknote } from 'lucide-react';
import { Discount } from '../types';
import { useStore } from '../store';
import { getCurrencySymbol } from '../utils/formatters';

interface DiscountModalProps {
  title: string;
  initialDiscount?: Discount;
  onClose: () => void;
  onConfirm: (discount: Discount | undefined) => void;
}

const DiscountModal: React.FC<DiscountModalProps> = ({ title, initialDiscount, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const { enterpriseConfig } = useStore();
  const [type, setType] = useState<'percentage' | 'fixed'>(initialDiscount?.type || 'percentage');
  const [value, setValue] = useState<string>(initialDiscount?.value.toString() || '');

  const handleConfirm = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      onConfirm(undefined);
    } else {
      onConfirm({ type, value: numValue });
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[var(--primary-700)]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-[var(--primary-700)]">{title}</h2>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-2 p-2 bg-gray-50 rounded-[2rem] mb-8">
          <button
            onClick={() => setType('percentage')}
            className={`flex-1 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all ${type === 'percentage' ? 'bg-white text-[var(--primary-600)] shadow-sm' : 'text-gray-400'
              }`}
          >
            <Percent size={18} />
            {t('discounts.percentage')}
          </button>
          <button
            onClick={() => setType('fixed')}
            className={`flex-1 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all ${type === 'fixed' ? 'bg-white text-[var(--primary-600)] shadow-sm' : 'text-gray-400'
              }`}
          >
            <Banknote size={18} />
            {t('discounts.fixed')}
          </button>
        </div>

        <div className="relative mb-10">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--primary-700)] opacity-30">
            {type === 'percentage' ? <Percent size={24} /> : <span className="text-xl font-black">{getCurrencySymbol(enterpriseConfig.currency)}</span>}
          </div>
          <input
            autoFocus
            type="number"
            placeholder="0.00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2rem] text-2xl font-black text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onConfirm(undefined)}
            className="py-5 bg-gray-50 text-gray-400 font-bold rounded-[2rem] hover:bg-red-50 hover:text-red-400 transition-all"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className="py-5 bg-[var(--primary-600)] text-white font-bold rounded-[2rem] flex items-center justify-center gap-2 shadow-xl shadow-primary-200 hover:bg-[var(--primary-700)] transition-all"
          >
            <Check size={20} />
            {t('discounts.apply')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;
