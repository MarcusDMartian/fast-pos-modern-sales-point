
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, FileText, Plus, Search, ChevronRight, Truck, CheckCircle2, Clock, AlertTriangle, X, Trash2, Building2, Hash, Printer, Download } from 'lucide-react';
import { PurchaseOrder, Supplier, Product } from '../types';
import { MOCK_SUPPLIERS, MOCK_PRODUCTS } from '../constants';
import { useStore } from '../store';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters';

const Procurement: React.FC = () => {
  const { enterpriseConfig } = useStore();
  const [pos, setPos] = useState<PurchaseOrder[]>([
    { id: 'PO-1001', supplierId: 'S1', supplierName: 'Coffee Farm Direct', date: '2025-05-10', total: 1500, status: 'Sent', items: [{ productId: 'SKU-1001', name: 'Espresso Beans', quantity: 10, cost: 150 }] },
    { id: 'PO-1002', supplierId: 'S2', supplierName: 'Dairy Fresh Vietnam', date: '2025-05-08', total: 800, status: 'Received', items: [] },
  ]);

  const [showCreatePO, setShowCreatePO] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const [newSupplierId, setNewSupplierId] = useState(MOCK_SUPPLIERS[0].id);
  const [newItems, setNewItems] = useState<{ productId: string; name: string; quantity: number; cost: number }[]>([]);

  const handleCreatePO = () => {
    const supplier = MOCK_SUPPLIERS.find(s => s.id === newSupplierId);
    const newPO: PurchaseOrder = {
      id: `PO-${Math.floor(Math.random() * 9000) + 1000}`,
      supplierId: newSupplierId,
      supplierName: supplier?.name || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      total: newItems.reduce((acc, curr) => acc + (curr.cost * curr.quantity), 0),
      status: 'Sent',
      items: newItems
    };
    setPos([newPO, ...pos]);
    setShowCreatePO(false);
    setNewItems([]);
  };

  const handleReceiveStock = (poId: string) => {
    setPos(prev => prev.map(po => po.id === poId ? { ...po, status: 'Received' } : po));
    setShowReceipt(false);
    alert('Inventory updated successfully!');
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Received': return 'bg-green-50 text-green-600';
      case 'Sent': return 'bg-blue-50 text-blue-600';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">Procurement Hub</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Acquisition management & supplier logistics</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowReceipt(true)}
            className="bg-white/40 backdrop-blur-xl text-slate-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 border border-white/60 shadow-lg hover:bg-white transition-all scale-105 active:scale-95 text-[11px] uppercase tracking-wider"
          >
            <Package size={20} />
            Inventory Receipt
          </button>
          <button
            onClick={() => setShowCreatePO(true)}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary-glow hover:bg-slate-900 transition-all scale-110 active:scale-95 text-[11px] uppercase tracking-wider ml-2"
          >
            <Plus size={20} />
            New Purchase Order
          </button>
        </div>
      </div>

      <div className="glass-card shadow-xl overflow-hidden animate-in fade-in duration-500">
        <div className="p-6 md:p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40">
          <div>
            <h3 className="text-base md:text-lg font-extrabold text-slate-800 tracking-tight">Active Requisitions</h3>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status monitor</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input className="bg-white/50 border border-white pl-10 md:pl-12 pr-4 md:pr-6 py-2.5 md:py-3 rounded-lg md:rounded-xl text-xs md:text-[13px] font-bold outline-none w-full md:w-72 focus:bg-white focus:border-primary transition-all shadow-sm" placeholder="Lookup PO..." />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left table-fixed min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-slate-900/5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <th className="p-10 pl-12 w-[180px]">Order ID</th>
                <th className="p-10">Global Supplier</th>
                <th className="p-10 w-[150px]">Issue Date</th>
                <th className="p-10 w-[150px]">Tracking</th>
                <th className="p-10 w-[200px] text-right pr-12">Capital Total</th>
                <th className="p-10 w-[120px] text-right sticky right-0"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pos.map(order => (
                <tr key={order.id} className="hover:bg-white/40 transition-colors group">
                  <td className="p-10 pl-12 font-extrabold text-slate-800 text-[13px]">{order.id}</td>
                  <td className="p-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900/5 text-slate-600 flex items-center justify-center font-extrabold text-xs shadow-inner border border-white">{order.supplierName.charAt(0)}</div>
                      <span className="text-[14px] font-bold text-slate-700 tracking-tight">{order.supplierName}</span>
                    </div>
                  </td>
                  <td className="p-10 text-[13px] font-medium text-slate-400">{order.date}</td>
                  <td className="p-10">
                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${order.status === 'Received' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-10 text-right pr-12 font-extrabold text-slate-800 text-lg group-hover:text-primary transition-colors">{formatCurrency(order.total, enterpriseConfig.currency)}</td>
                  <td className="p-8 text-right">
                    <button
                      onClick={() => setSelectedPO(order)}
                      className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-[var(--primary-600)] hover:text-white transition-all shadow-sm"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden p-4 space-y-3">
          {pos.map(order => (
            <div key={order.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-800">{order.id}</span>
                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-bold uppercase ${order.status === 'Received' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {order.status}
                </span>
              </div>
              <div className="border-t border-slate-100 mt-3 pt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Nhà cung cấp</span>
                  <span className="font-bold text-slate-700">{order.supplierName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Ngày</span>
                  <span className="font-medium text-slate-600">{order.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-xs">Tổng tiền</span>
                  <span className="font-black text-primary text-base">{formatCurrency(order.total, enterpriseConfig.currency)}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 mt-3 pt-3">
                <button
                  onClick={() => setSelectedPO(order)}
                  className="w-full py-2.5 bg-slate-50 text-slate-600 rounded-lg font-bold text-xs flex items-center justify-center gap-2"
                >
                  Xem chi tiết <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE PO MODAL */}
      {showCreatePO && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh] border border-white/60">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Purchase Requisition</h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Vendor Procurement Protocol</p>
              </div>
              <button onClick={() => setShowCreatePO(false)} className="p-3 bg-slate-100 text-slate-400 hover:text-slate-600 transition-all rounded-full"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar space-y-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Select Supplier</label>
                <select
                  value={newSupplierId}
                  onChange={(e) => setNewSupplierId(e.target.value)}
                  className="w-full bg-gray-50 px-6 py-5 rounded-2xl text-lg font-black text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] appearance-none transition-all"
                >
                  {MOCK_SUPPLIERS.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Order Items</label>
                  <button
                    onClick={() => setNewItems([...newItems, { productId: MOCK_PRODUCTS[0].id, name: MOCK_PRODUCTS[0].name, quantity: 1, cost: MOCK_PRODUCTS[0].price }])}
                    className="text-[10px] font-black text-[var(--primary-600)] flex items-center gap-1 hover:underline"
                  >
                    <Plus size={12} /> Add Line
                  </button>
                </div>

                <div className="space-y-3">
                  {newItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-4 bg-gray-50 rounded-[1.5rem] items-center border border-gray-100">
                      <select
                        className="flex-1 bg-white px-3 py-2 rounded-lg text-xs font-bold"
                        value={item.productId}
                        onChange={(e) => {
                          const p = MOCK_PRODUCTS.find(prod => prod.id === e.target.value);
                          setNewItems(newItems.map((it, i) => i === idx ? { ...it, productId: e.target.value, name: p?.name || '', cost: p?.price || 0 } : it));
                        }}
                      >
                        {MOCK_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <input
                        type="number"
                        className="w-20 bg-white px-3 py-2 rounded-lg text-xs font-bold text-center"
                        value={item.quantity}
                        onChange={(e) => setNewItems(newItems.map((it, i) => i === idx ? { ...it, quantity: parseInt(e.target.value) } : it))}
                      />
                      <div className="w-24 relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">{getCurrencySymbol(enterpriseConfig.currency)}</span>
                        <input type="number" className="w-full bg-white pl-5 pr-2 py-2 rounded-lg text-xs font-bold" value={item.cost} onChange={(e) => setNewItems(newItems.map((it, i) => i === idx ? { ...it, cost: parseFloat(e.target.value) } : it))} />
                      </div>
                      <button onClick={() => setNewItems(newItems.filter((_, i) => i !== idx))} className="text-red-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-900 border-t border-white/5 flex items-center justify-between">
              <div className="px-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dự toán đơn hàng</p>
                <p className="text-3xl font-extrabold text-primary tracking-tight">{formatCurrency(newItems.reduce((acc, it) => acc + (it.cost * it.quantity), 0), enterpriseConfig.currency)}</p>
              </div>
              <button
                onClick={handleCreatePO}
                disabled={newItems.length === 0}
                className="px-12 py-5 bg-primary text-white font-extrabold text-md rounded-2xl hover:bg-white hover:text-primary transition-all shadow-xl shadow-primary/20 disabled:opacity-30 scale-105 active:scale-95"
              >
                Authorize & Send PO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INVENTORY RECEIPT MODAL */}
      {showReceipt && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/60">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight text-center">Inbound Logistics</h2>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Stock Verification Hub</p>
              </div>
              <button onClick={() => setShowReceipt(false)} className="p-3 bg-slate-100 text-slate-400 hover:text-slate-600 transition-all rounded-full"><X size={24} /></button>
            </div>

            <div className="p-10 space-y-6">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Select Sent PO #</label>
              <div className="space-y-3">
                {pos.filter(po => po.status === 'Sent').map(po => (
                  <button
                    key={po.id}
                    onClick={() => handleReceiveStock(po.id)}
                    className="w-full p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between hover:border-[var(--primary-600)] hover:bg-blue-50/20 transition-all group"
                  >
                    <div className="text-left">
                      <p className="font-black text-[var(--primary-700)] text-md">{po.id}</p>
                      <p className="text-[10px] font-bold text-gray-500">{po.supplierName} • {formatCurrency(po.total, enterpriseConfig.currency)}</p>
                    </div>
                    <div className="p-3 bg-white text-green-500 rounded-xl group-hover:scale-110 transition-transform"><CheckCircle2 size={18} /></div>
                  </button>
                ))}
                {pos.filter(po => po.status === 'Sent').length === 0 && (
                  <div className="py-20 text-center opacity-30">
                    <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-xs font-black uppercase text-gray-500">No pending shipments to receive</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PO DETAIL DRAWER */}
      {selectedPO && (
        <div className="fixed inset-0 z-[400] flex justify-end bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-xl bg-white/95 backdrop-blur-3xl h-full shadow-2xl p-12 flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[3rem] border-l border-white/60">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4">{selectedPO.id}</h2>
                <div className="flex items-center gap-3">
                  <span className={`px-5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] border ${selectedPO.status === 'Received' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{selectedPO.status}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Requisition</span>
                </div>
              </div>
              <button onClick={() => setSelectedPO(null)} className="p-3 bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all rounded-full"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-10 pr-4">
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
                <div className="flex items-center gap-6 mb-8 relative z-10">
                  <div className="p-5 bg-white/10 rounded-2xl text-primary shadow-lg backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform"><Building2 size={28} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Procured From</p>
                    <h4 className="text-2xl font-extrabold tracking-tight mt-1">{selectedPO.supplierName}</h4>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5 relative z-10">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors"><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Issue Date</p><p className="text-sm font-extrabold mt-1">{selectedPO.date}</p></div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors"><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Serial Index</p><p className="text-sm font-extrabold mt-1">#RE-112233</p></div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4">Line Item Breakdown</h4>
                {selectedPO.items.map((item, i) => (
                  <div key={i} className="p-8 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-between shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-900/5 rounded-2xl flex items-center justify-center font-extrabold text-[15px] text-primary shadow-inner">{item.quantity}x</div>
                      <div>
                        <p className="text-[15px] font-extrabold text-slate-800 tracking-tight">{item.name}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Giá nhập: {formatCurrency(item.cost, enterpriseConfig.currency)}</p>
                      </div>
                    </div>
                    <p className="text-xl font-extrabold text-slate-800 group-hover:text-primary transition-colors tracking-tight">{formatCurrency(item.cost * item.quantity, enterpriseConfig.currency)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 mt-auto flex gap-5">
              <button className="flex-1 py-5 bg-slate-900/5 text-slate-600 font-extrabold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all text-[11px] uppercase tracking-widest">
                <Printer size={20} /> Print Requisition
              </button>
              <button className="flex-1 py-5 bg-slate-900 text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 hover:bg-primary shadow-xl transition-all text-[11px] uppercase tracking-widest active:scale-95">
                <Download size={20} /> Export Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Procurement;
