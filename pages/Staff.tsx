
import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import {
   Users, Calendar, Clock, Award, DollarSign, Search, Plus, Filter,
   MoreVertical, ShieldCheck, UserCheck, AlertCircle, Edit, Trash2,
   CalendarDays, FileText, Briefcase, ChevronLeft, ChevronRight, Check, X
} from 'lucide-react';
import { Attendance, Employee } from '../types';
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
   const { employees, addEmployee, updateEmployee, attendanceRecords, orders, showToast } = useStore();
   const [activeTab, setActiveTab] = useState<HRMTab>('employees');
   const [showEmployeeModal, setShowEmployeeModal] = useState(false);
   const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
   const [shifts] = useState<Shift[]>(MOCK_SHIFTS);
   const [payroll] = useState<PayrollRecord[]>(MOCK_PAYROLL);
   const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES);
   const [currentWeek, setCurrentWeek] = useState(new Date());

   const activeAttendances = useMemo(() => {
      return attendanceRecords.filter(r => !r.checkOutTime);
   }, [attendanceRecords]);

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
      showToast('Đã duyệt đơn nghỉ phép!', 'success');
   };

   const handleRejectLeave = (id: string) => {
      setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
      showToast('Đã từ chối đơn nghỉ phép!', 'error');
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
      <div className="p-8">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
               <h1 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3">
                  <Users size={28} className="text-primary" />
                  Nhân sự & HRM
               </h1>
               <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                  Quản lý nhân viên, ca làm, bảng lương, nghỉ phép
               </p>
            </div>
            <button
               onClick={() => setShowEmployeeModal(true)}
               className="px-6 py-4 bg-primary text-white font-bold rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all"
            >
               <Plus size={18} />
               Thêm nhân viên
            </button>
         </div>

         {/* Tabs */}
         <div className="flex items-center gap-2 mb-8 overflow-x-auto">
            {[
               { id: 'employees', label: 'Nhân viên', icon: Users },
               { id: 'schedule', label: 'Lịch làm việc', icon: CalendarDays },
               { id: 'payroll', label: 'Bảng lương', icon: DollarSign },
               { id: 'leave', label: 'Nghỉ phép', icon: Briefcase },
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as HRMTab)}
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

         {/* Employees Tab */}
         {activeTab === 'employees' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               {/* Stats */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {roleStats.map((role, idx) => (
                     <div key={idx} className="glass-card p-6 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${role.bg} ${role.color}`}><role.icon size={20} /></div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">{role.role}</p>
                           <p className="font-black text-xl text-slate-800">{role.count}</p>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Employee Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employees.map(emp => (
                     <div key={emp.id} className="glass-card p-6 hover:shadow-xl transition-all">
                        <div className="flex items-start justify-between mb-4">
                           <div className="flex items-center gap-4">
                              <img
                                 src={emp.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`}
                                 className="w-14 h-14 rounded-2xl object-cover"
                              />
                              <div>
                                 <h3 className="font-black text-slate-800">{emp.name}</h3>
                                 <p className="text-xs font-bold text-primary uppercase">{emp.role}</p>
                              </div>
                           </div>
                           <div className={`w-3 h-3 rounded-full ${emp.checkInStatus === 'checked_in' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                           <p className="text-xs text-slate-400">{emp.id}</p>
                           <button
                              onClick={() => { setEditingEmployee(emp); setShowEmployeeModal(true); }}
                              className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-primary hover:text-white transition-all"
                           >
                              <Edit size={14} />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Schedule Tab */}
         {activeTab === 'schedule' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <button
                        onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)))}
                        className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                     ><ChevronLeft size={18} /></button>
                     <h3 className="font-bold text-slate-800">
                        Tuần {weekDays[0].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - {weekDays[6].toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                     </h3>
                     <button
                        onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)))}
                        className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                     ><ChevronRight size={18} /></button>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm flex items-center gap-2">
                     <Plus size={16} />
                     Thêm ca làm
                  </button>
               </div>

               <div className="glass-card overflow-hidden">
                  <div className="grid grid-cols-8 border-b border-slate-100">
                     <div className="p-4 bg-slate-50 font-bold text-slate-400 text-xs uppercase">Nhân viên</div>
                     {weekDays.map((day, idx) => (
                        <div key={idx} className={`p-4 text-center ${day.toDateString() === new Date().toDateString() ? 'bg-primary/10' : 'bg-slate-50'}`}>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">{day.toLocaleDateString('vi-VN', { weekday: 'short' })}</p>
                           <p className="font-black text-slate-800">{day.getDate()}</p>
                        </div>
                     ))}
                  </div>

                  {employees.slice(0, 5).map(emp => (
                     <div key={emp.id} className="grid grid-cols-8 border-b border-slate-50 hover:bg-white/50 transition-colors">
                        <div className="p-4 flex items-center gap-3">
                           <img src={emp.avatar} className="w-8 h-8 rounded-lg object-cover" />
                           <span className="font-bold text-slate-800 text-sm truncate">{emp.name}</span>
                        </div>
                        {weekDays.map((day, idx) => {
                           const dayStr = day.toISOString().split('T')[0];
                           const shift = shifts.find(s => s.employeeId === emp.id.replace('EMP-', 'E') && s.date === dayStr);
                           return (
                              <div key={idx} className="p-2 flex items-center justify-center">
                                 {shift ? (
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getShiftTypeStyle(shift.type)}`}>
                                       {shift.startTime}-{shift.endTime}
                                    </span>
                                 ) : (
                                    <span className="text-slate-200">—</span>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  ))}
               </div>
            </div>
         )}

         {/* Payroll Tab */}
         {activeTab === 'payroll' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="glass-card p-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Tổng quỹ lương</p>
                     <p className="font-black text-2xl text-primary">{payroll.reduce((sum, p) => sum + p.netPay, 0).toLocaleString()}₫</p>
                  </div>
                  <div className="glass-card p-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Đã thanh toán</p>
                     <p className="font-black text-2xl text-emerald-500">{payroll.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.netPay, 0).toLocaleString()}₫</p>
                  </div>
                  <div className="glass-card p-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Chờ thanh toán</p>
                     <p className="font-black text-2xl text-amber-500">{payroll.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netPay, 0).toLocaleString()}₫</p>
                  </div>
                  <div className="glass-card p-6">
                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Số nhân viên</p>
                     <p className="font-black text-2xl text-slate-800">{payroll.length}</p>
                  </div>
               </div>

               <div className="glass-card overflow-hidden">
                  <table className="w-full">
                     <thead>
                        <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <th className="text-left p-4 pl-6">Nhân viên</th>
                           <th className="text-right p-4">Lương cơ bản</th>
                           <th className="text-right p-4">Tăng ca</th>
                           <th className="text-right p-4">Thưởng</th>
                           <th className="text-right p-4">Khấu trừ</th>
                           <th className="text-right p-4">Thực nhận</th>
                           <th className="text-center p-4 pr-6">Trạng thái</th>
                        </tr>
                     </thead>
                     <tbody>
                        {payroll.map(record => (
                           <tr key={record.id} className="border-t border-slate-50 hover:bg-white/50">
                              <td className="p-4 pl-6 font-bold text-slate-800">{record.employeeName}</td>
                              <td className="p-4 text-right text-slate-600">{record.baseSalary.toLocaleString()}₫</td>
                              <td className="p-4 text-right text-blue-500">+{record.overtime.toLocaleString()}₫</td>
                              <td className="p-4 text-right text-emerald-500">+{record.bonus.toLocaleString()}₫</td>
                              <td className="p-4 text-right text-red-500">-{record.deductions.toLocaleString()}₫</td>
                              <td className="p-4 text-right font-black text-primary text-lg">{record.netPay.toLocaleString()}₫</td>
                              <td className="p-4 pr-6 text-center">
                                 <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase ${getStatusStyle(record.status)}`}>
                                    {record.status === 'paid' ? 'Đã trả' : 'Chờ trả'}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* Leave Tab */}
         {activeTab === 'leave' && (
            <div className="space-y-6 animate-in fade-in duration-300">
               <div className="flex items-center justify-between">
                  <p className="text-slate-500 font-medium">{leaves.filter(l => l.status === 'pending').length} đơn chờ duyệt</p>
                  <button className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-sm flex items-center gap-2">
                     <Plus size={16} />
                     Tạo đơn nghỉ
                  </button>
               </div>

               <div className="space-y-4">
                  {leaves.map(leave => (
                     <div key={leave.id} className="glass-card p-6">
                        <div className="flex items-start justify-between">
                           <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${getLeaveTypeStyle(leave.type)}`}>
                                 <Briefcase size={20} />
                              </div>
                              <div>
                                 <h3 className="font-bold text-slate-800">{leave.employeeName}</h3>
                                 <p className="text-sm text-slate-500">
                                    {new Date(leave.startDate).toLocaleDateString('vi-VN')}
                                    {leave.startDate !== leave.endDate && ` - ${new Date(leave.endDate).toLocaleDateString('vi-VN')}`}
                                 </p>
                                 <p className="text-xs text-slate-400 mt-1">{leave.reason}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${getLeaveTypeStyle(leave.type)}`}>
                                 {leave.type === 'annual' && 'Phép năm'}
                                 {leave.type === 'sick' && 'Ốm'}
                                 {leave.type === 'personal' && 'Việc riêng'}
                                 {leave.type === 'unpaid' && 'Không lương'}
                              </span>
                              <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase ${getStatusStyle(leave.status)}`}>
                                 {leave.status === 'pending' && 'Chờ duyệt'}
                                 {leave.status === 'approved' && 'Đã duyệt'}
                                 {leave.status === 'rejected' && 'Từ chối'}
                              </span>
                              {leave.status === 'pending' && (
                                 <div className="flex gap-2">
                                    <button
                                       onClick={() => handleApproveLeave(leave.id)}
                                       className="p-2 bg-emerald-50 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                                    >
                                       <Check size={14} />
                                    </button>
                                    <button
                                       onClick={() => handleRejectLeave(leave.id)}
                                       className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                    >
                                       <X size={14} />
                                    </button>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}

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

export default Staff;
