'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { User } from '@/types/user';
import { fetchApi } from '@/lib/api';
import Loading from '@/components/ui/Loading';
import UserForm from '@/components/users/UserForm';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            const data = await fetchApi('/users');
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleActive = async (userId: number, isActive: boolean) => {
        try {
            await fetchApi(`/users/${userId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ is_active: !isActive }),
            });
            await fetchUsers();
        } catch (error) {
            console.error('Failed to update user status:', error);
        }
    };

    if (loading) return <Loading />;

    return (
        <AdminLayout>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                        Add user
                    </button>
                </div>
            </div>

            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
                                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                {user.full_name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {user.email}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {user.is_admin ? 'Admin' : 'User'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <button
                                                    onClick={() => handleToggleActive(user.id, user.is_active)}
                                                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        user.is_active
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                        setShowForm(true);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showForm && (
                <UserForm
                    user={editingUser}
                    onClose={() => {
                        setShowForm(false);
                        setEditingUser(null);
                    }}
                    onSubmit={async (data) => {
                        // Handle user creation/update
                        try {
                            if (editingUser) {
                                await fetchApi(`/users/${editingUser.id}`, {
                                    method: 'PUT',
                                    body: JSON.stringify(data),
                                });
                            } else {
                                await fetchApi('/users', {
                                    method: 'POST',
                                    body: JSON.stringify(data),
                                });
                            }
                            setShowForm(false);
                            setEditingUser(null);
                            await fetchUsers();
                        } catch (error) {
                            console.error('Failed to save user:', error);
                        }
                    }}
                />
            )}
        </AdminLayout>
    );
}