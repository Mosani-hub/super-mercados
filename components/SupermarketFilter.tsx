
import React from 'react';
import { Supermarket } from '../types';
import { Check } from 'lucide-react';

interface SupermarketFilterProps {
  supermarkets: Supermarket[];
  selectedIds: string[];
  onToggleSupermarket: (id: string) => void;
}

export const SupermarketFilter: React.FC<SupermarketFilterProps> = ({ 
  supermarkets, 
  selectedIds, 
  onToggleSupermarket 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filtrar por Rede</span>
        {selectedIds.length > 0 && (
          <button 
            onClick={() => selectedIds.forEach(id => onToggleSupermarket(id))}
            className="text-[10px] font-bold text-emerald-600 uppercase"
          >
            Limpar
          </button>
        )}
      </div>
      <div className="overflow-x-auto -mx-4 px-4 py-1 no-scrollbar">
        <div className="flex gap-3 min-w-max">
          {supermarkets.map((market) => {
            const isSelected = selectedIds.includes(market.id);
            return (
              <button
                key={market.id}
                onClick={() => onToggleSupermarket(market.id)}
                className={`flex items-center gap-2 p-1.5 pr-3 rounded-2xl border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm shadow-emerald-100' 
                    : 'bg-white border-slate-100 opacity-70 grayscale hover:grayscale-0 hover:opacity-100'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1 border border-slate-50 relative">
                  <img src={market.logo} alt={market.name} className="w-full h-full object-contain" />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      <Check className="w-2.5 h-2.5 text-white stroke-[4px]" />
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tight ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {market.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
