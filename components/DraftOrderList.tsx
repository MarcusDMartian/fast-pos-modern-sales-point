import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, FileText, Clock, Trash2, Play, Table2, Search, Filter, Calendar } from 'lucide-react';
import { DraftOrder } from '../types';

interface DraftOrderListProps {
    drafts: DraftOrder[];
    onClose: () => void;
    onResume: (draft: DraftOrder) => void;
    onDelete: (draftId: string) => void;
}

const DraftOrderList: React.FC<DraftOrderListProps> = ({ drafts, onClose, onResume, onDelete }) => {
    const { t, i18n } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterBy, setFilterBy] = useState<'all' | 'mine'>('all');

    const filteredDrafts = drafts.filter(draft => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return draft.name.toLowerCase().includes(q) || draft.id.toLowerCase().includes(q);
        }
        return true;
    });

    const getTimeSince = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 1) return t('pos.just_saved');
        if (diffMins < 60) return t('pos.mins_ago', { count: diffMins });
        if (diffHours < 24) return t('pos.hours_ago', { count: diffHours });
        return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US');
    };

    const getExpiryWarning = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours >= 20) return t('pos.expiring_soon');
        return null;
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="glass-card w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('pos.draft_orders')}</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                                {t('pos.draft_subtitle', { count: drafts.length })}
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

                {/* Search & Filter */}
                <div className="p-6 border-b border-white/10 flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="text"
                            placeholder={t('pos.search_draft')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl text-slate-800 font-bold outline-none focus:border-primary transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilterBy('all')}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${filterBy === 'all'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white/50 text-slate-500 hover:bg-white'
                                }`}
                        >
                            {t('pos.filter_all')}
                        </button>
                        <button
                            onClick={() => setFilterBy('mine')}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${filterBy === 'mine'
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white/50 text-slate-500 hover:bg-white'
                                }`}
                        >
                            {t('pos.filter_mine')}
                        </button>
                    </div>
                </div>

                {/* Draft List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {filteredDrafts.length === 0 ? (
                        <div className="text-center py-16">
                            <FileText size={56} className="mx-auto mb-4 text-slate-200" />
                            <p className="font-bold text-slate-400 mb-2">{t('pos.no_drafts')}</p>
                            <p className="text-sm text-slate-300">{t('pos.save_draft_instruction')}</p>
                        </div>
                    ) : (
                        filteredDrafts.map((draft) => {
                            const expiryWarning = getExpiryWarning(draft.createdAt);
                            return (
                                <div
                                    key={draft.id}
                                    className={`p-5 bg-white/60 hover:bg-white border rounded-2xl transition-all group ${expiryWarning ? 'border-amber-200' : 'border-white/60 hover:border-primary/30'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className={`p-3 rounded-xl ${expiryWarning ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-500'}`}>
                                                <FileText size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-black text-slate-800 truncate">{draft.name}</h3>
                                                    {expiryWarning && (
                                                        <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[9px] font-bold rounded-lg uppercase tracking-widest shrink-0">
                                                            {expiryWarning}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {getTimeSince(draft.createdAt)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FileText size={12} />
                                                        {t('pos.products_count', { count: draft.items.length })}
                                                    </span>
                                                    {draft.tableId && (
                                                        <span className="flex items-center gap-1">
                                                            <Table2 size={12} />
                                                            {t('pos.table')} {draft.tableId}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Items preview */}
                                                <div className="flex flex-wrap gap-1 mt-3">
                                                    {draft.items.slice(0, 3).map((item, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg">
                                                            {item.name} x{item.quantity}
                                                        </span>
                                                    ))}
                                                    {draft.items.length > 3 && (
                                                        <span className="px-2 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-lg">
                                                            +{draft.items.length - 3} {t('common.other') /* Fallback if not available */}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => onDelete(draft.id)}
                                                className="p-2.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                title={t('common.delete')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => onResume(draft)}
                                                className="px-4 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 text-xs"
                                            >
                                                <Play size={14} />
                                                {t('pos.continue')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {drafts.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-white/5 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                            <Calendar size={12} className="inline mr-1" />
                            {t('pos.draft_auto_delete')}
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                        >
                            {t('common.close')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DraftOrderList;
