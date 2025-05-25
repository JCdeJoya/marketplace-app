'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Category, CategoryFormData } from '@/types/category';
import { fetchApi } from '@/lib/api';
import Loading from '@/components/ui/Loading';
import CategoryForm from '@/components/categories/CategoryForm';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const fetchCategories = async () => {
    try {
      const data = await fetchApi('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await fetchApi(`/categories/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      } else {
        await fetchApi('/categories', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
      setShowForm(false);
      setEditingCategory(undefined);
      await fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await fetchApi(`/categories/${id}`, { method: 'DELETE' });
        await fetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <AdminLayout>
      {showForm ? (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">
            {editingCategory ? 'Edit Category' : 'Add Category'}
          </h2>
          <CategoryForm
            category={editingCategory}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingCategory(undefined);
            }}
          />
        </div>
      ) : (
        <>
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                Add category
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
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Description
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {categories.map((category) => (
                        <tr key={category.id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {category.name}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-500">
                            {category.description}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => {
                                setEditingCategory(category);
                                setShowForm(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
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
        </>
      )}
    </AdminLayout>
  );
}