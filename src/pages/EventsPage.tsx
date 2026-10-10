import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EventItem, Ticket } from '../types';
import { useAuth } from '../context/AuthContext';
import { QRCodeDisplay } from '../components/common/QRCodeDisplay';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket as TicketIcon,
  Plus,
  Search,
  CheckCircle2,
  ScanLine,
  X,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'tickets'>('browse');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [scannerModalOpen, setScannerModalOpen] = useState(false);
  const [scannedResult, setScannedResult] = useState<any>(null);
  const [manualToken, setManualToken] = useState('');
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'workshop' | 'hackathon' | 'cultural' | 'seminar'>('workshop');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM IST');
  const [newVenue, setNewVenue] = useState('');
  const [newCapacity, setNewCapacity] = useState('150');
  const [newPrice, setNewPrice] = useState('0');

  const loadData = async () => {
    try {
      setLoading(true);
      const [evRes, tktRes] = await Promise.all([api.getEvents(), api.getTickets()]);
      if (evRes.success) setEvents(evRes.events);
      if (tktRes.success) setTickets(tktRes.tickets);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegister = async (event: EventItem) => {
    try {
      setRegisteringId(event.id);
      const res = await api.registerForEvent(event.id);
      if (res.success) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
        await loadData();
        setActiveTab('tickets');
      }
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setRegisteringId(null);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newVenue) return;
    try {
      const res = await api.createEvent({
        title: newTitle,
        description: newDesc,
        category: newCategory,
        date: newDate,
        time: newTime,
        venue: newVenue,
        capacity: Number(newCapacity),
        isPaid: Number(newPrice) > 0,
        priceINR: Number(newPrice),
      });
      if (res.success) {
        setCreateModalOpen(false);
        setNewTitle('');
        setNewDesc('');
        await loadData();
      }
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  const handleVerifyQR = async (tokenToVerify?: string) => {
    const token = tokenToVerify || manualToken;
    if (!token) return;
    try {
      const res = await api.verifyTicket(token);
      setScannedResult(res);
    } catch (err) {
      setScannedResult({ success: false, verified: false, message: 'Verification endpoint error' });
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Campus Event Hub & QR Passes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Workshops, hackathons, cultural festivals, and cryptographically verified gate tickets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setScannerModalOpen(true);
              setScannedResult(null);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <ScanLine className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gate Scanner</span>
          </button>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campus Event</span>
          </button>
        </div>
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
          Browse Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 text-xs font-semibold px-2 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'tickets'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TicketIcon className="w-3.5 h-3.5" />
          <span>My Tickets ({tickets.length})</span>
        </button>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Interactive category buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-full md:w-auto">
              {['all', 'hackathon', 'workshop', 'cultural', 'seminar'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                    selectedCategory === cat
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'All Events' : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search event title, venue, organizer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Event Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => {
              const isRegistered = tickets.some(t => t.eventId === event.id && t.status === 'valid');
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="relative h-44 bg-slate-100 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-800 capitalize border border-slate-200">
                        {event.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-semibold text-white">
                        {event.isPaid ? `₹${event.priceINR}` : 'Free Entry'}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-1.5 pt-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{event.date} · {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="tabular-nums">
                            {event.registeredCount} / {event.capacity} seats filled
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleRegister(event)}
                      disabled={isRegistered || registeringId === event.id || event.registeredCount >= event.capacity}
                      className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        isRegistered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Registered · View QR Pass</span>
                        </>
                      ) : registeringId === event.id ? (
                        <span>Processing Ticket...</span>
                      ) : event.registeredCount >= event.capacity ? (
                        <span>Event Full</span>
                      ) : (
                        <>
                          <TicketIcon className="w-3.5 h-3.5" />
                          <span>{event.isPaid ? `Book Pass (₹${event.priceINR})` : 'Register Free Pass'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* My Tickets Tab */
        <div className="space-y-6">
          {tickets.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <TicketIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-900">No Tickets Issued Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore campus workshops, hackathons, and cultural fests to claim your QR entrance passes.
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="mt-2 px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Campus Events
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {tickets.map(tkt => (
                <div
                  key={tkt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row gap-6 items-center"
                >
                  <div className="shrink-0">
                    <QRCodeDisplay
                      data={tkt.qrCodeData}
                      size={150}
                      label={`Pass #${tkt.ticketNumber}`}
                      subtitle="Scan at venue entry gate"
                    />
                  </div>

                  <div className="flex-1 space-y-3 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Valid Pass</span>
                      </span>
                      <span className="text-xs text-slate-400 tabular-nums">#{tkt.ticketNumber}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{tkt.eventTitle}</h3>

                    <div className="space-y-1 text-xs text-slate-500">
                      <div>Attendee: <strong className="text-slate-800">{tkt.userName}</strong></div>
                      <div>Venue: <strong className="text-slate-800">{tkt.eventVenue}</strong></div>
                      <div>Date: <strong className="text-slate-800">{tkt.eventDate}</strong></div>
                      <div>Amount: <strong className="text-slate-800">{tkt.pricePaidINR > 0 ? `₹${tkt.pricePaidINR}` : 'Complimentary'}</strong></div>
                    </div>

                    <button
                      onClick={() => {
                        setScannerModalOpen(true);
                        handleVerifyQR(tkt.qrCodeData);
                      }}
                      className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <ScanLine className="w-3.5 h-3.5" />
                      <span>Test Gate Check-in Scanner</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Event Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setCreateModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 z-10 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Publish New Campus Event</h2>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. National Robotics & Drone Grand Prix"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Describe itinerary, prizes, speakers, rules..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="cultural">Cultural Carnival</option>
                    <option value="seminar">Symposium / Seminar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={newVenue}
                    onChange={e => setNewVenue(e.target.value)}
                    placeholder="e.g. Main Auditorium"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Ticket Price (₹ INR)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    placeholder="0 for Free"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gate Check-in QR Scanner Modal */}
      {scannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setScannerModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10 border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">Gate Entrance Ticket Verifier</h2>
              </div>
              <button onClick={() => setScannerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-500">
              Campus gate security endpoint simulates hardware barcode/camera scan by authenticating the signed cryptographic ticket token.
            </p>

            <div className="space-y-2">
              <label className="block font-medium text-slate-700">Test or Paste QR Payload String:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="EDUSPHERE-PASS:TKT-..."
                  value={manualToken}
                  onChange={e => setManualToken(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
                <button
                  onClick={() => handleVerifyQR()}
                  className="px-3 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
                >
                  Verify
                </button>
              </div>
            </div>

            {/* Quick Demo Fill Buttons */}
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="text-slate-400">Quick Test:</span>
              <button
                onClick={() => {
                  setManualToken('EDUSPHERE-PASS:TKT-89412:USR-AARAV:EVT-HACK26:VERIFIED');
                  handleVerifyQR('EDUSPHERE-PASS:TKT-89412:USR-AARAV:EVT-HACK26:VERIFIED');
                }}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700"
              >
                EduHack Pass (#89412)
              </button>
              <button
                onClick={() => {
                  setManualToken('EDUSPHERE-PASS:TKT-44319:USR-AARAV:EVT-AI-WRK:VERIFIED');
                  handleVerifyQR('EDUSPHERE-PASS:TKT-44319:USR-AARAV:EVT-AI-WRK:VERIFIED');
                }}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-700"
              >
                AI Masterclass (#44319)
              </button>
            </div>

            {/* Verification Result Display */}
            {scannedResult && (
              <div
                className={`p-4 rounded-xl border ${
                  scannedResult.verified
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {scannedResult.verified ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>ENTRY PERMITTED · TICKET VALID</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>ENTRY DENIED · INVALID TICKET</span>
                    </>
                  )}
                </div>

                {scannedResult.verified && (
                  <div className="space-y-1 text-[11px] text-emerald-900 mt-2">
                    <div>Attendee: <strong>{scannedResult.attendee}</strong></div>
                    <div>Event: <strong>{scannedResult.event}</strong></div>
                    <div>Venue: <strong>{scannedResult.venue}</strong></div>
                    <div>Ticket ID: <strong>{scannedResult.ticketNumber}</strong></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
