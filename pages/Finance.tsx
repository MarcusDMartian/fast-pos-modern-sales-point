
import React, { useState, useMemo } from 'react';
import {
  DollarSign, ArrowUpCircle, ArrowDownCircle, Plus, Search, Filter, Calendar, FileText,
  CheckCircle2, X, Clock, AlertTriangle, TrendingUp, Wallet, Receipt, BookOpen,
  Users, Target, PieChart, Briefcase, CreditCard, Building2, ArrowRight, Check, XCircle
} from 'lucide-react';
import { useStore } from '../store';
import { Expense } from '../types';

type FinanceTab = 'overview' | 'budget' | 'expenses' | 'vouchers' | 'journal';

// Budget types
interface Budget {
  id: string;
  name: string;
  category: string;
  allocated: number;
  spent: number;
  period: string;
}

// Voucher types
interface Voucher {
  id: string;
  type: 'receipt' | 'payment';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  approvedBy?: string;
}

// Mock data
const MOCK_BUDGETS: Budget[] = [
  { id: 'BUD-001', name: 'Nguyên liệu thực phẩm', category: 'COGS', allocated: 50000000, spent: 35000000, period: 'T12/2024' },
  { id: 'BUD-002', name: 'Tiền lương nhân viên', category: 'HR', allocated: 80000000, spent: 75000000, period: 'T12/2024' },
  { id: 'BUD-003', name: 'Marketing & Quảng cáo', category: 'Marketing', allocated: 15000000, spent: 8000000, period: 'T12/2024' },
  { id: 'BUD-004', name: 'Chi phí vận hành', category: 'Operations', allocated: 20000000, spent: 12000000, period: 'T12/2024' },
];

const MOCK_VOUCHERS: Voucher[] = [
  { id: 'VCH-001', type: 'receipt', amount: 5000000, description: 'Thu tiền khách hàng ABC', date: new Date().toISOString(), status: 'approved', createdBy: 'NV Kế Toán', approvedBy: 'Manager' },
  { id: 'VCH-002', type: 'payment', amount: 2500000, description: 'Thanh toán nhà cung cấp XYZ', date: new Date().toISOString(), status: 'pending', createdBy: 'NV Kế Toán' },
  { id: 'VCH-003', type: 'receipt', amount: 10000000, description: 'Thu nợ đối tác', date: new Date().toISOString(), status: 'pending', createdBy: 'NV Kế Toán' },
];

