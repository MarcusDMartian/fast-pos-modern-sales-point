
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    Product, Category, Order, CartItem, ServiceType, Customer, Employee,
    StockMovement, Area, UOM, Branch, PrintGroup, LoyaltyConfig, PromotionRule, DraftOrder,
    Table, Expense, Shift, EnterpriseConfig, Notification, AttendanceRecord, ReturnOrder, VoidOrder
} from './types';
import {
    MOCK_PRODUCTS, MOCK_CUSTOMERS, MOCK_TABLES, MOCK_EMPLOYEES,
    MOCK_BRANCHES, MOCK_UOMS, MOCK_PRINT_GROUPS, MOCK_AREAS
} from './constants';

interface AppState {
    products: Product[];
    setProducts: (products: Product[]) => void;
    addProduct: (product: Product) => void;
    updateProduct: (id: string, updates: Partial<Product>) => void;

    orders: Order[];
    addOrder: (order: Order) => void;
    updateOrder: (id: string, updates: Partial<Order>) => void;
    setOrders: (orders: Order[]) => void;

    expenses: Expense[];
    setExpenses: (expenses: Expense[]) => void;
    addExpense: (expense: Expense) => void;

    movements: StockMovement[];
    setMovements: (movements: StockMovement[]) => void;
    addMovement: (movement: StockMovement) => void;

    customers: Customer[];
    setCustomers: (customers: Customer[]) => void;
    addCustomer: (customer: Customer) => void;
    updateCustomer: (id: string, updates: Partial<Customer>) => void;

    employees: Employee[];
    setEmployees: (employees: Employee[]) => void;
    addEmployee: (employee: Employee) => void;
    updateEmployee: (id: string, updates: Partial<Employee>) => void;

    tables: Table[];
    setTables: (tables: Table[]) => void;
    addTable: (table: Table) => void;
    updateTable: (id: string, updates: Partial<Table>) => void;

    areas: Area[];
    setAreas: (areas: Area[]) => void;
    addArea: (area: Area) => void;

    loyaltyConfig: LoyaltyConfig;
    setLoyaltyConfig: (config: LoyaltyConfig) => void;

    promotions: PromotionRule[];
    setPromotions: (promotions: PromotionRule[]) => void;

    enterpriseConfig: EnterpriseConfig;
    setEnterpriseConfig: (config: EnterpriseConfig) => void;

    themeColor: string;
    setThemeColor: (color: string) => void;

    currentUser: Employee | null;
    setCurrentUser: (user: Employee | null) => void;

    currentShift: Shift | null;
    setCurrentShift: (shift: Shift | null) => void;

    drafts: DraftOrder[];
    setDrafts: (drafts: DraftOrder[]) => void;
    addDraft: (draft: DraftOrder) => void;
    deleteDraft: (draftId: string) => void;

    favorites: string[];
    setFavorites: (favs: string[]) => void;
    toggleFavorite: (productId: string) => void;

    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

    attendanceRecords: AttendanceRecord[];
    checkIn: (record: AttendanceRecord) => void;
    checkOut: (employeeId: string, details: Partial<AttendanceRecord>) => void;

    uoms: UOM[];
    branches: Branch[];
    printGroups: PrintGroup[];

    returnOrders: ReturnOrder[];
    addReturnOrder: (returnOrder: ReturnOrder) => void;
    updateReturnOrder: (id: string, updates: Partial<ReturnOrder>) => void;

    voidOrders: VoidOrder[];
    addVoidOrder: (voidOrder: VoidOrder) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            products: MOCK_PRODUCTS,
            setProducts: (products) => set({ products }),
            addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
            updateProduct: (id, updates) => set((state) => ({
                products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
            })),

            orders: [],
            addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
            updateOrder: (id, updates) => set((state) => ({
                orders: state.orders.map(o => o.id === id ? { ...o, ...updates } : o)
            })),
            setOrders: (orders) => set({ orders }),

