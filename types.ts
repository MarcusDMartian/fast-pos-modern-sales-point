
export type ProductType = 'retail' | 'service' | 'fnb';
export type BOMType = 'recipe' | 'assembly' | 'service';
export type UOMCategory = 'weight' | 'volume' | 'quantity';
export type ProductStatus = 'active' | 'locked';

export type EmployeeRole = 'Admin' | 'Manager' | 'Cashier' | 'Waiter' | 'Kitchen';

export interface Employee {
  id: string;
  name: string;
  pin: string;
  role: EmployeeRole;
  avatar?: string;
  email?: string;
  phone?: string;
  status?: 'Active' | 'Inactive';
  salary?: number;
  checkInStatus?: 'checked_in' | 'checked_out' | 'on_break';
  lastCheckIn?: string;
}

export type CheckInMethod = 'pin' | 'rfid_card' | 'biometric';

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  branchId: string;
  checkInTime: string;
  checkOutTime?: string;
  method: CheckInMethod;
  timezone: string;
  deviceId: string;
  workHours?: number;
  breakMinutes?: number;
  overtimeMinutes?: number;
  status: 'normal' | 'overtime' | 'early_checkout' | 'active';
  totalSales?: number;
  ordersCount?: number;
}

export interface EnterpriseConfig {
  name: string;
  taxId: string;
  currency: string;
  address: string;
  logo: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  startTime: string; // ISO string or HH:mm
  endTime?: string; // Optional, if shift is ongoing
  status: 'open' | 'closed' | 'cancelled';
  cashDrawerStart?: number; // Cash amount at the start of the shift
  cashDrawerEnd?: number; // Cash amount at the end of the shift
  notes?: string;
}

export interface Voucher {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  status: 'active' | 'expired';
}

export interface LoyaltyConfig {
  earningRate: number;
  redemptionRate: number;
  tiers: { name: string; threshold: number; discount: number; }[];
}

export interface PromotionRule {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'bogo';
  value: number;
  minAmount?: number;
  applyTo: 'all' | 'category' | 'product';
  targetId?: string;
  schedule: { startDate: string; endDate: string; daysOfWeek: number[]; happyHour?: { start: string; end: string }; };
  isActive: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contact: string;
  phone: string;
  email: string;
  rating: number;
  category: string;
}

export interface DraftOrder {
  id: string;
  name: string;
  items: CartItem[];
  tableId?: string;
  serviceType: ServiceType;
  createdAt: string;
}

export interface Surcharge {
  label: string;
  type: 'percentage' | 'fixed';
  value: number;
}

export interface PrintGroup { id: string; name: string; }
export interface UOM { id: string; code: string; name: string; category: UOMCategory; }
export interface ProductUOM { uomId: string; type: 'base' | 'sales'; conversionFactor: number; price: number; isDefault: boolean; }

export interface BOMItem {
  id: string;
  componentId: string;
  quantity: number;
  uomId: string;
  cost: number;
}

export interface BOM {
  id: string;
  productId: string;
  type: BOMType;
  items: BOMItem[];
  wastagePercent: number;
  totalCost: number;
}

export interface Lot {
  id: string;
  lotNumber: string;
  expiryDate: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  barcode?: string;
  type: ProductType;
  category: string;
  image: string;
  baseUOMId: string;
  units: ProductUOM[];
  stock: number;
  hasLotTracking: boolean;
  price: number;
  printGroupId?: string;
  status: ProductStatus;
  attributes?: {
    id: string;
    name: string;
    values: { id: string; name: string; priceAdjustment: number }[];
  }[];
  bom?: BOM;
  lots?: Lot[];
}

export interface SelectedAttribute { attributeId: string; valueId: string; }

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedUomId: string;
  selectedAttributes: SelectedAttribute[];
  totalPrice: number;
  discount?: Discount;
  note?: string;
}

export type OrderStatus = 'completed' | 'cancelled' | 'refunded' | 'draft' | 'pending';
export type PaymentMethod = 'Cash' | 'Card' | 'Transfer' | 'Credit';
export type ServiceType = 'Dine-in' | 'Take-away' | 'Delivery';

export interface Order {
  id: string;
  branchId: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  tax: number;
  surcharge: number;
  total: number;
  date: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  serviceType: ServiceType;
  tableId?: string;
  customerId?: string;
  createdBy: string;
  voucherCode?: string;
}

export interface Area { id: string; name: string; }
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'pending_payment';

export interface Reservation {
  id: string;
  tableId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  duration: number;
  guests: number;
  notes?: string;
  status: 'confirmed' | 'cancelled' | 'seated' | 'completed';
  preOrderItems?: CartItem[];
}

export interface Table {
  id: string;
  number: string;
  areaId: string;
  status: TableStatus;
  capacity: number;
  allReservations?: Reservation[];
}

export type Category = 'All' | 'Coffee' | 'Tea' | 'Snacks' | 'Desserts' | 'Service';
export interface Branch { id: string; name: string; address: string; }

export interface DebtTransaction {
  id: string;
  date: string;
  type: 'credit' | 'payment';
  amount: number;
  method?: PaymentMethod;
  reference?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  type: string;
  tier: string;
  balance: number;
  points: number;
  email?: string;
  debtHistory?: DebtTransaction[];
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjust' | 'return';
  quantity: number;
  uomId: string;
  date: string;
  performedBy: string;
  note?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  createdBy: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  total: number;
  status: 'Draft' | 'Sent' | 'Received' | 'Cancelled';
  items: {
    productId: string;
    name: string;
    quantity: number;
    cost: number;
  }[];
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'Present' | 'Late' | 'Absent' | 'Leave';
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Return Order Types
export type ReturnReason = 'defective' | 'change_mind' | 'wrong_item' | 'damaged' | 'expired' | 'other';
export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type RefundMethod = 'cash' | 'card' | 'voucher' | 'store_credit';
export type ItemCondition = 'perfect' | 'minor_defect' | 'major_defect' | 'damaged';

export interface ReturnOrderItem {
  id: string;
  originalOrderItemId: string;
  productId: string;
  productName: string;
  quantityReturned: number;
  originalQuantity: number;
  originalUnitPrice: number;
  refundAmountPerUnit: number;
  totalRefundAmount: number;
  itemCondition: ItemCondition;
}

export interface ReturnOrder {
  id: string;
  originalOrderId: string;
  originalOrderDate: string;
  customerId?: string;
  customerName?: string;
  branchId: string;
  returnDate: string;
  reason: ReturnReason;
  reasonDetail?: string;
  status: ReturnStatus;
  notes?: string;
  items: ReturnOrderItem[];
  subtotalRefund: number;
  restockingFee: number;
  totalRefund: number;
  refundMethod: RefundMethod;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Void Order Types
export type VoidReason = 'mistake' | 'duplicate' | 'customer_request' | 'system_error' | 'other';

export interface VoidOrder {
  id: string;
  originalOrderId: string;
  voidReason: VoidReason;
  voidReasonDetail?: string;
  voidedBy: string;
  voidedAt: string;
  managerApproval: boolean;
  managerApprovedBy?: string;
  originalAmount: number;
}
