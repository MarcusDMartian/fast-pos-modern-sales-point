
import React, { useState, useMemo } from 'react';
import {
  Truck, Search, Plus, Filter, Star, Phone, Mail, Building2,
  ChevronRight, FileText, Package, ClipboardCheck, Clock, Check,
  XCircle, Eye, Edit3, TrendingUp, DollarSign, Calendar, User, X
} from 'lucide-react';
import { MOCK_SUPPLIERS } from '../constants';
import { Supplier } from '../types';
import { useStore } from '../store';
import { formatCurrency } from '../utils/formatters';

type ProcurementTab = 'suppliers' | 'pr' | 'po' | 'gr';

// Types
interface PurchaseRequest {
  id: string;
  requestDate: string;
  requester: string;
  department: string;
  items: { productId: string; productName: string; quantity: number; estimatedPrice: number }[];
  totalAmount: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  notes?: string;
}

interface PurchaseOrder {
  id: string;
  prId?: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  items: { productId: string; productName: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'confirmed' | 'partial' | 'completed' | 'cancelled';
  paymentTerms: string;
}

interface GoodsReceipt {
  id: string;
  poId: string;
  receiptDate: string;
  receivedBy: string;
  items: { productId: string; productName: string; orderedQty: number; receivedQty: number; condition: 'good' | 'damaged' | 'rejected' }[];
  status: 'pending' | 'partial' | 'completed';
  notes?: string;
}

// Mock data
const MOCK_PRS: PurchaseRequest[] = [
  { id: 'PR-001', requestDate: '2024-12-30', requester: 'Nguyễn Văn A', department: 'Bếp', items: [{ productId: 'P1', productName: 'Cà phê hạt', quantity: 50, estimatedPrice: 250000 }], totalAmount: 12500000, priority: 'high', status: 'pending', notes: 'Cần gấp cho Tết' },
  { id: 'PR-002', requestDate: '2024-12-29', requester: 'Trần Thị B', department: 'Bar', items: [{ productId: 'P2', productName: 'Sữa tươi', quantity: 100, estimatedPrice: 25000 }], totalAmount: 2500000, priority: 'normal', status: 'approved' },
];

const MOCK_POS: PurchaseOrder[] = [
  { id: 'PO-001', prId: 'PR-002', supplierId: 'SUP-001', supplierName: 'ABC Foods', orderDate: '2024-12-30', expectedDelivery: '2025-01-02', items: [{ productId: 'P2', productName: 'Sữa tươi', quantity: 100, unitPrice: 24000 }], subtotal: 2400000, tax: 240000, total: 2640000, status: 'confirmed', paymentTerms: 'Net 30' },
  { id: 'PO-002', supplierId: 'SUP-002', supplierName: 'XYZ Beverages', orderDate: '2024-12-28', expectedDelivery: '2024-12-31', items: [{ productId: 'P3', productName: 'Nước ngọt', quantity: 200, unitPrice: 8000 }], subtotal: 1600000, tax: 160000, total: 1760000, status: 'partial', paymentTerms: 'Net 15' },
];

const MOCK_GRS: GoodsReceipt[] = [
  { id: 'GR-001', poId: 'PO-002', receiptDate: '2024-12-31', receivedBy: 'Lê Văn C', items: [{ productId: 'P3', productName: 'Nước ngọt', orderedQty: 200, receivedQty: 150, condition: 'good' }], status: 'partial', notes: 'Còn 50 thùng giao sau' },
];

const Suppliers: React.FC = () => {
  const { showToast, enterpriseConfig } = useStore();
  const [suppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(MOCK_PRS);
  const [purchaseOrders] = useState<PurchaseOrder[]>(MOCK_POS);
  const [goodsReceipts] = useState<GoodsReceipt[]>(MOCK_GRS);

  const [activeTab, setActiveTab] = useState<ProcurementTab>('suppliers');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-slate-50 text-slate-500 border-slate-100',
      pending: 'bg-amber-50 text-amber-600 border-amber-100',
      approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      rejected: 'bg-red-50 text-red-600 border-red-100',
      sent: 'bg-blue-50 text-blue-600 border-blue-100',
      confirmed: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      partial: 'bg-orange-50 text-orange-600 border-orange-100',
      completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      cancelled: 'bg-red-50 text-red-600 border-red-100',
      good: 'bg-emerald-50 text-emerald-600',
      damaged: 'bg-amber-50 text-amber-600',
    };
    return styles[status] || 'bg-slate-50 text-slate-500';
  };

