
import React, { useState, useEffect } from 'react';
import {
  Palette, Smartphone, Printer, Lock,
  Save, Camera, MonitorPlay, ShieldCheck,
  RefreshCw, Loader2, Receipt, DollarSign, CreditCard, Percent, FileText, Building2
} from 'lucide-react';
import { useStore } from '../store';
import KDS from './KDS';

type SettingsTab = 'branding' | 'hardware' | 'kds' | 'security' | 'tax' | 'payment' | 'receipt';

interface SettingsProps { }

const Settings: React.FC<SettingsProps> = () => {
  const { themeColor, setThemeColor, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('branding');
  const [primaryColor, setPrimaryColor] = useState(themeColor);
  const [secondaryColor, setSecondaryColor] = useState('#f58f78');
  const [buttonColor, setButtonColor] = useState('#F57255');
  const [fontFamily, setFontFamily] = useState('Manrope');
  const [isSaving, setIsSaving] = useState(false);

  // Default system colors
  const DEFAULT_COLORS = {
    primary: '#F57255',
    secondary: '#f58f78',
    button: '#F57255'
  };

  const handleResetColors = () => {
    setPrimaryColor(DEFAULT_COLORS.primary);
    setSecondaryColor(DEFAULT_COLORS.secondary);
    setButtonColor(DEFAULT_COLORS.button);
    showToast('Đã phục hồi về bộ màu gốc!', 'success');
  };

  useEffect(() => {
    setPrimaryColor(themeColor);
  }, [themeColor]);

  const menuItems: { id: SettingsTab; label: string; icon: any; color: string }[] = [
    { id: 'branding', label: 'Branding Kit', icon: Palette, color: 'text-pink-500' },
    { id: 'tax', label: 'Thuế & VAT', icon: Percent, color: 'text-emerald-500' },
    { id: 'payment', label: 'Thanh Toán', icon: CreditCard, color: 'text-blue-500' },
    { id: 'receipt', label: 'Hoá Đơn', icon: Receipt, color: 'text-amber-500' },
    { id: 'hardware', label: 'POS Hardware', icon: Printer, color: 'text-slate-500' },
    { id: 'kds', label: 'Kitchen (KDS)', icon: MonitorPlay, color: 'text-orange-500' },
    { id: 'security', label: 'Security', icon: Lock, color: 'text-indigo-500' },
  ];

  const handleSaveAll = () => {
    setIsSaving(true);

    setTimeout(() => {
      // Update primary color
      setThemeColor(primaryColor);
      localStorage.setItem('fastpos_primary_color', primaryColor);

      // Update CSS variables for primary and secondary
      document.documentElement.style.setProperty('--primary-500', primaryColor);
      document.documentElement.style.setProperty('--primary-600', secondaryColor);
      document.documentElement.style.setProperty('--button-color', buttonColor);

      // Calculate and set glow
      const r = parseInt(primaryColor.slice(1, 3), 16);
      const g = parseInt(primaryColor.slice(3, 5), 16);
      const b = parseInt(primaryColor.slice(5, 7), 16);
      document.documentElement.style.setProperty('--primary-glow', `rgba(${r}, ${g}, ${b}, 0.15)`);

      setIsSaving(false);
      showToast('Cấu hình hệ thống đã được cập nhật!', 'success');
    }, 1000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'kds':
        return <KDS />;
      case 'branding':
        return (
          <div className="glass-card p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-10 flex items-center gap-4 tracking-tight">
              <Palette size={24} className="text-primary" />
              Visual Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Màu sắc chủ đạo</label>
                <div className="flex items-center gap-6 p-6 bg-slate-900/5 rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-2xl">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-20 h-20 rounded-2xl cursor-pointer border-4 border-white shadow-xl overflow-hidden shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={primaryColor.toUpperCase()}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="bg-transparent font-extrabold text-slate-800 outline-none w-full text-xl"
                    />
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Primary-500</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Màu sắc phụ</label>
                <div className="flex items-center gap-6 p-6 bg-slate-900/5 rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-2xl">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-20 h-20 rounded-2xl cursor-pointer border-4 border-white shadow-xl overflow-hidden shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={secondaryColor.toUpperCase()}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="bg-transparent font-extrabold text-slate-800 outline-none w-full text-xl"
                    />
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Primary-600</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Màu sắc nút bấm</label>
                <div className="flex items-center gap-6 p-6 bg-slate-900/5 rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-2xl">
                  <input
                    type="color"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-20 h-20 rounded-2xl cursor-pointer border-4 border-white shadow-xl overflow-hidden shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={buttonColor.toUpperCase()}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="bg-transparent font-extrabold text-slate-800 outline-none w-full text-xl"
                    />
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Button & Selected</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">System Font Family</label>
                <div className="relative group">
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-slate-900/5 px-8 py-6 rounded-[2rem] font-bold text-slate-700 outline-none appearance-none border-2 border-transparent focus:border-primary focus:bg-white transition-all shadow-sm"
                  >
                    <option value="Manrope">Manrope (Enterprise Standard)</option>
                    <option value="Inter">Inter Display (System UI)</option>
                    <option value="Geist">Geist Sans (Minimalist)</option>
                  </select>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-primary transition-colors">
                    <RefreshCw size={20} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-100">
              <button
                onClick={handleResetColors}
                className="flex items-center gap-3 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all"
              >
                <RefreshCw size={16} />
                Phục hồi bộ màu gốc
              </button>
            </div>
          </div>
        );
      case 'hardware':
        return (
          <div className="glass-card p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-10 flex items-center gap-4 tracking-tight">
              <Printer size={24} className="text-slate-500" />
              Hardware Peripherals
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Thermal Receipt Printer', model: 'EPSON TM-T88VI', status: 'Connected', icon: Printer },
                { label: 'Customer Facing Display', model: 'Android Tablet v14', status: 'Active', icon: Smartphone },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between p-8 bg-white/40 border border-white rounded-[2.5rem] shadow-sm transition-all hover:bg-white hover:shadow-xl">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-white rounded-2xl text-slate-400 shadow-lg border border-slate-100"><h.icon size={28} /></div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-lg leading-tight">{h.label}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{h.model}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-emerald-100">Online</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="glass-card p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-10 flex items-center gap-4 tracking-tight">
              <Lock size={24} className="text-primary" />
              Access & Authorization
            </h3>
            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-6">Manager Master PIN</label>
                  <input type="password" value="••••" readOnly className="w-full bg-slate-900/5 px-8 py-6 rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-6">Auto-Lock Idle (Minutes)</label>
                  <input type="number" defaultValue="30" className="w-full bg-slate-900/5 px-8 py-6 rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all" />
                </div>
              </div>
              <button className="flex items-center gap-3 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all w-full justify-center">
                <ShieldCheck size={20} />
                Audit Permission Logs
              </button>
            </div>
          </div>
        );
      case 'tax':
        return (
          <div className="glass-card p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-10 flex items-center gap-4 tracking-tight">
              <Percent size={24} className="text-emerald-500" />
              Cấu hình Thuế
            </h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Thuế VAT (%)</label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full bg-slate-900/5 px-8 py-6 rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Thuế GTGT (%)</label>
                  <input
                    type="number"
                    defaultValue={0}
                    className="w-full bg-slate-900/5 px-8 py-6 rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Mã số thuế doanh nghiệp</label>
                <input
                  type="text"
                  defaultValue="0102348765"
                  className="w-full bg-slate-900/5 px-8 py-6 rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all"
                />
              </div>
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-500" />
                  <div>
                    <span className="font-bold text-slate-800">Tự động tính thuế vào giá bán</span>
                    <p className="text-xs text-slate-500 mt-1">Giá hiển thị đã bao gồm thuế VAT</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="glass-card p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-10 flex items-center gap-4 tracking-tight">
              <CreditCard size={24} className="text-blue-500" />
              Phương thức thanh toán
            </h3>
            <div className="space-y-4">
              {[
                { method: 'Tiền mặt', icon: DollarSign, enabled: true },
                { method: 'Thẻ tín dụng/Debit', icon: CreditCard, enabled: true },
                { method: 'Chuyển khoản', icon: Building2, enabled: true },
                { method: 'Công nợ (Credit)', icon: FileText, enabled: true },
              ].map((pm, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/40 border border-white rounded-2xl hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                      <pm.icon size={20} />
                    </div>
                    <span className="font-bold text-slate-800">{pm.method}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={pm.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
              <h4 className="font-bold text-slate-800 mb-3">Tích hợp thanh toán điện tử</h4>
              <p className="text-sm text-slate-500 mb-4">Kết nối với cổng thanh toán để nhận QR Pay, MoMo, ZaloPay...</p>
              <button className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all">
                Cấu hình API Gateway
              </button>
            </div>
          </div>
        );
      case 'receipt':
        return (
          <div className="glass-card p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-xl font-extrabold text-slate-800 mb-10 flex items-center gap-4 tracking-tight">
              <Receipt size={24} className="text-amber-500" />
              Mẫu hoá đơn
            </h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tiêu đề hoá đơn</label>
                  <input
                    type="text"
                    defaultValue="HOÁ ĐƠN BÁN HÀNG"
                    className="w-full bg-slate-900/5 px-8 py-6 rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Lời cảm ơn</label>
                  <input
                    type="text"
                    defaultValue="Cảm ơn quý khách!"
                    className="w-full bg-slate-900/5 px-8 py-6 rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Chân trang hoá đơn</label>
                <textarea
                  defaultValue="Hotline: 1900 1234\nWebsite: fastpos.vn"
                  className="w-full bg-slate-900/5 px-8 py-6 rounded-[2rem] font-bold text-slate-800 outline-none border border-transparent focus:border-primary transition-all resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="p-6 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-primary transition-all">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary mr-3" />
                  <span className="font-bold text-slate-800">In logo</span>
                </label>
                <label className="p-6 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-primary transition-all">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary mr-3" />
                  <span className="font-bold text-slate-800">In QR thanh toán</span>
                </label>
                <label className="p-6 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-primary transition-all">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary mr-3" />
                  <span className="font-bold text-slate-800">In mã vạch</span>
                </label>
                <label className="p-6 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-primary transition-all">
                  <input type="checkbox" className="w-4 h-4 accent-primary mr-3" />
                  <span className="font-bold text-slate-800">In chi tiết thuế</span>
                </label>
              </div>
              <button className="w-full py-5 bg-slate-100 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
                <Printer size={18} />
                In thử hoá đơn mẫu
              </button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex items-start gap-10 p-4">
      <aside className="w-72 shrink-0 space-y-2 h-fit sticky top-28">
        <div className="px-6 mb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Config</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">System foundations</p>
        </div>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] font-bold text-[13px] transition-all relative group shadow-sm ${activeTab === item.id
              ? 'bg-primary text-white shadow-xl shadow-primary-glow scale-105 active:scale-95'
              : 'text-slate-400 bg-white/40 border border-white hover:bg-white hover:text-slate-900 hover:shadow-lg'
              }`}
          >
            <div className={`shrink-0 ${activeTab === item.id ? 'text-white' : item.color}`}>
              <item.icon size={22} />
            </div>
            <span className="uppercase tracking-widest leading-none">{item.label}</span>
          </button>
        ))}
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between mb-10">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse hidden md:block" />
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`bg-primary text-white px-12 py-5 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary-glow hover:bg-slate-900 transition-all text-[11px] uppercase tracking-wider scale-105 active:scale-95 ${isSaving ? 'opacity-70 grayscale' : ''}`}
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={18} className="group-hover:scale-110 transition-transform" />
                Commit Updates
              </>
            )}
          </button>
        </header>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Settings;
