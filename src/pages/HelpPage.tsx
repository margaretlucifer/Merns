import React from 'react';
import { HelpCircle, Mail, Phone, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Help & Campus Support Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Campus network troubleshooting, ticketing support, and academic guidance.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Academic IT Helpdesk</h3>
          <p className="text-[11px] text-slate-500">it-support@edusphere.edu.in</p>
          <div className="text-[11px] text-slate-400">Response time: &lt; 2 hours</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Dean of Student Welfare</h3>
          <p className="text-[11px] text-slate-500">+91 (080) 2468-1000</p>
          <div className="text-[11px] text-slate-400">Mon-Fri: 9 AM - 6 PM IST</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Campus Emergency Gate</h3>
          <p className="text-[11px] text-slate-500">Ext 108 / Security Main Post</p>
          <div className="text-[11px] text-slate-400">24x7 Ambulance & Patrol</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900">Common Support Directives</h3>
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <strong className="text-slate-900 block mb-1">How do I verify a ticket at an event entrance?</strong>
            <p className="text-slate-600">
              Navigate to "Events & Tickets", tap "Gate Scanner", and scan or paste the attendee's signed token payload.
              The server will return an authentic green verification badge with their registered name.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <strong className="text-slate-900 block mb-1">How can I switch personas to test different roles?</strong>
            <p className="text-slate-600">
              Use the top-right persona selector in the navbar. You can instantly switch between Student (Aarav), Faculty (Prof. Sunita), Administrator (Dr. Vikram), Freelancer (Priya), and Client (TechFest Council).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
