
import React, { useState, useEffect } from 'react';
import { X, User, Shield, Key, Save, Mail, Phone, Briefcase } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeModalProps {
    employee?: Employee | null;
    onClose: () => void;
    onSave: (employee: Partial<Employee>) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<Employee>>({
        name: '',
        role: 'Waiter',
        pin: '',
        email: '',
        phone: '',
        avatar: '',
        status: 'Active'
    });

    useEffect(() => {
        if (employee) {
            setFormData(employee);
        }
    }, [employee]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[var(--primary-700)]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-[var(--primary-700)]">{employee ? 'Edit Team Member' : 'New Team Member'}</h2>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">HRM Profile Setup</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-all"><X /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Alex Nguyen"
                                    className="w-full bg-gray-50 pl-14 pr-6 py-4 rounded-2xl font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Access PIN</label>
                            <div className="relative">
                                <Key size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    required
                                    type="password"
                                    maxLength={4}
                                    value={formData.pin}
                                    onChange={e => setFormData({ ...formData, pin: e.target.value })}
                                    placeholder="1234"
                                    className="w-full bg-gray-50 pl-14 pr-6 py-4 rounded-2xl font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Role & Permissions</label>
                            <div className="relative">
                                <Shield size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                                    className="w-full bg-gray-50 pl-14 pr-6 py-4 rounded-2xl font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all appearance-none"
                                >
                                    <option value="Admin">System Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Cashier">Cashier</option>
                                    <option value="Waiter">Waiter</option>
                                    <option value="Kitchen">Kitchen Staff</option>
                                </select>
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
                                    placeholder="alex@fastpos.com"
                                    className="w-full bg-gray-50 pl-14 pr-6 py-4 rounded-2xl font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-5 bg-gray-50 text-[var(--primary-700)] font-black rounded-2xl hover:bg-gray-100 transition-all uppercase text-xs tracking-widest"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-5 bg-[var(--primary-600)] text-white font-black rounded-2xl hover:bg-[var(--primary-700)] transition-all shadow-xl shadow-primary-200 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                        >
                            <Save size={18} /> {employee ? 'Update Member' : 'Create Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;
