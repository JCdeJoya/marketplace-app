export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: number;
    user_id: number;
    user_email: string;
    status: OrderStatus;
    total_amount: number;
    items: OrderItem[];
    shipping_address: string;
    tracking_number?: string;
    created_at: string;
    updated_at: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  tracking_number?: string;
}