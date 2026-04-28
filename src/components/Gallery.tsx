import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X } from 'lucide-react';

const CATEGORIES = ['All', 'Portraits', 'Fantasy', 'Concept Art'];

const ARTWORKS = [
  {
    id: 1,
    title: 'Neon Samurai',
    category: 'Concept Art',
    src: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-square',
  },
  {
    id: 2,
    title: 'Ethereal Being',
    category: 'Portraits',
    src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 3,
    title: 'Crystal Caverns',
    category: 'Fantasy',
    src: 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 4,
    title: 'Cyberpunk Cityscape',
    category: 'Concept Art',
    src: 'https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[16/9]',
  },
  {
    id: 5,
    title: 'Forest Guardian',
    category: 'Fantasy',
    src: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 6,
    title: 'Royal Portrait',
    category: 'Portraits',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    aspect: 'aspect-square',
  },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredArtwork = ARTWORKS.filter(
    (art) => activeCategory === 'All' || art.category === activeCategory
  );

  return (
    <section id="gallery" className="py-24 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-orange-500 font-mono text-xs tracking-widest uppercase mb-2 block">Portfolio</span>
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-white">Selected Works</h2>
          </div>
          
          <div className="hidden md:flex gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 uppercase tracking-wider ${
                  activeCategory === category
                    ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                    : 'bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
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
                  ? 'bg-orange-500 text-black'
                  : 'bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry-like Grid Layout */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/5 ${art.aspect}`}
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
                      <p className="text-orange-500 font-mono text-xs uppercase tracking-widest">{art.category}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur p-2 rounded-full text-white self-center">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
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
