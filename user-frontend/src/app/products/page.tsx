'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { fetchApi } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import Loading from '@/components/ui/Loading';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchApi('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = '/products';
        const params = new URLSearchParams();
        
        if (searchQuery) params.append('query', searchQuery);
        if (categoryId) params.append('category_id', categoryId);
        if (priceRange.min > 0) params.append('min_price', priceRange.min.toString());
        if (priceRange.max < 1000) params.append('max_price', priceRange.max.toString());
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const data = await fetchApi(url);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, categoryId, priceRange]);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Min price"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max price"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
            className="w-1/2 p-2 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}