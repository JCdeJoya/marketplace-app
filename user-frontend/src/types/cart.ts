import { Product } from './product';

export interface CartItem {
    product_id: number;
    quantity: number;
    product: Product;
}

export interface Cart {
    items: CartItem[];
    total: number;
}