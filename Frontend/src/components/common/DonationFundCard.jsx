import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const DonationFundCard = ({ fund }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;

  // Localized Text for Display
  const title = lang === 'bn' ? fund.title_bn : fund.title_en;
  const description = lang === 'bn' ? fund.desc_bn : fund.desc_en;

  const handleDonate = () => {
    navigate('/make-donation', { 
      state: { 
        // IMPORTANT: Pass the English title as 'category' for the Backend API
        category: fund.id, 
        // Pass the localized title for Display purposes (optional)
        fundName: title 
      } 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full max-w-[380px] mx-auto w-full group">
      
      {/* Image Section */}
      <div className="h-48 w-full overflow-hidden bg-gray-100 relative">
        <img 
          src={fund.image} 
          alt={title} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Fund+Image' }}
        />
        {/* Overlay Gradient (Optional Polish) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 flex-grow flex flex-col text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-6 flex-grow text-justify line-clamp-3 leading-relaxed">
          {description}
        </p>
        
        <div className="mt-auto">
          <button 
            onClick={handleDonate}
            className="w-full bg-[#0B4D26] hover:bg-[#093d1e] text-white font-bold py-3 rounded-md transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            {t('donation_page.donate_btn') || "Donate Now"}
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationFundCard;