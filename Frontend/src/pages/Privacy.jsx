import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-gray-50 min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12">
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B4D26] mb-2 font-bengali">
          Privacy Policy
        </h1>
        <p className="text-gray-500 mb-8 text-sm">Last updated: February 12, 2026</p>

        <div className="prose prose-green max-w-none text-gray-700 leading-relaxed space-y-6">
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us, such as when you make a donation, sign up for our newsletter, or contact us. This may include your name, email address, phone number, and payment information.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">2. How We Use Your Information</h3>
            <p>
              We use the information we collect to:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Process your donations and send receipts.</li>
                <li>Communicate with you about our projects and updates.</li>
                <li>Maintain the security of our website.</li>
              </ul>
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">3. Payment Security</h3>
            <p>
              We use secure third-party payment gateways (like Stripe) to process donations. We do not store your credit card details on our servers.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">4. Sharing of Information</h3>
            <p>
              We do not sell or trade your personal information. We may share information with trusted service providers who assist us in operating our website, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-2">5. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <strong>info@ilmerafoundation.org</strong>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};

export default Privacy;