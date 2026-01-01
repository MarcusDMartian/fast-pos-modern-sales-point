
import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Save, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { Customer } from '../types';

interface CustomerModalProps {
    customer?: Customer | null;
    onClose: () => void;
    onSave: (customer: Partial<Customer>) => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onClose, onSave }) => {
    const { t } = useTranslation();
    const { loyaltyConfig } = useStore();
    const [formData, setFormData] = useState<Partial<Customer>>({
        name: '',
        phone: '',
        email: '',
        type: 'Normal',
        tier: loyaltyConfig.tiers[0]?.name || 'Member',
        balance: 0,
        points: 0,
        totalPointsAccumulated: 0,
        totalPointsSpent: 0,
        birthday: ''
    });

    useEffect(() => {
        if (customer) {
            setFormData(customer);
        }
    }, [customer]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[var(--primary-700)]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-[var(--primary-700)]">
                            {customer ? t('inventory.advanced.edit_product') : t('customers.add_new')}
                        </h2>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Profile Identification</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{t('pos.product_name')}</label>
                            <div className="relative">
                                <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 pl-14 pr-6 py-4 rounded-2xl font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{t('customers.search_placeholder').split(',')[1]?.trim() || 'Phone'}</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="0901234567"
                                    className="w-full bg-gray-50 pl-14 pr-6 py-4 rounded-2xl font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{t('customers.birthday')}</label>
                            <div className="relative">
                                <Calendar size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    value={formData.birthday}
                                    onChange={e => setFormData({ ...formData, birthday: e.target.value })}
                                    className="w-full bg-gray-50 pl-14 pr-6 py-4 rounded-2xl font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full bg-gray-50 px-6 py-4 rounded-2xl font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
                            >
                                <option value="Normal">Normal</option>
                                <option value="VIP">VIP</option>
                                <option value="Corporate">Corporate</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{t('loyalty.tier_name')}</label>
                            <select
                                value={formData.tier}
                                onChange={e => setFormData({ ...formData, tier: e.target.value as any })}
                                className="w-full bg-gray-50 px-6 py-4 rounded-2xl font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
                            >
                                {loyaltyConfig.tiers.map(tier => (
                                    <option key={tier.name} value={tier.name}>{tier.name}</option>
                                ))}
                                {loyaltyConfig.tiers.length === 0 && <option value="Member">Member</option>}
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-5 bg-gray-50 text-[var(--primary-700)] font-black rounded-2xl hover:bg-gray-100 transition-all uppercase text-xs tracking-widest"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="py-5 bg-[var(--primary-600)] text-white font-black rounded-2xl hover:bg-[var(--primary-700)] transition-all shadow-xl shadow-primary-200 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                        >
                            <Save size={18} /> {customer ? t('settings.commit_updates') : t('common.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerModal;
