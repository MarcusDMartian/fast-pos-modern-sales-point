
import React, { useState } from 'react';
import { Building2, Camera, Save, Globe, Hash, Coins, MapPin, Loader2 } from 'lucide-react';
import { useStore } from '../store';
import { EnterpriseConfig } from '../types';

const Enterprise: React.FC = () => {
  const { enterpriseConfig, setEnterpriseConfig, showToast } = useStore();
  const [tempConfig, setTempConfig] = useState<EnterpriseConfig>(enterpriseConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      setEnterpriseConfig(tempConfig);
      setIsSaving(false);
      showToast('Enterprise profile updated successfully!', 'success');
      window.dispatchEvent(new Event('enterprise_updated'));
    }, 1000);
  };

  const handleLogoChange = () => {
    const newUrl = prompt('Enter image URL for logo:', tempConfig.logo);
    if (newUrl) setTempConfig({ ...tempConfig, logo: newUrl });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight flex items-center gap-4 mb-2">
            <Building2 className="text-primary" size={32} />
            Enterprise Matrix
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Global business configuration & branding hub</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`bg-primary text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary-glow hover:bg-slate-900 transition-all text-[11px] uppercase tracking-wider scale-105 active:scale-95 ${isSaving ? 'opacity-70 grayscale' : ''}`}
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Synchronizing...
            </>
          ) : (
            <>
              <Save size={18} />
              Commit Profile
            </>
          )}
        </button>
      </header>

      <div className="glass-card p-12 animate-in fade-in duration-700">
        {/* Branding Section */}        <div className="flex flex-col md:flex-row items-center gap-12 pb-12 border-b border-slate-50">
          <div className="relative group shrink-0">
            <div className="w-48 h-48 rounded-[3.5rem] bg-white border-4 border-white shadow-2xl flex flex-col items-center justify-center relative overflow-hidden p-8 transition-transform duration-500 group-hover:scale-105">
              {tempConfig.logo ? (
                <img
                  src={tempConfig.logo}
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
                className="w-full h-full flex items-center justify-center bg-primary text-white text-7xl font-extrabold rounded-3xl shadow-inner border border-white/20"
                style={{ display: tempConfig.logo ? 'none' : 'flex' }}
              >
                {tempConfig.name ? tempConfig.name.charAt(0).toUpperCase() : 'F'}
              </div>
              <button
                onClick={handleLogoChange}
                className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 cursor-pointer backdrop-blur-sm"
              >
                <Camera size={28} />
                <span className="text-[10px] font-black uppercase tracking-widest text-center px-6">Change Logo</span>
              </button>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Globe size={18} />
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Registered Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={20} />
                <input
                  type="text"
                  value={tempConfig.name}
                  onChange={(e) => setTempConfig({ ...tempConfig, name: e.target.value })}
                  placeholder="Enter legal entity name..."
                  className="w-full bg-slate-900/5 px-16 py-7 rounded-[2.5rem] text-2xl font-extrabold text-slate-800 outline-none border-2 border-transparent focus:border-primary focus:bg-white transition-all shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Identification & Finance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Tax ID / Business Number</label>
            <div className="relative">
              <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
              <input
                type="text"
                value={tempConfig.taxId}
                onChange={(e) => setTempConfig({ ...tempConfig, taxId: e.target.value })}
                className="w-full bg-slate-900/5 px-14 py-6 rounded-[2rem] font-bold text-slate-700 outline-none border-2 border-transparent focus:border-primary focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">System Base Currency</label>
            <div className="relative">
              <Coins className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" size={18} />
              <select
                value={tempConfig.currency}
                onChange={(e) => setTempConfig({ ...tempConfig, currency: e.target.value })}
                className="w-full bg-slate-900/5 px-14 py-6 rounded-[2rem] font-bold text-slate-700 outline-none appearance-none cursor-pointer border-2 border-transparent focus:border-primary focus:bg-white transition-all shadow-sm"
              >
                <option>USD ($)</option>
                <option>VND (₫)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3">Headquarters Address</label>
          <div className="relative">
            <MapPin className="absolute left-6 top-7 text-primary/30" size={20} />
            <textarea
              rows={4}
              value={tempConfig.address}
              onChange={(e) => setTempConfig({ ...tempConfig, address: e.target.value })}
              className="w-full bg-slate-900/5 px-16 py-7 rounded-[2.5rem] font-bold text-slate-700 outline-none border-2 border-transparent focus:border-primary focus:bg-white transition-all resize-none shadow-sm"
              placeholder="Enter physical business address..."
            />
          </div>
        </div>
      </div>

      <div className="p-10 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl flex items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px]" />
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary shadow-lg backdrop-blur-md border border-white/5 shrink-0 relative z-10">
          <Globe size={32} />
        </div>
        <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest relative z-10">
          This identification data is utilized for legal invoicing, customer documentation, and standardized financial reporting within the Fast POS ecosystem.
        </p>
      </div>
    </div>
  );
};

export default Enterprise;
