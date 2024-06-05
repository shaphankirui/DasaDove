export interface Product {
    id: string; // Assuming the product ID is a string
    name: string;
    price: number;
    categoryId: string; // The ID of the associated category
    description?: string;
    picture?: string;
    availability: boolean;
    quantity?: number;
    store_quantity?: number;
    buying_price?: number;
    quantityToAdd?: number;
    countable?: boolean;
  }