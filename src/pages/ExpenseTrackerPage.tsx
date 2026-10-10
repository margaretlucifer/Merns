import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ExpenseRecord } from '../types';
import {
  IndianRupee,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Calendar,
  Wallet,
  PieChart,
} from 'lucide-react';

export const ExpenseTrackerPage: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [summary, setSummary] = useState({
    totalIncome: 14000,
    totalExpense: 3099,
    balance: 10901,
    monthlyBudget: 12000,
    budgetRemaining: 8901,
  });
  const [loading, setLoading] = useState(true);

  // Form State
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState<any>('Food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.getExpenses();
      if (res.success) {
        setExpenses(res.expenses);
        setSummary(res.summary);
      }
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    try {
      const res = await api.createExpense({
        type,
        category,
        amountINR: Number(amount),
        description,
        date,
      });
      if (res.success) {
        setAmount('');
        setDescription('');
        await loadExpenses();
      }
    } catch (err) {
      console.error('Failed to log transaction:', err);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID,Type,Category,Amount (INR),Date,Description'];
    const rows = expenses.map(
      e => `"${e.id}","${e.type}","${e.category}","${e.amountINR}","${e.date}","${e.description}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edusphere_finance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Personal Expense & Finance Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor hostel allowances, verified Nexora freelance income, study book purchases, and personal savings goals in ₹ INR.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Monthly CSV</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Monthly Income</div>
          <div className="text-xl font-bold text-emerald-600 mt-1 tabular-nums flex items-center gap-1">
            <ArrowDownLeft className="w-4 h-4" />
            <span>₹{summary.totalIncome.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Allowance + Freelancing</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Monthly Expenses</div>
          <div className="text-xl font-bold text-rose-600 mt-1 tabular-nums flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>₹{summary.totalExpense.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Mess, Books & Commute</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Net Campus Balance</div>
          <div className="text-xl font-bold text-slate-900 mt-1 tabular-nums">
            ₹{summary.balance.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-600 mt-0.5">Healthy liquidity ratio</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Remaining Budget</div>
          <div className="text-xl font-bold text-indigo-600 mt-1 tabular-nums">
            ₹{summary.budgetRemaining.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Of ₹{summary.monthlyBudget.toLocaleString('en-IN')} Target</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Transaction History (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Ledger & Transaction History</h2>
            <span className="text-xs text-slate-500">{expenses.length} Records</span>
          </div>

          <div className="divide-y divide-slate-100">
            {expenses.map(item => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {item.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.description}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-medium text-slate-600">{item.category}</span>
                      <span>·</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-extrabold tabular-nums ${
                      item.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {item.type === 'income' ? '+' : '-'}₹{item.amountINR.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Log Form (4 cols) */}
        <div className="lg:col-span-4">
          <form
            onSubmit={handleAdd}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs"
          >
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Log Financial Entry
            </h3>

            {/* Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-1.5 font-semibold rounded-md transition-colors ${
                  type === 'expense' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-1.5 font-semibold rounded-md transition-colors ${
                  type === 'income' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Income
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Amount (₹ INR) *</label>
              <input
                type="number"
                required
                min="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 450"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Food">Food & Mess</option>
                <option value="Books">Books & Supplies</option>
                <option value="Travel">Metro & Travel</option>
                <option value="Education">Course & Workshops</option>
                <option value="Shopping">Shopping & Essentials</option>
                <option value="Freelancing">Freelance Earnings</option>
                <option value="Pocket Money">Hostel Allowance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Late night canteen coffee"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-3 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Transaction</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
