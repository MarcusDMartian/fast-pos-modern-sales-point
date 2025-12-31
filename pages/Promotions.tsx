
import React, { useState, useMemo } from 'react';
import {
  Sparkles, Plus, Tag, Trash2, Save, Loader2, Calendar, Users, Ticket,
  BarChart3, Search, Filter, Clock, CheckCircle, XCircle, Target, Gift,
  Percent, Copy, Eye, Edit3, PauseCircle, PlayCircle, TrendingUp
} from 'lucide-react';
import { useStore } from '../store';
import { PromotionRule } from '../types';

type PromoTab = 'campaigns' | 'vouchers' | 'groups' | 'analytics';

// Mock data
interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'freebie';
  value: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'scheduled' | 'ended' | 'paused';
  targetGroup?: string;
  usageCount: number;
  budget: number;
  spent: number;
}

interface VoucherCode {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minPurchase: number;
  maxUses: number;
  usedCount: number;
  expiryDate: string;
  status: 'active' | 'expired' | 'depleted';
}

interface CustomerGroup {
  id: string;
  name: string;
  description: string;
  criteria: string;
  memberCount: number;
  color: string;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'CMP-001', name: 'Khuyến mãi Năm Mới 2025', description: 'Giảm 20% toàn bộ đơn hàng', type: 'percentage', value: 20, startDate: '2024-12-30', endDate: '2025-01-07', status: 'active', usageCount: 156, budget: 10000000, spent: 4500000 },
  { id: 'CMP-002', name: 'Mua 1 Tặng 1 Cà Phê', description: 'Áp dụng cho Espresso và Latte', type: 'bogo', value: 0, startDate: '2025-01-01', endDate: '2025-01-31', status: 'scheduled', targetGroup: 'VIP', usageCount: 0, budget: 5000000, spent: 0 },
  { id: 'CMP-003', name: 'Flash Sale Cuối Tuần', description: 'Giảm 50k cho đơn từ 200k', type: 'fixed', value: 50000, startDate: '2024-12-27', endDate: '2024-12-29', status: 'ended', usageCount: 89, budget: 5000000, spent: 4450000 },
];

const MOCK_VOUCHERS: VoucherCode[] = [
  { id: 'VCH-001', code: 'NEWYEAR25', discount: 25, discountType: 'percentage', minPurchase: 100000, maxUses: 500, usedCount: 123, expiryDate: '2025-01-31', status: 'active' },
  { id: 'VCH-002', code: 'WELCOME50K', discount: 50000, discountType: 'fixed', minPurchase: 200000, maxUses: 1000, usedCount: 456, expiryDate: '2025-03-31', status: 'active' },
  { id: 'VCH-003', code: 'VIP100', discount: 100000, discountType: 'fixed', minPurchase: 500000, maxUses: 100, usedCount: 100, expiryDate: '2024-12-31', status: 'depleted' },
];

const MOCK_GROUPS: CustomerGroup[] = [
  { id: 'GRP-001', name: 'Khách VIP', description: 'Khách hàng có tổng chi tiêu > 10 triệu', criteria: 'spending > 10000000', memberCount: 234, color: 'amber' },
  { id: 'GRP-002', name: 'Khách mới', description: 'Đăng ký trong 30 ngày gần đây', criteria: 'registered_within_days < 30', memberCount: 89, color: 'blue' },
  { id: 'GRP-003', name: 'Khách sinh nhật tháng này', description: 'Sinh nhật trong tháng hiện tại', criteria: 'birthday_month = current_month', memberCount: 45, color: 'pink' },
  { id: 'GRP-004', name: 'Khách thường xuyên', description: 'Đến quán > 10 lần/tháng', criteria: 'visits_per_month > 10', memberCount: 156, color: 'emerald' },
];

