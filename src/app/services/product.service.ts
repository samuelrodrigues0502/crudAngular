import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductFormData } from '../models/product.model';

/**
 * ProductService - Gerencia o estado e operações CRUD de produtos
 * 
 * @Injectable({ providedIn: 'root' }) significa que este service
 * é um SINGLETON - haverá apenas uma instância em toda a aplicação
 */
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
  
  /**
   * CONCEITO: SIGNALS
   * 
   * signal() cria um estado reativo. Quando alteramos seu valor,
   * todos os componentes que o usam são atualizados automaticamente
   */
  private productsSignal = signal<Product[]>(this.getInitialProducts());
  
  /**
   * CONCEITO: COMPUTED SIGNALS
   * 
   * computed() cria um valor derivado que recalcula automaticamente
   * quando seus signals dependentes mudam
   */
  
  // Signal READ-ONLY exposto para os componentes
  products = this.productsSignal.asReadonly();
  
  // Computed: total de produtos
  totalProducts = computed(() => this.productsSignal().length);
  
  // Computed: valor total do estoque
  totalStockValue = computed(() => 
    this.productsSignal().reduce((sum, p) => sum + (p.price * p.stock), 0)
  );
  
  // Computed: produtos com estoque baixo (menos de 10)
  lowStockProducts = computed(() => 
    this.productsSignal().filter(p => p.stock < 10)
  );

  /**
   * CREATE - Adiciona um novo produto
   * 
   * @param formData - Dados do formulário
   * @returns O produto criado com id e datas geradas
   */
  createProduct(formData: ProductFormData): Product {
    const newProduct: Product = {
      id: crypto.randomUUID(), // Gera um ID único
      ...formData,             // Spread operator: copia todas as propriedades
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // update() atualiza o signal de forma imutável
    this.productsSignal.update(products => [...products, newProduct]);
    
    this.saveToLocalStorage();
    return newProduct;
  }

  /**
   * READ - Busca um produto por ID
   * 
   * @param id - ID do produto
   * @returns O produto encontrado ou undefined
   */
  getProductById(id: string): Product | undefined {
    return this.productsSignal().find(p => p.id === id);
  }

  /**
   * UPDATE - Atualiza um produto existente
   * 
   * @param id - ID do produto a atualizar
   * @param formData - Novos dados
   * @returns true se atualizou, false se não encontrou
   */
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

  /**
   * DELETE - Remove um produto
   * 
   * @param id - ID do produto a remover
   * @returns true se removeu, false se não encontrou
   */
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

  /**
   * SEARCH - Busca produtos por termo
   * 
   * @param term - Termo de busca
   * @returns Array de produtos que correspondem à busca
   */
  searchProducts(term: string): Product[] {
    const lowerTerm = term.toLowerCase();
    return this.productsSignal().filter(p => 
      p.name.toLowerCase().includes(lowerTerm) ||
      p.description.toLowerCase().includes(lowerTerm)
    );
  }

  /**
   * FILTER - Filtra produtos por categoria
   * 
   * @param category - Categoria para filtrar
   * @returns Array de produtos da categoria
   */
  filterByCategory(category: string): Product[] {
    if (category === 'all') return this.productsSignal();
    return this.productsSignal().filter(p => p.category === category);
  }

  /**
   * Salva produtos no localStorage
   * 
   * CONCEITO: Persistência local mantém os dados mesmo após refresh
   */
  private saveToLocalStorage(): void {
    this.storage?.setItem('products', JSON.stringify(this.productsSignal()));
  }

  /**
   * Carrega produtos do localStorage ou retorna dados iniciais
   */
  private getInitialProducts(): Product[] {
    const stored = this.storage?.getItem('products');
    
    if (stored) {
      // Parse e converte strings de data de volta para objetos Date
      return JSON.parse(stored).map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }));
    }
    
    // Dados iniciais para demonstração
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

  /**
   * Limpa todos os produtos (útil para testes)
   */
  clearAll(): void {
    this.productsSignal.set([]);
    this.storage?.removeItem('products');
  }
}
