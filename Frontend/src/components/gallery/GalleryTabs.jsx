import { useTranslation } from 'react-i18next';

const GalleryTabs = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center mb-12">
      <div className="bg-white p-1 rounded-full shadow-sm border border-gray-200 flex">
        <button
          onClick={() => setActiveTab('picture')}
          className={`px-8 py-2 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
            activeTab === 'picture' 
              ? 'bg-green-100 text-[#0B4D26]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('gallery_page.tab_picture')}
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`px-8 py-2 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
            activeTab === 'video' 
              ? 'bg-green-100 text-[#0B4D26]' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('gallery_page.tab_video')}
        </button>
      </div>
    </div>
  );
};

export default GalleryTabs;