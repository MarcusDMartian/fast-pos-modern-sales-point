import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Order, OrderStatus, ReturnOrder } from '../types';
import { Search, RotateCcw, FileText, Filter, Calendar, PackageCheck, CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import ReturnOrderModal from '../components/ReturnOrderModal';
import { formatCurrency } from '../utils/formatters';

type TabType = 'all' | 'returns';

const Orders: React.FC = () => {
  const { t } = useTranslation();
  const { orders, returnOrders, addReturnOrder, updateReturnOrder, updateOrderStatus, updateCustomer, customers, enterpriseConfig } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);

  const handleReturnSubmit = (returnData: Omit<ReturnOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReturn: ReturnOrder = {
      ...returnData,
      id: `RET-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addReturnOrder(newReturn);
    setShowReturnModal(false);
  };

  const handleApproveReturn = (returnOrder: ReturnOrder) => {
    updateReturnOrder(returnOrder.id, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    updateOrderStatus(returnOrder.originalOrderId, 'refunded');

    const order = orders.find(o => o.id === returnOrder.originalOrderId);
    if (order && order.paymentMethod === 'Credit' && order.customerId) {
      const customer = customers.find(c => c.id === order.customerId);
      if (customer) {
        updateCustomer(order.customerId, {
          balance: customer.balance + order.total
        });
      }
    }
  };

  const handleRejectReturn = (returnOrder: ReturnOrder) => {
    updateReturnOrder(returnOrder.id, { status: 'rejected', updatedAt: new Date().toISOString() });
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [orders, searchQuery]);

  const getStatusStyle = (status: OrderStatus | ReturnOrder['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'processing':
      case 'pending':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-50 text-red-600 border-red-100';
      case 'refunded':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return t('orders.status_completed');
      case 'processing': return t('orders.status_processing');
      case 'cancelled': return t('orders.status_cancelled');
      case 'refunded': return t('orders.status_refunded');
      case 'approved': return t('common.success');
      case 'pending': return t('orders.status_processing');
      case 'rejected': return t('common.error');
      default: return status;
    }
  };

  const getReturnReasonLabel = (reason: ReturnOrder['reason']) => {
    switch (reason) {
      case 'damaged': return 'Sản phẩm lỗi/hỏng';
      case 'wrong_item': return 'Giao sai sản phẩm';
      case 'expired': return 'Hết hạn sử dụng';
      case 'customer_request': return 'Khách đổi ý';
      default: return 'Khác';
    }
  };

  return (
    <div className="p-3 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <FileText size={28} className="text-primary" />
            {t('orders.title')}
          </h1>
          <p className="hidden md:block text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
            {t('sidebar.orders')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input
              type="text"
              placeholder={t('orders.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-primary shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-lg'
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
            }`}
        >
          {t('pos.all')}
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'returns'
              ? 'bg-slate-900 text-white shadow-lg'
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
            }`}
        >
          <RotateCcw size={16} />
          {t('orders.return_order')} ({returnOrders.length})
        </button>
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-500">
        {activeTab === 'all' ? (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('orders.order_id')}</th>
                    <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('orders.time')}</th>
                    <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('payment.method')}</th>
                    <th className="text-right p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('orders.amount')}</th>
                    <th className="text-center p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('orders.status')}</th>
                    <th className="text-right p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 font-black text-slate-800">{order.id}</td>
                      <td className="p-6 text-slate-400 font-bold">
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {new Date(order.date).toLocaleString('vi-VN')}
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="p-6 text-right font-black text-slate-900 text-lg">
                        {formatCurrency(order.total, enterpriseConfig.currency)}
                      </td>
                      <td className="p-6 text-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        {order.status === 'completed' && (
                          <button
                            onClick={() => setShowReturnModal(true)}
                            className="p-2 text-orange-400 hover:text-orange-600 transition-colors"
                            title={t('orders.return_order')}
                          >
                            <RotateCcw size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                        <PackageCheck size={56} className="mx-auto mb-4 text-slate-200" />
                        <p className="font-bold text-slate-400">Không có đơn hàng nào</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {returnOrders.length === 0 ? (
              <div className="glass-card p-20 text-center">
                <RotateCcw size={56} className="mx-auto mb-4 text-slate-200" />
                <p className="font-bold text-slate-400">Chưa có đơn trả hàng nào</p>
              </div>
            ) : (
              returnOrders.map((ret) => (
                <div key={ret.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl">
                      <RotateCcw size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-black text-slate-800 text-lg">{ret.id}</h4>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(ret.status)}`}>
                          {getStatusLabel(ret.status)}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-400">
                        {t('orders.details')}: {ret.originalOrderId} • {getReturnReasonLabel(ret.reason)}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(ret.returnDate).toLocaleDateString('vi-VN')}</span>
                        <span className="flex items-center gap-1.5"><PackageCheck size={12} /> {ret.items.length} {t('pos.product_name')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hoàn tiền</p>
                      <p className="font-black text-2xl text-primary">{formatCurrency(ret.totalRefund, enterpriseConfig.currency)}</p>
                    </div>

                    {ret.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRejectReturn(ret)}
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-100"
                        >
                          <XCircle size={20} />
                        </button>
                        <button
                          onClick={() => handleApproveReturn(ret)}
                          className="p-3 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm shadow-emerald-100"
                        >
                          <CheckCircle2 size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

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
