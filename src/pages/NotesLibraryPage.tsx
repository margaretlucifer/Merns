import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { NoteItem } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Search,
  Upload,
  Bookmark,
  Download,
  FileText,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';

export const NotesLibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Upload Form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState(6);
  const [description, setDescription] = useState('');

  const loadNotes = async () => {
    try {
      setLoading(true);
      const res = await api.getNotes();
      if (res.success) setNotes(res.notes);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject) return;
    try {
      const res = await api.uploadNote({
        title,
        subject,
        semester,
        description,
        tags: ['Lecture Notes', 'Semester 6'],
      });
      if (res.success) {
        setUploadModalOpen(false);
        setTitle('');
        setSubject('');
        setDescription('');
        await loadNotes();
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleBookmark = async (id: string) => {
    try {
      await api.bookmarkNote(id);
      setNotes(notes.map(n => (n.id === id ? { ...n, bookmarks: n.bookmarks + 1 } : n)));
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const filteredNotes = notes.filter(n => {
    const matchesSem = selectedSemester === 'all' || n.semester === selectedSemester;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.uploadedByName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSem && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Academic Notes & Handouts Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Handwritten revision sheets, faculty lecture slides, and university examination question banks.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Contribute Notes</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Semester Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-full md:w-auto">
          {(['all', 5, 6, 7, 8] as const).map(sem => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                selectedSemester === sem
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sem === 'all' ? 'All Semesters' : `Semester ${sem}`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by topic, subject, uploader..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  Sem {note.semester} · {note.fileType.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-400 tabular-nums">{note.fileSize}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                {note.title}
              </h3>

              <div className="text-xs text-indigo-600 font-medium">{note.subject}</div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {note.description}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {note.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate">By {note.uploadedByName}</span>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleBookmark(note.id)}
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                  title="Bookmark note"
                >
                  <Bookmark className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600" />
                  <span className="tabular-nums">{note.bookmarks}</span>
                </button>
                <button
                  onClick={() => alert(`Downloading "${note.title}" (${note.fileSize})...`)}
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                  title="Download file"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600" />
                  <span className="tabular-nums">{note.downloads}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setUploadModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10 border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Upload Academic Resource</h2>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Consensus & Raft Notes"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Distributed Systems"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={e => setSemester(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Topic Highlights</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Mention key topics, handwritten vs digital, professor reference..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Upload & Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
