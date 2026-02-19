import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full overflow-hidden">
      
      {/* 1. BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e6f0ea] via-[#f0fdf4] to-white z-0"></div>
      
      {/* Decorative Blobs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob z-0"></div>
      <div className="absolute top-20 -left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 z-0"></div>

      {/* 2. MAIN CONTENT */}
      {/* UPDATED PADDING:
         - 'py-16' for mobile (moderate spacing)
         - 'md:py-24' for big screens (reduced from previous huge padding)
      */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#0B4D26] leading-tight drop-shadow-sm">
          {t('home.hero_title')}
        </h1>
        
        {/* Description */}
        <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
          {t('home.hero_desc')}
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pb-20 justify-center items-center">
          <Link 
            to="/about-us" 
            className="bg-[#0B4D26] hover:bg-green-800 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            {t('home.know_more')}
          </Link>
          
          <Link 
            to="/activities" 
            className="bg-white border-2 border-[#0B4D26] text-[#0B4D26] hover:bg-green-50 px-8 py-3 rounded-full font-bold text-lg shadow-sm hover:shadow-md transition-all"
          >
            {t('home.all_activities')}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default HeroSection;