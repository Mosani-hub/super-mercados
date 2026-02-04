
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CategoryFilter } from './components/CategoryFilter';
import { PromotionCard, PromotionCardSkeleton } from './components/PromotionCard';
import { ProductCompareCard, ProductCompareCardSkeleton } from './components/ProductCompareCard';
import { ShoppingList } from './components/ShoppingList';
import { SupermarketCard, SupermarketCardSkeleton } from './components/SupermarketCard';
import { HeroSection } from './components/HeroSection';
import { SupermarketFilter } from './components/SupermarketFilter';
import { QuickActions } from './components/QuickActions';
import { AdminConfig } from './components/AdminConfig';
import { Logo } from './components/Logo';
import { useSupermarkets, useProductsWithPrices, usePromotions } from './hooks/useProducts';
import { 
  Store, ChevronRight, RefreshCw, Sparkles, 
  TrendingDown, LayoutGrid, ShieldCheck, Loader2, 
  X, Camera, MapPin, Navigation, Info, Zap, Search, Filter, 
  Tag, Flame, Clock, ArrowDownWideNarrow, Percent, Plus
} from 'lucide-react';
import { TabType, Category, ShoppingListItem } from './types';
import { GoogleGenAI } from "@google/genai";

// Adicionando sugestões rápidas de produtos para o comparador
const QUICK_PRODUCT_SUGGESTIONS = ['Leite', 'Café', 'Arroz', 'Feijão', 'Açúcar', 'Sabão', 'Detergente', 'Óleo'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => {
    const saved = localStorage.getItem('shopping_list');
    return saved ? JSON.parse(saved) : [];
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [promoSort, setPromoSort] = useState<'discount' | 'price'>('discount');
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'scan' | 'map' | 'express'>('none');

  const { supermarkets, isLoading: loadingSupermarkets, updateSupermarket, addSupermarket } = useSupermarkets();
  const { products, isLoading: loadingProducts } = useProductsWithPrices();
  const { promotions, isLoading: loadingPromotions } = usePromotions();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('shopping_list', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const filteredPromotions = useMemo(() => {
    if (!promotions) return [];
    let list = [...promotions].filter(promo => {
      const matchCategory = !selectedCategory || promo.product.category === selectedCategory;
      const matchSearch = !searchQuery || 
        promo.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (promoSort === 'discount') {
      list.sort((a, b) => b.savings_percent - a.savings_percent);
    } else {
      list.sort((a, b) => a.current_price - b.current_price);
    }

    return list;
  }, [promotions, selectedCategory, searchQuery, promoSort]);

  const superDeal = useMemo(() => {
    if (!promotions || promotions.length === 0) return null;
    return [...promotions].sort((a, b) => b.savings_percent - a.savings_percent)[0];
  }, [promotions]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let list = products.filter(product => {
      const matchCategory = !selectedCategory || product.category === selectedCategory;
      const matchSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch && product.prices.length > 0;
    });

    if (selectedSupermarkets.length > 0) {
      list = list.map(product => ({
        ...product,
        prices: product.prices.filter(p => selectedSupermarkets.includes(p.supermarketId))
      })).filter(product => product.prices.length > 0);
    }

    return list;
  }, [products, selectedCategory, searchQuery, selectedSupermarkets]);

  const totalSavings = useMemo(() => {
    if (!promotions) return 0;
    return promotions.reduce((acc, promo) => {
      if (promo.previous_price) {
        return acc + (promo.previous_price - promo.current_price);
      }
      return acc;
    }, 0);
  }, [promotions]);

  const handleAddToList = (productId: string) => {
    const existing = shoppingList.find(item => item.productId === productId);
    if (existing) {
      setShoppingList(prev => 
        prev.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setShoppingList(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        productId,
        quantity: 1,
        checked: false,
      }]);
    }
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  const handleAddManualItem = (name: string) => {
    setShoppingList(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      customName: name,
      quantity: 1,
      checked: false,
    }]);
    if ('vibrate' in navigator) navigator.vibrate(50);
  };

  const handleUpdateListItem = (id: string, updates: Partial<ShoppingListItem>) => {
    setShoppingList(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const handleRemoveListItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleQuickAction = (actionId: 'scan' | 'list' | 'map' | 'express') => {
    if (actionId === 'list') {
      setShowShoppingList(true);
      return;
    }
    setActiveOverlay(actionId);
  };

  const getAiAdvice = async () => {
    if (shoppingList.length === 0) {
      setAiAdvice("Sua lista está vazia! Adicione alguns produtos para receber dicas personalizadas.");
      return;
    }
    
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const productNames = shoppingList.map(item => {
        if (item.customName) return item.customName;
        const p = products.find(prod => prod.id === item.productId);
        return p ? p.name : 'Produto desconhecido';
      }).join(', ');

      const prompt = `Como um consultor especialista em economia doméstica e compras de supermercado, analise esta lista de compras: [${productNames}]. Forneça uma dica curta, prática e motivadora em português (máximo 150 caracteres).`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setAiAdvice(response.text?.trim() || "Mantenha o foco nas ofertas da semana!");
    } catch (e) {
      setAiAdvice("Dica: Comprar itens de marcas próprias costuma gerar uma economia de até 40%.");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-[#0f2a4a] flex flex-col items-center justify-center animate-fade-in z-[200]">
        <Logo size="lg" className="animate-pulse" theme="dark" />
        <div className="mt-8 flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
          <p className="text-emerald-500/60 font-black uppercase tracking-[0.3em] text-[10px]">Sincronizando Preços</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-8 animate-fade-in px-1">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white leading-tight">
                  {greeting}, <span className="text-emerald-600">Economizador!</span>
                </h2>
                <p className="text-sm text-slate-400 font-medium">As melhores ofertas da sua região estão aqui.</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
            </header>

            <HeroSection totalSavings={totalSavings} promoCount={promotions?.length || 0} />

            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5" />
                Menu de Navegação
              </h3>
              <QuickActions onAction={handleQuickAction} />
            </section>

            <section className="bg-gradient-to-br from-[#0f2a4a] to-[#1a365d] rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="font-display font-bold text-lg">Smart Advisor IA</h3>
                  </div>
                  {isAiLoading && <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />}
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 min-h-[80px] flex items-center">
                  <p className="text-slate-300 text-sm leading-relaxed italic">
                    "{aiAdvice || "Adicione itens à sua lista e clique em analisar para receber dicas personalizadas de economia!"}"
                  </p>
                </div>
                <button 
                  onClick={getAiAdvice}
                  disabled={isAiLoading}
                  className="mt-5 bg-emerald-600 text-white font-black py-3.5 px-6 rounded-2xl text-xs shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <TrendingDown className="w-4 h-4" />
                  {isAiLoading ? 'Analisando...' : 'Analisar minha lista'}
                </button>
              </div>
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-600" />
                  Mercados Parceiros
                </h2>
                <button onClick={handleRefresh} className="p-2 text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm active:rotate-180 duration-500 transition-colors">
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="overflow-x-auto -mx-4 px-4 no-scrollbar">
                <div className="flex gap-4 min-w-max pb-4">
                  {loadingSupermarkets ? (
                    Array(4).fill(0).map((_, i) => <SupermarketCardSkeleton key={i} />)
                  ) : (
                    supermarkets?.map(market => (
                      <SupermarketCard
                        key={market.id}
                        supermarket={market}
                        promoCount={Math.floor(Math.random() * 15) + 5}
                      />
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="pb-8">
              <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-orange-500" />
                  Ofertas em Destaque
                </h2>
                <button onClick={() => setActiveTab('promotions')} className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
                  Ver Tudo
                </button>
              </div>
              <div className="grid gap-4">
                {loadingPromotions ? (
                  Array(4).fill(0).map((_, i) => <PromotionCardSkeleton key={i} />)
                ) : (
                  filteredPromotions.slice(0, 4).map(promo => (
                    <PromotionCard key={promo.id} promo={promo} onAddToList={handleAddToList} />
                  ))
                )}
              </div>
            </section>
          </div>
        );

      case 'promotions':
        return (
          <div className="space-y-6 animate-fade-in pb-10">
            <div className="bg-orange-600 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                    <Flame className="w-4 h-4 text-orange-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ofertas Quentes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-orange-100">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold">Expira em 08:45:22</span>
                  </div>
                </div>
                <h2 className="font-display font-black text-3xl leading-none">Ofertas <br/> do Dia!</h2>
                <p className="text-orange-100 text-xs font-medium">Os maiores descontos das redes parceiras atualizados agora.</p>
              </div>
              <Tag className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 rotate-12" />
            </div>

            {superDeal && !loadingPromotions && (
              <div className="px-1">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-orange-100 dark:border-orange-500/20 p-1 shadow-sm overflow-hidden relative transition-colors">
                   <div className="absolute top-4 left-4 z-10 bg-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                     DESTAQUE DO DIA
                   </div>
                   <div className="flex items-center gap-4 p-4">
                      <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden p-2 flex-shrink-0">
                        <img src={superDeal.product.image} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{superDeal.product.brand}</p>
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{superDeal.product.name}</h4>
                        <div className="flex items-center gap-2 my-1">
                          <img src={superDeal.supermarket.logo} className="w-4 h-4 rounded-full object-contain" />
                          <span className="text-[10px] font-black text-slate-500 uppercase">{superDeal.supermarket.name}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-xl font-black text-orange-600">R$ {superDeal.current_price.toFixed(2)}</span>
                           <span className="text-xs text-slate-400 line-through">R$ {superDeal.previous_price?.toFixed(2)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddToList(superDeal.product.id)}
                        className="w-12 h-12 bg-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100 dark:shadow-orange-950/20 active:scale-90 transition-transform"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                   </div>
                </div>
              </div>
            )}

            <div className="sticky top-[80px] z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md py-4 space-y-4 px-1 transition-colors">
              <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPromoSort('discount')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${promoSort === 'discount' ? 'bg-orange-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800'}`}
                  >
                    <Percent className="w-3 h-3" />
                    Maior Desconto
                  </button>
                  <button 
                    onClick={() => setPromoSort('price')}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${promoSort === 'price' ? 'bg-orange-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800'}`}
                  >
                    <ArrowDownWideNarrow className="w-3 h-3" />
                    Menor Preço
                  </button>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {filteredPromotions.length} ITENS
                </span>
              </div>
            </div>

            <div className="grid gap-4 px-1 pb-10">
              {loadingPromotions ? Array(6).fill(0).map((_, i) => <PromotionCardSkeleton key={i} />) : 
              filteredPromotions.length > 0 ? (
                filteredPromotions.map(promo => <PromotionCard key={promo.id} promo={promo} onAddToList={handleAddToList} />)
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                  <Tag className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Nenhuma oferta encontrada</h4>
                  <p className="text-xs text-slate-400 mt-1">Tente trocar a categoria ou limpar a busca.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'compare':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="px-2 space-y-1">
              <h2 className="font-display font-black text-2xl text-slate-900 dark:text-white">Compare Preços</h2>
              <p className="text-xs text-slate-400 font-medium">Lado a lado, os melhores valores por item.</p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm mx-1 transition-colors">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Filter className="w-3 h-3" /> Filtrar Produto
                </label>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Ex: Leite, Sabão, Arroz..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all dark:text-slate-400"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-200 dark:bg-slate-600 rounded-full text-slate-500 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {QUICK_PRODUCT_SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                      searchQuery.toLowerCase() === suggestion.toLowerCase()
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100 dark:shadow-emerald-950/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 px-1">
              <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
              {!loadingSupermarkets && supermarkets && (
                <SupermarketFilter supermarkets={supermarkets} selectedIds={selectedSupermarkets} onToggleSupermarket={(id) => setSelectedSupermarkets(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id])} />
              )}
            </div>

            <div className="grid gap-4 pt-2 px-1">
              {loadingProducts ? Array(4).fill(0).map((_, i) => <ProductCompareCardSkeleton key={i} />) : 
              filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCompareCard 
                    key={product.id} 
                    product={product} 
                    supermarkets={supermarkets}
                    onAddToList={handleAddToList} 
                  />
                ))
              ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 mx-1">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-200 dark:text-slate-700" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Nenhum produto encontrado</h4>
                  <p className="text-xs text-slate-400 mt-1">Tente mudar o termo da busca ou remova os filtros.</p>
                  <button 
                    onClick={() => {setSearchQuery(''); setSelectedCategory(null); setSelectedSupermarkets([]);}}
                    className="mt-4 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-full"
                  >
                    Limpar tudo
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 animate-fade-in px-2">
            <h2 className="font-display font-bold text-xl dark:text-white">Ajustes</h2>
            {isAdminMode ? <AdminConfig supermarkets={supermarkets} onUpdate={updateSupermarket} onAdd={addSupermarket} onClose={() => setIsAdminMode(false)} /> : 
            <div className="card-elevated divide-y divide-slate-100 dark:divide-slate-800">
              <div onClick={() => setIsAdminMode(true)} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer rounded-t-2xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
                  <div><p className="font-semibold text-sm dark:text-white">Administrador</p><p className="text-xs text-slate-500">Configurar links e mercados</p></div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
              <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center"><Store className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /></div>
                  <div><p className="font-semibold text-sm dark:text-white">Favoritos</p><p className="text-xs text-slate-500">Gerenciar mercados preferidos</p></div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>}
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors">
      <Header 
        onSearch={setSearchQuery} 
        searchQuery={searchQuery}
        cartItemCount={shoppingList.length} 
        onCartClick={() => setShowShoppingList(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="max-w-md mx-auto py-6 px-4 overflow-x-hidden">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeOverlay === 'scan' && (
        <div className="fixed inset-0 z-[70] bg-black flex flex-col items-center justify-center text-white p-6 animate-fade-in">
          <div className="absolute top-6 right-6 z-10">
            <button onClick={() => setActiveOverlay('none')} className="p-3 bg-white/10 rounded-full backdrop-blur-md">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative w-full aspect-[3/4] border-2 border-dashed border-emerald-500/50 rounded-3xl overflow-hidden mb-8">
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
              <Camera className="w-16 h-16 text-emerald-500/50" />
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-scan"></div>
          </div>
          <div className="text-center space-y-4">
            <h3 className="font-display font-bold text-xl">Escaneando Nota Fiscal</h3>
            <p className="text-slate-400 text-sm">Aponte para o QR Code da nota ou para a lista de itens impressa.</p>
            <button 
              onClick={() => {
                const randomProduct = products[Math.floor(Math.random() * products.length)];
                if(randomProduct) handleAddToList(randomProduct.id);
                setActiveOverlay('none');
                setShowShoppingList(true);
              }}
              className="px-8 py-4 bg-emerald-600 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Capturar Nota
            </button>
          </div>
        </div>
      )}

      {activeOverlay === 'map' && (
        <div className="fixed inset-0 z-[70] bg-white dark:bg-slate-950 flex flex-col animate-fade-in max-w-md mx-auto transition-colors">
          <div className="p-6 border-b dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-display font-black text-xl flex items-center gap-2 dark:text-white">
              <MapPin className="text-orange-500" /> Lojas Próximas
            </h3>
            <button onClick={() => setActiveOverlay('none')} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl dark:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {supermarkets.map(market => (
              <div key={market.id} className="card-elevated p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 p-2 border dark:border-slate-700 flex items-center justify-center">
                    <img src={market.logo} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{market.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">{market.distance}</p>
                  </div>
                </div>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/${market.name}`, '_blank')}
                  className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl active:scale-90"
                >
                  <Navigation className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showShoppingList && (
        <ShoppingList 
          items={shoppingList} 
          products={products || []} 
          onUpdateItem={handleUpdateListItem} 
          onRemoveItem={handleRemoveListItem} 
          onAddManualItem={handleAddManualItem}
          onClose={() => setShowShoppingList(false)} 
        />
      )}
    </div>
  );
};

export default App;
