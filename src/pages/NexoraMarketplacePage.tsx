import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MarketplaceProject, Proposal } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  IndianRupee,
  Clock,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const NexoraMarketplacePage: React.FC = () => {
  const { user, role } = useAuth();
  const [projects, setProjects] = useState<MarketplaceProject[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-gigs'>('browse');
  const [loading, setLoading] = useState(true);

  // Modals
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<MarketplaceProject | null>(null);

  // New Project Form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newBudget, setNewBudget] = useState('8000');
  const [newCategory, setNewCategory] = useState<'web_dev' | 'ui_ux' | 'content' | 'video'>('web_dev');
  const [newDeadline, setNewDeadline] = useState('2026-11-15');

  // Proposal Form
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('7');

  const loadMarketplace = async () => {
    try {
      setLoading(true);
      const [projRes, propRes] = await Promise.all([api.getProjects(), api.getProposals()]);
      if (projRes.success) setProjects(projRes.projects);
      if (propRes.success) setProposals(propRes.proposals);
    } catch (err) {
      console.error('Failed to load marketplace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketplace();
  }, []);

  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newBudget) return;
    try {
      const res = await api.createProject({
        title: newTitle,
        description: newDesc,
        category: newCategory,
        budgetINR: Number(newBudget),
        deadline: newDeadline,
        requiredSkills: ['React', 'Design', 'Tailwind'],
      });
      if (res.success) {
        setPostModalOpen(false);
        setNewTitle('');
        setNewDesc('');
        await loadMarketplace();
      }
    } catch (err) {
      console.error('Failed to post project:', err);
    }
  };

  const handleOpenProposal = (project: MarketplaceProject) => {
    setSelectedProject(project);
    setBidAmount(project.budgetINR.toString());
    setCoverLetter('');
    setProposalModalOpen(true);
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    try {
      const res = await api.submitProposal({
        projectId: selectedProject.id,
        coverLetter,
        proposedBudgetINR: Number(bidAmount),
        deliveryDays: Number(deliveryDays),
      });
      if (res.success) {
        confetti({ particleCount: 50, spread: 60 });
        setProposalModalOpen(false);
        await loadMarketplace();
      }
    } catch (err) {
      console.error('Failed to submit proposal:', err);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const res = await api.acceptProposal(proposalId);
      if (res.success) {
        confetti({ particleCount: 70, spread: 70 });
        await loadMarketplace();
      }
    } catch (err) {
      console.error('Failed to accept proposal:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Nexora — Campus Micro-Economy & Freelancing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Commission student engineers, UI designers, and creators for collegiate clubs, festivals, and departmental portals.
          </p>
        </div>

        <button
          onClick={() => setPostModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Campus Project</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('browse')}
          className={`pb-3 text-xs font-semibold px-2 transition-colors border-b-2 ${
            activeTab === 'browse'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Open Campus Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('my-gigs')}
          className={`pb-3 text-xs font-semibold px-2 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'my-gigs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Proposals & Contracts ({proposals.length})</span>
        </button>
      </div>

      {activeTab === 'browse' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 capitalize">
                    {project.category.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md capitalize ${
                      project.status === 'open'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {project.requiredSkills.map((sk, idx) => (
                    <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Budget</span>
                    <strong className="text-base font-extrabold text-slate-900 tabular-nums">
                      ₹{project.budgetINR.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Deadline</span>
                    <span className="text-xs font-semibold text-slate-700">{project.deadline}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Client: <strong className="text-slate-800">{project.clientName}</strong>
                </div>

                {project.status === 'open' ? (
                  <button
                    onClick={() => handleOpenProposal(project)}
                    className="w-full py-2 px-3 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Proposal ({project.proposalsCount} bids)</span>
                  </button>
                ) : (
                  <div className="p-2 bg-slate-50 rounded-lg text-center text-xs text-slate-600 border border-slate-200">
                    Assigned to: <strong>{project.assignedFreelancerName}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* My Gigs & Proposals Tab */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Your Submitted Proposals & Active Contracts</h2>
              <span className="text-xs text-slate-500">{proposals.length} Submissions</span>
            </div>

            <div className="divide-y divide-slate-100">
              {proposals.map(prop => (
                <div key={prop.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          prop.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {prop.status}
                      </span>
                      <span className="text-xs text-slate-400">Delivery in {prop.deliveryDays} days</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{prop.projectTitle}</h4>
                    <p className="text-xs text-slate-600">{prop.coverLetter}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-900 tabular-nums">
                        ₹{prop.proposedBudgetINR.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400">Quoted Price</div>
                    </div>

                    {prop.status === 'pending' && (
                      <button
                        onClick={() => handleAcceptProposal(prop.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                      >
                        Accept Proposal (Client Action)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Post Project Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setPostModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 z-10 border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Post New Campus Project</h2>
              <button onClick={() => setPostModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostProject} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Design Hackathon Event Poster & Motion Reel"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Deliverables</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Outline project scope, deliverables, design guidelines..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="web_dev">Web Development</option>
                    <option value="ui_ux">UI/UX Design</option>
                    <option value="content">Content & Copywriting</option>
                    <option value="video">Video & Animation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Budget (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={newBudget}
                    onChange={e => setNewBudget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Deadline</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Publish Gig
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Proposal Modal */}
      {proposalModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setProposalModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10 border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Submit Proposal</h2>
                <div className="text-[11px] text-slate-400 truncate">{selectedProject.title}</div>
              </div>
              <button onClick={() => setProposalModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Pitch & Approach *</label>
                <textarea
                  rows={4}
                  required
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Explain why you're suited for this gig, past projects, delivery plan..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quoted Price (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Time (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={deliveryDays}
                    onChange={e => setDeliveryDays(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tabular-nums"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setProposalModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Proposal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
