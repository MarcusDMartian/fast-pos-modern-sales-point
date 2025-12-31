
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2, Heart, Sparkles, Wallet, UserCheck, Users,
  ChevronLeft, ChevronRight, Package, Truck
} from 'lucide-react';

import { useStore } from '../store';

interface MainSidebarProps {
  isMinimized: boolean;
  onToggle: () => void;
}

const MainSidebar: React.FC<MainSidebarProps> = ({ isMinimized, onToggle }) => {
  const { enterpriseConfig } = useStore();
  const menuItems = [
    { icon: Building2, label: 'Enterprise Info', path: '/enterprise', color: 'text-blue-500' },
    { icon: Heart, label: 'Loyalty Program', path: '/loyalty', color: 'text-red-500' },
    { icon: Sparkles, label: 'Promotions', path: '/promotions', color: 'text-purple-500' },
    { icon: Package, label: 'Inventory Control', path: '/inventory', color: 'text-emerald-500' },
    { icon: Truck, label: 'Procurement', path: '/procurement', color: 'text-orange-600' },
    { icon: Wallet, label: 'Financial Hub', path: '/finance', color: 'text-cyan-500' },
    { icon: UserCheck, label: 'Team & HRM', path: '/staff', color: 'text-indigo-500' },
    { icon: Users, label: 'CRM & Customers', path: '/customers', color: 'text-pink-500' },
  ];

  return (
    <aside
      className={`fixed left-3 top-[6.5rem] bottom-3 z-[90] glass-surface transition-all duration-500 ease-in-out flex flex-col overflow-hidden rounded-[1.5rem] ${isMinimized ? 'w-24' : 'w-72'
        }`}
    >
      <div className="p-4 border-b border-white/40 flex items-center justify-between">
        {!isMinimized && (
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Back-Office</span>
        )}
        <button
          onClick={onToggle}
          className={`p-2 hover:bg-white/60 rounded-xl transition-all text-slate-400 hover:text-blue-600 ${isMinimized ? 'mx-auto' : ''}`}
        >
          {isMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              w-full flex items-center gap-4 p-4 rounded-xl font-bold text-[11px] transition-all relative group
              ${isActive
                ? 'bg-primary text-white shadow-xl shadow-primary-glow scale-[1.02]'
                : 'text-slate-500 hover:bg-white/20 hover:text-slate-900'}
            `}
          >
            <div className={`shrink-0 ${item.color} group-[.active]:text-white transition-colors`}>
              <item.icon size={20} strokeWidth={2} />
            </div>
            {!isMinimized && <span className="uppercase tracking-tight whitespace-nowrap">{item.label}</span>}

            {/* Tooltip for Minimized state */}
            {isMinimized && (
              <div className="fixed left-24 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[300] ml-2 tracking-widest shadow-2xl">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/40">
        <div className={`flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl ${isMinimized ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden p-1 border border-slate-100 shrink-0">
            {enterpriseConfig.logo ? (
              <img
                src={enterpriseConfig.logo}
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-full h-full flex items-center justify-center bg-primary text-white text-[10px] font-black rounded-lg"
              style={{ display: enterpriseConfig.logo ? 'none' : 'flex' }}
            >
              {enterpriseConfig.name.charAt(0).toUpperCase()}
            </div>
          </div>
          {!isMinimized && (
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tighter italic">{enterpriseConfig.name}</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Admin Control</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default MainSidebar;
