
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2, Heart, Sparkles, Wallet, UserCheck, Users,
  ChevronLeft, ChevronRight, Package, Truck, X
} from 'lucide-react';

import { useStore } from '../store';
import { useTranslation } from 'react-i18next';

interface MainSidebarProps {
  isMinimized: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const MainSidebar: React.FC<MainSidebarProps> = ({ isMinimized, onToggle, isMobileOpen = false, onMobileClose }) => {
  const { t } = useTranslation();
  const { enterpriseConfig } = useStore();
  const menuItems = [
    { icon: Building2, label: t('sidebar.enterprise'), path: '/enterprise', color: 'text-blue-500' },
    { icon: Heart, label: t('sidebar.loyalty'), path: '/loyalty', color: 'text-red-500' },
    { icon: Sparkles, label: t('sidebar.promotions'), path: '/promotions', color: 'text-purple-500' },
    { icon: Package, label: t('sidebar.inventory_control'), path: '/inventory', color: 'text-emerald-500' },
    { icon: Truck, label: t('sidebar.procurement'), path: '/procurement', color: 'text-orange-600' },
    { icon: Wallet, label: t('sidebar.finance_hub'), path: '/finance', color: 'text-cyan-500' },
    { icon: UserCheck, label: t('sidebar.team_hrm'), path: '/staff', color: 'text-indigo-500' },
    { icon: Users, label: t('sidebar.crm_customers'), path: '/customers', color: 'text-pink-500' },
  ];

  const handleNavClick = () => {
    // Close mobile sidebar when navigating
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-[95] transition-opacity"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-[96] transition-all duration-500 ease-in-out flex-col overflow-hidden
          
          /* Mobile: Solid white background for better visibility */
          bg-white shadow-2xl
          md:bg-transparent md:shadow-none md:glass-surface
          
          /* Mobile: Hidden by default, shown as overlay when open */
          ${isMobileOpen ? 'flex' : 'hidden'}
          md:flex
          
          /* Mobile positioning */
          left-0 top-0 bottom-0 w-72
          
          /* Desktop positioning */
          md:left-3 md:top-[6.5rem] md:bottom-3 md:rounded-[1.5rem]
          ${isMinimized ? 'md:w-24' : 'md:w-72'}
        `}
      >
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{t('sidebar.back_office')}</span>
          <button
            onClick={onMobileClose}
            className="p-2 hover:bg-slate-200 rounded-xl transition-all text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex p-4 border-b border-white/40 items-center justify-between">
          {!isMinimized && (
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('sidebar.back_office')}</span>
          )}
          <button
            onClick={onToggle}
            className={`p-2 hover:bg-white/60 rounded-xl transition-all text-slate-400 hover:text-blue-600 ${isMinimized ? 'mx-auto' : ''}`}
          >
            {isMinimized ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="flex-1 py-4 md:py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
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
              {/* Always show label on mobile, conditional on desktop */}
              <span className={`uppercase tracking-tight whitespace-nowrap ${isMinimized ? 'md:hidden' : ''}`}>{item.label}</span>

              {/* Tooltip for Minimized state - Desktop Only */}
              {isMinimized && (
                <div className="hidden md:block fixed left-24 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-[300] ml-2 tracking-widest shadow-2xl">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-white/40">
          <div className={`flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl ${isMinimized ? 'md:justify-center' : ''}`}>
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
            {/* Always show on mobile, conditional on desktop */}
            <div className={`min-w-0 ${isMinimized ? 'md:hidden' : ''}`}>
              <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tighter italic">{enterpriseConfig.name}</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t('sidebar.admin_control')}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MainSidebar;
