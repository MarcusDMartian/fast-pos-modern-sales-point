
import React, { useState } from 'react';
import { X, Percent, DollarSign, Check } from 'lucide-react';
import { Discount } from '../types';

interface DiscountModalProps {
  title: string;
  initialDiscount?: Discount;
  onClose: () => void;
  onConfirm: (discount: Discount | undefined) => void;
}

const DiscountModal: React.FC<DiscountModalProps> = ({ title, initialDiscount, onClose, onConfirm }) => {
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
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#333984]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-[#333984]">{title}</h2>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-2 p-2 bg-gray-50 rounded-[2rem] mb-8">
          <button
            onClick={() => setType('percentage')}
            className={`flex-1 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all ${
              type === 'percentage' ? 'bg-white text-[#2A46FF] shadow-sm' : 'text-gray-400'
            }`}
          >
            <Percent size={18} />
            Percentage
          </button>
          <button
            onClick={() => setType('fixed')}
            className={`flex-1 py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-2 transition-all ${
              type === 'fixed' ? 'bg-white text-[#2A46FF] shadow-sm' : 'text-gray-400'
            }`}
          >
            <DollarSign size={18} />
            Fixed Amount
          </button>
        </div>

        <div className="relative mb-10">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#333984] opacity-30">
            {type === 'percentage' ? <Percent size={24} /> : <DollarSign size={24} />}
          </div>
          <input
            autoFocus
            type="number"
            placeholder="0.00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2rem] text-2xl font-black text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onConfirm(undefined)}
            className="py-5 bg-gray-50 text-gray-400 font-bold rounded-[2rem] hover:bg-red-50 hover:text-red-400 transition-all"
          >
            Clear
          </button>
          <button
            onClick={handleConfirm}
            className="py-5 bg-[#2A46FF] text-white font-bold rounded-[2rem] flex items-center justify-center gap-2 shadow-xl shadow-blue-100 hover:bg-[#333984] transition-all"
          >
            <Check size={20} />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;
