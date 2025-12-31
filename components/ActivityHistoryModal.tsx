
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, CheckCircle2, Package, RefreshCcw, Clock, ArrowDown, Loader2 } from 'lucide-react';

interface Activity {
  id: string | number;
  title: string;
  subtitle: string;
  amount: string;
  time: string;
  timestamp: number;
  icon: any;
  color: string;
  bg: string;
}

interface ActivityHistoryModalProps {
  onClose: () => void;
}

const ICONS = [CheckCircle2, Package, RefreshCcw];
const COLORS = ['text-emerald-500', 'text-blue-500', 'text-orange-500'];
const BGS = ['bg-emerald-50', 'bg-blue-50', 'bg-orange-50'];
const TITLES = ['Sale Completed', 'Stock Updated', 'Refund Issued', 'Inventory Audit', 'System Backup', 'Price Change'];

const generateMockActivities = (count: number, startIdx: number): Activity[] => {
  return Array.from({ length: count }).map((_, i) => {
    const idx = startIdx + i;
    const typeIdx = Math.floor(Math.random() * 3);
    return {
      id: `ACT-${idx}-${Date.now()}`,
      title: TITLES[Math.floor(Math.random() * TITLES.length)],
      subtitle: `Action Ref #${10000 + idx}`,
      amount: typeIdx === 0 ? `+$${(Math.random() * 100).toFixed(2)}` : typeIdx === 1 ? 'Inventory' : `-$${(Math.random() * 50).toFixed(2)}`,
      time: `${Math.floor(idx / 2) + 1}h ago`,
      timestamp: Date.now() - idx * 3600000,
      icon: ICONS[typeIdx],
      color: COLORS[typeIdx],
      bg: BGS[typeIdx],
    };
  });
};

const ActivityHistoryModal: React.FC<ActivityHistoryModalProps> = ({ onClose }) => {
  const [activities, setActivities] = useState<Activity[]>(generateMockActivities(20, 0));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const loadMore = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const nextBatch = generateMockActivities(20, activities.length);
      setActivities((prev) => [...prev, ...nextBatch]);
      setIsLoading(false);
      // Stop after 100 items for demo
      if (activities.length > 100) setHasMore(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#333984]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col h-[85vh]">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-[#333984] italic uppercase tracking-tight">Hoạt động Gần đây</h2>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Lịch sử chi tiết hệ thống</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              ref={index === activities.length - 1 ? lastElementRef : null}
              className="flex items-center gap-6 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-blue-50/50 hover:border-blue-100 transition-all group animate-fade-in"
            >
              <div className={`p-4 rounded-2xl ${activity.bg} ${activity.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <activity.icon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight truncate">{activity.title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{activity.subtitle}</p>
              </div>
              <div className="text-right">
                <p className={`font-black text-sm ${activity.color}`}>{activity.amount}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-slate-300">
                  <Clock size={10} />
                  <p className="text-[9px] font-bold uppercase">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="py-10 flex flex-col items-center justify-center gap-3 text-[#0062FF]">
              <Loader2 size={32} className="animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Đang tải thêm...</p>
            </div>
          )}

          {!hasMore && (
            <div className="py-10 text-center opacity-30">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Bạn đã xem hết lịch sử gần đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityHistoryModal;
