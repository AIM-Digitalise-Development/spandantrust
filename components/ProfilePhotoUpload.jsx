'use client';

import { useState } from 'react';
import { Camera, CheckCircle2, AlertCircle, Trash2, User } from 'lucide-react';

export default function ProfilePhotoUpload({ onPhotoSelect, label = 'Upload Profile Photo', required = true }) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreviewUrl(base64String);
      if (onPhotoSelect) {
        onPhotoSelect(base64String);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };

    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreviewUrl('');
    setFileName('');
    setError('');
    if (onPhotoSelect) {
      onPhotoSelect('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-rose-500 font-bold">*</span>}
        <span className="text-slate-400 font-normal ml-1">(Uploaded to Cloudinary)</span>
      </label>

      <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
        {/* Avatar Preview */}
        <div className="relative shrink-0 w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-dashed border-teal-500/50 flex items-center justify-center overflow-hidden group shadow-sm">
          {previewUrl ? (
            <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-slate-400" />
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-1">
          {!previewUrl ? (
            <div>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors">
                <Camera className="h-4 w-4" /> Choose Photo
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px] sm:max-w-xs">
                  {fileName || 'Photo selected'}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Ready for Cloudinary
                </p>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
