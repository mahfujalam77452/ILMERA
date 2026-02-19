import { useTranslation } from 'react-i18next';

const PictureGrid = ({ pictures, loading, onImageClick }) => {
  const { t } = useTranslation();

  if (loading) {
    return <div className="text-center py-20 text-gray-500 font-medium">{t('gallery_page.loading')}</div>;
  }

  if (!pictures || pictures.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-gray-200 text-gray-500">
        {t('gallery_page.no_images')}
      </div>
    );
  }

  return (
    // Grid handles vertical overflow automatically
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
      {pictures.map((pic) => (
        <div 
          key={pic._id} 
          className="group relative h-64 rounded-xl overflow-hidden shadow-sm cursor-pointer border border-gray-200 bg-gray-100"
          onClick={() => onImageClick(pic.picture_link)}
        >
          {/* Using 'picture_link' from your API */}
          <img 
            src={pic.picture_link} 
            alt={pic.category?.category || "Gallery Image"} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>

          {/* Category Badge */}
          {pic.category?.category && (
            <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              {pic.category.category}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default PictureGrid;