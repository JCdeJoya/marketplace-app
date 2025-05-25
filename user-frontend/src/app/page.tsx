'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { fetchApi } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import Loading from '@/components/ui/Loading';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await fetchApi('/products?featured=true');
                setFeaturedProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="space-y-12">
            <section className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Marketplace</h1>
                <p className="text-gray-600">Find the best products at great prices</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    );
}
