
import React from 'react';
import { TrendingDown, Percent } from 'lucide-react';

interface HeroSectionProps {
  totalSavings: number;
  promoCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ totalSavings, promoCount }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Economia Real</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">R$</span>
            <span className="text-2xl font-display font-black text-slate-900">{totalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Economizados na sua região</p>
        </div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors"></div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <Percent className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ofertas Vivas</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-display font-black text-slate-900">{promoCount}</span>
            <span className="text-xs font-bold text-slate-500">ativas</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">Preços atualizados agora</p>
        </div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-orange-50 rounded-full blur-2xl group-hover:bg-orange-100 transition-colors"></div>
      </div>
    </div>
  );
};
