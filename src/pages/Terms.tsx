import React, { useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useConfig } from '../context/ConfigContext';
import { getContrastColor } from '../utils/themeUtils';

export default function Terms() {
  const config = useConfig();
  const themeTextColor = useMemo(() => getContrastColor(config.themeColor), [config.themeColor]);
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col theme-selection" style={{ '--theme-color': config.themeColor, '--theme-text-color': themeTextColor } as React.CSSProperties}>
      <Navbar />
      <div className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-sans font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-zinc-300">
          <p>
            Welcome to Zellouis Art. By using our website and commissioning our services, you agree to the following terms and conditions.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Commissions and Process</h2>
          <p>
            All custom commissions are subject to availability and project scope approval. The process outlined on our website, including the number of revisions and estimated timeline, acts as a general guideline. Complex projects may require additional time and an adjusted fee structure.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Payments and Refunds</h2>
          <p>
            A non-refundable deposit may be required before work begins. Full payment is generally required before final high-resolution files without watermarks are delivered. Refunds are not provided once work has commenced due to the customized nature of the art.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Copyright and Usage Rights</h2>
          <p>
            As the artist, we retain the copyright to all created artworks unless a commercial rights agreement is specifically purchased. Clients are permitted to use commissioned art for personal, non-commercial purposes (e.g., social media avatars, personal prints) provided that the art is not altered, distributed for profit, or claimed as their own.
          </p>
          <p>
            If commercial rights are purchased, additional terms will be provided in a separate agreement.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Revisions</h2>
          <p>
            The included revision rounds allow for minor changes. Major changes (such as entirely changing the pose or concept) after the initial sketch phase may incur additional fees.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Modifications to the Terms</h2>
          <p>
            We reserve the right to modify these terms of service at any time. Any changes will be updated on this page.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
