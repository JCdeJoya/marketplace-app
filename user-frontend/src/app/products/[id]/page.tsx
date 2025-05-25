'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { fetchApi } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import Loading from '@/components/ui/Loading';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await fetchApi(`/products/${params.id}`);
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                toast.error('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id]);

    const handleAddToCart = async () => {
        if (!product) return;
        
        try {
            await addToCart(product.id, quantity);
            toast.success('Added to cart');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            toast.error('Failed to add to cart');
        }
    };

    if (loading) return <Loading />;
    if (!product) return <div className="text-center py-12">Product not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            width={600}
                            height={600}
                            className="h-full w-full object-cover object-center"
                            priority
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">No image</span>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    <p className="text-xl font-medium text-gray-900">${product.price.toFixed(2)}</p>
                    <p className="text-gray-700">{product.description}</p>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                max={product.stock}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, product.stock))}
                                className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-500">
                                {product.stock} available
                            </span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}