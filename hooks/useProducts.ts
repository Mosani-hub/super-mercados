
import { useState, useEffect, useCallback } from 'react';
import { Supermarket, ProductWithPrices, PromotionWithProduct, Product } from '../types';

const INITIAL_MOCK_SUPERMARKETS: Supermarket[] = [
  { id: '1', name: 'Carrefour', logo: 'https://picsum.photos/100/100?random=1', color: '#0058a9', distance: '1.2 km', websiteUrl: 'https://www.carrefour.com.br' },
  { id: '2', name: 'Extra', logo: 'https://picsum.photos/100/100?random=2', color: '#ff0000', distance: '0.8 km', websiteUrl: 'https://www.clubeextra.com.br' },
  { id: '3', name: 'Pão de Açúcar', logo: 'https://picsum.photos/100/100?random=3', color: '#00a859', distance: '2.5 km', websiteUrl: 'https://www.paodeacucar.com' },
  { id: '4', name: 'Assaí', logo: 'https://picsum.photos/100/100?random=4', color: '#f37021', distance: '3.1 km', websiteUrl: 'https://www.assai.com.br' },
];

const MOCK_PRODUCTS: ProductWithPrices[] = [
  {
    id: 'p1',
    name: 'Leite Integral 1L',
    brand: 'Itambé',
    category: 'alimentos',
    image: 'https://picsum.photos/200/200?random=11',
    prices: [
      { id: 'pr1', productId: 'p1', supermarketId: '1', current_price: 4.89, previous_price: 5.49, is_promotion: true, unit: 'L' },
      { id: 'pr2', productId: 'p1', supermarketId: '2', current_price: 5.15, is_promotion: false, unit: 'L' },
      { id: 'pr3', productId: 'p1', supermarketId: '3', current_price: 5.50, is_promotion: false, unit: 'L' },
    ]
  },
  {
    id: 'p2',
    name: 'Café Torrado e Moído 500g',
    brand: 'Melitta',
    category: 'alimentos',
    image: 'https://picsum.photos/200/200?random=12',
    prices: [
      { id: 'pr4', productId: 'p2', supermarketId: '1', current_price: 18.90, previous_price: 22.90, is_promotion: true, unit: 'un' },
      { id: 'pr5', productId: 'p2', supermarketId: '2', current_price: 19.50, is_promotion: false, unit: 'un' },
      { id: 'pr6', productId: 'p2', supermarketId: '4', current_price: 17.50, previous_price: 19.90, is_promotion: true, unit: 'un' },
    ]
  },
  {
    id: 'p3',
    name: 'Detergente Líquido 500ml',
    brand: 'Ypê',
    category: 'limpeza',
    image: 'https://picsum.photos/200/200?random=13',
    prices: [
      { id: 'pr7', productId: 'p3', supermarketId: '1', current_price: 2.19, is_promotion: false, unit: 'un' },
      { id: 'pr8', productId: 'p3', supermarketId: '2', current_price: 1.89, previous_price: 2.39, is_promotion: true, unit: 'un' },
    ]
  },
  {
    id: 'p4',
    name: 'Papel Higiênico 12 rolos',
    brand: 'Neve',
    category: 'higiene',
    image: 'https://picsum.photos/200/200?random=14',
    prices: [
      { id: 'pr9', productId: 'p4', supermarketId: '3', current_price: 24.90, previous_price: 29.90, is_promotion: true, unit: 'un' },
      { id: 'pr10', productId: 'p4', supermarketId: '4', current_price: 21.90, is_promotion: false, unit: 'un' },
    ]
  },
  {
    id: 'p5',
    name: 'Pão de Forma Tradicional 450g',
    brand: 'Pullman',
    category: 'padaria',
    image: 'https://picsum.photos/200/200?random=15',
    prices: [
      { id: 'pr11', productId: 'p5', supermarketId: '2', current_price: 8.50, previous_price: 9.90, is_promotion: true, unit: 'un' },
    ]
  }
];

export function useSupermarkets() {
  const [data, setData] = useState<Supermarket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(() => {
    const saved = localStorage.getItem('supermarkets_config');
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      setData(INITIAL_MOCK_SUPERMARKETS);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateSupermarket = (id: string, updates: Partial<Supermarket>) => {
    const newData = data.map(s => s.id === id ? { ...s, ...updates } : s);
    setData(newData);
    localStorage.setItem('supermarkets_config', JSON.stringify(newData));
  };

  const addSupermarket = (newMarket: Omit<Supermarket, 'id'>) => {
    const marketWithId: Supermarket = {
      ...newMarket,
      id: Math.random().toString(36).substr(2, 9),
      distance: newMarket.distance || '0.0 km'
    };
    const newData = [...data, marketWithId];
    setData(newData);
    localStorage.setItem('supermarkets_config', JSON.stringify(newData));
  };

  return { supermarkets: data, isLoading, updateSupermarket, addSupermarket, refresh: loadData };
}

export function useProductsWithPrices() {
  const [data, setData] = useState<ProductWithPrices[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(MOCK_PRODUCTS);
      setIsLoading(false);
    }, 800);
  }, []);

  return { products: data, isLoading };
}

export function usePromotions() {
  const [data, setData] = useState<PromotionWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supermarkets } = useSupermarkets();

  useEffect(() => {
    if (supermarkets.length === 0) return;

    const promotions: PromotionWithProduct[] = [];
    MOCK_PRODUCTS.forEach(p => {
      p.prices.forEach(pr => {
        if (pr.is_promotion && pr.previous_price) {
          const supermarket = supermarkets.find(s => s.id === pr.supermarketId)!;
          if (!supermarket) return;
          const { prices: _, ...productData } = p;
          promotions.push({
            id: pr.id,
            product: productData as Product,
            supermarket,
            current_price: pr.current_price,
            previous_price: pr.previous_price,
            savings_percent: Math.round((1 - pr.current_price / pr.previous_price) * 100),
            unit: pr.unit,
          });
        }
      });
    });
    setData(promotions.sort((a, b) => b.savings_percent - a.savings_percent));
    setIsLoading(false);
  }, [supermarkets]);

  return { promotions: data, isLoading };
}
