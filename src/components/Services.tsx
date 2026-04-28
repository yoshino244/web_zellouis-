import { motion } from 'motion/react';
import { Palette, Wand2, Frame, CheckCircle2 } from 'lucide-react';

const SERVICES = [
  {
    icon: Palette,
    title: 'Custom Portraits',
    price: 'From $150',
    description: 'Transform your photos into stunning digital paintings with a highly stylized, cinematic feel.',
    features: ['High-res digital file', '1 Character', 'Simple background', '2 revision rounds']
  },
  {
    icon: Wand2,
    title: 'Concept & Character Design',
    price: 'From $250',
    description: 'Bring your original characters and novel concepts to vivid reality with detailed full-body illustrations.',
    features: ['High-res digital file', 'Iterative sketches', 'Complex details', 'Props included']
  },
  {
    icon: Frame,
    title: 'Environment & Splash Art',
    price: 'From $400',
    description: 'Breathtaking full-scale scenes for games, novel covers, or professional branding needs.',
    features: ['Commercial rights option', 'Complex architecture/nature', 'Dynamic lighting', 'Source files']
  }
];

export default function Services() {
  return (
    <section id="commissions" className="py-24 bg-[#0c0c0e] relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full filter blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-orange-500 font-mono text-xs tracking-widest uppercase mb-2 block">Pricing & Process</span>
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6">Commission Structure</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Every piece is crafted with meticulous attention to detail. Select a package that fits your needs, or contact me for bespoke projects requiring commercial use.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                key={service.title}
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 border border-white/10 hover:border-orange-500/50 transition-colors flex flex-col relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>

                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-orange-500" />
                </div>
                
                <h3 className="text-2xl font-sans font-bold text-white mb-2">{service.title}</h3>
                <div className="text-orange-500 font-mono text-xl mb-4">{service.price}</div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start text-zinc-300 text-sm font-medium">
                      <CheckCircle2 className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-4 rounded-full bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all duration-300 font-bold uppercase tracking-wider text-sm mt-auto z-10">
                  Select Package
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 text-2xl font-bold border border-orange-500/30 italic mb-4">Z</div>
          <h4 className="text-xl font-bold text-white mb-2">Need something different?</h4>
          <p className="text-zinc-400 text-sm max-w-lg mb-6">I also take on commercial branding, album covers, and large-scale studio work.</p>
          <a href="#contact" className="inline-block text-orange-500 font-bold uppercase tracking-widest hover:text-orange-400 pb-1 border-b-2 border-orange-500/30 hover:border-orange-400 transition-colors text-sm">
            Request Custom Quote
          </a>
        </div>
      </div>
    </section>
  );
}
