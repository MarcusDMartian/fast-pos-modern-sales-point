
import React, { useState } from 'react';
import { X, Check, Hash, Users, Layout } from 'lucide-react';

interface AddTableModalProps {
  areaName: string;
  onClose: () => void;
  onConfirm: (number: string, capacity: number) => void;
}

const AddTableModal: React.FC<AddTableModalProps> = ({ areaName, onClose, onConfirm }) => {
  const [number, setNumber] = useState('');
  const [capacity, setCapacity] = useState('4');

  const handleConfirm = () => {
    if (number.trim() && capacity) {
      onConfirm(number.trim(), parseInt(capacity));
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--primary-700)]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-[var(--primary-700)]">Thêm Bàn mới</h2>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Khu vực: {areaName}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 mb-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Số bàn</label>
            <div className="relative">
              <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--primary-600)]" size={20} />
              <input
                autoFocus
                type="text"
                placeholder="Ví dụ: 01, 02, A1..."
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full bg-gray-50 pl-16 pr-6 py-5 rounded-[2rem] text-lg font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Sức chứa (Chỗ ngồi)</label>
            <div className="relative">
              <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--primary-600)]" size={20} />
              <input
                type="number"
                min="1"
                max="20"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full bg-gray-50 pl-16 pr-6 py-5 rounded-[2rem] text-lg font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="py-5 bg-gray-50 text-gray-400 font-black rounded-[2rem] hover:bg-gray-100 transition-all uppercase text-[10px] tracking-widest"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            disabled={!number.trim() || !capacity}
            className="py-5 bg-[var(--primary-600)] text-white font-black rounded-[2rem] flex items-center justify-center gap-2 shadow-xl shadow-primary-200 hover:bg-[var(--primary-700)] transition-all disabled:opacity-50 uppercase text-[10px] tracking-widest"
          >
            <Check size={20} strokeWidth={3} />
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTableModal;
