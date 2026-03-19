import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductFormData } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private get storage(): Storage | null {
    const candidate = globalThis.localStorage as Partial<Storage> | undefined;
    if (!candidate) {
      return null;
    }

    const hasStorageMethods =
      typeof candidate.getItem === 'function' &&
      typeof candidate.setItem === 'function' &&
      typeof candidate.removeItem === 'function';

    return hasStorageMethods ? (candidate as Storage) : null;
  }
  
  private productsSignal = signal<Product[]>(this.getInitialProducts());

  products = this.productsSignal.asReadonly();

  totalProducts = computed(() => this.productsSignal().length);

  totalStockValue = computed(() => 
    this.productsSignal().reduce((sum, p) => sum + (p.price * p.stock), 0)
  );

  lowStockProducts = computed(() => 
    this.productsSignal().filter(p => p.stock < 10)
  );

  createProduct(formData: ProductFormData): Product {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.productsSignal.update(products => [...products, newProduct]);

    this.saveToLocalStorage();
    return newProduct;
  }

  getProductById(id: string): Product | undefined {
    return this.productsSignal().find(p => p.id === id);
  }

  updateProduct(id: string, formData: ProductFormData): boolean {
    const index = this.productsSignal().findIndex(p => p.id === id);

    if (index === -1) return false;

    this.productsSignal.update(products => {
      const updated = [...products];
      updated[index] = {
        ...updated[index],
        ...formData,
        updatedAt: new Date()
      };
      return updated;
    });

    this.saveToLocalStorage();
    return true;
  }

  deleteProduct(id: string): boolean {
    const initialLength = this.productsSignal().length;

    this.productsSignal.update(products => 
      products.filter(p => p.id !== id)
    );

    const deleted = this.productsSignal().length < initialLength;
    if (deleted) {
      this.saveToLocalStorage();
    }
    
    return deleted;
  }

  searchProducts(term: string): Product[] {
    const lowerTerm = term.toLowerCase();
    return this.productsSignal().filter(p => 
      p.name.toLowerCase().includes(lowerTerm) ||
      p.description.toLowerCase().includes(lowerTerm)
    );
  }

  filterByCategory(category: string): Product[] {
    if (category === 'all') return this.productsSignal();
    return this.productsSignal().filter(p => p.category === category);
  }

  private saveToLocalStorage(): void {
    this.storage?.setItem('products', JSON.stringify(this.productsSignal()));
  }

  private getInitialProducts(): Product[] {
    const stored = this.storage?.getItem('products');

    if (stored) {
      return JSON.parse(stored).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }));
    }

    return [
      {
        id: '1',
        name: 'Notebook Dell',
        description: 'Notebook Dell Inspiron 15, Intel i7, 16GB RAM, 512GB SSD',
        price: 3500,
        category: 'electronics',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Camiseta Básica',
        description: 'Camiseta 100% algodão, diversas cores disponíveis',
        price: 49.90,
        category: 'clothing',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10')
      },
      {
        id: '3',
        name: 'Clean Code',
        description: 'Livro Clean Code - Robert C. Martin',
        price: 89.90,
        category: 'books',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-03-05')
      }
    ];
  }

  clearAll(): void {
    this.productsSignal.set([]);
    this.storage?.removeItem('products');
  }
}
