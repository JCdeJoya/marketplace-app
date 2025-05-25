import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types/product';

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: 1,
    name: "Test Product",
    description: "Test Description",
    price: 99.99,
    stock: 10,
    category_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  it('renders product correctly', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
  });

  it('handles add to cart', () => {
    const mockAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});

import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)