import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StudentAcademicRecord, SubjectRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Bell,
  UserCheck,
} from 'lucide-react';

export const StudentRecordsPage: React.FC = () => {
  const { role } = useAuth();
  const [record, setRecord] = useState<StudentAcademicRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingSubject, setUpdatingSubject] = useState<string | null>(null);

  const loadRecord = async () => {
    try {
      setLoading(true);
      const res = await api.getStudentRecord();
      if (res.success) setRecord(res.record);
    } catch (err) {
      console.error('Failed to load student record:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecord();
  }, []);

  const handleUpdateAttendance = async (subjectCode: string, action: 'present' | 'absent') => {
    try {
      setUpdatingSubject(subjectCode);
      const res = await api.updateAttendance(subjectCode, action);
      if (res.success) {
        await loadRecord();
      }
    } catch (err) {
      console.error('Failed to update attendance:', err);
    } finally {
      setUpdatingSubject(null);
    }
  };

  if (!record) {
    return (
      <div className="text-center py-20 text-xs text-slate-400">
        Loading student academic transcript and course roster...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Academic Records & Attendance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            University course registration, subject-wise attendance logs, and verified GPA transcripts.
          </p>
        </div>

        {role === 'faculty' && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Faculty Grading & Attendance Mode Enabled</span>
          </div>
        )}
      </div>

      {/* Profile & Cumulative Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Student Registration Number</div>
          <div className="text-lg font-bold text-slate-900 mt-1 tabular-nums">{record.studentId}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{record.course}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Semester & Department</div>
          <div className="text-lg font-bold text-slate-900 mt-1">Semester {record.currentSemester}</div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate">{record.department}</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Academic Performance</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-indigo-600 tabular-nums">{record.sgpa} SGPA</span>
            <span className="text-xs text-slate-500 tabular-nums">({record.cgpa} Cumulative)</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Top 5% University Rank</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Overall Attendance</div>
          <div className="text-lg font-bold text-emerald-600 mt-1 tabular-nums">
            {record.overallAttendancePercentage}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Threshold: 75% Mandatory</div>
        </div>
      </div>

      {/* Enrolled Courses & Attendance Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Enrolled Subjects & Attendance Verification</h2>
            <p className="text-xs text-slate-500">Semester 6 Regular Academic Term</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {record.subjects.length} Courses Enrolled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold">Course Code & Name</th>
                <th className="px-5 py-3 font-semibold">Faculty In-Charge</th>
                <th className="px-5 py-3 font-semibold text-center">Credits</th>
                <th className="px-5 py-3 font-semibold text-center">Sessions Held</th>
                <th className="px-5 py-3 font-semibold">Attendance %</th>
                <th className="px-5 py-3 font-semibold text-center">Current Grade</th>
                {role === 'faculty' && <th className="px-5 py-3 font-semibold text-right">Faculty Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {record.subjects.map(sub => {
                const percentage = Math.round((sub.attendancePresent / sub.attendanceTotal) * 100);
                const isWarning = percentage < 75;

                return (
                  <tr key={sub.code} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{sub.code}</div>
                      <div className="text-slate-600 text-[11px]">{sub.name}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">{sub.facultyName}</td>
                    <td className="px-5 py-3.5 text-center tabular-nums text-slate-800 font-medium">
                      {sub.credits}
                    </td>
                    <td className="px-5 py-3.5 text-center tabular-nums">
                      <span className="font-semibold text-slate-900">{sub.attendancePresent}</span>
                      <span className="text-slate-400"> / {sub.attendanceTotal}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-bold tabular-nums ${
                            isWarning ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                        >
                          {percentage}%
                        </span>
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {sub.grade || 'In-Progress'}
                      </span>
                    </td>
                    {role === 'faculty' && (
                      <td className="px-5 py-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => handleUpdateAttendance(sub.code, 'present')}
                          disabled={updatingSubject === sub.code}
                          className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-[11px] transition-colors"
                        >
                          + Present
                        </button>
                        <button
                          onClick={() => handleUpdateAttendance(sub.code, 'absent')}
                          disabled={updatingSubject === sub.code}
                          className="px-2.5 py-1 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-[11px] transition-colors"
                        >
                          + Absent
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Announcements */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Departmental Announcements & Exam Directives</h2>
        </div>

        <div className="space-y-3">
          {record.announcements.map(anc => (
            <div key={anc.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{anc.title}</span>
                <span className="text-[11px] text-slate-400">{anc.date}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{anc.content}</p>
              <div className="text-[11px] text-indigo-600 font-medium pt-1">Issued by: {anc.faculty}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
