
import React, { useState, useMemo } from 'react';
import { X, Calendar, Users, Clock, Search, ChevronRight, User, Check, Trash2, ShoppingBag, Plus, Minus, ChevronLeft, ArrowRight, AlertCircle, Timer as TimerIcon } from 'lucide-react';
import { Table, Customer, Reservation, Product, CartItem } from '../types';
import { MOCK_CUSTOMERS, MOCK_PRODUCTS } from '../constants';
import { useStore } from '../store';
import { formatCurrency } from '../utils/formatters';

interface BookingModalProps {
  table: Table;
  onClose: () => void;
  onConfirm: (reservation: Reservation) => void;
}

type BookingStep = 'customer' | 'menu' | 'details';

const BookingModal: React.FC<BookingModalProps> = ({ table, onClose, onConfirm }) => {
  const { enterpriseConfig } = useStore();
  const [step, setStep] = useState<BookingStep>('customer');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [guests, setGuests] = useState(table.capacity);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [duration, setDuration] = useState(120);
  const [notes, setNotes] = useState('');

  const [preOrderItems, setPreOrderItems] = useState<CartItem[]>([]);
  const [menuSearch, setMenuSearch] = useState('');

  const existingBookings = table.allReservations || [];

  const isTimeConflict = useMemo(() => {
    const startMinutes = (timeString: string) => {
      const [h, m] = timeString.split(':').map(Number);
      return h * 60 + m;
    };

    const newStart = startMinutes(time);
    const newEnd = newStart + duration;

    return existingBookings.some(b => {
      if (b.date !== date) return false;
      const bStart = startMinutes(b.startTime);
      const bEnd = bStart + b.duration;
      return (newStart < bEnd && newEnd > bStart);
    });
  }, [date, time, duration, existingBookings]);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return [];
    return MOCK_CUSTOMERS.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
    );
  }, [searchTerm]);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(menuSearch.toLowerCase())
    );
  }, [menuSearch]);

  const toggleItem = (product: Product, delta: number) => {
    setPreOrderItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQty = Math.max(0, existing.quantity + delta);
        if (newQty === 0) return prev.filter(item => item.id !== product.id);
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQty } : item);
      }
      if (delta > 0) {
        const selectedUomId = product.units.find(u => u.isDefault)?.uomId || product.baseUOMId;
        return [...prev, { ...product, quantity: 1, selectedAttributes: [], totalPrice: product.price, selectedUomId }];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    if (!selectedCustomer) return;

    const reservation: Reservation = {
      id: `RES-${Date.now()}`,
      tableId: table.id,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      date: date,
      startTime: time,
      duration: duration,
      guests: guests,
      notes: notes,
      status: 'confirmed',
      preOrderItems: preOrderItems.length > 0 ? preOrderItems : undefined
    };

    onConfirm(reservation);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[var(--primary-700)]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col h-[85vh]">
        <div className="p-8 border-b border-gray-50 bg-white relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-black text-[var(--primary-700)]">Đặt bàn số {table.number}</h2>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
                {step === 'customer' ? 'Thông tin khách' : step === 'menu' ? 'Menu đặt trước' : 'Thời gian & Ghi chú'}
              </p>
            </div>
            <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all rounded-full">
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4 px-10">
            {(['customer', 'menu', 'details'] as BookingStep[]).map((s, idx) => (
              <React.Fragment key={s}>
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === s ? 'bg-[var(--primary-600)] scale-125' : idx < ['customer', 'menu', 'details'].indexOf(step) ? 'bg-green-400' : 'bg-gray-200'
                  }`} />
                {idx < 2 && <div className="w-8 h-0.5 bg-gray-100" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {step === 'customer' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-300">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search guest by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2rem] text-lg font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[var(--primary-600)] transition-all"
                />
              </div>

              <div className="space-y-3">
                {filteredCustomers.map(cust => (
                  <button
                    key={cust.id}
                    onClick={() => { setSelectedCustomer(cust); setStep('menu'); }}
                    className="w-full flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[2.5rem] hover:border-[var(--primary-600)] hover:bg-blue-50/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[var(--primary-700)] font-black">{cust.name.charAt(0)}</div>
                      <div className="text-left">
                        <p className="font-black text-[var(--primary-700)] text-lg">{cust.name}</p>
                        <p className="text-xs font-bold text-gray-400">{cust.phone}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-[var(--primary-600)] transition-colors" />
                  </button>
                ))}
                {searchTerm && filteredCustomers.length === 0 && (
                  <div className="py-12 text-center opacity-30">
                    <User size={48} className="mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">No guest found. Add new guest?</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'menu' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full bg-gray-50 pl-14 pr-6 py-4 rounded-[1.5rem] text-sm font-bold text-[var(--primary-700)] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {filteredProducts.slice(0, 4).map(product => {
                  const inCart = preOrderItems.find(i => i.id === product.id);
                  return (
                    <div key={product.id} className="p-4 bg-gray-50 rounded-3xl flex items-center gap-4">
                      <img src={product.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-[var(--primary-700)] truncate">{product.name}</p>
                        <p className="text-[10px] font-bold text-[var(--primary-600)]">{formatCurrency(product.price, enterpriseConfig.currency)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {inCart ? (
                          <>
                            <button onClick={() => toggleItem(product, -1)} className="p-1 bg-white rounded-lg"><Minus size={10} /></button>
                            <span className="text-[10px] font-black">{inCart.quantity}</span>
                            <button onClick={() => toggleItem(product, 1)} className="p-1 bg-white rounded-lg"><Plus size={10} /></button>
                          </>
                        ) : (
                          <button onClick={() => toggleItem(product, 1)} className="p-1.5 bg-white text-[var(--primary-600)] rounded-lg shadow-sm"><Plus size={14} /></button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {preOrderItems.length > 0 && (
                <div className="p-6 bg-[var(--primary-700)] rounded-[2rem] text-white">
                  <div className="flex items-center gap-2 mb-4 opacity-60"><ShoppingBag size={14} /><span className="text-[10px] font-black uppercase tracking-widest">Pre-order List</span></div>
                  <div className="space-y-2">
                    {preOrderItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-xs font-bold">{item.quantity}x {item.name}</span>
                        <span className="text-xs font-black">{formatCurrency(item.totalPrice * item.quantity, enterpriseConfig.currency)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-8 animate-in zoom-in duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Ngày đặt</label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--primary-600)]" size={20} />
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2rem] text-lg font-black text-[var(--primary-700)] outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Giờ bắt đầu</label>
                  <div className="relative">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--primary-600)]" size={20} />
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2rem] text-xl font-black text-[var(--primary-700)] outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Số khách</label>
                  <div className="relative">
                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--primary-600)]" size={20} />
                    <input type="number" value={guests} onChange={(e) => setGuests(parseInt(e.target.value))} className="w-full bg-gray-50 pl-16 pr-6 py-6 rounded-[2rem] text-xl font-black text-[var(--primary-700)] outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Thời gian (Phút)</label>
                  <div className="flex gap-2">
                    {[60, 120, 180].map(m => (
                      <button key={m} onClick={() => setDuration(m)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] transition-all ${duration === m ? 'bg-[var(--primary-700)] text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>{m}m</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Ghi chú</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Yêu cầu đặc biệt..." className="w-full bg-gray-50 p-6 rounded-[2.5rem] text-sm font-bold text-[var(--primary-700)] outline-none resize-none" rows={3} />
              </div>

              {isTimeConflict && (
                <div className="p-5 bg-red-50 text-red-500 rounded-3xl flex gap-4 border border-red-100 animate-pulse">
                  <AlertCircle size={24} />
                  <p className="text-xs font-black leading-relaxed uppercase">Lỗi: Bàn đã có lịch đặt trong khung giờ này!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-8 bg-[#F4F6FF]/50 border-t border-gray-50 flex gap-4">
          {step !== 'customer' && (
            <button onClick={() => setStep(step === 'details' ? 'menu' : 'customer')} className="p-6 bg-white border border-gray-200 text-[var(--primary-700)] rounded-[2rem] hover:bg-gray-50 transition-all"><ChevronLeft /></button>
          )}
          <button
            onClick={step === 'details' ? handleConfirm : () => setStep(step === 'customer' ? 'menu' : 'details')}
            disabled={!selectedCustomer || (step === 'details' && isTimeConflict)}
            className="flex-1 bg-[var(--primary-600)] text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary-200 hover:bg-[var(--primary-700)] transition-all disabled:opacity-50"
          >
            {step === 'details' ? <Check size={24} strokeWidth={3} /> : <ArrowRight size={24} strokeWidth={3} />}
            {step === 'details' ? 'Xác nhận Đặt bàn' : 'Tiếp tục'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
