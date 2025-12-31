
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
      case 'available': return { color: '#2ECC71', text: 'text-emerald-500', label: 'AVAILABLE', bg: 'bg-emerald-50', icon: CheckCircle };
      case 'occupied': return { color: '#F57255', text: 'text-primary', label: 'OCCUPIED', bg: 'bg-primary/10', icon: Clock };
      default: return { color: '#F1C40F', text: 'text-amber-500', label: 'RESERVED', bg: 'bg-amber-50', icon: Calendar };
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
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Tables & Areas</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Manage floor plan and table status</p>
        </div>

        <div className="bg-white/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/60 flex items-center shadow-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-xl shadow-primary-glow scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-xl shadow-primary-glow scale-105' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutList size={20} />
          </button>
        </div>
      </header>

      {/* Area Selector */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-2 p-2 bg-white/40 backdrop-blur-xl rounded-[1.5rem] border border-white/60 shadow-lg">
          {areas.map(area => (
            <button
              key={area.id}
              onClick={() => setSelectedAreaId(area.id)}
              className={`px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider whitespace-nowrap transition-all ${selectedAreaId === area.id
                ? 'bg-primary text-white shadow-xl shadow-primary-glow scale-105'
                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                }`}
            >
              {area.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddAreaModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider bg-white/40 backdrop-blur-xl border border-dashed border-slate-300 text-slate-400 hover:border-primary hover:text-primary transition-all whitespace-nowrap shadow-sm"
        >
          <Plus size={14} strokeWidth={3} />
          Add Area
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTables.map(table => {
            const config = getStatusConfig(table.status);
            return (
              <div
                key={table.id}
                className="glass-card p-8 group relative animate-fade-in hover:scale-[1.02]"
              >
                <div className="absolute top-6 right-8 flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: config.color }} />
                    <span className={`text-[8px] font-black uppercase tracking-widest ${config.text}`}>{config.label}</span>
                  </div>
                  <button
                    onClick={() => setScheduleTable(table)}
                    className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center mb-8">
                  <div className={`w-20 h-20 rounded-[1.8rem] ${config.bg} ${config.text} flex items-center justify-center mb-5 border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                    <config.icon size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-800 mb-1 tracking-tight">Table {table.number}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{table.capacity} SEATS</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setBookingTable(table)}
                    className={`flex-[2] py-4 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all ${table.status === 'reserved'
                      ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                      : 'bg-white/60 hover:bg-white text-slate-600 border border-slate-100'
                      }`}
                  >
                    {table.status === 'reserved' ? 'Edit Booking' : 'Reserve'}
                  </button>
                  <button
                    onClick={() => navigate(`/pos?tableId=${table.id}&tableNum=${table.number}`)}
                    className="flex-1 bg-primary text-white rounded-xl shadow-lg shadow-primary-glow flex items-center justify-center hover:bg-slate-900 transition-all scale-105 active:scale-95"
                  >
                    <LogIn size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setShowAddTableModal(true)}
            className="glass-surface border-4 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-slate-300 hover:text-primary hover:border-primary hover:bg-white group transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
              <Plus size={32} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Add New Table</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-500">
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
                            {table.status === 'reserved' ? 'Edit Booking' : 'Reserve'}
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
