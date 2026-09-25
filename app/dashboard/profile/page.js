'use client';

import { useState, useEffect } from 'react';
import { UserCircle, KeyRound, CheckCircle2, AlertCircle, ShieldCheck, Mail, Phone, MapPin, Calendar, Camera, Loader2 } from 'lucide-react';
import AgreementCertificate from '@/components/AgreementCertificate';
import UserIdentityCard from '@/components/UserIdentityCard';

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile Photo Upload State
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');
  const [photoError, setPhotoError] = useState('');

  // Change Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');
    setPhotoMessage('');

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setPhotoUploading(true);

      try {
        const res = await fetch('/api/auth/update-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photoBase64: base64String }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setPhotoError(data.error || 'Failed to update profile photo.');
        } else {
          setPhotoMessage('Profile photo updated successfully!');
          setUser((prev) => ({ ...prev, photoUrl: data.photoUrl }));
        }
      } catch (err) {
        setPhotoError('Network error while uploading photo.');
      } finally {
        setPhotoUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    setPasswordSubmitting(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setPwdError(data.error || 'Failed to change password');
      } else {
        setPwdSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setPwdError('Network error while updating password.');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-sm">Loading Profile...</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <UserCircle className="h-7 w-7 text-teal-500" /> Account Profile & Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View your personal account details and manage account credentials.
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {photoError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{photoError}</span>
          </div>
        )}

        {photoMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{photoMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar Photo with Camera Edit Overlay */}
            <div className="relative group shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 border-2 border-teal-500/40 shadow-lg shadow-teal-500/20 overflow-hidden flex items-center justify-center">
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-slate-950 font-black text-3xl">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>

              <label
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 text-teal-400 hover:bg-teal-500 hover:text-slate-950 border border-slate-700 shadow-md cursor-pointer transition-all flex items-center justify-center"
                title="Update Profile Photo"
              >
                {photoUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoChange}
                  disabled={photoUploading}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
              <p className="text-xs font-mono font-semibold text-teal-600 dark:text-teal-400 mt-0.5">
                User ID: {user?.userId}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Click the camera icon on photo to update profile picture</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 self-start sm:self-center">
            <ShieldCheck className="h-4 w-4" /> {user?.role?.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.email}</p>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-slate-400" /> Mobile Number
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.mobile}</p>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" /> Date of Birth & Gender
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {user?.dob ? new Date(user.dob).toLocaleDateString('en-IN') : 'N/A'} • {user?.gender}
            </p>
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" /> Address
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">{user?.address}</p>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-teal-500" /> Change Password
        </h3>

        {pwdError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{pwdError}</span>
          </div>
        )}

        {pwdSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{pwdSuccess}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              New Password (Min 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={passwordSubmitting}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md hover:from-teal-400 hover:to-emerald-400 transition-all cursor-pointer disabled:opacity-50"
          >
            {passwordSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Official Documents & Authorization Section (Visible for all non-admin users) */}
      {user?.role !== 'ADMIN' && (
        <div className="space-y-6 pt-2">
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Official Documents & Identity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              View, print, and download your authorized Spandan Trust agreement certificate and member identity card.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7">
                <AgreementCertificate user={user} />
              </div>
              <div className="lg:col-span-5">
                <UserIdentityCard user={user} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