const Finance: React.FC = () => {
  const { expenses, addExpense, currentUser, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddVoucher, setShowAddVoucher] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNote, setExpenseNote] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Utilities');

  // Voucher form state
  const [voucherType, setVoucherType] = useState<'receipt' | 'payment'>('receipt');
  const [voucherAmount, setVoucherAmount] = useState('');
  const [voucherDescription, setVoucherDescription] = useState('');

  // Local state for vouchers (would be in store in production)
  const [vouchers, setVouchers] = useState<Voucher[]>(MOCK_VOUCHERS);
  const [budgets] = useState<Budget[]>(MOCK_BUDGETS);

  const totalExpense = useMemo(() => expenses.reduce((acc, curr) => acc + curr.amount, 0), [expenses]);
  const totalBudgetAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  const pendingVouchers = vouchers.filter(v => v.status === 'pending');
  const totalReceiptVouchers = vouchers.filter(v => v.type === 'receipt' && v.status === 'approved').reduce((sum, v) => sum + v.amount, 0);
  const totalPaymentVouchers = vouchers.filter(v => v.type === 'payment' && v.status === 'approved').reduce((sum, v) => sum + v.amount, 0);

  const handleAddExpense = () => {
    if (!expenseAmount) return;
    const newExpense: Expense = {
      id: `EXP-${Date.now()}`,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      note: expenseNote,
      date: new Date().toISOString(),
      createdBy: currentUser?.name || 'Unknown'
    };
    addExpense(newExpense);
    setShowAddExpense(false);
    setExpenseAmount('');
    setExpenseNote('');
    showToast('Đã tạo phiếu chi thành công!', 'success');
  };

  const handleAddVoucher = () => {
    if (!voucherAmount || !voucherDescription) return;
    const newVoucher: Voucher = {
      id: `VCH-${Date.now()}`,
      type: voucherType,
      amount: parseFloat(voucherAmount),
      description: voucherDescription,
      date: new Date().toISOString(),
      status: 'pending',
      createdBy: currentUser?.name || 'Unknown'
    };
    setVouchers([newVoucher, ...vouchers]);
    setShowAddVoucher(false);
    setVoucherAmount('');
    setVoucherDescription('');
    showToast(`Đã tạo phiếu ${voucherType === 'receipt' ? 'thu' : 'chi'} thành công!`, 'success');
  };

  const handleApproveVoucher = (id: string) => {
    setVouchers(vouchers.map(v => v.id === id ? { ...v, status: 'approved', approvedBy: currentUser?.name } : v));
    showToast('Đã duyệt phiếu!', 'success');
  };

  const handleRejectVoucher = (id: string) => {
    setVouchers(vouchers.map(v => v.id === id ? { ...v, status: 'rejected' } : v));
    showToast('Đã từ chối phiếu!', 'error');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">Tài Chính & Kế Toán</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Quản lý ngân sách, thu chi và sổ kế toán</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddVoucher(true)}
            className="px-6 py-4 bg-emerald-500 text-white font-bold rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all text-sm"
          >
            <ArrowUpCircle size={18} />
            Phiếu Thu
          </button>
          <button
            onClick={() => setShowAddExpense(true)}
            className="px-6 py-4 bg-orange-500 text-white font-bold rounded-2xl flex items-center gap-2 shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all text-sm"
          >
            <ArrowDownCircle size={18} />
            Phiếu Chi
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {[
          { id: 'overview', label: 'Tổng quan', icon: PieChart },
          { id: 'budget', label: 'Ngân sách', icon: Target },
          { id: 'expenses', label: 'Chi phí', icon: ArrowDownCircle },
          { id: 'vouchers', label: 'Chứng từ', icon: Receipt },
          { id: 'journal', label: 'Sổ cái', icon: BookOpen },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as FinanceTab)}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-primary text-white shadow-xl shadow-primary/20'
                : 'bg-white/50 text-slate-500 hover:bg-white'
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 hover:scale-102 transition-transform">
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl w-fit mb-4"><ArrowUpCircle size={24} /></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng thu</p>
              <h3 className="text-2xl font-black text-emerald-500">{totalReceiptVouchers.toLocaleString()}₫</h3>
            </div>
            <div className="glass-card p-6 hover:scale-102 transition-transform">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl w-fit mb-4"><ArrowDownCircle size={24} /></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng chi</p>
              <h3 className="text-2xl font-black text-orange-500">{(totalPaymentVouchers + totalExpense).toLocaleString()}₫</h3>
            </div>
            <div className="glass-card p-6 hover:scale-102 transition-transform">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl w-fit mb-4"><Clock size={24} /></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chờ duyệt</p>
              <h3 className="text-2xl font-black text-amber-500">{pendingVouchers.length} chứng từ</h3>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl text-white hover:scale-102 transition-transform">
              <div className="p-3 bg-white/10 text-primary rounded-xl w-fit mb-4"><Wallet size={24} /></div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tiền mặt ròng</p>
              <h3 className="text-2xl font-black">{(totalReceiptVouchers - totalPaymentVouchers - totalExpense).toLocaleString()}₫</h3>
            </div>
          </div>

          {/* Budget Overview */}
          <div className="glass-card p-8">
            <h3 className="font-black text-slate-800 mb-6 flex items-center gap-3">
              <Target size={20} className="text-primary" />
              Tình hình ngân sách tháng này
            </h3>
            <div className="space-y-4">
              {budgets.map(budget => (
                <div key={budget.id} className="p-4 bg-white/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-800">{budget.name}</p>
                      <p className="text-xs text-slate-400">{budget.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800">{budget.spent.toLocaleString()}₫</p>
                      <p className="text-[10px] text-slate-400">/ {budget.allocated.toLocaleString()}₫</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${(budget.spent / budget.allocated) > 0.9 ? 'bg-red-500' :
                          (budget.spent / budget.allocated) > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      style={{ width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Đã sử dụng {((budget.spent / budget.allocated) * 100).toFixed(0)}%
                    {budget.spent > budget.allocated && <span className="text-red-500 ml-2">⚠ Vượt ngân sách!</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-800 text-lg">Quản lý Ngân sách</h3>
              <button className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm flex items-center gap-2">
                <Plus size={16} />
                Tạo ngân sách mới
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-6 bg-slate-50 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tổng phân bổ</p>
                <p className="font-black text-2xl text-slate-800">{totalBudgetAllocated.toLocaleString()}₫</p>
              </div>
              <div className="p-6 bg-emerald-50 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Đã chi</p>
                <p className="font-black text-2xl text-emerald-500">{totalBudgetSpent.toLocaleString()}₫</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Còn lại</p>
                <p className="font-black text-2xl text-blue-500">{(totalBudgetAllocated - totalBudgetSpent).toLocaleString()}₫</p>
              </div>
              <div className="p-6 bg-amber-50 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tỷ lệ sử dụng</p>
                <p className="font-black text-2xl text-amber-500">{((totalBudgetSpent / totalBudgetAllocated) * 100).toFixed(0)}%</p>
              </div>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="text-left p-4">Hạng mục</th>
                  <th className="text-left p-4">Loại</th>
                  <th className="text-right p-4">Phân bổ</th>
                  <th className="text-right p-4">Đã chi</th>
                  <th className="text-right p-4">Còn lại</th>
                  <th className="text-center p-4">Tiến độ</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map(budget => (
                  <tr key={budget.id} className="border-b border-slate-50 hover:bg-white/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{budget.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">{budget.category}</span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-600">{budget.allocated.toLocaleString()}₫</td>
                    <td className="p-4 text-right font-bold text-orange-500">{budget.spent.toLocaleString()}₫</td>
                    <td className="p-4 text-right font-bold text-emerald-500">{(budget.allocated - budget.spent).toLocaleString()}₫</td>
                    <td className="p-4">
                      <div className="w-full h-2 bg-slate-100 rounded-full">
                        <div
                          className={`h-full rounded-full ${(budget.spent / budget.allocated) > 0.9 ? 'bg-red-500' : 'bg-primary'}`}
                          style={{ width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-800">Danh sách Chi phí</h3>
                <p className="text-xs text-slate-400">Theo dõi và quản lý các khoản chi</p>
              </div>
              <button
                onClick={() => setShowAddExpense(true)}
                className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm flex items-center gap-2"
              >
                <Plus size={16} />
                Tạo phiếu chi
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50">
                  <th className="text-left p-4 pl-6">Mã / Ngày</th>
                  <th className="text-left p-4">Loại</th>
                  <th className="text-left p-4">Người tạo</th>
                  <th className="text-left p-4">Ghi chú</th>
                  <th className="text-right p-4 pr-6">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? expenses.map(exp => (
                  <tr key={exp.id} className="border-b border-slate-50 hover:bg-white/50 transition-colors">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-slate-800">{exp.id}</p>
                      <p className="text-[10px] text-slate-400">{new Date(exp.date).toLocaleDateString('vi-VN')}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-orange-50 text-orange-500 rounded-lg text-[10px] font-bold uppercase">{exp.category}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-600">{exp.createdBy}</td>
                    <td className="p-4 text-slate-400 text-sm">{exp.note || '-'}</td>
                    <td className="p-4 pr-6 text-right font-black text-orange-500 text-lg">-{exp.amount.toLocaleString()}₫</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      <ArrowDownCircle size={40} className="mx-auto mb-4 opacity-30" />
                      <p className="font-bold">Chưa có khoản chi nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Vouchers Tab */}
      {activeTab === 'vouchers' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Pending Approvals */}
          {pendingVouchers.length > 0 && (
            <div className="glass-card p-6 border-l-4 border-amber-500">
              <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-amber-500" />
                Chờ phê duyệt ({pendingVouchers.length})
              </h3>
              <div className="space-y-3">
                {pendingVouchers.map(voucher => (
                  <div key={voucher.id} className="p-4 bg-white/50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${voucher.type === 'receipt' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                        {voucher.type === 'receipt' ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{voucher.description}</p>
                        <p className="text-xs text-slate-400">{voucher.id} • {voucher.createdBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className={`font-black text-lg ${voucher.type === 'receipt' ? 'text-emerald-500' : 'text-orange-500'}`}>
                        {voucher.type === 'receipt' ? '+' : '-'}{voucher.amount.toLocaleString()}₫
                      </p>
                      <button
                        onClick={() => handleRejectVoucher(voucher.id)}
                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <XCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleApproveVoucher(voucher.id)}
                        className="p-2 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Vouchers */}
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800">Tất cả chứng từ</h3>
              <button
                onClick={() => setShowAddVoucher(true)}
                className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm flex items-center gap-2"
              >
                <Plus size={16} />
                Tạo chứng từ
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50">
                  <th className="text-left p-4 pl-6">Mã</th>
                  <th className="text-left p-4">Loại</th>
                  <th className="text-left p-4">Diễn giải</th>
                  <th className="text-left p-4">Người tạo</th>
                  <th className="text-center p-4">Trạng thái</th>
                  <th className="text-right p-4 pr-6">Số tiền</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map(voucher => (
                  <tr key={voucher.id} className="border-b border-slate-50 hover:bg-white/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-800">{voucher.id}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${voucher.type === 'receipt' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'
                        }`}>
                        {voucher.type === 'receipt' ? 'Thu' : 'Chi'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{voucher.description}</td>
                    <td className="p-4 text-slate-400 text-sm">{voucher.createdBy}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${voucher.status === 'approved' ? 'bg-emerald-50 text-emerald-500' :
                          voucher.status === 'rejected' ? 'bg-red-50 text-red-500' :
                            'bg-amber-50 text-amber-500'
                        }`}>
                        {voucher.status === 'approved' && 'Đã duyệt'}
                        {voucher.status === 'rejected' && 'Từ chối'}
                        {voucher.status === 'pending' && 'Chờ duyệt'}
                      </span>
                    </td>
                    <td className={`p-4 pr-6 text-right font-black text-lg ${voucher.type === 'receipt' ? 'text-emerald-500' : 'text-orange-500'
                      }`}>
                      {voucher.type === 'receipt' ? '+' : '-'}{voucher.amount.toLocaleString()}₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Journal Tab */}
      {activeTab === 'journal' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-800 text-lg flex items-center gap-3">
                <BookOpen size={20} className="text-primary" />
                Sổ Nhật Ký Kế Toán
              </h3>
              <button className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm flex items-center gap-2">
                <Plus size={16} />
                Thêm bút toán
              </button>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 font-mono text-sm overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase border-b border-white/10">
                    <th className="text-left py-2">Ngày</th>
                    <th className="text-left py-2">Diễn giải</th>
                    <th className="text-left py-2">TK Nợ</th>
                    <th className="text-left py-2">TK Có</th>
                    <th className="text-right py-2">Số tiền</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-white/5">
                    <td className="py-3">31/12</td>
                    <td className="py-3">Thu tiền bán hàng</td>
                    <td className="py-3 text-emerald-400">111 - Tiền mặt</td>
                    <td className="py-3 text-blue-400">511 - Doanh thu</td>
                    <td className="py-3 text-right font-bold">5,000,000₫</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">31/12</td>
                    <td className="py-3">Thanh toán nhà cung cấp</td>
                    <td className="py-3 text-orange-400">331 - Phải trả</td>
                    <td className="py-3 text-emerald-400">111 - Tiền mặt</td>
                    <td className="py-3 text-right font-bold">2,500,000₫</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">30/12</td>
                    <td className="py-3">Chi phí điện nước</td>
                    <td className="py-3 text-red-400">642 - Chi phí</td>
                    <td className="py-3 text-emerald-400">111 - Tiền mặt</td>
                    <td className="py-3 text-right font-bold">800,000₫</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">Phiếu Chi Mới</h2>
              <button onClick={() => setShowAddExpense(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số tiền (₫)</label>
                <input
                  autoFocus
                  type="number"
                  placeholder="0"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full mt-2 px-6 py-4 bg-slate-50 rounded-2xl text-2xl font-black outline-none border-2 border-transparent focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loại chi phí</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full mt-2 px-6 py-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-primary"
                >
                  <option>Utilities</option>
                  <option>Supplies</option>
                  <option>Staff Meal</option>
                  <option>Emergency Repairs</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ghi chú</label>
                <textarea
                  placeholder="Lý do chi..."
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  className="w-full mt-2 px-6 py-4 bg-slate-50 rounded-2xl font-medium outline-none resize-none border-2 border-transparent focus:border-primary"
                  rows={2}
                />
              </div>
              <button
                onClick={handleAddExpense}
                disabled={!expenseAmount}
                className="w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} />
                Xác nhận phiếu chi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Voucher Modal */}
      {showAddVoucher && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">Tạo Chứng Từ</h2>
              <button onClick={() => setShowAddVoucher(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setVoucherType('receipt')}
                  className={`p-4 rounded-2xl border-2 transition-all ${voucherType === 'receipt'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-slate-200 text-slate-500'
                    }`}
                >
                  <ArrowUpCircle size={24} className="mx-auto mb-2" />
                  <p className="font-bold text-sm">Phiếu Thu</p>
                </button>
                <button
                  onClick={() => setVoucherType('payment')}
                  className={`p-4 rounded-2xl border-2 transition-all ${voucherType === 'payment'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-slate-200 text-slate-500'
                    }`}
                >
                  <ArrowDownCircle size={24} className="mx-auto mb-2" />
                  <p className="font-bold text-sm">Phiếu Chi</p>
                </button>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số tiền (₫)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={voucherAmount}
                  onChange={(e) => setVoucherAmount(e.target.value)}
                  className="w-full mt-2 px-6 py-4 bg-slate-50 rounded-2xl text-2xl font-black outline-none border-2 border-transparent focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diễn giải</label>
                <textarea
                  placeholder="Nội dung chứng từ..."
                  value={voucherDescription}
                  onChange={(e) => setVoucherDescription(e.target.value)}
                  className="w-full mt-2 px-6 py-4 bg-slate-50 rounded-2xl font-medium outline-none resize-none border-2 border-transparent focus:border-primary"
                  rows={2}
                />
              </div>
              <button
                onClick={handleAddVoucher}
                disabled={!voucherAmount || !voucherDescription}
                className={`w-full py-4 text-white font-bold rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${voucherType === 'receipt' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-orange-500 hover:bg-orange-600'
                  }`}
              >
                <CheckCircle2 size={20} />
                Tạo {voucherType === 'receipt' ? 'phiếu thu' : 'phiếu chi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
