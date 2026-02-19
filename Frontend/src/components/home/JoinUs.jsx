import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const JoinUs = () => {
  const { t } = useTranslation();

  return (
    // Changed background to bg-gray-50 (Light Gray) to match other sections
    <div className="py-20 bg-gray-50 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Header - Text color changed to gray-900 (Dark) */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('join_us.title')}
        </h2>
        <div className="w-24 h-1 bg-[#EAB308] mx-auto mb-6 rounded-full"></div>
        
        {/* Description - Text color changed to gray-600 */}
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
          {t('join_us.desc')}
        </p>

        {/* Volunteer Card - Changed to White Background with Shadow */}
        <div className="flex justify-center">
          <Link 
            to="/connect" 
            className="group bg-white border border-gray-200 rounded-xl p-10 w-full max-w-md shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            {/* Icon Circle - Kept the Green background */}
            <div className="w-24 h-24 bg-[#0B4D26] rounded-full flex items-center justify-center mx-auto mb-6 shadow-md group-hover:bg-[#EAB308] transition-colors duration-300">
              <svg 
                className="w-12 h-12 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>

            {/* Card Text - Dark Green for Title */}
            <h3 className="text-2xl font-bold mb-3 text-[#0B4D26] group-hover:text-gray-900 transition-colors">
              {t('join_us.volunteer_title')}
            </h3>
            
            {/* Action Text - Gray to Green on hover */}
            <span className="text-gray-500 font-semibold group-hover:text-[#0B4D26] flex items-center justify-center gap-2 mt-2 transition-colors">
              {t('join_us.volunteer_btn')} 
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default JoinUs;