import { useTranslation } from 'react-i18next';

const GallerySidebar = ({ categories, selectedCategory, setSelectedCategory }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full lg:w-1/4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24 max-h-[80vh] overflow-y-auto custom-scrollbar">
        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
          {t('gallery_page.filter_all')}
        </h3>
        <ul className="space-y-2">
          {/* 'All' Option */}
          <li>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#0B4D26] text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t('gallery_page.filter_all')}
            </button>
          </li>
          
          {/* Categories from API */}
          {categories.map((cat) => (
            <li key={cat._id}>
              <button
                onClick={() => setSelectedCategory(cat._id)}
                className={`w-full text-left px-4 py-2 rounded-md transition-colors cursor-pointer ${
                  selectedCategory === cat._id
                    ? 'bg-[#0B4D26] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {/* Your API returns the name in a field called 'category' */}
                {cat.category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GallerySidebar;