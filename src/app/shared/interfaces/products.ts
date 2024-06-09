export interface Product {
  discount: number;
  id: number;
  name: string;
  price: number;
  categoryId: number;
  description?: string;
  picture?: string;
  availability: boolean;
  quantity?: number;
  store_quantity?: number;
  selectedProducts?: number;
  buying_price?: number;
  quantityToAdd?: number;
  countable?: boolean;
}
