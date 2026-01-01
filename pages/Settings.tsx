import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Palette, Smartphone, Printer, Lock,
  Save, Camera, MonitorPlay, ShieldCheck,
  RefreshCw, Loader2, Receipt, DollarSign, CreditCard, Percent, FileText, Building2,
  Languages, CheckCircle2
} from 'lucide-react';
import { useStore } from '../store';
import KDS from './KDS';

type SettingsTab = 'general' | 'branding' | 'hardware' | 'kds' | 'security' | 'tax' | 'payment' | 'receipt';

interface SettingsProps { }

const Settings: React.FC<SettingsProps> = () => {
  const { t, i18n } = useTranslation();
  const { themeColor, setThemeColor, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [primaryColor, setPrimaryColor] = useState(themeColor);
  const [secondaryColor, setSecondaryColor] = useState('#f58f78');
  const [buttonColor, setButtonColor] = useState('var(--primary-600)');
  const [fontFamily, setFontFamily] = useState('Manrope');
  const [isSaving, setIsSaving] = useState(false);

  // Default system colors
  const DEFAULT_COLORS = {
    primary: 'var(--primary-600)',
    secondary: '#f58f78',
    button: 'var(--primary-600)'
  };

  const handleResetColors = () => {
    setPrimaryColor(DEFAULT_COLORS.primary);
    setSecondaryColor(DEFAULT_COLORS.secondary);
    setButtonColor(DEFAULT_COLORS.button);
    showToast(t('settings.reset_colors'), 'success');
  };

  useEffect(() => {
    setPrimaryColor(themeColor);
  }, [themeColor]);

  const menuItems: { id: SettingsTab; label: string; icon: any; color: string }[] = [
    { id: 'general', label: t('settings.general'), icon: Languages, color: 'text-indigo-500' },
    { id: 'branding', label: t('settings.branding'), icon: Palette, color: 'text-pink-500' },
    { id: 'tax', label: t('settings.tax'), icon: Percent, color: 'text-emerald-500' },
    { id: 'payment', label: t('settings.payment'), icon: CreditCard, color: 'text-blue-500' },
    { id: 'receipt', label: t('settings.receipt'), icon: Receipt, color: 'text-amber-500' },
    { id: 'hardware', label: t('settings.hardware'), icon: Printer, color: 'text-slate-500' },
    { id: 'kds', label: t('settings.kds'), icon: MonitorPlay, color: 'text-orange-500' },
    { id: 'security', label: t('settings.security'), icon: Lock, color: 'text-indigo-500' },
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
      showToast(t('common.success'), 'success');
    }, 1000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'kds':
        return <KDS />;
      case 'general':
        return (
          <div className="glass-card p-6 md:p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-6 md:mb-10 flex items-center gap-3 md:gap-4 tracking-tight">
              <Languages size={20} className="md:w-6 md:h-6 text-indigo-500" />
              {t('settings.general_title')}
            </h3>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                  {t('settings.language_label')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
                    { id: 'en', label: 'English', flag: '🇺🇸' }
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        i18n.changeLanguage(lang.id);
                        showToast(lang.id === 'vi' ? 'Đã đổi sang Tiếng Việt' : 'Switched to English', 'success');
                      }}
                      className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${i18n.language === lang.id
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5 scale-[1.02]'
                        : 'border-white bg-white/40 hover:border-slate-200 hover:bg-white'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className={`font-black uppercase tracking-tight ${i18n.language === lang.id ? 'text-primary' : 'text-slate-600'
                          }`}>{lang.label}</span>
                      </div>
                      {i18n.language === lang.id && (
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'branding':
        return (
          <div className="glass-card p-6 md:p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-6 md:mb-10 flex items-center gap-3 md:gap-4 tracking-tight">
              <Palette size={20} className="md:w-6 md:h-6 text-primary" />
              {t('settings.visual_identity')}
            </h3>
            <div className="grid grid-cols-1 gap-6 md:gap-10">
              <div className="space-y-3 md:space-y-4">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t('settings.primary_color')}</label>
                <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-slate-900/5 rounded-xl md:rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-xl">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl cursor-pointer border-2 md:border-4 border-white shadow-lg md:shadow-xl overflow-hidden shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={primaryColor.toUpperCase()}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="bg-transparent font-extrabold text-slate-800 outline-none w-full text-base md:text-xl"
                    />
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Primary-500</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t('settings.secondary_color')}</label>
                <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-slate-900/5 rounded-xl md:rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-xl">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl cursor-pointer border-2 md:border-4 border-white shadow-lg md:shadow-xl overflow-hidden shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={secondaryColor.toUpperCase()}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="bg-transparent font-extrabold text-slate-800 outline-none w-full text-base md:text-xl"
                    />
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Primary-600</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t('settings.button_color')}</label>
                <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-slate-900/5 rounded-xl md:rounded-[2rem] border border-slate-100 group transition-all hover:bg-white hover:shadow-xl">
                  <input
                    type="color"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl cursor-pointer border-2 md:border-4 border-white shadow-lg md:shadow-xl overflow-hidden shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={buttonColor.toUpperCase()}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="bg-transparent font-extrabold text-slate-800 outline-none w-full text-base md:text-xl"
                    />
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Button & Selected</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t('settings.font_family')}</label>
                <div className="relative group">
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full bg-slate-900/5 px-5 md:px-8 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-bold text-sm md:text-base text-slate-700 outline-none appearance-none border-2 border-transparent focus:border-primary focus:bg-white transition-all shadow-sm"
                  >
                    <option value="Manrope">Manrope (Enterprise)</option>
                    <option value="Inter">Inter Display</option>
                    <option value="Geist">Geist Sans</option>
                  </select>
                  <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover:text-primary transition-colors">
                    <RefreshCw size={16} className="md:w-5 md:h-5" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-100">
              <button
                onClick={handleResetColors}
                className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] md:text-xs uppercase tracking-widest rounded-xl md:rounded-2xl transition-all"
              >
                <RefreshCw size={14} className="md:w-4 md:h-4" />
                <span className="hidden md:inline">{t('settings.reset_colors')}</span>
                <span className="md:hidden">Reset</span>
              </button>
            </div>
          </div>
        );
      case 'hardware':
        return (
          <div className="glass-card p-6 md:p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-6 md:mb-10 flex items-center gap-3 md:gap-4 tracking-tight">
              <Printer size={20} className="md:w-6 md:h-6 text-slate-500" />
              {t('settings.hardware')}
            </h3>
            <div className="space-y-4 md:space-y-6">
              {[
                { label: 'Thermal Printer', model: 'EPSON TM-T88VI', status: 'Connected', icon: Printer },
                { label: 'Customer Display', model: 'Android Tablet', status: 'Active', icon: Smartphone },
              ].map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 md:p-8 bg-white/40 border border-white rounded-xl md:rounded-[2.5rem] shadow-sm transition-all hover:bg-white hover:shadow-xl">
                  <div className="flex items-center gap-3 md:gap-6">
                    <div className="p-2.5 md:p-4 bg-white rounded-lg md:rounded-2xl text-slate-400 shadow-lg border border-slate-100"><h.icon size={20} className="md:w-7 md:h-7" /></div>
                    <div>
                      <p className="font-extrabold text-slate-800 text-sm md:text-lg leading-tight">{h.label}</p>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{h.model}</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 px-3 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest border border-emerald-100">{t('settings.online')}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="glass-card p-6 md:p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-6 md:mb-10 flex items-center gap-3 md:gap-4 tracking-tight">
              <Lock size={20} className="md:w-6 md:h-6 text-primary" />
              {t('settings.security')}
            </h3>
            <div className="space-y-6 md:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 md:px-6">Manager PIN</label>
                  <input type="password" value="••••" readOnly className="w-full bg-slate-900/5 px-5 md:px-8 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all" />
                </div>
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 md:px-6">{t('settings.auto_lock')}</label>
                  <input type="number" defaultValue="30" className="w-full bg-slate-900/5 px-5 md:px-8 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all" />
                </div>
              </div>
              <button className="flex items-center gap-2 md:gap-3 p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-[2rem] border border-slate-100 text-indigo-600 font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all w-full justify-center">
                <ShieldCheck size={16} className="md:w-5 md:h-5" />
                Audit Logs
              </button>
            </div>
          </div>
        );
      case 'tax':
        return (
          <div className="glass-card p-6 md:p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-6 md:mb-10 flex items-center gap-3 md:gap-4 tracking-tight">
              <Percent size={20} className="md:w-6 md:h-6 text-emerald-500" />
              {t('settings.tax_vat')}
            </h3>
            <div className="space-y-5 md:space-y-8">
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">VAT (%)</label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full bg-slate-900/5 px-4 md:px-8 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">GTGT (%)</label>
                  <input
                    type="number"
                    defaultValue={0}
                    className="w-full bg-slate-900/5 px-4 md:px-8 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2 md:space-y-4">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t('settings.tax_id')}</label>
                <input
                  type="text"
                  defaultValue="0102348765"
                  className="w-full bg-slate-900/5 px-4 md:px-8 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-extrabold text-slate-800 outline-none border border-transparent focus:border-primary transition-all"
                />
              </div>
              <div className="p-4 md:p-6 bg-emerald-50 border border-emerald-200 rounded-xl md:rounded-2xl">
                <label className="flex items-center gap-3 md:gap-4 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 md:w-5 md:h-5 accent-emerald-500" />
                  <div>
                    <span className="font-bold text-sm md:text-base text-slate-800">{t('settings.auto_tax')}</span>
                    <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">{t('settings.price_includes_vat')}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="glass-card p-6 md:p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-6 md:mb-10 flex items-center gap-3 md:gap-4 tracking-tight">
              <CreditCard size={20} className="md:w-6 md:h-6 text-blue-500" />
              {t('settings.payment')}
            </h3>
            <div className="space-y-3 md:space-y-4">
              {[
                { method: t('payment.cash'), icon: DollarSign, enabled: true },
                { method: t('payment.card'), icon: CreditCard, enabled: true },
                { method: t('payment.transfer'), icon: Building2, enabled: true },
                { method: t('customers.in_debt'), icon: FileText, enabled: true },
              ].map((pm, i) => (
                <div key={i} className="flex items-center justify-between p-4 md:p-6 bg-white/40 border border-white rounded-xl md:rounded-2xl hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-blue-50 text-blue-500 rounded-lg md:rounded-xl">
                      <pm.icon size={16} className="md:w-5 md:h-5" />
                    </div>
                    <span className="font-bold text-sm md:text-base text-slate-800">{pm.method}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={pm.enabled} className="sr-only peer" />
                    <div className="w-9 h-5 md:w-11 md:h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 md:after:h-5 after:w-4 md:after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-amber-50 border border-amber-200 rounded-xl md:rounded-2xl">
              <h4 className="font-bold text-sm md:text-base text-slate-800 mb-2 md:mb-3">{t('settings.e_payment')}</h4>
              <p className="text-[11px] md:text-sm text-slate-500 mb-3 md:mb-4">{t('settings.e_payment_desc')}</p>
              <button className="px-4 md:px-6 py-2.5 md:py-3 bg-amber-500 text-white font-bold text-sm rounded-lg md:rounded-xl hover:bg-amber-600 transition-all">
                {t('settings.api_config')}
              </button>
            </div>
          </div>
        );
      case 'receipt':
        return (
          <div className="glass-card p-6 md:p-12 animate-in fade-in slide-in-from-bottom duration-500">
            <h3 className="text-lg md:text-xl font-extrabold text-slate-800 mb-6 md:mb-10 flex items-center gap-3 md:gap-4 tracking-tight">
              <Receipt size={20} className="md:w-6 md:h-6 text-amber-500" />
              {t('settings.receipt')}
            </h3>
            <div className="space-y-5 md:space-y-8">
              <div className="grid grid-cols-1 gap-4 md:gap-8">
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t('settings.receipt_header')}</label>
                  <input
                    type="text"
                    defaultValue="HOÁ ĐƠN BÁN HÀNG"
                    className="w-full bg-slate-900/5 px-4 md:px-8 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-extrabold text-sm md:text-base text-slate-800 outline-none border border-transparent focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2 md:space-y-4">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t('settings.receipt_thanks')}</label>
                  <input
                    type="text"
                    defaultValue="Cảm ơn quý khách!"
                    className="w-full bg-slate-900/5 px-4 md:px-8 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-extrabold text-sm md:text-base text-slate-800 outline-none border border-transparent focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2 md:space-y-4">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t('settings.receipt_footer')}</label>
                <textarea
                  defaultValue="Hotline: 1900 1234\nWebsite: fastpos.vn"
                  className="w-full bg-slate-900/5 px-4 md:px-8 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-bold text-sm md:text-base text-slate-800 outline-none border border-transparent focus:border-primary transition-all resize-none"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <label className="p-3 md:p-6 bg-slate-50 border border-slate-200 rounded-lg md:rounded-2xl cursor-pointer hover:border-primary transition-all flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 md:w-4 md:h-4 accent-primary" />
                  <span className="font-bold text-xs md:text-sm text-slate-800">Logo</span>
                </label>
                <label className="p-3 md:p-6 bg-slate-50 border border-slate-200 rounded-lg md:rounded-2xl cursor-pointer hover:border-primary transition-all flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 md:w-4 md:h-4 accent-primary" />
                  <span className="font-bold text-xs md:text-sm text-slate-800">QR</span>
                </label>
                <label className="p-3 md:p-6 bg-slate-50 border border-slate-200 rounded-lg md:rounded-2xl cursor-pointer hover:border-primary transition-all flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 md:w-4 md:h-4 accent-primary" />
                  <span className="font-bold text-xs md:text-sm text-slate-800">Barcode</span>
                </label>
                <label className="p-3 md:p-6 bg-slate-50 border border-slate-200 rounded-lg md:rounded-2xl cursor-pointer hover:border-primary transition-all flex items-center gap-2">
                  <input type="checkbox" className="w-3.5 h-3.5 md:w-4 md:h-4 accent-primary" />
                  <span className="font-bold text-xs md:text-sm text-slate-800">Thuế</span>
                </label>
              </div>
              <button className="w-full py-4 md:py-5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 hover:bg-slate-200 transition-all">
                <Printer size={16} className="md:w-4.5 md:h-4.5" />
                {t('settings.print_test')}
              </button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="p-3 md:p-4">
      {/* Mobile Header */}
      <div className="md:hidden mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{t('sidebar.settings')}</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t('settings.system_config')}</p>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`bg-primary text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg text-[10px] uppercase ${isSaving ? 'opacity-70' : ''}`}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{t('common.save')}</span>
          </button>
        </div>
        {/* Mobile Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-[11px] transition-all ${activeTab === item.id
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white/60 text-slate-500 border border-slate-100'
                }`}
            >
              <item.icon size={14} />
              <span className="whitespace-nowrap">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex items-start gap-10">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-72 shrink-0 space-y-2 h-fit sticky top-28">
          <div className="px-6 mb-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{t('settings.config_title')}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t('settings.config_subtitle')}</p>
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

        <div className="flex-1 min-w-0">
          {/* Desktop Header */}
          <header className="hidden md:flex items-center justify-between mb-10">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className={`bg-primary text-white px-12 py-5 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary-glow hover:bg-slate-900 transition-all text-[11px] uppercase tracking-wider scale-105 active:scale-95 ${isSaving ? 'opacity-70 grayscale' : ''}`}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t('settings.saving')}
                </>
              ) : (
                <>
                  <Save size={18} className="group-hover:scale-110 transition-transform" />
                  {t('settings.commit_updates')}
                </>
              )}
            </button>
          </header>

          <main>
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
