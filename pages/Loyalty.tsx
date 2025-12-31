
import React, { useState } from 'react';
import { Heart, Sparkles, DollarSign, Save, Loader2 } from 'lucide-react';
import { useStore } from '../store';
import { LoyaltyConfig } from '../types';

const Loyalty: React.FC = () => {
  const { loyaltyConfig, setLoyaltyConfig, showToast } = useStore();
  const [loyalty, setLoyalty] = useState<LoyaltyConfig>(loyaltyConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      setLoyaltyConfig(loyalty);
      setIsSaving(false);
      showToast('Loyalty settings saved!', 'success');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Heart className="text-red-500" size={32} fill="currentColor" />
            Loyalty Program
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Configure points and membership tiers</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`ui-button-primary px-10 py-4 text-[11px] flex items-center gap-3 uppercase tracking-widest shadow-2xl transition-all ${isSaving ? 'opacity-70 scale-95' : ''}`}
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving Config...
            </>
          ) : (
            <>
              <Save size={18} /> Save Config
            </>
          )}
        </button>
      </header>

      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-slate-50 p-8 rounded-[2rem] space-y-4 border border-slate-100 shadow-inner">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Earning Rate ($1 = X Points)</label>
            <div className="relative">
              <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
              <input
                type="number"
                value={loyalty.earningRate}
                onChange={(e) => setLoyalty({ ...loyalty, earningRate: parseFloat(e.target.value) })}
                className="w-full bg-white pl-16 pr-6 py-5 rounded-2xl text-xl font-black text-slate-900 outline-none border-2 border-transparent focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] space-y-4 border border-slate-100 shadow-inner">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Redemption Rate (X Points = $1)</label>
            <div className="relative">
              <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
              <input
                type="number"
                value={loyalty.redemptionRate}
                onChange={(e) => setLoyalty({ ...loyalty, redemptionRate: parseFloat(e.target.value) })}
                className="w-full bg-white pl-16 pr-6 py-5 rounded-2xl text-xl font-black text-slate-900 outline-none border-2 border-transparent focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Membership Tiers</h4>
          <div className="grid grid-cols-1 gap-4">
            {loyalty.tiers.map((tier, idx) => (
              <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-blue-200 transition-all group">
                <div className="flex-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Tier Name</label>
                  <input value={tier.name} onChange={(e) => {
                    const newTiers = [...loyalty.tiers]; newTiers[idx].name = e.target.value; setLoyalty({ ...loyalty, tiers: newTiers });
                  }} className="w-full bg-transparent font-black text-slate-900 outline-none" />
                </div>
                <div className="w-32">
                  <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Threshold</label>
                  <input type="number" value={tier.threshold} onChange={(e) => {
                    const newTiers = [...loyalty.tiers]; newTiers[idx].threshold = parseFloat(e.target.value); setLoyalty({ ...loyalty, tiers: newTiers });
                  }} className="w-full bg-transparent font-black text-slate-900 outline-none" />
                </div>
                <div className="w-20">
                  <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">Discount%</label>
                  <input type="number" value={tier.discount} onChange={(e) => {
                    const newTiers = [...loyalty.tiers]; newTiers[idx].discount = parseFloat(e.target.value); setLoyalty({ ...loyalty, tiers: newTiers });
                  }} className="w-full bg-transparent font-black text-blue-600 outline-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;
