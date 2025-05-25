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
    status: OrderStatus;
    total_amount: number;
    items: OrderItem[];
    shipping_address: string;
    tracking_number?: string;
    created_at: string;
}