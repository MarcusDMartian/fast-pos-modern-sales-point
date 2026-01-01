
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import {
  Search, UserPlus, Phone, Award, Edit,
  Crown, Gift, Wallet, ArrowUpCircle, Star, Check, X,
  Upload, Diamond, ShieldCheck, Zap, UserCheck, Target, Calendar
} from 'lucide-react';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters';
import DebtManagementModal from '../components/DebtManagementModal';
import ImportModal from '../components/ImportModal';
import CustomerModal from '../components/CustomerModal';
import { Customer } from '../types';

type LoyaltyTab = 'members' | 'tiers' | 'topup' | 'redeem';

// Types
interface TopUpTransaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  date: string;
  bonus: number;
}

interface RedeemRequest {
  id: string;
  customerId: string;
  customerName: string;
  pointsUsed: number;
  reward: string;
  value: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

// Mock data
const MOCK_TOPUPS: TopUpTransaction[] = [
  { id: 'TU-001', customerId: 'C1', customerName: 'Nguyễn Minh Khoa', amount: 500000, paymentMethod: 'Tiền mặt', date: '2025-01-01', bonus: 50000 },
  { id: 'TU-002', customerId: 'C2', customerName: 'Trần Thị Thúy Chi', amount: 1000000, paymentMethod: 'Chuyển khoản', date: '2025-01-02', bonus: 150000 },
];

const MOCK_REDEEMS: RedeemRequest[] = [
  { id: 'RD-001', customerId: 'C1', customerName: 'Nguyễn Minh Khoa', pointsUsed: 500, reward: 'Voucher 50k', value: 50000, date: '2025-01-01', status: 'completed' },
  { id: 'RD-002', customerId: 'C3', customerName: 'Phạm Hoàng Nam', pointsUsed: 1000, reward: 'Voucher 120k', value: 120000, date: '2025-01-02', status: 'pending' },
];

const Customers: React.FC = () => {
  const { t } = useTranslation();
  const { customers, updateCustomer, addCustomer, showToast, enterpriseConfig, loyaltyConfig } = useStore();
  const [activeTab, setActiveTab] = useState<LoyaltyTab>('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpCustomer, setTopUpCustomer] = useState<Customer | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');

  const [topups] = useState<TopUpTransaction[]>(MOCK_TOPUPS);
  const [redeems, setRedeems] = useState<RedeemRequest[]>(MOCK_REDEEMS);

  const getTierMetadata = (tierName: string) => {
    const lower = tierName.toLowerCase();
    if (lower.includes('kim cương') || lower.includes('diamond') || lower.includes('platinum') || lower.includes('bạch kim')) {
      return { color: 'blue', icon: Diamond, bg: 'bg-blue-100', text: 'text-blue-600' };
    }
    if (lower.includes('vàng') || lower.includes('gold')) {
      return { color: 'yellow', icon: Star, bg: 'bg-yellow-100', text: 'text-yellow-600' };
    }
    if (lower.includes('bạc') || lower.includes('silver')) {
      return { color: 'slate', icon: ShieldCheck, bg: 'bg-slate-100', text: 'text-slate-600' };
    }
    if (lower.includes('đồng') || lower.includes('bronze')) {
      return { color: 'amber', icon: Award, bg: 'bg-amber-100', text: 'text-amber-600' };
    }
    return { color: 'slate', icon: Zap, bg: 'bg-slate-100', text: 'text-slate-600' };
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const stats = [
    { label: t('customers.stats.new_customers'), value: '24', change: '+12%', icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: t('customers.stats.active_members'), value: customers.length.toString(), change: '+5%', icon: UserCheck, color: 'text-primary', bg: 'bg-primary/10' },
    { label: t('customers.stats.total_points'), value: (customers.reduce((sum, c) => sum + (c.totalPointsAccumulated || 0), 0) / 1000).toFixed(1) + 'K', change: '+18%', icon: Award, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: t('customers.stats.avg_loyalty'), value: '92%', change: '+2%', icon: Target, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const handleSaveCustomer = (data: Partial<Customer>) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data);
      setEditingCustomer(null);
    } else {
      const newCust: Customer = {
        id: `CUST-${Date.now()}`,
        name: data.name || 'Unnamed',
        phone: data.phone || '',
        email: data.email || '',
        type: data.type || 'Normal',
        tier: data.tier || (loyaltyConfig.tiers[0]?.name || 'Member'),
        balance: data.balance || 0,
        points: data.points || 0,
        totalPointsAccumulated: data.points || 0,
        totalPointsSpent: 0,
        birthday: data.birthday || '',
        debtHistory: []
      };
      addCustomer(newCust);
    }
    setShowCustomerModal(false);
  };

  const handleTopUp = () => {
    if (!topUpCustomer || !topUpAmount) return;
    const amount = parseFloat(topUpAmount);
    const bonus = amount >= 1000000 ? amount * 0.15 : amount >= 500000 ? amount * 0.1 : 0;
    updateCustomer(topUpCustomer.id, { balance: (topUpCustomer.balance || 0) + amount + bonus });
    showToast(`${t('common.success')}! Nạp ${formatCurrency(amount, enterpriseConfig.currency)} + Bonus ${formatCurrency(bonus, enterpriseConfig.currency)}`, 'success');
    setShowTopUpModal(false);
    setTopUpAmount('');
    setTopUpCustomer(null);
  };

  const handleApproveRedeem = (id: string) => {
    setRedeems(redeems.map(r => r.id === id ? { ...r, status: 'completed' } : r));
    showToast(t('common.success'), 'success');
  };

  const renderTierIcon = (tierName: string) => {
    const meta = getTierMetadata(tierName);
    return <meta.icon size={14} className={meta.text} />;
  };

  const isBirthday = (birthday?: string) => {
    if (!birthday) return false;
    const today = new Date();
    const bday = new Date(birthday);
    return today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate();
  };

  return (
    <div className="p-3 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            <Crown size={28} className="text-amber-500" />
            {t('customers.title')}
          </h1>
          <p className="hidden md:block text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
            {t('sidebar.crm_customers')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input
              type="text"
              placeholder={t('customers.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-xl font-bold text-sm outline-none focus:border-primary shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowImportModal(true)}
            className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <Upload size={20} />
          </button>
          <button
            onClick={() => setShowCustomerModal(true)}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 shadow-lg hover:brightness-110 transition-all whitespace-nowrap"
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline">{t('customers.add_new')}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {[
          { id: 'members', label: t('sidebar.customers'), icon: UserCheck },
          { id: 'tiers', label: t('sidebar.loyalty'), icon: Crown },
          { id: 'topup', label: t('customers.top_up'), icon: Wallet },
          { id: 'redeem', label: t('customers.redeem'), icon: Gift },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as LoyaltyTab)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
              ? 'bg-slate-900 text-white shadow-lg'
              : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-card p-4 md:p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{stat.change}</span>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(cust => (
              <div key={cust.id} className="glass-card p-6 group hover:shadow-2xl transition-all border-b-4 border-transparent hover:border-primary">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary text-xl font-black border border-slate-100 relative">
                      {cust.name.charAt(0)}
                      {isBirthday(cust.birthday) && (
                        <div className="absolute -top-2 -right-2 p-1.5 bg-pink-500 text-white rounded-full shadow-lg animate-bounce">
                          <Gift size={12} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 flex items-center gap-2">
                        {cust.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        {renderTierIcon(cust.tier)}
                        <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">{cust.tier}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                      title={t('customers.debt_management')}
                    >
                      <Wallet size={18} />
                    </button>
                    <button
                      onClick={() => { setEditingCustomer(cust); setShowCustomerModal(true); }}
                      className="p-2 text-slate-300 hover:text-primary transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                    <Phone size={12} className="text-slate-300" />
                    {cust.phone}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                    <Calendar size={12} className="text-pink-400" />
                    {cust.birthday ? new Date(cust.birthday).toLocaleDateString('vi-VN') : '--/--'}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 space-y-3 mb-6">
                  <div className="flex justify-between items-center bg-white p-2 rounded-xl shadow-sm">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('customers.points_available')}</span>
                    <span className="font-black text-emerald-600">{(cust.points || 0).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{t('customers.points_accumulated')}</span>
                      <span className="font-black text-blue-600 text-xs">{(cust.totalPointsAccumulated || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{t('customers.points_spent')}</span>
                      <span className="font-black text-red-400 text-xs">{(cust.totalPointsSpent || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white border border-slate-100 rounded-xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('customers.debt')}</p>
                    <p className={`font-black text-sm ${(cust.balance || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {formatCurrency(Math.abs(cust.balance || 0), enterpriseConfig.currency)}
                      <span className="text-[8px] ml-1 uppercase">{(cust.balance || 0) < 0 ? t('customers.in_debt') : t('customers.surplus')}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => { setTopUpCustomer(cust); setShowTopUpModal(true); }}
                    className="p-3 bg-primary/10 text-primary rounded-xl flex flex-col items-center justify-center hover:bg-primary hover:text-white transition-all group border border-primary/5"
                  >
                    <ArrowUpCircle size={18} className="mb-1" />
                    <span className="text-[9px] font-black uppercase tracking-wider">{t('customers.top_up')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tiers Tab */}
      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {loyaltyConfig.tiers.map((tier, idx) => {
            const meta = getTierMetadata(tier.name);
            return (
              <div key={idx} className={`glass-card p-6 border-t-4 border-${meta.color}-500 relative overflow-hidden group`}>
                <div className={`absolute -right-4 -top-4 w-24 h-24 ${meta.bg} rounded-full group-hover:scale-110 transition-transform`} />
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl ${meta.bg} ${meta.text}`}>
                      <meta.icon size={28} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-xl">{tier.name}</h3>
                      <p className="text-xs font-bold text-slate-400">{tier.threshold}+ {t('customers.loyalty_points')}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <Check size={16} className="text-emerald-500 shrink-0" />
                      {t('loyalty.discount_percent')}: {tier.discount}%
                    </div>
                    {tier.birthdayDiscount && (
                      <div className="flex items-center gap-3 text-sm font-bold text-pink-500">
                        <Gift size={16} className="shrink-0" />
                        {t('loyalty.birthday_discount')}: +{tier.birthdayDiscount}%
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-1">{t('sidebar.customers')}</p>
                    <p className="font-black text-3xl text-slate-800 text-center">
                      {customers.filter(c => c.tier === tier.name).length}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          {loyaltyConfig.tiers.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
              {t('cart.empty')}
            </div>
          )}
        </div>
      )}

      {/* TopUp Tab */}
      {activeTab === 'topup' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-8">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Doanh thu nạp tiền</p>
              <h3 className="font-black text-3xl text-emerald-500">
                {formatCurrency(topups.reduce((sum, t) => sum + t.amount, 0), enterpriseConfig.currency)}
              </h3>
            </div>
            <div className="glass-card p-8">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Bonus Gifted</p>
              <h3 className="font-black text-3xl text-amber-500">
                {formatCurrency(topups.reduce((sum, t) => sum + t.bonus, 0), enterpriseConfig.currency)}
              </h3>
            </div>
            <div className="glass-card p-8">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Transaction Count</p>
              <h3 className="font-black text-3xl text-slate-800">{topups.length}</h3>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('orders.customer')}</th>
                  <th className="text-right p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('orders.amount')}</th>
                  <th className="text-right p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Bonus</th>
                  <th className="text-left p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('payment.method')}</th>
                  <th className="text-right p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('orders.time')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topups.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-bold text-slate-800">{t.customerName}</td>
                    <td className="p-6 text-right font-black text-emerald-500">+{formatCurrency(t.amount, enterpriseConfig.currency)}</td>
                    <td className="p-6 text-right font-black text-amber-500">+{formatCurrency(t.bonus, enterpriseConfig.currency)}</td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase">
                        {t.paymentMethod}
                      </span>
                    </td>
                    <td className="p-6 text-right text-slate-400 font-bold text-sm">
                      {new Date(t.date).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Redeem Tab */}
      {activeTab === 'redeem' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { pts: 100, value: 10000, bonus: 0 },
              { pts: 500, value: 50000, bonus: 0 },
              { pts: 1000, value: 120000, bonus: 20 },
              { pts: 2000, value: 300000, bonus: 50 },
            ].map((p, i) => (
              <div key={i} className="glass-card p-6 text-center group hover:border-primary transition-all">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Gift size={32} />
                </div>
                <h4 className="font-black text-slate-800 text-xl">{p.pts} Pts</h4>
                <p className="text-slate-400 font-bold mb-4">= {formatCurrency(p.value, enterpriseConfig.currency)}</p>
                {p.bonus > 0 && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[10px] font-black uppercase">
                    +{p.bonus}% Value
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {redeems.map(r => (
              <div key={r.id} className="glass-card p-6 flex items-center justify-between group hover:shadow-xl transition-all">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl ${r.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                    <Gift size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800">{r.customerName}</h4>
                    <p className="text-sm font-bold text-slate-400">{r.reward} • {r.pointsUsed} Pts</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('payment.total')}</p>
                    <p className="font-black text-xl text-primary">{formatCurrency(r.value, enterpriseConfig.currency)}</p>
                  </div>
                  {r.status === 'pending' ? (
                    <button
                      onClick={() => handleApproveRedeem(r.id)}
                      className="px-6 py-3 bg-emerald-500 text-white font-black rounded-xl hover:brightness-110 shadow-lg shadow-emerald-200 transition-all text-sm"
                    >
                      {t('common.confirm')}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                      <Check size={18} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('orders.status_completed')}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showTopUpModal && topUpCustomer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('customers.top_up')}</h2>
              <button onClick={() => setShowTopUpModal(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary font-black">
                  {topUpCustomer.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Top-up for</p>
                  <p className="font-black text-slate-800">{topUpCustomer.name}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{t('orders.amount')} ({getCurrencySymbol(enterpriseConfig.currency)})</label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-8 py-6 bg-slate-50 rounded-3xl font-black text-4xl outline-none border-2 border-transparent focus:border-primary transition-all text-center"
                  autoFocus
                />
              </div>

              {parseFloat(topUpAmount) >= 500000 && (
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gift className="text-amber-500" size={24} />
                    <span className="font-bold text-amber-800">Bonus Perk</span>
                  </div>
                  <span className="font-black text-amber-600 text-lg">
                    +{formatCurrency((parseFloat(topUpAmount) >= 1000000 ? 0.15 : 0.1) * parseFloat(topUpAmount), enterpriseConfig.currency)}
                  </span>
                </div>
              )}

              <button
                onClick={handleTopUp}
                disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
                className="w-full py-6 bg-primary text-white font-black rounded-3xl hover:brightness-110 transition-all disabled:opacity-50 shadow-xl shadow-primary/20 text-lg"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && <ImportModal entityName="Customers" templateHeaders={['id', 'name', 'phone', 'email', 'type', 'tier', 'balance', 'points']} onImport={() => { }} onClose={() => setShowImportModal(false)} />}
      {selectedCustomer && <DebtManagementModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} onUpdate={(updated) => updateCustomer(updated.id, updated)} />}
      {(showCustomerModal || editingCustomer) && <CustomerModal customer={editingCustomer} onClose={() => { setShowCustomerModal(false); setEditingCustomer(null); }} onSave={handleSaveCustomer} />}
    </div>
  );
};

export default Customers;
