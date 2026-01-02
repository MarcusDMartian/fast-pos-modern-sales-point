
import {
  Product, Table, Customer, Area, UOM, Branch, PrintGroup,
  Employee, Voucher, Supplier, LoyaltyConfig, PromotionRule,
  Order, Expense, StockMovement, AttendanceRecord, DraftOrder
} from './types';

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
    name: 'Combo Chào Buổi Sáng',
    type: 'fixed',
    value: 15000,
    applyTo: 'category',
    targetId: 'Snacks',
    schedule: {
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      daysOfWeek: [1, 2, 3, 4, 5],
      happyHour: { start: '06:00', end: '10:00' }
    },
    isActive: true
  },
  {
    id: 'PRM-002',
    name: 'Happy Hour - Giảm 20%',
    type: 'percentage',
    value: 20,
    applyTo: 'all',
    schedule: {
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      daysOfWeek: [1, 2, 3, 4, 5],
      happyHour: { start: '14:00', end: '17:00' }
    },
    isActive: true
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'E1', name: 'Nguyễn Quản Lý', pin: '1234', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=admin', salary: 25000000, status: 'Active' },
  { id: 'E2', name: 'Trần Thu Ngân', pin: '0000', role: 'Cashier', avatar: 'https://i.pravatar.cc/150?u=cashier', salary: 12000000, status: 'Active' },
  { id: 'E3', name: 'Lê Phục Vụ', pin: '1111', role: 'Waiter', avatar: 'https://i.pravatar.cc/150?u=waiter', salary: 8000000, status: 'Active' },
];

export const MOCK_BRANCHES: Branch[] = [
  { id: 'B1', name: 'Fast POS HQ - Quận 1', address: '789 Lê Lợi, P. Bến Thành, Q.1, TP.HCM' },
  { id: 'B2', name: 'Fast POS - Landmark 81', address: 'Vinhomes Central Park, Q.Bình Thạnh, TP.HCM' },
];

export const MOCK_PRINT_GROUPS: PrintGroup[] = [
  { id: 'pg1', name: 'Máy in Bếp' },
  { id: 'pg2', name: 'Máy in Quầy Bar' },
  { id: 'pg3', name: 'Máy in Hóa đơn' },
];

export const MOCK_UOMS: UOM[] = [
  { id: 'u1', code: 'pcs', name: 'Cái', category: 'quantity' },
  { id: 'u2', code: 'cup', name: 'Ly', category: 'volume' },
  { id: 'u3', code: 'kg', name: 'Kg', category: 'weight' },
  { id: 'u4', code: 'set', name: 'Set', category: 'quantity' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'P01', name: 'Phê Sữa Đá Sài Gòn', barcode: '893001', type: 'fnb', itemType: 'finished', category: 'Coffee', image: 'https://images.unsplash.com/photo-1541167733022-ad936532ad45?w=500', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 35000, isDefault: true }], price: 35000, stock: 150, hasLotTracking: false, status: 'active' },
  { id: 'P02', name: 'Caramel Macchiato', barcode: '893002', type: 'fnb', itemType: 'finished', category: 'Coffee', image: 'https://images.unsplash.com/photo-1485808191679-5f63332eb75b?w=500', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 55000, isDefault: true }], price: 55000, stock: 120, hasLotTracking: false, status: 'active' },
  { id: 'P03', name: 'Trà Đào Cam Sả', barcode: '893003', type: 'fnb', itemType: 'finished', category: 'Tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 45000, isDefault: true }], price: 45000, stock: 80, hasLotTracking: false, status: 'active' },
  { id: 'P04', name: 'Trà Sen Vàng', barcode: '893004', type: 'fnb', itemType: 'finished', category: 'Tea', image: 'https://images.unsplash.com/photo-1594631252845-29fc458695d7?w=500', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 49000, isDefault: true }], price: 49000, stock: 65, hasLotTracking: false, status: 'active' },
  { id: 'P05', name: 'Croissant Bơ Pháp', barcode: '893005', type: 'fnb', itemType: 'finished', category: 'Desserts', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500', baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 32000, isDefault: true }], price: 32000, stock: 40, hasLotTracking: false, status: 'active' },
  { id: 'P06', name: 'Bánh Mì Hội An', barcode: '893006', type: 'fnb', itemType: 'finished', category: 'Snacks', image: 'https://images.unsplash.com/photo-1509722747041-07ecfcb39bb7?w=500', baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 39000, isDefault: true }], price: 39000, stock: 30, hasLotTracking: false, status: 'active' },
  { id: 'P07', name: 'Matcha Latte', barcode: '893007', type: 'fnb', itemType: 'finished', category: 'Coffee', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500', baseUOMId: 'u2', units: [{ uomId: 'u2', type: 'base', conversionFactor: 1, price: 45000, isDefault: true }], price: 45000, stock: 50, hasLotTracking: false, status: 'active' },
  { id: 'P08', name: 'Nước Suối 500ml', barcode: '893008', type: 'retail', itemType: 'finished', category: 'Retail', image: 'https://images.unsplash.com/photo-1616031037011-087000171abe?w=500', baseUOMId: 'u1', units: [{ uomId: 'u1', type: 'base', conversionFactor: 1, price: 15000, isDefault: true }], price: 15000, stock: 200, hasLotTracking: false, status: 'active' },
];

