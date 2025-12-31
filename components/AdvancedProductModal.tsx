
import React, { useState, useEffect } from 'react';
import { X, Save, Package, Ruler, FlaskConical, Hash, Layers, ArrowRight, Info, Plus, Trash2, Tag, Calendar, ShoppingBag, Printer, Fingerprint } from 'lucide-react';
import { Product, ProductType, BOMType, UOM, ProductUOM, BOMItem, BOM } from '../types';
import { MOCK_UOMS, MOCK_PRODUCTS, MOCK_PRINT_GROUPS } from '../constants';

interface AdvancedProductModalProps {
  initialProduct?: Product;
  onClose: () => void;
  onSave: (product: Partial<Product>) => void;
}

const AdvancedProductModal: React.FC<AdvancedProductModalProps> = ({ initialProduct, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'units' | 'bom' | 'inventory'>('general');
  const [productType, setProductType] = useState<ProductType>('retail');
  
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Coffee');
  const [baseUOM, setBaseUOM] = useState(MOCK_UOMS[0].id);
  const [salesUnits, setSalesUnits] = useState<ProductUOM[]>([]);
  const [bomItems, setBomItems] = useState<BOMItem[]>([]);
  const [hasLotTracking, setHasLotTracking] = useState(false);
  const [price, setPrice] = useState('0');
  const [printGroupId, setPrintGroupId] = useState('');

  // Hydrate if editing
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setProductType(initialProduct.type);
      setBaseUOM(initialProduct.baseUOMId);
      setSalesUnits(initialProduct.units.filter(u => u.type === 'sales'));
      setPrice(initialProduct.price.toString());
      setHasLotTracking(initialProduct.hasLotTracking);
      setPrintGroupId(initialProduct.printGroupId || '');
      if (initialProduct.bom) {
        setBomItems(initialProduct.bom.items);
      }
    }
  }, [initialProduct]);

  const tabs = [
    { id: 'general', label: 'General Info', icon: Package },
    { id: 'units', label: 'Units & Pricing', icon: Ruler },
    { id: 'bom', label: 'BOM / Recipe', icon: FlaskConical },
    { id: 'inventory', label: 'Lot & Tracking', icon: Hash },
  ];

  const handleAddUnit = () => {
    setSalesUnits([...salesUnits, { uomId: MOCK_UOMS[1].id, type: 'sales', conversionFactor: 1, price: 0, isDefault: false }]);
  };

  const handleRemoveUnit = (idx: number) => {
    setSalesUnits(salesUnits.filter((_, i) => i !== idx));
  };

  const handleUpdateUnit = (idx: number, updates: Partial<ProductUOM>) => {
    setSalesUnits(salesUnits.map((u, i) => i === idx ? { ...u, ...updates } : u));
  };

  const handleAddBOMItem = () => {
    setBomItems([...bomItems, { id: Date.now().toString(), componentId: MOCK_PRODUCTS[0].id, quantity: 1, uomId: baseUOM, cost: 0 }]);
  };

  const handleRemoveBOMItem = (id: string) => {
    setBomItems(bomItems.filter(item => item.id !== id));
  };

  const handleFinalSave = () => {
    if (!name.trim()) return;

    let bom: BOM | undefined = undefined;
    if (productType === 'fnb' && bomItems.length > 0) {
      bom = {
        id: initialProduct?.bom?.id || `BOM-${Date.now()}`,
        productId: initialProduct?.id || '', 
        type: 'recipe',
        items: bomItems,
        wastagePercent: 5,
        totalCost: bomItems.reduce((acc, curr) => acc + curr.cost, 0)
      };
    }

    onSave({
      id: initialProduct?.id, // Keep same ID for edit
      name,
      category,
      type: productType,
      baseUOMId: baseUOM,
      units: [
        { uomId: baseUOM, type: 'base', conversionFactor: 1, price: parseFloat(price), isDefault: true },
        ...salesUnits
      ],
      hasLotTracking,
      bom,
      price: parseFloat(price),
      printGroupId: printGroupId || undefined,
      status: initialProduct?.status || 'active'
    });
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#333984]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-[#333984]">{initialProduct ? 'Edit Product' : 'Advanced Product Setup'}</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Configure Units, BOM, and Tracking</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex bg-[#F4F6FF]/50 p-2 gap-2 border-b border-gray-50">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDisabled = tab.id === 'bom' && productType === 'service';
            
            return (
              <button
                key={tab.id}
                disabled={isDisabled}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  isActive ? 'bg-white text-[#2A46FF] shadow-sm' : isDisabled ? 'opacity-20 cursor-not-allowed text-gray-400' : 'text-gray-400 hover:text-[#333984] hover:bg-white/50'
                }`}
              >
                <Icon size={18} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {activeTab === 'general' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              {initialProduct && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Product UID (Immutable)</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <input
                      readOnly
                      type="text"
                      className="w-full bg-gray-50/50 px-16 py-5 rounded-2xl text-lg font-bold text-gray-400 outline-none cursor-not-allowed border-2 border-transparent"
                      value={initialProduct.id}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Business Type</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['retail', 'service', 'fnb'] as ProductType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => setProductType(type)}
                      className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all ${
                        productType === type ? 'border-[#2A46FF] bg-blue-50/20 text-[#2A46FF]' : 'border-gray-50 text-gray-400'
                      }`}
                    >
                      <Layers size={24} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Arabica Coffee Beans"
                    className="w-full bg-gray-50 px-8 py-5 rounded-2xl text-lg font-bold text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Category</label>
                  <select
                    className="w-full bg-gray-50 px-8 py-5 rounded-2xl text-lg font-bold text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all appearance-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option>Coffee</option>
                    <option>Tea</option>
                    <option>Retail Goods</option>
                    <option>Spa Service</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Base Sales Price ($)</label>
                  <div className="relative">
                    <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2A46FF]" size={20} />
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-gray-50 pl-16 pr-6 py-5 rounded-2xl text-2xl font-black text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Print Group (Nhóm in)</label>
                  <div className="relative">
                    <Printer className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2A46FF]" size={20} />
                    <select
                      className="w-full bg-gray-50 pl-16 pr-6 py-5 rounded-2xl text-lg font-bold text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all appearance-none"
                      value={printGroupId}
                      onChange={(e) => setPrintGroupId(e.target.value)}
                    >
                      <option value="">No Printing / Không in</option>
                      {MOCK_PRINT_GROUPS.map(pg => (
                        <option key={pg.id} value={pg.id}>{pg.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'units' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="p-8 bg-[#F4F6FF] rounded-[2.5rem] border border-blue-50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-white rounded-2xl text-[#2A46FF] shadow-sm"><Info size={24}/></div>
                  <div>
                    <h4 className="font-black text-[#333984]">Unit of Measure Strategy</h4>
                    <p className="text-xs font-bold text-gray-400">Define how you stock (Base) and how you sell (Sales).</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Base Unit (Warehouse)</label>
                    <select
                      className="w-full bg-white px-6 py-4 rounded-xl text-sm font-bold text-[#333984] outline-none border border-gray-100"
                      value={baseUOM}
                      onChange={(e) => setBaseUOM(e.target.value)}
                    >
                      {MOCK_UOMS.map(u => <option key={u.id} value={u.id}>{u.name} ({u.code})</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Additional Sales Units & Conversions</label>
                  <button onClick={handleAddUnit} className="text-[10px] font-black text-[#2A46FF] flex items-center gap-1"><Plus size={14}/> Add Sales Unit</button>
                </div>
                
                <div className="space-y-3">
                  {salesUnits.length > 0 ? salesUnits.map((unit, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-[2rem] group hover:border-blue-100 transition-all">
                      <select 
                        value={unit.uomId}
                        onChange={(e) => handleUpdateUnit(idx, { uomId: e.target.value })}
                        className="flex-1 bg-gray-50 px-4 py-3 rounded-xl text-sm font-bold text-[#333984]"
                      >
                        {MOCK_UOMS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-gray-300 uppercase">1 unit = </span>
                         <input 
                           type="number" 
                           value={unit.conversionFactor}
                           onChange={(e) => handleUpdateUnit(idx, { conversionFactor: parseFloat(e.target.value) })}
                           placeholder="0.1" 
                           className="w-20 bg-gray-50 px-3 py-3 rounded-xl text-center font-bold text-[#333984]" 
                         />
                         <span className="text-[10px] font-black text-gray-300 uppercase">{MOCK_UOMS.find(u => u.id === baseUOM)?.code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-green-500" />
                        <input 
                          type="number" 
                          value={unit.price}
                          onChange={(e) => handleUpdateUnit(idx, { price: parseFloat(e.target.value) })}
                          placeholder="Price" 
                          className="w-24 bg-gray-50 px-3 py-3 rounded-xl font-black text-[#333984]" 
                        />
                      </div>
                      <button onClick={() => handleRemoveUnit(idx)} className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  )) : (
                    <div className="py-12 text-center opacity-20 border-2 border-dashed border-gray-100 rounded-[2rem]">
                      <span className="text-xs font-black uppercase tracking-widest">No extra sales units defined</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bom' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="p-8 bg-[#F4F6FF] rounded-[2.5rem] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white rounded-2xl text-[#2A46FF] shadow-sm"><FlaskConical size={32} /></div>
                  <div>
                    <h4 className="font-black text-[#333984]">Recipe & Bill of Materials</h4>
                    <p className="text-xs font-bold text-gray-400">Total component cost: <span className="text-[#2A46FF]">${bomItems.reduce((acc, curr) => acc + (curr.cost || 0), 0).toFixed(2)}</span></p>
                  </div>
                </div>
                <button onClick={handleAddBOMItem} className="bg-white text-[#333984] px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-sm flex items-center gap-2 border border-blue-50 hover:bg-gray-50">
                  <Plus size={16} /> Add Ingredient
                </button>
              </div>

              <div className="space-y-4">
                {bomItems.length > 0 ? bomItems.map((item, idx) => (
                  <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-blue-100 transition-all shadow-sm">
                    <div className="flex-1 w-full">
                      <select 
                        value={item.componentId}
                        onChange={(e) => {
                          const target = MOCK_PRODUCTS.find(p => p.id === e.target.value);
                          setBomItems(bomItems.map(i => i.id === item.id ? { ...i, componentId: e.target.value, cost: (target?.price || 0) * 0.4 } : i));
                        }}
                        className="w-full bg-gray-50 px-6 py-4 rounded-xl text-sm font-bold text-[#333984] border-none"
                      >
                        <option value="">Select Raw Material...</option>
                        {MOCK_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-24">
                        <input 
                          type="number" 
                          placeholder="Qty" 
                          value={item.quantity}
                          onChange={(e) => setBomItems(bomItems.map(i => i.id === item.id ? { ...i, quantity: parseFloat(e.target.value) } : i))}
                          className="w-full bg-gray-50 px-4 py-4 rounded-xl text-center font-black text-[#333984]" 
                        />
                      </div>
                      <div className="w-24">
                        <select 
                          value={item.uomId}
                          onChange={(e) => setBomItems(bomItems.map(i => i.id === item.id ? { ...i, uomId: e.target.value } : i))}
                          className="w-full bg-gray-50 px-4 py-4 rounded-xl text-sm font-bold text-gray-500"
                        >
                          {MOCK_UOMS.map(u => <option key={u.id} value={u.id}>{u.code}</option>)}
                        </select>
                      </div>
                      <div className="w-28 relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">$</span>
                         <input 
                           type="number" 
                           placeholder="Cost" 
                           value={item.cost}
                           onChange={(e) => setBomItems(bomItems.map(i => i.id === item.id ? { ...i, cost: parseFloat(e.target.value) } : i))}
                           className="w-full bg-gray-50 pl-8 pr-3 py-4 rounded-xl text-center font-black text-green-500" 
                         />
                      </div>
                      <button onClick={() => handleRemoveBOMItem(item.id)} className="p-4 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                        <Trash2 size={20}/>
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center opacity-20 border-2 border-dashed border-gray-100 rounded-[3rem]">
                    <ShoppingBag size={48} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">Start building your recipe</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="flex items-center justify-between p-10 bg-gray-50 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className={`p-6 rounded-3xl transition-all duration-500 ${hasLotTracking ? 'bg-[#2A46FF] text-white shadow-xl shadow-blue-200 scale-110' : 'bg-white text-gray-300 shadow-sm'}`}>
                    <Hash size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#333984]">Lot & Expiry Tracking</h4>
                    <p className="text-sm font-bold text-gray-400">Strict inventory control for perishables.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setHasLotTracking(!hasLotTracking)}
                  className={`w-20 h-10 rounded-full transition-all relative border-4 ${hasLotTracking ? 'bg-[#2A46FF] border-[#2A46FF]' : 'bg-gray-200 border-gray-200'}`}
                >
                  <div className={`absolute top-0.5 w-7 h-7 rounded-full bg-white shadow-sm transition-all duration-300 ${hasLotTracking ? 'left-10' : 'left-0.5'}`} />
                </button>
              </div>

              {hasLotTracking && (
                <div className="grid grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-500">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Expiry Alert Strategy</label>
                    <div className="relative">
                      <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2A46FF]" size={20} />
                      <input type="number" placeholder="7" className="w-full bg-gray-50 pl-16 pr-6 py-5 rounded-2xl text-lg font-bold text-[#333984] outline-none" />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300 uppercase">Days Before</span>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Removal Policy</label>
                    <div className="relative">
                      <Info className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2A46FF]" size={20} />
                      <select className="w-full bg-gray-50 pl-16 pr-6 py-5 rounded-2xl text-lg font-bold text-[#333984] outline-none appearance-none">
                        <option>FEFO (Oldest Expiry First)</option>
                        <option>FIFO (First In First Out)</option>
                        <option>LIFO (Last In First Out)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-[#F4F6FF]/50 border-t border-gray-50 flex gap-4">
          <button onClick={onClose} className="px-12 py-6 bg-white border border-gray-200 text-[#333984] font-black rounded-[2rem] hover:bg-gray-50 transition-all">Cancel</button>
          <button 
            onClick={handleFinalSave}
            className="flex-1 bg-[#2A46FF] text-white py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:bg-[#333984] transition-all"
          >
            <Save size={24} strokeWidth={3} />
            {initialProduct ? 'Update Product' : 'Finalize Advanced Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedProductModal;
