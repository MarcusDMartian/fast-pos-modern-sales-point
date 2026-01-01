
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
    { name: 'Hạng Đồng', threshold: 0, discount: 0, birthdayDiscount: 5 },
    { name: 'Hạng Bạc', threshold: 5000, discount: 2, birthdayDiscount: 10 },
    { name: 'Hạng Vàng', threshold: 20000, discount: 5, birthdayDiscount: 15 },
    { name: 'Hạng Kim Cương', threshold: 50000, discount: 10, birthdayDiscount: 20 },
  ]
};

export const MOCK_PROMOTIONS: PromotionRule[] = [
  {
    id: 'PRM-001',
    name: 'Combo Ăn Sáng Tiết Kiệm',
    type: 'fixed',
    value: 15000,
    applyTo: 'category',
    targetId: 'Snacks',
    schedule: {
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      daysOfWeek: [1, 2, 3, 4, 5],
      happyHour: { start: '06:00', end: '10:00' }
    },
    isActive: true
  },
  {
    id: 'PRM-002',
    name: 'Mua 2 Tặng 1 - Trà Trái Cây',
    type: 'percentage',
    value: 33,
    applyTo: 'category',
    targetId: 'Tea',
    schedule: {
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7]
    },
    isActive: true
  },
  {
    id: 'PRM-003',
    name: 'Khai Trương Chi Nhánh Mới',
    type: 'percentage',
    value: 15,
    applyTo: 'all',
    schedule: {
      startDate: '2025-01-01',
      endDate: '2025-02-28',
      daysOfWeek: [1, 2, 3, 4, 5, 6, 7]
    },
    isActive: true
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'E1', name: 'Nguyễn Văn Quản Lý', pin: '1234', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=alex', salary: 25000000 },
  { id: 'E2', name: 'Lê Thị Thu Ngân', pin: '0000', role: 'Cashier', avatar: 'https://i.pravatar.cc/150?u=sarah', salary: 12000000 },
  { id: 'E3', name: 'Lê Hoàng Nam', pin: '1111', role: 'Waiter', status: 'Active' },
  { id: 'E4', name: 'Phạm Minh Thu', pin: '9999', role: 'Cashier', status: 'Active' },
];

export const MOCK_BRANCHES: Branch[] = [
  { id: 'B1', name: 'Fast POS Vietnam HQ', address: '789 Đường Lê Lợi, Quận 1, TP. HCM' },
  { id: 'B2', name: 'Fast POS Landmark 81', address: 'Tầng 2, Landmark 81, Quận Bình Thạnh, TP. HCM' },
];

export const MOCK_PRINT_GROUPS: PrintGroup[] = [
  { id: 'pg1', name: 'Bếp Cơm' },
  { id: 'pg2', name: 'Quầy Bar' },
  { id: 'pg3', name: 'Hóa Đơn' },
];

