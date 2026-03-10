/**
 * Interface Product - Define a estrutura de um produto
 * 
 * CONCEITO: Interfaces em TypeScript garantem que nossos objetos 
 * tenham sempre a mesma estrutura, evitando erros em tempo de execução
 */
export interface Product {
  id: string;                    // ID único (UUID)
  name: string;                  // Nome do produto
  description: string;           // Descrição detalhada
  price: number;                 // Preço (sempre em número)
  category: ProductCategory;     // Categoria (tipo definido abaixo)
  stock: number;                 // Quantidade em estoque
  imageUrl?: string;             // URL da imagem (opcional com ?)
  createdAt: Date;               // Data de criação
  updatedAt: Date;               // Data da última atualização
}

/**
 * Tipo ProductCategory - Define categorias possíveis
 * 
 * CONCEITO: Union types limitam os valores possíveis,
 * prevenindo erros de digitação
 */
export type ProductCategory = 
  | 'electronics'
  | 'clothing'
  | 'food'
  | 'books'
  | 'toys'
  | 'others';

/**
 * Interface ProductFormData - Dados do formulário
 * 
 * CONCEITO: Separamos os dados do formulário do modelo completo
 * porque no formulário não temos id, createdAt, etc
 */
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  stock: number;
  imageUrl?: string;
}

/**
 * Constante para labels das categorias
 * 
 * CONCEITO: Record<chave, valor> cria um objeto tipado
 * onde sabemos exatamente quais chaves existem
 */
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  electronics: 'Eletrônicos',
  clothing: 'Roupas',
  food: 'Alimentos',
  books: 'Livros',
  toys: 'Brinquedos',
  others: 'Outros'
};
