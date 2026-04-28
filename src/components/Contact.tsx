import { motion } from 'motion/react';
import { Mail, Instagram, Twitter, Send } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-zinc-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Main info text */}
          <div>
            <span className="text-orange-500 font-mono tracking-widest uppercase text-xs mb-2 block">Get in Touch</span>
            <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6">Let's create something extraordinary</h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-12 max-w-md">
              Currently accepting new commissions for Q3 2026. Fill out the form or reach out directly via email to discuss your vision.
            </p>

            <div className="space-y-6">
              <a href="mailto:hello@zellouis.art" className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:border-orange-500/50 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">hello@zellouis.art</span>
              </a>
              <a href="#" className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:border-orange-500/50 transition-colors">
                  <Instagram className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">@zellouis.art</span>
              </a>
              <a href="#" className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:border-orange-500/50 transition-colors">
                  <Twitter className="w-5 h-5" />
                </div>
                <span className="text-lg font-medium">@zellouis_art</span>
              </a>
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl shadow-orange-500/5"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-400">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-400">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="project" className="text-sm font-medium text-zinc-400">Project Type</label>
                <select
                  id="project"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none"
                >
                  <option value="portrait">Custom Portrait</option>
                  <option value="concept">Concept & Character Design</option>
                  <option value="environment">Environment Layout</option>
                  <option value="other">Other / Commercial</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="details" className="text-sm font-medium text-zinc-400">Project Details</label>
                <textarea
                  id="details"
                  rows={4}
                  placeholder="Describe your vision, timeline, and any reference material..."
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600 resize-none"
                ></textarea>
              </div>

              <button className="w-full bg-orange-500 text-black font-bold uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors">
                Send Inquiry
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
