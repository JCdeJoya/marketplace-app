'use client';

import Link from 'next/link';
import { Product } from '@/types/product';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group relative">
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
          {product.thumbnail_url ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${product.thumbnail_url}`}
              alt={product.name}
              width={300}
              height={300}
              className="h-full w-full object-cover object-center group-hover:opacity-75"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center group-hover:opacity-75">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
      </Link>

      {onAddToCart && (
        <button
          onClick={() => onAddToCart(product)}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}