export const MOCK_AREAS: Area[] = [
  { id: 'A1', name: 'Sảnh Chính' },
  { id: 'A2', name: 'Lầu 1 - VIP' },
  { id: 'A3', name: 'Sân Thượng' },
];

export const MOCK_TABLES: Table[] = [
  { id: 'T1', number: '101', areaId: 'A1', status: 'available', capacity: 2 },
  { id: 'T2', number: '102', areaId: 'A1', status: 'available', capacity: 4 },
  { id: 'T3', number: '201', areaId: 'A2', status: 'available', capacity: 6 },
  { id: 'T4', number: '301', areaId: 'A3', status: 'available', capacity: 4 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C1', name: 'Nguyễn Minh Khoa', phone: '0901234567', type: 'VIP', tier: 'Hạng Vàng', balance: 500000, points: 2500, totalPointsAccumulated: 15000, totalPointsSpent: 12500, birthday: '1990-01-02' },
  { id: 'C2', name: 'Lê Diệu Linh', phone: '0912233445', type: 'Normal', tier: 'Hạng Bạc', balance: 0, points: 850, totalPointsAccumulated: 2000, totalPointsSpent: 1150, birthday: '1995-05-12' },
  { id: 'C3', name: 'Trần Hoàng Nam', phone: '0988776655', type: 'VIP', tier: 'Hạng Kim Cương', balance: 2500000, points: 15000, totalPointsAccumulated: 50000, totalPointsSpent: 35000, birthday: '1988-12-25' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'S1', name: 'Cà Phê Cao Nguyên Dalat', code: 'SUP001', contact: 'Mr. An', phone: '0901112223', email: 'an@farm.com', rating: 5, category: 'Raw Materials' },
  { id: 'S2', name: 'Lò Bánh Hội An', code: 'SUP002', contact: 'Ms. Hoa', phone: '0903334445', email: 'hoa@bakery.com', rating: 4, category: 'Food' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    branchId: 'B1',
    items: [
      { ...MOCK_PRODUCTS[0], quantity: 2, selectedUomId: 'u2', selectedAttributes: [], totalPrice: 70000 }
    ],
    subtotal: 70000,
    discountAmount: 0,
    tax: 7000,
    surcharge: 0,
    total: 77000,
    date: new Date().toISOString(),
    status: 'completed',
    paymentMethod: 'Cash',
    serviceType: 'Dine-in',
    tableId: 'T1',
    customerId: 'C1',
    createdBy: 'E2'
  },
  {
    id: 'ORD-002',
    branchId: 'B1',
    items: [
      { ...MOCK_PRODUCTS[1], quantity: 1, selectedUomId: 'u2', selectedAttributes: [], totalPrice: 55000 }
    ],
    subtotal: 55000,
    discountAmount: 0,
    tax: 5500,
    surcharge: 0,
    total: 60500,
    date: new Date().toISOString(),
    status: 'completed',
    paymentMethod: 'Transfer',
    serviceType: 'Take-away',
    customerId: 'C2',
    createdBy: 'E2'
  }
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'EXP-001', amount: 2500000, category: 'Vật tư', note: 'Nhập hạt cà phê Arabica', date: new Date().toISOString(), createdBy: 'E1' },
];

export const MOCK_MOVEMENTS: StockMovement[] = [
  { id: 'MOV-001', productId: 'P01', productName: 'Phê Sữa Đá Sài Gòn', type: 'in', quantity: 100, uomId: 'u2', date: new Date().toISOString(), performedBy: 'E1', note: 'Nhập hàng đầu kỳ' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'ATT-001', employeeId: 'E2', branchId: 'B1', checkInTime: new Date(new Date().setHours(8, 0)).toISOString(), status: 'active', method: 'pin', deviceId: 'POS-01', timezone: 'ICT' },
  { id: 'ATT-002', employeeId: 'E1', branchId: 'B1', checkInTime: new Date(new Date().setHours(7, 30)).toISOString(), status: 'active', method: 'pin', deviceId: 'POS-01', timezone: 'ICT' },
];
