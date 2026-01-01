
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Table, TableStatus, Area, Reservation } from '../types';
import {
  CheckCircle,
  Clock,
  Plus,
  LogIn,
  LayoutGrid,
  LayoutList,
  Calendar,
  Users,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import BookingModal from '../components/BookingModal';
import ReservationScheduleModal from '../components/ReservationScheduleModal';
import AddAreaModal from '../components/AddAreaModal';
import AddTableModal from '../components/AddTableModal';

const Tables: React.FC = () => {
  const navigate = useNavigate();
  const { tables, updateTable, addTable, areas, addArea } = useStore();
  const [selectedAreaId, setSelectedAreaId] = useState<string>(areas[0]?.id || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookingTable, setBookingTable] = useState<Table | null>(null);
  const [scheduleTable, setScheduleTable] = useState<Table | null>(null);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [showAddTableModal, setShowAddTableModal] = useState(false);

  const filteredTables = tables.filter(t => t.areaId === (selectedAreaId || (areas[0]?.id || '')));
  const selectedArea = areas.find(a => a.id === selectedAreaId) || areas[0];

  const getStatusConfig = (status: TableStatus) => {
    switch (status) {
      case 'available': return { color: '#2ECC71', text: 'text-emerald-500', label: 'SẴN SÀNG', bg: 'bg-emerald-50', icon: CheckCircle };
      case 'occupied': return { color: 'var(--primary-600)', text: 'text-primary', label: 'ĐANG CÓ KHÁCH', bg: 'bg-primary/10', icon: Clock };
      default: return { color: '#F1C40F', text: 'text-amber-500', label: 'ĐÃ ĐẶT TRƯỚC', bg: 'bg-amber-50', icon: Calendar };
    }
  };

  const handleConfirmAddArea = (name: string) => {
    const newArea: Area = { id: `A${Date.now()}`, name };
    addArea(newArea);
    setSelectedAreaId(newArea.id);
    setShowAddAreaModal(false);
  };

  const handleConfirmAddTable = (number: string, capacity: number) => {
    const newTable: Table = {
      id: `T${Date.now()}`,
      number: number.padStart(2, '0'),
      areaId: selectedAreaId || areas[0]?.id,
      status: 'available',
      capacity: capacity,
      allReservations: []
    };
    addTable(newTable);
    setShowAddTableModal(false);
  };

  const handleConfirmBooking = (res: Reservation) => {
    if (bookingTable) {
      updateTable(bookingTable.id, {
        status: 'reserved',
        allReservations: [...(bookingTable.allReservations || []), res]
      });
    }
    setBookingTable(null);
  };

  return (
    <div className="p-3 md:p-8 max-w-7xl mx-auto space-y-4 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Bàn & Khu vực</h1>
          <p className="hidden md:block text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Quản lý sơ đồ bàn và trạng thái</p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-1 rounded-xl border border-white/60 flex items-center shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-slate-400'}`}
          >
            <LayoutList size={18} />
          </button>
        </div>
      </header>

      {/* Area Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <div className="flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 bg-white/40 backdrop-blur-xl rounded-xl md:rounded-[1.5rem] border border-white/60 shadow-lg shrink-0">
          {areas.map(area => (
            <button
              key={area.id}
              onClick={() => setSelectedAreaId(area.id)}
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-[10px] md:text-[11px] uppercase tracking-wider whitespace-nowrap transition-all ${selectedAreaId === area.id
                ? 'bg-primary text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                }`}
            >
              {area.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddAreaModal(true)}
          className="shrink-0 flex items-center gap-1.5 px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold text-[10px] md:text-[11px] uppercase tracking-wider bg-white/40 backdrop-blur-xl border border-dashed border-slate-300 text-slate-400 hover:border-primary hover:text-primary transition-all whitespace-nowrap"
        >
          <Plus size={12} strokeWidth={3} />
          <span className="hidden xs:inline">Thêm Khu vực</span>
          <span className="xs:hidden">Thêm</span>
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {filteredTables.map(table => {
            const config = getStatusConfig(table.status);
            return (
              <div
                key={table.id}
                className="glass-card p-3 md:p-8 group relative animate-fade-in hover:scale-[1.02]"
              >
                {/* Status badge - top right */}
                <div className="absolute top-2 right-2 md:top-6 md:right-8 flex items-center gap-1 md:gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse" style={{ backgroundColor: config.color }} />
                    <span className={`hidden md:inline text-[8px] font-black uppercase tracking-widest ${config.text}`}>{config.label}</span>
                  </div>
                  <button
                    onClick={() => setScheduleTable(table)}
                    className="p-1 md:p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <MoreHorizontal size={12} className="md:w-3.5 md:h-3.5" />
                  </button>
                </div>

                {/* Icon + Table info */}
                <div className="flex flex-col items-center text-center mb-3 md:mb-8 pt-4 md:pt-0">
                  <div className={`w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-[1.8rem] ${config.bg} ${config.text} flex items-center justify-center mb-2 md:mb-5 border-2 md:border-4 border-white shadow-lg md:shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                    <config.icon size={20} className="md:w-8 md:h-8" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg md:text-3xl font-extrabold text-slate-800 tracking-tight">Bàn {table.number}</h3>
                  <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wide md:tracking-[0.2em]">{table.capacity} CHỖ</p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 md:gap-3">
                  <button
                    onClick={() => setBookingTable(table)}
                    className={`flex-1 py-2 md:py-4 rounded-lg md:rounded-xl font-bold text-[9px] md:text-[11px] uppercase tracking-wide md:tracking-wider transition-all ${table.status === 'reserved'
                      ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                      : 'bg-white/60 hover:bg-white text-slate-600 border border-slate-100'
                      }`}
                  >
                    <span className="hidden xs:inline">{table.status === 'reserved' ? 'Sửa Đặt' : 'Đặt bàn'}</span>
                    <span className="xs:hidden">{table.status === 'reserved' ? 'Sửa' : 'Đặt'}</span>
                  </button>
                  <button
                    onClick={() => navigate(`/pos?tableId=${table.id}&tableNum=${table.number}`)}
                    className="w-10 h-10 md:flex-1 md:w-auto md:h-auto md:py-4 bg-primary text-white rounded-lg md:rounded-xl shadow-lg shadow-primary-glow flex items-center justify-center hover:bg-slate-900 transition-all active:scale-95"
                  >
                    <LogIn size={16} className="md:w-5 md:h-5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Table button */}
          <button
            onClick={() => setShowAddTableModal(true)}
            className="glass-surface border-2 md:border-4 border-dashed border-slate-200 rounded-xl md:rounded-[2.5rem] p-6 md:p-10 flex flex-col items-center justify-center text-slate-300 hover:text-primary hover:border-primary hover:bg-white group transition-all duration-500"
          >
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-slate-50 flex items-center justify-center mb-2 md:mb-4 group-hover:bg-primary/5 transition-colors">
              <Plus size={20} strokeWidth={3} className="md:w-8 md:h-8 group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wide md:tracking-[0.3em]">Thêm Bàn</span>
          </button>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom duration-500">
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                    <th className="p-6 pl-10">Bàn #</th>
                    <th className="p-6">Sức chứa</th>
                    <th className="p-6">Khu vực</th>
                    <th className="p-6">Trạng thái</th>
                    <th className="p-6 text-right pr-10">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTables.map(table => {
                    const config = getStatusConfig(table.status);
                    return (
                      <tr key={table.id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="p-6 pl-10">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.text} flex items-center justify-center font-black text-sm`}>
                              {table.number}
                            </div>
                            <span className="font-black text-slate-900">Bàn {table.number}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                            <Users size={14} /> {table.capacity} chỗ
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {areas.find(a => a.id === table.areaId)?.name}
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${config.bg} ${config.text}`}>
                              {config.label}
                            </span>
                          </div>
                        </td>
                        <td className="p-6 text-right pr-10">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => setBookingTable(table)}
                              className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm ${table.status === 'reserved'
                                ? 'bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-primary hover:text-white'
                                }`}
                            >
                              {table.status === 'reserved' ? 'Sửa Đặt bàn' : 'Đặt bàn'}
                            </button>
                            <button
                              onClick={() => navigate(`/pos?tableId=${table.id}&tableNum=${table.number}`)}
                              className="p-2.5 bg-primary text-white rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-primary-glow"
                            >
                              <LogIn size={18} />
                            </button>
                            <button
                              onClick={() => setScheduleTable(table)}
                              className="p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                            >
                              <MoreHorizontal size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTables.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <div className="opacity-20 flex flex-col items-center">
                          <LayoutList size={48} className="mb-4" />
                          <p className="font-black text-xs uppercase tracking-widest">Không có dữ liệu bàn</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredTables.map(table => {
              const config = getStatusConfig(table.status);
              return (
                <div key={table.id} className="glass-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.text} flex items-center justify-center font-black text-sm`}>
                        {table.number}
                      </div>
                      <div>
                        <span className="font-black text-sm text-slate-900">Bàn {table.number}</span>
                        <p className="text-[10px] text-slate-400">{table.capacity} chỗ • {areas.find(a => a.id === table.areaId)?.name}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${config.bg} ${config.text}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className="border-t border-slate-100 mt-3 pt-3 flex gap-2">
                    <button
                      onClick={() => setBookingTable(table)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold ${table.status === 'reserved' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'}`}
                    >
                      {table.status === 'reserved' ? 'Sửa Đặt' : 'Đặt bàn'}
                    </button>
                    <button
                      onClick={() => navigate(`/pos?tableId=${table.id}&tableNum=${table.number}`)}
                      className="flex-1 py-2.5 bg-primary text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <LogIn size={14} /> Vào bán
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredTables.length === 0 && (
              <div className="glass-card p-12 text-center opacity-50">
                <LayoutList size={32} className="mx-auto mb-3" />
                <p className="font-bold text-xs">Không có dữ liệu</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {bookingTable && (
        <BookingModal
          table={bookingTable}
          onClose={() => setBookingTable(null)}
          onConfirm={handleConfirmBooking}
        />
      )}

      {scheduleTable && (
        <ReservationScheduleModal
          table={scheduleTable}
          onClose={() => setScheduleTable(null)}
        />
      )}

      {showAddAreaModal && (
        <AddAreaModal
          onClose={() => setShowAddAreaModal(false)}
          onConfirm={handleConfirmAddArea}
        />
      )}

      {showAddTableModal && (
        <AddTableModal
          areaName={selectedArea?.name || ''}
          onClose={() => setShowAddTableModal(false)}
          onConfirm={handleConfirmAddTable}
        />
      )}
    </div>
  );
};

export default Tables;
