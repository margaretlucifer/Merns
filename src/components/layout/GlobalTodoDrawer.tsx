import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { TodoItem } from '../../types';
import { X, Plus, Check, Trash2, CheckSquare } from 'lucide-react';

interface GlobalTodoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalTodoDrawer: React.FC<GlobalTodoDrawerProps> = ({ isOpen, onClose }) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newText, setNewText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    try {
      const res = await api.getTodos();
      if (res.success) setTodos(res.todos);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  useEffect(() => {
    if (isOpen) loadTodos();
  }, [isOpen]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    try {
      setLoading(true);
      const res = await api.createTodo(newText, priority);
      if (res.success) {
        setTodos([res.todo, ...todos]);
        setNewText('');
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.toggleTodo(id);
      setTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div onClick={onClose} className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-semibold text-slate-900">Global Campus Tasks</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAdd} className="p-4 border-b border-slate-100 bg-slate-50 space-y-2">
          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Add new task (e.g. submit capstone project)..."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500 text-[11px]">Priority:</span>
              {(['low', 'medium', 'high'] as const).map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                    priority === p ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading || !newText.trim()}
              className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {todos.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No tasks logged yet. Add your first academic or campus task above!
            </div>
          ) : (
            todos.map(task => (
              <div
                key={task.id}
                className={`flex items-start justify-between gap-2 p-2.5 rounded-lg border transition-colors ${
                  task.completed ? 'bg-slate-50/70 border-slate-200 opacity-60' : 'bg-white border-slate-200'
                }`}
              >
                <button
                  onClick={() => handleToggle(task.id)}
                  className={`mt-0.5 w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 transition-colors ${
                    task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-indigo-500'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </button>
                <div className="flex-1 text-xs">
                  <div className={`text-slate-900 ${task.completed ? 'line-through text-slate-500' : ''}`}>
                    {task.text}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 capitalize">
                    {task.priority} Priority
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
