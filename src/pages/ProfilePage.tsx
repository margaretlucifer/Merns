import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, GraduationCap, Mail, Phone, Building, Calendar, ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, role } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Campus Profile & Academic Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Verified university identification details registered with the Academic Directorate.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user.avatarUrl}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
          />
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <span className="capitalize px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {role}
              </span>
            </div>
            <div className="text-xs text-slate-500">{user.collegeName}</div>
            <div className="text-xs font-semibold text-indigo-600">
              Registration ID: {user.enrollmentNumber || 'ED-2023-CS-0428'}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Official University Email</span>
            </span>
            <div className="font-semibold text-slate-900">{user.email}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>Phone Contact</span>
            </span>
            <div className="font-semibold text-slate-900">{user.phone || '+91 98765 43210'}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>Academic Department</span>
            </span>
            <div className="font-semibold text-slate-900">{user.department}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Academic Year / Semester</span>
            </span>
            <div className="font-semibold text-slate-900">
              {user.academicYear || '3rd Year'} · Semester {user.semester || 6}
            </div>
          </div>
        </div>

        {user.bio && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Professional Bio</div>
            <p className="text-slate-700 leading-relaxed">{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};
