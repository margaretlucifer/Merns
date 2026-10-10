import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ProductComparison } from '../types';
import { ShoppingBag, Search, ExternalLink, CheckCircle2, TrendingDown } from 'lucide-react';

export const BasketWisePage: React.FC = () => {
  const [products, setProducts] = useState<ProductComparison[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await api.getProducts();
        if (res.success) setProducts(res.products);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const categories = ['All', 'Electronics', 'Stationery', 'Textbooks', 'Hostel Essentials'];

  const filtered = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            BasketWise — Campus Store & Student Price Match
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare campus co-op subsidized store rates directly against Amazon & Flipkart prices for student essentials.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                category === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search calculators, notebooks, textbooks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="h-44 bg-slate-100 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-slate-800">
                  {item.category}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {item.name}
                </h3>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Campus Co-op:</span>
                    <strong className="text-sm font-extrabold text-indigo-600 tabular-nums">
                      ₹{item.campusStorePriceINR}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>{item.onlinePlatform}:</span>
                    <span className="line-through tabular-nums">₹{item.onlinePriceINR}</span>
                  </div>

                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 text-[11px] font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Direct Savings:</span>
                    </span>
                    <span className="tabular-nums">₹{item.savingsINR}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => alert(`Reserved "${item.name}" at Campus Co-op Counter #2 for pickup!`)}
                className="w-full py-2 px-3 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
              >
                Reserve at Campus Co-op
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