            expenses: [],
            setExpenses: (expenses) => set({ expenses }),
            addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),

            movements: [],
            setMovements: (movements) => set({ movements }),
            addMovement: (movement) => set((state) => ({ movements: [movement, ...state.movements] })),

            customers: MOCK_CUSTOMERS,
            setCustomers: (customers) => set({ customers }),
            addCustomer: (customer) => set((state) => ({ customers: [customer, ...state.customers] })),
            updateCustomer: (id, updates) => set((state) => ({
                customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c)
            })),

            employees: MOCK_EMPLOYEES,
            setEmployees: (employees) => set({ employees }),
            addEmployee: (employee) => set((state) => ({ employees: [employee, ...state.employees] })),
            updateEmployee: (id, updates) => set((state) => ({
                employees: state.employees.map(e => e.id === id ? { ...e, ...updates } : e)
            })),

            tables: MOCK_TABLES,
            setTables: (tables) => set({ tables }),
            addTable: (table) => set((state) => ({ tables: [table, ...state.tables] })),
            updateTable: (id, updates) => set((state) => ({
                tables: state.tables.map(t => t.id === id ? { ...t, ...updates } : t)
            })),

            areas: MOCK_AREAS,
            setAreas: (areas) => set({ areas }),
            addArea: (area) => set((state) => ({ areas: [...state.areas, area] })),

            loyaltyConfig: { earningRate: 1, redemptionRate: 0.1, tiers: [] },
            setLoyaltyConfig: (loyaltyConfig) => set({ loyaltyConfig }),

            promotions: [],
            setPromotions: (promotions) => set({ promotions }),

            enterpriseConfig: {
                name: 'Fast POS Vietnam Ltd.',
                taxId: 'TX-888-9999-123',
                currency: 'VND (₫)',
                address: '789 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
                logo: 'https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/fastpos-logo.png'
            },
            setEnterpriseConfig: (enterpriseConfig) => set({ enterpriseConfig }),

            themeColor: '#65378F',
            setThemeColor: (themeColor) => set({ themeColor }),

            currentUser: null,
            setCurrentUser: (user) => set({ currentUser: user }),

            currentShift: null,
            setCurrentShift: (shift) => set({ currentShift: shift }),

            drafts: [],
            setDrafts: (drafts) => set({ drafts }),
            addDraft: (draft) => set((state) => ({ drafts: [draft, ...state.drafts] })),
            deleteDraft: (draftId) => set((state) => ({ drafts: state.drafts.filter(d => d.id !== draftId) })),

            favorites: [],
            setFavorites: (favorites) => set({ favorites }),
            toggleFavorite: (productId) => set((state) => ({
                favorites: state.favorites.includes(productId)
                    ? state.favorites.filter(id => id !== productId)
                    : [...state.favorites, productId]
            })),

            notifications: [],
            setNotifications: (notifications) => set({ notifications }),
            showToast: (message, type = 'success') => {
                const id = Math.random().toString(36).substring(2, 9);
                const notification = { id, message, type };
                set((state) => ({ notifications: [...state.notifications, notification] }));
                setTimeout(() => {
                    set((state) => ({
                        notifications: state.notifications.filter((n) => n.id !== id),
                    }));
                }, 2000);
            },

            attendanceRecords: [],
            checkIn: (record) => set((state) => ({
                attendanceRecords: [record, ...state.attendanceRecords],
                employees: state.employees.map(e => e.id === record.employeeId ? {
                    ...e,
                    checkInStatus: 'checked_in',
                    lastCheckIn: record.checkInTime
                } : e)
            })),
            checkOut: (employeeId, details) => set((state) => ({
                attendanceRecords: state.attendanceRecords.map(r =>
                    (r.employeeId === employeeId && !r.checkOutTime) ? { ...r, ...details, checkOutTime: new Date().toISOString() } : r
                ),
                employees: state.employees.map(e => e.id === employeeId ? {
                    ...e,
                    checkInStatus: 'checked_out'
                } : e)
            })),

            uoms: MOCK_UOMS,
            branches: MOCK_BRANCHES,
            printGroups: MOCK_PRINT_GROUPS,

            returnOrders: [],
            addReturnOrder: (returnOrder) => set((state) => ({ returnOrders: [returnOrder, ...state.returnOrders] })),
            updateReturnOrder: (id, updates) => set((state) => ({
                returnOrders: state.returnOrders.map(r => r.id === id ? { ...r, ...updates } : r)
            })),

            voidOrders: [],
            addVoidOrder: (voidOrder) => set((state) => ({ voidOrders: [voidOrder, ...state.voidOrders] })),
        }),
        {
            name: 'fastpos-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => {
                const { notifications, ...rest } = state;
                return rest;
            },
        }
    )
);
