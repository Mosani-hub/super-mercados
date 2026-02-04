
import React from 'react';
import { Camera, ListChecks, Map, Zap } from 'lucide-react';

interface QuickActionsProps {
  onAction: (actionId: 'scan' | 'list' | 'map' | 'express') => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    { id: 'scan' as const, label: 'Escanear', icon: Camera, color: 'bg-blue-50 text-blue-600', sub: 'Nota Fiscal' },
    { id: 'list' as const, label: 'Listas', icon: ListChecks, color: 'bg-emerald-50 text-emerald-600', sub: 'Minhas Listas' },
    { id: 'map' as const, label: 'Mapa', icon: Map, color: 'bg-orange-50 text-orange-600', sub: 'Lojas Perto' },
    { id: 'express' as const, label: 'Express', icon: Zap, color: 'bg-purple-50 text-purple-600', sub: 'Preço Rápido' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action) => (
        <button 
          key={action.id} 
          onClick={() => onAction(action.id)}
          className="flex flex-col items-center gap-2 group active:scale-90 transition-transform"
        >
          <div className={`w-full aspect-square ${action.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
            <action.icon className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-800 leading-none">{action.label}</p>
            <p className="text-[8px] font-medium text-slate-400 mt-0.5">{action.sub}</p>
          </div>
        </button>
      ))}
    </div>
  );
};
