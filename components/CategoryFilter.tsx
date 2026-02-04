
import React from 'react';
import { Category } from '../types';
import { Apple, Coffee, Wind, Heart, Snowflake, Croissant, Drumstick, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

const CATEGORIES: { id: Category; label: string; icon: any; color: string }[] = [
  { id: 'alimentos', label: 'Alimentos', icon: Coffee, color: 'bg-orange-50 text-orange-600' },
  { id: 'hortifruti', label: 'Hortifruti', icon: Apple, color: 'bg-green-50 text-green-600' },
  { id: 'carnes', label: 'Carnes', icon: Drumstick, color: 'bg-red-50 text-red-600' },
  { id: 'padaria', label: 'Padaria', icon: Croissant, color: 'bg-amber-50 text-amber-600' },
  { id: 'bebidas', label: 'Bebidas', icon: Snowflake, color: 'bg-blue-50 text-blue-600' },
  { id: 'limpeza', label: 'Limpeza', icon: Sparkles, color: 'bg-purple-50 text-purple-600' },
  { id: 'higiene', label: 'Higiene', icon: Heart, color: 'bg-pink-50 text-pink-600' },
  { id: 'frios', label: 'Frios', icon: Wind, color: 'bg-cyan-50 text-cyan-600' },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="overflow-x-auto -mx-4 px-4 py-2 no-scrollbar">
      <div className="flex gap-3 min-w-max">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border ${!selectedCategory ? 'bg-emerald-600 text-white border-emerald-500 scale-105 shadow-emerald-200' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
        >
          TODOS
        </button>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border ${isActive ? 'bg-emerald-600 text-white border-emerald-500 scale-105 shadow-emerald-200' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'}`}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-white/20' : cat.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
