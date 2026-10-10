import React, { useState } from 'react';
import { api } from '../services/api';
import { Sparkles, Brain, ArrowRight, BookOpen, Clock, Compass, Layers, CheckCircle2 } from 'lucide-react';

export const WhatIfAIPage: React.FC = () => {
  const [currentSemester, setCurrentSemester] = useState('6th Semester');
  const [careerGoal, setCareerGoal] = useState('Full-Stack AI & Cloud Systems Engineer');
  const [skills, setSkills] = useState('React, TypeScript, Node.js, Python, Docker, PostgreSQL');
  const [favoriteSubjects, setFavoriteSubjects] = useState('Distributed Systems, Artificial Intelligence');
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<string | null>(null);

  const presets = [
    {
      title: 'Full-Stack AI & Cloud Systems Engineer',
      skills: 'React 19, TypeScript, Express, Python, Docker, Vector DBs, Gemini API',
      subjects: 'Distributed Systems, Cloud Architecture, ML Systems',
    },
    {
      title: 'Quantitative Finance & High-Frequency Systems Developer',
      skills: 'C++, Low-Latency Networks, Python, Linear Algebra, Probability',
      subjects: 'Operating Systems, Algorithms, Computational Statistics',
    },
    {
      title: 'Cybersecurity & Cryptographic Systems Analyst',
      skills: 'Wireshark, Linux Internals, Rust, Zero-Knowledge Proofs, Pentesting',
      subjects: 'Information Security, Cryptography, Computer Networks',
    },
    {
      title: 'Robotics & Autonomous Vehicle Software Engineer',
      skills: 'ROS2, C++, PyTorch, SLAM, OpenCV, Sensor Fusion',
      subjects: 'Control Systems, Computer Vision, Embedded Hardware',
    },
  ];

  const handleSimulate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const res = await api.getWhatIfRoadmap({
        currentSemester,
        careerGoal,
        skills,
        favoriteSubjects,
        hoursPerWeek,
      });
      if (res.success) {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      console.error('Simulation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (p: typeof presets[0]) => {
    setCareerGoal(p.title);
    setSkills(p.skills);
    setFavoriteSubjects(p.subjects);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600">
            <Sparkles className="w-4 h-4" />
            <span>AI-Assisted Academic & Career Exploration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            WhatIf AI — Career Pathway Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Simulate placements, capstone project blueprints, skill gap closures, and preparation schedules tailored to your semester.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Input Configuration Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preset Buttons */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-700">Quick Career Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg transition-colors border border-slate-200"
                >
                  {preset.title.split('&')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Form */}
          <form onSubmit={handleSimulate} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Target Placement / Career Goal *</label>
              <input
                type="text"
                required
                value={careerGoal}
                onChange={e => setCareerGoal(e.target.value)}
                placeholder="e.g. Full-Stack AI & Cloud Systems Engineer"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Current Academic Term</label>
                <select
                  value={currentSemester}
                  onChange={e => setCurrentSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="4th Semester">4th Semester (2nd Year)</option>
                  <option value="5th Semester">5th Semester (3rd Year)</option>
                  <option value="6th Semester">6th Semester (3rd Year)</option>
                  <option value="7th Semester">7th Semester (Final Year)</option>
                  <option value="8th Semester">8th Semester (Final Year)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Weekly Study Time (Hrs)</label>
                <input
                  type="number"
                  min="5"
                  max="40"
                  value={hoursPerWeek}
                  onChange={e => setHoursPerWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Current Tech Stack & Skills</label>
              <textarea
                rows={2}
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. React, Python, C++, Docker, Postgres"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Favorite University Subjects</label>
              <input
                type="text"
                value={favoriteSubjects}
                onChange={e => setFavoriteSubjects(e.target.value)}
                placeholder="e.g. Distributed Systems, ML, Compilers"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Career Matrix...' : 'Run WhatIf AI Simulation'}</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              Powered by EduSphere Placement Analytics & Gemini Reasoning Models.
            </p>
          </form>
        </div>

        {/* Results Output Column */}
        <div className="lg:col-span-7">
          {roadmap ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-900">Personalized Career Synthesis</span>
                </div>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  Target: {careerGoal}
                </span>
              </div>

              {/* Formatted Markdown Rendering */}
              <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-3 text-slate-700">
                {roadmap.split('\n\n').map((block, idx) => {
                  if (block.startsWith('###') || block.startsWith('####')) {
                    return (
                      <h4 key={idx} className="text-sm font-bold text-slate-900 mt-4 mb-1">
                        {block.replace(/^[#]+\s*/, '')}
                      </h4>
                    );
                  }
                  if (block.startsWith('- ')) {
                    const lines = block.split('\n');
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-1">
                        {lines.map((l, li) => (
                          <li key={li}>{l.replace(/^[-\*]\s*/, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={idx}>{block}</p>;
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Recommendations calibrated against Indian Tech Ecosystem 2026.</span>
                <button
                  onClick={() => alert('Roadmap saved to your Academic Profile!')}
                  className="px-3 py-1.5 font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-lg"
                >
                  Save to Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Compass className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-slate-900">Career Pathway Simulator Ready</h3>
                <p className="text-xs text-slate-500">
                  Choose your target aspiration, current tech stack, and weekly study bandwidth to generate
                  custom capstone projects, placement roadmaps, and salary benchmarks.
                </p>
              </div>
              <button
                onClick={() => handleSimulate()}
                className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                Simulate Default Pathway (Cloud & AI)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