  const getPriorityStyle = (priority: string) => {
    const styles: Record<string, string> = {
      low: 'bg-slate-100 text-slate-500',
      normal: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600',
    };
    return styles[priority] || 'bg-slate-100 text-slate-500';
  };

  const handleApprovePR = (id: string) => {
    setPurchaseRequests(prs => prs.map(pr => pr.id === id ? { ...pr, status: 'approved' } : pr));
    showToast('Đã duyệt yêu cầu mua hàng!', 'success');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3">
            <Truck size={28} className="text-primary" />
            Quản lý Mua hàng
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            Nhà cung cấp, Yêu cầu mua, Đơn đặt hàng, Nhập kho
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/50 pl-12 pr-4 py-3 rounded-2xl border border-slate-100 outline-none focus:border-primary transition-all font-bold"
            />
          </div>
          <button className="px-6 py-3 bg-primary text-white font-bold rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">
            <Plus size={18} />
            Tạo mới
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {[
          { id: 'suppliers', label: 'Nhà cung cấp', icon: Building2, count: suppliers.length },
          { id: 'pr', label: 'Yêu cầu mua (PR)', icon: FileText, count: purchaseRequests.filter(p => p.status === 'pending').length },
          { id: 'po', label: 'Đơn hàng (PO)', icon: ClipboardCheck, count: purchaseOrders.length },
          { id: 'gr', label: 'Nhập kho (GR)', icon: Package, count: goodsReceipts.filter(g => g.status === 'pending').length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProcurementTab)}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
              ? 'bg-primary text-white shadow-xl shadow-primary/20'
              : 'bg-white/50 text-slate-500 hover:bg-white'
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {filtered.map(sup => (
            <div key={sup.id} className="glass-card p-6 hover:shadow-xl transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center">
                    <Truck size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800">{sup.name}</h3>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{sup.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(sup.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs text-slate-500">
                <div className="flex items-center gap-2"><Building2 size={14} /> {sup.category}</div>
                <div className="flex items-center gap-2"><Phone size={14} /> {sup.phone}</div>
                <div className="flex items-center gap-2"><Mail size={14} /> {sup.email}</div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Liên hệ</p>
                  <p className="font-bold text-slate-800">{sup.contact}</p>
                </div>
                <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary hover:text-white transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase Requests Tab */}
      {activeTab === 'pr' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="glass-card overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="text-left p-4 pl-6">Mã PR</th>
                    <th className="text-left p-4">Người yêu cầu</th>
                    <th className="text-left p-4">Bộ phận</th>
                    <th className="text-right p-4">Tổng tiền</th>
                    <th className="text-center p-4">Ưu tiên</th>
                    <th className="text-center p-4">Trạng thái</th>
                    <th className="text-right p-4 pr-6">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseRequests.map(pr => (
                    <tr key={pr.id} className="border-t border-slate-50 hover:bg-white/50 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-slate-800">{pr.id}</p>
                        <p className="text-xs text-slate-400">{new Date(pr.requestDate).toLocaleDateString('vi-VN')}</p>
                      </td>
                      <td className="p-4 font-medium text-slate-600">{pr.requester}</td>
                      <td className="p-4 text-slate-500">{pr.department}</td>
                      <td className="p-4 text-right font-black text-primary">{formatCurrency(pr.totalAmount, enterpriseConfig.currency)}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getPriorityStyle(pr.priority)}`}>
                          {pr.priority}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-lg border text-[10px] font-bold uppercase ${getStatusStyle(pr.status)}`}>
                          {pr.status === 'pending' && 'Chờ duyệt'}
                          {pr.status === 'approved' && 'Đã duyệt'}
                          {pr.status === 'rejected' && 'Từ chối'}
                          {pr.status === 'draft' && 'Nháp'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100"><Eye size={14} /></button>
                          {pr.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprovePR(pr.id)}
                                className="p-2 bg-emerald-50 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                              >
                                <Check size={14} />
                              </button>
                              <button className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-3">
              {purchaseRequests.map(pr => (
                <div key={pr.id} className="bg-white rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-800">{pr.id}</span>
                      <p className="text-[10px] text-slate-400">{new Date(pr.requestDate).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${getPriorityStyle(pr.priority)}`}>{pr.priority}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${getStatusStyle(pr.status)}`}>
                        {pr.status === 'pending' ? 'Chờ' : pr.status === 'approved' ? 'Duyệt' : 'Từ chối'}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 mt-3 pt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Người yêu cầu</span>
                      <span className="font-medium text-slate-600">{pr.requester}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Bộ phận</span>
                      <span className="font-medium text-slate-600">{pr.department}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Tổng tiền</span>
                      <span className="font-black text-primary text-base">{formatCurrency(pr.totalAmount, enterpriseConfig.currency)}</span>
                    </div>
                  </div>
                  {pr.status === 'pending' && (
                    <div className="border-t border-slate-100 mt-3 pt-3 flex gap-2">
                      <button
                        onClick={() => handleApprovePR(pr.id)}
                        className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-xs"
                      >
                        Duyệt
                      </button>
                      <button className="flex-1 py-2 bg-red-50 text-red-500 rounded-lg font-bold text-xs">
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Purchase Orders Tab */}
      {activeTab === 'po' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {purchaseOrders.map(po => (
            <div key={po.id} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
                    <ClipboardCheck size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-slate-800">{po.id}</h3>
                      <span className={`px-2 py-1 rounded-lg border text-[10px] font-bold uppercase ${getStatusStyle(po.status)}`}>
                        {po.status === 'confirmed' && 'Đã xác nhận'}
                        {po.status === 'sent' && 'Đã gửi'}
                        {po.status === 'partial' && 'Nhận một phần'}
                        {po.status === 'completed' && 'Hoàn tất'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{po.supplierName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-xl text-primary">{formatCurrency(po.total, enterpriseConfig.currency)}</p>
                  <p className="text-xs text-slate-400">{po.paymentTerms}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Ngày đặt</p>
                  <p className="font-bold text-slate-800">{new Date(po.orderDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Dự kiến giao</p>
                  <p className="font-bold text-slate-800">{new Date(po.expectedDelivery).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Số mặt hàng</p>
                  <p className="font-bold text-slate-800">{po.items.length}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Thuế</p>
                  <p className="font-bold text-slate-800">{formatCurrency(po.tax, enterpriseConfig.currency)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 transition-all">Xem chi tiết</button>
                {po.status === 'confirmed' && (
                  <button className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary/90 transition-all">Tạo phiếu nhập</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Goods Receipt Tab */}
      {activeTab === 'gr' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {goodsReceipts.length > 0 ? goodsReceipts.map(gr => (
            <div key={gr.id} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-slate-800">{gr.id}</h3>
                      <span className={`px-2 py-1 rounded-lg border text-[10px] font-bold uppercase ${getStatusStyle(gr.status)}`}>
                        {gr.status === 'pending' && 'Chờ xử lý'}
                        {gr.status === 'partial' && 'Nhận một phần'}
                        {gr.status === 'completed' && 'Hoàn tất'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">PO: {gr.poId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{gr.receivedBy}</p>
                  <p className="text-xs text-slate-400">{new Date(gr.receiptDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <table className="w-full mb-4">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase">
                    <th className="text-left py-2">Sản phẩm</th>
                    <th className="text-right py-2">Đặt</th>
                    <th className="text-right py-2">Nhận</th>
                    <th className="text-center py-2">Tình trạng</th>
                  </tr>
                </thead>
                <tbody>
                  {gr.items.map((item, idx) => (
                    <tr key={idx} className="border-t border-slate-100">
                      <td className="py-3 font-bold text-slate-800">{item.productName}</td>
                      <td className="py-3 text-right text-slate-500">{item.orderedQty}</td>
                      <td className="py-3 text-right font-bold text-slate-800">{item.receivedQty}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusStyle(item.condition)}`}>
                          {item.condition === 'good' && 'Tốt'}
                          {item.condition === 'damaged' && 'Hư hỏng'}
                          {item.condition === 'rejected' && 'Từ chối'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {gr.notes && (
                <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-xl">📝 {gr.notes}</p>
              )}
            </div>
          )) : (
            <div className="glass-card p-12 text-center">
              <Package size={48} className="mx-auto mb-4 text-slate-200" />
              <p className="font-bold text-slate-400">Chưa có phiếu nhập kho</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Suppliers;
