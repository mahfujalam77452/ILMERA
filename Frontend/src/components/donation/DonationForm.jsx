import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { donationService } from '../../services/donationService';

const DonationForm = ({ initialData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: initialData.amount || '',
    name: '',
    phone_email: initialData.phone_email || '',
    category: initialData.category || 'General Fund'
  });

  const predefinedAmounts = [5, 10, 50, 100];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmountClick = (amount) => {
    setFormData({ ...formData, amount });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        amount: Number(formData.amount),
        name: formData.name,
        phone_email: formData.phone_email,
        category: formData.category
      };

      const res = await donationService.initiateDonation(payload);

      if (res.success) {
        toast.success(t('make_donation_page.success_init'));

        navigate('/payment', {
          state: {
            clientSecret: res.data.client_secret,
            amount: payload.amount,
            category: payload.category
          }
        });
      } else {
        toast.error('Failed to initiate donation.');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Something went wrong.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const labelClass =
    'block text-sm font-bold text-gray-700 mb-2';
  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-1 focus:ring-[#0B4D26] focus:border-[#0B4D26] outline-none transition-all font-medium';

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Amount Selection */}
          <div>
            <label className={labelClass}>
              {t('make_donation_page.amount_label')}
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {predefinedAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAmountClick(amt)}
                  className={`py-2 px-4 rounded-lg font-bold border-2 transition-all ${
                    Number(formData.amount) === amt
                      ? 'border-[#0B4D26] bg-[#0B4D26] text-white'
                      : 'border-gray-200 text-gray-600 hover:border-[#0B4D26]'
                  }`}
                >
                  $ {amt}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                $
              </span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder={t('make_donation_page.custom_amount')}
                className={`${inputClass} pl-10 text-lg`}
                required
                min="1"
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>
                {t('make_donation_page.name_label')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className={labelClass}>
                {t('make_donation_page.contact_label')}
              </label>
              <input
                type="text"
                name="phone_email"
                value={formData.phone_email}
                onChange={handleChange}
                className={inputClass}
                placeholder="017... or email@example.com"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EAB308] hover:bg-yellow-600 text-black font-bold py-4 rounded-lg transition-colors text-lg shadow-md flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : t('make_donation_page.btn_pay')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonationForm;
