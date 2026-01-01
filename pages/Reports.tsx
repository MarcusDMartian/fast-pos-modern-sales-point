
import React, { useState, useMemo } from 'react';
import {
   FileBarChart, Download, Calendar, ArrowUpRight, ArrowDownRight, Printer, FileText,
   PieChart, TrendingUp, DollarSign, RotateCcw, XCircle, AlertTriangle, Clock,
   Users, CreditCard, Banknote, Receipt
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { useStore } from '../store';
import { formatCurrency, getCurrencySymbol } from '../utils/formatters';

type ReportTab = 'overview' | 'voids' | 'returns' | 'cash';

const COLORS = ['var(--primary-600)', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'];

const Reports: React.FC = () => {
   const { orders, returnOrders, voidOrders, attendanceRecords, enterpriseConfig } = useStore();
   const [activeTab, setActiveTab] = useState<ReportTab>('overview');

   // Weekly revenue data
   const weeklyData = useMemo(() => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map(day => {
         const dayOrders = orders.filter(o => {
            const orderDay = new Date(o.date).toLocaleDateString('en-US', { weekday: 'short' });
            return orderDay === day && o.status === 'completed';
         });
         return {
            name: day,
            revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
            orders: dayOrders.length
         };
      });
   }, [orders]);

   // Void orders analytics
   const voidAnalytics = useMemo(() => {
      const reasonCounts: Record<string, number> = {};
      let totalVoidAmount = 0;
      voidOrders.forEach(v => {
         reasonCounts[v.voidReason] = (reasonCounts[v.voidReason] || 0) + 1;
         totalVoidAmount += v.originalAmount;
      });
      return {
         total: voidOrders.length,
         totalAmount: totalVoidAmount,
         byReason: Object.entries(reasonCounts).map(([reason, count]) => ({
            name: getVoidReasonLabel(reason),
            value: count
         }))
      };
   }, [voidOrders]);

   // Return orders analytics  
   const returnAnalytics = useMemo(() => {
      const reasonCounts: Record<string, number> = {};
      let totalRefund = 0;
      let pendingCount = 0;
      returnOrders.forEach(r => {
         reasonCounts[r.reason] = (reasonCounts[r.reason] || 0) + 1;
         totalRefund += r.totalRefund;
         if (r.status === 'pending') pendingCount++;
      });
      return {
         total: returnOrders.length,
         pending: pendingCount,
         totalRefund,
         byReason: Object.entries(reasonCounts).map(([reason, count]) => ({
            name: getReturnReasonLabel(reason),
            value: count
         }))
      };
   }, [returnOrders]);

   // Cash reconciliation (mock data for now)
   const cashAnalytics = useMemo(() => {
      const shifts = attendanceRecords.filter(r => r.checkOutTime);
      const totalExpectedCash = orders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + o.total, 0);
      return {
         shifts: shifts.length,
         expectedCash: totalExpectedCash,
         actualCash: totalExpectedCash, // Mock: balanced
         discrepancy: 0,
         isBalanced: true
      };
   }, [orders, attendanceRecords]);

   return (
      <div className="p-8 max-w-7xl mx-auto">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
               <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-4">
                  <FileBarChart size={32} className="text-primary" />
                  Báo Cáo & Phân Tích
               </h1>
               <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Thống kê doanh thu, huỷ đơn, trả hàng và tiền mặt</p>
            </div>
            <div className="flex items-center gap-3">
               <button className="p-4 bg-white text-slate-600 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all flex items-center gap-2 font-bold text-xs">
                  <Calendar size={18} />
                  Hôm nay
               </button>
               <button className="bg-primary text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all text-sm">
                  <Download size={18} />
                  Xuất Excel
               </button>
            </div>
         </div>

         {/* Tabs */}
         <div className="flex items-center gap-2 mb-8">
            {[
               { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
               { id: 'voids', label: 'Huỷ Bill', icon: XCircle },
               { id: 'returns', label: 'Trả Hàng', icon: RotateCcw },
               { id: 'cash', label: 'Tiền Mặt', icon: Banknote },
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ReportTab)}
                  className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
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
                  {[
                     { label: 'Tổng Doanh Thu', val: formatCurrency(orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0), enterpriseConfig.currency), change: '+14%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                     { label: 'Đơn Hoàn Thành', val: orders.filter(o => o.status === 'completed').length.toString(), change: '+8%', icon: Receipt, color: 'text-blue-500', bg: 'bg-blue-50' },
                     { label: 'Đơn Huỷ', val: voidOrders.length.toString(), change: voidOrders.length > 0 ? `-${voidOrders.length}` : '0', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
                     { label: 'Đơn Trả', val: returnOrders.length.toString(), change: returnOrders.length > 0 ? `-${returnOrders.length}` : '0', icon: RotateCcw, color: 'text-orange-500', bg: 'bg-orange-50' },
                  ].map((stat, i) => (
                     <div key={i} className="glass-card p-6">
                        <div className="flex items-start justify-between mb-4">
                           <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                              <stat.icon size={20} />
                           </div>
                           <span className={`px-2 py-1 rounded-lg text-[9px] font-bold ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : stat.change.startsWith('-') ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'
                              }`}>
                              {stat.change}
                           </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-slate-800">{stat.val}</h3>
                     </div>
                  ))}
               </div>

               {/* Charts */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-card p-8 h-[400px]">
                     <h3 className="text-lg font-black text-slate-800 mb-6">Doanh Thu Tuần</h3>
                     <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={weeklyData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                           <Tooltip
                              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                              formatter={(value: number) => [formatCurrency(value, enterpriseConfig.currency), 'Doanh thu']}
                           />
                           <Bar dataKey="revenue" fill="var(--primary-600)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>

                  <div className="glass-card p-8">
                     <h3 className="text-lg font-black text-slate-800 mb-6">Tóm Tắt P&L</h3>
                     <div className="space-y-4">
                        {[
                           { label: 'Tổng doanh thu', value: formatCurrency(orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0), enterpriseConfig.currency), color: 'text-emerald-500' },
                           { label: 'Giảm giá', value: `-${formatCurrency(orders.reduce((s, o) => s + o.discountAmount, 0), enterpriseConfig.currency)}`, color: 'text-orange-500' },
                           { label: 'Hoàn tiền', value: `-${formatCurrency(returnOrders.reduce((s, r) => s + r.totalRefund, 0), enterpriseConfig.currency)}`, color: 'text-red-500' },
                           { label: 'Thuế thu', value: `+${formatCurrency(orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.tax, 0), enterpriseConfig.currency)}`, color: 'text-blue-500' },
                        ].map((item, i) => (
                           <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
                              <span className="text-sm font-bold text-slate-500">{item.label}</span>
                              <span className={`font-black text-lg ${item.color}`}>{item.value}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Voids Tab */}
         {activeTab === 'voids' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                           <XCircle size={20} />
                        </div>
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng đơn huỷ</p>
                     <h3 className="text-3xl font-black text-slate-800">{voidAnalytics.total}</h3>
                  </div>
                  <div className="glass-card p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                           <DollarSign size={20} />
                        </div>
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Giá trị huỷ</p>
                     <h3 className="text-3xl font-black text-red-500">{formatCurrency(voidAnalytics.totalAmount, enterpriseConfig.currency)}</h3>
                  </div>
                  <div className="glass-card p-6">
                     <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                           <AlertTriangle size={20} />
                        </div>
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tỷ lệ huỷ</p>
                     <h3 className="text-3xl font-black text-slate-800">
                        {orders.length > 0 ? ((voidAnalytics.total / orders.length) * 100).toFixed(1) : 0}%
                     </h3>
                  </div>
               </div>

               {voidAnalytics.byReason.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="glass-card p-8">
                        <h3 className="text-lg font-black text-slate-800 mb-6">Phân tích lý do huỷ</h3>
                        <ResponsiveContainer width="100%" height={250}>
                           <RechartsPie>
                              <Pie
                                 data={voidAnalytics.byReason}
                                 cx="50%"
                                 cy="50%"
                                 innerRadius={60}
                                 outerRadius={100}
                                 paddingAngle={5}
                                 dataKey="value"
                              >
                                 {voidAnalytics.byReason.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                 ))}
                              </Pie>
                              <Tooltip />
                           </RechartsPie>
                        </ResponsiveContainer>
                        <div className="flex flex-wrap gap-3 mt-4 justify-center">
                           {voidAnalytics.byReason.map((item, i) => (
                              <div key={i} className="flex items-center gap-2">
                                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                 <span className="text-xs font-bold text-slate-500">{item.name}: {item.value}</span>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="glass-card p-8">
                        <h3 className="text-lg font-black text-slate-800 mb-6">Danh sách đơn huỷ gần đây</h3>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto">
                           {voidOrders.slice(0, 10).map(v => (
                              <div key={v.id} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                                 <div>
                                    <p className="font-bold text-slate-800 text-sm">{v.originalOrderId}</p>
                                    <p className="text-[10px] text-slate-400">{getVoidReasonLabel(v.voidReason)}</p>
                                 </div>
                                 <p className="font-black text-red-500">{formatCurrency(v.originalAmount, enterpriseConfig.currency)}</p>
                              </div>
                           ))}
                           {voidOrders.length === 0 && (
                              <div className="text-center py-8 text-slate-400">
                                 <XCircle size={32} className="mx-auto mb-2 opacity-30" />
                                 <p className="text-xs font-bold">Không có đơn huỷ</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="glass-card p-16 text-center">
                     <XCircle size={56} className="mx-auto mb-4 text-slate-200" />
                     <p className="font-bold text-slate-400">Chưa có dữ liệu đơn huỷ</p>
                  </div>
               )}
            </div>
         )}

         {/* Returns Tab */}
         {activeTab === 'returns' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="glass-card p-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng đơn trả</p>
                     <h3 className="text-3xl font-black text-slate-800">{returnAnalytics.total}</h3>
                  </div>
                  <div className="glass-card p-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chờ duyệt</p>
                     <h3 className="text-3xl font-black text-amber-500">{returnAnalytics.pending}</h3>
                  </div>
                  <div className="glass-card p-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng hoàn tiền</p>
                     <h3 className="text-3xl font-black text-red-500">{formatCurrency(returnAnalytics.totalRefund, enterpriseConfig.currency)}</h3>
                  </div>
                  <div className="glass-card p-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tỷ lệ trả hàng</p>
                     <h3 className="text-3xl font-black text-slate-800">
                        {orders.length > 0 ? ((returnAnalytics.total / orders.length) * 100).toFixed(1) : 0}%
                     </h3>
                  </div>
               </div>

               <div className="glass-card p-8">
                  <h3 className="text-lg font-black text-slate-800 mb-6">Danh sách đơn trả hàng</h3>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                     {returnOrders.length > 0 ? returnOrders.map(r => (
                        <div key={r.id} className="p-5 bg-slate-50 rounded-2xl flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
                                 <RotateCcw size={18} />
                              </div>
                              <div>
                                 <p className="font-bold text-slate-800">{r.id}</p>
                                 <p className="text-xs text-slate-400">
                                    Đơn gốc: {r.originalOrderId} • {getReturnReasonLabel(r.reason)}
                                 </p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="font-black text-primary text-lg">{formatCurrency(r.totalRefund, enterpriseConfig.currency)}</p>
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${r.status === 'pending' ? 'bg-amber-50 text-amber-500' :
                                 r.status === 'approved' ? 'bg-emerald-50 text-emerald-500' :
                                    'bg-red-50 text-red-500'
                                 }`}>
                                 {r.status === 'pending' && 'Chờ duyệt'}
                                 {r.status === 'approved' && 'Đã duyệt'}
                                 {r.status === 'rejected' && 'Từ chối'}
                                 {r.status === 'completed' && 'Hoàn tất'}
                              </span>
                           </div>
                        </div>
                     )) : (
                        <div className="text-center py-12 text-slate-400">
                           <RotateCcw size={48} className="mx-auto mb-4 opacity-30" />
                           <p className="font-bold">Chưa có đơn trả hàng</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}

         {/* Cash Tab */}
         {activeTab === 'cash' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tiền mặt dự kiến</p>
                     <h3 className="text-3xl font-black text-slate-800">{formatCurrency(cashAnalytics.expectedCash, enterpriseConfig.currency)}</h3>
                  </div>
                  <div className="glass-card p-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tiền mặt thực tế</p>
                     <h3 className="text-3xl font-black text-emerald-500">{formatCurrency(cashAnalytics.actualCash, enterpriseConfig.currency)}</h3>
                  </div>
                  <div className="glass-card p-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chênh lệch</p>
                     <h3 className={`text-3xl font-black ${cashAnalytics.isBalanced ? 'text-emerald-500' : 'text-red-500'}`}>
                        {cashAnalytics.discrepancy === 0 ? `0${getCurrencySymbol(enterpriseConfig.currency)} ✓` : formatCurrency(cashAnalytics.discrepancy, enterpriseConfig.currency)}
                     </h3>
                  </div>
               </div>

               <div className="glass-card p-8">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-black text-slate-800">Báo Cáo Tiền Mặt Theo Ca</h3>
                     <span className={`px-4 py-2 rounded-xl font-bold text-sm ${cashAnalytics.isBalanced ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
                        }`}>
                        {cashAnalytics.isBalanced ? '✓ CÂN BẰNG' : '⚠ CHÊNH LỆCH'}
                     </span>
                  </div>

                  <div className="bg-slate-900 text-white rounded-2xl p-6 font-mono text-sm">
                     <pre className="whitespace-pre-wrap">
                        {`========================================
         BÁO CÁO TIỀN MẶT NGÀY
========================================
Ngày: ${new Date().toLocaleDateString('vi-VN')}
Ca: ${cashAnalytics.shifts} ca đã kết thúc

THANH TOÁN TIỀN MẶT
─────────────────────────────────────
Số giao dịch: ${orders.filter(o => o.paymentMethod === 'Cash').length}
Tổng thu tiền mặt: ${formatCurrency(cashAnalytics.expectedCash, enterpriseConfig.currency)}

ĐỐI SOÁT
─────────────────────────────────────
Tiền mặt dự kiến:  ${formatCurrency(cashAnalytics.expectedCash, enterpriseConfig.currency)}
Tiền mặt kiểm đếm: ${formatCurrency(cashAnalytics.actualCash, enterpriseConfig.currency)}
Chênh lệch:        ${formatCurrency(cashAnalytics.discrepancy, enterpriseConfig.currency)}

Trạng thái: ${cashAnalytics.isBalanced ? '✓ CÂN BẰNG' : '⚠ CẦN KIỂM TRA'}
========================================`}
                     </pre>
                  </div>

                  <button className="mt-6 w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
                     <Printer size={18} />
                     In Báo Cáo Tiền Mặt
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

function getVoidReasonLabel(reason: string): string {
   const labels: Record<string, string> = {
      mistake: 'Nhầm lẫn',
      duplicate: 'Trùng đơn',
      customer_request: 'Khách yêu cầu',
      system_error: 'Lỗi hệ thống',
      other: 'Lý do khác',
   };
   return labels[reason] || reason;
}

function getReturnReasonLabel(reason: string): string {
   const labels: Record<string, string> = {
      defective: 'Lỗi sản phẩm',
      change_mind: 'Đổi ý',
      wrong_item: 'Giao sai',
      damaged: 'Hư hỏng',
      expired: 'Hết hạn',
      other: 'Khác',
   };
   return labels[reason] || reason;
}

export default Reports;
