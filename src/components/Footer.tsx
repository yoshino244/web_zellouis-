import { Paintbrush } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0c0c0e] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-2">
          <span className="font-sans text-xl tracking-tighter font-bold text-white uppercase">
            ZELLOUIS<span className="text-orange-500">.ART</span>
          </span>
        </div>

        <div className="text-zinc-500 text-sm font-medium text-center md:text-left">
          &copy; {new Date().getFullYear()} ZELLOUIS ART. All rights reserved. <br className="md:hidden" />
          <span className="hidden md:inline"> | </span> Designed with purpose.
        </div>

        <div className="flex gap-6">
          <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">Terms</a>
          <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
