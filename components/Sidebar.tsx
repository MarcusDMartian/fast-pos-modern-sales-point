
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Table2,
  ShoppingBag,
  History,
  Settings,
  LogOut,
  User,
  Clock,
  LogOut as ExitIcon
} from 'lucide-react';
import { Employee } from '../types';
import { useStore } from '../store';

interface SidebarProps {
  currentUser?: Employee;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onLogout }) => {
  const { enterpriseConfig } = useStore();
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Table2, label: 'Tables', path: '/tables' },
    { icon: ShoppingBag, label: 'POS', path: '/pos' },
    { icon: History, label: 'Orders', path: '/orders' },
  ];

  return (
    <nav className="fixed top-3 left-3 right-3 h-20 glass-surface flex items-center justify-between px-8 z-[100] rounded-[1.5rem]">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-glow overflow-hidden border border-white p-1">
            {enterpriseConfig.logo ? (
              <img
                src={enterpriseConfig.logo}
                alt="Company Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-black rounded-lg"
              style={{ display: enterpriseConfig.logo ? 'none' : 'flex' }}
            >
              {enterpriseConfig.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tighter italic uppercase">{enterpriseConfig.name}</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${isActive
                  ? 'bg-primary text-white shadow-xl shadow-primary-glow scale-105'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
                }`
              }
            >
              <item.icon size={15} strokeWidth={2.5} />
              <span className="hidden lg:block">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentUser && (
          <div className="flex items-center gap-2.5 mr-4 border-r pr-4 border-white/40">
            <div className="w-10 h-10 rounded-full border-2 border-white/50 overflow-hidden shadow-lg bg-white/50 flex items-center justify-center text-slate-400 shrink-0">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} className="w-full h-full object-cover" alt={currentUser.name} />
              ) : (
                <User size={20} strokeWidth={2} />
              )}
            </div>
            <div className="hidden sm:block">
              <p className="text-[11px] font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{currentUser.name}</p>
              <span className="text-[8px] px-1.5 py-0.5 bg-slate-100 rounded-md text-slate-500 font-black uppercase tracking-widest">{currentUser.role}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {currentUser && currentUser.checkInStatus === 'checked_in' && (
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-primary/10 flex items-center gap-2"
            >
              <Clock size={14} />
              End Shift
            </button>
          )}
          {currentUser && (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Logout"
            >
              <LogOut size={20} strokeWidth={2.5} />
            </button>
          )}
          <NavLink to="/settings" className={({ isActive }) => `p-2 rounded-xl transition-all ${isActive ? 'text-primary bg-primary-glow' : 'text-slate-400 hover:bg-white/50'}`}>
            <Settings size={20} strokeWidth={2.5} />
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
