import React, { useState, useMemo } from 'react';
import {
    X, ArrowRight, Package, Warehouse, TruckIcon, Check, Search,
    AlertTriangle, Info, ChevronRight, ArrowDownRight, ArrowUpRight
} from 'lucide-react';
import { Product } from '../types';

interface WarehouseTransferModalProps {
    products: Product[];
    onClose: () => void;
    onConfirm: (transfer: {
        fromWarehouse: string;
        toWarehouse: string;
        items: { productId: string; quantity: number }[];
        note: string;
    }) => void;
}

// Mock warehouses
const WAREHOUSES = [
    { id: 'WH-001', name: 'Kho Chính (HCM)', location: 'Quận 1, TP.HCM', type: 'main' },
    { id: 'WH-002', name: 'Kho Phụ (Bình Dương)', location: 'Thuận An, Bình Dương', type: 'secondary' },
    { id: 'WH-003', name: 'Kho Lạnh', location: 'Quận 7, TP.HCM', type: 'cold' },
    { id: 'WH-004', name: 'Chi nhánh Quận 3', location: 'Quận 3, TP.HCM', type: 'branch' },
];

const WarehouseTransferModal: React.FC<WarehouseTransferModalProps> = ({
    products,
    onClose,
    onConfirm
}) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [fromWarehouse, setFromWarehouse] = useState('');
    const [toWarehouse, setToWarehouse] = useState('');
    const [transferItems, setTransferItems] = useState<{ productId: string; quantity: number }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [note, setNote] = useState('');

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products.filter(p => p.type !== 'service');
        const q = searchQuery.toLowerCase();
        return products.filter(p =>
            p.type !== 'service' &&
            (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
        );
    }, [products, searchQuery]);

    const toggleProduct = (productId: string) => {
        const existing = transferItems.find(i => i.productId === productId);
        if (existing) {
            setTransferItems(transferItems.filter(i => i.productId !== productId));
        } else {
            setTransferItems([...transferItems, { productId, quantity: 1 }]);
        }
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setTransferItems(transferItems.map(i =>
            i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i
        ));
    };

    const handleConfirm = () => {
        onConfirm({
            fromWarehouse,
            toWarehouse,
            items: transferItems,
            note
        });
    };

    const canProceed = () => {
        switch (step) {
            case 1: return fromWarehouse && toWarehouse && fromWarehouse !== toWarehouse;
            case 2: return transferItems.length > 0;
            case 3: return true;
            default: return false;
        }
    };

    const getWarehouse = (id: string) => WAREHOUSES.find(w => w.id === id);

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
                            <TruckIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Chuyển kho nội bộ</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">
                                Bước {step}/3 • {step === 1 ? 'Chọn kho' : step === 2 ? 'Chọn hàng' : 'Xác nhận'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 bg-slate-100 text-slate-400 hover:bg-slate-200 rounded-full transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Progress */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((s) => (
                            <React.Fragment key={s}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${s < step ? 'bg-emerald-500 text-white' :
                                        s === step ? 'bg-primary text-white' :
                                            'bg-slate-100 text-slate-400'
                                    }`}>
                                    {s < step ? <Check size={16} /> : s}
                                </div>
                                {s < 3 && (
                                    <div className={`flex-1 h-1 rounded-full ${s < step ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Select Warehouses */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            <div>
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <ArrowUpRight size={18} className="text-orange-500" />
                                    Kho xuất
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {WAREHOUSES.map(wh => (
                                        <button
                                            key={wh.id}
                                            onClick={() => setFromWarehouse(wh.id)}
                                            disabled={wh.id === toWarehouse}
                                            className={`p-4 rounded-2xl border text-left transition-all ${fromWarehouse === wh.id
                                                    ? 'bg-orange-50 border-orange-300'
                                                    : wh.id === toWarehouse
                                                        ? 'opacity-30 cursor-not-allowed border-slate-200'
                                                        : 'bg-white/50 border-slate-200 hover:border-orange-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Warehouse size={20} className={fromWarehouse === wh.id ? 'text-orange-500' : 'text-slate-400'} />
                                                <div>
                                                    <p className="font-bold text-slate-800">{wh.name}</p>
                                                    <p className="text-xs text-slate-400">{wh.location}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <div className="p-3 bg-slate-100 rounded-full text-slate-400">
                                    <ArrowRight size={24} />
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <ArrowDownRight size={18} className="text-emerald-500" />
                                    Kho nhập
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {WAREHOUSES.map(wh => (
                                        <button
                                            key={wh.id}
                                            onClick={() => setToWarehouse(wh.id)}
                                            disabled={wh.id === fromWarehouse}
                                            className={`p-4 rounded-2xl border text-left transition-all ${toWarehouse === wh.id
                                                    ? 'bg-emerald-50 border-emerald-300'
                                                    : wh.id === fromWarehouse
                                                        ? 'opacity-30 cursor-not-allowed border-slate-200'
                                                        : 'bg-white/50 border-slate-200 hover:border-emerald-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Warehouse size={20} className={toWarehouse === wh.id ? 'text-emerald-500' : 'text-slate-400'} />
                                                <div>
                                                    <p className="font-bold text-slate-800">{wh.name}</p>
                                                    <p className="text-xs text-slate-400">{wh.location}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Products */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative flex-1">
                                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input
                                        type="text"
                                        placeholder="Tìm sản phẩm..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-800 font-bold outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold">
                                    Đã chọn: {transferItems.length}
                                </div>
                            </div>

                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {filteredProducts.map(product => {
                                    const selected = transferItems.find(i => i.productId === product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${selected ? 'bg-blue-50 border-blue-200' : 'bg-white/50 border-slate-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => toggleProduct(product.id)}
                                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selected ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300'
                                                        }`}
                                                >
                                                    {selected && <Check size={14} />}
                                                </button>
                                                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                                                <div>
                                                    <p className="font-bold text-slate-800">{product.name}</p>
                                                    <p className="text-xs text-slate-400">Tồn kho: {product.stock}</p>
                                                </div>
                                            </div>
                                            {selected && (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(product.id, selected.quantity - 1)}
                                                        className="w-8 h-8 bg-slate-100 rounded-lg font-bold"
                                                    >-</button>
                                                    <input
                                                        type="number"
                                                        value={selected.quantity}
                                                        onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                                                        className="w-16 text-center font-bold bg-white border border-slate-200 rounded-lg py-1"
                                                    />
                                                    <button
                                                        onClick={() => updateQuantity(product.id, selected.quantity + 1)}
                                                        className="w-8 h-8 bg-slate-100 rounded-lg font-bold"
                                                    >+</button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirm */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Transfer Summary */}
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                                <div className="text-center">
                                    <Warehouse size={32} className="mx-auto mb-2 text-orange-500" />
                                    <p className="font-bold text-slate-800">{getWarehouse(fromWarehouse)?.name}</p>
                                    <p className="text-xs text-slate-400">Kho xuất</p>
                                </div>
                                <ArrowRight size={32} className="text-slate-300" />
                                <div className="text-center">
                                    <Warehouse size={32} className="mx-auto mb-2 text-emerald-500" />
                                    <p className="font-bold text-slate-800">{getWarehouse(toWarehouse)?.name}</p>
                                    <p className="text-xs text-slate-400">Kho nhập</p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h4 className="font-bold text-slate-800 mb-3">Danh sách hàng chuyển ({transferItems.length} sản phẩm)</h4>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {transferItems.map(item => {
                                        const product = products.find(p => p.id === item.productId);
                                        return product ? (
                                            <div key={item.productId} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                                    <span className="font-bold text-slate-800">{product.name}</span>
                                                </div>
                                                <span className="font-black text-primary">x{item.quantity}</span>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ghi chú</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Lý do chuyển kho..."
                                    className="w-full mt-2 p-4 bg-white border border-slate-200 rounded-xl font-medium resize-none"
                                    rows={2}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-between">
                    <button
                        onClick={() => step > 1 ? setStep((step - 1) as 1 | 2) : onClose()}
                        className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 transition-all"
                    >
                        {step === 1 ? 'Huỷ' : 'Quay lại'}
                    </button>
                    <button
                        onClick={() => step < 3 ? setStep((step + 1) as 2 | 3) : handleConfirm()}
                        disabled={!canProceed()}
                        className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {step < 3 ? 'Tiếp tục' : 'Xác nhận chuyển kho'}
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WarehouseTransferModal;
