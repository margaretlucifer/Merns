import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CampusLocation, DeliveryTask } from '../types';
import { Leaf, Navigation, BatteryCharging, Zap, MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const EcoRoutePage: React.FC = () => {
  const [locations, setLocations] = useState<CampusLocation[]>([]);
  const [tasks, setTasks] = useState<DeliveryTask[]>([]);
  const [originId, setOriginId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [routeResult, setRouteResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [locRes, tskRes] = await Promise.all([api.getEcoLocations(), api.getEcoTasks()]);
        if (locRes.success) {
          setLocations(locRes.locations);
          if (locRes.locations.length >= 2) {
            setOriginId(locRes.locations[0].id);
            setDestinationId(locRes.locations[2].id);
          }
        }
        if (tskRes.success) setTasks(tskRes.tasks);
      } catch (err) {
        console.error('Failed to load EcoRoute data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCalculate = async () => {
    if (!originId || !destinationId) return;
    try {
      setCalculating(true);
      const res = await api.calculateEcoRoute(originId, destinationId);
      if (res.success) setRouteResult(res.route);
    } catch (err) {
      console.error('Route calculation error:', err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <Leaf className="w-4 h-4" />
            <span>Green Campus Mobility & Sustainable Logistics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            EcoRoute AI — Smart Campus Transit & Deliveries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Multi-stop electric shuttle dispatch, cafeteria delivery routing, and carbon offset tracking.
          </p>
        </div>
      </div>

      {/* Hero Sustainability Banner with Generated Image */}
      <div className="grid lg:grid-cols-12 gap-6 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="lg:col-span-5 relative h-56 lg:h-auto bg-slate-100">
          <img
            src="/src/assets/images/sustainability_ecoroute_1791650607157.jpg"
            alt="Electric smart campus delivery van at solar charging station"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="lg:col-span-7 p-6 space-y-4">
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Zero-Emission Fleet Initiative
          </span>
          <h2 className="text-lg font-bold text-slate-900 leading-snug">
            AI Multi-Stop Campus Dispatch & Solar Van Routing
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminate fossil fuel vehicles on collegiate pathways. EcoRoute plans dynamic intra-campus delivery corridors
            connecting hostel quads, academic labs, and the central library while tracking verified CO₂ savings.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-slate-800">
            <div>
              <div className="text-lg font-extrabold text-emerald-600 tabular-nums">1.42 Tons</div>
              <div className="text-[10px] text-slate-400">CO₂ Offset This Term</div>
            </div>
            <div>
              <div className="text-lg font-extrabold text-indigo-600 tabular-nums">4 Shuttles</div>
              <div className="text-[10px] text-slate-400">Active Campus Fleet</div>
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900 tabular-nums">100%</div>
              <div className="text-[10px] text-slate-400">Solar Charging Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Route Calculator & Active Tasks */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Calculator (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-indigo-600" />
            <span>Interactive Campus Corridor Planner</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Origin Point</label>
              <select
                value={originId}
                onChange={e => setOriginId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destination Point</label>
              <select
                value={destinationId}
                onChange={e => setDestinationId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.category})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCalculate}
              disabled={calculating}
              className="w-full py-2.5 px-3 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{calculating ? 'Optimizing Corridor...' : 'Calculate Optimal EcoRoute'}</span>
            </button>
          </div>

          {routeResult && (
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3 text-emerald-950 mt-4">
              <div className="font-bold text-xs flex items-center justify-between">
                <span>Optimized Transit Path</span>
                <span className="text-emerald-700">{routeResult.recommendedVehicle}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-emerald-700 block">Distance</span>
                  <strong className="tabular-nums">{routeResult.distanceKm} km</strong>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 block">Travel Time</span>
                  <strong className="tabular-nums">{routeResult.estimatedMinutes} mins</strong>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 block">Emissions Saved</span>
                  <strong className="tabular-nums font-bold text-emerald-800">
                    {routeResult.co2SavedKg} kg CO₂
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 block">Battery Drain</span>
                  <strong className="tabular-nums">~{routeResult.batteryUsedPercent}%</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Delivery Tasks (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Live Campus Delivery Fleet Status</h3>
            <span className="text-xs text-slate-500">{tasks.length} Active Dispatches</span>
          </div>

          <div className="divide-y divide-slate-100">
            {tasks.map(task => (
              <div key={task.id} className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        task.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : task.status === 'in_transit'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">#{task.trackingId}</span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{task.itemType}</h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span>{task.origin}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span>{task.destination}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-emerald-600 tabular-nums">
                    +{task.co2SavedKg} kg CO₂ saved
                  </div>
                  <div className="text-[10px] text-slate-400">{task.vehicleType}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
