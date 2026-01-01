
import React, { useState } from 'react';
import { Heart, Sparkles, DollarSign, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import { getCurrencySymbol } from '../utils/formatters';
import { LoyaltyConfig } from '../types';

const Loyalty: React.FC = () => {
  const { t } = useTranslation();
  const { loyaltyConfig, setLoyaltyConfig, showToast, enterpriseConfig } = useStore();
  const [loyalty, setLoyalty] = useState<LoyaltyConfig>(loyaltyConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setLoyaltyConfig(loyalty);
      setIsSaving(false);
      showToast(t('loyalty.save_success'), 'success');
    }, 1000);
  };

  const addTier = () => {
    setLoyalty({
      ...loyalty,
      tiers: [...loyalty.tiers, { name: t('loyalty.default_tier_name'), threshold: 0, discount: 0 }]
    });
  };

  const removeTier = (index: number) => {
    if (window.confirm(t('loyalty.delete_confirm'))) {
      const newTiers = loyalty.tiers.filter((_, i) => i !== index);
      setLoyalty({ ...loyalty, tiers: newTiers });
    }
  };

  const updateTier = (index: number, field: keyof typeof loyalty.tiers[0], value: string | number) => {
    const newTiers = [...loyalty.tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setLoyalty({ ...loyalty, tiers: newTiers });
  };

  const currencySymbol = getCurrencySymbol(enterpriseConfig.currency);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Heart className="text-red-500" size={32} fill="currentColor" />
            {t('loyalty.title')}
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
            {t('loyalty.subtitle')}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`ui-button-primary px-10 py-4 text-[11px] flex items-center gap-3 uppercase tracking-widest shadow-2xl transition-all ${isSaving ? 'opacity-70 scale-95' : ''}`}
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {t('loyalty.saving')}
            </>
          ) : (
            <>
              <Save size={18} /> {t('loyalty.save_btn')}
            </>
          )}
        </button>
      </header>

      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-slate-50 p-8 rounded-[2rem] space-y-4 border border-slate-100 shadow-inner">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
              {t('loyalty.earning_rate', { symbol: currencySymbol })}
            </label>
            <div className="relative">
              <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={20} />
              <input
                type="number"
                value={loyalty.earningRate}
                onChange={(e) => setLoyalty({ ...loyalty, earningRate: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white pl-16 pr-6 py-5 rounded-2xl text-xl font-black text-slate-900 outline-none border-2 border-transparent focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] space-y-4 border border-slate-100 shadow-inner">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
              {t('loyalty.redemption_rate', { symbol: currencySymbol })}
            </label>
            <div className="relative">
              <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
              <input
                type="number"
                value={loyalty.redemptionRate}
                onChange={(e) => setLoyalty({ ...loyalty, redemptionRate: parseFloat(e.target.value) || 0 })}
                className="w-full bg-white pl-16 pr-6 py-5 rounded-2xl text-xl font-black text-slate-900 outline-none border-2 border-transparent focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {t('loyalty.tiers_title')}
            </h4>
            <button
              onClick={addTier}
              className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-wider"
            >
              <Plus size={14} /> {t('loyalty.add_tier')}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loyalty.tiers.map((tier, idx) => (
              <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-blue-200 transition-all group relative">
                <div className="flex-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">{t('loyalty.tier_name')}</label>
                  <input
                    value={tier.name}
                    onChange={(e) => updateTier(idx, 'name', e.target.value)}
                    className="w-full bg-transparent font-black text-slate-900 outline-none"
                  />
                </div>
                <div className="w-32">
                  <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">{t('loyalty.points_threshold')}</label>
                  <input
                    type="number"
                    value={tier.threshold}
                    onChange={(e) => updateTier(idx, 'threshold', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-slate-900 outline-none"
                  />
                </div>
                <div className="w-20">
                  <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">{t('loyalty.discount_percent')}</label>
                  <input
                    type="number"
                    value={tier.discount}
                    onChange={(e) => updateTier(idx, 'discount', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-blue-600 outline-none"
                  />
                </div>
                <div className="w-20">
                  <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">{t('loyalty.birthday_discount')}</label>
                  <input
                    type="number"
                    value={tier.birthdayDiscount || 0}
                    onChange={(e) => updateTier(idx, 'birthdayDiscount', parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent font-black text-pink-500 outline-none"
                  />
                </div>
                <button
                  onClick={() => removeTier(idx)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all ml-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;
