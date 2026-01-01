import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import {
   Users, Calendar, Clock, Award, DollarSign, Search, Plus, Filter,
   MoreVertical, ShieldCheck, UserCheck, AlertCircle, Edit, Trash2,
   CalendarDays, FileText, Briefcase, ChevronLeft, ChevronRight, Check, X
} from 'lucide-react';
import { Attendance, Employee } from '../types';
import { formatCurrency } from '../utils/formatters';
import EmployeeModal from '../components/EmployeeModal';

type HRMTab = 'employees' | 'schedule' | 'payroll' | 'leave';

// Types
interface Shift {
   id: string;
   employeeId: string;
   employeeName: string;
   date: string;
   startTime: string;
   endTime: string;
   type: 'morning' | 'afternoon' | 'evening' | 'full';
   status: 'scheduled' | 'completed' | 'absent' | 'late';
}

interface PayrollRecord {
   id: string;
   employeeId: string;
   employeeName: string;
   month: string;
   baseSalary: number;
   overtime: number;
   bonus: number;
   deductions: number;
   netPay: number;
   status: 'pending' | 'paid';
}

interface LeaveRequest {
   id: string;
   employeeId: string;
   employeeName: string;
   type: 'annual' | 'sick' | 'personal' | 'unpaid';
   startDate: string;
   endDate: string;
   reason: string;
   status: 'pending' | 'approved' | 'rejected';
   approvedBy?: string;
}

// Mock data
const MOCK_SHIFTS: Shift[] = [
   { id: 'SH-001', employeeId: 'E1', employeeName: 'Nguyễn Văn A', date: '2024-12-31', startTime: '07:00', endTime: '15:00', type: 'morning', status: 'scheduled' },
   { id: 'SH-002', employeeId: 'E2', employeeName: 'Trần Thị B', date: '2024-12-31', startTime: '15:00', endTime: '23:00', type: 'evening', status: 'scheduled' },
   { id: 'SH-003', employeeId: 'E3', employeeName: 'Lê Văn C', date: '2024-12-31', startTime: '07:00', endTime: '23:00', type: 'full', status: 'scheduled' },
];

const MOCK_PAYROLL: PayrollRecord[] = [
   { id: 'PAY-001', employeeId: 'E1', employeeName: 'Nguyễn Văn A', month: '2024-12', baseSalary: 8000000, overtime: 1200000, bonus: 500000, deductions: 700000, netPay: 9000000, status: 'pending' },
   { id: 'PAY-002', employeeId: 'E2', employeeName: 'Trần Thị B', month: '2024-12', baseSalary: 7000000, overtime: 800000, bonus: 0, deductions: 600000, netPay: 7200000, status: 'paid' },
   { id: 'PAY-003', employeeId: 'E3', employeeName: 'Lê Văn C', month: '2024-12', baseSalary: 10000000, overtime: 0, bonus: 2000000, deductions: 900000, netPay: 11100000, status: 'pending' },
];

const MOCK_LEAVES: LeaveRequest[] = [
   { id: 'LV-001', employeeId: 'E1', employeeName: 'Nguyễn Văn A', type: 'annual', startDate: '2025-01-01', endDate: '2025-01-03', reason: 'Nghỉ Tết', status: 'approved', approvedBy: 'Manager' },
   { id: 'LV-002', employeeId: 'E2', employeeName: 'Trần Thị B', type: 'sick', startDate: '2024-12-28', endDate: '2024-12-29', reason: 'Ốm', status: 'approved' },
   { id: 'LV-003', employeeId: 'E4', employeeName: 'Phạm Văn D', type: 'personal', startDate: '2025-01-05', endDate: '2025-01-05', reason: 'Việc gia đình', status: 'pending' },
];

