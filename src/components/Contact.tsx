import { motion } from 'motion/react';
import { MessageCircle, Instagram, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

export default function Contact() {
  const config = useConfig();

  return (
    <section id="contact" className="py-24 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Main info text */}
          <div>
            <span className="font-mono tracking-widest uppercase text-xs mb-2 block" style={{ color: 'var(--theme-color, orange)' }}>Get in Touch</span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-sans font-bold text-white mb-6"
            >
              Let's create something extraordinary
            </motion.h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-12 max-w-md">
              Currently accepting new commissions. Reach out directly via WhatsApp to discuss your vision, ideas, and timeline.
            </p>

            <div className="space-y-6">
              <a href={config.contactLink1} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:border-orange-500/50 transition-colors" style={{ '--tw-border-opacity': '0.5', borderColor: 'var(--theme-color, orange)' } as any}>
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">{config.contactLabel1}</span>
              </a>
              <a href={config.contactLink2} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:border-orange-500/50 transition-colors" style={{ '--tw-border-opacity': '0.5', borderColor: 'var(--theme-color, orange)' } as any}>
                  <Instagram className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">{config.contactLabel2}</span>
              </a>
              <a href={config.contactLink3} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:border-orange-500/50 transition-colors" style={{ '--tw-border-opacity': '0.5', borderColor: 'var(--theme-color, orange)' } as any}>
                  <LinkIcon className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">{config.contactLabel3}</span>
              </a>
            </div>
          </div>

          {/* Direct WhatsApp Call to Action block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10" style={{ backgroundColor: 'var(--theme-color, orange)', opacity: 0.1, position: 'absolute' }}></div>
            <MessageCircle className="w-16 h-16 mb-6" style={{ color: 'var(--theme-color, orange)' }} />
            
            <h3 className="text-2xl font-bold text-white mb-4">Chat with Me on WhatsApp</h3>
            <p className="text-zinc-400 mb-8 max-w-sm">
              The fastest way to get your commission started. Drop me a message with your references and let's make it happen.
            </p>
            
            <a 
              href={config.contactLink1}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--theme-color, orange)', color: 'var(--theme-text-color, black)' }}
            >
              Send a Message
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
