
import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '../store';

const ToastContainer: React.FC = () => {
    const { notifications, setNotifications } = useStore();

    const removeToast = (id: string) => {
        setNotifications(notifications.filter((n) => n.id !== id));
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-24 right-6 z-[2000] flex flex-col gap-3 pointer-events-none">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    onClick={() => removeToast(n.id)}
                    className={`
            pointer-events-auto cursor-pointer
            flex items-center gap-4 px-6 py-4 rounded-[2rem] shadow-2xl border-2
            animate-in slide-in-from-right fade-in duration-300
            ${n.type === 'success' ? 'bg-white border-green-100 text-green-600' :
                            n.type === 'error' ? 'bg-white border-red-100 text-red-600' :
                                'bg-white border-blue-100 text-blue-600'}
          `}
                >
                    <div className={`p-2 rounded-xl ${n.type === 'success' ? 'bg-green-50' :
                            n.type === 'error' ? 'bg-red-50' :
                                'bg-blue-50'
                        }`}>
                        {n.type === 'success' && <CheckCircle2 size={20} />}
                        {n.type === 'error' && <AlertCircle size={20} />}
                        {n.type === 'info' && <Info size={20} />}
                    </div>

                    <div className="flex-1">
                        <p className="font-black text-xs uppercase tracking-widest">{n.message}</p>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); removeToast(n.id); }}
                        className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-300"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
