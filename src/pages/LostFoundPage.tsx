import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LostFoundItem } from '../types';
import { Search, Plus, MapPin, Calendar, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export const LostFoundPage: React.FC = () => {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('Electronics');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.getLostFound();
      if (res.success) setItems(res.items);
    } catch (err) {
      console.error('Failed to load lost/found items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location) return;
    try {
      const res = await api.reportLostFound({
        type,
        title,
        category,
        location,
        description,
      });
      if (res.success) {
        setModalOpen(false);
        setTitle('');
        setLocation('');
        setDescription('');
        await loadItems();
      }
    } catch (err) {
      console.error('Report error:', err);
    }
  };

  const filtered = items.filter(it => {
    const matchType = filterType === 'all' || it.type === filterType;
    const matchSearch =
      it.title.toLowerCase().includes(search.toLowerCase()) ||
      it.location.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Campus Lost & Found Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Secure item recovery without exposing personal contact details publicly.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Report Item</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {(['all', 'lost', 'found'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                filterType === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f === 'all' ? 'All Listings' : `${f} Items`}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search items, buildings, lecture halls..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    item.type === 'lost'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {item.type} Item
                </span>
                <span className="text-[11px] text-slate-400">{item.date}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
              <div className="text-[11px] text-slate-500">
                Workflow: <strong className="text-slate-700">{item.contactWorkflow}</strong>
              </div>

              <button
                onClick={() => alert(`Verification request initiated for "${item.title}". Check your notifications!`)}
                className="w-full py-2 px-3 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Submit Ownership Claim</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10 border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Report Campus Item</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReport} className="space-y-3">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setType('lost')}
                  className={`py-1.5 font-semibold rounded-md transition-colors ${
                    type === 'lost' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  I Lost an Item
                </button>
                <button
                  type="button"
                  onClick={() => setType('found')}
                  className={`py-1.5 font-semibold rounded-md transition-colors ${
                    type === 'found' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  I Found an Item
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Blue Airdopes Case / Scientific Calculator"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location Details *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Central Library 2nd Floor, Table 14"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Avoid Secret Details)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe color, brand, approximate time. Keep unique serial numbers private for verification."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
