import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

import ProductCard from '../components/common/ProductCard';
import ProductModal from '../components/common/ProductModal';
import { productsAPI, categoriesAPI } from '../services/api';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStockOnly') === 'true');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Sync category param if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Load Categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products based on current filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          sortBy,
          search: searchQuery,
          inStockOnly: inStockOnly ? 'true' : undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
        };

        const data = await productsAPI.getAll(params);
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.total || 0);

        // Update URL
        const newParams = new URLSearchParams();
        if (searchQuery) newParams.set('search', searchQuery);
        if (selectedCategory !== 'all') newParams.set('category', selectedCategory);
        if (sortBy !== 'newest') newParams.set('sortBy', sortBy);
        if (inStockOnly) newParams.set('inStockOnly', 'true');
        if (currentPage > 1) newParams.set('page', currentPage.toString());
        setSearchParams(newParams, { replace: true });
      } catch (err) {
        console.error('Error fetching catalogue products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, sortBy, inStockOnly, currentPage, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
    setInStockOnly(false);
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-festive-gold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Catalogue & Enquiries
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Fireworks Collection
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse our full range of certified festive sparklers, fountains, aerial multi-shots, and gift hampers.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-festive-gold">{products.length}</strong> of{' '}
          <strong className="text-slate-200">{totalCount}</strong> products
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search by name, SKU (e.g. RF-SPK-01), or effect..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-midnight-900 border border-slate-700 focus:border-festive-gold rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort & In-stock toggle */}
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded bg-midnight-900 border-slate-700 text-festive-gold focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-midnight-900 border border-slate-700 focus:border-festive-gold rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest Arrival</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-festive-gold text-midnight-950 shadow-gold'
                : 'bg-midnight-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            All Products
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-festive-gold text-midnight-950 shadow-gold'
                  : 'bg-midnight-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="rounded-2xl bg-midnight-900 border border-slate-800 h-80 animate-pulse"
            ></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl bg-midnight-900 border border-slate-800 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-midnight-950 border border-slate-700 text-slate-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-200">
            No matching fireworks found
          </h3>
          <p className="text-xs text-slate-400">
            We couldn't find any products matching your current filters. Try resetting search or checking another category.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-festive-gold/15 hover:bg-festive-gold text-festive-gold hover:text-midnight-950 border border-festive-gold/40 text-xs font-bold transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-800">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-midnight-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs text-slate-400 px-4">
            Page <strong className="text-slate-100">{currentPage}</strong> of{' '}
            <strong className="text-slate-100">{totalPages}</strong>
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-midnight-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick View Product Modal */}
      <ProductModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Shop;
