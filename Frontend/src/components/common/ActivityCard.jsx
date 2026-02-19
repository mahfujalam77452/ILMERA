import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ActivityCard = ({ activity }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const imageUrl = Array.isArray(activity.pictures_link_list) && activity.pictures_link_list.length > 0 
    ? activity.pictures_link_list[0] 
    : 'https://via.placeholder.com/400x300?text=No+Image';

  const title = activity.title || 'No Title';
  const description = activity.summary || (Array.isArray(activity.description) ? activity.description[0] : 'No Description');

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = activity.createdAt 
    ? new Date(activity.createdAt).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', dateOptions)
    : '';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full max-w-[350px] mx-auto w-full">
      
      <div className="h-48 w-full overflow-hidden bg-gray-50 flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error' }}
        />
      </div>

      <div className="p-5 flex-grow flex flex-col">
        {formattedDate && (
          <span className="text-xs font-medium text-green-700 mb-3 bg-green-50 inline-block px-3 py-1 rounded-full w-max">
            {formattedDate}
          </span>
        )}
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate" title={title}>
          {title}
        </h3>
        
        {/* Added 'mb-8' here to create more space between the description and the Read More button */}
        <p className="text-sm text-gray-600 mb-8 line-clamp-2 flex-grow text-justify">
          {description}
        </p>
        
        <div className="mt-auto">
          <Link 
            to={`/activities/${activity._id}`} 
            className="text-[#0B4D26] text-sm font-bold hover:text-green-700 transition-colors inline-flex items-center gap-1"
          >
            {t('activities_page.read_more')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;