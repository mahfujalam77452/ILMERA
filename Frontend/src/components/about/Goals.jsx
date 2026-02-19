import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Goals = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('education');

  const tabs = [
    { id: 'education', icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
    )},
    { id: 'dawah', icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { id: 'service', icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    )},
  ];

  const currentList = t(`about_page.goals.${activeTab}`, { returnObjects: true }) || [];

  return (
    <div className="bg-white rounded-2xl p-4 md:p-8 mt-12 border border-gray-100 shadow-sm">
      {/* Title updated for better mobile scaling */}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#0B4D26] mb-6 md:mb-8 font-bengali">
        {t('about_page.goals_title')}
      </h2>

      {/* Tabs Header */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            // Updated classes: responsive padding, font-size, and gap
            className={`flex cursor-pointer items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-300 shadow-sm ${
              activeTab === tab.id 
                ? "bg-[#9ACD32] text-[#0B4D26] scale-105 ring-2 ring-[#0B4D26]" 
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {t(`about_page.tabs.${tab.id}`)}
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 min-h-[300px]">
        <div className="space-y-4 animate-fadeIn">
          {Array.isArray(currentList) && currentList.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
               {/* Checkmark Icon Container */}
               <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#0B4D26] flex items-center justify-center">
                 <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                 </svg>
              </div>
              {/* Text updated: text-base for mobile, text-lg for desktop */}
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Goals;