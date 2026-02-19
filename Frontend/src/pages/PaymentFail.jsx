import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PaymentFail = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  
  // Get the error message from the URL (if Stripe sent one)
  const errorMessage = searchParams.get("message") || "Payment could not be processed.";

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
        
        {/* Red Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-red-500 font-medium mb-6">{errorMessage}</p>

        <p className="text-gray-600 mb-8 text-sm">
          Don't worry, you haven't been charged. This can happen due to insufficient funds, card limits, or bank security checks.
        </p>

        <div className="space-y-3">
          <Link 
            to="/make-donation" 
            className="block w-full bg-[#0B4D26] text-white font-bold py-3 rounded-lg hover:bg-[#093d1e] transition-colors shadow-md"
          >
            Try Again
          </Link>
          <Link 
            to="/" 
            className="block w-full bg-white text-gray-700 font-bold py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Return Home
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Need help? <Link to="/contact" className="text-[#0B4D26] underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;