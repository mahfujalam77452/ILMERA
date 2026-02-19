import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CorePillars = () => {
  const { t } = useTranslation();

  const pillars = [
    {
      key: 'education',
      icon: (
        <svg className="w-8 h-8 text-[#0B4D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      key: 'service',
      icon: (
        <svg className="w-8 h-8 text-[#0B4D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      key: 'dawah',
      icon: (
        <svg className="w-8 h-8 text-[#0B4D26]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    }
  ];

  return (
    <div className="py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B4D26] mb-4 font-bengali">
            {t('home.core_pillars.subtitle') || "Core Pillars"}
          </h2>
          <div className="w-20 h-1.5 bg-[#EAB308] mx-auto rounded-full"></div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar) => (
            <div 
              key={pillar.key} 
              className="
                flex flex-col items-center text-center p-8 rounded-2xl 
                bg-[#F3FDF7]              /* PERMANENT: Light Mint Green */
                hover:bg-[#E5F7EB]        /* HOVER: Deeper Mint Green */
                border border-green-100 
                transition-all duration-300 
                group shadow-sm hover:shadow-md
              "
            >
              {/* Icon Circle - Now White to pop against the green card */}
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {pillar.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-bengali">
                {t(`home.core_pillars.${pillar.key}_title`)}
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-justify md:text-center text-sm md:text-base">
                {t(`home.core_pillars.${pillar.key}_desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* 'Know More' Button */}
        <div className="flex justify-center">
          <Link 
            to="/about-us" 
            className="
              inline-flex items-center gap-2 
              px-8 py-3 
              border-2 border-[#0B4D26] 
              rounded-lg 
              text-[#0B4D26] font-bold text-lg 
              hover:bg-[#0B4D26] hover:text-white 
              transition-all duration-300
              shadow-sm hover:shadow-md
            "
          >
            <span>{t('home.core_pillars.know_more') || "Know More"}</span>
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CorePillars;