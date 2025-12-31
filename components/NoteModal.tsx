
import React, { useState } from 'react';
import { X, StickyNote, Check } from 'lucide-react';

interface NoteModalProps {
  initialNote?: string;
  onClose: () => void;
  onConfirm: (note: string) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ initialNote = '', onClose, onConfirm }) => {
  const [note, setNote] = useState(initialNote);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#333984]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-[#333984]">Item Note</h2>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-10">
          <label className="text-sm font-black text-gray-400 uppercase tracking-widest px-2">Special Instructions</label>
          <div className="relative">
            <StickyNote className="absolute left-6 top-6 text-[#333984] opacity-20" size={20} />
            <textarea
              autoFocus
              placeholder="e.g. Extra hot, no ice, side of sauce..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2rem] text-lg font-bold text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all min-h-[150px] resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onConfirm('')}
            className="py-5 bg-gray-50 text-gray-400 font-bold rounded-[2rem] hover:bg-red-50 hover:text-red-400 transition-all"
          >
            Clear Note
          </button>
          <button
            onClick={() => onConfirm(note)}
            className="py-5 bg-[#2A46FF] text-white font-bold rounded-[2rem] flex items-center justify-center gap-2 shadow-xl shadow-blue-100 hover:bg-[#333984] transition-all"
          >
            <Check size={20} />
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
