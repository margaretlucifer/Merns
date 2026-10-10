import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Wrench, Search, ExternalLink, Check, Sparkles, Filter } from 'lucide-react';

export const ToolScoutPage: React.FC = () => {
  const [tools, setTools] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [loading, setLoading] = useState(false);

  const loadTools = async () => {
    try {
      setLoading(true);
      const res = await api.getToolScoutRecommendations(query, selectedCat);
      if (res.success) setTools(res.tools);
    } catch (err) {
      console.error('Failed to load tools:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, [selectedCat]);

  const categories = ['All', 'Web Development', 'Database & Backend', 'Artificial Intelligence', 'UI/UX Design'];

  const filteredTools = tools.filter(t => {
    const matchesCat = selectedCat === 'All' || t.category === selectedCat;
    const matchesQuery =
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <Wrench className="w-4 h-4" />
            <span>Curated Campus Resource Discovery</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            ToolScout AI — Developer & Student Tool Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Discover verified developer platforms, student license packs, and open-source frameworks.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedCat === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks, libraries, engines..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredTools.map((tool, idx) => (
          <div
            key={idx}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {tool.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{tool.name}</h3>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md shrink-0">
                  {tool.pricing}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{tool.description}</p>

              {/* Pros List */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-slate-500">Key Strengths:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-700">
                  {tool.pros?.map((pro: string, pi: number) => (
                    <div key={pi} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{pro}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Difficulty: {tool.difficulty}</span>
              <a
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                <span>Official Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
