import { useTranslation } from 'react-i18next';

const Principles = () => {
  const { t } = useTranslation();
  const principles = t('about_page.principles_list', { returnObjects: true });

  return (
    <div className="bg-[#EFF6F3] rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0B4D26] mb-10 font-bengali">
        {t('about_page.principles_title')}
      </h2>
      
      <div className="space-y-4">
        {Array.isArray(principles) && principles.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#0B4D26] flex items-center justify-center">
               <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed font-medium">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Principles;