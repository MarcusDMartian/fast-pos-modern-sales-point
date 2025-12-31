
import React, { useState, useMemo } from 'react';
import {
    Globe, ShoppingBag, Clock, Check, X, Truck, Package, MapPin, Phone,
    User, Calendar, DollarSign, AlertCircle, Eye, Printer, ChevronRight,
    Filter, Search, RefreshCw, Bell
} from 'lucide-react';
import { useStore } from '../store';

type OrderChannel = 'all' | 'grabfood' | 'shopeefood' | 'gojek' | 'website';
type OnlineOrderStatus = 'new' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';

interface OnlineOrder {
    id: string;
    channel: 'grabfood' | 'shopeefood' | 'gojek' | 'website';
    channelOrderId: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    items: { name: string; quantity: number; price: number; note?: string }[];
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    status: OnlineOrderStatus;
    orderTime: string;
    estimatedDelivery: string;
    driverName?: string;
    driverPhone?: string;
    notes?: string;
}

// Mock data
const MOCK_ONLINE_ORDERS: OnlineOrder[] = [
    {
        id: 'ON-001',
        channel: 'grabfood',
        channelOrderId: 'GF-12345678',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0901234567',
        deliveryAddress: '123 Nguyễn Huệ, Q1, TP.HCM',
        items: [
            { name: 'Cà phê sữa đá', quantity: 2, price: 35000 },
            { name: 'Bánh mì thịt', quantity: 1, price: 25000, note: 'Không hành' }
        ],
        subtotal: 95000,
        deliveryFee: 15000,
        discount: 10000,
        total: 100000,
        status: 'new',
        orderTime: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString(),
    },
    {
        id: 'ON-002',
        channel: 'shopeefood',
        channelOrderId: 'SF-87654321',
        customerName: 'Trần Thị B',
        customerPhone: '0912345678',
        deliveryAddress: '456 Lê Lợi, Q3, TP.HCM',
        items: [
            { name: 'Trà sữa trân châu', quantity: 3, price: 45000 },
        ],
        subtotal: 135000,
        deliveryFee: 20000,
        discount: 0,
        total: 155000,
        status: 'preparing',
        orderTime: new Date(Date.now() - 15 * 60000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 20 * 60000).toISOString(),
        driverName: 'Lê Văn C',
        driverPhone: '0987654321'
    },
    {
        id: 'ON-003',
        channel: 'website',
        channelOrderId: 'WEB-00123',
        customerName: 'Phạm Văn D',
        customerPhone: '0923456789',
        deliveryAddress: '789 Võ Văn Tần, Q3, TP.HCM',
        items: [
            { name: 'Combo gia đình', quantity: 1, price: 299000 },
            { name: 'Nước ngọt', quantity: 4, price: 15000 }
        ],
        subtotal: 359000,
        deliveryFee: 0,
        discount: 50000,
        total: 309000,
        status: 'ready',
        orderTime: new Date(Date.now() - 25 * 60000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 10 * 60000).toISOString(),
        driverName: 'Nguyễn Văn E',
        driverPhone: '0934567890'
    }
];

