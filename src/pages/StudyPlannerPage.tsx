import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StudyTask } from '../types';
import {
  CalendarCheck,
  Plus,
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export const StudyPlannerPage: React.FC = () => {
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [streakDays, setStreakDays] = useState(5);
  const [weeklyTarget, setWeeklyTarget] = useState(18);
  const [completedHours, setCompletedHours] = useState(12.5);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Distributed Systems');
  const [minutes, setMinutes] = useState(60);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const loadPlans = async () => {
    try {
      setLoading(true);
      const res = await api.getStudyPlans();
      if (res.success) {
        setTasks(res.tasks);
        setStreakDays(res.streakDays);
        setWeeklyTarget(res.weeklyTargetHours);
        setCompletedHours(res.completedHours);
      }
    } catch (err) {
      console.error('Failed to load study plans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await api.toggleStudyTask(id);
      setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      const res = await api.createStudyTask({
        title,
        subject,
        estimatedMinutes: Number(minutes),
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        priority,
      });
      if (res.success) {
        setTasks([...tasks, res.task]);
        setTitle('');
      }
    } catch (err) {
      console.error('Failed to add study task:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Interactive Study Planner & Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Subject-wise revision blocks, exam countdowns, study streaks, and weekly targets.
          </p>
        </div>

        {/* Streak Badge */}
        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 self-start sm:self-auto">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          <div>
            <div className="text-xs font-bold text-amber-950 tabular-nums">{streakDays} Day Study Streak!</div>
            <div className="text-[10px] text-amber-700">Top 10% Consistency in Department</div>
          </div>
        </div>
      </div>

      {/* Progress & Target Card */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Weekly Target Progress</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{completedHours}h</span>
            <span className="text-xs text-slate-400">/ {weeklyTarget}h Target</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full"
              style={{ width: `${Math.round((completedHours / weeklyTarget) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Semester Finals Countdown</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-600 tabular-nums">42 Days</span>
            <span className="text-xs text-slate-400">Starts Nov 22, 2026</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Distributed Systems & Compilers</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Task Completion Rate</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 tabular-nums">
              {Math.round((tasks.filter(t => t.completed).length / Math.max(1, tasks.length)) * 100)}%
            </span>
            <span className="text-xs text-slate-400">
              ({tasks.filter(t => t.completed).length}/{tasks.length} Completed)
            </span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-0.5">On pace for academic distinction</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Task List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Scheduled Study Sessions & Deadlines</h2>
              <span className="text-xs text-slate-500">{tasks.length} Sessions</span>
            </div>

            <div className="divide-y divide-slate-100">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                    task.completed ? 'bg-slate-50/60 opacity-60' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggle(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-indigo-500'
                      }`}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div>
                      <h4
                        className={`text-xs font-bold text-slate-900 ${
                          task.completed ? 'line-through text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="text-indigo-600 font-semibold">{task.subject}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="tabular-nums">{task.estimatedMinutes} mins</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Due {task.dueDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider shrink-0 ${
                      task.priority === 'high'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : task.priority === 'medium'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Session Form (4 cols) */}
        <div className="lg:col-span-4">
          <form
            onSubmit={handleAddTask}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs"
          >
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Schedule Study Session
            </h3>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Session Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Master Raft Consensus algorithm"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                <option value="Distributed Systems">Distributed Systems</option>
                <option value="Compiler Design">Compiler Design</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Information Security">Information Security</option>
                <option value="Capstones & Projects">Capstones & Projects</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration (Mins)</label>
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={minutes}
                  onChange={e => setMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-3 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Timetable</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
