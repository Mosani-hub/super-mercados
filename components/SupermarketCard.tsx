
import React from 'react';
import { Supermarket } from '../types';
import { MapPin, ArrowRight, ExternalLink } from 'lucide-react';

interface SupermarketCardProps {
  supermarket: Supermarket;
  promoCount: number;
}

export const SupermarketCard: React.FC<SupermarketCardProps> = ({ supermarket, promoCount }) => {
  const handleGoToStore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (supermarket.websiteUrl) {
      window.open(supermarket.websiteUrl, '_blank');
    } else {
      alert('Site não configurado para esta rede.');
    }
  };

  return (
    <div 
      className="w-44 bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group cursor-pointer active:scale-95"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 p-1 bg-white flex-shrink-0 group-hover:scale-110 transition-transform">
          <img src={supermarket.logo} alt={supermarket.name} className="w-full h-full object-contain" />
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900 text-xs truncate leading-tight">{supermarket.name}</h3>
          <div className="flex items-center gap-0.5 text-slate-400">
            <MapPin className="w-2.5 h-2.5" />
            <span className="text-[10px] font-bold">{supermarket.distance}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="bg-orange-50 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
          <span className="text-[10px] font-black text-orange-600 tracking-tighter uppercase">Ofertas</span>
          <span className="text-xs font-black text-orange-700">{promoCount}</span>
        </div>
        
        <button 
          onClick={handleGoToStore}
          className="flex items-center justify-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest pt-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Ir pra loja
          {supermarket.websiteUrl ? <ExternalLink className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};

export const SupermarketCardSkeleton: React.FC = () => (
  <div className="w-44 bg-white p-3.5 rounded-2xl border border-slate-100 animate-pulse">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
      <div className="flex-1 space-y-1">
        <div className="w-16 h-2 bg-slate-200 rounded"></div>
        <div className="w-12 h-2 bg-slate-200 rounded"></div>
      </div>
    </div>
    <div className="h-8 bg-slate-100 rounded-xl mb-2"></div>
    <div className="h-2 bg-slate-100 rounded w-20 mx-auto"></div>
  </div>
);
