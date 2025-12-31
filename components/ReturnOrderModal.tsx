import React, { useState, useMemo } from 'react';
import { X, Search, RotateCcw, AlertTriangle, CheckCircle2, Package, Receipt, DollarSign } from 'lucide-react';
import { Order, CartItem, ReturnOrder, ReturnOrderItem, ReturnReason, RefundMethod, ItemCondition } from '../types';

interface ReturnOrderModalProps {
    orders: Order[];
    onClose: () => void;
    onSubmit: (returnOrder: Omit<ReturnOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const RETURN_REASONS: { value: ReturnReason; label: string }[] = [
    { value: 'defective', label: 'Lỗi sản phẩm' },
    { value: 'change_mind', label: 'Đổi ý' },
    { value: 'wrong_item', label: 'Giao sai hàng' },
    { value: 'damaged', label: 'Hư hỏng' },
    { value: 'expired', label: 'Hết hạn' },
    { value: 'other', label: 'Lý do khác' },
];

const REFUND_METHODS: { value: RefundMethod; label: string }[] = [
    { value: 'cash', label: 'Tiền mặt' },
    { value: 'card', label: 'Thẻ (Hoàn về thẻ)' },
    { value: 'voucher', label: 'Voucher' },
    { value: 'store_credit', label: 'Tín dụng cửa hàng' },
];

const ReturnOrderModal: React.FC<ReturnOrderModalProps> = ({ orders, onClose, onSubmit }) => {
    const [step, setStep] = useState<'search' | 'select' | 'confirm'>('search');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedItems, setSelectedItems] = useState<Map<string, { qty: number; condition: ItemCondition }>>(new Map());
    const [reason, setReason] = useState<ReturnReason>('defective');
    const [reasonDetail, setReasonDetail] = useState('');
    const [refundMethod, setRefundMethod] = useState<RefundMethod>('cash');
    const [restockingFeePercent, setRestockingFeePercent] = useState(0);
    const [notes, setNotes] = useState('');

    // Filter completed orders only
    const eligibleOrders = useMemo(() => {
        return orders.filter(o => o.status === 'completed');
    }, [orders]);

    // Search orders
    const filteredOrders = useMemo(() => {
        if (!searchQuery.trim()) return eligibleOrders.slice(0, 10);
        const q = searchQuery.toLowerCase();
        return eligibleOrders.filter(o =>
            o.id.toLowerCase().includes(q) ||
            (o.customerId && o.customerId.toLowerCase().includes(q))
        );
    }, [eligibleOrders, searchQuery]);

    // Calculate refund amounts
    const refundCalculation = useMemo(() => {
        if (!selectedOrder) return { subtotal: 0, restockingFee: 0, total: 0 };

        let subtotal = 0;
        selectedItems.forEach((item, itemId) => {
            const orderItem = selectedOrder.items.find(i => i.id === itemId);
            if (orderItem) {
                subtotal += orderItem.price * item.qty;
            }
        });

        const restockingFee = subtotal * (restockingFeePercent / 100);
        const total = subtotal - restockingFee;

        return { subtotal, restockingFee, total };
    }, [selectedOrder, selectedItems, restockingFeePercent]);

    const handleSelectOrder = (order: Order) => {
        setSelectedOrder(order);
        setSelectedItems(new Map());
        setStep('select');
    };

    const handleToggleItem = (item: CartItem, qty: number, condition: ItemCondition) => {
        const newMap = new Map(selectedItems);
        if (qty <= 0) {
            newMap.delete(item.id);
        } else {
            newMap.set(item.id, { qty: Math.min(qty, item.quantity), condition });
        }
        setSelectedItems(newMap);
    };

    const handleSubmit = () => {
        if (!selectedOrder || selectedItems.size === 0) return;

        const returnItems: ReturnOrderItem[] = [];
        selectedItems.forEach((data, itemId) => {
            const orderItem = selectedOrder.items.find(i => i.id === itemId);
            if (orderItem) {
                returnItems.push({
                    id: `RI-${Date.now()}-${itemId}`,
                    originalOrderItemId: itemId,
                    productId: orderItem.id,
                    productName: orderItem.name,
                    quantityReturned: data.qty,
                    originalQuantity: orderItem.quantity,
                    originalUnitPrice: orderItem.price,
                    refundAmountPerUnit: orderItem.price * (1 - restockingFeePercent / 100),
                    totalRefundAmount: orderItem.price * data.qty * (1 - restockingFeePercent / 100),
                    itemCondition: data.condition,
                });
            }
        });

        onSubmit({
            originalOrderId: selectedOrder.id,
            originalOrderDate: selectedOrder.date,
            customerId: selectedOrder.customerId,
            branchId: selectedOrder.branchId,
            returnDate: new Date().toISOString(),
            reason,
            reasonDetail: reasonDetail || undefined,
            status: 'pending',
            notes: notes || undefined,
            items: returnItems,
            subtotalRefund: refundCalculation.subtotal,
            restockingFee: refundCalculation.restockingFee,
            totalRefund: refundCalculation.total,
            refundMethod,
            createdBy: 'current-user', // Will be replaced by actual user
        });
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                            <RotateCcw size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Đơn Trả Hàng</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                                {step === 'search' && 'Bước 1: Tìm đơn hàng gốc'}
                                {step === 'select' && 'Bước 2: Chọn sản phẩm trả'}
                                {step === 'confirm' && 'Bước 3: Xác nhận hoàn tiền'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Step 1: Search Order */}
                    {step === 'search' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="relative">
                                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    type="text"
                                    placeholder="Nhập mã đơn hàng hoặc tên khách hàng..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-white/50 border border-slate-200 rounded-2xl text-slate-800 font-bold outline-none focus:border-primary transition-all"
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-3">
                                {filteredOrders.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400">
                                        <Receipt size={48} className="mx-auto mb-4 opacity-30" />
                                        <p className="font-bold text-sm">Không tìm thấy đơn hàng</p>
                                    </div>
                                ) : (
                                    filteredOrders.map(order => (
                                        <button
                                            key={order.id}
                                            onClick={() => handleSelectOrder(order)}
                                            className="w-full p-5 bg-white/40 hover:bg-white border border-white/60 hover:border-primary/30 rounded-2xl flex items-center justify-between transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm">
                                                    #{order.id.slice(-3)}
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-slate-800">{order.id}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {new Date(order.date).toLocaleDateString('vi-VN')} • {order.items.length} sản phẩm
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-slate-800">{order.total.toLocaleString()}₫</p>
                                                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{order.status}</p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Items */}
                    {step === 'select' && selectedOrder && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="p-5 bg-slate-100 rounded-2xl flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-slate-800">Đơn hàng: {selectedOrder.id}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Ngày mua: {new Date(selectedOrder.date).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <button onClick={() => { setSelectedOrder(null); setStep('search'); }} className="text-xs font-bold text-primary">
                                    Đổi đơn hàng
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Chọn sản phẩm trả</h4>
                                {selectedOrder.items.map(item => {
                                    const selected = selectedItems.get(item.id);
                                    return (
                                        <div key={item.id} className={`p-5 rounded-2xl border transition-all ${selected ? 'bg-primary/5 border-primary/30' : 'bg-white/40 border-white/60'}`}>
                                            <div className="flex items-start gap-4">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                                                <div className="flex-1">
                                                    <p className="font-bold text-slate-800">{item.name}</p>
                                                    <p className="text-sm text-slate-400">Đã mua: {item.quantity} • Giá: {item.price.toLocaleString()}₫</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={item.quantity}
                                                        value={selected?.qty || 0}
                                                        onChange={(e) => handleToggleItem(item, parseInt(e.target.value) || 0, selected?.condition || 'perfect')}
                                                        className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl text-center font-bold outline-none focus:border-primary"
                                                    />
                                                    <select
                                                        value={selected?.condition || 'perfect'}
                                                        onChange={(e) => selected && handleToggleItem(item, selected.qty, e.target.value as ItemCondition)}
                                                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none focus:border-primary"
                                                        disabled={!selected}
                                                    >
                                                        <option value="perfect">Nguyên vẹn</option>
                                                        <option value="minor_defect">Lỗi nhẹ</option>
                                                        <option value="major_defect">Lỗi nặng</option>
                                                        <option value="damaged">Hư hỏng</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Reason & Notes */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lý do trả hàng *</label>
                                    <select
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value as ReturnReason)}
                                        className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-primary"
                                    >
                                        {RETURN_REASONS.map(r => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Phí hoàn kho (%)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={restockingFeePercent}
                                        onChange={(e) => setRestockingFeePercent(parseInt(e.target.value) || 0)}
                                        className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            {reason === 'other' && (
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Chi tiết lý do</label>
                                    <textarea
                                        value={reasonDetail}
                                        onChange={(e) => setReasonDetail(e.target.value)}
                                        className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-primary resize-none"
                                        rows={2}
                                        placeholder="Mô tả chi tiết lý do trả hàng..."
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Confirm */}
                    {step === 'confirm' && selectedOrder && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Summary */}
                            <div className="p-6 bg-slate-900 text-white rounded-3xl">
                                <h4 className="font-black uppercase text-xs tracking-widest mb-6 text-slate-400">Tổng kết hoàn tiền</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                                        <span className="text-slate-400">Tổng giá trị hàng trả</span>
                                        <span className="font-black text-xl">{refundCalculation.subtotal.toLocaleString()}₫</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                                        <span className="text-slate-400">Phí hoàn kho ({restockingFeePercent}%)</span>
                                        <span className="font-black text-red-400">-{refundCalculation.restockingFee.toLocaleString()}₫</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-slate-200 font-bold">HOÀN TIỀN</span>
                                        <span className="font-black text-3xl text-primary">{refundCalculation.total.toLocaleString()}₫</span>
                                    </div>
                                </div>
                            </div>

                            {/* Refund Method */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Phương thức hoàn tiền</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {REFUND_METHODS.map(m => (
                                        <button
                                            key={m.value}
                                            onClick={() => setRefundMethod(m.value)}
                                            className={`p-4 rounded-2xl border transition-all text-left ${refundMethod === m.value ? 'bg-primary text-white border-primary' : 'bg-white/40 border-white/60 hover:border-primary/30'}`}
                                        >
                                            <p className="font-bold text-sm">{m.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ghi chú</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-primary resize-none"
                                    rows={2}
                                    placeholder="Ghi chú thêm về đơn trả hàng..."
                                />
                            </div>

                            {/* Warning */}
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                                <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-700 font-medium">
                                    Đơn trả hàng sẽ được gửi để Manager phê duyệt trước khi tiến hành hoàn tiền.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between items-center">
                    {step !== 'search' && (
                        <button
                            onClick={() => setStep(step === 'confirm' ? 'select' : 'search')}
                            className="px-6 py-3 text-slate-500 font-bold text-sm hover:text-slate-700 transition-all"
                        >
                            ← Quay lại
                        </button>
                    )}
                    {step === 'search' && <div />}

                    {step === 'select' && (
                        <button
                            onClick={() => setStep('confirm')}
                            disabled={selectedItems.size === 0}
                            className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3"
                        >
                            <DollarSign size={18} />
                            Tiếp tục hoàn tiền
                        </button>
                    )}

                    {step === 'confirm' && (
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-3"
                        >
                            <CheckCircle2 size={18} />
                            Xác nhận trả hàng
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReturnOrderModal;
