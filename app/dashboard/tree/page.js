'use client';

import { useState, useEffect } from 'react';
import TreeBranch from '@/components/TreeBranch';
import { GitFork, RefreshCw, Layers } from 'lucide-react';

export default function OrganizationalTreePage() {
  const [tree, setTree] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitFork className="h-7 w-7 text-teal-500" /> Organization Downline Tree
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Interactive, expandable tree view of your organizational structure and downlines.
          </p>
        </div>
        <button
          onClick={fetchTree}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Tree
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Building Organizational Tree...</div>
        ) : !tree ? (
          <div className="p-8 text-center text-slate-500 text-sm">Unable to render hierarchy tree.</div>
        ) : (
          <div className="min-w-[600px]">
            <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-teal-500" /> Hierarchy View
              </span>
              <span className="text-xs text-slate-400">Click arrow icons to expand/collapse downlines</span>
            </div>

            <TreeBranch node={tree} level={0} />
          </div>
        )}
      </div>
    </div>
  );
}