const Staff: React.FC = () => {
   const { t } = useTranslation();
   const { employees, addEmployee, updateEmployee, attendanceRecords, showToast, enterpriseConfig } = useStore();
   const [activeTab, setActiveTab] = useState<HRMTab>('employees');
   const [showEmployeeModal, setShowEmployeeModal] = useState(false);
   const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
   const [shifts] = useState<Shift[]>(MOCK_SHIFTS);
   const [payroll] = useState<PayrollRecord[]>(MOCK_PAYROLL);
   const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES);
   const [currentWeek, setCurrentWeek] = useState(new Date());

   const roleStats = useMemo(() => {
      return [
         { role: 'Managers', count: employees.filter(e => e.role === 'Manager' || e.role === 'Admin').length, icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
         { role: 'Cashiers', count: employees.filter(e => e.role === 'Cashier').length, icon: UserCheck, color: 'text-green-500', bg: 'bg-green-50' },
         { role: 'Waiters', count: employees.filter(e => e.role === 'Waiter').length, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
         { role: 'Kitchen Staff', count: employees.filter(e => e.role === 'Kitchen').length, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
      ];
   }, [employees]);

   const handleSaveEmployee = (data: Partial<Employee>) => {
      if (editingEmployee) {
         updateEmployee(editingEmployee.id, data);
         setEditingEmployee(null);
      } else {
         const newEmp: Employee = {
            id: `EMP-${Date.now()}`,
            name: data.name || 'Unnamed',
            role: data.role || 'Waiter',
            pin: data.pin || '1234',
            email: data.email || '',
            phone: data.phone || '',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'U')}&background=random`,
            status: 'Active',
            salary: 0
         };
         addEmployee(newEmp);
      }
      setShowEmployeeModal(false);
   };

   const handleApproveLeave = (id: string) => {
      setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'approved', approvedBy: 'Manager' } : l));
      showToast(t('common.success'), 'success');
   };

   const handleRejectLeave = (id: string) => {
      setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
      showToast(t('common.error'), 'error');
   };

   const getShiftTypeStyle = (type: string) => {
      const styles: Record<string, string> = {
         morning: 'bg-amber-50 text-amber-600 border-amber-100',
         afternoon: 'bg-blue-50 text-blue-600 border-blue-100',
         evening: 'bg-indigo-50 text-indigo-600 border-indigo-100',
         full: 'bg-purple-50 text-purple-600 border-purple-100',
      };
      return styles[type] || 'bg-slate-50 text-slate-500';
   };

   const getLeaveTypeStyle = (type: string) => {
      const styles: Record<string, string> = {
         annual: 'bg-emerald-50 text-emerald-600',
         sick: 'bg-red-50 text-red-600',
         personal: 'bg-blue-50 text-blue-600',
         unpaid: 'bg-slate-50 text-slate-600',
      };
      return styles[type] || 'bg-slate-50 text-slate-500';
   };

   const getLeaveTypeLabel = (type: string) => {
      switch (type) {
         case 'annual': return t('staff.leave_annual');
         case 'sick': return t('staff.leave_sick');
         case 'unpaid': return t('staff.leave_unpaid');
         default: return type;
      }
   }

   const getStatusStyle = (status: string) => {
      const styles: Record<string, string> = {
         pending: 'bg-amber-50 text-amber-600 border-amber-100',
         approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
         rejected: 'bg-red-50 text-red-600 border-red-100',
         paid: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      };
      return styles[status] || 'bg-slate-50 text-slate-500';
   };

   const weekDays = useMemo(() => {
      const start = new Date(currentWeek);
      start.setDate(start.getDate() - start.getDay() + 1);
      return Array.from({ length: 7 }, (_, i) => {
         const d = new Date(start);
         d.setDate(d.getDate() + i);
         return d;
      });
   }, [currentWeek]);

   return (
      <div className="p-3 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h1 className="text-xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
                  <Users size={28} className="text-primary" />
                  {t('staff.title')}
               </h1>
               <p className="hidden md:block text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
                  {t('sidebar.team_hrm')}
               </p>
            </div>
            <button
               onClick={() => setShowEmployeeModal(true)}
               className="px-6 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 shadow-lg hover:brightness-110 transition-all whitespace-nowrap"
            >
               <Plus size={18} />
               <span>{t('staff.add_employee')}</span>
            </button>
         </div>

         {/* Tabs */}
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
               { id: 'employees', label: t('sidebar.staff'), icon: Users },
               { id: 'schedule', label: t('staff.attendance'), icon: CalendarDays },
               { id: 'payroll', label: t('staff.payroll'), icon: DollarSign },
               { id: 'leave', label: t('staff.leave_requests'), icon: Briefcase },
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as HRMTab)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
                     ? 'bg-slate-900 text-white shadow-lg'
                     : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
                     }`}
               >
                  <tab.icon size={16} />
                  {tab.label}
               </button>
            ))}
         </div>

         {/* Content */}
         <div className="animate-in fade-in duration-500">
            {activeTab === 'employees' && (
               <div className="space-y-8">
                  {/* Role Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {roleStats.map((role, idx) => (
                        <div key={idx} className="glass-card p-4 md:p-6 flex flex-col gap-4">
                           <div className="flex items-center justify-between">
                              <div className={`p-3 rounded-xl ${role.bg} ${role.color}`}>
                                 <role.icon size={20} />
                              </div>
                           </div>
                           <div>
                              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{role.role}</p>
                              <h3 className="text-xl md:text-2xl font-black text-slate-800">{role.count}</h3>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Employee Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {employees.map(emp => (
                        <div key={emp.id} className="glass-card p-6 group hover:shadow-2xl transition-all border-b-4 border-transparent hover:border-primary">
                           <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-4">
                                 <img
                                    src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`}
                                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                                 />
                                 <div>
                                    <h3 className="font-black text-slate-800">{emp.name}</h3>
                                    <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest mt-1">{emp.role}</p>
                                 </div>
                              </div>
                              <div className={`w-3 h-3 rounded-full border-4 border-white shadow-sm ${emp.checkInStatus === 'checked_in' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                           </div>

                           <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{emp.id}</p>
                              <div className="flex items-center gap-2">
                                 <button
                                    onClick={() => { setEditingEmployee(emp); setShowEmployeeModal(true); }}
                                    className="p-2 text-slate-300 hover:text-primary transition-colors"
                                 >
                                    <Edit size={18} />
                                 </button>
                                 <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={18} />
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'schedule' && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                        <button
                           onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)))}
                           className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
                        ><ChevronLeft size={20} /></button>
                        <h3 className="font-black text-slate-800 px-4 text-sm uppercase tracking-wide">
                           {weekDays[0].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} — {weekDays[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </h3>
                        <button
                           onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)))}
                           className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
                        ><ChevronRight size={20} /></button>
                     </div>
                  </div>

                  <div className="glass-card overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-center">
                           <thead>
                              <tr className="bg-slate-50 border-b border-slate-100">
                                 <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none w-[200px]">{t('staff.employee_name')}</th>
                                 {weekDays.map((day, idx) => (
                                    <th key={idx} className={`p-6 ${day.toDateString() === new Date().toDateString() ? 'bg-primary/5' : ''}`}>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{day.toLocaleDateString('vi-VN', { weekday: 'short' })}</p>
                                       <p className="font-black text-slate-800">{day.getDate()}</p>
                                    </th>
                                 ))}
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {employees.slice(0, 5).map(emp => (
                                 <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 text-left">
                                       <div className="flex items-center gap-3">
                                          <img src={emp.avatar} className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm" />
                                          <span className="font-black text-slate-800 text-sm">{emp.name}</span>
                                       </div>
                                    </td>
                                    {weekDays.map((day, idx) => {
                                       const dayStr = day.toISOString().split('T')[0];
                                       const shift = shifts.find(s => s.employeeId === emp.id.replace('EMP-', 'E') && s.date === dayStr);
                                       return (
                                          <td key={idx} className={`p-4 ${day.toDateString() === new Date().toDateString() ? 'bg-primary/5' : ''}`}>
                                             {shift ? (
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getShiftTypeStyle(shift.type)}`}>
                                                   {shift.startTime} - {shift.endTime}
                                                </span>
                                             ) : (
                                                <span className="text-slate-200">—</span>
                                             )}
                                          </td>
                                       );
                                    })}
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'payroll' && (
               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     {[
                        { label: 'Total Payroll', val: payroll.reduce((sum, p) => sum + p.netPay, 0), color: 'text-primary', bg: 'bg-primary/5' },
                        { label: 'Paid Amount', val: payroll.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.netPay, 0), color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { label: 'Pending Disbursement', val: payroll.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netPay, 0), color: 'text-amber-500', bg: 'bg-amber-50' },
                        { label: 'Headcount', val: payroll.length, color: 'text-slate-800', bg: 'bg-slate-50', isMoney: false },
                     ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 flex flex-col gap-4">
                           <div>
                              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                              <h3 className={`text-xl md:text-2xl font-black ${stat.color}`}>
                                 {stat.isMoney === false ? stat.val : formatCurrency(stat.val as number, enterpriseConfig.currency)}
                              </h3>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="glass-card overflow-hidden">
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                           <thead>
                              <tr className="bg-slate-50 border-b border-slate-100">
                                 <th className="p-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('staff.employee_name')}</th>
                                 <th className="p-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Base Salary</th>
                                 <th className="p-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Net Pay</th>
                                 <th className="p-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('staff.status')}</th>
                                 <th className="p-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none"></th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-50">
                              {payroll.map(record => (
                                 <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6 font-black text-slate-800">{record.employeeName}</td>
                                    <td className="p-6 text-right font-bold text-slate-400">{formatCurrency(record.baseSalary, enterpriseConfig.currency)}</td>
                                    <td className="p-6 text-right font-black text-slate-900 text-lg">{formatCurrency(record.netPay, enterpriseConfig.currency)}</td>
                                    <td className="p-6 text-center">
                                       <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(record.status)}`}>
                                          {record.status === 'paid' ? 'Paid' : 'Unpaid'}
                                       </span>
                                    </td>
                                    <td className="p-6 text-right">
                                       <button className="p-2 text-slate-300 hover:text-primary transition-colors"><FileText size={18} /></button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'leave' && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <p className="font-bold text-slate-400 text-xs uppercase tracking-widest">{leaves.filter(l => l.status === 'pending').length} Action Required</p>
                  </div>

                  <div className="space-y-4">
                     {leaves.map(leave => (
                        <div key={leave.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all">
                           <div className="flex items-center gap-6">
                              <div className={`p-4 rounded-2xl ${getLeaveTypeStyle(leave.type)} border border-current opacity-20`}>
                                 <Briefcase size={24} />
                              </div>
                              <div className="-ml-[4.5rem] flex items-center gap-6">
                                 <div className={`p-4 rounded-2xl ${getLeaveTypeStyle(leave.type)}`}>
                                    <Briefcase size={24} />
                                 </div>
                                 <div>
                                    <h4 className="font-black text-slate-800 text-lg">{leave.employeeName}</h4>
                                    <p className="text-sm font-bold text-slate-400">
                                       {new Date(leave.startDate).toLocaleDateString('vi-VN')}
                                       {leave.startDate !== leave.endDate && ` — ${new Date(leave.endDate).toLocaleDateString('vi-VN')}`}
                                    </p>
                                    <p className="text-[10px] font-extrabold text-slate-300 italic mt-1 uppercase tracking-wider">{leave.reason}</p>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-4">
                              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getLeaveTypeStyle(leave.type)}`}>
                                 {getLeaveTypeLabel(leave.type)}
                              </span>
                              <span className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(leave.status)}`}>
                                 {leave.status}
                              </span>
                              {leave.status === 'pending' && (
                                 <div className="flex gap-2 ml-4">
                                    <button
                                       onClick={() => handleRejectLeave(leave.id)}
                                       className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    >
                                       <XCircle size={18} />
                                    </button>
                                    <button
                                       onClick={() => handleApproveLeave(leave.id)}
                                       className="p-3 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                    >
                                       <CheckCircle2 size={18} />
                                    </button>
                                 </div>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>

         {(showEmployeeModal || editingEmployee) && (
            <EmployeeModal
               employee={editingEmployee}
               onClose={() => { setShowEmployeeModal(false); setEditingEmployee(null); }}
               onSave={handleSaveEmployee}
            />
         )}
      </div>
   );
};

const XCircle = X;
const CheckCircle2 = Check;

export default Staff;
