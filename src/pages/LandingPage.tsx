import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Ticket,
  CreditCard,
  Briefcase,
  Leaf,
  Shield,
  ArrowRight,
  CheckCircle2,
  Users,
  Compass,
} from 'lucide-react';

interface LandingPageProps {
  onEnterPortal: () => void;
  onSelectRole: (role: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterPortal, onSelectRole }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 h-16">
            {/* Zone 1: Brand title */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
                EduSphere
              </span>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
                Features
              </a>
              <a href="#marketplace" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
                Nexora Marketplace
              </a>
              <a href="#academics" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
                Academic Hub
              </a>
              <a href="#sustainability" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
                Sustainability
              </a>
              <a href="#faq" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
                FAQ
              </a>
            </nav>

            {/* Zone 3: Primary action */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onEnterPortal}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <span>Enter Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-slate-200 bg-linear-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-700">
                <span>Integrated University Operating System</span>
                <span aria-hidden="true">·</span>
                <span>Tailored for Indian Colleges</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight text-balance">
                One Campus. <br />
                <span className="text-indigo-600">Every Possibility.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                EduSphere unites university administration, verified QR ticketing, digital student IDs,
                AI-guided career simulations, personal finance in ₹ INR, student freelancing, and campus
                transit in a single unified digital ecosystem.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onEnterPortal}
                  className="px-5 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>Launch Student Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#demo-roles"
                  className="px-5 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all whitespace-nowrap shrink-0"
                >
                  Explore Demo Personas
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified QR Student IDs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nexora Micro-Economy (₹ INR)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Gemini WhatIf Career AI</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
                <img
                  src="/src/assets/images/hero_campus_life_1791650542236.jpg"
                  alt="Students collaborating at modern university innovation hub"
                  className="w-full h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">IIT Bengaluru Campus Node</div>
                      <div className="text-[11px] text-slate-500">4,200+ Students & Faculty Connected</div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-indigo-600">Active Term 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Roles Section */}
      <section id="demo-roles" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Test Every Campus Persona Instantly
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              EduSphere enforces role-based access for students, professors, deans, student freelancers, and fest organizers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                role: 'student',
                name: 'Aarav Sharma',
                sub: 'B.Tech CSE (3rd Year)',
                desc: 'View attendance, QR passes, notes, study planner & personal expenses.',
                color: 'border-indigo-200 bg-indigo-50/40 text-indigo-900',
              },
              {
                role: 'faculty',
                name: 'Prof. Sunita Rao',
                sub: 'Associate Professor',
                desc: 'Review assigned courses, publish quizzes, and maintain lecture records.',
                color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
              },
              {
                role: 'admin',
                name: 'Dr. Vikram Malhotra',
                sub: 'Dean Academic Affairs',
                desc: 'Platform analytics, audit logs, student rosters, and moderation queue.',
                color: 'border-slate-300 bg-slate-100 text-slate-900',
              },
              {
                role: 'freelancer',
                name: 'Priya Nair',
                sub: 'UI/UX Student Lead',
                desc: 'Browse paid campus gigs, submit proposals, track milestone earnings.',
                color: 'border-amber-200 bg-amber-50/40 text-amber-900',
              },
              {
                role: 'client',
                name: 'TechFest Council',
                sub: 'Campus Fest Organizers',
                desc: 'Commission student developers, approve milestones, issue ticket passes.',
                color: 'border-violet-200 bg-violet-50/40 text-violet-900',
              },
            ].map(item => (
              <div
                key={item.role}
                className={`p-4 rounded-xl border ${item.color} flex flex-col justify-between`}
              >
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider opacity-70 mb-1">
                    {item.role}
                  </div>
                  <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-500 mb-2">{item.sub}</div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.desc}</p>
                </div>
                <button
                  onClick={() => onSelectRole(item.role)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 transition-colors whitespace-nowrap shadow-xs"
                >
                  Login as {item.role}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Pillar Sections */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
            Ecosystem Architecture
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Six Pillars of the Smart Campus
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">1. Campus Event Hub & QR Tickets</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discover hackathons, guest lectures, and cultural fests. Instant registration generates
              cryptographically verifiable QR tickets for seamless check-in at auditorium gates.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">2. Official Digital Student ID</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clean university card with verified photograph, enrollment number, blood group, and
              opaque status token for campus library, mess, and exam hall entry.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">3. WhatIf AI Career Simulator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI-driven pathway planner analyzing your courses, target CTC, skills, and open-source
              interests to formulate realistic capstone projects and placement preparation timelines.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">4. Nexora Micro-Economy Marketplace</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Campuses operate on internal student commerce. Clubs and departments commission UI
              designs, event apps, and videos directly from student freelancers with ₹ INR budgets.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">5. EcoRoute AI Transit & Delivery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Optimize electric shuttles, cafeteria supply runs, and library book deliveries.
              Calculates real distances between campus blocks and logs CO₂ emissions saved.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">6. Academic Governance & Admin Console</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete faculty dashboards, attendance tracking, quiz creation with automatic
              grading, notes moderation, and audit logs keeping campus records tamper-free.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-slate-100 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-600 mt-1">Key information regarding EduSphere deployment</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <h4 className="text-xs font-semibold text-slate-900">How does QR ticket verification work at campus gates?</h4>
              <p className="text-xs text-slate-600 mt-1">
                Each event registration mints an encrypted server signature. Gate staff or club organizers scan the QR code
                using the built-in EduSphere scanner, which verifies validity against the database in real-time.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <h4 className="text-xs font-semibold text-slate-900">Is Nexora limited to students within the college?</h4>
              <p className="text-xs text-slate-600 mt-1">
                Yes. Nexora is a closed-loop university micro-economy. Only authenticated students with verified enrollment
                numbers can bid on campus projects posted by college clubs and academic departments.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <h4 className="text-xs font-semibold text-slate-900">How is student attendance recorded and calculated?</h4>
              <p className="text-xs text-slate-600 mt-1">
                Faculty members record attendance per lecture session. EduSphere aggregates subject-wise percentages and
                flags students below the university 75% threshold with timely study alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
              E
            </div>
            <span className="font-semibold text-slate-900">EduSphere Campus Network</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onEnterPortal} className="hover:text-slate-900 transition-colors">
              Portal Access
            </button>
            <a href="#demo-roles" className="hover:text-slate-900 transition-colors">
              Personas
            </a>
            <span>Indian Institute of Technology & Engineering Node</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
