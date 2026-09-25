'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, User, Shield, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';

export default function TreeBranch({ node, level = 0, currentUserRole, onStatusChange }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const children = node?.children || [];
  const hasChildren = children.length > 0;

  const handleToggleStatus = async () => {
    if (!node?.id) return;
    const newStatus = node.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      setUpdatingStatus(true);
      const res = await fetch(`/api/users/${node.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && onStatusChange) {
        onStatusChange();
      } else if (!data.success) {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getRoleHeaderStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-600 text-white border-purple-500';
      case 'COORDINATOR':
        return 'bg-blue-600 text-white border-blue-500';
      case 'SUPERVISOR':
        return 'bg-amber-600 text-white border-amber-500';
      case 'DIGITAL_OPD_AGENT':
        return 'bg-emerald-600 text-white border-emerald-500';
      default:
        return 'bg-slate-700 text-white border-slate-600';
    }
  };

  const getCardBorderStyle = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'border-purple-500/40 shadow-purple-500/10';
      case 'COORDINATOR':
        return 'border-blue-500/40 shadow-blue-500/10';
      case 'SUPERVISOR':
        return 'border-amber-500/40 shadow-amber-500/10';
      case 'DIGITAL_OPD_AGENT':
        return 'border-emerald-500/40 shadow-emerald-500/10';
      default:
        return 'border-slate-700';
    }
  };

  return (
    <div className="flex flex-col items-center select-none shrink-0">
      {/* Node Card */}
      <div
        className={`relative flex flex-col items-center bg-slate-900 border-2 text-white rounded-2xl shadow-xl w-64 p-4 transition-all duration-200 hover:scale-105 hover:z-20 ${getCardBorderStyle(
          node.role
        )}`}
      >
        {/* Role Pill Header */}
        <span
          className={`text-[10px] font-black tracking-wider uppercase px-3 py-0.5 rounded-full border shadow-xs mb-2.5 ${getRoleHeaderStyle(
            node.role
          )}`}
        >
          {node.role.replace(/_/g, ' ')}
        </span>

        {/* User Photo Avatar & Name */}
        <div className="flex flex-col items-center gap-1.5 mb-1 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-950 overflow-hidden flex items-center justify-center shadow-md">
            {node.photoUrl ? (
              <img
                src={node.photoUrl}
                alt={node.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-slate-400" />
            )}
          </div>
          <span className="font-bold text-sm text-slate-100 truncate max-w-[180px]">{node.name}</span>
        </div>

        {/* User ID */}
        <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-slate-950 text-teal-400 font-semibold mb-2.5 border border-slate-800">
          {node.userId}
        </span>

        {/* Contact Info */}
        <div className="w-full space-y-1 text-xs text-slate-400 border-t border-b border-slate-800/80 py-2 my-1">
          {node.email && (
            <div className="flex items-center justify-center gap-1.5 truncate">
              <Mail className="h-3 w-3 text-teal-400 shrink-0" />
              <span className="truncate">{node.email}</span>
            </div>
          )}
          {node.mobile && (
            <div className="flex items-center justify-center gap-1.5">
              <Phone className="h-3 w-3 text-teal-400 shrink-0" />
              <span>{node.mobile}</span>
            </div>
          )}
        </div>

        {/* Status Pill & Action Buttons */}
        <div className="flex items-center justify-between w-full pt-1 gap-1">
          <div className="flex items-center gap-1.5">
            {node.status === 'ACTIVE' ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <CheckCircle className="h-3 w-3" /> Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400">
                <XCircle className="h-3 w-3" /> Inactive
              </span>
            )}

            {currentUserRole === 'ADMIN' && node.role !== 'ADMIN' && (
              <button
                onClick={handleToggleStatus}
                disabled={updatingStatus}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all cursor-pointer disabled:opacity-50 ${
                  node.status === 'INACTIVE'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 hover:bg-rose-500 text-slate-300 hover:text-white'
                }`}
              >
                {updatingStatus ? '...' : node.status === 'INACTIVE' ? 'Activate' : 'Deactivate'}
              </button>
            )}
          </div>

          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 transition-colors focus:outline-hidden cursor-pointer shrink-0"
            >
              <span>{children.length} Downline{children.length > 1 ? 's' : ''}</span>
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Downward Stem Line if Node Has Children & Expanded */}
      {hasChildren && isExpanded && (
        <div className="w-0.5 h-6 bg-teal-500/80 dark:bg-teal-400/80" />
      )}

      {/* Horizontal & Downward Branches for Children */}
      {hasChildren && isExpanded && (
        <div className="flex items-start justify-center relative pt-4">
          {children.map((child, index) => (
            <div key={child.id || child.userId} className="flex flex-col items-center relative px-4">
              {/* Connector lines connecting children to parent */}
              {children.length > 1 && (
                <>
                  {/* Left horizontal bar segment */}
                  <div
                    className={`absolute top-0 left-0 w-1/2 h-0.5 bg-teal-500/80 dark:bg-teal-400/80 ${
                      index === 0 ? 'hidden' : ''
                    }`}
                  />
                  {/* Right horizontal bar segment */}
                  <div
                    className={`absolute top-0 right-0 w-1/2 h-0.5 bg-teal-500/80 dark:bg-teal-400/80 ${
                      index === children.length - 1 ? 'hidden' : ''
                    }`}
                  />
                </>
              )}

              {/* Vertical line from horizontal bar to child card */}
              <div className="w-0.5 h-4 bg-teal-500/80 dark:bg-teal-400/80" />

              {/* Recursive child tree branch */}
              <TreeBranch node={child} level={level + 1} currentUserRole={currentUserRole} onStatusChange={onStatusChange} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
