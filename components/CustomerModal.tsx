
import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, Save, Award } from 'lucide-react';
import { Customer } from '../types';

interface CustomerModalProps {
    customer?: Customer | null;
    onClose: () => void;
    onSave: (customer: Partial<Customer>) => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Customer>>({
        name: '',
        phone: '',
        email: '',
        type: 'Normal',
        tier: 'Bronze',
        balance: 0,
        points: 0
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
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#333984]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-[#333984]">{customer ? 'Edit Customer' : 'New Customer'}</h2>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Profile Identification</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 pl-14 pr-6 py-4 rounded-2xl font-bold text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Phone Number</label>
                            <div className="relative">
                                <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="0901234567"
                                    className="w-full bg-gray-50 pl-14 pr-6 py-4 rounded-2xl font-bold text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    className="w-full bg-gray-50 pl-14 pr-6 py-4 rounded-2xl font-bold text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full bg-gray-50 px-6 py-4 rounded-2xl font-bold text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all"
                            >
                                <option value="Normal">Normal</option>
                                <option value="VIP">VIP</option>
                                <option value="Corporate">Corporate</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Tier</label>
                            <select
                                value={formData.tier}
                                onChange={e => setFormData({ ...formData, tier: e.target.value as any })}
                                className="w-full bg-gray-50 px-6 py-4 rounded-2xl font-bold text-[#333984] outline-none border-2 border-transparent focus:border-[#2A46FF] transition-all"
                            >
                                <option value="Bronze">Bronze</option>
                                <option value="Silver">Silver</option>
                                <option value="Gold">Gold</option>
                                <option value="Platinum">Platinum</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-5 bg-gray-50 text-[#333984] font-black rounded-2xl hover:bg-gray-100 transition-all uppercase text-xs tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-5 bg-[#2A46FF] text-white font-black rounded-2xl hover:bg-[#333984] transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                        >
                            <Save size={18} /> {customer ? 'Update Profile' : 'Create Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerModal;
