
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { Order, OrderStatus, ReturnOrder } from '../types';
import { Search, RotateCcw, XCircle, FileText, CheckCircle2, AlertTriangle, X, Banknote, CreditCard, Landmark, Users, PackageCheck, Filter, Calendar, Clock, Eye, Receipt, ArrowLeft } from 'lucide-react';
import ReturnOrderModal from '../components/ReturnOrderModal';

type TabType = 'orders' | 'returns';

const Orders: React.FC = () => {
  const { orders, updateOrder, returnOrders, addReturnOrder, updateReturnOrder, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('orders');
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<ReturnOrder | null>(null);

  const updateStatus = (id: string, status: OrderStatus) => {
    updateOrder(id, { status });
  };

  const handleReturnSubmit = (returnData: Omit<ReturnOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReturn: ReturnOrder = {
      ...returnData,
      id: `RET-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addReturnOrder(newReturn);
    updateOrder(returnData.originalOrderId, { status: 'refunded' });
    setShowReturnModal(false);
    showToast('Đơn trả hàng đã được tạo thành công!', 'success');
  };

  const handleApproveReturn = (returnOrder: ReturnOrder) => {
    updateReturnOrder(returnOrder.id, {
      status: 'approved',
      approvedBy: 'current-user',
      approvedAt: new Date().toISOString()
    });
    showToast(`Đơn trả hàng ${returnOrder.id} đã được duyệt!`, 'success');
  };

  const handleRejectReturn = (returnOrder: ReturnOrder) => {
    updateReturnOrder(returnOrder.id, { status: 'rejected' });
    showToast(`Đơn trả hàng ${returnOrder.id} đã bị từ chối.`, 'error');
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => filter === 'all' || o.status === filter);
  }, [orders, filter]);

  const getStatusStyle = (status: OrderStatus | ReturnOrder['status']) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-500 border border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-500 border border-red-100';
      case 'refunded': return 'bg-orange-50 text-orange-500 border border-orange-100';
      case 'pending': return 'bg-amber-50 text-amber-500 border border-amber-100';
      case 'approved': return 'bg-blue-50 text-blue-500 border border-blue-100';
      case 'rejected': return 'bg-red-50 text-red-500 border border-red-100';
      default: return 'bg-slate-50 text-slate-500 border border-slate-100';
    }
  };

  const getReturnReasonLabel = (reason: ReturnOrder['reason']) => {
    const labels: Record<ReturnOrder['reason'], string> = {
      defective: 'Lỗi sản phẩm',
      change_mind: 'Đổi ý',
      wrong_item: 'Giao sai',
      damaged: 'Hư hỏng',
      expired: 'Hết hạn',
      other: 'Khác',
    };
    return labels[reason];
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Order Management</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Lifecycle tracking & transaction history</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'orders' && (
            <button
              onClick={() => setShowReturnModal(true)}
              className="px-6 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all text-sm flex items-center gap-2"
            >
              <RotateCcw size={18} />
              Tạo Đơn Trả Hàng
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'orders'
              ? 'bg-primary text-white shadow-xl shadow-primary/20'
              : 'bg-white/40 text-slate-500 hover:bg-white hover:text-slate-800'
            }`}
        >
          <div className="flex items-center gap-2">
            <Receipt size={16} />
            Đơn Hàng ({orders.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === 'returns'
              ? 'bg-primary text-white shadow-xl shadow-primary/20'
              : 'bg-white/40 text-slate-500 hover:bg-white hover:text-slate-800'
            }`}
        >
          <div className="flex items-center gap-2">
            <RotateCcw size={16} />
            Đơn Trả Hàng ({returnOrders.length})
          </div>
        </button>

        {activeTab === 'orders' && (
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="ml-auto bg-white/40 backdrop-blur-xl px-6 py-3 rounded-2xl text-slate-800 font-bold shadow-lg border border-white/60 outline-none focus:border-primary transition-all cursor-pointer text-sm"
          >
            <option value="all">Tất cả</option>
            <option value="completed">Hoàn thành</option>
            <option value="refunded">Đã trả</option>
            <option value="cancelled">Đã huỷ</option>
          </select>
        )}
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="glass-card overflow-hidden animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px] border-collapse">
              <thead>
                <tr className="bg-slate-900/5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="p-6 pl-8">Mã đơn</th>
                  <th className="p-6">Thời gian</th>
                  <th className="p-6">Phương thức</th>
                  <th className="p-6">Số lượng</th>
                  <th className="p-6">Tổng tiền</th>
                  <th className="p-6">Trạng thái</th>
                  <th className="p-6 text-right pr-8">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/40 transition-colors group">
                    <td className="p-6 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-primary group-hover:text-white transition-all">
                          <FileText size={16} />
                        </div>
                        <span className="font-extrabold text-sm text-slate-800">{order.id}</span>
                      </div>
                    </td>
                    <td className="p-6 text-xs font-bold text-slate-400">{new Date(order.date).toLocaleString('vi-VN')}</td>
                    <td className="p-6 text-xs font-bold text-slate-600 uppercase tracking-wider">{order.paymentMethod}</td>
                    <td className="p-6 text-sm font-bold text-slate-600">{order.items.length} sản phẩm</td>
                    <td className="p-6 font-black text-primary text-lg">{order.total.toLocaleString()}₫</td>
                    <td className="p-6">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                        {order.status === 'completed' && 'Hoàn thành'}
                        {order.status === 'refunded' && 'Đã trả'}
                        {order.status === 'cancelled' && 'Đã huỷ'}
                        {order.status === 'draft' && 'Nháp'}
                        {order.status === 'pending' && 'Chờ xử lý'}
                      </span>
                    </td>
                    <td className="p-6 text-right pr-8">
                      {order.status === 'completed' && (
                        <button
                          onClick={() => setShowReturnModal(true)}
                          className="p-2.5 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all border border-orange-100"
                          title="Tạo đơn trả hàng"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-20 text-center">
                      <PackageCheck size={56} className="mx-auto mb-4 text-slate-200" />
                      <p className="font-bold text-slate-400">Không có đơn hàng nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Returns Tab */}
      {activeTab === 'returns' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {returnOrders.length === 0 ? (
            <div className="glass-card p-20 text-center">
              <RotateCcw size={56} className="mx-auto mb-4 text-slate-200" />
              <p className="font-bold text-slate-400">Chưa có đơn trả hàng nào</p>
              <button
                onClick={() => setShowReturnModal(true)}
                className="mt-6 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all text-sm"
              >
                Tạo Đơn Trả Hàng Đầu Tiên
              </button>
            </div>
          ) : (
            returnOrders.map((ret) => (
              <div key={ret.id} className="glass-card p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl">
                      <RotateCcw size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-black text-slate-800 text-lg">{ret.id}</h3>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${getStatusStyle(ret.status)}`}>
                          {ret.status === 'pending' && 'Chờ duyệt'}
                          {ret.status === 'approved' && 'Đã duyệt'}
                          {ret.status === 'rejected' && 'Từ chối'}
                          {ret.status === 'completed' && 'Hoàn tất'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mb-1">
                        <span className="font-bold text-slate-600">Đơn gốc:</span> {ret.originalOrderId}
                      </p>
                      <p className="text-sm text-slate-400">
                        <span className="font-bold text-slate-600">Lý do:</span> {getReturnReasonLabel(ret.reason)}
                        {ret.reasonDetail && ` - ${ret.reasonDetail}`}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(ret.returnDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <PackageCheck size={12} />
                          {ret.items.length} sản phẩm
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-400 mb-1">Hoàn tiền</p>
                    <p className="font-black text-2xl text-primary">{ret.totalRefund.toLocaleString()}₫</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {ret.refundMethod === 'cash' && 'Tiền mặt'}
                      {ret.refundMethod === 'card' && 'Thẻ'}
                      {ret.refundMethod === 'voucher' && 'Voucher'}
                      {ret.refundMethod === 'store_credit' && 'Tín dụng'}
                    </p>

                    {ret.status === 'pending' && (
                      <div className="flex items-center gap-2 mt-4 justify-end">
                        <button
                          onClick={() => handleRejectReturn(ret)}
                          className="px-4 py-2 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs"
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() => handleApproveReturn(ret)}
                          className="px-4 py-2 bg-emerald-50 text-emerald-500 font-bold rounded-xl hover:bg-emerald-500 hover:text-white transition-all text-xs"
                        >
                          Duyệt
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Return Order Modal */}
      {showReturnModal && (
        <ReturnOrderModal
          orders={orders}
          onClose={() => setShowReturnModal(false)}
          onSubmit={handleReturnSubmit}
        />
      )}
    </div>
  );
};

export default Orders;
