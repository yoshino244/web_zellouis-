import React, { useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useConfig } from '../context/ConfigContext';
import { getContrastColor } from '../utils/themeUtils';

export default function Privacy() {
  const config = useConfig();
  const themeTextColor = useMemo(() => getContrastColor(config.themeColor), [config.themeColor]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col theme-selection" style={{ '--theme-color': config.themeColor, '--theme-text-color': themeTextColor } as React.CSSProperties}>
      <Navbar />
      <div className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-sans font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-orange max-w-none space-y-6 text-zinc-300">
          <p>
            Your privacy is important to us. It is Zellouis Art's policy to respect your privacy regarding any information we may collect from you across our website.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used. 
          </p>
          <p>
            Information collected may include your name, email address, and any reference materials or personal details you provide during the commission process.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. How We Use Information</h2>
          <p>
            The information we collect is used solely to facilitate the commission process, communicate with you regarding your project, and deliver the final artwork. We do not use your information for marketing purposes without explicit consent.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Data Retention</h2>
          <p>
            We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Third-Party Links</h2>
          <p>
            Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Your Consent</h2>
          <p>
            You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
          </p>
          <p>
            Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
