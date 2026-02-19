import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { galleryService } from '../../services/galleryService';
import Lightbox from '../gallery/Lightbox';

const HomeGallery = () => {
  const { t } = useTranslation();
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchHomePictures = async () => {
      try {
        // Fetch only 6 latest items for the home page (2 rows of 3)
        const res = await galleryService.getPictures(1, 6, null);
        if (res.success) {
          setPictures(res.data.pictures || []);
        }
      } catch (error) {
        console.error("Error fetching home gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePictures();
  }, []);

  if (loading) return null; 
  if (pictures.length === 0) return null;

  return (
    <div className="py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {t('home_gallery.title')}
          </h2>
          <div className="w-24 h-1 bg-[#EAB308] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Gallery Grid (3 columns on desktop for a 3x2 layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pictures.map((pic) => (
            <div 
              key={pic._id} 
              className="group relative h-64 overflow-hidden rounded-xl cursor-pointer bg-gray-100 shadow-sm border border-gray-200"
              onClick={() => setSelectedImage(pic.picture_link)}
            >
              <img 
                src={pic.picture_link} 
                alt="Gallery" 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image' }}
              />
              
              {/* Dark Overlay with Eye Icon on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* "View All" Button - Outline Style */}
        <div className="mt-12 flex justify-center">
          <Link 
            to="/gallery" 
            className="text-[#0B4D26] font-bold border-2 border-[#0B4D26] px-8 py-3 rounded-md hover:bg-[#0B4D26] hover:text-white transition-colors flex items-center gap-2"
          >
            {t('home_gallery.view_all')}
            <span className="font-bold">→</span>
          </Link>
        </div>

      </div>

      {/* Fullscreen Lightbox */}
      <Lightbox 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
};

export default HomeGallery;