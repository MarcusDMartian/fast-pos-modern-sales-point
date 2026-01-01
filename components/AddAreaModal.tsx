
import React, { useState } from 'react';
import { X, Plus, Check, LayoutGrid } from 'lucide-react';

interface AddAreaModalProps {
  onClose: () => void;
  onConfirm: (name: string) => void;
}

const AddAreaModal: React.FC<AddAreaModalProps> = ({ onClose, onConfirm }) => {
  const [name, setName] = useState('');

  const handleConfirm = () => {
    if (name.trim()) {
      onConfirm(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--primary-700)]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-[var(--primary-700)]">Thêm Khu vực</h2>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Tạo không gian phục vụ mới</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 mb-10">
          <div className="relative">
            <LayoutGrid className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--primary-600)]" size={20} />
            <input
              autoFocus
              type="text"
              placeholder="Tên khu vực (VD: Sân thượng, Tầng 3...)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
              className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2rem] text-lg font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
            />
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
            disabled={!name.trim()}
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

export default AddAreaModal;
