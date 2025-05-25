'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto px-4">
                <div className="flex h-16 justify-between items-center">
                    <Link href="/" className="text-xl font-bold">
                        Marketplace
                    </Link>

                    <div className="hidden md:flex space-x-8">
                        <Link
                            href="/products"
                            className={`text-sm ${pathname === '/products' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Products
                        </Link>
                        
                        {user ? (
                            <>
                                <Link
                                    href="/cart"
                                    className={`text-sm relative ${pathname === '/cart' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Cart
                                    {cart && cart.items.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cart.items.length}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    href="/orders"
                                    className={`text-sm ${pathname === '/orders' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Orders
                                </Link>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        {user.full_name}
                                    </button>
                                    {showMenu && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setShowMenu(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`text-sm ${pathname === '/login' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className={`text-sm ${pathname === '/register' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}