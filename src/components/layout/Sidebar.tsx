import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  CreditCard,
  Search,
  BookOpen,
  CalendarCheck,
  Brain,
  Wrench,
  Award,
  Briefcase,
  IndianRupee,
  ShoppingBag,
  Leaf,
  CheckSquare,
  ShieldCheck,
  User as UserIcon,
  Bell,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const { user, role } = useAuth();

  const handleSelect = (tab: string) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
  };

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'profile', label: 'My Profile', icon: UserIcon },
      ],
    },
    {
      title: 'CAMPUS LIFE',
      items: [
        { id: 'events', label: 'Events & Tickets', icon: Calendar },
        { id: 'records', label: 'Student Records', icon: GraduationCap },
        { id: 'digital-id', label: 'Digital ID Card', icon: CreditCard },
        { id: 'lost-found', label: 'Lost & Found', icon: Search },
      ],
    },
    {
      title: 'ACADEMIC HUB',
      items: [
        { id: 'planner', label: 'Study Planner', icon: CalendarCheck },
        { id: 'notes', label: 'Notes Library', icon: BookOpen },
        { id: 'quizzes', label: 'Quiz Portal', icon: Brain },
        { id: 'whatif', label: 'WhatIf AI Simulator', icon: Brain },
        { id: 'toolscout', label: 'ToolScout AI', icon: Wrench },
        { id: 'scholarships', label: 'Scholarships', icon: Award },
      ],
    },
    {
      title: 'MICRO-ECONOMY',
      items: [
        { id: 'marketplace', label: 'Nexora Marketplace', icon: Briefcase },
        { id: 'expenses', label: 'Expense Tracker', icon: IndianRupee },
        { id: 'basketwise', label: 'BasketWise Store', icon: ShoppingBag },
      ],
    },
    {
      title: 'SUSTAINABILITY',
      items: [
        { id: 'ecoroute', label: 'EcoRoute AI Transit', icon: Leaf },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'todos', label: 'Global Tasks', icon: CheckSquare },
        ...(role === 'admin' || role === 'faculty'
          ? [{ id: 'admin', label: 'Admin Console', icon: ShieldCheck }]
          : []),
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 overflow-y-auto transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Active User Mini Pill/Card */}
          {user && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-slate-300 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-900 truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-500 capitalize truncate flex items-center gap-1">
                    <span>{user.role}</span>
                    <span>·</span>
                    <span className="truncate">{user.department.split('&')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Groups */}
          {navGroups.map(group => (
            <div key={group.title} className="space-y-1">
              <div className="px-2.5 text-[10px] font-semibold text-slate-400 tracking-wider">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs rounded-lg font-medium transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* University Credential Footer */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 px-2.5 space-y-1">
            <div>EduSphere Campus v2.4</div>
            <div>IIT Bengaluru Node</div>
          </div>
        </div>
      </aside>
    </>
  );
};
