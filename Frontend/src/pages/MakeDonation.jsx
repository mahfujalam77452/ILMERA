import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DonationForm from '../components/donation/DonationForm';

const MakeDonation = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const state = location.state || {};

  const incomingCategory =
    state.category ||
    state.fund ||
    state.fundName ||
    'General Fund';

  const initialData = {
    amount: state.amount || '',
    phone_email: state.phoneEmail || '',
    category: incomingCategory
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20 pt-24">
      
      {/* Header */}
      <div className="bg-[#0B4D26] py-12 px-4 text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {t('make_donation_page.title')}
        </h1>

        <div className="inline-block bg-[#093d1e] rounded-full px-6 py-2 mt-2 border border-green-700">
          <p className="text-green-100 text-sm md:text-base">
            Donating to:{' '}
            <span className="font-bold text-[#EAB308] uppercase tracking-wide">
              {initialData.category}
            </span>
          </p>
        </div>
      </div>

      <DonationForm initialData={initialData} />
    </div>
  );
};

export default MakeDonation;
