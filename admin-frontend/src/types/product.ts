export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  image_url?: string;
  thumbnail_url?: string;
}

export interface ProductFormData {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
}