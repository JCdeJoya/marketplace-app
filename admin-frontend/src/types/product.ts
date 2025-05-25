export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image_url?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
}