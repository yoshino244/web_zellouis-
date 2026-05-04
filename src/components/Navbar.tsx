import { useState, useEffect } from 'react';
import { Menu, X, Paintbrush, Instagram, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: 'home' },
    { name: 'Gallery', href: 'gallery' },
    { name: 'Commissions', href: 'commissions' },
    { name: 'Contact', href: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/#' + href);
      // The scroll will happen automatically if the browser supports it or via another useEffect
      return;
    }

    const element = document.getElementById(href);
    if (element) {
      const offset = 100; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      // Update route
      navigate('/' + href);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'pt-4' : 'pt-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 lg:px-8 transition-all duration-300 ${
          isScrolled ? 'shadow-lg shadow-black/20' : ''
        }`}>
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={(e) => handleNavClick(e as any, 'home')}
          >
            <span className="font-sans text-2xl tracking-tighter font-bold text-white uppercase">
              ZELLOUIS<span style={{ color: 'var(--theme-color, orange)' }}>.ART</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-gray-300 hover:text-white transition-colors duration-300 px-3 py-2 text-sm font-medium tracking-wide uppercase"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-colors duration-300 hover:opacity-90"
                style={{ backgroundColor: 'var(--theme-color, orange)', color: 'var(--theme-text-color, black)' }}
              >
                Let's Talk
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 mx-4 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block px-4 py-4 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 active:bg-white/10 text-center uppercase tracking-widest transition-all"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                className="block w-full px-4 py-4 rounded-xl text-center text-sm font-bold uppercase tracking-wider transition-all"
                style={{ backgroundColor: 'var(--theme-color, orange)', color: 'var(--theme-text-color, black)' }}
              >
                Let's Talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
