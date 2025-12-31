
import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Scissors, ChevronRight } from 'lucide-react';
import { CartItem } from '../types';

interface SplitOrderModalProps {
  items: CartItem[];
  onClose: () => void;
  onConfirm: (mainBill: CartItem[], subBill: CartItem[]) => void;
}

const SplitOrderModal: React.FC<SplitOrderModalProps> = ({ items, onClose, onConfirm }) => {
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
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#333984]/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col h-[85vh]">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-[#333984]">Split Bill</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Select items for the second bill</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-full transition-colors"><X/></button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Main Bill */}
          <div className="flex-1 p-10 flex flex-col border-r border-gray-100">
             <div className="flex items-center gap-2 mb-6 text-[#333984]">
               <Check className="text-green-500" />
               <h3 className="font-black uppercase tracking-widest text-xs">Original Bill</h3>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                {mainBill.map((item, idx) => (
                  <div key={idx} className="p-5 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:bg-white hover:border-[#2A46FF] transition-all">
                    <div className="flex items-center gap-4">
                       <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-xs text-[#2A46FF] shadow-sm">{item.quantity}x</span>
                       <div><p className="text-sm font-bold text-[#333984]">{item.name}</p><p className="text-xs text-gray-400">${item.totalPrice.toFixed(2)}</p></div>
                    </div>
                    <button onClick={() => moveToSub(idx)} className="p-3 bg-white text-[#2A46FF] rounded-xl hover:bg-[#2A46FF] hover:text-white transition-all shadow-sm"><ArrowRight size={18}/></button>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex items-center justify-center px-4"><Scissors className="text-gray-300" size={32}/></div>

          {/* Sub Bill */}
          <div className="flex-1 p-10 flex flex-col bg-[#F4F6FF]/30">
             <div className="flex items-center gap-2 mb-6 text-[#2A46FF]">
               <h3 className="font-black uppercase tracking-widest text-xs">New Sub-Bill</h3>
             </div>
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                {subBill.length > 0 ? subBill.map((item, idx) => (
                  <div key={idx} className="p-5 bg-white rounded-3xl border border-[#2A46FF]/20 flex items-center justify-between shadow-sm animate-in slide-in-from-right duration-300">
                    <button onClick={() => moveToMain(idx)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"><ArrowLeft size={18}/></button>
                    <div className="flex-1 px-4 text-right">
                       <p className="text-sm font-bold text-[#333984]">{item.name}</p>
                       <p className="text-xs text-[#2A46FF] font-black">{item.quantity}x • ${(item.totalPrice * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 italic">
                    <p className="text-sm font-bold">Move items here to split</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="p-8 bg-white border-t border-gray-100 flex gap-4">
          <button onClick={onClose} className="px-10 py-6 text-gray-400 font-black rounded-[2rem] hover:bg-gray-50">Cancel</button>
          <button 
            onClick={() => onConfirm(mainBill, subBill)}
            disabled={subBill.length === 0}
            className="flex-1 py-6 bg-[#333984] text-white font-black rounded-[2rem] hover:bg-[#2A46FF] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
          >
            Confirm & Create Sub-Bill <ChevronRight size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplitOrderModal;
