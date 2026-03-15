import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppeals } from "../../context/AppealsContext"; // Adjust path based on your folder structure

const HeroSlider = () => {
  const { t } = useTranslation();
  const { appeals, loading } = useAppeals();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-slide logic (Runs every 5 seconds)
  useEffect(() => {
    if (!appeals || appeals.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, appeals]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === appeals.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? appeals.length - 1 : prevIndex - 1,
    );
  };

  const handleDonateClick = (appealName) => {
    // Navigate to donation page with the appeal pre-selected
    navigate("/make-donation", { state: { category: appealName } });
  };

  if (loading)
    return <div className="h-[500px] bg-gray-100 animate-pulse"></div>;
  if (!appeals || appeals.length === 0) return null;

  const currentAppeal = appeals[currentIndex];

  return (
    <div className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden group">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out transform"
        style={{ backgroundImage: `url(${currentAppeal.image})` }}
      >
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 flex items-end md:items-center justify-start max-w-7xl mx-auto px-6 pb-16 md:pb-0">
        <div className="text-white max-w-2xl animate-fade-in-up">
          {/* Static Tagline (from your image example) */}
          <h2 className="text-3xl md:text-6xl font-serif font-bold mb-2 leading-tight drop-shadow-lg">
            Be the <br />
            <span className="text-[#4ADE80] italic">Blessing</span> for all
          </h2>

          {/* Dynamic Appeal Name */}
          <h3 className="text-xl md:text-3xl font-bold mb-6 text-yellow-400 drop-shadow-md">
            {currentAppeal.appeal}
          </h3>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => handleDonateClick(currentAppeal.appeal)}
              className="bg-[#EAB308] hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              Donate Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <Link
              to={`/appeals/${currentAppeal.slug}`}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white text-white font-bold py-3 px-8 rounded-full transition-all"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#0B4D26] text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-[#0B4D26] text-white p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide Indicators (Dots at bottom) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {appeals.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-[#EAB308] w-8"
                : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
