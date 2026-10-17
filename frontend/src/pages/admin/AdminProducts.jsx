import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Package,
} from 'lucide-react';

import { productsAPI, categoriesAPI } from '../../services/api';

export const AdminProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [deleteConfirmationProduct, setDeleteConfirmationProduct] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    sku: '',
    category: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    lowStockThreshold: 10,
    packSize: '1 Box',
    soundLevel: 'Mild Crackle',
    visualEffect: 'Golden Sparks & Colorful Burst',
    safetyDistance: '5 Meters minimum in open ground',
    isGreenCracker: true,
    isFeatured: false,
    isVisible: true,
    imageUrl: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const [totalCount, setTotalCount] = useState(0);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productsAPI.getAll({
        search: searchQuery,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        includeHidden: 'true',
        limit: 'all',
      });
      setProducts(data.products || []);
      setTotalCount(data.total || data.count || (data.products ? data.products.length : 0));
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  // Open modal if URL has ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      openAddModal();
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || '',
    });
    setImageFile(null);
    setImagePreview('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setCurrentProductId(product._id);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category?._id || product.category || '',
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || '',
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold || 10,
      packSize: product.packSize || '1 Box',
      soundLevel: product.soundLevel || 'Mild Crackle',
      visualEffect: product.visualEffect || '',
      safetyDistance: product.safetyDistance || '',
      isGreenCracker: product.isGreenCracker,
      isFeatured: product.isFeatured,
      isVisible: product.isVisible,
      imageUrl: product.images?.[0] || '',
    });
    setImageFile(null);
    setImagePreview(product.images?.[0] || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.sku || !formData.category || !formData.description || formData.price === '') {
      setFormError('Please fill in all required fields.');
      return;
    }

    setSaving(true);

    try {
      // Use FormData if image file is uploaded
      let payload;
      if (imageFile) {
        payload = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
          payload.append(k, v);
        });
        payload.append('image', imageFile);
      } else {
        payload = formData;
      }

      if (isEditing) {
        await productsAPI.update(currentProductId, payload);
        setSuccessToast(`Product "${formData.name}" updated successfully.`);
      } else {
        await productsAPI.create(payload);
        setSuccessToast(`Product "${formData.name}" created successfully.`);
      }

      setIsModalOpen(false);
      fetchProducts();
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      setFormError(err.message || 'Error saving product. Please check SKU uniqueness and fields.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmationProduct) return;
    try {
      await productsAPI.delete(deleteConfirmationProduct._id);
      setSuccessToast(`Product "${deleteConfirmationProduct.name}" deleted successfully.`);
      setDeleteConfirmationProduct(null);
      fetchProducts();
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
            Product Catalogue Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add new fireworks, configure prices, update SKUs, and manage festive visibility.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-festive-gradient text-midnight-950 font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-gold hover:opacity-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-midnight-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-midnight-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories ({totalCount} Total Fireworks)</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.productCount || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalogue Status Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 bg-midnight-950/70 border border-slate-800 rounded-xl px-4 py-2.5 gap-2">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-festive-gold" />
          <span>
            Displaying <strong className="text-festive-gold font-bold">{products.length}</strong> of{' '}
            <strong className="text-slate-200 font-bold">{totalCount}</strong> Total Uploaded Fireworks
          </span>
        </div>
        <div className="text-[11px] text-slate-500">
          Source: Jianna Fireworks 119 Price List (All 119 Verified in Database)
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-midnight-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-midnight-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right">Price (₹)</th>
                <th className="p-3.5 text-right">Stock Level</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    Loading fireworks records...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isLow = product.stock <= (product.lowStockThreshold || 10);
                  const isOut = product.stock <= 0;

                  return (
                    <tr key={product._id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Product Name & Image */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || '/placeholder-firework.svg'}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-midnight-950 border border-slate-700 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-100 block">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {product.packSize || '1 Pack'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-3.5 font-mono text-[11px] text-festive-gold">
                        {product.sku}
                      </td>

                      {/* Category */}
                      <td className="p-3.5 text-slate-300">
                        {product.category?.name || 'Unassigned'}
                      </td>

                      {/* Price */}
                      <td className="p-3.5 text-right font-bold text-slate-100">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>

                      {/* Stock Level */}
                      <td className="p-3.5 text-right">
                        <span
                          className={`inline-block font-bold ${
                            isOut
                              ? 'text-rose-400'
                              : isLow
                              ? 'text-amber-400 font-extrabold'
                              : 'text-emerald-400'
                          }`}
                        >
                          {product.stock} units
                        </span>
                        {isLow && !isOut && (
                          <span className="block text-[10px] text-amber-500">
                            Threshold: {product.lowStockThreshold}
                          </span>
                        )}
                      </td>

                      {/* Status Badges */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {product.isVisible ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                              Visible
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                              Hidden
                            </span>
                          )}

                          {product.isFeatured && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirmationProduct(product)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-midnight-900 border border-festive-gold/30 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display font-bold text-xl text-slate-100 mb-1">
              {isEditing ? 'Edit Fireworks Product' : 'Add New Fireworks Product'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Enter product specifications, inventory quantity, safety guidelines, and imagery.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Deluxe Electric Sparklers 15cm"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Unique SKU * (e.g. RF-SPK-01)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    placeholder="RF-SPK-01"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-festive-gold uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
                  >
                    <option value="">Select a Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pack Size / Units
                  </label>
                  <input
                    type="text"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    placeholder="e.g. Box of 10 Pieces"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                  />
                </div>
              </div>

              {/* Pricing & Stock Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="120"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="150"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="100"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Low Stock Alert *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                    placeholder="10"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Description *
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed visual effects, sparkle duration, and celebration highlights..."
                  className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                ></textarea>
              </div>

              {/* Safety & Sound */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sound Level
                  </label>
                  <select
                    value={formData.soundLevel}
                    onChange={(e) => setFormData({ ...formData, soundLevel: e.target.value })}
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
                  >
                    <option value="Low / Sparkle Only">Low / Sparkle Only</option>
                    <option value="Mild Crackle">Mild Crackle</option>
                    <option value="Medium Boom">Medium Boom</option>
                    <option value="High Aerial Thud">High Aerial Thud</option>
                    <option value="Soundless">Soundless</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Safe Viewing Distance
                  </label>
                  <input
                    type="text"
                    value={formData.safetyDistance}
                    onChange={(e) => setFormData({ ...formData, safetyDistance: e.target.value })}
                    placeholder="e.g. 5 Meters minimum in open ground"
                    className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
                  />
                </div>
              </div>

              {/* Image Upload or URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Image (File Upload or Image URL)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-midnight-950 border border-dashed border-slate-700 hover:border-festive-gold text-slate-300 text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-festive-gold" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <span className="text-xs text-slate-500">OR</span>

                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                  />
                </div>

                {imagePreview && (
                  <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-midnight-950 border border-slate-800">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <span className="text-xs text-emerald-400 font-medium">
                      Image Ready
                    </span>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isGreenCracker}
                    onChange={(e) => setFormData({ ...formData, isGreenCracker: e.target.checked })}
                    className="w-4 h-4 rounded bg-midnight-950 border-slate-700 text-festive-gold"
                  />
                  <span>Green Cracker Verified</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded bg-midnight-950 border-slate-700 text-festive-gold"
                  />
                  <span>Visible on Storefront</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded bg-midnight-950 border-slate-700 text-festive-gold"
                  />
                  <span>Featured Product</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-festive-gradient text-midnight-950 hover:shadow-gold transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-midnight-900 border border-rose-500/30 p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-display font-bold text-lg text-slate-100 text-center">
              Confirm Product Deletion
            </h3>

            <p className="text-xs text-slate-300 text-center leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">
                "{deleteConfirmationProduct.name}"
              </strong>{' '}
              (SKU: {deleteConfirmationProduct.sku})? This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmationProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