export const MOCK_UOMS: UOM[] = [
  { id: 'u1', code: 'pcs', name: 'Cái', category: 'quantity' },
  { id: 'u2', code: 'cup', name: 'Ly', category: 'volume' },
  { id: 'u3', code: 'kg', name: 'Kilogram', category: 'weight' },
  { id: 'u4', code: 'can', name: 'Lon', category: 'quantity' },
  { id: 'u5', code: 'bottle', name: 'Chai', category: 'volume' },
  { id: 'u6', code: 'bread', name: 'Ổ', category: 'quantity' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'P01', name: 'Espresso Sữa Đá', barcode: '100001', type: 'fnb', itemType: 'finished', category: 'Coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 35000, isDefault: true }], price: 35000, stock: 999, hasLotTracking: false, status: 'active' },
  { id: 'P02', name: 'Bạc Xỉu Sài Gòn', barcode: '100002', type: 'fnb', itemType: 'finished', category: 'Coffee', image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=400&h=400&fit=crop', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 45000, isDefault: true }], price: 45000, stock: 999, hasLotTracking: false, status: 'active' },
  { id: 'P03', name: 'Cà Phê Muối', barcode: '100003', type: 'fnb', itemType: 'finished', category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 55000, isDefault: true }], price: 55000, stock: 999, hasLotTracking: false, status: 'active' },
  { id: 'P04', name: 'Trà Đào Cam Sả', barcode: '100004', type: 'fnb', itemType: 'finished', category: 'Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 52000, isDefault: true }], price: 52000, stock: 999, hasLotTracking: false, status: 'active' },
  { id: 'P05', name: 'Trà Vải Lạnh', barcode: '100005', type: 'fnb', itemType: 'finished', category: 'Tea', image: 'https://images.unsplash.com/photo-1594631252845-29fc458695d7?w=400&h=400&fit=crop', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 49000, isDefault: true }], price: 49000, stock: 999, hasLotTracking: false, status: 'active' },
  { id: 'P06', name: 'Bánh Mì Thịt Nướng', barcode: '100006', type: 'fnb', itemType: 'finished', category: 'Snacks', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=400&fit=crop', baseUOMId: 'u6', units: [{ uomId: 'u6', type: 'base', conversionFactor: 1, price: 35000, isDefault: true }], price: 35000, stock: 50, hasLotTracking: false, status: 'active' },
  { id: 'P07', name: 'Bánh Sừng Bò Trứng Muối', barcode: '100007', type: 'fnb', itemType: 'finished', category: 'Snacks', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop', baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 32000, isDefault: true }], price: 32000, stock: 45, hasLotTracking: false, status: 'active' },
  { id: 'P08', name: 'Tiramisu Sen', barcode: '100008', type: 'fnb', itemType: 'finished', category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop', baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 65000, isDefault: true }], price: 65000, stock: 15, hasLotTracking: false, status: 'active' },
  { id: 'P09', name: 'Nước Khoáng Lavie 500ml', barcode: '200009', type: 'retail', itemType: 'finished', category: 'Retail', image: 'https://images.unsplash.com/photo-1616031037011-087000171abe?w=400&h=400&fit=crop', baseUOMId: 'u5', units: [{ uomId: 'u5', type: 'base', conversionFactor: 1, price: 10000, isDefault: true }], price: 10000, stock: 200, hasLotTracking: true, status: 'active' },
  { id: 'P10', name: 'Sữa Tươi Vinamilk 1L', barcode: '200010', type: 'retail', itemType: 'finished', category: 'Retail', image: 'https://images.unsplash.com/photo-1550583724-1255818c0533?w=400&h=400&fit=crop', baseUOMId: 'u5', units: [{ uomId: 'u5', type: 'base', conversionFactor: 1, price: 32000, isDefault: true }], price: 32000, stock: 60, hasLotTracking: true, status: 'active' },
];

export const MOCK_AREAS: Area[] = [
  { id: 'A1', name: 'Tầng Trệt (Indoor)' },
  { id: 'A2', name: 'Sân Vườn (Outdoor)' },
  { id: 'A3', name: 'Phòng VIP (Lầu 1)' },
];

export const MOCK_TABLES: Table[] = [
  { id: 'T1', number: '01', areaId: 'A1', status: 'available', capacity: 2 },
  { id: 'T2', number: '02', areaId: 'A1', status: 'available', capacity: 4 },
  { id: 'T3', number: '03', areaId: 'A1', status: 'available', capacity: 4 },
  { id: 'T4', number: '11', areaId: 'A2', status: 'available', capacity: 2 },
  { id: 'T5', number: '12', areaId: 'A2', status: 'available', capacity: 4 },
  { id: 'T6', number: '13', areaId: 'A2', status: 'available', capacity: 6 },
  { id: 'T7', number: 'V1', areaId: 'A3', status: 'available', capacity: 10 },
  { id: 'T8', number: 'V2', areaId: 'A3', status: 'available', capacity: 8 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C1', name: 'Nguyễn Minh Khoa', phone: '0901234567', type: 'VIP', tier: 'Hạng Vàng', balance: 500000, points: 25000, totalPointsAccumulated: 30000, totalPointsSpent: 5000, birthday: '1990-01-02' },
  { id: 'C2', name: 'Trần Thị Thúy Chi', phone: '0912345678', type: 'Member', tier: 'Hạng Bạc', balance: 0, points: 8000, totalPointsAccumulated: 10000, totalPointsSpent: 2000, birthday: '1995-10-15' },
  { id: 'C3', name: 'Phạm Hoàng Nam', phone: '0987654321', type: 'Member', tier: 'Hạng Đồng', balance: -150000, points: 1200, totalPointsAccumulated: 1200, totalPointsSpent: 0, birthday: '1988-05-20' },
  { id: 'C4', name: 'Lê Văn Tùng', phone: '0908889999', type: 'VIP', tier: 'Hạng Kim Cương', balance: 2000000, points: 75000, totalPointsAccumulated: 100000, totalPointsSpent: 25000, birthday: '1985-12-31' },
  { id: 'C5', name: 'Đặng Mai Phương', phone: '0933445566', type: 'Member', tier: 'Hạng Đồng', balance: 0, points: 450, totalPointsAccumulated: 450, totalPointsSpent: 0, birthday: '2000-08-12' },
  { id: 'C6', name: 'Bùi Anh Tuấn', phone: '0944556677', type: 'Member', tier: 'Hạng Bạc', balance: -50000, points: 6500, totalPointsAccumulated: 8000, totalPointsSpent: 1500, birthday: '1992-03-25' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'S1', name: 'Cà Phê Cao Nguyên Việt', code: 'SUP-001', contact: 'Nguyễn Văn A', phone: '0123456789', email: 'farm@kaizenkage.com', rating: 5, category: 'Raw Materials' },
  { id: 'S2', name: 'Vinamilk Distribution', code: 'SUP-002', contact: 'Lê Thị B', phone: '0988776655', email: 'sales@vinamilk.com', rating: 5, category: 'Retail Goods' },
];
