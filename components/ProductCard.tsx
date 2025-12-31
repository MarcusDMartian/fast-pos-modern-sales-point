
import React from 'react';
import { Product } from '../types';
import { Plus, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, isFavorite, onToggleFavorite }) => {
  return (
    <div className="glass-card flex flex-col h-full group transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => onAdd(product)}>
      <div className="relative w-full pb-[100%] overflow-hidden bg-slate-100 flex items-center justify-center">
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
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 text-primary text-4xl font-black italic select-none"
          style={{ display: product.image ? 'none' : 'flex' }}
        >
          {product.name.charAt(0).toUpperCase()}
        </div>
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-white/40 backdrop-blur-md text-slate-700 shadow-sm">
          {product.category}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className={`absolute top-2 left-2 p-1.5 rounded-lg backdrop-blur-md transition-all duration-300 ${isFavorite
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-white/30 text-white hover:bg-white/60 hover:text-red-500'
            }`}
        >
          <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="mb-2">
          <h3 className="font-bold text-slate-800 text-[13px] leading-tight line-clamp-2">{product.name}</h3>
          <p className="text-slate-400 text-[10px] font-medium mt-1">{product.stock} left</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-slate-900 tracking-tight">${product.price.toFixed(2)}</span>
          <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-glow group-hover:scale-110 transition-transform">
            <Plus size={16} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
