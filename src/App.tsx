/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import { AuthProvider } from './context/AuthContext';
import { ConfigProvider, useConfig } from './context/ConfigContext';

function MainLayout() {
  const config = useConfig();
  
  return (
    <div style={{ '--theme-color': config.themeColor } as React.CSSProperties}>
      <Navbar />
      <Hero />
      <Gallery />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0c0c0e] text-zinc-50 selection:bg-orange-500/30">
            <Routes>
              <Route path="/" element={<MainLayout />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ConfigProvider>
    </AuthProvider>
  );
}
