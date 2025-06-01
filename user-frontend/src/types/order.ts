import { Product } from "./product";

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    product: Product;
}

export interface Order {
    id: number;
    user_id: number;
    user_email: string;
    user_name?: string; 
    shipping_full_name: string;
    status: OrderStatus;
    total_price: number;
    items: OrderItem[];
    shipping_address: string;
    tracking_number?: string;
    created_at: string;
}

export interface OrderStatusData {
  order_id: number;
  status: OrderStatus;
  tracking_number?: string;
}