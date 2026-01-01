
import React, { useState, useMemo } from 'react';
import { X, Search, Package, ArrowUpRight, ArrowDownLeft, RefreshCcw, Check, Plus, Minus, Hash, StickyNote, Ruler, Info, AlertCircle } from 'lucide-react';
import { Product, StockMovement, UOM } from '../types';
import { MOCK_UOMS } from '../constants';

interface InventoryAdjustmentModalProps {
  products: Product[];
  onClose: () => void;
  onConfirm: (movement: Omit<StockMovement, 'id' | 'date' | 'performedBy'>) => void;
}

const InventoryAdjustmentModal: React.FC<InventoryAdjustmentModalProps> = ({ products, onClose, onConfirm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [type, setType] = useState<StockMovement['type']>('in');
  const [quantity, setQuantity] = useState<string>('');
  const [note, setNote] = useState('');
  const [selectedUomId, setSelectedUomId] = useState<string>('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.barcode?.includes(searchTerm)
    );
  }, [searchTerm, products]);

  const handleProductSelect = (p: Product) => {
    setSelectedProduct(p);
    setSelectedUomId(p.baseUOMId);
  };

  const handleConfirm = () => {
    if (!selectedProduct || !quantity) return;
    // Add missing productName to comply with StockMovement definition minus omitted fields
    onConfirm({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type,
      quantity: parseFloat(quantity),
      uomId: selectedUomId,
      note: note || `Manual ${type} correction`
    });
  };

  const currentUOM = MOCK_UOMS.find(u => u.id === selectedUomId);

  const typeConfig = {
    in: { icon: ArrowUpRight, label: 'Stock In', color: 'text-green-500', bg: 'bg-green-50', desc: 'Goods received from supplier' },
    out: { icon: ArrowDownLeft, label: 'Stock Out', color: 'text-red-500', bg: 'bg-red-50', desc: 'Removing damaged or expired items' },
    adjust: { icon: RefreshCcw, label: 'Adjustment', color: 'text-purple-500', bg: 'bg-purple-50', desc: 'Correcting discrepancies after audit' },
    return: { icon: Check, label: 'Return', color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Returning goods to warehouse' },
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[var(--primary-700)]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-[var(--primary-700)]">Stock Adjustment</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Record manual inventory impact</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-8">
          {!selectedProduct ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-top duration-300">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Select Target SKU</label>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Product name or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2rem] text-lg font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
                />
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredProducts.length > 0 ? filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleProductSelect(p)}
                    className="w-full flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2.5rem] hover:border-[var(--primary-600)] hover:bg-blue-50/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <img src={p.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                      <div className="text-left">
                        <p className="font-black text-[var(--primary-700)] text-lg leading-tight">{p.name}</p>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">SKU: {p.barcode || p.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-[var(--primary-700)]">{p.stock}</p>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Base Stock</p>
                    </div>
                  </button>
                )) : searchTerm ? (
                  <div className="py-20 text-center opacity-30">
                    <AlertCircle size={48} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">No matching products found</p>
                  </div>
                ) : (
                  <div className="py-20 text-center opacity-10">
                    <Package size={64} className="mx-auto" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom duration-300">
              {/* Product Info Banner */}
              <div className="p-8 bg-[#F4F6FF] rounded-[3rem] border border-blue-50 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img src={selectedProduct.image} className="w-20 h-20 rounded-[1.8rem] object-cover shadow-lg" />
                    <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-sm"><Info size={12} className="text-[var(--primary-600)]"/></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[var(--primary-700)] tracking-tight">{selectedProduct.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-black text-[var(--primary-600)] bg-white px-3 py-1 rounded-lg shadow-sm">Current Stock: {selectedProduct.stock}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{MOCK_UOMS.find(u => u.id === selectedProduct.baseUOMId)?.code}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="p-4 bg-white text-gray-400 rounded-2xl hover:bg-[var(--primary-700)] hover:text-white transition-all shadow-sm"
                >
                  <RefreshCcw size={20} />
                </button>
              </div>

              {/* Movement Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['in', 'out', 'adjust', 'return'] as const).map(m => {
                  const config = typeConfig[m];
                  const Icon = config.icon;
                  const isActive = type === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setType(m)}
                      className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all relative ${
                        isActive ? 'border-[var(--primary-600)] bg-blue-50/20 text-[var(--primary-600)]' : 'border-gray-50 text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-4 rounded-2xl transition-all ${isActive ? 'bg-[var(--primary-600)] text-white shadow-lg' : config.bg + ' ' + config.color}`}>
                        <Icon size={24} strokeWidth={3} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-center">{config.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quantity & UOM Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Adjustment Quantity</label>
                  <div className="relative">
                    <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--primary-600)]" size={24} />
                    <input
                      type="number"
                      placeholder="0.00"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2rem] text-3xl font-black text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Unit of Measure (UOM)</label>
                  <div className="relative">
                    <Ruler className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--primary-600)]" size={24} />
                    <select 
                      value={selectedUomId}
                      onChange={(e) => setSelectedUomId(e.target.value)}
                      className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2rem] text-xl font-black text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all appearance-none"
                    >
                      {selectedProduct.units.map(unit => {
                        const uom = MOCK_UOMS.find(u => u.id === unit.uomId);
                        return <option key={unit.uomId} value={unit.uomId}>{uom?.name} ({uom?.code})</option>;
                      })}
                    </select>
                  </div>
                  {selectedUomId !== selectedProduct.baseUOMId && (
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-4">
                      Conversion: 1 Unit = {selectedProduct.units.find(u => u.uomId === selectedUomId)?.conversionFactor} {MOCK_UOMS.find(u => u.id === selectedProduct.baseUOMId)?.code}
                    </p>
                  )}
                </div>
              </div>

              {/* Note */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Adjustment Note / Reason</label>
                <div className="relative">
                  <StickyNote className="absolute left-6 top-6 text-[var(--primary-600)]" size={24} />
                  <textarea
                    rows={3}
                    placeholder="Provide a reason for this adjustment (e.g. Weekly inventory audit, Damaged during shipping...)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2.5rem] text-sm font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-10 bg-[#F4F6FF]/50 border-t border-gray-50 flex gap-4">
          <button onClick={onClose} className="px-10 py-6 bg-white border border-gray-200 text-[var(--primary-700)] font-black rounded-[2rem] hover:bg-gray-50 transition-all">Cancel</button>
          <button
            disabled={!selectedProduct || !quantity}
            onClick={handleConfirm}
            className="flex-1 bg-[var(--primary-600)] text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary-200 hover:bg-[var(--primary-700)] transition-all disabled:opacity-50"
          >
            <Check size={24} strokeWidth={3} />
            Post Adjustment
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryAdjustmentModal;
