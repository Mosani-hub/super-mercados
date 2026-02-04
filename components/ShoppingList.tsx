
import React, { useMemo, useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle2, Circle, Package, ShoppingBasket } from 'lucide-react';
import { ShoppingListItem, ProductWithPrices } from '../types';

interface ShoppingListProps {
  items: ShoppingListItem[];
  products: ProductWithPrices[];
  onUpdateItem: (id: string, updates: Partial<ShoppingListItem>) => void;
  onRemoveItem: (id: string) => void;
  onAddManualItem?: (name: string) => void;
  onClose: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ 
  items, 
  products, 
  onUpdateItem, 
  onRemoveItem, 
  onAddManualItem,
  onClose 
}) => {
  const [manualItemName, setManualItemName] = useState('');

  const getProduct = (productId?: string) => productId ? products.find(p => p.id === productId) : undefined;

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualItemName.trim() && onAddManualItem) {
      onAddManualItem(manualItemName.trim());
      setManualItemName('');
    }
  };

  const total = useMemo(() => {
    return items.reduce((acc, item) => {
      if (item.productId) {
        const product = getProduct(item.productId);
        if (!product || !product.prices || product.prices.length === 0) return acc;
        
        const bestPrice = Math.min(...product.prices.map(p => p.current_price));
        const priceValue = isFinite(bestPrice) ? bestPrice : 0;
        return acc + (priceValue * item.quantity);
      }
      return acc;
    }, 0);
  }, [items, products]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-6 max-h-[85vh] flex flex-col animate-fade-in shadow-2xl max-w-md mx-auto w-full transition-colors">
        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white">Minha Lista</h2>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {items.length} ITENS
            </span>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 active:scale-90 transition-transform">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAddManual} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={manualItemName}
            onChange={(e) => setManualItemName(e.target.value)}
            placeholder="Adicionar item manual..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all dark:text-slate-400"
          />
          <button 
            type="submit"
            disabled={!manualItemName.trim()}
            className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 dark:shadow-emerald-950/20 disabled:opacity-50 disabled:shadow-none active:scale-90 transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-700">
              <ShoppingBasket className="w-8 h-8 text-slate-200 dark:text-slate-700" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold">Sua lista está vazia</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-2 max-w-[200px] uppercase tracking-widest font-black leading-relaxed">
              Adicione produtos manualmente ou compare preços para economizar.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {items.map((item) => {
                const product = getProduct(item.productId);
                const isManual = !!item.customName;
                const itemName = isManual ? item.customName : product?.name || 'Carregando...';
                
                const bestPrice = product?.prices && product.prices.length > 0 
                  ? Math.min(...product.prices.map(p => p.current_price)) 
                  : 0;

                return (
                  <div key={item.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${item.checked ? 'bg-slate-50 dark:bg-slate-800/50 border-transparent opacity-60' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm'}`}>
                    <button 
                      onClick={() => onUpdateItem(item.id, { checked: !item.checked })}
                      className="flex-shrink-0 active:scale-90 transition-transform"
                    >
                      {item.checked ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /> : <Circle className="w-6 h-6 text-slate-200 dark:text-slate-700" />}
                    </button>
                    
                    <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-600 p-1 flex-shrink-0 flex items-center justify-center">
                      {isManual ? (
                        <Package className="w-6 h-6 text-slate-300 dark:text-slate-500" />
                      ) : (
                        <img src={product?.image} alt={itemName} className="w-full h-full object-contain" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-bold truncate ${item.checked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>{itemName}</h4>
                      <div className="flex items-center gap-1">
                        {!isManual && <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{product?.brand}</span>}
                        {isManual ? (
                          <span className="text-[8px] font-black text-orange-400 uppercase tracking-tighter">Manual</span>
                        ) : (
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                            {bestPrice > 0 ? `R$ ${bestPrice.toFixed(2)}` : 'Sincronizando...'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-xl p-1 border border-slate-100 dark:border-slate-600">
                      <button 
                        onClick={() => onUpdateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                        className="p-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors active:scale-75 text-slate-400"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-black w-4 text-center dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateItem(item.id, { quantity: item.quantity + 1 })}
                        className="p-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors active:scale-75 text-slate-400"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors active:scale-90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Estimado</span>
                <div className="text-right">
                  <p className="text-2xl font-display font-black text-slate-900 dark:text-white leading-none">R$ {total.toFixed(2)}</p>
                  <p className="text-[8px] text-emerald-600 dark:text-emerald-400 font-black mt-1 uppercase tracking-widest">Apenas itens do catálogo</p>
                </div>
              </div>
              <button className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-100 dark:shadow-emerald-950/20 hover:bg-emerald-700 active:scale-95 transition-all uppercase tracking-widest text-[10px]">
                Ir para o Supermercado
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
