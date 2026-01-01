import React, { useState, useMemo } from 'react';
import {
    X, ClipboardList, Check, Search, AlertTriangle,
    ChevronRight, Package, Plus, Minus, Save, FileText
} from 'lucide-react';
import { Product } from '../types';

interface PhysicalCountModalProps {
    products: Product[];
    onClose: () => void;
    onConfirm: (adjustments: { productId: string; systemQty: number; actualQty: number; variance: number; note: string }[]) => void;
}

const PhysicalCountModal: React.FC<PhysicalCountModalProps> = ({
    products,
    onClose,
    onConfirm
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [countItems, setCountItems] = useState<Record<string, { actualQty: number; note: string }>>({});
    const [showOnlyVariance, setShowOnlyVariance] = useState(false);

    const filteredProducts = useMemo(() => {
        let result = products.filter(p => p.itemType !== 'service');

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
        }
        if (showOnlyVariance) {
            result = result.filter(p => {
                const count = countItems[p.id];
                return count && count.actualQty !== p.stock;
            });
        }
        return result;
    }, [products, searchQuery, showOnlyVariance, countItems]);

    const updateCount = (productId: string, actualQty: number) => {
        setCountItems({
            ...countItems,
            [productId]: { ...countItems[productId], actualQty: Math.max(0, actualQty), note: countItems[productId]?.note || '' }
        });
    };

    const updateNote = (productId: string, note: string) => {
        setCountItems({
            ...countItems,
            [productId]: { ...countItems[productId], actualQty: countItems[productId]?.actualQty ?? products.find(p => p.id === productId)?.stock ?? 0, note }
        });
    };

    const adjustments = useMemo(() => {
        return Object.entries(countItems)
            .filter(([productId, data]) => {
                const itemData = data as any;
                const product = products.find(p => p.id === productId);
                return product && itemData.actualQty !== product.stock;
            })

            .map(([productId, data]) => {
                const itemData = data as { actualQty: number; note: string };
                const product = products.find(p => p.id === productId)!;
                return {
                    productId,
                    systemQty: product.stock,
                    actualQty: itemData.actualQty,
                    variance: itemData.actualQty - product.stock,
                    note: itemData.note
                };
            });

    }, [countItems, products]);

    const handleConfirm = () => {
        onConfirm(adjustments);
    };

    const totalVariance = adjustments.reduce((sum, adj) => sum + adj.variance, 0);
    const positiveVariance = adjustments.filter(a => a.variance > 0).reduce((sum, a) => sum + a.variance, 0);
    const negativeVariance = adjustments.filter(a => a.variance < 0).reduce((sum, a) => sum + a.variance, 0);

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="glass-card w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-500">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Kiểm kê hàng tồn</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">
                                Đối chiếu số lượng thực tế với hệ thống
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 bg-slate-100 text-slate-400 hover:bg-slate-200 rounded-full transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Stats */}
                <div className="p-4 grid grid-cols-4 gap-4 border-b border-white/10">
                    <div className="p-4 bg-slate-50 rounded-xl text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Đã kiểm</p>
                        <p className="font-black text-xl text-slate-800">{Object.keys(countItems).length}</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Chênh lệch</p>
                        <p className="font-black text-xl text-amber-600">{adjustments.length}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Thừa (+)</p>
                        <p className="font-black text-xl text-emerald-500">+{positiveVariance}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Thiếu (-)</p>
                        <p className="font-black text-xl text-red-500">{negativeVariance}</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="p-4 flex items-center gap-4 border-b border-white/10">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Tìm sản phẩm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl font-bold outline-none focus:border-primary"
                        />
                    </div>
                    <label className="flex items-center gap-2 px-4 py-3 bg-white/50 border border-slate-200 rounded-xl cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showOnlyVariance}
                            onChange={(e) => setShowOnlyVariance(e.target.checked)}
                            className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm font-bold text-slate-600">Chỉ hiện chênh lệch</span>
                    </label>
                </div>

                {/* Product List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredProducts.map(product => {
                        const counted = countItems[product.id];
                        const actualQty = counted?.actualQty ?? product.stock;
                        const variance = actualQty - product.stock;
                        const hasVariance = counted && variance !== 0;

                        return (
                            <div
                                key={product.id}
                                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${hasVariance
                                    ? variance > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                                    : counted ? 'bg-blue-50 border-blue-200' : 'bg-white/50 border-slate-200'
                                    }`}
                            >
                                <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover" />

                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 truncate">{product.name}</p>
                                    <p className="text-xs text-slate-400">{product.id}</p>
                                </div>

                                <div className="text-center px-4">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Hệ thống</p>
                                    <p className="font-black text-lg text-slate-600">{product.stock}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateCount(product.id, actualQty - 1)}
                                        className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <input
                                        type="number"
                                        value={actualQty}
                                        onChange={(e) => updateCount(product.id, parseInt(e.target.value) || 0)}
                                        className="w-20 text-center font-black text-lg bg-white border-2 border-slate-200 rounded-xl py-2 outline-none focus:border-primary"
                                    />
                                    <button
                                        onClick={() => updateCount(product.id, actualQty + 1)}
                                        className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                {hasVariance && (
                                    <div className={`px-3 py-1 rounded-lg font-black text-sm ${variance > 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                        }`}>
                                        {variance > 0 ? '+' : ''}{variance}
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder="Ghi chú..."
                                    value={counted?.note || ''}
                                    onChange={(e) => updateNote(product.id, e.target.value)}
                                    className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-primary"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {adjustments.length > 0 && (
                            <div className="flex items-center gap-2 text-amber-600">
                                <AlertTriangle size={18} />
                                <span className="text-sm font-bold">{adjustments.length} sản phẩm cần điều chỉnh</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 transition-all"
                        >
                            Huỷ
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={adjustments.length === 0}
                            className="px-8 py-4 bg-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 hover:bg-purple-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Save size={18} />
                            Lưu điều chỉnh ({adjustments.length})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhysicalCountModal;
