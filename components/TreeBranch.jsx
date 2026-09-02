'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, User, Shield, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';

export default function TreeBranch({ node, level = 0 }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const getRoleStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-500/10 text-purple-600 border-purple-300 dark:text-purple-400 dark:border-purple-800';
      case 'COORDINATOR':
        return 'bg-blue-500/10 text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-800';
      case 'SUPERVISOR':
        return 'bg-amber-500/10 text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-800';
      case 'DIGITAL_OPD_AGENT':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-300 dark:text-emerald-400 dark:border-emerald-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="relative my-2 select-none">
      {/* Node Card */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
          level === 0
            ? 'bg-slate-900 text-white border-slate-800 shadow-lg'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/40 dark:hover:border-teal-500/40'
        }`}
        style={{ marginLeft: `${Math.min(level * 24, 96)}px` }}
      >
        <div className="flex items-center gap-3">
          {/* Collapse/Expand Toggle */}
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-hidden"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-500" />
              )}
            </button>
          ) : (
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/60">
              <User className="h-4 w-4 text-slate-400" />
            </div>
          )}

          {/* User Details */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-semibold text-sm ${level === 0 ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                {node.name}
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400 font-medium">
                {node.userId}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getRoleStyle(
                  node.role
                )}`}
              >
                {node.role.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
              {node.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-slate-400" />
                  {node.email}
                </span>
              )}
              {node.mobile && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-400" />
                  {node.mobile}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-2 sm:mt-0 flex items-center gap-2">
          {node.status === 'ACTIVE' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="h-3 w-3" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <XCircle className="h-3 w-3" />
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* Children Branches */}
      {hasChildren && isExpanded && (
        <div className="relative pl-3 border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-6 mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeBranch key={child.id || child.userId} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
