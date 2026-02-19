import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { galleryService } from '../services/galleryService';

// Import Components
import GalleryTabs from '../components/gallery/GalleryTabs';
import GallerySidebar from '../components/gallery/GallerySidebar';
import PictureGrid from '../components/gallery/PictureGrid';
import VideoGrid from '../components/gallery/VideoGrid';
import Lightbox from '../components/gallery/Lightbox';

const Gallery = () => {
  const { t } = useTranslation();

  // State
  const [activeTab, setActiveTab] = useState('picture');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pictures, setPictures] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await galleryService.getCategories();
        if (res.success) {
          // Based on your JSON: { data: { data: [...] } }
          setCategories(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Pictures (No pagination UI, just fetch a large batch)
  useEffect(() => {
    const fetchPictures = async () => {
      setLoading(true);
      try {
        const catId = selectedCategory === 'all' ? null : selectedCategory;
        
        // Fetching 100 items to handle vertical overflow without pagination buttons
        const res = await galleryService.getPictures(1, 100, catId);
        
        if (res.success) {
          // Based on your JSON: { data: { pictures: [...] } }
          setPictures(res.data.pictures || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'picture') {
      fetchPictures();
    }
  }, [activeTab, selectedCategory]);


useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        
        
        
        const res = await galleryService.getVideos(1, 100);
        
        if (res.success) {
          // Based on your JSON: { data: { videos: [...] } }
          setVideos(res.data.videos || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab !== 'picture') {
      fetchVideos();
    }
  }, [ activeTab]);

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      
      {/* Banner */}
      <div className="bg-[#0B4D26] py-16 px-4 sm:px-6 lg:px-8 text-center mt-16 sm:mt-20">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {t('gallery_page.title')}
        </h1>
        <p className="text-green-100 font-medium">
          <Link to="/" className="hover:text-white transition-colors">{t('menu.home')}</Link> 
          <span className="mx-2">/</span> 
          {t('gallery_page.title')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        <GalleryTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          {activeTab === 'picture' && (
            <GallerySidebar 
              categories={categories} 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
            />
          )}

          {/* Main Content */}
          <div className={`w-full ${activeTab === 'picture' ? 'lg:w-3/4' : 'lg:w-full'}`}>
            {activeTab === 'picture' ? (
              <PictureGrid 
                pictures={pictures} 
                loading={loading} 
                onImageClick={setSelectedImage} 
              />
            ) : (
              <VideoGrid videos={videos} />
            )}
          </div>
        </div>
      </div>

      <Lightbox 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />

    </div>
  );
};

export default Gallery;