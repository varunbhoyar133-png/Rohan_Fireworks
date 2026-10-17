import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight, Package } from 'lucide-react';
import { categoriesAPI } from '../services/api';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoriesAPI.getAll();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-festive-gold uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Browse By Type
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
          Product Categories
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">
          From sparkling hand-held phuljhadis to spectacular multi-shot aerial displays and complete family gift hampers.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-2xl bg-midnight-900 border border-slate-800 h-64 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="group rounded-3xl overflow-hidden bg-midnight-900 border border-slate-800 hover:border-festive-gold/40 transition-all duration-300 hover:shadow-gold flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-midnight-950">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-900 via-midnight-900/40 to-transparent"></div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-100 group-hover:text-festive-gold transition-colors mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-festive-gold">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Package className="w-3.5 h-3.5" />
                    {cat.productCount ? `${cat.productCount} Fireworks Available` : 'Explore Catalogue'}
                  </span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Collection
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
