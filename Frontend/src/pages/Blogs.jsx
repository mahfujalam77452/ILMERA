import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import BlogCard from '../components/common/BlogCard';

const Blogs = () => {
  const { t } = useTranslation();
  
  // State
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 9,
    total: 0,
    pages: 1
  });

  const fetchBlogs = async (page) => {
    setLoading(true);
    try {
      const res = await blogService.getBlogs(page, pagination.limit);
      if (res.success) {
        setBlogs(res.data.blogs || []);
        setPagination(res.data.pagination);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Failed to load blogs", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchBlogs(1);
  }, []);

  // Handle Page Change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchBlogs(newPage);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20">
      
      {/* Banner */}
      <div className="bg-[#0B4D26] py-16 px-4 sm:px-6 lg:px-8 text-center mt-16 sm:mt-20">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          {t('blogs_page.title')}
        </h1>
        <p className="text-green-100 font-medium">
          <Link to="/" className="hover:text-white transition-colors">{t('menu.home')}</Link> 
          <span className="mx-2">/</span> 
          {t('blogs_page.title')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-xl text-gray-500">{t('blogs_page.loading')}</div>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500">{t('blogs_page.no_data')}</p>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && pagination.pages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className={`px-4 py-2 rounded-md font-bold border ${
                pagination.current === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-[#0B4D26] border-[#0B4D26] hover:bg-[#0B4D26] hover:text-white transition-colors'
              }`}
            >
              ←
            </button>

            {/* Page Numbers */}
            {[...Array(pagination.pages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-md font-bold border transition-colors ${
                    pagination.current === pageNum
                      ? 'bg-[#0B4D26] text-white border-[#0B4D26]'
                      : 'bg-white text-[#0B4D26] border-[#0B4D26] hover:bg-[#0B4D26] hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={pagination.current === pagination.pages}
              className={`px-4 py-2 rounded-md font-bold border ${
                pagination.current === pagination.pages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-[#0B4D26] border-[#0B4D26] hover:bg-[#0B4D26] hover:text-white transition-colors'
              }`}
            >
              →
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default Blogs;