
import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store';
import { Product, StockMovement, ProductType, BOMItem } from '../types';
import { Package, ArrowUpRight, ArrowDownLeft, AlertCircle, History, Plus, Search, RefreshCcw, Check, FileText, FlaskConical, Zap, Boxes, ArrowRight, Hash, Info, ChevronRight, X, Clock, User, Tag, Calendar, LayoutList, Download, Upload, Printer, Eye, Edit3, Lock, Unlock, Ruler } from 'lucide-react';
import InventoryAdjustmentModal from '../components/InventoryAdjustmentModal';
import AdvancedProductModal from '../components/AdvancedProductModal';
import ImportModal from '../components/ImportModal';

const Inventory: React.FC = () => {
  const {
    products, movements, addMovement,
    updateProduct, addProduct, setProducts,
    uoms, printGroups, currentUser
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ProductType | 'all'>('all');

  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode?.includes(searchTerm);
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const lowStockCount = products.filter(p => p.stock < 10 && p.type !== 'service').length;

  const handleAdjustment = (movement: Omit<StockMovement, 'id' | 'date' | 'performedBy'>) => {
    const targetProduct = products.find(p => p.id === movement.productId);
    if (!targetProduct) return;

    const selectedUnit = targetProduct.units.find(u => u.uomId === movement.uomId) || targetProduct.units[0];
    const conversion = selectedUnit?.conversionFactor || 1;
    const baseQuantityImpact = movement.quantity * conversion;

    const newStock = movement.type === 'in' || movement.type === 'return'
      ? targetProduct.stock + baseQuantityImpact
      : targetProduct.stock - baseQuantityImpact;

    const newMovement: StockMovement = {
      ...movement,
      id: `MOV-${Date.now()}`,
      date: new Date().toISOString(),
      productName: targetProduct.name,
      performedBy: currentUser?.name || 'Systems Admin'
    };

    addMovement(newMovement);
    updateProduct(targetProduct.id, { stock: Math.max(0, newStock) });
    setShowAdjustmentModal(false);
  };

  const handleSaveProduct = (newProd: Partial<Product>) => {
    if (newProd.id) {
      updateProduct(newProd.id, newProd);
      setEditingProduct(null);
    } else {
      const fullProd: Product = {
        id: `SKU-${Math.floor(Math.random() * 9000) + 1000}`,
        name: newProd.name || 'Unnamed Product',
        type: newProd.type || 'retail',
        category: newProd.category || 'General',
        image: newProd.image || `https://picsum.photos/seed/${newProd.name}/400/400`,
        baseUOMId: newProd.baseUOMId || 'u1',
        units: newProd.units || [{ uomId: newProd.baseUOMId || 'u1', type: 'base', conversionFactor: 1, price: newProd.price || 0, isDefault: true }],
        stock: 0,
        hasLotTracking: !!newProd.hasLotTracking,
        price: newProd.price || 0,
        bom: newProd.bom,
        lots: newProd.lots || [],
        printGroupId: newProd.printGroupId,
        status: 'active'
      };
      addProduct(fullProd);
      setShowAdvancedModal(false);
    }
  };

  const toggleProductLock = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      updateProduct(id, { status: product.status === 'active' ? 'locked' : 'active' });
    }
  };

  const handleExportCSV = () => {
    const headers = ['id', 'name', 'type', 'category', 'price', 'stock', 'barcode', 'printGroupId', 'status'];
    const rows = products.map(p => [p.id, p.name, p.type, p.category, p.price, p.stock, p.barcode || '', p.printGroupId || '', p.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (data: any[]) => {
    const newProducts: Product[] = data.map((item, idx) => ({
      id: item.id || `SKU-${Date.now()}-${idx}`,
      name: item.name || 'Imported Product',
      type: (item.type as ProductType) || 'retail',
      category: item.category || 'General',
      image: `https://picsum.photos/seed/${item.name}/400/400`,
      baseUOMId: 'u5',
      units: [{ uomId: 'u5', type: 'base', conversionFactor: 1, price: parseFloat(item.price) || 0, isDefault: true }],
      price: parseFloat(item.price) || 0,
      stock: parseFloat(item.stock) || 0,
      barcode: item.barcode || '',
      hasLotTracking: false,
      printGroupId: item.printGroupId || undefined,
      status: (item.status as any) || 'active'
    }));

    setProducts([...newProducts, ...products]);
    setShowImportModal(false);
  };

  const getTypeStyle = (type: ProductType) => {
    switch (type) {
      case 'retail': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'service': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'fnb': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getMovementTypeStyle = (type: StockMovement['type']) => {
    switch (type) {
      case 'in': return 'bg-green-50 text-green-600';
      case 'out': return 'bg-red-50 text-red-600';
      case 'adjust': return 'bg-purple-50 text-purple-600';
      case 'return': return 'bg-blue-50 text-blue-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Inventory Control</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Monitoring {products.length} advanced SKU classifications</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="p-4 bg-white/40 backdrop-blur-xl text-slate-600 rounded-2xl border border-white/60 hover:bg-white transition-all flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider shadow-sm"><Download size={18} /> Export</button>
          <button onClick={() => setShowImportModal(true)} className="p-4 bg-white/40 backdrop-blur-xl text-slate-600 rounded-2xl border border-white/60 hover:bg-white transition-all flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider shadow-sm"><Upload size={18} /> Import</button>
          <button onClick={() => setShowAdvancedModal(true)} className="bg-white/40 backdrop-blur-xl text-slate-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 border border-white/60 shadow-lg hover:bg-white transition-all text-[11px] uppercase tracking-wider"><Boxes size={20} /> Create Advanced</button>
          <button onClick={() => setShowAdjustmentModal(true)} className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary-glow hover:bg-slate-900 transition-all text-[11px] uppercase tracking-wider scale-105 active:scale-95"><RefreshCcw size={20} /> Adjust Stock</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Retail Items', val: products.filter(p => p.type === 'retail').length, icon: Package, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'F&B Items', val: products.filter(p => p.type === 'fnb').length, icon: FlaskConical, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Service Items', val: products.filter(p => p.type === 'service').length, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Low Stock', val: lowStockCount, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[2rem] flex items-center gap-6 hover:scale-105 transition-transform cursor-default">
            <div className={`p-5 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}><stat.icon size={28} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-3xl font-extrabold text-slate-800 tracking-tight`}>{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
        <div className="flex items-center gap-2 p-1.5 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg">
          {(['all', 'retail', 'service', 'fnb'] as const).map(f => (
            <button key={f} onClick={() => { setTypeFilter(f); setActiveTab('overview'); }} className={`px-8 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${typeFilter === f && activeTab === 'overview' ? 'bg-primary text-white shadow-xl shadow-primary-glow' : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'}`}>{f}</button>
          ))}
          <div className="w-px h-6 bg-slate-200 mx-2"></div>
          <button onClick={() => setActiveTab('history')} className={`px-8 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'}`}><History size={16} /> History</button>
        </div>
        {activeTab === 'overview' && (
          <div className="relative w-full lg:w-[400px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input type="text" placeholder="Lookup SKU or Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/50 backdrop-blur-xl pl-16 pr-6 py-4 rounded-2xl font-bold text-slate-900 outline-none border border-white/80 focus:border-primary focus:bg-white transition-all shadow-lg shadow-black/5" />
          </div>
        )}
      </div>

      {activeTab === 'overview' ? (
        <div className="glass-card shadow-xl overflow-hidden relative animate-in fade-in duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-fixed min-w-[1200px] border-collapse">
              <thead>
                <tr className="bg-slate-900/5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="p-10 pl-12 w-[300px]">Product Info</th>
                  <th className="p-10 w-[200px]">UOM Strategy</th>
                  <th className="p-10 w-[150px]">Stock Status</th>
                  <th className="p-10">Tags & Routing</th>
                  <th className="p-10 w-[220px] text-right pr-12 sticky right-0 bg-white shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-slate-50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map(prod => {
                  const baseUOM = uoms.find(u => u.id === prod.baseUOMId);
                  const salesUnit = prod.units.find(u => u.isDefault) || prod.units[0];
                  const salesUOM = uoms.find(u => u.id === salesUnit?.uomId);
                  const printGroup = printGroups.find(pg => pg.id === prod.printGroupId);
                  const isLocked = prod.status === 'locked';

                  return (
                    <tr key={prod.id} className={`hover:bg-white/40 transition-colors group ${isLocked ? 'opacity-40 grayscale blur-[1px]' : ''}`}>
                      <td className="p-10 pl-12">
                        <div className="flex items-center gap-6">
                          <div className="relative shrink-0">
                            <img src={prod.image} className="w-16 h-16 rounded-[1.25rem] object-cover shadow-lg border-2 border-white" />
                            <div className={`absolute -top-2 -right-2 px-2.5 py-1 rounded-lg text-[8px] font-extrabold uppercase border-2 border-white shadow-sm ${getTypeStyle(prod.type)}`}>{prod.type}</div>
                          </div>
                          <div className="min-w-0">
                            <p className="font-extrabold text-slate-800 text-[15px] leading-tight truncate">{prod.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{prod.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-10">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#333984]">{salesUOM?.code}</span>
                          <ArrowRight size={14} className="text-gray-300" />
                          <span className="text-xs font-bold text-gray-400">{baseUOM?.code}</span>
                        </div>
                        <p className="text-[10px] font-bold text-blue-400 uppercase mt-1">1 {salesUOM?.code} = {salesUnit?.conversionFactor} {baseUOM?.code}</p>
                      </td>
                      <td className="p-10">
                        <div className="flex flex-col">
                          <span className={`text-2xl font-black ${prod.stock < 10 && prod.type !== 'service' ? 'text-orange-500' : 'text-[#333984]'}`}>{prod.type === 'service' ? '∞' : prod.stock}</span>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{baseUOM?.name}</span>
                        </div>
                      </td>
                      <td className="p-10">
                        <div className="flex flex-wrap gap-2">
                          {printGroup && <div className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-2 text-[#333984] shadow-sm"><Printer size={14} /><span className="text-[10px] font-black uppercase">{printGroup.name}</span></div>}
                          {prod.bom && <div className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase border border-purple-100"><FlaskConical size={14} /> Recipe</div>}
                          {prod.hasLotTracking && <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase border border-blue-100"><Hash size={14} /> Lot Control</div>}
                        </div>
                      </td>
                      <td className="p-10 text-right pr-12 sticky right-0 bg-white/95 backdrop-blur-md shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-slate-50">
                        <div className="flex items-center justify-end gap-2.5">
                          <button onClick={() => setViewingProduct(prod)} className="p-3 bg-slate-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm border border-slate-100" title="Details"><Eye size={18} /></button>
                          <button onClick={() => setEditingProduct(prod)} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100" title="Edit"><Edit3 size={18} /></button>
                          <button onClick={() => toggleProductLock(prod.id)} className={`p-3 rounded-xl transition-all shadow-sm border ${isLocked ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white' : 'bg-slate-50 text-slate-300 border-slate-100 hover:bg-slate-900 hover:text-white'}`} title={isLocked ? 'Unlock' : 'Lock'}>{isLocked ? <Lock size={18} /> : <Unlock size={18} />}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-50 overflow-hidden animate-in fade-in duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-[#F4F6FF]/30 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="p-8">Date & Time</th>
                  <th className="p-8">Product</th>
                  <th className="p-8">Movement</th>
                  <th className="p-8">Qty Change</th>
                  <th className="p-8">Staff</th>
                  <th className="p-8">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {movements.map(mov => {
                  const uom = uoms.find(u => u.id === mov.uomId);
                  return (
                    <tr key={mov.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-8"><div className="flex items-center gap-3"><Clock size={14} className="text-gray-400" /><div className="text-xs"><p className="font-black text-[#333984]">{new Date(mov.date).toLocaleDateString()}</p><p className="text-gray-400">{new Date(mov.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div></div></td>
                      <td className="p-8"><p className="font-black text-[#333984] text-sm">{mov.productName}</p><p className="text-[10px] font-bold text-gray-400 uppercase">SKU: {mov.productId}</p></td>
                      <td className="p-8"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getMovementTypeStyle(mov.type)}`}>{mov.type}</span></td>
                      <td className="p-8"><div className="flex items-center gap-1"><span className={`font-black text-lg ${mov.type === 'in' || mov.type === 'return' ? 'text-green-500' : 'text-red-500'}`}>{mov.type === 'in' || mov.type === 'return' ? '+' : '-'}{mov.quantity}</span><span className="text-[10px] font-bold text-gray-400 uppercase">{uom?.code}</span></div></td>
                      <td className="p-8"><div className="flex items-center gap-2"><User size={14} className="text-gray-300" /><span className="text-xs font-bold text-gray-600">{mov.performedBy}</span></div></td>
                      <td className="p-8"><p className="text-xs text-gray-400 font-medium italic truncate max-w-[150px]">{mov.note}</p></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewingProduct && (
        <div className="fixed inset-0 z-[400] flex justify-end bg-[#333984]/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-12 flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[4rem]">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-black text-[#333984]">Product Insight</h2>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">{viewingProduct.id}</p>
              </div>
              <button onClick={() => setViewingProduct(null)} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-10 pr-4">
              <div className="flex gap-8">
                <img src={viewingProduct.image} className="w-40 h-40 rounded-[2.5rem] object-cover shadow-xl border-4 border-white" />
                <div className="flex-1 flex flex-col justify-center">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-3 ${getTypeStyle(viewingProduct.type)}`}>{viewingProduct.type}</span>
                  <h3 className="text-2xl font-black text-[#333984] mb-1">{viewingProduct.name}</h3>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{viewingProduct.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F4F6FF] p-6 rounded-[2rem] border border-blue-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Base Stock</p>
                  <p className="text-3xl font-black text-[#333984]">{viewingProduct.stock} <span className="text-xs text-blue-300 font-bold">{uoms.find(u => u.id === viewingProduct.baseUOMId)?.code}</span></p>
                </div>
                <div className="bg-[#F4F6FF] p-6 rounded-[2rem] border border-blue-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Default Price</p>
                  <p className="text-3xl font-black text-[#2A46FF]">${viewingProduct.price.toFixed(2)}</p>
                </div>
              </div>

              {viewingProduct.bom && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2"><FlaskConical size={16} className="text-purple-500" /><h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipe BOM Components</h4></div>
                  {viewingProduct.bom.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-2xl">
                      <span className="text-sm font-bold text-[#333984]">{item.componentId}</span>
                      <span className="text-sm font-black text-[#2A46FF]">{item.quantity} {uoms.find(u => u.id === item.uomId)?.code}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2"><Ruler size={16} className="text-blue-500" /><h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Sales Units</h4></div>
                {viewingProduct.units.map((unit, idx) => (
                  <div key={idx} className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-2xl">
                    <span className="text-sm font-bold text-[#333984]">{uoms.find(u => u.id === unit.uomId)?.name}</span>
                    <div className="text-right">
                      <p className="text-sm font-black text-[#2A46FF]">${unit.price.toFixed(2)}</p>
                      <p className="text-[10px] font-bold text-gray-400">Ratio: {unit.conversionFactor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-auto border-t border-gray-50 grid grid-cols-2 gap-4">
              <button onClick={() => { setViewingProduct(null); setEditingProduct(viewingProduct); }} className="py-6 bg-[#333984] text-white font-black rounded-[2rem] hover:bg-[#2A46FF] transition-all flex items-center justify-center gap-3 shadow-xl"><Edit3 size={18} /> Quick Edit</button>
              <button onClick={() => setViewingProduct(null)} className="py-6 bg-gray-50 text-[#333984] font-black rounded-[2rem] hover:bg-gray-100 transition-all">Close Info</button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && <ImportModal entityName="Products" templateHeaders={['id', 'name', 'type', 'category', 'price', 'stock', 'barcode', 'printGroupId', 'status']} onImport={handleImport} onClose={() => setShowImportModal(false)} />}
      {showAdjustmentModal && <InventoryAdjustmentModal products={products} onClose={() => setShowAdjustmentModal(false)} onConfirm={handleAdjustment} />}
      {showAdvancedModal && <AdvancedProductModal onClose={() => setShowAdvancedModal(false)} onSave={handleSaveProduct} />}
      {editingProduct && <AdvancedProductModal initialProduct={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleSaveProduct} />}
    </div>
  );
};

export default Inventory;
