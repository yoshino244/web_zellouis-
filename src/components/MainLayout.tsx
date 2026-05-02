import React, { useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Gallery from './Gallery';
import Services from './Services';
import Contact from './Contact';
import Footer from './Footer';
import { useConfig } from '../context/ConfigContext';
import { getContrastColor } from '../utils/themeUtils';

export default function MainLayout() {
  const config = useConfig();
  const themeTextColor = useMemo(() => getContrastColor(config.themeColor), [config.themeColor]);
  
  useEffect(() => {
    // Prevent right click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Prevent dragging images
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // Prevent certain keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // ctrl+s (save), ctrl+u (view source), ctrl+c (copy), ctrl+p (print)
      if (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'c' || e.key === 'p')) {
        e.preventDefault();
      }
      // F12 or Ctrl+Shift+I or Ctrl+Shift+J (DevTools)
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <div className="select-none" style={{ '--theme-color': config.themeColor, '--theme-text-color': themeTextColor } as React.CSSProperties}>
      <Navbar />
      <Hero />
      <Gallery />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}
