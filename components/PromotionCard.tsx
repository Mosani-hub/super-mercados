
import React from 'react';
import { Plus, Tag, ExternalLink } from 'lucide-react';
import { PromotionWithProduct } from '../types';

interface PromotionCardProps {
  promo: PromotionWithProduct;
  onAddToList: (productId: string) => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promo, onAddToList }) => {
  const handleOpenWebsite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (promo.supermarket.websiteUrl) {
      window.open(promo.supermarket.websiteUrl, '_blank');
    }
  };

  return (
    <div className="card-elevated flex items-center gap-4 p-3 relative overflow-hidden group">
      <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-md z-10 flex items-center gap-1">
        <Tag className="w-2.5 h-2.5" />
        -{promo.savings_percent}%
      </div>
      
      <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-50 relative">
        <img src={promo.product.image} alt={promo.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {promo.supermarket.websiteUrl && (
          <button 
            onClick={handleOpenWebsite}
            className="absolute bottom-1 right-1 p-1 bg-white/80 backdrop-blur-sm rounded-lg text-emerald-600 shadow-sm border border-slate-100 hover:bg-emerald-600 hover:text-white transition-all"
            title="Ver no site"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">{promo.product.brand}</p>
        <h3 className="font-semibold text-sm text-slate-800 truncate leading-tight mb-1">{promo.product.name}</h3>
        
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-100">
            <img src={promo.supermarket.logo} alt={promo.supermarket.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] font-bold text-slate-500">{promo.supermarket.name}</span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-emerald-600">R$ {promo.current_price.toFixed(2)}</span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase">/ {promo.unit}</span>
          {promo.previous_price && (
            <span className="ml-2 text-[10px] text-slate-400 line-through font-medium">R$ {promo.previous_price.toFixed(2)}</span>
          )}
        </div>
      </div>

      <button 
        onClick={() => onAddToList(promo.product.id)}
        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-900 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95 border border-slate-100"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
};

export const PromotionCardSkeleton: React.FC = () => (
  <div className="card-elevated flex items-center gap-4 p-3 animate-pulse">
    <div className="w-20 h-20 bg-slate-200 rounded-xl"></div>
    <div className="flex-1 space-y-2">
      <div className="w-12 h-2 bg-slate-200 rounded"></div>
      <div className="w-full h-3 bg-slate-200 rounded"></div>
      <div className="w-20 h-2 bg-slate-200 rounded"></div>
      <div className="w-24 h-4 bg-slate-200 rounded"></div>
    </div>
    <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
  </div>
);
