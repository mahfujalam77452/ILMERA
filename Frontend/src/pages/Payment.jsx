import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

// Initialize Stripe outside component to avoid recreating it
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// --- CHECKOUT FORM COMPONENT ---
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Redirect to a success page after payment
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    // This checks for immediate errors (e.g., card declined)
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
        toast.error(error.message);
      } else {
        setMessage("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      
      {message && <div className="text-red-500 text-sm font-bold">{message}</div>}
      
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full bg-[#0B4D26] text-white font-bold py-4 rounded-lg hover:bg-[#093d1e] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Processing...
          </div>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
};

// --- MAIN PAGE WRAPPER ---
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientSecret, amount, category } = location.state || {};

  useEffect(() => {
    if (!clientSecret) {
      toast.error("Invalid Payment Session. Please try again.");
      navigate('/make-donation');
    }
  }, [clientSecret, navigate]);

  if (!clientSecret) return null;

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0B4D26',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Payment Summary Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="bg-[#0B4D26] py-6 px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-1">Complete Donation</h2>
            <p className="text-green-100 text-sm">Secure Payment via Stripe</p>
          </div>
          <div className="p-6 text-center border-b border-gray-100">
             <p className="text-gray-500 text-sm uppercase tracking-wide font-bold mb-1">Donating To</p>
             <p className="text-gray-900 font-bold text-lg mb-4">{category}</p>
             
             <p className="text-gray-500 text-sm uppercase tracking-wide font-bold mb-1">Total Amount</p>
             <p className="text-3xl font-extrabold text-[#0B4D26]">$ {amount}</p>
          </div>
          
          {/* Stripe Element */}
          <div className="p-8">
            <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs flex justify-center items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Encrypted & Secure Payment
        </p>
      </div>
    </div>
  );
};

export default Payment;