const Promotions: React.FC = () => {
  const { promotions, setPromotions, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<PromoTab>('campaigns');
  const [isSaving, setIsSaving] = useState(false);
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [vouchers] = useState<VoucherCode[]>(MOCK_VOUCHERS);
  const [groups] = useState<CustomerGroup[]>(MOCK_GROUPS);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Cập nhật thành công!', 'success');
    }, 1000);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'scheduled': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'ended': return 'bg-slate-50 text-slate-500 border-slate-100';
      case 'paused': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'expired': return 'bg-red-50 text-red-500 border-red-100';
      case 'depleted': return 'bg-orange-50 text-orange-500 border-orange-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Đang chạy',
      scheduled: 'Lên lịch',
      ended: 'Kết thúc',
      paused: 'Tạm dừng',
      expired: 'Hết hạn',
      depleted: 'Hết lượt'
    };
    return labels[status] || status;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight flex items-center gap-3">
            <Sparkles className="text-purple-500" size={32} />
            Khuyến Mãi & Marketing
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            Quản lý chiến dịch, mã giảm giá và nhóm khách hàng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-slate-800 transition-all text-sm">
            <Plus size={18} />
            Tạo mới
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-4 bg-primary text-white font-bold rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20 transition-all text-sm ${isSaving ? 'opacity-70' : ''}`}
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto">
        {[
          { id: 'campaigns', label: 'Chiến dịch', icon: Target },
          { id: 'vouchers', label: 'Mã giảm giá', icon: Ticket },
          { id: 'groups', label: 'Nhóm KH', icon: Users },
          { id: 'analytics', label: 'Thống kê', icon: BarChart3 },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as PromoTab)}
            className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
              ? 'bg-purple-500 text-white shadow-xl shadow-purple-500/20'
              : 'bg-white/50 text-slate-500 hover:bg-white'
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="glass-card p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${campaign.type === 'percentage' ? 'bg-purple-50 text-purple-500' : campaign.type === 'bogo' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>
                    {campaign.type === 'percentage' ? <Percent size={24} /> : campaign.type === 'bogo' ? <Gift size={24} /> : <Tag size={24} />}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">{campaign.name}</h3>
                    <p className="text-slate-500 text-sm">{campaign.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(campaign.startDate).toLocaleDateString('vi-VN')} - {new Date(campaign.endDate).toLocaleDateString('vi-VN')}
                      </span>
                      {campaign.targetGroup && (
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {campaign.targetGroup}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(campaign.status)}`}>
                    {getStatusLabel(campaign.status)}
                  </span>
                  <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary hover:text-white transition-all">
                    <Edit3 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Giá trị</p>
                  <p className="font-black text-lg text-primary">
                    {campaign.type === 'percentage' ? `${campaign.value}%` : campaign.type === 'bogo' ? 'BOGO' : `${campaign.value.toLocaleString()}₫`}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Lượt dùng</p>
                  <p className="font-black text-lg text-slate-800">{campaign.usageCount}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Ngân sách</p>
                  <p className="font-black text-lg text-slate-800">{(campaign.budget / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Đã chi</p>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-lg text-orange-500">{(campaign.spent / 1000000).toFixed(1)}M</p>
                    <span className="text-xs text-slate-400">({Math.round((campaign.spent / campaign.budget) * 100)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vouchers Tab */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 font-medium">{vouchers.length} mã đang hoạt động</p>
            <button className="px-4 py-2 bg-purple-500 text-white font-bold rounded-xl text-sm flex items-center gap-2">
              <Plus size={16} />
              Tạo mã mới
            </button>
          </div>

          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="text-left p-4 pl-6">Mã</th>
                  <th className="text-left p-4">Giảm giá</th>
                  <th className="text-left p-4">Đơn tối thiểu</th>
                  <th className="text-center p-4">Đã dùng / Tổng</th>
                  <th className="text-left p-4">Hết hạn</th>
                  <th className="text-center p-4">Trạng thái</th>
                  <th className="text-right p-4 pr-6">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {vouchers.map(voucher => (
                  <tr key={voucher.id} className="border-t border-slate-50 hover:bg-white/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2">
                        <code className="px-3 py-1.5 bg-slate-900 text-white font-mono font-bold rounded-lg text-sm">{voucher.code}</code>
                        <button className="p-1 text-slate-300 hover:text-primary transition-all">
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-black text-primary text-lg">
                        {voucher.discountType === 'percentage' ? `${voucher.discount}%` : `${voucher.discount.toLocaleString()}₫`}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-600">{voucher.minPurchase.toLocaleString()}₫</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-slate-800">{voucher.usedCount}/{voucher.maxUses}</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(voucher.usedCount / voucher.maxUses) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase ${getStatusStyle(voucher.status)}`}>
                        {getStatusLabel(voucher.status)}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-all">
                          <Eye size={14} />
                        </button>
                        <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 transition-all">
                          <Edit3 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Groups Tab */}
      {activeTab === 'groups' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-500 font-medium">{groups.reduce((sum, g) => sum + g.memberCount, 0)} khách hàng trong {groups.length} nhóm</p>
            <button className="px-4 py-2 bg-purple-500 text-white font-bold rounded-xl text-sm flex items-center gap-2">
              <Plus size={16} />
              Tạo nhóm mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map(group => (
              <div key={group.id} className="glass-card p-6 hover:shadow-xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${group.color}-100 text-${group.color}-500`}>
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800">{group.name}</h3>
                      <p className="text-xs text-slate-400">{group.description}</p>
                    </div>
                  </div>
                  <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-primary hover:text-white transition-all">
                    <Edit3 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Thành viên</p>
                    <p className="font-black text-2xl text-slate-800">{group.memberCount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Điều kiện</p>
                    <code className="text-xs bg-white px-2 py-1 rounded text-slate-600">{group.criteria}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><Target size={20} /></div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Chiến dịch hoạt động</p>
              <p className="font-black text-3xl text-slate-800">{campaigns.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><Ticket size={20} /></div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mã đã sử dụng</p>
              <p className="font-black text-3xl text-emerald-500">{vouchers.reduce((sum, v) => sum + v.usedCount, 0)}</p>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><TrendingUp size={20} /></div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tổng chi khuyến mãi</p>
              <p className="font-black text-3xl text-orange-500">{(campaigns.reduce((sum, c) => sum + c.spent, 0) / 1000000).toFixed(1)}M</p>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><Users size={20} /></div>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Khách trong nhóm</p>
              <p className="font-black text-3xl text-blue-500">{groups.reduce((sum, g) => sum + g.memberCount, 0)}</p>
            </div>
          </div>

          <div className="glass-card p-8">
            <h3 className="font-black text-slate-800 mb-6">Hiệu quả chiến dịch</h3>
            <div className="space-y-4">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800">{campaign.name}</span>
                    <span className="text-sm text-slate-500">{campaign.usageCount} lượt</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Đã chi: {(campaign.spent / 1000000).toFixed(1)}M</span>
                    <span>Ngân sách: {(campaign.budget / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
