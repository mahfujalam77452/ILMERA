import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import DonationFundCard from '../common/DonationFundCard';
import { donationFunds } from '../../data/donationFunds';

const DonationFunds = () => {
  const { t } = useTranslation();

  return (
    <div className="py-20 bg-white w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {t('donation_page.title')}
          </h2>
          <div className="w-24 h-1 bg-[#EAB308] mx-auto mt-2 mb-3 rounded-full"></div>
          <p className="text-gray-600 text-lg">
            {t('donation_page.subtitle')}
          </p>
          
        </div>

        {/* Swiper Slider Wrapper */}
        <div className="relative px-2 sm:px-12">
          
          {/* Custom Styles for Arrows */}
          <style>
            {`
              .swiper-button-next, .swiper-button-prev {
                background-color: #f3f4f6 !important;
                width: 36px !important;
                height: 36px !important;
                border-radius: 50% !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                color: #0B4D26 !important;
                margin-top: -18px !important;
                transition: all 0.3s ease !important;
              }
              .swiper-button-next:hover, .swiper-button-prev:hover {
                background-color: #e5e7eb !important;
              }
              .swiper-button-next:after, .swiper-button-prev:after {
                font-size: 12px !important;
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
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16 pt-4" 
          >
            {donationFunds.map((fund) => (
              <SwiperSlide key={fund.id} className="h-auto">
                <DonationFundCard fund={fund} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* "All Funds" Button - Updated to Outline Style */}
        <div className="mt-8 flex justify-center">
          <Link 
            to="/donation" 
            className="text-[#0B4D26] font-bold border-2 border-[#0B4D26] px-8 py-3 rounded-md hover:bg-[#0B4D26] hover:text-white transition-colors flex items-center gap-2"
          >
            {t('home.ongoing_activities.view_all').replace('Activities', 'Funds').replace('কার্যক্রম', 'ফান্ড')}
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default DonationFunds;