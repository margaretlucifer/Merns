import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Calendar,
  GraduationCap,
  IndianRupee,
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const { user, role } = useAuth();
  const [eventsCount, setEventsCount] = useState(4);
  const [tasksCount, setTasksCount] = useState(3);
  const [balance, setBalance] = useState(11301);
  const [attendance, setAttendance] = useState(86.4);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        const [evRes, expRes, stdRes] = await Promise.all([
          api.getEvents(),
          api.getExpenses(),
          api.getStudentRecord(),
        ]);
        if (evRes.success) setEventsCount(evRes.events.length);
        if (expRes.success) setBalance(expRes.summary.balance);
        if (stdRes.success) setAttendance(stdRes.record.overallAttendancePercentage);
      } catch (err) {
        console.warn('Overview data loaded with fallback defaults:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOverview();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-300">
              <span>{user?.collegeName || 'Indian Institute of Technology & Engineering, Bengaluru'}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize font-semibold text-white">{role} Persona</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Academic Term 2026-27 · Department of {user?.department}
              {user?.enrollmentNumber ? ` · ID: ${user?.enrollmentNumber}` : ''}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('digital-id')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-xs transition-colors whitespace-nowrap"
            >
              Digital Student ID
            </button>
            <button
              onClick={() => setActiveTab('whatif')}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>WhatIf AI Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Attendance */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Overall Attendance</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{attendance}%</span>
            <span className="text-xs text-emerald-600 font-medium">Above 75% Min</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, attendance)}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Academic CGPA */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Cumulative GPA (CGPA)</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">8.94 / 10</span>
            <span className="text-xs text-indigo-600 font-medium">Semester 6: 9.12 SGPA</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Class Rank: Top 5% in CSE</p>
        </div>

        {/* KPI 3: Personal Finance */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Net Campus Balance</span>
            <IndianRupee className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">₹{balance.toLocaleString('en-IN')}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Includes verified freelance earnings</p>
        </div>

        {/* KPI 4: Campus Events */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Published Events</span>
            <Calendar className="w-4 h-4 text-violet-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tabular-nums">{eventsCount} Active</span>
            <span className="text-xs text-violet-600 font-medium">2 Passes Issued</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Next: EduHack 2026 (Oct 24)</p>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Modules in action */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Academic Attendance Overview */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Current Semester Subjects & Attendance</h3>
                <p className="text-xs text-slate-500">6th Semester · Computer Science & Engineering</p>
              </div>
              <button
                onClick={() => setActiveTab('records')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Full Transcript</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {[
                { code: 'CS-601', name: 'Distributed Systems & Cloud Computing', pct: 88, present: 32, total: 36, fac: 'Prof. Sunita Rao' },
                { code: 'CS-602', name: 'Compiler Design & Automata', pct: 79, present: 27, total: 34, fac: 'Dr. Ramesh Kulkarni' },
                { code: 'CS-603', name: 'Artificial Intelligence & Machine Learning', pct: 93, present: 30, total: 32, fac: 'Dr. Kavita Verma' },
                { code: 'CS-604', name: 'Information Security & Cryptography', pct: 86, present: 26, total: 30, fac: 'Prof. Anirudh Sen' },
              ].map(sub => (
                <div key={sub.code} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {sub.code}: {sub.name}
                    </div>
                    <div className="text-[11px] text-slate-400">{sub.fac}</div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 tabular-nums">{sub.pct}%</div>
                      <div className="text-[10px] text-slate-400 tabular-nums">
                        {sub.present}/{sub.total} sessions
                      </div>
                    </div>
                    <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${sub.pct >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${sub.pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nexora Micro-Economy Spotlight */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">Nexora Campus Gigs & Micro-Economy</h3>
              </div>
              <button
                onClick={() => setActiveTab('marketplace')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>Browse All Gigs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Active Contract
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">
                  Spandan 2026 Cultural Fest Mobile Web App & Pass Portal
                </h4>
                <p className="text-[11px] text-slate-500">Client: TechFest Organizing Council · Deadline: Oct 28</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-slate-900 tabular-nums">₹12,000</div>
                <div className="text-[10px] text-slate-400">Milestone: In Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick access utilities */}
        <div className="lg:col-span-4 space-y-6">
          {/* Flagship Event Ticket Pass */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">Next Upcoming Event</span>
              <span className="text-[11px] text-indigo-600 font-semibold">Oct 24</span>
            </div>
            <div className="text-xs font-bold text-slate-900 leading-tight">
              EduHack 2026: National Smart Campus Hackathon
            </div>
            <p className="text-[11px] text-slate-500">Main Auditorium · 36-hour flagship hackathon</p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Ticket Status:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pass #89412 Ready</span>
              </span>
            </div>
            <button
              onClick={() => setActiveTab('events')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-center block"
            >
              View QR Ticket Pass
            </button>
          </div>

          {/* EcoRoute Campus Shuttles Status */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">EcoRoute AI Shuttles</span>
              <span className="text-[11px] text-emerald-600 font-semibold">Zero Emission</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Route 1: Canteen → Library</div>
                  <div className="text-[10px] text-slate-400">1.4 km · Next shuttle in 4 mins</div>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 tabular-nums">0.38kg CO₂ saved</span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('ecoroute')}
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-center block"
            >
              Open Campus Map & Routes
            </button>
          </div>

          {/* Quick Academic Hub Shortcuts */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-xs font-semibold text-slate-900 mb-2">Academic Hub Utilities</div>
            <button
              onClick={() => setActiveTab('planner')}
              className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-xs flex items-center justify-between text-slate-700"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Today's Study Timetable</span>
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-xs flex items-center justify-between text-slate-700"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Semester 6 Notes Library</span>
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => setActiveTab('scholarships')}
              className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-xs flex items-center justify-between text-slate-700"
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                <span>Matching Scholarships (₹50k)</span>
              </span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
