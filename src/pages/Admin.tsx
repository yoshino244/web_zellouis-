import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export default function Admin() {
  const { user, isAdmin, loading, signIn, logOut, createInitialAdmin, changeAdminPassword } = useAuth();
  const config = useConfig();
  
  const [formData, setFormData] = useState(config);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [password, setPassword] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSettingUp) {
        await createInitialAdmin(password);
      } else {
        await signIn(password);
      }
    } catch (e: any) {
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        setError('Invalid password. If this is your first time setting up the admin on a new Firebase project, click "Setup Initial Admin".');
      } else if (e.code === 'auth/email-already-in-use') {
        setError('Admin already set up. Please switch to login mode.');
        setIsSettingUp(false);
      } else {
        setError(e.message);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await setDoc(doc(db, 'site', 'config'), formData);
      setMessage('Configuration saved successfully!');
      
      // Update CSS variables for theme color
      document.documentElement.style.setProperty('--theme-color', formData.themeColor);
    } catch (e: any) {
      setError(e.message);
      handleFirestoreError(e, OperationType.UPDATE, 'site/config');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    try {
      await changeAdminPassword(newPassword);
      setPasswordMessage('Password changed successfully.');
      setNewPassword('');
    } catch (e: any) {
      setPasswordMessage('Failed to change password: ' + e.message + ' (You may need to log out and log back in to verify your identity again before changing the password.)');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-white">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <form onSubmit={handleLogin} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">{isSettingUp ? 'Setup Admin Password' : 'Admin Login'}</h1>
          
          <p className="text-zinc-400 mb-6 text-sm text-center">
            {isSettingUp 
              ? "Create your initial admin password." 
              : "Enter your admin password to continue."}
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 mb-6"
            required
            minLength={6}
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-orange-600 transition-colors mb-4"
          >
            {isSettingUp ? 'Set Password & Login' : 'Login'}
          </button>

          {!isSettingUp && (
            <button
              type="button"
              onClick={() => setIsSettingUp(true)}
              className="w-full text-zinc-500 hover:text-white text-sm"
            >
              Setup Initial Admin (First time only)
            </button>
          )}
          {isSettingUp && (
            <button
              type="button"
              onClick={() => setIsSettingUp(false)}
              className="w-full text-zinc-500 hover:text-white text-sm"
            >
              Back to Login
            </button>
          )}

          {error && <p className="text-red-500 mt-4 text-sm text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 pb-32">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Site Configuration</h1>
          <button onClick={logOut} className="text-zinc-400 hover:text-white px-4 py-2 border border-zinc-700 rounded-lg">
            Log Out
          </button>
        </div>

        <form onSubmit={handleSave} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6">Content & Theme Settings</h2>

          {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">{error}</div>}
          {message && <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-xl">{message}</div>}

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Hero Title</label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData(f => ({ ...f, heroTitle: e.target.value }))}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Hero Subtitle</label>
            <textarea
              value={formData.heroSubtitle}
              onChange={(e) => setFormData(f => ({ ...f, heroSubtitle: e.target.value }))}
              rows={4}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition-all resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">WhatsApp Number</label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData(f => ({ ...f, whatsappNumber: e.target.value }))}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Theme Color (e.g. orange, indigo, #ff5500)</label>
            <input
              type="text"
              value={formData.themeColor}
              onChange={(e) => setFormData(f => ({ ...f, themeColor: e.target.value }))}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition-all"
              required
            />
            <p className="text-xs text-zinc-500 mt-2">To apply theme color cleanly to Tailwind classes, you should use standard CSS hex values if custom, but for now we set the CSS variable `--theme-color` so we can use it across the app.</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-orange-500 text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </form>

        <form onSubmit={handleChangePassword} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6">Security Settings</h2>
          
          {passwordMessage && (
            <div className={`p-4 rounded-xl border ${passwordMessage.includes('Failed') ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-green-500/10 border-green-500/50 text-green-500'}`}>
              {passwordMessage}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Change Admin Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password (min 6 chars)"
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition-all"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
