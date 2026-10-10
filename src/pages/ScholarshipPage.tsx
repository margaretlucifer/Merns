import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ScholarshipItem } from '../types';
import { Award, CheckCircle2, AlertCircle, ExternalLink, Filter, Sparkles } from 'lucide-react';

export const ScholarshipPage: React.FC = () => {
  const [scholarships, setScholarships] = useState<(ScholarshipItem & { isEligible?: boolean; matchReason?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchedOnly, setMatchedOnly] = useState(false);

  const loadScholarships = async () => {
    try {
      setLoading(true);
      const res = await api.matchScholarships();
      if (res.success) setScholarships(res.scholarships);
    } catch (err) {
      console.error('Failed to match scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScholarships();
  }, []);

  const displayList = matchedOnly ? scholarships.filter(s => s.isEligible) : scholarships;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <Award className="w-4 h-4" />
            <span>University & National Fellowship Discovery</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Smart Scholarship Finder & Eligibility Matcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Evaluates your verified student transcript (8.94 CGPA · Computer Science) against institutional grants.
          </p>
        </div>

        <button
          onClick={() => setMatchedOnly(!matchedOnly)}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap self-start sm:self-auto ${
            matchedOnly
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{matchedOnly ? 'Showing Eligible Only' : 'Filter Matched For Me'}</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayList.map(sch => (
          <div
            key={sch.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {sch.category}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    sch.isEligible
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {sch.isEligible ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Eligible</span>
                    </>
                  ) : (
                    <span>Check Criteria</span>
                  )}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{sch.title}</h3>

              <div className="text-xs text-slate-500">{sch.provider}</div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {sch.description}
              </p>

              {sch.matchReason && (
                <div
                  className={`p-2.5 rounded-lg text-[11px] leading-relaxed border ${
                    sch.isEligible
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {sch.matchReason}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Award Grant</span>
                  <strong className="text-base font-extrabold text-slate-900 tabular-nums">
                    ₹{sch.amountINR.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">Deadline</span>
                  <span className="text-xs font-semibold text-slate-700">{sch.deadline}</span>
                </div>
              </div>

              <a
                href={sch.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>National Portal Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
