
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CartItem, ServiceType, Discount, Surcharge, Customer, PaymentMethod } from '../types';
import {
  Trash2, Plus, Minus, CreditCard, ChevronRight, ShoppingBag,
  Save, Scissors, Tag, Percent, PlusCircle, StickyNote, UserPlus, X, Search, User, ArrowLeft
} from 'lucide-react';
import { useStore } from '../store';
import DiscountModal from './DiscountModal';
import NoteModal from './NoteModal';
import PaymentModal from './PaymentModal';
import { formatCurrency } from '../utils/formatters';

interface CartSidebarProps {
  items: CartItem[];
  serviceType: ServiceType;
  tableNumber?: string;
  onUpdateQuantity: (id: string, delta: number) => void;
  onUpdateItemDiscount: (id: string, discount: Discount | undefined) => void;
  onUpdateItemNote: (id: string, note: string) => void;
  onRemove: (id: string) => void;
  onCheckout: (orderDiscount: Discount | undefined, surcharge: number, customerId: string | undefined, paymentMethod: PaymentMethod) => void;
  onSaveDraft: () => void;
  onSplitOrder: () => void;
  isMobileSheet?: boolean;
  onProceedToCheckout?: () => void;  // For mobile: open separate payment sheet
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  items, serviceType, tableNumber,
  onUpdateQuantity, onUpdateItemDiscount, onUpdateItemNote, onRemove, onCheckout, onSaveDraft, onSplitOrder,
  isMobileSheet = false,
  onProceedToCheckout
}) => {
  const { t } = useTranslation();
  const { customers, enterpriseConfig } = useStore();
  const [orderDiscount, setOrderDiscount] = useState<Discount | undefined>(undefined);
  const [surcharge, setSurcharge] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [showOrderDiscountModal, setShowOrderDiscountModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isCheckoutExpanded, setIsCheckoutExpanded] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  const [activeDiscountItem, setActiveDiscountItem] = useState<CartItem | null>(null);
  const [activeNoteItem, setActiveNoteItem] = useState<CartItem | null>(null);

  const subtotal = items.reduce((acc, item) => {
    let price = item.totalPrice * item.quantity;
    if (item.discount) {
      price -= item.discount.type === 'percentage'
        ? (price * item.discount.value) / 100
        : item.discount.value;
    }
    return acc + price;
  }, 0);

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  const discountValue = orderDiscount
    ? (orderDiscount.type === 'percentage' ? (subtotal * orderDiscount.value) / 100 : orderDiscount.value)
    : 0;

  const tax = (subtotal - discountValue) * 0.1;
  const total = subtotal - discountValue + tax + surcharge;

  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return [];
    return customers.filter(c =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
    );
  }, [customerSearch, customers]);

  const handleFinalConfirmPayment = (method: PaymentMethod) => {
    onCheckout(orderDiscount, surcharge, selectedCustomer?.id, method);
    setIsCheckoutExpanded(false);
    setSelectedCustomer(null);
    setOrderDiscount(undefined);
    setSurcharge(0);
  };

  return (
    <>
      {/* Backdrop Overlay when expanded - Only on Desktop */}
      {isCheckoutExpanded && !isMobileSheet && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[105] animate-in fade-in duration-300"
          onClick={() => setIsCheckoutExpanded(false)}
        />
      )
      }

      <div className={`
        ${isMobileSheet
          ? 'flex flex-col h-full'
          : `glass-surface fixed right-3 top-[6.5rem] bottom-3 flex z-[110] transition-all duration-500 ease-in-out overflow-hidden rounded-[1.5rem] ${isCheckoutExpanded ? 'w-[calc(100vw-3rem)] lg:w-[1200px]' : 'w-full lg:w-[420px]'}`
        }
      `}>

        {/* Left Side: Order Details */}
        <div className={`flex flex-col h-full border-r border-slate-100 transition-all duration-500 shrink-0 ${isCheckoutExpanded ? 'w-[320px]' : 'w-full'}`}>
          {/* Header */}
          <div className="p-6 border-b border-white/40 bg-white/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{t('cart.title')}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${serviceType === 'Dine-in' ? 'bg-primary/20 text-primary' :
                    serviceType === 'Take-away' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                    {serviceType === 'Dine-in' ? t('pos.at_table') : serviceType === 'Take-away' ? t('pos.takeaway') : t('pos.delivery')}
                  </span>
                  {tableNumber && (
                    <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      T-{tableNumber}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={onSaveDraft} className="p-3 bg-white/40 hover:bg-white text-slate-600 rounded-xl transition-all border border-white/60 shadow-sm" title={t('cart.save_draft')}>
                  <Save size={18} />
                </button>
                <button onClick={onSplitOrder} className="p-3 bg-white/40 hover:bg-white text-slate-600 rounded-xl transition-all border border-white/60 shadow-sm" title={t('cart.split_order')}>
                  <Scissors size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Customer Selector */}
          <div className="px-6 py-4 bg-slate-50/50 border-b border-white/60">
            {!selectedCustomer ? (
              <button
                onClick={() => setShowCustomerModal(true)}
                className="w-full py-3 bg-white border border-dashed border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-[#0062FF] hover:text-[#0062FF] transition-all shadow-sm"
              >
                <UserPlus size={14} /> {t('cart.add_customer')}
              </button>
            ) : (
              <div className="bg-white p-3 rounded-2xl border border-[#0062FF]/20 flex items-center justify-between shadow-sm animate-pop-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">{selectedCustomer.name}</span>
                    <span className="text-[9px] font-medium text-slate-400">{selectedCustomer.phone}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                <ShoppingBag size={48} className="mb-4" />
                <p className="font-black text-xs uppercase tracking-[0.2em]">{t('cart.empty')}</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="p-3 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm animate-fade-in group">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-inner bg-slate-100">
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800 text-[11px] truncate uppercase tracking-tight">{item.name}</h4>
                        <button onClick={() => onRemove(item.id)} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white/80 rounded-lg p-0.5 border border-slate-100">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:text-primary active:scale-75 transition-all"><Minus size={10} /></button>
                          <span className="mx-2 text-[10px] font-bold text-slate-700 w-4 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:text-primary active:scale-75 transition-all"><Plus size={10} /></button>
                        </div>
                        <p className="text-primary font-bold text-xs">
                          {formatCurrency(((item.totalPrice * item.quantity) - (item.discount ? (item.discount.type === 'percentage' ? (item.totalPrice * item.quantity * item.discount.value / 100) : item.discount.value) : 0)), enterpriseConfig.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="p-6 bg-white border-t border-slate-100 rounded-t-[2rem] shadow-2xl space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span>{t('cart.total_items')}</span>
                <span className="text-slate-800 font-black">{t('cart.items_count', { count: totalQuantity })}</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <span>{t('cart.subtotal')}</span>
                <span className="text-slate-800 font-black">{formatCurrency(subtotal, enterpriseConfig.currency)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100 mt-1">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">{t('cart.total_due')}</span>
                <span className="text-2xl font-extrabold text-primary tracking-tighter">{formatCurrency(total, enterpriseConfig.currency)}</span>
              </div>
            </div>

            {!isCheckoutExpanded ? (
              <button
                onClick={() => {
                  // In mobile sheet mode, call external handler to open payment sheet
                  if (isMobileSheet && onProceedToCheckout) {
                    onProceedToCheckout();
                  } else {
                    setIsCheckoutExpanded(true);
                  }
                }}
                disabled={items.length === 0}
                className="ui-button-primary w-full py-4 text-[10px] flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest group"
              >
                <CreditCard size={18} />
                {t('cart.checkout')}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="py-4 text-center border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/30">
                <p className="text-[10px] font-bold text-primary animate-pulse uppercase tracking-widest">{t('cart.processing')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Expanded Payment Interface */}
        {isCheckoutExpanded && (
          <div className="flex-1 bg-white animate-in slide-in-from-right duration-500 overflow-hidden flex flex-col min-w-0">
            <PaymentModal
              total={total}
              subtotal={subtotal}
              tax={tax}
              discountAmount={discountValue}
              surcharge={surcharge}
              items={items}
              customer={selectedCustomer}
              onClose={() => setIsCheckoutExpanded(false)}
              onConfirm={handleFinalConfirmPayment}
              embedded={true}
            />
          </div>
        )}
      </div>

      {/* Helper Modals */}
      {
        showOrderDiscountModal && (
          <DiscountModal
            title="Order Discount"
            initialDiscount={orderDiscount}
            onClose={() => setShowOrderDiscountModal(false)}
            onConfirm={(d) => { setOrderDiscount(d); setShowOrderDiscountModal(false); }}
          />
        )
      }

      {
        activeDiscountItem && (
          <DiscountModal
            title={`Discount: ${activeDiscountItem.name}`}
            initialDiscount={activeDiscountItem.discount}
            onClose={() => setActiveDiscountItem(null)}
            onConfirm={(d) => { onUpdateItemDiscount(activeDiscountItem.id, d); setActiveDiscountItem(null); }}
          />
        )
      }

      {
        activeNoteItem && (
          <NoteModal
            initialNote={activeNoteItem.note}
            onClose={() => setActiveNoteItem(null)}
            onConfirm={(note) => { onUpdateItemNote(activeNoteItem.id, note); setActiveNoteItem(null); }}
          />
        )
      }

      {/* Customer Selector Modal */}
      {
        showCustomerModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900">{t('cart.search_customer')}</h2>
                <button onClick={() => setShowCustomerModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    autoFocus
                    type="text"
                    placeholder={t('cart.customer_placeholder')}
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full bg-slate-50 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold text-[var(--primary-700)] outline-none border-2 border-transparent focus:border-[#0062FF] transition-all"
                  />
                </div>

                <div className="max-h-[40vh] overflow-y-auto custom-scrollbar space-y-3">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map(cust => (
                      <button
                        key={cust.id}
                        onClick={() => {
                          setSelectedCustomer(cust);
                          setShowCustomerModal(false);
                          setCustomerSearch('');
                        }}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:border-[#0062FF] hover:bg-blue-50/20 transition-all text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[var(--primary-700)] font-black">
                            {cust.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm">{cust.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cust.phone}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-300" />
                      </button>
                    ))
                  ) : (
                    <div className="py-12 text-center opacity-30 italic text-xs font-black uppercase tracking-widest flex flex-col items-center">
                      <User size={32} className="mb-2" />
                      {customerSearch ? t('cart.no_customer') : t('cart.search_to_start')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default CartSidebar;