const OnlineOrders: React.FC = () => {
    const { showToast } = useStore();
    const [orders, setOrders] = useState<OnlineOrder[]>(MOCK_ONLINE_ORDERS);
    const [channelFilter, setChannelFilter] = useState<OrderChannel>('all');
    const [selectedOrder, setSelectedOrder] = useState<OnlineOrder | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = useMemo(() => {
        let result = orders;
        if (channelFilter !== 'all') {
            result = result.filter(o => o.channel === channelFilter);
        }
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            result = result.filter(o =>
                o.customerName.toLowerCase().includes(q) ||
                o.channelOrderId.toLowerCase().includes(q) ||
                o.id.toLowerCase().includes(q)
            );
        }
        return result;
    }, [orders, channelFilter, searchTerm]);

    const ordersByStatus = useMemo(() => ({
        new: orders.filter(o => o.status === 'new').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        ready: orders.filter(o => o.status === 'ready').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
    }), [orders]);

    const getChannelStyle = (channel: string) => {
        const styles: Record<string, { bg: string; text: string; name: string }> = {
            grabfood: { bg: 'bg-green-100', text: 'text-green-600', name: 'GrabFood' },
            shopeefood: { bg: 'bg-orange-100', text: 'text-orange-600', name: 'ShopeeFood' },
            gojek: { bg: 'bg-emerald-100', text: 'text-emerald-600', name: 'GoFood' },
            website: { bg: 'bg-blue-100', text: 'text-blue-600', name: 'Website' },
        };
        return styles[channel] || { bg: 'bg-slate-100', text: 'text-slate-600', name: channel };
    };

    const getStatusStyle = (status: OnlineOrderStatus) => {
        const styles: Record<string, { bg: string; text: string; label: string }> = {
            new: { bg: 'bg-red-100', text: 'text-red-600', label: 'Mới' },
            confirmed: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Đã xác nhận' },
            preparing: { bg: 'bg-amber-100', text: 'text-amber-600', label: 'Đang làm' },
            ready: { bg: 'bg-emerald-100', text: 'text-emerald-600', label: 'Sẵn sàng' },
            picked_up: { bg: 'bg-indigo-100', text: 'text-indigo-600', label: 'Đã lấy' },
            delivered: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Đã giao' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-600', label: 'Huỷ' },
        };
        return styles[status] || { bg: 'bg-slate-100', text: 'text-slate-600', label: status };
    };

    const updateOrderStatus = (orderId: string, newStatus: OnlineOrderStatus) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        showToast(`Đã cập nhật trạng thái đơn hàng!`, 'success');
    };

    const getTimeSince = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Vừa xong';
        if (mins < 60) return `${mins} phút trước`;
        return `${Math.floor(mins / 60)}h ${mins % 60}p trước`;
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3">
                        <Globe size={28} className="text-primary" />
                        Đơn hàng Online (O2O)
                    </h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                        Quản lý đơn từ GrabFood, ShopeeFood, Website...
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-all">
                        <RefreshCw size={18} />
                    </button>
                    <div className="relative">
                        <Bell size={18} className="text-slate-500" />
                        {ordersByStatus.new > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {ordersByStatus.new}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-6 border-l-4 border-red-500">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Đơn mới</p>
                    <p className="font-black text-3xl text-red-500">{ordersByStatus.new}</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-amber-500">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Đang làm</p>
                    <p className="font-black text-3xl text-amber-500">{ordersByStatus.preparing}</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-emerald-500">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Sẵn sàng</p>
                    <p className="font-black text-3xl text-emerald-500">{ordersByStatus.ready}</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-slate-400">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Đã giao</p>
                    <p className="font-black text-3xl text-slate-600">{ordersByStatus.delivered}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 p-1 bg-white/50 rounded-xl border border-slate-200">
                    {['all', 'grabfood', 'shopeefood', 'gojek', 'website'].map(channel => (
                        <button
                            key={channel}
                            onClick={() => setChannelFilter(channel as OrderChannel)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${channelFilter === channel
                                    ? 'bg-primary text-white'
                                    : 'text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            {channel === 'all' ? 'Tất cả' : getChannelStyle(channel).name}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-xs">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Tìm đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.map(order => {
                    const channelStyle = getChannelStyle(order.channel);
                    const statusStyle = getStatusStyle(order.status);

                    return (
                        <div
                            key={order.id}
                            className={`glass-card p-6 hover:shadow-xl transition-all ${order.status === 'new' ? 'border-l-4 border-red-500 animate-pulse' : ''
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${channelStyle.bg} ${channelStyle.text}`}>
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-black text-slate-800">{order.channelOrderId}</h3>
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${channelStyle.bg} ${channelStyle.text}`}>
                                                {channelStyle.name}
                                            </span>
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${statusStyle.bg} ${statusStyle.text}`}>
                                                {statusStyle.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">
                                            <Clock size={12} className="inline mr-1" />
                                            {getTimeSince(order.orderTime)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-xl text-primary">{order.total.toLocaleString()}₫</p>
                                    <p className="text-xs text-slate-400">{order.items.length} món</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <User size={14} className="text-slate-400" />
                                    {order.customerName} - {order.customerPhone}
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 md:col-span-2">
                                    <MapPin size={14} className="text-slate-400" />
                                    {order.deliveryAddress}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    {order.status === 'new' && (
                                        <>
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600 flex items-center gap-2"
                                            >
                                                <Check size={14} />
                                                Xác nhận
                                            </button>
                                            <button
                                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                className="px-4 py-2 bg-red-50 text-red-500 font-bold rounded-xl text-sm hover:bg-red-500 hover:text-white flex items-center gap-2"
                                            >
                                                <X size={14} />
                                                Huỷ
                                            </button>
                                        </>
                                    )}
                                    {order.status === 'confirmed' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                                            className="px-4 py-2 bg-amber-500 text-white font-bold rounded-xl text-sm hover:bg-amber-600"
                                        >
                                            Bắt đầu làm
                                        </button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'ready')}
                                            className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600"
                                        >
                                            Hoàn tất
                                        </button>
                                    )}
                                    {order.status === 'ready' && order.driverName && (
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Truck size={16} className="text-primary" />
                                            <span>{order.driverName} - {order.driverPhone}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-4 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-200 flex items-center gap-2"
                                >
                                    <Eye size={14} />
                                    Chi tiết
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in">
                    <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">{selectedOrder.channelOrderId}</h2>
                                <p className="text-sm text-slate-400">{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Khách hàng</p>
                                <p className="font-bold text-slate-800">{selectedOrder.customerName}</p>
                                <p className="text-sm text-slate-500">{selectedOrder.customerPhone}</p>
                                <p className="text-sm text-slate-500">{selectedOrder.deliveryAddress}</p>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Món hàng</p>
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                                        <div>
                                            <p className="font-bold text-slate-800">{item.quantity}x {item.name}</p>
                                            {item.note && <p className="text-xs text-slate-400">📝 {item.note}</p>}
                                        </div>
                                        <p className="font-bold text-slate-600">{(item.quantity * item.price).toLocaleString()}₫</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Tạm tính</span>
                                    <span className="font-bold text-slate-800">{selectedOrder.subtotal.toLocaleString()}₫</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Phí giao hàng</span>
                                    <span className="font-bold text-slate-800">{selectedOrder.deliveryFee.toLocaleString()}₫</span>
                                </div>
                                {selectedOrder.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Giảm giá</span>
                                        <span className="font-bold text-emerald-500">-{selectedOrder.discount.toLocaleString()}₫</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-slate-200">
                                    <span className="font-bold text-slate-800">Tổng cộng</span>
                                    <span className="font-black text-xl text-primary">{selectedOrder.total.toLocaleString()}₫</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => { window.print(); }}
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
                        >
                            <Printer size={18} />
                            In hoá đơn
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnlineOrders;
