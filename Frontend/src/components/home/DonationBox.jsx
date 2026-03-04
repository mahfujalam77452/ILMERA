import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { donationFunds } from '../../utils/constants';

const DonationBox = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [selectedFund, setSelectedFund] = useState('');
  const [phoneEmail, setPhoneEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handleDonate = (e) => {
    e.preventDefault();
    navigate('/make-donation', { state: { fund: selectedFund, phoneEmail, amount } });
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 mb-16">
      <div className="bg-[#EAB308] rounded-xl shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          {t('home.donation_title')}
        </h2>
        
        <form onSubmit={handleDonate} className="flex flex-col md:flex-row gap-4 items-end">
          {/* Fund Selector */}
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {t('home.donation_fund')}
            </label>
            <select 
              required
              value={selectedFund}
              onChange={(e) => setSelectedFund(e.target.value)}
              className="w-full px-4 py-3 rounded-md border-0 text-gray-900 shadow-sm focus:ring-2 focus:ring-green-600 bg-white"
            >
              <option value="" disabled>{t('home.fund_placeholder')}</option>
              {donationFunds.map((fund) => (
                <option key={fund.id} value={fund.id}>
                  {i18n.language === 'bn' ? fund.bn : fund.en}
                </option>
              ))}
            </select>
          </div>

          {/* Phone/Email */}
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {t('home.phone_email')} 
              <span className="text-xs ml-1 font-normal text-gray-700">ℹ️</span>
            </label>
            <input 
              type="text" 
              required
              value={phoneEmail}
              onChange={(e) => setPhoneEmail(e.target.value)}
              defaultValue="+8801774527178"
              className="w-full px-4 py-3 rounded-md border-0 text-gray-900 shadow-sm focus:ring-2 focus:ring-green-600 bg-white"
            />
          </div>

          {/* Amount */}
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {t('home.donation_amount')}
            </label>
            <input 
              type="number" 
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('home.amount_placeholder')}
              className="w-full px-4 py-3 rounded-md border-0 text-gray-900 shadow-sm focus:ring-2 focus:ring-green-600 bg-white"
            />
          </div>

          {/* Submit Button */}
          <div className="w-full md:w-auto mt-4 md:mt-0">
            <button 
              type="submit"
              className="w-full md:w-32 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-md font-bold transition-colors shadow-sm"
            >
              {t('menu.donate')}
            </button>
          </div>
        </form>

       
      </div>
    </div>
  );
};

export default DonationBox;