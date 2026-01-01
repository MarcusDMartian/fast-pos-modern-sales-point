
import React, { useState } from 'react';
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
  Menu,
  X
} from 'lucide-react';
import { Employee } from '../types';
import { useStore } from '../store';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  currentUser?: Employee;
  onLogout?: () => void;
  onMenuToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onLogout, onMenuToggle }) => {
  const { t } = useTranslation();
  const { enterpriseConfig } = useStore();
  const navItems = [
    { icon: LayoutDashboard, label: t('sidebar.dashboard'), path: '/' },
    { icon: Table2, label: t('sidebar.tables'), path: '/tables' },
    { icon: ShoppingBag, label: t('sidebar.pos'), path: '/pos' },
    { icon: History, label: t('sidebar.orders'), path: '/orders' },
  ];

  return (
    <>
      {/* Top Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 md:top-3 md:left-3 md:right-3 h-16 md:h-20 glass-surface flex items-center justify-between px-4 md:px-8 z-[100] md:rounded-[1.5rem]">
        {/* Left Section: Menu + Logo */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Hamburger Menu - Mobile Only */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-white/50 transition-all"
          >
            <Menu size={22} strokeWidth={2} />
          </button>

          {/* Logo */}
          <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-glow overflow-hidden border border-white p-1">
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
          {/* Company Name - Hidden on mobile */}
          <span className="hidden sm:block font-black text-lg md:text-xl text-slate-900 tracking-tighter italic uppercase">{enterpriseConfig.name}</span>
        </div>

        {/* Navigation - Center (Desktop Only) */}
        <div className="hidden md:flex items-center gap-1.5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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

        {/* Right Section: User Info + Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {currentUser && (
            <div className="flex items-center gap-2 md:gap-2.5 md:mr-4 md:border-r md:pr-4 border-white/40">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white/50 overflow-hidden shadow-lg bg-white/50 flex items-center justify-center text-slate-400 shrink-0">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} className="w-full h-full object-cover" alt={currentUser.name} />
                ) : (
                  <User size={18} strokeWidth={2} />
                )}
              </div>
              {/* User name - Hidden on mobile */}
              <div className="hidden sm:block">
                <p className="text-[11px] font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{currentUser.name}</p>
                <span className="text-[8px] px-1.5 py-0.5 bg-slate-100 rounded-md text-slate-500 font-black uppercase tracking-widest">{currentUser.role}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 md:gap-2">
            {/* End Shift - Hidden on mobile */}
            {currentUser && currentUser.checkInStatus === 'checked_in' && (
              <button
                onClick={onLogout}
                className="hidden sm:flex px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-primary/10 items-center gap-2"
              >
                <Clock size={14} />
                {t('lockscreen.shift_end')}
              </button>
            )}
            {currentUser && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                title={t('common.logout')}
              >
                <LogOut size={18} strokeWidth={2.5} />
              </button>
            )}
            <NavLink to="/settings" title={t('sidebar.settings')} className={({ isActive }) => `p-2 rounded-xl transition-all ${isActive ? 'text-primary bg-primary-glow' : 'text-slate-400 hover:bg-white/50'}`}>
              <Settings size={18} strokeWidth={2.5} />
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-xl border-t border-slate-200/50 flex items-center justify-around px-2 z-[100] safe-area-pb">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl min-w-[64px] transition-all duration-200 ${isActive
                ? 'text-primary'
                : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wide ${isActive ? 'font-black' : ''}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
