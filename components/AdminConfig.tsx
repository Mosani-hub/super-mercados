
import React, { useState } from 'react';
import { Supermarket } from '../types';
import { Save, Globe, X, CheckCircle, Image as ImageIcon, Type, RotateCcw, Plus, Palette } from 'lucide-react';

interface AdminConfigProps {
  supermarkets: Supermarket[];
  onUpdate: (id: string, updates: Partial<Supermarket>) => void;
  onAdd: (newMarket: Omit<Supermarket, 'id'>) => void;
  onClose: () => void;
}

export const AdminConfig: React.FC<AdminConfigProps> = ({ supermarkets, onUpdate, onAdd, onClose }) => {
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State for new market form
  const [newMarket, setNewMarket] = useState({
    name: '',
    logo: '',
    color: '#10b981',
    websiteUrl: '',
    distance: '0.0 km'
  });

  const handleSave = (id: string) => {
    const nameInput = document.getElementById(`name-${id}`) as HTMLInputElement;
    const logoInput = document.getElementById(`logo-${id}`) as HTMLInputElement;
    const urlInput = document.getElementById(`url-${id}`) as HTMLInputElement;

    onUpdate(id, { 
      name: nameInput.value,
      logo: logoInput.value,
      websiteUrl: urlInput.value 
    });

    setSavedStatus(id);
    setTimeout(() => setSavedStatus(null), 2000);
  };

  const handleAddMarket = () => {
    if (!newMarket.name || !newMarket.logo) {
      alert("Por favor, preencha ao menos o nome e a URL da logo.");
      return;
    }
    onAdd(newMarket);
    setNewMarket({
      name: '',
      logo: '',
      color: '#10b981',
      websiteUrl: '',
      distance: '0.0 km'
    });
    setShowAddForm(false);
    setSavedStatus('new');
    setTimeout(() => setSavedStatus(null), 2000);
  };

  const handleReset = () => {
    if (confirm("Deseja resetar todos os mercados para os modelos originais? Isso apagará suas URLs salvas.")) {
      localStorage.removeItem('supermarkets_config');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-black text-xl text-slate-900 dark:text-white">Painel do Administrador</h2>
        <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed transition-all ${
            showAddForm 
            ? 'border-red-200 bg-red-50 dark:bg-red-500/10 text-red-600' 
            : 'border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
          }`}
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span className="font-black uppercase tracking-widest text-xs">
            {showAddForm ? 'Cancelar Adição' : 'Adicionar Novo Mercado'}
          </span>
        </button>

        {showAddForm && (
          <div className="card-elevated p-5 space-y-4 border-l-4 border-l-emerald-500 animate-fade-in">
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Novo Mercado Parceiro</h3>
            <div className="grid gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <Type className="w-3 h-3" /> Nome da Rede
                </label>
                <input
                  type="text"
                  value={newMarket.name}
                  onChange={(e) => setNewMarket({...newMarket, name: e.target.value})}
                  placeholder="Ex: Supermercado Guanabara"
                  className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> URL da Logo
                </label>
                <input
                  type="url"
                  value={newMarket.logo}
                  onChange={(e) => setNewMarket({...newMarket, logo: e.target.value})}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    <Palette className="w-3 h-3" /> Cor da Marca
                  </label>
                  <input
                    type="color"
                    value={newMarket.color}
                    onChange={(e) => setNewMarket({...newMarket, color: e.target.value})}
                    className="w-full h-10 bg-slate-50 border-none rounded-xl p-1 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Site / E-commerce
                  </label>
                  <input
                    type="url"
                    value={newMarket.websiteUrl}
                    onChange={(e) => setNewMarket({...newMarket, websiteUrl: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-slate-900"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleAddMarket}
              className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
            >
              Confirmar Cadastro
            </button>
          </div>
        )}

        <button 
          onClick={handleReset}
          className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-50 dark:bg-red-500/10 py-2 rounded-xl border border-red-100 dark:border-red-500/20"
        >
          <RotateCcw className="w-3 h-3" />
          Resetar para modelos originais
        </button>
      </div>

      <div className="space-y-6">
        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 px-1">Mercados Cadastrados ({supermarkets.length})</h3>
        {supermarkets.map((market) => (
          <div key={market.id} className="card-elevated p-5 space-y-4 border-l-4" style={{ borderLeftColor: market.color }}>
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-slate-50 p-1 border border-slate-100 flex items-center justify-center overflow-hidden">
                <img src={market.logo} alt={market.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{market.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase">ID: {market.id}</p>
              </div>
            </div>
            
            <div className="grid gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <Type className="w-3 h-3" /> Nome da Rede
                </label>
                <input
                  id={`name-${market.id}`}
                  type="text"
                  defaultValue={market.name}
                  className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> URL da Logo
                </label>
                <input
                  id={`logo-${market.id}`}
                  type="url"
                  defaultValue={market.logo}
                  className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Link do Site
                </label>
                <input
                  id={`url-${market.id}`}
                  type="url"
                  defaultValue={market.websiteUrl || ''}
                  className="w-full bg-slate-50 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-900 dark:text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={() => handleSave(market.id)}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs transition-all ${
                savedStatus === market.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-slate-900 text-white hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600'
              }`}
            >
              {savedStatus === market.id ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Salvo com sucesso
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Atualizar Dados
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
