'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export default function CloudinaryUpload({ onFileSelect, label = 'Upload PAN / Aadhaar Document' }) {
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreviewUrl(base64String);
      if (onFileSelect) {
        onFileSelect(base64String);
      }
    };
    reader.onerror = () => {
      setError('Failed to read selected file.');
    };

    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setFileName('');
    setPreviewUrl('');
    setError('');
    if (onFileSelect) {
      onFileSelect('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label} <span className="text-slate-400 font-normal">(Uploaded to Cloudinary)</span>
      </label>

      {!fileName ? (
        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 bg-slate-50 dark:bg-slate-900/50 transition-colors">
          <Upload className="h-6 w-6 text-slate-400 mb-1" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Click to upload document
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG or PDF (Max 5MB)</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{fileName}</p>
              <p className="text-[10px] text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Ready for secure upload
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Remove document"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
