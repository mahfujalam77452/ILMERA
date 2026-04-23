import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ActivityCard from '../common/ActivityCard';
import { activityService } from '../../services/activityService';

const OngoingActivities = () => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestActivities = async () => {
      try {
        const response = await activityService.getAllActivities(1, 6);
        if (response.success) {
          setActivities(response.data?.activities || []);
        }
      } catch (error) {
        console.error("Error fetching ongoing activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestActivities();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-500 font-medium">
        {t('activities_page.loading')}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return null; 
  }

  return (
    <div className="py-20 bg-gray-50 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header moved to Top-Middle */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('home.ongoing_activities.title')}
          </h2>
          <div className="w-24 h-1 bg-[#EAB308] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Swiper Slider Wrapper */}
        <div className="relative px-2 sm:px-12">
          
          {/* Custom CSS for smaller gray circles and smaller arrows */}
          <style>
            {`
              .swiper-button-next, .swiper-button-prev {
                background-color: #f3f4f6 !important; /* Light Gray Circle */
                width: 36px !important; /* Slightly smaller circle */
                height: 36px !important;
                border-radius: 50% !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                color: #0B4D26 !important; /* Dark Green Arrow */
                margin-top: -18px !important;
                transition: all 0.3s ease !important;
              }
              .swiper-button-next:hover, .swiper-button-prev:hover {
                background-color: #e5e7eb !important; /* Slightly darker gray on hover */
              }
              .swiper-button-next:after, .swiper-button-prev:after {
                font-size: 12px !important; /* Much smaller arrow icon */
                font-weight: 900 !important;
              }
              .swiper-button-prev { left: 0px !important; }
              .swiper-button-next { right: 0px !important; }
            `}
          </style>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16 pt-4" 
          >
            {activities.map((activity) => (
              <SwiperSlide key={activity._id} className="h-auto">
                <ActivityCard activity={activity} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* "All Activities" Button moved to Bottom-Middle */}
        <div className="mt-8 flex justify-center">
          <Link 
            to="/activities" 
            className="text-[#0B4D26] font-bold border-2 border-[#0B4D26] px-8 py-3 rounded-md hover:bg-[#0B4D26] hover:text-white transition-colors flex items-center gap-2"
          >
            {t('home.ongoing_activities.view_all')}
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default OngoingActivities;