export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductCategory = 
  | 'electronics'
  | 'clothing'
  | 'food'
  | 'books'
  | 'toys'
  | 'others';

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  imageUrl?: string;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  electronics: 'Eletrônicos',
  clothing: 'Roupas',
  food: 'Alimentos',
  books: 'Livros',
  toys: 'Brinquedos',
  others: 'Outros'
};
