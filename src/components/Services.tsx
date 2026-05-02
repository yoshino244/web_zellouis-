import { motion } from 'motion/react';
import { Palette, Wand2, Frame, CheckCircle2 } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

export default function Services() {
  const config = useConfig();
  
  // Use packages if available, otherwise fallback to backward compatible version
  // Actually we have them in defaultConfig so config.packages will always be there
  const packages = config.packages || [];
  
  // Determine grid columns based on number of packages
  let gridColsClass = 'md:grid-cols-3';
  if (packages.length === 1) gridColsClass = 'md:grid-cols-1 max-w-lg mx-auto';
  else if (packages.length === 2) gridColsClass = 'md:grid-cols-2 max-w-4xl mx-auto';
  else if (packages.length > 3) gridColsClass = 'md:grid-cols-3 lg:grid-cols-4';

  const icons = [Palette, Wand2, Frame];

  return (
    <section id="commissions" className="py-24 bg-[#0c0c0e] relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full filter blur-[120px] pointer-events-none" style={{ backgroundColor: 'var(--theme-color, orange)', opacity: 0.1 }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-mono text-xs tracking-widest uppercase mb-2 block" style={{ color: 'var(--theme-color, orange)' }}>Pricing & Process</span>
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6">Commission Structure</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Every piece is crafted with meticulous attention to detail. Select a package that fits your needs, or contact me for bespoke projects requiring commercial use.
          </p>
        </div>

        <div className={`flex md:grid ${gridColsClass} gap-8 overflow-x-auto md:overflow-visible pb-8 snap-x snap-mandatory no-scrollbar`}>
          {packages.map((pkg, index) => {
            const Icon = icons[index % icons.length];
            const features = (pkg.features || '').split('\n').filter(Boolean);
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                key={pkg.id || index}
                className="min-w-[85vw] sm:min-w-[60vw] md:min-w-0 snap-center bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-white/10 transition-colors flex flex-col relative overflow-hidden group hover:border-[#ff8a00]"
                style={{ '--tw-border-opacity': '0.5' } as any}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>

                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7" style={{ color: 'var(--theme-color, orange)' }} />
                </div>
                
                <h3 className="text-2xl font-sans font-bold text-white mb-2">{pkg.title}</h3>
                <div className="font-mono text-xl mb-4" style={{ color: 'var(--theme-color, orange)' }}>{pkg.price}</div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">{pkg.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start text-zinc-300 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: 'var(--theme-color, orange)' }} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a 
                  href={`${config.contactLink1}?text=${encodeURIComponent(pkg.whatsappMessage || `Hello! I'm interested in the ${pkg.title} package.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-full bg-white/5 backdrop-blur-md text-white border border-white/10 transition-all duration-300 font-bold uppercase tracking-wider text-sm mt-auto z-10 flex justify-center items-center hover:opacity-90"
                  style={{ '--tw-bg-opacity': '1', ':hover': { backgroundColor: 'var(--theme-color, orange)', color: 'var(--theme-text-color, black)' } } as any}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-color, orange)';
                    e.currentTarget.style.color = 'var(--theme-text-color, black)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                    e.currentTarget.style.color = '';
                  }}
                >
                  Select Package
                </a>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border italic mb-4" style={{ backgroundColor: 'transparent', color: 'var(--theme-color, orange)', borderColor: 'var(--theme-color, orange)' }}>Z</div>
          <h4 className="text-xl font-bold text-white mb-2">Need something different?</h4>
          <p className="text-zinc-400 text-sm max-w-lg mb-6">I also take on commercial branding, album covers, and large-scale studio work.</p>
          <a href="#contact" className="inline-block font-bold uppercase tracking-widest pb-1 border-b-2 transition-colors text-sm hover:opacity-80" style={{ color: 'var(--theme-color, orange)', borderColor: 'var(--theme-color, orange)' }}>
            Request Custom Quote
          </a>
        </div>
      </div>
    </section>
  );
}
