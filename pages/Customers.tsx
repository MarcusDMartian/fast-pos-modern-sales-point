
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import {
  Search, UserPlus, Phone, Mail, Award, TrendingDown, MoreVertical,
  CreditCard, Download, Upload, ShieldCheck, Diamond, Zap, Plus, Edit,
  Crown, Gift, Wallet, ArrowUpCircle, Star, Trophy, Target, Check, X
} from 'lucide-react';
import DebtManagementModal from '../components/DebtManagementModal';
import ImportModal from '../components/ImportModal';
import CustomerModal from '../components/CustomerModal';
import { Customer } from '../types';

type LoyaltyTab = 'members' | 'tiers' | 'topup' | 'redeem';

// Types
interface MemberTier {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  discountPercent: number;
  color: string;
  icon: any;
}

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
const MEMBER_TIERS: MemberTier[] = [
  { id: 'T1', name: 'Bronze', minPoints: 0, benefits: ['Tích điểm 1%', 'Ưu đãi sinh nhật'], discountPercent: 0, color: 'amber', icon: Award },
  { id: 'T2', name: 'Silver', minPoints: 500, benefits: ['Tích điểm 2%', 'Ưu đãi sinh nhật', 'Giảm 5% toàn bộ'], discountPercent: 5, color: 'slate', icon: Zap },
  { id: 'T3', name: 'Gold', minPoints: 2000, benefits: ['Tích điểm 3%', 'Ưu đãi sinh nhật', 'Giảm 10% toàn bộ', 'Ưu tiên đặt bàn'], discountPercent: 10, color: 'amber', icon: ShieldCheck },
  { id: 'T4', name: 'Platinum', minPoints: 5000, benefits: ['Tích điểm 5%', 'Ưu đãi sinh nhật', 'Giảm 15% toàn bộ', 'Ưu tiên đặt bàn', 'Quà VIP'], discountPercent: 15, color: 'blue', icon: Diamond },
];

const MOCK_TOPUPS: TopUpTransaction[] = [
  { id: 'TU-001', customerId: 'C1', customerName: 'Nguyễn Văn A', amount: 500000, paymentMethod: 'Tiền mặt', date: '2024-12-31', bonus: 50000 },
  { id: 'TU-002', customerId: 'C2', customerName: 'Trần Thị B', amount: 1000000, paymentMethod: 'Chuyển khoản', date: '2024-12-30', bonus: 150000 },
];

const MOCK_REDEEMS: RedeemRequest[] = [
  { id: 'RD-001', customerId: 'C1', customerName: 'Nguyễn Văn A', pointsUsed: 500, reward: 'Voucher 50k', value: 50000, date: '2024-12-31', status: 'completed' },
  { id: 'RD-002', customerId: 'C3', customerName: 'Lê Văn C', pointsUsed: 1000, reward: 'Voucher 120k', value: 120000, date: '2024-12-31', status: 'pending' },
];

