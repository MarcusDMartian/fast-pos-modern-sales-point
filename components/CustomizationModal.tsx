
import React, { useState } from 'react';
import { Product, SelectedAttribute } from '../types';
import { X, Plus, Minus, Check } from 'lucide-react';
import { useStore } from '../store';
import { formatCurrency } from '../utils/formatters';

interface CustomizationModalProps {
  product: Product;
  onClose: () => void;
  onConfirm: (attributes: SelectedAttribute[], note: string) => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ product, onClose, onConfirm }) => {
  const { enterpriseConfig } = useStore();
  const [selections, setSelections] = useState<SelectedAttribute[]>(
    product.attributes?.map(attr => ({
      attributeId: attr.id,
      valueId: attr.values[0].id
    })) || []
  );
  const [note, setNote] = useState('');

  const handleSelect = (attrId: string, valId: string) => {
    setSelections(prev =>
      prev.map(s => s.attributeId === attrId ? { ...s, valueId: valId } : s)
    );
  };

  const totalPrice = product.price + selections.reduce((acc, sel) => {
    const attr = product.attributes?.find(a => a.id === sel.attributeId);
    const val = attr?.values.find(v => v.id === sel.valueId);
    return acc + (val?.priceAdjustment || 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[var(--primary-700)]/30 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-xl rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-2xl font-black text-[var(--primary-700)]">Tuỳ chỉnh món</h2>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="flex gap-6">
            <img src={product.image} className="w-24 h-24 rounded-3xl object-cover" alt="" />
            <div>
              <h3 className="text-xl font-bold text-[var(--primary-700)]">{product.name}</h3>
              <p className="text-[var(--primary-600)] font-bold text-lg">{formatCurrency(product.price, enterpriseConfig.currency)} Giá gốc</p>
            </div>
          </div>

          {product.attributes?.map(attr => (
            <div key={attr.id} className="space-y-4">
              <label className="text-sm font-black text-gray-500 uppercase tracking-widest">{attr.name}</label>
              <div className="grid grid-cols-2 gap-4">
                {attr.values.map(val => {
                  const isSelected = selections.find(s => s.attributeId === attr.id)?.valueId === val.id;
                  return (
                    <button
                      key={val.id}
                      onClick={() => handleSelect(attr.id, val.id)}
                      className={`p-5 rounded-[1.5rem] border-2 transition-all flex justify-between items-center ${isSelected ? 'border-[var(--primary-600)] bg-blue-50/50' : 'border-gray-50 bg-white'
                        }`}
                    >
                      <span className={`font-bold ${isSelected ? 'text-[var(--primary-600)]' : 'text-[var(--primary-700)]'}`}>{val.name}</span>
                      <span className="text-xs font-bold text-gray-500">
                        {val.priceAdjustment > 0 ? `+${formatCurrency(val.priceAdjustment, enterpriseConfig.currency)}` : 'Miễn phí'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <label className="text-sm font-black text-gray-500 uppercase tracking-widest">Ghi chú đặc biệt</label>
            <textarea
              placeholder="Vd: Ít đá, không đường, thêm nóng..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-50 rounded-[2rem] p-6 text-[var(--primary-700)] font-medium outline-none focus:ring-2 focus:ring-[var(--primary-600)]/10 transition-all resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="p-8 bg-[#F4F6FF]/50 border-t border-gray-50">
          <button
            onClick={() => onConfirm(selections, note)}
            className="w-full bg-[var(--primary-600)] text-white py-6 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary-200 hover:bg-[var(--primary-700)] transition-all"
          >
            Thêm vào đơn hàng • {formatCurrency(totalPrice, enterpriseConfig.currency)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
