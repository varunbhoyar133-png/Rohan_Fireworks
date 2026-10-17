import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  AlertTriangle,
  CheckCircle,
  Package,
  ShieldAlert,
} from 'lucide-react';
import { categoriesAPI } from '../../services/api';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [blockedDeleteError, setBlockedDeleteError] = useState(null);
  const [deleteConfirmationCategory, setDeleteConfirmationCategory] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    slug: '',
    description: '',
    displayOrder: 0,
    isActive: true,
    imageUrl: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesAPI.getAll(true);
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentCategoryId(null);
    setFormData(initialForm);
    setImageFile(null);
    setImagePreview('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setCurrentCategoryId(cat._id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      displayOrder: cat.displayOrder || 0,
      isActive: cat.isActive !== undefined ? cat.isActive : true,
      imageUrl: cat.image || '',
    });
    setImageFile(null);
    setImagePreview(cat.image || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

    setFormData({
      ...formData,
      name: val,
      slug: isEditing ? formData.slug : autoSlug,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    setSaving(true);

    try {
      let payload;
      if (imageFile) {
        payload = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
          payload.append(k, v);
        });
        payload.append('image', imageFile);
      } else {
        payload = {
          ...formData,
          image: formData.imageUrl,
        };
      }

      if (isEditing) {
        await categoriesAPI.update(currentCategoryId, payload);
        setSuccessToast(`Category "${formData.name}" updated successfully.`);
      } else {
        await categoriesAPI.create(payload);
        setSuccessToast(`Category "${formData.name}" created successfully.`);
      }

      setIsModalOpen(false);
      fetchCategories();
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Error saving category.');
    } finally {
      setSaving(false);
    }
  };

  const initiateDelete = (cat) => {
    if (cat.productCount > 0) {
      setBlockedDeleteError({
        name: cat.name,
        count: cat.productCount,
      });
      return;
    }
    setDeleteConfirmationCategory(cat);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmationCategory) return;
    try {
      await categoriesAPI.delete(deleteConfirmationCategory._id);
      setSuccessToast(`Category "${deleteConfirmationCategory.name}" deleted.`);
      setDeleteConfirmationCategory(null);
      fetchCategories();
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
            Category Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize fireworks into logical categories with images and descriptions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-festive-gradient text-midnight-950 font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-gold hover:opacity-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Categories Table */}
      <div className="rounded-2xl bg-midnight-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-midnight-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Slug URL</th>
                <th className="p-3.5 text-center">Products Linked</th>
                <th className="p-3.5 text-center">Display Order</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No categories found. Create your first category above!
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Name & Image */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&auto=format&fit=crop&q=80'}
                          alt={cat.name}
                          className="w-10 h-10 rounded-lg object-cover bg-midnight-950 border border-slate-700 flex-shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-100 block">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">
                            {cat.description || 'No description'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="p-3.5 font-mono text-[11px] text-festive-gold">
                      {cat.slug}
                    </td>

                    {/* Product Count */}
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-200">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        {cat.productCount || 0}
                      </span>
                    </td>

                    {/* Display Order */}
                    <td className="p-3.5 text-center font-bold text-slate-300">
                      {cat.displayOrder || 0}
                    </td>

                    {/* Status */}
                    <td className="p-3.5 text-center">
                      {cat.isActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                          Hidden
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => initiateDelete(cat)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-midnight-900 border border-festive-gold/30 shadow-2xl p-6 sm:p-8 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display font-bold text-xl text-slate-100">
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </h2>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Sparklers (Phuljhadi)"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="sparklers"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the cracker variety..."
                  className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 rounded bg-midnight-950 border-slate-700 text-festive-gold"
                    />
                    <span>Active on Storefront</span>
                  </label>
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category Image (Upload or URL)
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 rounded-xl bg-midnight-950 border border-dashed border-slate-700 hover:border-festive-gold text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-festive-gold" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>

                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-midnight-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
                  />
                </div>

                {imagePreview && (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="text-[11px] text-emerald-400">Image attached</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-festive-gradient text-midnight-950 hover:shadow-gold disabled:opacity-50"
                >
                  {saving ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blocked Category Deletion Warning (Dependency protection) */}
      {blockedDeleteError && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-midnight-900 border border-amber-500/40 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="font-display font-bold text-lg text-slate-100 text-center">
              Cannot Delete Category
            </h3>

            <p className="text-xs text-slate-300 text-center leading-relaxed">
              Category <strong className="text-amber-400">"{blockedDeleteError.name}"</strong> cannot be deleted because there are{' '}
              <strong className="text-white">{blockedDeleteError.count} product(s)</strong> currently assigned to it.
            </p>

            <p className="text-[11px] text-slate-400 text-center">
              To delete this category, please reassign or delete its associated products in Product Management first.
            </p>

            <div className="pt-2 text-center">
              <button
                onClick={() => setBlockedDeleteError(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-midnight-950 border border-slate-700 text-slate-200 hover:text-white hover:border-slate-500"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal (Only if no products linked) */}
      {deleteConfirmationCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-midnight-900 border border-rose-500/30 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-display font-bold text-lg text-slate-100 text-center">
              Delete Category "{deleteConfirmationCategory.name}"?
            </h3>

            <p className="text-xs text-slate-300 text-center leading-relaxed">
              This category currently has zero products linked and can be safely deleted.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmationCategory(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
