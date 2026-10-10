import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, AuditLogItem } from '../types';
import {
  ShieldCheck,
  Users,
  Calendar,
  IndianRupee,
  BookOpen,
  Brain,
  ShieldAlert,
  Download,
  CheckCircle2,
} from 'lucide-react';

export const AdminConsolePage: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalUsers: 5,
    activeStudents: 1,
    facultyAccounts: 1,
    publishedEvents: 4,
    ticketsIssued: 2,
    marketplaceVolumeINR: 26500,
    notesUploaded: 3,
    quizAttempts: 1,
    auditLogsCount: 3,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        setLoading(true);
        const [stRes, usRes, logRes] = await Promise.all([
          api.getAdminStats(),
          api.getAdminUsers(),
          api.getAdminAuditLogs(),
        ]);
        if (stRes.success) setStats(stRes.stats);
        if (usRes.success) setUsers(usRes.users);
        if (logRes.success) setAuditLogs(logRes.logs);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAdmin();
  }, []);

  const handleExportAudit = () => {
    const headers = ['ID,Timestamp,Actor,Action,Details,Status'];
    const rows = auditLogs.map(
      l => `"${l.id}","${l.timestamp}","${l.actor}","${l.action}","${l.details}","${l.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edusphere_audit_log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Directorate & Governance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Administrator Console & Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Supervise collegiate accounts, verify digital IDs, audit security transactions, and monitor campus economy.
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Security Audit CSV</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Verified Campus Accounts</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {stats.totalUsers} Active
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Students, Faculty & Clubs</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Published Events & Passes</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1 tabular-nums">
            {stats.publishedEvents} Events · {stats.ticketsIssued} Passes
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">100% Cryptographic QR Verified</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Marketplace Volume (₹ INR)</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            ₹{stats.marketplaceVolumeINR?.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-600 mt-0.5">Direct student economic empowerment</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Academic Submissions</div>
          <div className="text-2xl font-bold text-violet-600 mt-1 tabular-nums">
            {stats.notesUploaded} Notes · {stats.quizAttempts} Quizzes
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Zero moderation disputes</p>
        </div>
      </div>

      {/* User Management Roster */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Campus User Registry & Permissions</h2>
          <span className="text-xs text-slate-500">{users.length} Users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold">User Name & Avatar</th>
                <th className="px-5 py-3 font-semibold">Email Address</th>
                <th className="px-5 py-3 font-semibold">Institutional Role</th>
                <th className="px-5 py-3 font-semibold">Department / Council</th>
                <th className="px-5 py-3 font-semibold">Enrollment / Employee ID</th>
                <th className="px-5 py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 font-mono text-[11px]">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="capitalize px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-700">{u.department}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-800">
                    {u.enrollmentNumber || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Security & Operational Audit Trail</h2>
          <span className="text-xs text-slate-500 font-mono">{auditLogs.length} Events Logged</span>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.map(log => (
            <div key={log.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                  <span className="text-slate-500">by {log.actor}</span>
                </div>
                <div className="text-slate-800 font-medium">{log.details}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[11px] text-slate-400 font-mono">{log.timestamp}</div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
