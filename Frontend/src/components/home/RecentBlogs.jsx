import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import BlogCard from '../common/BlogCard';

const RecentBlogs = () => {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        // Fetch only the latest 3 blogs for the home page layout
        const res = await blogService.getBlogs(1, 3);
        if (res.success) {
          setBlogs(res.data.blogs || []);
        }
      } catch (error) {
        console.error("Error fetching recent blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBlogs();
  }, []);

  if (loading) return null;
  if (blogs.length === 0) return null;

  return (
    <div className="py-20 bg-gray-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {t('home_blog.title')}
          </h2>
          <div className="w-24 h-1 bg-[#EAB308] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Grid: 3 columns for 3 items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

        {/* "View All" Button - Outline Style */}
        <div className="mt-12 flex justify-center">
          <Link 
            to="/blogs" 
            className="text-[#0B4D26] font-bold border-2 border-[#0B4D26] px-8 py-3 rounded-md hover:bg-[#0B4D26] hover:text-white transition-colors flex items-center gap-2"
          >
            {t('home_blog.view_all')}
            <span className="font-bold">→</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RecentBlogs;