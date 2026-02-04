
export type TabType = 'home' | 'promotions' | 'compare' | 'settings' | 'list' | 'admin';

export type Category = 'alimentos' | 'bebidas' | 'limpeza' | 'higiene' | 'frios' | 'hortifruti' | 'padaria' | 'carnes';

export interface Supermarket {
  id: string;
  name: string;
  logo: string;
  color: string;
  distance?: string;
  websiteUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  image: string;
  brand: string;
}

export interface PriceData {
  id: string;
  productId: string;
  supermarketId: string;
  current_price: number;
  previous_price?: number;
  is_promotion: boolean;
  unit: string;
}

export interface ProductWithPrices extends Product {
  prices: PriceData[];
}

export interface PromotionWithProduct {
  id: string;
  product: Product;
  supermarket: Supermarket;
  current_price: number;
  previous_price?: number;
  savings_percent: number;
  unit: string;
}

export interface ShoppingListItem {
  id: string;
  productId?: string; // Opcional para itens manuais
  customName?: string; // Nome para itens manuais
  product?: Product;
  quantity: number;
  checked: boolean;
  preferredStoreId?: string;
}
