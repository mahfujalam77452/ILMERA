import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { blogService } from "../services/blogService";
import { sanitizeHtml } from "../utils/sanitize";
import Lightbox from "../components/gallery/Lightbox";

const BlogDetails = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // 1. Try to get blog from router state (Instant Load)
  const [blog, setBlog] = useState(location.state?.blog || null);
  const [loading, setLoading] = useState(!location.state?.blog);

  // Lightbox State
  const [selectedImage, setSelectedImage] = useState(null);

  // 2. Fallback: If no state (direct link/refresh), fetch from API
  useEffect(() => {
    if (!blog) {
      const fetchBlog = async () => {
        try {
          // We need this API call only if user refreshes the page
          const res = await blogService.getBlogBySlug(slug);
          // Assuming API returns { success: true, data: { blog: {} } } or similar
          // Adjust based on your specific single-blog API response structure
          const blogData = res.data?.blog || res.data || res;
          setBlog(blogData);
        } catch (error) {
          console.error("Failed to fetch blog details", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [slug, blog]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        {t("blogs_page.loading")}
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {t("blogs_page.no_data")}
      </div>
    );
  }

  // Formatting
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString(
        lang === "bn" ? "bn-BD" : "en-US",
        dateOptions,
      )
    : "";

  const images = blog.pictures_link_list || [];

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-20 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/blogs" className="hover:text-[#0B4D26]">
            {t("blogs_page.breadcrumb").split("/")[1].trim()}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate max-w-[200px]">
            {blog.title}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Main Hero Image */}
          {images.length > 0 && (
            <div className="w-full h-64 sm:h-96 overflow-hidden bg-gray-100 relative">
              <img
                src={images[0]}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x400?text=Image+Error";
                }}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 sm:p-8">
                <span className="text-white bg-[#0B4D26] px-3 py-1 rounded text-sm font-bold shadow-sm">
                  {formattedDate}
                </span>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-10">
            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight mb-8">
              {blog.title}
            </h1>

            {/* Description (Array of paragraphs) */}
            <div
              className="prose prose-lg max-w-none text-gray-700 text-justify leading-relaxed mb-10"
              style={{
                "--tw-prose-links": "#0B4D26",
              }}
            >
              {Array.isArray(blog.description) ? (
                blog.description.map((para, idx) => (
                  <div
                    key={idx}
                    className="mb-4 prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(para),
                    }}
                    style={{
                      "--tw-prose-links": "#0B4D26",
                    }}
                  />
                ))
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(blog.description),
                  }}
                  style={{
                    "--tw-prose-links": "#0B4D26",
                  }}
                />
              )}
              <style>{`
                .prose a {
                  color: #0B4D26;
                  text-decoration: underline;
                  cursor: pointer;
                  transition: color 0.2s;
                }
                .prose a:hover {
                  color: #094620;
                  text-decoration: none;
                }
              `}</style>
            </div>

            {/* Apply Now Button - Optional */}
            {blog.apply_link && (
              <div className="mb-10 pb-6 border-b border-gray-200">
                <a
                  href={blog.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#0B4D26] hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md"
                >
                  Apply Now
                </a>
              </div>
            )}

            {/* Additional Images Gallery */}
            {images.length > 1 && (
              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {t("details_page.gallery")}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.slice(1).map((img, index) => (
                    <div
                      key={index}
                      className="h-32 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reused Lightbox */}
      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default BlogDetails;
