
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
  { id: 'E1', name: 'Alex Manager', pin: '1234', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=alex', salary: 5000 },
  { id: 'E2', name: 'Sarah Cashier', pin: '0000', role: 'Cashier', avatar: 'https://i.pravatar.cc/150?u=sarah', salary: 3000 },
];

export const MOCK_BRANCHES: Branch[] = [
  { id: 'B1', name: 'Glass POS HQ', address: '789 Crystal Blvd, Silicon Valley' },
];

export const MOCK_PRINT_GROUPS: PrintGroup[] = [
  { id: 'pg1', name: 'Kitchen' },
  { id: 'pg2', name: 'Bar' },
  { id: 'pg3', name: 'Billing' },
];

export const MOCK_UOMS: UOM[] = [
  { id: 'u1', code: 'pcs', name: 'Pieces', category: 'quantity' },
  { id: 'u2', code: 'cup', name: 'Cup', category: 'volume' },
  { id: 'u3', code: 'kg', name: 'Kilogram', category: 'weight' },
  { id: 'u4', code: 'can', name: 'Can', category: 'quantity' },
  { id: 'u5', code: 'bottle', name: 'Bottle', category: 'volume' },
];

export const MOCK_PRODUCTS: Product[] = [
  // --- Existing Items ---
  { id: 'P01', name: 'Espresso Single', barcode: '100001', type: 'fnb', category: 'Coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 3.5, isDefault: true }], price: 3.5, stock: 999, hasLotTracking: false, status: 'active' },
  { id: 'P02', name: 'Double Latte', barcode: '100002', type: 'fnb', category: 'Coffee', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=400&fit=crop', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 5.5, isDefault: true }], price: 5.5, stock: 999, hasLotTracking: false, status: 'active' },
  { id: 'P03', name: 'Matcha Frappe', barcode: '100003', type: 'fnb', category: 'Tea', image: 'https://images.unsplash.com/photo-1536882247134-56722f78232c?w=400&h=400&fit=crop', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 6.0, isDefault: true }], price: 6.0, stock: 999, hasLotTracking: false, status: 'active' },

  // --- 10 New Demo Items ---
  {
    id: 'P04', name: 'Cappuccino Classic', barcode: '100004', type: 'fnb', category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop',
    baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 4.5, isDefault: true }],
    price: 4.5, stock: 999, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P05', name: 'Caramel Macchiato', barcode: '100005', type: 'fnb', category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510ef81a?w=400&h=400&fit=crop',
    baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 5.8, isDefault: true }],
    price: 5.8, stock: 999, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P06', name: 'Peach Orange Lemongrass Tea', barcode: '100006', type: 'fnb', category: 'Tea',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 5.2, isDefault: true }],
    price: 5.2, stock: 999, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P07', name: 'Lychee Iced Tea', barcode: '100007', type: 'fnb', category: 'Tea',
    image: 'https://images.unsplash.com/photo-1594631252845-29fc458695d7?w=400&h=400&fit=crop',
    baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 4.9, isDefault: true }],
    price: 4.9, stock: 999, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P08', name: 'Butter Croissant', barcode: '100008', type: 'fnb', category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop',
    baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 2.5, isDefault: true }],
    price: 2.5, stock: 45, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P09', name: 'Chocolate Chip Cookie', barcode: '100009', type: 'fnb', category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop',
    baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 1.8, isDefault: true }],
    price: 1.8, stock: 120, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P10', name: 'Classic Tiramisu', barcode: '100010', type: 'fnb', category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop',
    baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 6.5, isDefault: true }],
    price: 6.5, stock: 15, hasLotTracking: false, status: 'active'
  },
  {
    id: 'P11', name: 'Evian Mineral Water', barcode: '200021', type: 'retail', category: 'Retail',
    image: 'https://images.unsplash.com/photo-1616031037011-087000171abe?w=400&h=400&fit=crop',
    baseUOMId: 'u5', units: [{ uomId: 'u5', type: 'base', conversionFactor: 1, price: 2.0, isDefault: true }],
    price: 2.0, stock: 150, hasLotTracking: true, status: 'active'
  },
  {
    id: 'P12', name: 'Whole Milk 1L', barcode: '200022', type: 'retail', category: 'Retail',
    image: 'https://images.unsplash.com/photo-1550583724-1255818c0533?w=400&h=400&fit=crop',
    baseUOMId: 'u5', units: [{ uomId: 'u5', type: 'base', conversionFactor: 1, price: 3.2, isDefault: true }],
    price: 3.2, stock: 60, hasLotTracking: true, status: 'active'
  },
  {
    id: 'P13', name: 'Fast POS Canvas Tote', barcode: '300001', type: 'retail', category: 'Retail',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop',
    baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 12.0, isDefault: true }],
    price: 12.0, stock: 25, hasLotTracking: false, status: 'active'
  },

  { id: 'P20', name: 'Espresso Beans 250g', barcode: '200020', type: 'retail', category: 'Coffee', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', baseUOMId: 'u3', units: [{ uomId: 'u3', type: 'base', conversionFactor: 1, price: 15.0, isDefault: true }], price: 15.0, stock: 30, hasLotTracking: true, status: 'active' },
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
