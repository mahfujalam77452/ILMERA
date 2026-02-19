import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // Import Link for breadcrumbs

const AboutHero = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-[#0B4D26] w-full py-12 md:py-16 flex flex-col items-center justify-center text-center px-4">
      
      {/* Main Title - Font size minimized as requested */}
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide font-bengali mb-4">
        {t('about_page.hero_title')}
      </h1>

      {/* Breadcrumb Navigation (Matches the style of your 'Activities' image) */}
      <div className="flex items-center gap-2 text-sm md:text-base font-medium">
        <Link to="/" className="text-green-100 hover:text-white transition-colors">
          {t('menu.home') || "Home"}
        </Link>
        <span className="text-green-300">/</span>
        <span className="text-[#EAB308]">
          {t('about_page.hero_title')}
        </span>
      </div>

    </div>
  );
};

export default AboutHero;