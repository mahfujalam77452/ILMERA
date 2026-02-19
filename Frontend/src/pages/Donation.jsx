import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DonationFundCard from '../components/common/DonationFundCard';
import { donationFunds } from '../data/donationFunds';

const Donation = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      
      {/* Banner */}
      <div className="bg-[#0B4D26] py-16 px-4 sm:px-6 lg:px-8 text-center mt-16 sm:mt-20">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {t('donation_page.title')}
        </h1>
        <p className="text-green-100 font-medium">
          <Link to="/" className="hover:text-white transition-colors">{t('menu.home')}</Link> 
          <span className="mx-2">/</span> 
          {t('menu.donate')}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800">{t('donation_page.subtitle')}</h2>
          <div className="w-24 h-1 bg-[#EAB308] mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {donationFunds.map((fund) => (
            <DonationFundCard key={fund.id} fund={fund} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Donation;