import React, { useState, useMemo } from 'react';
import {
    X, Calendar, Clock, Users, Phone, Mail, Search,
    Filter, ChevronLeft, ChevronRight, Check, XCircle,
    AlertTriangle, Eye, Bell, MessageSquare, Table2, UserCheck
} from 'lucide-react';
import { Reservation, Table } from '../types';

interface ReservationListViewProps {
    reservations: Reservation[];
    tables: Table[];
    onClose: () => void;
    onConfirmReservation: (id: string) => void;
    onCancelReservation: (id: string, reason: string) => void;
    onCheckIn: (id: string, tableId: string) => void;
    onMarkNoShow: (id: string) => void;
    onSendReminder: (id: string) => void;
}

const ReservationListView: React.FC<ReservationListViewProps> = ({
    reservations,
    tables,
    onClose,
    onConfirmReservation,
    onCancelReservation,
    onCheckIn,
    onMarkNoShow,
    onSendReminder
}) => {
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'cancelled' | 'seated'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [selectedTableForCheckIn, setSelectedTableForCheckIn] = useState<string>('');

    // Filter reservations for selected date
    const filteredReservations = useMemo(() => {
        const dateStr = selectedDate.toISOString().split('T')[0];
        return reservations.filter(r => {
            const matchesDate = r.date === dateStr;
            const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
            const matchesSearch = !searchQuery ||
                r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.customerPhone.includes(searchQuery);
            return matchesDate && matchesStatus && matchesSearch;
        });
    }, [reservations, selectedDate, filterStatus, searchQuery]);

    // Group by time slots for calendar view
    const timeSlots = useMemo(() => {
        const slots: Record<string, Reservation[]> = {};
        filteredReservations.forEach(r => {
            const hour = r.startTime.split(':')[0];
            if (!slots[hour]) slots[hour] = [];
            slots[hour].push(r);
        });
        return slots;
    }, [filteredReservations]);

    const getStatusBadge = (status: Reservation['status']) => {
        switch (status) {
            case 'confirmed':
                return <span className="px-2 py-1 bg-emerald-50 text-emerald-500 border border-emerald-100 rounded-lg text-[9px] font-bold uppercase tracking-widest">Đã xác nhận</span>;
            case 'cancelled':
                return <span className="px-2 py-1 bg-red-50 text-red-500 border border-red-100 rounded-lg text-[9px] font-bold uppercase tracking-widest">Đã huỷ</span>;
            case 'seated':
                return <span className="px-2 py-1 bg-blue-50 text-blue-500 border border-blue-100 rounded-lg text-[9px] font-bold uppercase tracking-widest">Đã ngồi</span>;
            case 'completed':
                return <span className="px-2 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg text-[9px] font-bold uppercase tracking-widest">Hoàn thành</span>;
            default:
                return <span className="px-2 py-1 bg-amber-50 text-amber-500 border border-amber-100 rounded-lg text-[9px] font-bold uppercase tracking-widest">Chờ xác nhận</span>;
        }
    };

    const changeDate = (delta: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + delta);
        setSelectedDate(newDate);
    };

    const availableTables = useMemo(() => {
        if (!selectedReservation) return tables;
        // Filter tables that can fit the party size
        return tables.filter(t => t.capacity >= selectedReservation.guests && t.status === 'available');
    }, [tables, selectedReservation]);

    const handleConfirmCheckIn = () => {
        if (selectedReservation && selectedTableForCheckIn) {
            onCheckIn(selectedReservation.id, selectedTableForCheckIn);
            setShowCheckInModal(false);
            setSelectedReservation(null);
            setSelectedTableForCheckIn('');
        }
    };

    const handleConfirmCancel = () => {
        if (selectedReservation && cancelReason) {
            onCancelReservation(selectedReservation.id, cancelReason);
            setShowCancelModal(false);
            setSelectedReservation(null);
            setCancelReason('');
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
            <div className="glass-card w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Quản lý Đặt Bàn</h2>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">
                                {filteredReservations.length} lượt đặt • {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-all">
                        <X size={18} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-white/10 flex items-center gap-4">
                    {/* Date Navigator */}
                    <div className="flex items-center gap-2 bg-white/50 rounded-xl p-1">
                        <button onClick={() => changeDate(-1)} className="p-2 hover:bg-white rounded-lg transition-all">
                            <ChevronLeft size={18} className="text-slate-500" />
                        </button>
                        <button
                            onClick={() => setSelectedDate(new Date())}
                            className="px-4 py-2 font-bold text-sm text-slate-700"
                        >
                            {selectedDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </button>
                        <button onClick={() => changeDate(1)} className="p-2 hover:bg-white rounded-lg transition-all">
                            <ChevronRight size={18} className="text-slate-500" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Tìm tên hoặc SĐT..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-slate-800 font-bold outline-none focus:border-primary transition-all text-sm"
                        />
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2">
                        {(['all', 'confirmed', 'seated', 'cancelled'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${filterStatus === status
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'bg-white/50 text-slate-500 hover:bg-white'
                                    }`}
                            >
                                {status === 'all' && 'Tất cả'}
                                {status === 'confirmed' && 'Đã xác nhận'}
                                {status === 'seated' && 'Đã ngồi'}
                                {status === 'cancelled' && 'Đã huỷ'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {filteredReservations.length === 0 ? (
                        <div className="text-center py-16">
                            <Calendar size={56} className="mx-auto mb-4 text-slate-200" />
                            <p className="font-bold text-slate-400 mb-1">Không có lượt đặt bàn</p>
                            <p className="text-sm text-slate-300">Chọn ngày khác hoặc thay đổi bộ lọc</p>
                        </div>
                    ) : (
                        filteredReservations.map(reservation => (
                            <div
                                key={reservation.id}
                                className={`p-5 bg-white/60 hover:bg-white border rounded-2xl transition-all ${reservation.status === 'cancelled' ? 'opacity-50 border-slate-200' : 'border-white/60 hover:border-primary/30'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Time */}
                                        <div className="text-center p-3 bg-primary/10 rounded-xl min-w-[70px]">
                                            <p className="font-black text-primary text-lg">{reservation.startTime}</p>
                                            <p className="text-[9px] font-bold text-primary/60 uppercase">{reservation.duration} phút</p>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-black text-slate-800">{reservation.customerName}</h3>
                                                {getStatusBadge(reservation.status)}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Phone size={12} />
                                                    {reservation.customerPhone}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={12} />
                                                    {reservation.guests} người
                                                </span>
                                                {reservation.tableId && (
                                                    <span className="flex items-center gap-1">
                                                        <Table2 size={12} />
                                                        Bàn {reservation.tableId}
                                                    </span>
                                                )}
                                            </div>
                                            {reservation.notes && (
                                                <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                                                    💬 {reservation.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {reservation.status === 'confirmed' && (
                                            <>
                                                <button
                                                    onClick={() => onSendReminder(reservation.id)}
                                                    className="p-2 bg-amber-50 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-white transition-all"
                                                    title="Gửi nhắc nhở"
                                                >
                                                    <Bell size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedReservation(reservation); setShowCheckInModal(true); }}
                                                    className="p-2 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"
                                                    title="Check-in"
                                                >
                                                    <UserCheck size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onMarkNoShow(reservation.id)}
                                                    className="p-2 bg-orange-50 text-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all"
                                                    title="Đánh dấu No-show"
                                                >
                                                    <AlertTriangle size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedReservation(reservation); setShowCancelModal(true); }}
                                                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                    title="Huỷ đặt bàn"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && selectedReservation && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <XCircle size={32} />
                            </div>
                            <h3 className="font-black text-slate-800 text-xl">Huỷ đặt bàn</h3>
                            <p className="text-slate-400 text-sm mt-1">{selectedReservation.customerName} - {selectedReservation.startTime}</p>
                        </div>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Nhập lý do huỷ..."
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-primary resize-none"
                            rows={3}
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setShowCancelModal(false); setCancelReason(''); }}
                                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                            >
                                Không
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={!cancelReason.trim()}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                                Xác nhận huỷ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Check-in Modal */}
            {showCheckInModal && selectedReservation && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <UserCheck size={32} />
                            </div>
                            <h3 className="font-black text-slate-800 text-xl">Check-in khách</h3>
                            <p className="text-slate-400 text-sm mt-1">{selectedReservation.customerName} - {selectedReservation.guests} người</p>
                        </div>

                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Chọn bàn</p>
                        <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                            {availableTables.map(table => (
                                <button
                                    key={table.id}
                                    onClick={() => setSelectedTableForCheckIn(table.id)}
                                    className={`p-4 rounded-xl border transition-all ${selectedTableForCheckIn === table.id
                                            ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-200'
                                        }`}
                                >
                                    <p className="font-black">Bàn {table.number}</p>
                                    <p className="text-[10px] text-slate-400">{table.capacity} chỗ</p>
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setShowCheckInModal(false); setSelectedTableForCheckIn(''); }}
                                className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                            >
                                Huỷ
                            </button>
                            <button
                                onClick={handleConfirmCheckIn}
                                disabled={!selectedTableForCheckIn}
                                className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50"
                            >
                                Xác nhận Check-in
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationListView;
