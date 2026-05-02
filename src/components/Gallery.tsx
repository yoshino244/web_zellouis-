import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useConfig } from '../context/ConfigContext';

export interface Artwork {
  id: string;
  title: string;
  category: string;
  src: string;
  aspect: string;
  createdAt: number;
}



export default function Gallery() {
  const config = useConfig();
  const CATEGORIES = ['All', ...(config.galleryCategories || ['Portraits', 'Fantasy', 'Concept Art'])];

  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artwork));
      setArtworks(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
    });

    return () => unsub();
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    if (!carouselRef.current) return;
    const interval = setInterval(() => {
      if (isHovered) return;
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const itemWidth = clientWidth > 768 ? 424 : clientWidth * 0.85; 
          carouselRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const filteredArtwork = artworks.filter(
    (art) => activeCategory === 'All' || art.category === activeCategory
  );

  // Gallery is shown even when empty so users know it exists
  
  return (
    <section id="gallery" className="py-24 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase mb-2 block" style={{ color: 'var(--theme-color, orange)' }}>Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-white">Selected Works</h2>
          </div>
          
          <div className="hidden md:flex gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 uppercase tracking-wider ${
                  activeCategory === category
                    ? 'shadow-lg'
                    : 'bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
                style={activeCategory === category ? { backgroundColor: 'var(--theme-color, orange)', color: 'var(--theme-text-color, black)', boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--theme-color, orange) 20%, transparent)' } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Categories Overflow */}
        <div className="md:hidden flex gap-3 overflow-x-auto pb-6 mb-4 snap-x no-scrollbar">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium snap-start transition-colors uppercase tracking-wider ${
                activeCategory === category
                  ? ''
                  : 'bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400'
              }`}
              style={activeCategory === category ? { backgroundColor: 'var(--theme-color, orange)', color: 'var(--theme-text-color, black)' } : {}}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Carousel Layout */}
        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsHovered(false), 2000);
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredArtwork.map((art, index) => (
              <motion.div
                layout
                key={art.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                whileHover={{ 
                  x: [0, -4, 4, -2, 2, 0],
                  transition: { duration: 0.4, ease: "easeInOut" }
                }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                className={`flex-shrink-0 w-[85vw] sm:w-[300px] md:w-[400px] snap-center group relative rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/5 ${art.aspect}`}
                onClick={() => setSelectedImage(art.src)}
              >
                <img
                  src={art.src}
                  alt={art.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                    <div>
                      <h3 className="text-xl font-sans font-bold text-white mb-1">{art.title}</h3>
                      <p className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--theme-color, orange)' }}>{art.category}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur p-2 rounded-full text-white self-center">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur flex items-center justify-center p-4 lg:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 rounded-full p-2 transition-colors z-[101]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Artwork fullscreen view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
