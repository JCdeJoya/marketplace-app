export interface ShippingDetails {
    full_name: string;
    address: string;
    city: string;
    postal_code: string;
    phone: string;
}

export interface CheckoutData {
    shipping_details: ShippingDetails;
}