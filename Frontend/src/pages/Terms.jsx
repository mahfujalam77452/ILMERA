import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-gray-50 min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B4D26] mb-2 font-bengali">
          Terms & Conditions
        </h1>
        <p className="text-gray-500 mb-8 text-sm">Last updated: February 12, 2026</p>

        <div className="prose prose-green max-w-none text-gray-700 leading-relaxed space-y-6">
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">1. Introduction</h3>
            <p>
              Welcome to the Ilmera Education & Research Foundation website. By accessing our website, you agree to these Terms and Conditions. Please read them carefully.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">2. Use of Website</h3>
            <p>
              You may use our website for lawful purposes only. You must not use our site to transmit any malicious code, spam, or engage in any activity that disrupts our services.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">3. Donations</h3>
            <p>
              All donations made through our website are voluntary. While we strive to use funds for the specific causes selected, the Foundation reserves the right to redirect funds to other critical areas if necessary, ensuring they are used for charitable purposes.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">4. Intellectual Property</h3>
            <p>
              The content, logo, and design of this website are the property of Ilmera Education & Research Foundation. You may not copy, reproduce, or distribute any content without our prior written permission.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">5. Limitation of Liability</h3>
            <p>
              We strive to ensure the information on this website is accurate. However, we are not liable for any inaccuracies, errors, or technical issues that may arise.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default Terms;