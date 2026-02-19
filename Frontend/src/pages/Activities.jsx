import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ActivityCard from '../components/common/ActivityCard';
import { activityService } from '../services/activityService';

const Activities = () => {
  const { t } = useTranslation();
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const response = await activityService.getAllActivities(page, 9);
        
        if (response.success) {
          // আপনার API এর স্ট্রাকচার অনুযায়ী ডেটা সেট করা হলো
          setActivities(response.data.activities);
          
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.pages || 1);
          }
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [page]);

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      {/* Top Banner & Breadcrumb */}
      <div className="bg-[#0B4D26] py-16 px-4 sm:px-6 lg:px-8 text-center mt-16 sm:mt-20">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {t('activities_page.title')}
        </h1>
        <p className="text-green-100 font-medium">
          <Link to="/" className="hover:text-white transition-colors">{t('menu.home')}</Link> 
          <span className="mx-2">/</span> 
          {t('menu.activities')}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="text-center py-20 text-xl font-medium text-gray-500">
            {t('activities_page.loading')}
          </div>
        ) : activities && activities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity) => (
                <ActivityCard key={activity._id} activity={activity} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-12 gap-4">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {t('activities_page.prev')}
              </button>
              <span className="text-gray-600 font-medium">
                {page} / {totalPages}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-6 py-2 border border-[#0B4D26] rounded-md font-medium text-white bg-[#0B4D26] hover:bg-green-800 disabled:opacity-50 transition-colors"
              >
                {t('activities_page.next')}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-xl font-medium text-gray-500">
            {t('activities_page.no_data')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;