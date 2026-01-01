
import { Product, Table, Customer, Area, UOM, Branch, PrintGroup, Employee, Voucher, Supplier, LoyaltyConfig, PromotionRule } from './types';

export const COLORS = {
  main: '#0062FF',
  secondary: '#1E293B',
  auxiliar: '#F8FAFC',
};

export const MOCK_LOYALTY: LoyaltyConfig = {
  earningRate: 1,
  redemptionRate: 100,
  tiers: [
    { name: 'Bronze', threshold: 0, discount: 0 },
    { name: 'Silver', threshold: 500, discount: 2 },
    { name: 'Gold', threshold: 2000, discount: 5 },
    { name: 'Platinum', threshold: 5000, discount: 10 },
  ]
};

export const MOCK_PROMOTIONS: PromotionRule[] = [
  {
    id: 'PRM-001',
    name: 'Happy Hour Coffee',
    type: 'percentage',
    value: 20,
    applyTo: 'category',
    targetId: 'Coffee',
    schedule: {
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      daysOfWeek: [1, 2, 3, 4, 5],
      happyHour: { start: '14:00', end: '16:00' }
    },
    isActive: true
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'E1', name: 'Alex Manager', pin: '1234', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=alex', salary: 25000000 },
  { id: 'E2', name: 'Sarah Cashier', pin: '0000', role: 'Cashier', avatar: 'https://i.pravatar.cc/150?u=sarah', salary: 12000000 },
];

export const MOCK_BRANCHES: Branch[] = [
  { id: 'B1', name: 'Fast POS Vietnam HQ', address: '789 Đường Lê Lợi, Quận 1, TP. HCM' },
];

export const MOCK_PRINT_GROUPS: PrintGroup[] = [
  { id: 'pg1', name: 'Kitchen' },
  { id: 'pg2', name: 'Bar' },
  { id: 'pg3', name: 'Billing' },
];

export const MOCK_UOMS: UOM[] = [
  { id: 'u1', code: 'pcs', name: 'Cái', category: 'quantity' },
  { id: 'u2', code: 'cup', name: 'Ly', category: 'volume' },
  { id: 'u3', code: 'kg', name: 'Kilogram', category: 'weight' },
  { id: 'u4', code: 'can', name: 'Lon', category: 'quantity' },
  { id: 'u5', code: 'bottle', name: 'Chai', category: 'volume' },
];

export const MOCK_PRODUCTS: Product[] = [
  // --- Existing Items ---
  { id: 'P01', name: 'Espresso Single', barcode: '100001', type: 'fnb', category: 'Coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 35000, isDefault: true }], price: 35000, stock: 999, hasLotTracking: false, status: 'active' },
  { id: 'P02', name: 'Double Latte', barcode: '100002', type: 'fnb', category: 'Coffee', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=400&fit=crop', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 55000, isDefault: true }], price: 55000, stock: 999, hasLotTracking: false, status: 'active' },
  { id: 'P03', name: 'Matcha Frappe', barcode: '100003', type: 'fnb', category: 'Tea', image: 'https://images.unsplash.com/photo-1536882247134-56722f78232c?w=400&h=400&fit=crop', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 60000, isDefault: true }], price: 60000, stock: 999, hasLotTracking: false, status: 'active' },

  // --- 10 New Demo Items ---
  {
    id: 'P04', name: 'Cappuccino Classic', barcode: '100004', type: 'fnb', category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
    baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 45000, isDefault: true }],
    price: 45000, stock: 999, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P05', name: 'Caramel Macchiato', barcode: '100005', type: 'fnb', category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510ef81a?w=400&h=400&fit=crop',
    baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 58000, isDefault: true }],
    price: 58000, stock: 999, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P06', name: 'Trà Đào Cam Sả', barcode: '100006', type: 'fnb', category: 'Tea',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 52000, isDefault: true }],
    price: 52000, stock: 999, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P07', name: 'Trà Vải Lạnh', barcode: '100007', type: 'fnb', category: 'Tea',
    image: 'https://images.unsplash.com/photo-1594631252845-29fc458695d7?w=400&h=400&fit=crop',
    baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 49000, isDefault: true }],
    price: 49000, stock: 999, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P08', name: 'Bánh Sừng Bò', barcode: '100008', type: 'fnb', category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop',
    baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 25000, isDefault: true }],
    price: 25000, stock: 45, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P09', name: 'Bánh Cookie Socola', barcode: '100009', type: 'fnb', category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
    baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 18000, isDefault: true }],
    price: 18000, stock: 120, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P10', name: 'Tiramisu Truyền Thống', barcode: '100010', type: 'fnb', category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop',
    baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 65000, isDefault: true }],
    price: 65000, stock: 15, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P11', name: 'Nước Khoáng Evian', barcode: '200021', type: 'retail', category: 'Retail',
    image: 'https://images.unsplash.com/photo-1616031037011-087000171abe?w=400&h=400&fit=crop',
    baseUOMId: 'u5', units: [{ uomId: 'u5', type: 'base', conversionFactor: 1, price: 20000, isDefault: true }],
    price: 20000, stock: 150, hasLotTracking: true, status: 'active'
  },
  {
    id: 'P12', name: 'Sữa Tươi Tiệt Trùng 1L', barcode: '200022', type: 'retail', category: 'Retail',
    image: 'https://images.unsplash.com/photo-1550583724-1255818c0533?w=400&h=400&fit=crop',
    baseUOMId: 'u5', units: [{ uomId: 'u5', type: 'base', conversionFactor: 1, price: 32000, isDefault: true }],
    price: 32000, stock: 60, hasLotTracking: true, status: 'active'
  },
  {
    id: 'P13', name: 'Túi Vải Fast POS', barcode: '300001', type: 'retail', category: 'Retail',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop',
    baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 120000, isDefault: true }],
    price: 120000, stock: 25, hasLotTracking: false, status: 'active'
  },

  { id: 'P20', name: 'Hạt Cà Phê Espresso 250g', barcode: '200020', type: 'retail', category: 'Coffee', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', baseUOMId: 'u3', units: [{ uomId: 'u3', type: 'base', conversionFactor: 1, price: 150000, isDefault: true }], price: 150000, stock: 30, hasLotTracking: true, status: 'active' },
];

export const MOCK_AREAS: Area[] = [
  { id: 'A1', name: 'Ground Floor' },
  { id: 'A2', name: 'Rooftop' },
];

export const MOCK_TABLES: Table[] = [
  { id: 'T1', number: '01', areaId: 'A1', status: 'available', capacity: 2 },
  { id: 'T2', number: '02', areaId: 'A1', status: 'available', capacity: 4 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C1', name: 'Hoàng Trần', phone: '0901234567', type: 'VIP', tier: 'Gold', balance: 0, points: 1500 },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'S1', name: 'Coffee Farm Direct', code: 'SUP-001', contact: 'Nguyen Van A', phone: '0123456789', email: 'farm@direct.com', rating: 5, category: 'Raw Materials' },
];
