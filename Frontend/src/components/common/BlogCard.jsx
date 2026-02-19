import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const imageUrl = Array.isArray(blog.pictures_link_list) && blog.pictures_link_list.length > 0
    ? blog.pictures_link_list[0]
    : 'https://via.placeholder.com/400x250?text=No+Image';

  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = blog.date 
    ? new Date(blog.date).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', dateOptions)
    : '';

  const description = Array.isArray(blog.description) && blog.description.length > 0
    ? blog.description[0]
    : (typeof blog.description === 'string' ? blog.description : '');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full w-full group">
      
      <div className="h-56 w-full overflow-hidden bg-gray-100 relative">
        <img 
          src={imageUrl} 
          alt={blog.title} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=Image+Error' }}
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-gray-700 shadow-sm">
          {formattedDate}
        </div>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-[#0B4D26] transition-colors">
          {/* OPTIMIZATION: Pass the full 'blog' object in state */}
          <Link to={`/blogs/${blog._id}`} state={{ blog: blog }}>
            {blog.title}
          </Link>
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow text-justify">
          {description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link 
            to={`/blogs/${blog._id}`} 
            state={{ blog: blog }} // <--- Passing data here too
            className="text-[#0B4D26] font-bold text-sm hover:underline inline-flex items-center gap-1"
          >
            {t('blogs_page.read_more')}
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;