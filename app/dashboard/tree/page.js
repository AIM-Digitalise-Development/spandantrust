'use client';

import { useState, useEffect } from 'react';
import TreeBranch from '@/components/TreeBranch';
import { GitFork, RefreshCw, ZoomIn, ZoomOut, Maximize2, List, Diagram3, Layers } from 'lucide-react';

export default function OrganizationalTreePage() {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState('diagram'); // 'diagram' or 'list'

  const fetchTree = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users/tree');
      const data = await res.json();
      if (data.success) {
        setTree(data.tree);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitFork className="h-7 w-7 text-teal-500" /> SpandanTrust Hierarchy Diagram
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Top-down organizational tree diagram mapping all tiers and downlines.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchTree}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Legend & Controls Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        {/* Role Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">Role Legend:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-purple-600/20 text-purple-400 border border-purple-500/30">
            Admin
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
            Coordinator
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-amber-600/20 text-amber-400 border border-amber-500/30">
            Supervisor
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            Digital OPD Agent
          </span>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="px-2 font-mono text-[11px] font-bold text-teal-400">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Diagram Canvas */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">Rendering Organizational Diagram...</div>
        ) : !tree ? (
          <div className="p-16 text-center text-slate-400 text-sm">Unable to load hierarchy tree.</div>
        ) : (
          <div className="w-full overflow-x-auto overflow-y-auto p-12 min-h-[500px] flex justify-center items-start">
            <div
              className="transition-transform duration-300 transform-origin-top flex justify-center min-w-max"
              style={{ transform: `scale(${zoom})` }}
            >
              <TreeBranch node={tree} level={0} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
