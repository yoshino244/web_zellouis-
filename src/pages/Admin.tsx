import React, { useState, useEffect, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { doc, getDoc, setDoc, collection, addDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../firebase';
import { Artwork } from '../components/Gallery';
import { getContrastColor } from '../utils/themeUtils';

import MainLayout from '../components/MainLayout';

export default function Admin() {
  const { user, isAdmin, loading, signIn, logOut, createInitialAdmin, changeAdminPassword } = useAuth();
  const config = useConfig();
  const themeTextColor = useMemo(() => getContrastColor(config.themeColor), [config.themeColor]);
  
  const [formData, setFormData] = useState(config);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [password, setPassword] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // Gallery Management
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newArtwork, setNewArtwork] = useState({ title: '', category: config.galleryCategories?.[0] || 'Concept Art', aspect: 'aspect-square', url: '' });
  const [artToDelete, setArtToDelete] = useState<{id: string, src: string, title: string} | null>(null);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setArtworks(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Artwork)));
    });
    return () => unsub();
  }, [isAdmin]);

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

  const uploadFile = async (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIMENSION = 600; // Ukuran lebih kecil untuk mencegah error Firestore (1MB limit)
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIMENSION) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            }
          } else {
            if (height > MAX_DIMENSION) {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error("Gagal membuat canvas"));
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          let quality = 0.7;
          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          
          // Sangat agresif compress agar tidak hang
          while (dataUrl.length > 300000 && quality > 0.1) {
            quality -= 0.15;
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          
          if (dataUrl.length > 500000) {
             reject(new Error("Gambar masih terlalu besar. Mohon gunakan gambar atau metode URL."));
          } else {
             resolve(dataUrl);
          }
        };
        img.onerror = () => reject(new Error("Gagal meload gambar"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Gagal membaca file"));
      reader.readAsDataURL(file);
    });
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const target = e.target;
    setSaving(true);
    setError('');
    try {
      const url = await uploadFile(file);
      setFormData(f => ({ ...f, heroImage: url }));
    } catch (err: any) {
      setError("Gagal mengupload gambar: " + err.message);
    } finally {
      setSaving(false);
      target.value = ''; // Reset input after upload
    }
  };

  const handleAddArtworkWithUrl = async () => {
    if (!newArtwork.title || !newArtwork.url) {
        alert("Mohon isi judul dan URL gambar.");
        return;
    }
    setUploadingImage(true);
    try {
      await addDoc(collection(db, 'gallery'), {
          title: newArtwork.title,
          category: newArtwork.category,
          aspect: newArtwork.aspect,
          src: newArtwork.url,
          createdAt: Date.now()
      });
      setNewArtwork({ title: '', category: config.galleryCategories?.[0] || 'Concept Art', aspect: 'aspect-square', url: '' });
      alert("Artwork berhasil ditambahkan!");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menambahkan artwork. Error: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddArtwork = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const uploadInput = e.target; // Save reference to the input element
    if (!newArtwork.title) {
        alert("Mohon isi judul artwork terlebih dahulu sebelum memilih gambar.");
        uploadInput.value = ''; // Reset input to allow selecting same file again
        return;
    }
    setUploadingImage(true);
    try {
      const url = await uploadFile(file);
      await addDoc(collection(db, 'gallery'), {
          title: newArtwork.title,
          category: newArtwork.category,
          aspect: newArtwork.aspect,
          src: url,
          createdAt: Date.now()
      });
      setNewArtwork({ title: '', category: config.galleryCategories?.[0] || 'Concept Art', aspect: 'aspect-square', url: '' });
      alert("Artwork berhasil ditambahkan!");
    } catch (err: any) {
      console.error(err);
      alert("Gagal menambahkan artwork. Error: " + err.message);
    } finally {
      setUploadingImage(false);
      uploadInput.value = ''; // Reset input after upload
    }
  };

  const confirmDeleteArtwork = async () => {
    if (!artToDelete) return;
    try {
      if (artToDelete.src && artToDelete.src.includes('firebasestorage.googleapis.com')) {
        const imageRef = ref(storage, artToDelete.src);
        try {
          await deleteObject(imageRef);
        } catch (storageErr) {
          console.warn("Could not delete image from storage", storageErr);
        }
      }
      await deleteDoc(doc(db, 'gallery', artToDelete.id));
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    } finally {
      setArtToDelete(null);
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
    return (
      <div className="relative min-h-screen">
        <MainLayout />
        <div className="fixed inset-0 z-50 bg-[#0c0c0e]/80 backdrop-blur-sm flex items-center justify-center">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 border-2 border-zinc-800 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="relative min-h-screen">
        <MainLayout />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c0e]/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-zinc-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Elegant glowing effect behind the form */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-32 blur-[60px] pointer-events-none rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-color, orange) 20%, transparent)' }} />
            
            <h1 className="text-2xl font-bold text-white mb-2 text-center relative z-10">
              {isSettingUp ? 'Setup Admin Password' : 'Admin Area'}
            </h1>
            
            <p className="text-zinc-400 mb-8 text-sm text-center relative z-10">
              {isSettingUp 
                ? "Create your initial admin password." 
                : "Enter your master password to unlock the studio."}
            </p>

            <form onSubmit={handleLogin} className="relative z-10">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all mb-6"
                required
                minLength={6}
              />

              <button
                type="submit"
                className="w-full font-bold uppercase tracking-wider py-4 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all mb-4"
                style={{ backgroundColor: 'var(--theme-color, orange)', color: 'var(--theme-text-color, black)' }}
              >
                {isSettingUp ? 'Set Password & Login' : 'Unlock Studio'}
              </button>

              {!isSettingUp && (
                <button
                  type="button"
                  onClick={() => setIsSettingUp(true)}
                  className="w-full text-zinc-500 hover:text-white text-xs transition-colors"
                >
                  Setup Initial Admin (First time only)
                </button>
              )}
              {isSettingUp && (
                <button
                  type="button"
                  onClick={() => setIsSettingUp(false)}
                  className="w-full text-zinc-500 hover:text-white text-xs transition-colors"
                >
                  Back to Login
                </button>
              )}

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 mt-6 text-sm text-center p-3 bg-red-500/10 rounded-xl border border-red-500/20"
                >
                  {error}
                </motion.p>
              )}
            </form>

            <button 
              onClick={() => window.location.href = '/'}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 pb-32">
      <div className="max-w-3xl mx-auto space-y-8 md:space-y-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Edit Tampilan Website</h1>
          <button onClick={logOut} className="text-zinc-400 hover:text-white px-4 py-2 border border-zinc-700 rounded-lg whitespace-nowrap self-start sm:self-auto">
            Log Out
          </button>
        </div>

        <form onSubmit={handleSave} className="bg-zinc-900 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6">Pengaturan Konten & Tema</h2>

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

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Hero Image URL / Upload</label>
            <div className="flex flex-col md:flex-row gap-4 mb-2">
               <input
                 type="url"
                 value={formData.heroImage}
                 onChange={(e) => setFormData(f => ({ ...f, heroImage: e.target.value }))}
                 placeholder="https://..."
                 className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition-all"
                 required
               />
               <label className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 px-6 rounded-xl cursor-pointer text-center whitespace-nowrap transition-colors flex items-center justify-center">
                  <span>{saving ? 'Uploading...' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" disabled={saving} />
               </label>
            </div>
            {formData.heroImage && (
               <div className="mt-4 aspect-video relative rounded-xl overflow-hidden border border-white/10 bg-black/50">
                   <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
               </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Featured Art Tag</label>
              <input
                type="text"
                value={formData.featuredArtTag}
                onChange={(e) => setFormData(f => ({ ...f, featuredArtTag: e.target.value }))}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Featured Art Title</label>
              <input
                type="text"
                value={formData.featuredArtTitle}
                onChange={(e) => setFormData(f => ({ ...f, featuredArtTitle: e.target.value }))}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="border border-white/10 p-6 rounded-2xl bg-zinc-950/50 space-y-6">
             <h3 className="font-bold text-white text-lg">Contact Links</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">WhatsApp Label</label>
                  <input type="text" value={formData.contactLabel1 || ''} onChange={e => setFormData(f => ({...f, contactLabel1: e.target.value}))} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">WhatsApp Link</label>
                  <input type="text" value={formData.contactLink1 || ''} onChange={e => setFormData(f => ({...f, contactLink1: e.target.value}))} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Instagram Label</label>
                  <input type="text" value={formData.contactLabel2 || ''} onChange={e => setFormData(f => ({...f, contactLabel2: e.target.value}))} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Instagram Link</label>
                  <input type="text" value={formData.contactLink2 || ''} onChange={e => setFormData(f => ({...f, contactLink2: e.target.value}))} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Lynk.id / Twitter Label</label>
                  <input type="text" value={formData.contactLabel3 || ''} onChange={e => setFormData(f => ({...f, contactLabel3: e.target.value}))} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Lynk.id Link</label>
                  <input type="text" value={formData.contactLink3 || ''} onChange={e => setFormData(f => ({...f, contactLink3: e.target.value}))} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" required />
                </div>
             </div>
          </div>

          <div className="border border-white/10 p-6 rounded-2xl bg-zinc-950/50 space-y-6">
             <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
               <h3 className="font-bold text-white text-lg">Kategori Gallery</h3>
               <button 
                 type="button" 
                 onClick={() => {
                   setFormData(f => ({
                     ...f,
                     galleryCategories: [
                       ...(f.galleryCategories || ['Portraits', 'Fantasy', 'Concept Art']),
                       'Kategori Baru'
                     ]
                   }));
                 }}
                 className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors"
               >
                 + Tambah Kategori
               </button>
             </div>
             
             <div className="space-y-4">
               {(formData.galleryCategories || ['Portraits', 'Fantasy', 'Concept Art']).map((cat, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input 
                      type="text" 
                      value={cat} 
                      onChange={e => setFormData(f => ({
                        ...f, 
                        galleryCategories: (f.galleryCategories || []).map((c, i) => i === index ? e.target.value : c)
                      }))}
                      className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" 
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData(f => ({
                          ...f,
                          galleryCategories: (f.galleryCategories || []).filter((_, i) => i !== index)
                        }));
                      }}
                      className="text-red-500 hover:text-red-400 p-2"
                      title="Hapus Kategori"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
               ))}
               {(!formData.galleryCategories || formData.galleryCategories.length === 0) && (
                 <p className="text-zinc-500 text-sm">Belum ada kategori. Tambahkan setidaknya 1 agar artworks bisa dipilih.</p>
               )}
             </div>
          </div>

          <div className="border border-white/10 p-6 rounded-2xl bg-zinc-950/50 space-y-6">
             <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
               <h3 className="font-bold text-white text-lg">Commission Packages</h3>
               <button 
                 type="button" 
                 onClick={() => {
                   setFormData(f => ({
                     ...f,
                     packages: [
                       ...(f.packages || []),
                       {
                         id: 'pkg-' + Date.now(),
                         title: 'New Package',
                         price: 'From $0',
                         description: 'Package description',
                         features: 'Feature 1\nFeature 2',
                         whatsappMessage: "Hello! I'm interested in the New Package."
                       }
                     ]
                   }));
                 }}
                 className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors"
               >
                 + Tambah Package
               </button>
             </div>
             
             {(!formData.packages || formData.packages.length === 0) && (
               <p className="text-zinc-500 text-center py-4">Belum ada package. Klik Tambah Package untuk membuat baru.</p>
             )}

             {(formData.packages || []).map((pkg, index) => (
                <div key={pkg.id} className="space-y-4 border border-white/5 bg-black/20 p-5 rounded-xl">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold" style={{ color: 'var(--theme-color, orange)' }}>Package {index + 1}</h4>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData(f => ({
                          ...f,
                          packages: (f.packages || []).filter(p => p.id !== pkg.id)
                        }));
                      }}
                      className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
                       <input 
                         type="text" 
                         value={pkg.title} 
                         onChange={e => setFormData(f => ({
                           ...f, 
                           packages: (f.packages || []).map(p => p.id === pkg.id ? {...p, title: e.target.value} : p)
                         }))}
                         className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" 
                         required 
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-zinc-400 mb-2">Price</label>
                       <input 
                         type="text" 
                         value={pkg.price} 
                         onChange={e => setFormData(f => ({
                           ...f, 
                           packages: (f.packages || []).map(p => p.id === pkg.id ? {...p, price: e.target.value} : p)
                         }))}
                         className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" 
                         required 
                       />
                     </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                    <textarea 
                      rows={2} 
                      value={pkg.description} 
                      onChange={e => setFormData(f => ({
                        ...f, 
                        packages: (f.packages || []).map(p => p.id === pkg.id ? {...p, description: e.target.value} : p)
                      }))}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Features (Pisahkan dengan Enter/Baris Baru)</label>
                    <textarea 
                      rows={4} 
                      value={pkg.features} 
                      onChange={e => setFormData(f => ({
                        ...f, 
                        packages: (f.packages || []).map(p => p.id === pkg.id ? {...p, features: e.target.value} : p)
                      }))}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Custom WhatsApp Message</label>
                    <textarea 
                      rows={2} 
                      value={pkg.whatsappMessage || ''} 
                      onChange={e => setFormData(f => ({
                        ...f, 
                        packages: (f.packages || []).map(p => p.id === pkg.id ? {...p, whatsappMessage: e.target.value} : p)
                      }))}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none placeholder:text-zinc-600" 
                      placeholder={`Hello! I'm interested in the ${pkg.title} package.`}
                    />
                  </div>
                </div>
             ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full font-bold uppercase tracking-wider py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--theme-color, orange)', color: 'var(--theme-text-color, black)' }}
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </form>

        {/* Gallery Management Section */}
        <div className="bg-zinc-900 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 mb-6">Kelola Gallery</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {artworks.map(art => (
              <div key={art.id} className="relative group rounded-xl overflow-hidden bg-black aspect-square">
                 <img src={art.src} alt={art.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 flex flex-col justify-end p-4">
                    <p className="text-white font-bold truncate">{art.title}</p>
                    <p className="text-xs uppercase" style={{ color: 'var(--theme-color, orange)' }}>{art.category}</p>
                 </div>
                 <button onClick={() => setArtToDelete({ id: art.id, src: art.src, title: art.title })} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-opacity z-10" title="Hapus Artwork">
                   <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            ))}
          </div>

          <div className="border border-white/10 p-6 rounded-2xl bg-zinc-950/50 space-y-4">
             <h3 className="font-bold text-white">Tambah Artwork Baru</h3>
             <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Judul Artwork"
                  value={newArtwork.title}
                  onChange={e => setNewArtwork({...newArtwork, title: e.target.value})}
                  className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={newArtwork.category}
                    onChange={e => setNewArtwork({...newArtwork, category: e.target.value})}
                    className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                  >
                    {(config.galleryCategories || ['Portraits', 'Fantasy', 'Concept Art']).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    value={newArtwork.aspect}
                    onChange={e => setNewArtwork({...newArtwork, aspect: e.target.value})}
                    className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="aspect-square">Square (1:1)</option>
                    <option value="aspect-[3/4]">Portrait (3:4)</option>
                    <option value="aspect-[4/5]">Portrait (4:5)</option>
                    <option value="aspect-[4/3]">Landscape (4:3)</option>
                    <option value="aspect-[16/9]">Widescreen (16:9)</option>
                  </select>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/10 space-y-4">
                  <p className="text-sm text-zinc-400">Pilih salah satu cara mengunggah gambar:</p>
                  
                  {/* Cara 1: URL */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Cara 1: Gunakan URL Gambar (Disarankan)</label>
                    <div className="flex gap-2">
                       <input
                         type="url"
                         placeholder="https://contoh.com/gambar.jpg"
                         value={newArtwork.url}
                         onChange={e => setNewArtwork({...newArtwork, url: e.target.value})}
                         className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500"
                       />
                       <button 
                         onClick={handleAddArtworkWithUrl}
                         disabled={uploadingImage || !newArtwork.title || !newArtwork.url}
                         className="font-bold py-3 px-6 rounded-xl disabled:opacity-50 transition-opacity hover:opacity-90"
                         style={{ backgroundColor: 'var(--theme-color, orange)', color: 'var(--theme-text-color, black)' }}
                       >
                         {uploadingImage ? 'Menyimpan...' : 'Simpan URL'}
                       </button>
                    </div>
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-zinc-500 text-sm">ATAU</span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  {/* Cara 2: Upload File */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Cara 2: Upload File Gambar langsung</label>
                    <label className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold tracking-wider py-3 rounded-xl cursor-pointer text-center block transition-colors border border-white/10">
                       <span>{uploadingImage ? 'Memproses gambar...' : 'Pilih File Gambar'}</span>
                       <input type="file" accept="image/*" onChange={handleAddArtwork} className="hidden" disabled={uploadingImage} />
                    </label>
                    <p className="text-xs text-zinc-500 mt-2 text-center">Gambar akan dikompres otomasis (ukuran maksimal 1MB di Firestore).</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="bg-zinc-900 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 space-y-6">
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {artToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 p-6 rounded-2xl max-w-md w-full shadow-2xl relative"
            >
              <h3 className="text-xl font-bold text-white mb-2">Hapus Artwork</h3>
              <p className="text-zinc-400 mb-6">
                Apakah Anda yakin ingin menghapus artwork <strong className="text-white">"{artToDelete.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setArtToDelete(null)}
                  className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDeleteArtwork}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
