import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Product, StockMovement, ProductType, ItemType } from '../types';
import { Package, AlertCircle, History, Plus, Search, RefreshCcw, Check, FileText, FlaskConical, Zap, Boxes, ArrowRight, Hash, Info, ChevronRight, X, Clock, User, Tag, Calendar, LayoutList, Download, Upload, Printer, Eye, Edit3, Lock, Unlock, Ruler, Filter, Layers, ShoppingBag, Utensils, Truck as TruckIcon } from 'lucide-react';


import { formatCurrency } from '../utils/formatters';
import InventoryAdjustmentModal from '../components/InventoryAdjustmentModal';
import AdvancedProductModal from '../components/AdvancedProductModal';
import ImportModal from '../components/ImportModal';
import WarehouseTransferModal from '../components/WarehouseTransferModal';

const Inventory: React.FC = () => {
  const { t } = useTranslation();
  const {
    products, movements, addMovement,
    updateProduct, addProduct, setProducts,
    uoms, printGroups, currentUser, enterpriseConfig
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showAdvancedModal, setShowAdvancedModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [businessTypeFilter, setBusinessTypeFilter] = useState<ProductType | 'all'>('all');
  const [itemTypeFilter, setItemTypeFilter] = useState<ItemType | 'all'>('all');


  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode?.includes(searchTerm);
    const matchesBusinessType = businessTypeFilter === 'all' || p.type === businessTypeFilter;
    const matchesItemType = itemTypeFilter === 'all' || p.itemType === itemTypeFilter;
    return matchesSearch && matchesBusinessType && matchesItemType;
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

  const handleTransfer = (transfer: {
    fromWarehouse: string;
    toWarehouse: string;
    items: { productId: string; quantity: number }[];
    note: string;
  }) => {
    // In demo, we just add movements or show toast
    transfer.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        // Movement Out from FromWarehouse
        addMovement({
          id: `MOV-OUT-${Date.now()}-${item.productId}`,
          productId: item.productId,
          productName: prod.name,
          type: 'out',
          quantity: item.quantity,
          uomId: prod.baseUOMId,
          date: new Date().toISOString(),
          performedBy: currentUser?.name || 'Systems Admin',
          note: `Chuyển từ ${transfer.fromWarehouse} sang ${transfer.toWarehouse}: ${transfer.note}`
        });
        // Movement In to ToWarehouse
        addMovement({
          id: `MOV-IN-${Date.now()}-${item.productId}`,
          productId: item.productId,
          productName: prod.name,
          type: 'in',
          quantity: item.quantity,
          uomId: prod.baseUOMId,
          date: new Date().toISOString(),
          performedBy: currentUser?.name || 'Systems Admin',
          note: `Nhập từ kho ${transfer.fromWarehouse}: ${transfer.note}`
        });
      }
    });

    useStore.getState().showToast('Đã thực hiện chuyển kho nội bộ thành công!', 'success');
    setShowTransferModal(false);
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
        itemType: newProd.itemType || 'finished',
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
      itemType: (item.itemType as any) || 'finished',
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

  const getTypeLabel = (type: ProductType) => {
    switch (type) {
      case 'retail': return t('inventory.type_retail');
      case 'fnb': return t('inventory.type_fnb');
      case 'service': return t('inventory.type_service');
      default: return type;
    }
  };

  const getItemTypeLabel = (type: ItemType) => {
    switch (type) {
      case 'finished': return t('inventory.item_finished');
      case 'semi_finished': return t('inventory.item_semi_finished');
      case 'raw_material': return t('inventory.item_raw');
      case 'service': return t('inventory.item_service');
      default: return type;
    }
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
    <div className="p-3 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <Boxes size={28} className="text-primary" />
            {t('inventory.title')}
          </h1>
          <p className="hidden md:block text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
            Monitoring {products.length} SKU classifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Download size={20} />
          </button>
          <button onClick={() => setShowImportModal(true)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Upload size={20} />
          </button>
          <button
            onClick={() => setShowAdjustmentModal(true)}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 shadow-lg hover:brightness-110 transition-all whitespace-nowrap"
          >
            <RefreshCcw size={18} />
            <span className="hidden sm:inline">{t('inventory.adjustment')}</span>
          </button>
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-all whitespace-nowrap"
          >
            <TruckIcon size={18} className="text-blue-500" />
            <span className="hidden sm:inline">Chuyển kho</span>
          </button>
          <button
            onClick={() => setShowAdvancedModal(true)}
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg hover:brightness-110 transition-all whitespace-nowrap"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">{t('inventory.add_product')}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('inventory.type_retail'), val: products.filter(p => p.type === 'retail').length, icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: t('inventory.type_fnb'), val: products.filter(p => p.type === 'fnb').length, icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: t('inventory.type_service'), val: products.filter(p => p.type === 'service').length, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: t('inventory.status_low_stock'), val: lowStockCount, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
        ].map((stat, i) => (

          <div key={i} className="glass-card p-4 md:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-800">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-lg'
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
          >
            {t('pos.all')}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'history'
              ? 'bg-slate-900 text-white shadow-lg'
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
          >
            <History size={16} />
            {t('inventory.movement_history')}
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="flex flex-col md:flex-row gap-4 flex-1 md:max-w-[800px]">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input
                type="text"
                placeholder={t('pos.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-primary shadow-sm"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={businessTypeFilter}
                onChange={(e) => setBusinessTypeFilter(e.target.value as any)}
                className="bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary shadow-sm"
              >
                <option value="all">Loại hình: Tất cả</option>
                <option value="retail">{getTypeLabel('retail')}</option>
                <option value="fnb">{getTypeLabel('fnb')}</option>
                <option value="service">{getTypeLabel('service')}</option>
              </select>

              <select
                value={itemTypeFilter}
                onChange={(e) => setItemTypeFilter(e.target.value as any)}
                className="bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary shadow-sm"
              >
                <option value="all">Hàng hoá: Tất cả</option>
                <option value="finished">{getItemTypeLabel('finished')}</option>
                <option value="semi_finished">{getItemTypeLabel('semi_finished')}</option>
                <option value="raw_material">{getItemTypeLabel('raw_material')}</option>
                <option value="service">{getItemTypeLabel('service')}</option>
              </select>
            </div>
          </div>
        )}

      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-500">
        {activeTab === 'overview' ? (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('inventory.product_name')}</th>
                    <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('inventory.category')}</th>
                    <th className="text-center p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('inventory.item_type')}</th>
                    <th className="text-right p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('inventory.stock_actual')}</th>
                    <th className="text-center p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('staff.status')}</th>
                    <th className="text-right p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"></th>

                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {filteredProducts.map(prod => {
                    const isLocked = prod.status === 'locked';
                    const baseUOM = uoms.find(u => u.id === prod.baseUOMId);
                    return (
                      <tr key={prod.id} className={`hover:bg-slate-50/50 transition-colors ${isLocked ? 'opacity-40 grayscale' : ''}`}>
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <img src={prod.image} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm" />
                            <div>
                              <p className="font-black text-slate-800">{prod.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{prod.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider border ${getTypeStyle(prod.type)}`}>
                            {getTypeLabel(prod.type)}
                          </span>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{prod.category}</p>
                        </td>
                        <td className="p-6 text-center">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200">
                            {getItemTypeLabel(prod.itemType)}
                          </span>
                        </td>

                        <td className="p-6 text-right font-black text-slate-900 border-none">
                          {formatCurrency(prod.price, enterpriseConfig.currency)}
                        </td>
                        <td className="p-6 text-right font-black">
                          <span className={`${prod.stock < 10 && prod.type !== 'service' ? 'text-red-500' : 'text-slate-800'} text-lg`}>
                            {prod.type === 'service' ? '∞' : prod.stock}
                          </span>
                          <span className="text-xs text-slate-400 ml-1.5 font-bold uppercase tracking-widest">{baseUOM?.code}</span>
                        </td>
                        <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${prod.stock > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                            {prod.stock > 0 ? t('inventory.status_in_stock') : t('inventory.status_out_of_stock')}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setViewingProduct(prod)} className="p-2 text-slate-300 hover:text-primary transition-colors"><Eye size={18} /></button>
                            <button onClick={() => setEditingProduct(prod)} className="p-2 text-slate-300 hover:text-primary transition-colors"><Edit3 size={18} /></button>
                            <button onClick={() => toggleProductLock(prod.id)} className={`p-2 transition-colors ${isLocked ? 'text-red-400' : 'text-slate-300 hover:text-slate-600'}`}>
                              {isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                            </button>
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
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Time</th>
                    <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Product</th>
                    <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Type</th>
                    <th className="p-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Qty Change</th>
                    <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {movements.map(mov => {
                    const uom = uoms.find(u => u.id === mov.uomId);
                    return (
                      <tr key={mov.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock size={14} />
                            <span className="font-bold">{new Date(mov.date).toLocaleString('vi-VN')}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="font-black text-slate-800">{mov.productName}</p>
                          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{mov.productId}</p>
                        </td>
                        <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getMovementTypeStyle(mov.type)}`}>
                            {mov.type}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          <span className={`font-black text-lg ${mov.type === 'in' || mov.type === 'return' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {mov.type === 'in' || mov.type === 'return' ? '+' : '-'}{mov.quantity}
                          </span>
                          <span className="text-xs text-slate-300 font-bold uppercase ml-1.5">{uom?.code}</span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-slate-500 font-bold">
                            <User size={14} />
                            {mov.performedBy}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Sidebar */}
      {viewingProduct && (
        <div className="fixed inset-0 z-[400] flex justify-end bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-8 md:p-12 flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[3rem]">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-slate-800">{t('orders.details')}</h2>
              <button onClick={() => setViewingProduct(null)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-all text-slate-400"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-10">
              <div className="flex items-center gap-8">
                <img src={viewingProduct.image} className="w-32 h-32 rounded-[2.5rem] object-cover shadow-xl border-4 border-white" />
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getTypeStyle(viewingProduct.type)}`}>{getTypeLabel(viewingProduct.type)}</span>
                  <h3 className="text-2xl font-black text-slate-800 mt-2">{viewingProduct.name}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{viewingProduct.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('inventory.stock_actual')}</p>
                  <p className="text-3xl font-black text-slate-800">{viewingProduct.stock} <span className="text-xs text-slate-400 font-bold">{uoms.find(u => u.id === viewingProduct.baseUOMId)?.code}</span></p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('pos.price')}</p>
                  <p className="text-3xl font-black text-primary">{formatCurrency(viewingProduct.price, enterpriseConfig.currency)}</p>
                </div>
              </div>

              {viewingProduct.bom && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Recipe Components</h4>
                  {viewingProduct.bom.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-5 bg-white border border-slate-100 rounded-2xl">
                      <span className="font-bold text-slate-600">{item.componentId}</span>
                      <span className="font-black text-slate-800">{item.quantity} {uoms.find(u => u.id === item.uomId)?.code}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-8 mt-auto border-t border-slate-50 grid grid-cols-2 gap-4">
              <button onClick={() => { setViewingProduct(null); setEditingProduct(viewingProduct); }} className="py-4 bg-primary text-white font-black rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-2"><Edit3 size={18} /> Edit</button>
              <button onClick={() => setViewingProduct(null)} className="py-4 bg-slate-50 text-slate-400 font-black rounded-2xl hover:bg-slate-100 transition-all">Close</button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && <ImportModal entityName="Products" templateHeaders={['id', 'name', 'type', 'category', 'price', 'stock', 'barcode', 'printGroupId', 'status']} onImport={handleImport} onClose={() => setShowImportModal(false)} />}
      {showAdjustmentModal && <InventoryAdjustmentModal products={products} onClose={() => setShowAdjustmentModal(false)} onConfirm={handleAdjustment} />}
      {showTransferModal && <WarehouseTransferModal products={products} onClose={() => setShowTransferModal(false)} onConfirm={handleTransfer} />}
      {showAdvancedModal && <AdvancedProductModal onClose={() => setShowAdvancedModal(false)} onSave={handleSaveProduct} />}
      {editingProduct && <AdvancedProductModal initialProduct={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleSaveProduct} />}
    </div>
  );
};

export default Inventory;
