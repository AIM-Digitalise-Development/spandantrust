'use client';

import { useState, useEffect } from 'react';
import TreeBranch from '@/components/TreeBranch';
import { GitFork, RefreshCw, ZoomIn, ZoomOut, Maximize2, List, Diagram3, Layers } from 'lucide-react';

export default function OrganizationalTreePage() {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [authUser, setAuthUser] = useState(null);

  // Pan / Drag State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAuthUser(data.user);
      })
      .catch((err) => console.error(err));
  }, []);

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
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse Drag to Pan
  const handleMouseDown = (e) => {
    if (e.target.closest('button, a, input, select')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag & Pinch-to-Zoom for Mobile
  const [touchDistance, setTouchDistance] = useState(null);
  const [initialZoom, setInitialZoom] = useState(1);

  const getDistance = (touches) => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('button, a, input, select')) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
      setTouchDistance(null);
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = getDistance(e.touches);
      setTouchDistance(dist);
      setInitialZoom(zoom);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && touchDistance) {
      const dist = getDistance(e.touches);
      const scale = dist / touchDistance;
      const newZoom = Math.min(Math.max(initialZoom * scale, 0.3), 2.2);
      setZoom(newZoom);
    } else if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) {
      setTouchDistance(null);
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomDelta = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom((prev) => Math.min(Math.max(prev + zoomDelta, 0.3), 2.2));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitFork className="h-7 w-7 text-teal-500" /> SpandanTrust Hierarchy Diagram
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Interactive top-down organizational tree diagram. Drag canvas to pan, pinch or scroll to zoom.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchTree}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Tree
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

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-3 border-t md:border-t-0 pt-2 md:pt-0 border-slate-800 flex-wrap">
          <span className="text-slate-400 text-[11px]">💡 Drag to pan • Pinch to zoom</span>
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
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px] px-2"
              title="Reset Position & Zoom"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Diagram Pan/Drag Canvas */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className={`relative w-full overflow-hidden min-h-[600px] flex justify-center items-center select-none py-16 px-8 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl transition-cursor ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">Rendering Organizational Diagram...</div>
        ) : !tree ? (
          <div className="p-16 text-center text-slate-400 text-sm">Unable to load hierarchy tree.</div>
        ) : (
          <div
            className="transition-transform duration-75 origin-center flex justify-center min-w-max pointer-events-auto"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            <TreeBranch node={tree} level={0} currentUserRole={authUser?.role} onStatusChange={fetchTree} />
          </div>
        )}
      </div>
    </div>
  );
}
