import React, { useState, useMemo } from 'react';
import { X, Merge, Check, ChevronRight, Search, FileText, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { DraftOrder, CartItem } from '../types';

interface MergeOrderModalProps {
    drafts: DraftOrder[];
    currentCartItems: CartItem[];
    onClose: () => void;
    onConfirm: (mergedItems: CartItem[], mergedDraftIds: string[]) => void;
}

const MergeOrderModal: React.FC<MergeOrderModalProps> = ({
    drafts,
    currentCartItems,
    onClose,
    onConfirm
}) => {
    const [selectedDraftIds, setSelectedDraftIds] = useState<Set<string>>(new Set());
    const [includeCurrentCart, setIncludeCurrentCart] = useState(currentCartItems.length > 0);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDrafts = useMemo(() => {
        if (!searchQuery) return drafts;
        const q = searchQuery.toLowerCase();
        return drafts.filter(d => d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q));
    }, [drafts, searchQuery]);

    const toggleDraft = (draftId: string) => {
        const newSet = new Set(selectedDraftIds);
        if (newSet.has(draftId)) {
            newSet.delete(draftId);
        } else {
            newSet.add(draftId);
        }
        setSelectedDraftIds(newSet);
    };

    const mergedItems = useMemo(() => {
        const itemMap = new Map<string, CartItem>();

        // Add current cart items if selected
        if (includeCurrentCart) {
            currentCartItems.forEach(item => {
                const existing = itemMap.get(item.id);
                if (existing) {
                    itemMap.set(item.id, { ...existing, quantity: existing.quantity + item.quantity });
                } else {
                    itemMap.set(item.id, { ...item });
                }
            });
        }

        // Add selected draft items
        selectedDraftIds.forEach(draftId => {
            const draft = drafts.find(d => d.id === draftId);
            if (draft) {
                draft.items.forEach(item => {
                    const existing = itemMap.get(item.id);
                    if (existing) {
                        itemMap.set(item.id, { ...existing, quantity: existing.quantity + item.quantity });
                    } else {
                        itemMap.set(item.id, { ...item });
                    }
                });
            }
        });

        return Array.from(itemMap.values());
    }, [selectedDraftIds, includeCurrentCart, currentCartItems, drafts]);

    const totalItems = mergedItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = mergedItems.reduce((acc, item) => acc + item.totalPrice * item.quantity, 0);
    const canMerge = mergedItems.length > 0 && (selectedDraftIds.size > 0 || (includeCurrentCart && currentCartItems.length > 0));

    const handleConfirm = () => {
        onConfirm(mergedItems, Array.from(selectedDraftIds));
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500">
                            <Merge size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gộp Đơn Hàng</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                                Chọn các đơn để gộp thành một
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Source Selection */}
                    <div className="flex-1 border-r border-white/10 p-6 flex flex-col overflow-hidden">
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-4">Nguồn đơn hàng</h4>

                        {/* Current Cart Option */}
                        {currentCartItems.length > 0 && (
                            <button
                                onClick={() => setIncludeCurrentCart(!includeCurrentCart)}
                                className={`w-full p-4 rounded-2xl border mb-4 flex items-center justify-between transition-all ${includeCurrentCart
                                        ? 'bg-primary/10 border-primary/30'
                                        : 'bg-white/40 border-white/60 hover:border-primary/30'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${includeCurrentCart ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                        <ShoppingCart size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-800 text-sm">Giỏ hàng hiện tại</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {currentCartItems.length} sản phẩm
                                        </p>
                                    </div>
                                </div>
                                {includeCurrentCart && (
                                    <Check size={18} className="text-primary" />
                                )}
                            </button>
                        )}

                        {/* Search */}
                        <div className="relative mb-4">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                type="text"
                                placeholder="Tìm đơn nháp..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-800 font-bold outline-none focus:border-primary transition-all text-sm"
                            />
                        </div>

                        {/* Draft List */}
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {filteredDrafts.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <FileText size={32} className="mx-auto mb-2 opacity-30" />
                                    <p className="text-xs font-bold">Không có đơn nháp</p>
                                </div>
                            ) : (
                                filteredDrafts.map(draft => (
                                    <button
                                        key={draft.id}
                                        onClick={() => toggleDraft(draft.id)}
                                        className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${selectedDraftIds.has(draft.id)
                                                ? 'bg-blue-50 border-blue-200'
                                                : 'bg-white/40 border-white/60 hover:border-blue-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedDraftIds.has(draft.id) ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                <FileText size={18} />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-slate-800 text-sm">{draft.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {draft.items.length} sản phẩm • {draft.serviceType}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedDraftIds.has(draft.id) && (
                                            <Check size={18} className="text-blue-500" />
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: Preview */}
                    <div className="w-[340px] bg-slate-50/50 p-6 flex flex-col overflow-hidden">
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-4">
                            Kết quả gộp ({totalItems} sản phẩm)
                        </h4>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            {mergedItems.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <Merge size={32} className="mx-auto mb-2 opacity-30" />
                                    <p className="text-xs font-bold">Chọn đơn để xem kết quả</p>
                                </div>
                            ) : (
                                mergedItems.map(item => (
                                    <div key={item.id} className="p-3 bg-white rounded-xl border border-slate-100 flex items-center gap-3">
                                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-800 text-xs truncate">{item.name}</p>
                                            <p className="text-[10px] text-slate-400">{item.quantity}x • {(item.totalPrice * item.quantity).toLocaleString()}₫</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Total */}
                        {mergedItems.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tổng tiền</span>
                                    <span className="font-black text-xl text-primary">{totalAmount.toLocaleString()}₫</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 transition-all"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!canMerge}
                        className="px-8 py-4 bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-primary-1000/20 hover:bg-blue-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-3"
                    >
                        <Merge size={18} />
                        Gộp {selectedDraftIds.size + (includeCurrentCart ? 1 : 0)} đơn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MergeOrderModal;
