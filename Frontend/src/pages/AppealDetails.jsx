import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { appealService } from "../services/appealService";
import { sanitizeHtml } from "../utils/sanitize";
import DonationForm from "../components/donation/DonationForm"; // Adjust path if needed

const AppealDetails = () => {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const [appealData, setAppealData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to get text based on current language
  const getLangContent = (contentObj) => {
    const lang = i18n.language || "en";
    return contentObj?.[lang] || contentObj?.["en"] || "";
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await appealService.getAppealBySlug(slug);
        setAppealData(data);
      } catch (error) {
        console.error("Error fetching appeal details", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchDetails();
  }, [slug]);

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-bold text-gray-500">
        Loading...
      </div>
    );
  if (!appealData)
    return (
      <div className="text-center py-20 text-xl font-bold text-red-500">
        Appeal not found
      </div>
    );

  return (
    <div className="w-full pt-20">
      {/* 1. HERO SECTION (Green Banner) */}
      <div className="bg-[#0B4D26] w-full py-16 md:py-24 flex flex-col items-center justify-center text-white mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide">
          Appeals
        </h1>
        <div className="flex items-center space-x-2 text-sm md:text-base opacity-90">
          <Link to="/" className="hover:text-yellow-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-yellow-400">Appeals</span>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {/* 2. LARGE IMAGE */}
        {/* I increased max-height to 650px to make it "more big" as requested */}
        <div className="w-full mb-12 rounded-2xl overflow-hidden shadow-xl bg-gray-50 border border-gray-100 flex justify-center items-center">
          <img
            src={appealData.image}
            alt={appealData.appeal}
            className="w-auto h-auto max-w-full max-h-[650px] object-contain block"
          />
        </div>

        {/* 3. DONATION FORM */}
        <div className="mb-16">
          <div className="bg-white p-2 rounded-xl">
            <DonationForm initialData={{ category: appealData.appeal }} />
          </div>
        </div>

        {/* 4. TITLE & CONTENT SECTIONS */}
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-[#0B4D26] mb-8 text-center leading-tight">
            {getLangContent(appealData.title)}
          </h1>

          {/* Sections Loop */}
          <div className="space-y-8 text-gray-700 leading-relaxed text-lg md:text-xl">
            {appealData.sections
              ?.sort((a, b) => a.order - b.order)
              .map((section) => {
                const content = getLangContent(section.content);

                switch (section.type) {
                  case "heading":
                    return (
                      <h2
                        key={section._id}
                        className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(content),
                        }}
                      />
                    );

                  case "highlight":
                    return (
                      <div
                        key={section._id}
                        className="bg-[#0B4D26]/5 border-l-4 border-[#0B4D26] p-6 italic text-gray-800 my-8 rounded-r-lg prose prose-sm max-w-none prose-a:text-[#0B4D26] prose-a:hover:underline"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(content),
                        }}
                      />
                    );

                  case "paragraph":
                  default:
                    return (
                      <div
                        key={section._id}
                        className="mb-4 text-justify prose prose-lg max-w-none prose-a:text-[#0B4D26] prose-a:hover:underline"
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(content),
                        }}
                      />
                    );
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppealDetails;
