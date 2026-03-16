import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { activityService } from "../services/activityService";
import { sanitizeHtml } from "../utils/sanitize";

const ActivityDetails = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for the Fullscreen Image Modal (Lightbox)
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const response = await activityService.getActivityBySlug(slug);
        setActivity(response.data?.activity || response.data || response);
      } catch (error) {
        console.error("Failed to fetch activity details");
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [slug]);

  // Helper to convert standard YouTube links to Embed links
  const getEmbedUrl = (url) => {
    if (!url) return null;
    let embedUrl = url;
    if (url.includes("watch?v=")) {
      embedUrl = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      embedUrl = url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return embedUrl.split("&")[0]; // Remove extra URL parameters just in case
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-xl font-medium text-gray-500">
          {t("activities_page.loading")}
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t("activities_page.no_data")}
        </h2>
        <Link
          to="/activities"
          className="text-[#0B4D26] hover:underline font-medium"
        >
          {t("details_page.back")}
        </Link>
      </div>
    );
  }

  const title = activity.title || "No Title";
  const mainImage =
    Array.isArray(activity.pictures_link_list) &&
    activity.pictures_link_list.length > 0
      ? activity.pictures_link_list[0]
      : "https://via.placeholder.com/800x400?text=No+Image";
  const galleryImages = Array.isArray(activity.pictures_link_list)
    ? activity.pictures_link_list.slice(1)
    : [];

  const dateOptions = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = activity.createdAt
    ? new Date(activity.createdAt).toLocaleDateString(
        lang === "bn" ? "bn-BD" : "en-US",
        dateOptions,
      )
    : "";

  return (
    <>
      <div className="w-full bg-gray-50 min-h-screen pb-20 pt-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/activities"
            className="inline-block mb-6 text-[#0B4D26] font-semibold hover:text-green-800 transition-colors"
          >
            {t("details_page.back")}
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="w-full h-64 sm:h-96 overflow-hidden bg-gray-100">
              <img
                src={mainImage}
                alt={title}
                className="w-full h-full object-contain bg-gray-50"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x400?text=Image+Error";
                }}
              />
            </div>

            <div className="p-6 sm:p-10 flex flex-col gap-8">
              <div>
                <div className="flex flex-wrap gap-4 mb-4">
                  {formattedDate && (
                    <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                      {formattedDate}
                    </span>
                  )}
                  {activity.project_area && (
                    <span className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                      {t("details_page.area")} {activity.project_area}
                    </span>
                  )}
                  {activity.duration && (
                    <span className="text-sm font-medium text-orange-700 bg-orange-50 px-3 py-1 rounded-full">
                      {t("details_page.duration")} {activity.duration}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
                  {title}
                </h1>
              </div>

              {Array.isArray(activity.description) &&
                activity.description.length > 0 && (
                  <div className="space-y-4 text-gray-700 text-lg leading-relaxed text-justify">
                    {activity.description.map((para, index) => (
                      <div
                        key={index}
                        className="prose prose-lg max-w-none prose-a:text-[#0B4D26] prose-a:hover:underline"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(para),
                        }}
                      />
                    ))}
                  </div>
                )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 border-t border-gray-100 pt-8">
                {Array.isArray(activity.project_goals) &&
                  activity.project_goals.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-[#0B4D26] mb-4 flex items-center gap-2">
                        <span className="bg-green-100 p-2 rounded-lg">🎯</span>
                        {t("details_page.goals")}
                      </h3>
                      <ul className="space-y-2">
                        {activity.project_goals.map((goal, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-700"
                          >
                            <span className="text-green-600 font-bold mt-1">
                              ✓
                            </span>
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {Array.isArray(activity.expense_categories) &&
                  activity.expense_categories.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-bold text-[#0B4D26] mb-4 flex items-center gap-2">
                        <span className="bg-green-100 p-2 rounded-lg">💰</span>
                        {t("details_page.expenses")}
                      </h3>
                      <ul className="space-y-2">
                        {activity.expense_categories.map((expense, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-gray-700"
                          >
                            <span className="text-green-600 font-bold mt-1">
                              ✓
                            </span>
                            <span>{expense}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {Array.isArray(activity.beneficiaries) &&
                  activity.beneficiaries.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-xl md:col-span-2">
                      <h3 className="text-xl font-bold text-[#0B4D26] mb-4 flex items-center gap-2">
                        <span className="bg-green-100 p-2 rounded-lg">👥</span>
                        {t("details_page.beneficiaries")}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {activity.beneficiaries.map((ben, index) => (
                          <span
                            key={index}
                            className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 shadow-sm"
                          >
                            {ben}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Embedded YouTube Video Section */}
              {activity.video_link && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {t("details_page.watch_video")}
                  </h3>
                  <div
                    className="relative w-full overflow-hidden rounded-xl bg-black shadow-md"
                    style={{ paddingTop: "56.25%" }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={getEmbedUrl(activity.video_link)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Interactive Gallery Section */}
              {galleryImages.length > 0 && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    {t("details_page.gallery")}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {galleryImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative h-32 sm:h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm cursor-pointer group"
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Hover Overlay with Eye Icon */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <svg
                            className="text-white w-10 h-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal (Lightbox) */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex justify-center items-center p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={() => setSelectedImage(null)}
          >
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <img
            src={selectedImage}
            alt="Fullscreen View"
            className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevents the modal from closing if they click the image itself
          />
        </div>
      )}
    </>
  );
};

export default ActivityDetails;
