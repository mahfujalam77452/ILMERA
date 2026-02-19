import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import { runFireworks } from '../utils/confetti'; // Optional

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // 1. GET DATA FROM URL (Stripe sends these)
  const payment_intent_id = searchParams.get("payment_intent");
  const redirect_status = searchParams.get("redirect_status");

  // 2. GET DETAILS FROM SESSION STORAGE (Because location.state is lost)
  const [donationDetails, setDonationDetails] = useState({ amount: '', category: '' });

  useEffect(() => {
    // Check if the payment actually failed
    if (redirect_status === 'failed') {
      navigate('/payment-fail?message=Payment verification failed.');
      return;
    }

    // Retrieve saved details (Amount, Category) from the session we saved earlier
    const savedSession = sessionStorage.getItem('donationSession');
    if (savedSession) {
      const data = JSON.parse(savedSession);
      setDonationDetails({
        amount: data.amount,
        category: data.category
      });
      // Optional: Clear session after showing success (so it doesn't persist forever)
      // sessionStorage.removeItem('donationSession'); 
    }

    // Optional: Trigger confetti/fireworks here
    // runFireworks();

  }, [redirect_status, navigate]);

  if (redirect_status === 'failed') return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-green-100">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#0B4D26]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h2>
        
        <p className="text-gray-600 mb-6">
          Your donation has been received successfully.
        </p>

        {/* Dynamic Details from Session Storage */}
        {donationDetails.amount && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-100">
            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-1">Donation Details</p>
            <p className="text-lg font-bold text-gray-800">
              {donationDetails.category} • <span className="text-[#0B4D26]">৳{donationDetails.amount}</span>
            </p>
            <p className="text-xs text-gray-400 mt-2 font-mono">ID: {payment_intent_id?.slice(-8)}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            to="/" 
            className="block w-full bg-[#0B4D26] text-white font-bold py-3 rounded-lg hover:bg-[#093d1e] transition-colors shadow-md"
          >
            Return Home
          </Link>
          <Link 
            to="/make-donation" 
            className="block w-full bg-white text-gray-700 font-bold py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Donate Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;