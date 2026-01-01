import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle2, Package, RefreshCcw, Clock, ArrowDown, Loader2 } from 'lucide-react';
import { useStore } from '../store';
import { formatCurrency } from '../utils/formatters';

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

const ActivityHistoryModal: React.FC<ActivityHistoryModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { enterpriseConfig } = useStore();

  const TITLES = [
    t('activities.sale_complete'),
    t('activities.inventory_update'),
    t('activities.refund'),
    t('activities.inventory_audit'),
    t('activities.system_backup'),
    t('activities.price_change')
  ];

  const generateMockActivities = useCallback((count: number, startIdx: number, currency: string): Activity[] => {
    return Array.from({ length: count }).map((_, i) => {
      const idx = startIdx + i;
      const typeIdx = Math.floor(Math.random() * 3);
      return {
        id: `ACT-${idx}-${Date.now()}`,
        title: TITLES[Math.floor(Math.random() * TITLES.length)],
        subtitle: `${t('dashboard.activities.order_suffix', { id: 10000 + idx })}`,
        amount: typeIdx === 0 ? `+${formatCurrency(Math.random() * 500000 + 50000, currency)}` : typeIdx === 1 ? t('sidebar.inventory') : `-${formatCurrency(Math.random() * 200000 + 20000, currency)}`,
        time: `${Math.floor(idx / 2) + 1}h ago`,
        timestamp: Date.now() - idx * 3600000,
        icon: ICONS[typeIdx],
        color: COLORS[typeIdx],
        bg: BGS[typeIdx],
      };
    });
  }, [t, TITLES]);

  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities(generateMockActivities(20, 0, enterpriseConfig.currency));
  }, [enterpriseConfig.currency, generateMockActivities]);

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
      const nextBatch = generateMockActivities(20, activities.length, enterpriseConfig.currency);
      setActivities((prev) => [...prev, ...nextBatch]);
      setIsLoading(false);
      // Stop after 100 items for demo
      if (activities.length > 100) setHasMore(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--primary-700)]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col h-[85vh]">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-[var(--primary-700)] italic uppercase tracking-tight">{t('activities.title')}</h2>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">{t('activities.subtitle')}</p>
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
              className="flex items-center gap-6 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-primary-100/50 hover:border-blue-100 transition-all group animate-fade-in"
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
              <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">{t('activities.load_more')}</p>
            </div>
          )}

          {!hasMore && (
            <div className="py-10 text-center opacity-30">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t('activities.no_more')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityHistoryModal;
