import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Hero() {
  const config = useConfig();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Create WhatsApp URL
  const whatsappUrl = `https://wa.me/${config.whatsappNumber.replace(/[^0-9]/g, '')}`;

  const handleGalleryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (location.pathname !== '/') {
      navigate('/#gallery');
      return;
    }

    const element = document.getElementById('gallery');
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      navigate('/gallery');
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 pt-20">
      {/* Abstract background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--theme-color,orange)] rounded-full mix-blend-multiply flex-shrink-0 blur-[120px] opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10 w-full py-16 lg:py-0">
        
        {/* Text Content */}
        <div className="flex flex-col items-start text-left space-y-8 order-2 lg:order-1 pt-8 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--theme-color, orange)' }}></span>
            <span className="text-xs font-medium text-zinc-300 tracking-wider uppercase">Open for Commissions</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold text-white leading-[1.1] tracking-tight whitespace-pre-wrap"
          >
            {config.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-lg leading-relaxed mix-blend-plus-lighter whitespace-pre-wrap"
          >
            {config.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:opacity-90 transition-all duration-300 group"
              style={{ backgroundColor: 'var(--theme-color, orange)', color: 'var(--theme-text-color, black)' }}
            >
              Order via WhatsApp
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#gallery"
              onClick={handleGalleryClick}
              className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white/10 transition-all duration-300"
            >
              Explore Gallery
            </a>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative order-1 lg:order-2 w-full max-w-lg mx-auto lg:max-w-none"
        >
          <div className="aspect-[4/5] object-cover rounded-3xl overflow-hidden relative border border-white/10 bg-zinc-900 group">
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
            <img
              src={config.heroImage}
              alt="Conceptual Digital Art displaying vivid colors and surreal elements"
              className="w-full h-full object-cover"
            />
            
            {/* Floating details */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
              <div>
                <p className="font-mono text-xs mb-2 uppercase tracking-widest" style={{ color: 'var(--theme-color, orange)' }}>{config.featuredArtTag}</p>
                <p className="text-white font-sans font-bold text-2xl">{config.featuredArtTitle}</p>
              </div>
            </div>
          </div>
          
          {/* Decorative frame elements overlaying the container slightly */}
          <div className="absolute -inset-1 border border-white/5 rounded-[2rem] -z-10 bg-zinc-950/50"></div>
          <div className="absolute -inset-4 border border-white/5 rounded-[2.5rem] -z-20 bg-zinc-950/20"></div>
        </motion.div>

      </div>
    </section>
  );
}
