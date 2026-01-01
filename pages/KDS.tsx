
import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle2, AlertCircle, ChefHat, Utensils, Clock, Trash2, Printer } from 'lucide-react';
import { Order } from '../types';
import { useStore } from '../store';

const KDS: React.FC = () => {
   const { orders, updateOrder } = useStore();
   const [activeOrders, setActiveOrders] = useState<Order[]>([]);

   useEffect(() => {
      // Only show completed/pending orders for KDS
      const kdsOrders = orders.filter(o => o.status === 'completed' || o.status === 'pending');
      setActiveOrders(kdsOrders.slice(0, 6)); // Display first 6 for layout
   }, [orders]);

   const handleFinishOrder = (id: string) => {
      updateOrder(id, { status: 'cancelled' }); // Simulating removal/archiving
   };

   return (
      <div className="bg-white rounded-[3rem] p-8 border border-gray-50 shadow-sm animate-in fade-in duration-500">
         <div className="flex items-center justify-between mb-10">
            <div>
               <h1 className="text-2xl font-black text-[var(--primary-700)] mb-2 flex items-center gap-4">
                  <ChefHat size={28} className="text-[var(--primary-600)]" />
                  Màn hình Bếp (KDS)
               </h1>
               <p className="text-gray-400 font-medium text-xs">Đang theo dõi {activeOrders.length} quy trình chế biến.</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                  <button className="px-4 py-2 bg-white text-[var(--primary-700)] shadow-sm rounded-xl text-[10px] font-black uppercase">Tất cả món</button>
                  <button className="px-4 py-2 text-gray-400 text-[10px] font-black uppercase">Theo nhóm</button>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeOrders.map((order, idx) => (
               <div key={order.id} className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col h-[500px]">
                  {/* Card Header */}
                  <div className="p-6 bg-white border-b border-gray-50 flex items-center justify-between">
                     <div>
                        <h3 className="font-black text-[var(--primary-700)] text-md">#{order.id.split('-')[1]}</h3>
                        <div className="flex items-center gap-2 mt-1">
                           <Clock size={10} className="text-gray-400" />
                           <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{order.tableId ? `Bàn ${order.tableId}` : 'Mang về'}</span>
                        </div>
                     </div>
                     <div className="text-[8px] font-black text-[var(--primary-600)] bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                        {idx * 4 + 2}m
                     </div>
                  </div>

                  {/* Items List */}
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
                     {order.items.map((item, i) => (
                        <div key={i} className="flex gap-3 group">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-[var(--primary-600)] text-xs shrink-0 border border-gray-100 shadow-sm">
                              {item.quantity}x
                           </div>
                           <div className="flex-1">
                              <p className="font-black text-[var(--primary-700)] text-xs leading-tight">{item.name}</p>
                              {item.note && (
                                 <div className="mt-1 p-2 bg-orange-50 text-orange-600 rounded-lg text-[8px] font-bold flex items-center gap-1.5">
                                    <AlertCircle size={8} /> {item.note}
                                 </div>
                              )}
                              <div className="flex flex-wrap gap-1 mt-1">
                                 {item.selectedAttributes.map(attr => (
                                    <span key={attr.valueId} className="text-[7px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-100 px-1.5 py-0.5 rounded-sm">{attr.valueId}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Action Footer */}
                  <div className="p-6 bg-white border-t border-gray-50 flex gap-2">
                     <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all">
                        <Printer size={16} />
                     </button>
                     <button
                        onClick={() => handleFinishOrder(order.id)}
                        className="flex-1 bg-[var(--primary-600)] hover:bg-green-500 text-white font-black rounded-xl py-3 flex items-center justify-center gap-2 transition-all text-xs"
                     >
                        <CheckCircle2 size={16} /> HOÀN TẤT
                     </button>
                  </div>
               </div>
            ))}

            {activeOrders.length === 0 && (
               <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-10">
                  <Utensils size={48} className="mb-4" />
                  <p className="text-lg font-black uppercase tracking-widest text-[var(--primary-700)]">Bếp hiện đang trống</p>
               </div>
            )}
         </div>
      </div>
   );
};

export default KDS;
