import React from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../types';
import { Plus, Heart } from 'lucide-react';
import { useStore } from '../store';
import { formatCurrency } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, isFavorite, onToggleFavorite }) => {
  const { t } = useTranslation();
  const { enterpriseConfig } = useStore();

  return (
    <div className="glass-card flex flex-col h-full group transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => onAdd(product)}>
      <div className="relative w-full pb-[80%] md:pb-[100%] overflow-hidden bg-slate-100 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-primary text-2xl md:text-4xl font-black italic select-none"
          style={{ display: product.image ? 'none' : 'flex' }}
        >
          {product.name.charAt(0).toUpperCase()}
        </div>
        <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 px-1.5 md:px-2 py-0.5 rounded-md text-[7px] md:text-[9px] font-black uppercase bg-white/40 backdrop-blur-md text-slate-700 shadow-sm">
          {product.category}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className={`absolute top-1.5 left-1.5 md:top-2 md:left-2 p-1 md:p-1.5 rounded-lg backdrop-blur-md transition-all duration-300 ${isFavorite
            ? 'bg-red-500 text-white shadow-lg'
            : 'bg-white/30 text-white hover:bg-white/60 hover:text-red-500'
            }`}
        >
          <Heart size={12} className="md:w-3.5 md:h-3.5" fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-2 md:p-3 flex-1 flex flex-col justify-between">
        <div className="mb-1 md:mb-2">
          <h3 className="font-bold text-slate-800 text-[11px] md:text-[13px] leading-tight line-clamp-2">{product.name}</h3>
          <p className="text-slate-400 text-[8px] md:text-[10px] font-medium mt-0.5 md:mt-1">
            {product.stock} {t('inventory.stock_actual').toLowerCase()}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs md:text-sm font-black text-slate-900 tracking-tight">{formatCurrency(product.price, enterpriseConfig.currency)}</span>
          <div className="w-6 h-6 md:w-7 md:h-7 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-glow group-hover:scale-110 transition-transform">
            <Plus size={14} className="md:w-4 md:h-4" strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
