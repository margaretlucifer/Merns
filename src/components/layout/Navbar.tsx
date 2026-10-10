import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Bell,
  CheckSquare,
  UserCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenTodos: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTodos,
  onOpenNotifications,
  unreadNotificationsCount = 2,
  activeTab,
  setActiveTab,
}) => {
  const { user, role, switchRole } = useAuth();

  const roleOptions: { role: UserRole; label: string; desc: string }[] = [
    { role: 'student', label: 'Student', desc: 'Aarav Sharma (B.Tech CSE)' },
    { role: 'faculty', label: 'Faculty', desc: 'Prof. Sunita Rao' },
    { role: 'admin', label: 'Administrator', desc: 'Dr. Vikram Malhotra (Dean)' },
    { role: 'freelancer', label: 'Freelancer', desc: 'Priya Nair (Design Lead)' },
    { role: 'client', label: 'Club / Client', desc: 'TechFest Organizing Council' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-700 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 block leading-tight">
                EduSphere
              </span>
              <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap block leading-none">
                Smart Campus Network
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'dashboard' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'events' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
              }`}
            >
              Events & Tickets
            </button>
            <button
              onClick={() => setActiveTab('academic')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'academic' || activeTab === 'records' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
              }`}
            >
              Academic Records
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 py-1 ${
                activeTab === 'marketplace' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
              }`}
            >
              Nexora Marketplace
            </button>
            <button
              onClick={() => setActiveTab('whatif')}
              className={`hover:text-indigo-600 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
                activeTab === 'whatif' ? 'text-indigo-600 border-b-2 border-indigo-600 font-semibold' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>WhatIf AI</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action block with persona switcher & tools */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Demo Persona Switcher */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 whitespace-nowrap shrink-0"
                title="Switch Demo Role Persona"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span className="capitalize font-semibold">{role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 hidden group-hover:block group-focus-within:block z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Switch Campus Persona
                </div>
                {roleOptions.map(opt => (
                  <button
                    key={opt.role}
                    onClick={() => switchRole(opt.role)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      role === opt.role ? 'bg-indigo-50/70 text-indigo-700 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="capitalize">{opt.label}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{opt.desc}</div>
                    </div>
                    {role === opt.role && <span className="text-xs text-indigo-600">Active</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick To-Do Button */}
            <button
              onClick={onOpenTodos}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors relative"
              title="Global Tasks & To-Do"
            >
              <CheckSquare className="w-4 h-4" />
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors relative"
              title="Campus Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
              )}
            </button>

            {/* User Avatar */}
            {user && (
              <button
                onClick={() => setActiveTab('digital-id')}
                className="flex items-center gap-2 pl-2 border-l border-slate-200"
                title="View Digital ID Card"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
