
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, MapPin, Star, ShoppingBag,
  Scan, UtensilsCrossed, PackageOpen, Truck,
  History, LayoutGrid, List, ChevronRight, X,
  Hash, ArrowRight, AlertCircle, Tag
} from 'lucide-react';
import { useStore } from '../store';
import { Category, Product, CartItem, SelectedAttribute, ServiceType, Discount, DraftOrder, Order, Employee, PaymentMethod, Customer, DebtTransaction } from '../types';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import SplitOrderModal from '../components/SplitOrderModal';
import DraftOrderList from '../components/DraftOrderList';

const categories: (Category | 'Favorites')[] = ['All', 'Favorites', 'Coffee', 'Tea', 'Snacks', 'Desserts'];

const POS: React.FC = () => {
  const {
    products, drafts, addOrder, updateProduct,
    addDraft, deleteDraft, currentUser, customers, updateCustomer,
    branches, favorites, toggleFavorite, showToast
  } = useStore();

  const [searchParams] = useSearchParams();
  const tableId = searchParams.get('tableId');
  const tableNum = searchParams.get('tableNum') || tableId;

  const [activeCategory, setActiveCategory] = useState<Category | 'Favorites'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [serviceType, setServiceType] = useState<ServiceType>(tableId ? 'Dine-in' : 'Take-away');

  const [showDrafts, setShowDrafts] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus search for barcode scanning
    searchInputRef.current?.focus();
  }, []);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  // Barcode logic
  useEffect(() => {
    if (searchQuery.length >= 6) {
      const found = products.find(p => p.barcode === searchQuery);
      if (found) {
        addToCartFinal(found, [], '');
        setSearchQuery('');
      }
    }
  }, [searchQuery, products]);

  const addToCartFinal = (product: Product, attributes: SelectedAttribute[], note: string) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      const uomId = product.units.find(u => u.isDefault)?.uomId || product.baseUOMId;
      return [...prev, {
        ...product,
        quantity: 1,
        selectedAttributes: attributes,
        totalPrice: product.price,
        note,
        selectedUomId: uomId
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const updateItemDiscount = (id: string, discount: Discount | undefined) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, discount } : item));
  };

  const updateItemNote = (id: string, note: string) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, note } : item));
  };

  const saveDraft = () => {
    if (cartItems.length === 0) return;
    const newDraft: DraftOrder = {
      id: `DFT-${Date.now()}`,
      name: tableNum ? `Bàn ${tableNum}` : `Khách lẻ ${new Date().toLocaleTimeString('vi-VN')}`,
      items: [...cartItems],
      tableId: tableId || undefined,
      serviceType,
      createdAt: new Date().toISOString()
    };
    addDraft(newDraft);
    setCartItems([]);
    showToast('Đơn hàng đã được lưu nháp.', 'success');
  };

  const loadDraft = (draft: DraftOrder) => {
    setCartItems(draft.items);
    setServiceType(draft.serviceType);
    deleteDraft(draft.id);
    setShowDrafts(false);
    showToast('Đã tải đơn nháp vào giỏ hàng.', 'info');
  };

  const handleDeleteDraft = (draftId: string) => {
    deleteDraft(draftId);
    showToast('Đã xoá đơn nháp.', 'success');
  };

  const handleCheckout = (orderDiscount: Discount | undefined, surcharge: number, customerId: string | undefined, method: PaymentMethod) => {
    if (cartItems.length === 0) return;

    // 1. Tính toán tài chính
    const subtotal = cartItems.reduce((acc, item) => {
      let price = item.totalPrice * item.quantity;
      if (item.discount) {
        price -= item.discount.type === 'percentage'
          ? (price * item.discount.value) / 100
          : item.discount.value;
      }
      return acc + price;
    }, 0);

    const discountAmount = orderDiscount
      ? (orderDiscount.type === 'percentage' ? (subtotal * orderDiscount.value) / 100 : orderDiscount.value)
      : 0;

    const tax = (subtotal - discountAmount) * 0.1;
    const total = subtotal - discountAmount + tax + surcharge;

    // 2. Lấy thông tin người tạo (User hiện tại)
    // const savedUser = localStorage.getItem('fastpos_session_user'); // Removed, now from store
    // const currentUser: Employee | null = savedUser ? JSON.parse(savedUser) : null; // Removed, now from store

    // 3. Tạo đối tượng Order
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      branchId: branches[0]?.id || 'B1',
      items: [...cartItems],
      subtotal,
      discountAmount,
      tax,
      surcharge,
      total,
      date: new Date().toISOString(),
      status: 'completed',
      paymentMethod: method,
      serviceType,
      tableId: tableId || undefined,
      customerId: customerId,
      createdBy: currentUser?.name || 'Hệ thống',
      voucherCode: undefined
    };

    // 4. Lưu vào lịch sử đơn hàng
    addOrder(newOrder);

    // 5. Cập nhật Công nợ nếu phương thức là Credit
    if (method === 'Credit' && customerId) {
      // const savedCustomers = localStorage.getItem('fastpos_customers'); // Removed, now from store
      // let customers: Customer[] = savedCustomers ? JSON.parse(savedCustomers) : MOCK_CUSTOMERS; // Removed, now from store

      const customerIdx = customers.findIndex(c => c.id === customerId);
      if (customerIdx > -1) {
        const newTransaction: DebtTransaction = {
          id: `DBT-${newOrder.id}`,
          date: newOrder.date,
          type: 'credit',
          amount: total,
          reference: newOrder.id
        };

        updateCustomer(customerId, {
          balance: customers[customerIdx].balance - total,
          debtHistory: [newTransaction, ...(customers[customerIdx].debtHistory || [])]
        });
      }
    }

    // 6. Cập nhật Stock
    // const savedInventory = localStorage.getItem('fastpos_inventory'); // Removed, now from store
    // if (savedInventory) { // Removed, now from store
    //   let inventory: Product[] = JSON.parse(savedInventory); // Removed, now from store
    cartItems.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product && product.type !== 'service') {
        updateProduct(item.id, { stock: Math.max(0, product.stock - item.quantity) });
      }
    });
    //   localStorage.setItem('fastpos_inventory', JSON.stringify(inventory)); // Removed, now from store
    // }

    // 7. Xóa giỏ hàng và thông báo
    showToast(`Thanh toán thành công qua ${method}! Tổng cộng: $${total.toFixed(2)}.`, 'success');
    setCartItems([]);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (p.status !== 'active') return false;
      const matchesCat = activeCategory === 'All' ? true : activeCategory === 'Favorites' ? favorites.includes(p.id) : p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.barcode && p.barcode.includes(searchQuery));
      return matchesCat && matchesSearch;
    });
  }, [products, activeCategory, searchQuery, favorites]);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-transparent overflow-hidden">
      {/* Product Main Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden lg:pr-[420px]">
        <header className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase mb-2 tracking-[0.2em]">
                  <MapPin size={12} className="text-primary" /> Point of Sale
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Terminal 01</h1>
              </div>

              <div className="bg-white/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/60 flex items-center shadow-lg ml-6">
                <button
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-xl shadow-primary-glow' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  title="List View"
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-xl shadow-primary-glow' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full max-sm:max-w-none max-w-sm">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Scan or lookup product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/50 backdrop-blur-xl border-white/80 border-2 rounded-2xl pl-14 pr-14 py-4 text-sm focus:bg-white focus:border-primary outline-none transition-all shadow-xl font-bold placeholder:font-medium"
                />
                <Scan size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-primary opacity-40" />
              </div>
              <button
                onClick={() => setShowDrafts(true)}
                className="p-4 bg-white/50 backdrop-blur-xl rounded-2xl border-2 border-white/80 text-slate-600 hover:bg-white hover:border-primary transition-all relative group shadow-xl"
              >
                <History size={22} strokeWidth={2} />
                {drafts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-black animate-bounce shadow-lg">
                    {drafts.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2 bg-white/40 backdrop-blur-xl p-2 rounded-[1.5rem] border border-white/60 shadow-lg">
              <button
                onClick={() => setServiceType('Dine-in')}
                className={`px-6 py-3 rounded-xl text-[11px] font-bold uppercase transition-all flex items-center gap-3 ${serviceType === 'Dine-in' ? 'bg-primary text-white shadow-xl shadow-primary-glow' : 'text-slate-500 hover:bg-white/60'}`}
              >
                <UtensilsCrossed size={14} /> At Table
              </button>
              <button
                onClick={() => setServiceType('Take-away')}
                className={`px-6 py-3 rounded-xl text-[11px] font-bold uppercase transition-all flex items-center gap-3 ${serviceType === 'Take-away' ? 'bg-primary text-white shadow-xl shadow-primary-glow' : 'text-slate-500 hover:bg-white/60'}`}
              >
                <PackageOpen size={14} /> Takeaway
              </button>
              <button
                onClick={() => setServiceType('Delivery')}
                className={`px-6 py-3 rounded-xl text-[11px] font-bold uppercase transition-all flex items-center gap-3 ${serviceType === 'Delivery' ? 'bg-primary text-white shadow-xl shadow-primary-glow' : 'text-slate-500 hover:bg-white/60'}`}
              >
                <Truck size={14} /> Delivery
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-2xl font-bold text-[11px] uppercase whitespace-nowrap transition-all border-2 ${activeCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105'
                    : 'bg-white/50 backdrop-blur-md text-slate-500 border-white/60 hover:bg-white hover:border-slate-300'
                    }`}
                >
                  {cat === 'Favorites' && <Star size={14} fill="currentColor" className="inline mr-2 mb-0.5" />}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6">
          {viewMode === 'grid' ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard
                    product={product}
                    onAdd={(p) => addToCartFinal(p, [], '')}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={(id) => toggleFavorite(id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-12 px-8 py-4 bg-slate-900/5 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border border-slate-900/5">
                <div className="col-span-5">Product Name</div>
                <div className="col-span-3">SKU / Barcode</div>
                <div className="col-span-2 text-center">Stock</div>
                <div className="col-span-2 text-right">Price</div>
              </div>
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCartFinal(product, [], '')}
                  className="w-full grid grid-cols-12 items-center px-8 py-5 bg-white/40 hover:bg-white border border-white/60 rounded-2xl transition-all group animate-fade-in shadow-sm hover:shadow-xl hover:scale-[1.01]"
                >
                  <div className="col-span-5 text-left">
                    <p className="font-extrabold text-slate-800 text-sm group-hover:text-primary transition-colors">{product.name}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{product.category}</p>
                  </div>
                  <div className="col-span-3 text-left">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/50 px-3 py-1 rounded-lg border border-slate-300/30">{product.barcode || 'N/A'}</span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className={`text-[12px] font-black ${product.stock < 10 ? 'text-orange-500' : 'text-slate-600'}`}>{product.stock}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="font-black text-primary text-base">${product.price.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-300">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p className="font-bold text-sm uppercase tracking-widest">No matched products</p>
            </div>
          )}
        </div>
      </div>

      <CartSidebar
        items={cartItems}
        serviceType={serviceType}
        tableNumber={tableNum || undefined}
        onUpdateQuantity={updateQuantity}
        onUpdateItemDiscount={updateItemDiscount}
        onUpdateItemNote={updateItemNote}
        onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
        onCheckout={handleCheckout}
        onSaveDraft={saveDraft}
        onSplitOrder={() => setShowSplitModal(true)}
      />

      {showDrafts && (
        <DraftOrderList
          drafts={drafts}
          onClose={() => setShowDrafts(false)}
          onResume={loadDraft}
          onDelete={handleDeleteDraft}
        />
      )}

      {showSplitModal && (
        <SplitOrderModal
          items={cartItems}
          onClose={() => setShowSplitModal(false)}
          onConfirm={(main, sub) => {
            setCartItems(main);
            const newDraft: DraftOrder = {
              id: `SPLIT-${Date.now()}`,
              name: `Tách từ Bàn ${tableNum || 'N/A'}`,
              items: sub,
              serviceType,
              createdAt: new Date().toISOString()
            };
            addDraft(newDraft);
            setShowSplitModal(false);
            showToast('Đã tách đơn và lưu vào đơn nháp.', 'success');
          }}
        />
      )}
    </div>
  );
};

export default POS;
