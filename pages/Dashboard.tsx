import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, Package, CheckCircle2, RefreshCcw, Loader2, FileSpreadsheet } from 'lucide-react';
import { useStore } from '../store';
import { formatCurrency } from '../utils/formatters';
import ActivityHistoryModal from '../components/ActivityHistoryModal';

const hourlySalesData = [
  { name: '08:00', sales: 120 }, { name: '10:00', sales: 450 }, { name: '12:00', sales: 980 },
  { name: '14:00', sales: 620 }, { name: '16:00', sales: 540 }, { name: '18:00', sales: 1200 }, { name: '20:00', sales: 850 },
];

const dailySalesData = [
  { name: 'Mon', sales: 2400 },
  { name: 'Tue', sales: 1398 },
  { name: 'Wed', sales: 9800 },
  { name: 'Thu', sales: 3908 },
  { name: 'Fri', sales: 4800 },
  { name: 'Sat', sales: 3800 },
  { name: 'Sun', sales: 4300 },
];

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { enterpriseConfig } = useStore();
  const [revenueView, setRevenueView] = useState<'hourly' | 'daily'>('hourly');
  const [isExporting, setIsExporting] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const stats = [
    { label: t('dashboard.stats.total_revenue'), value: formatCurrency(245600000, enterpriseConfig.currency), change: '+12.5%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: t('dashboard.stats.total_orders'), value: '1,240', change: '+5.2%', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
    { label: t('dashboard.stats.customers'), value: '890', change: '+8.1%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: t('dashboard.stats.average_value'), value: formatCurrency(198000, enterpriseConfig.currency), change: '-2.4%', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const recentActivities = [
    { id: 1, title: t('dashboard.activities.order_completed'), subtitle: t('dashboard.activities.order_suffix', { id: '9921' }), amount: `+${formatCurrency(450000, enterpriseConfig.currency)}`, time: '2m ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 2, title: t('dashboard.activities.inventory_update'), subtitle: 'Matcha Latte +20', amount: 'Inventory', time: '15m ago', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, title: t('dashboard.activities.refund'), subtitle: t('dashboard.activities.order_suffix', { id: '9812' }), amount: `-${formatCurrency(125000, enterpriseConfig.currency)}`, time: '1h ago', icon: RefreshCcw, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const handleExportReport = () => {
    setIsExporting(true);

    // Giả lập xử lý dữ liệu nặng
    setTimeout(() => {
      const headers = ['Date', 'Sales'];
      const data = revenueView === 'hourly' ? hourlySalesData : dailySalesData;
      const csvContent = [
        headers.join(','),
        ...data.map(item => `${item.name},${item.sales}`)
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `FastPOS_Report_${revenueView}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
    }, 1500);
  };

  const chartData = revenueView === 'hourly' ? hourlySalesData : dailySalesData;

  return (
    <div className="p-3 md:p-8 max-w-7xl mx-auto space-y-4 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{t('dashboard.title')}</h1>
          <p className="hidden md:block text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">{t('dashboard.analysis_subtitle')}</p>
        </div>
        <button
          onClick={handleExportReport}
          disabled={isExporting}
          className={`bg-primary text-white px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:bg-slate-900 transition-all text-[10px] md:text-[11px] uppercase tracking-wider ${isExporting ? 'opacity-70 grayscale' : ''}`}
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className="hidden sm:inline">{t('dashboard.preparing')}</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">{t('dashboard.report')}</span> <ArrowUpRight size={16} />
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-4 md:p-8 flex flex-col gap-3 md:gap-5 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div className={`p-2.5 md:p-4 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                <stat.icon size={18} className="md:w-6 md:h-6" />
              </div>
              <div className={`text-[8px] md:text-[10px] font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-wide md:tracking-[0.2em] mb-0.5 md:mb-1">{stat.label}</p>
              <h3 className="text-lg md:text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="lg:col-span-2 glass-card p-4 md:p-8 h-[320px] md:h-[450px]">
          <div className="flex items-center justify-between mb-4 md:mb-10 gap-3">
            <div>
              <h3 className="text-sm md:text-xl font-extrabold text-slate-800 tracking-tight">{t('dashboard.revenue_stream')}</h3>
              <p className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{t('dashboard.performance_analytics')}</p>
            </div>
            <div className="flex bg-slate-900/5 p-1 rounded-xl border border-slate-100">
              <button
                onClick={() => setRevenueView('hourly')}
                className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${revenueView === 'hourly'
                  ? 'bg-primary text-white shadow-lg shadow-primary-glow scale-105'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {t('dashboard.hourly')}
              </button>
              <button
                onClick={() => setRevenueView('daily')}
                className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${revenueView === 'daily'
                  ? 'bg-primary text-white shadow-lg shadow-primary-glow scale-105'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {t('dashboard.daily')}
              </button>
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-600)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--primary-600)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.6)',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 20px 40px -5px rgba(245,114,85,0.15)',
                    fontSize: '11px',
                    fontWeight: 800
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="var(--primary-600)"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{t('dashboard.recent_activity')}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 mb-8">{t('dashboard.operational_log')}</p>
          </div>
          <div className="flex-1 space-y-7">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex gap-5 group">
                <div className={`p-3.5 rounded-2xl ${activity.bg} ${activity.color} h-fit shadow-inner transition-all group-hover:scale-110 group-hover:rotate-3`}>
                  <activity.icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-slate-800 truncate uppercase tracking-tight">{activity.title}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{activity.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-extrabold text-primary">{activity.amount}</p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowHistoryModal(true)}
            className="mt-10 w-full py-5 bg-slate-900/5 hover:bg-slate-900 hover:text-white text-slate-500 font-bold text-[10px] uppercase tracking-widest rounded-2xl transition-all border border-slate-100 shadow-sm flex items-center justify-center gap-2.5 group"
          >
            <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            {t('dashboard.full_activity')}
          </button>
        </div>
      </div>

      {
        showHistoryModal && (
          <ActivityHistoryModal onClose={() => setShowHistoryModal(false)} />
        )
      }
    </div >
  );
};

export default Dashboard;
