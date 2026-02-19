import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png'; 
import facebook from '../assets/facebook.png'; // <-- Facebook icon
import youtube from '../assets/youtube.png';   // <-- YouTube icon
import linkedin from '../assets/linkedin.png'; // <-- LinkedIn icon
import tiktok from '../assets/tiktok.png';   // <-- TikTok icon

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0B4D26] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Column 1: Logo & Description */}
          <div className="space-y-4 lg:col-span-5 lg:pr-12">
            <div className="bg-white inline-block px-3 py-2 rounded-md">
               <img src={logo} alt="As-Sunnah Foundation" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed text-justify">
              {t('footer.description')}
            </p>
            
            {/* Social Icons imported from assets */}
            <div className="flex space-x-4 pt-4">
              <a href="https://www.facebook.com/ilmeraresearchfoundatoin" className="hover:opacity-75 transition-opacity">
                <img src={facebook} alt="Facebook" className="h-5 w-8 object-contain" />
              </a>
              <a href="https://www.youtube.com/@Ilmerafoundation" className="hover:opacity-75 transition-opacity">
                <img src={youtube} alt="YouTube" className="h-6 w-6 object-contain" />
              </a>
              <a href="https://www.linkedin.com/in/ilmera-education-research-foundation/" className="hover:opacity-75 transition-opacity">
                <img src={linkedin} alt="LinkedIn" className="h-6 w-6 object-contain" />
              </a>
              <a href="https://www.tiktok.com/@ilmerafoundation?_r=1&_t=ZS-93sal8hp8bc" className="hover:opacity-75 transition-opacity">
                <img src={tiktok} alt="TikTok" className="h-6 w-6 object-contain" />
              </a>
            </div>
          </div>

          {/* Column 2: Menu */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">{t('footer.menu_title')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/current-project" className="hover:text-white transition-colors">{t('menu.current_project')}</Link></li>
              <li><Link to="/about-us" className="hover:text-white transition-colors">{t('menu.about')}</Link></li>
              <li><Link to="/activities" className="hover:text-white transition-colors">{t('footer.projects')}</Link></li>
              <li><Link to="/blogs" className="hover:text-white transition-colors">{t('menu.blogs')}</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">{t('menu.gallery')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Connect */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">{t('footer.connect_title')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/connect" className="hover:text-white transition-colors">{t('footer.volunteer')}</Link></li>
            </ul>
          </div>

          {/* Column 4: Others */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">{t('footer.others_title')}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('menu.contact')}</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-green-800 pt-6 mt-6 text-center text-xs text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;