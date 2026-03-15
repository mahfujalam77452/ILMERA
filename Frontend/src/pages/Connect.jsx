import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import VolunteerForm from '../components/connect/VolunteerForm';

const Connect = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20 pt-20">
      
      {/* Banner */}
      <div className="bg-[#0B4D26] py-16 px-4 text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {t('join_us.volunteer_title')}
        </h1>
        <p className="text-green-100 font-medium text-lg mb-2">
          {t('connect_page.subtitle')}
        </p>
        <p className="text-green-200 text-sm">
          <Link to="/" className="hover:text-white transition-colors">{t('menu.home')}</Link> / {t('connect_page.title')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <VolunteerForm />
      </div>

    </div>
  );
};

export default Connect;