const Customers: React.FC = () => {
  const { customers, setCustomers, addCustomer, updateCustomer, showToast } = useStore();
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

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const tierStats = useMemo(() => {
    return MEMBER_TIERS.map(tier => ({
      ...tier,
      count: customers.filter(c => c.tier === tier.name).length
    }));
  }, [customers]);

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
        tier: data.tier || 'Bronze',
        balance: data.balance || 0,
        points: data.points || 0,
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
    updateCustomer(topUpCustomer.id, { balance: topUpCustomer.balance + amount + bonus });
    showToast(`Nạp thành công ${amount.toLocaleString()}₫ + Bonus ${bonus.toLocaleString()}₫!`, 'success');
    setShowTopUpModal(false);
    setTopUpAmount('');
    setTopUpCustomer(null);
  };

  const handleApproveRedeem = (id: string) => {
    setRedeems(redeems.map(r => r.id === id ? { ...r, status: 'completed' } : r));
    showToast('Đổi điểm thành công!', 'success');
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Platinum': return <Diamond size={14} className="text-blue-500" />;
      case 'Gold': return <ShieldCheck size={14} className="text-yellow-500" />;
      case 'Silver': return <Zap size={14} className="text-gray-400" />;
      default: return <Award size={14} className="text-orange-400" />;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3">
            <Crown size={28} className="text-amber-500" />
            Khách hàng & Loyalty
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            Quản lý thành viên, hạng thẻ, nạp tiền, đổi điểm
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-100 rounded-xl font-bold outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={() => setShowCustomerModal(true)}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 shadow-xl shadow-primary/20"
          >
            <Plus size={16} />
            Thêm KH
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {[
          { id: 'members', label: 'Thành viên', icon: Award },
          { id: 'tiers', label: 'Hạng thẻ', icon: Crown },
          { id: 'topup', label: 'Nạp tiền', icon: Wallet },
          { id: 'redeem', label: 'Đổi điểm', icon: Gift },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as LoyaltyTab)}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20'
                : 'bg-white/50 text-slate-500 hover:bg-white'
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tierStats.map(tier => (
              <div key={tier.id} className="glass-card p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-${tier.color}-100 text-${tier.color}-500`}>
                  <tier.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{tier.name}</p>
                  <p className="font-black text-xl text-slate-800">{tier.count} KH</p>
                </div>
              </div>
            ))}
          </div>

          {/* Customer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(cust => (
              <div key={cust.id} className="glass-card p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-black">
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800">{cust.name}</h3>
                      <div className="flex items-center gap-1 text-xs">
                        {getTierIcon(cust.tier)}
                        <span className="font-bold text-slate-500">{cust.tier}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setEditingCustomer(cust); setShowCustomerModal(true); }}
                    className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-primary hover:text-white transition-all"
                  >
                    <Edit size={14} />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-500 mb-4">
                  <div className="flex items-center gap-2"><Phone size={12} /> {cust.phone}</div>
                  <div className="flex items-center gap-2"><Star size={12} className="text-amber-500" /> {cust.points} điểm</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Số dư</p>
                    <p className={`font-black text-lg ${cust.balance >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {cust.balance.toLocaleString()}₫
                    </p>
                  </div>
                  <button
                    onClick={() => { setTopUpCustomer(cust); setShowTopUpModal(true); }}
                    className="p-3 bg-amber-50 text-amber-600 rounded-xl flex flex-col items-center justify-center hover:bg-amber-500 hover:text-white transition-all"
                  >
                    <ArrowUpCircle size={18} />
                    <span className="text-[10px] font-bold uppercase mt-1">Nạp tiền</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tiers Tab */}
      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
          {MEMBER_TIERS.map(tier => (
            <div key={tier.id} className={`glass-card p-6 border-t-4 border-${tier.color}-500`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl bg-${tier.color}-100 text-${tier.color}-600`}>
                  <tier.icon size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg">{tier.name}</h3>
                  <p className="text-xs text-slate-400">{tier.minPoints}+ điểm</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {tier.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={14} className="text-emerald-500" />
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Thành viên</p>
                <p className="font-black text-2xl text-slate-800">{customers.filter(c => c.tier === tier.name).length}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TopUp Tab */}
      {activeTab === 'topup' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Tổng nạp hôm nay</p>
              <p className="font-black text-2xl text-emerald-500">{topups.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}₫</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Bonus đã tặng</p>
              <p className="font-black text-2xl text-amber-500">{topups.reduce((sum, t) => sum + t.bonus, 0).toLocaleString()}₫</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Số lượt nạp</p>
              <p className="font-black text-2xl text-slate-800">{topups.length}</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-800 mb-4">Chương trình khuyến mãi nạp tiền</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-slate-400">
                <p className="font-bold text-slate-800">Nạp từ 200k</p>
                <p className="text-sm text-slate-500">Không có bonus</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500">
                <p className="font-bold text-slate-800">Nạp từ 500k</p>
                <p className="text-sm text-amber-600 font-bold">+10% Bonus</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border-l-4 border-emerald-500">
                <p className="font-bold text-slate-800">Nạp từ 1 triệu</p>
                <p className="text-sm text-emerald-600 font-bold">+15% Bonus</p>
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="text-left p-4 pl-6">Khách hàng</th>
                  <th className="text-right p-4">Số tiền</th>
                  <th className="text-right p-4">Bonus</th>
                  <th className="text-left p-4">Phương thức</th>
                  <th className="text-left p-4 pr-6">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {topups.map(t => (
                  <tr key={t.id} className="border-t border-slate-50">
                    <td className="p-4 pl-6 font-bold text-slate-800">{t.customerName}</td>
                    <td className="p-4 text-right font-bold text-emerald-500">+{t.amount.toLocaleString()}₫</td>
                    <td className="p-4 text-right font-bold text-amber-500">+{t.bonus.toLocaleString()}₫</td>
                    <td className="p-4 text-slate-500">{t.paymentMethod}</td>
                    <td className="p-4 pr-6 text-slate-400">{new Date(t.date).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Redeem Tab */}
      {activeTab === 'redeem' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-card p-6">
            <h3 className="font-bold text-slate-800 mb-4">Quy đổi điểm thưởng</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <Gift size={24} className="mx-auto mb-2 text-primary" />
                <p className="font-bold text-slate-800">100 điểm</p>
                <p className="text-sm text-slate-500">= 10,000₫</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <Gift size={24} className="mx-auto mb-2 text-primary" />
                <p className="font-bold text-slate-800">500 điểm</p>
                <p className="text-sm text-slate-500">= 50,000₫</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <Gift size={24} className="mx-auto mb-2 text-primary" />
                <p className="font-bold text-slate-800">1000 điểm</p>
                <p className="text-sm text-slate-500">= 120,000₫ (+20%)</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <Gift size={24} className="mx-auto mb-2 text-primary" />
                <p className="font-bold text-slate-800">2000 điểm</p>
                <p className="text-sm text-slate-500">= 300,000₫ (+50%)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {redeems.map(redeem => (
              <div key={redeem.id} className="glass-card p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <Gift size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{redeem.customerName}</p>
                    <p className="text-sm text-slate-500">{redeem.reward} • {redeem.pointsUsed} điểm</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-lg text-primary">{redeem.value.toLocaleString()}₫</span>
                  {redeem.status === 'pending' ? (
                    <button
                      onClick={() => handleApproveRedeem(redeem.id)}
                      className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-xl text-sm hover:bg-emerald-600"
                    >
                      Xác nhận
                    </button>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase">
                      Hoàn tất
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top-Up Modal */}
      {showTopUpModal && topUpCustomer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800">Nạp tiền cho {topUpCustomer.name}</h2>
              <button onClick={() => setShowTopUpModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Số tiền nạp (₫)</label>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="0"
                  className="w-full mt-2 px-6 py-4 bg-slate-50 rounded-2xl font-black text-2xl outline-none border-2 border-transparent focus:border-primary"
                />
              </div>
              {parseFloat(topUpAmount) >= 500000 && (
                <div className="p-4 bg-amber-50 rounded-xl">
                  <p className="font-bold text-amber-600">
                    Bonus: +{((parseFloat(topUpAmount) >= 1000000 ? 0.15 : 0.1) * parseFloat(topUpAmount)).toLocaleString()}₫
                  </p>
                </div>
              )}
              <button
                onClick={handleTopUp}
                disabled={!topUpAmount}
                className="w-full py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 transition-all disabled:opacity-50"
              >
                Xác nhận nạp tiền
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
