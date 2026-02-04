
import React, { useState } from 'react';
import { Plus, Repeat, ChevronDown, ChevronUp, ExternalLink, Tag, Store } from 'lucide-react';
import { ProductWithPrices, Supermarket } from '../types';

interface ProductCompareCardProps {
  product: ProductWithPrices;
  supermarkets: Supermarket[];
  onAddToList: (productId: string) => void;
}

export const ProductCompareCard: React.FC<ProductCompareCardProps> = ({ product, supermarkets, onAddToList }) => {
  const [expandedPriceId, setExpandedPriceId] = useState<string | null>(null);
  
  const sortedPrices = [...product.prices].sort((a, b) => a.current_price - b.current_price);
  const bestPrice = sortedPrices[0];

  const toggleExpand = (priceId: string) => {
    setExpandedPriceId(expandedPriceId === priceId ? null : priceId);
  };

  const getSupermarket = (id: string) => supermarkets.find(s => s.id === id);

  return (
    <div className="card-elevated p-4 space-y-4">
      {/* Cabeçalho do Produto */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{product.brand}</p>
          <h3 className="font-bold text-slate-900 mb-1 truncate leading-tight">{product.name}</h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full">MELHOR PREÇO</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xs font-bold text-emerald-600">R$ {bestPrice.current_price.toFixed(2)}</span>
              <span className="text-[8px] font-black text-emerald-500 uppercase">/ {bestPrice.unit}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => onAddToList(product.id)}
          className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95 flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Lista de Preços em outras redes */}
      <div className="space-y-2 pt-2 border-t border-slate-50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-3">
          <Repeat className="w-3 h-3" />
          Preços em outras redes
        </p>
        
        <div className="grid gap-2">
          {sortedPrices.map((price, idx) => {
            const market = getSupermarket(price.supermarketId);
            const isExpanded = expandedPriceId === price.id;
            const savingsPercent = price.previous_price 
              ? Math.round((1 - price.current_price / price.previous_price) * 100) 
              : 0;

            return (
              <div 
                key={price.id} 
                className={`overflow-hidden transition-all duration-300 border rounded-2xl ${
                  isExpanded 
                    ? 'bg-white border-emerald-200 shadow-md ring-1 ring-emerald-50' 
                    : idx === 0 
                      ? 'bg-emerald-50/50 border-emerald-100' 
                      : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200'
                }`}
              >
                {/* Linha Principal (Clicável) */}
                <button 
                  onClick={() => toggleExpand(price.id)}
                  className="w-full flex items-center justify-between p-3 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center p-1 border border-slate-100">
                      {market ? (
                        <img src={market.logo} alt={market.name} className="w-full h-full object-contain" />
                      ) : (
                        <Store className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-xs font-bold leading-none ${idx === 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {market?.name || `Mercado ${price.supermarketId}`}
                      </span>
                      {price.is_promotion && (
                        <span className="text-[8px] font-black text-orange-500 uppercase mt-1 tracking-tighter">Em Promoção</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-baseline gap-0.5">
                        <span className={`text-sm font-black ${idx === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                          R$ {price.current_price.toFixed(2)}
                        </span>
                        <span className={`text-[8px] font-bold ${idx === 0 ? 'text-emerald-500' : 'text-slate-400'} uppercase`}>
                          / {price.unit}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {/* Detalhes Expandidos */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 animate-fade-in space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        {price.previous_price && (
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Preço Anterior</p>
                            <p className="text-xs font-bold text-slate-500 line-through">R$ {price.previous_price.toFixed(2)}</p>
                          </div>
                        )}
                        {savingsPercent > 0 && (
                          <div className="bg-orange-50 p-2 rounded-xl border border-orange-100">
                            <p className="text-[8px] font-black text-orange-400 uppercase tracking-widest">Economia</p>
                            <p className="text-xs font-black text-orange-600 flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5" />
                              {savingsPercent}% OFF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (market?.websiteUrl) window.open(market.websiteUrl, '_blank');
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                          market?.websiteUrl 
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                        disabled={!market?.websiteUrl}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Ver no site
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToList(product.id);
                        }}
                        className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const ProductCompareCardSkeleton: React.FC = () => (
  <div className="card-elevated p-4 space-y-4 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
      <div className="flex-1 space-y-2">
        <div className="w-12 h-2 bg-slate-200 rounded"></div>
        <div className="w-32 h-3 bg-slate-200 rounded"></div>
        <div className="w-24 h-2 bg-slate-200 rounded"></div>
      </div>
      <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
);
