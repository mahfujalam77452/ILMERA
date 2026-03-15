import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";
import { useAppeals } from "../context/AppealsContext";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { appeals } = useAppeals();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAppealsOpen, setIsMobileAppealsOpen] = useState(false);
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // 1. I removed 'Home' from here so we can place it manually before 'Appeals'
  const navLinks = [
    // Home is handled manually in the JSX current_project
    { name: t("menu.current_project"), path: "/current-project" },
    { name: t("menu.activities"), path: "/activities" },
    { name: t("menu.gallery"), path: "/gallery" },
    { name: t("menu.blogs"), path: "/blogs" },
    { name: t("menu.about"), path: "/about-us" },
    { name: t("menu.connect"), path: "/connect" },
    { name: t("menu.contact"), path: "/contact" },
  ];

  // Helper to check active state
  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-2 sm:top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-7xl pointer-events-auto relative">
        <div className="flex justify-between items-center h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <img
                src={logo}
                alt="Foundation Logo"
                className="h-14 sm:h-20 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-6">
            {/* 1. HOME LINK (First) */}
            <Link
              to="/"
              className={`text-sm font-bold transition-colors hover:text-[#0B4D26] ${
                isActive("/")
                  ? "text-[#0B4D26] border-b-2 border-[#0B4D26]"
                  : "text-gray-700"
              }`}
            >
              {t("menu.home")}
            </Link>

            {/* 2. APPEALS DROPDOWN (Second - After Home) */}
            <div className="group relative h-full flex items-center">
              <button
                className={`flex items-center gap-1 text-sm font-bold transition-colors hover:text-[#0B4D26] ${
                  location.pathname.includes("/appeals")
                    ? "text-[#0B4D26]"
                    : "text-gray-700"
                }`}
              >
                {t("menu.appeals")}
                <svg
                  className="w-4 h-4 transition-transform group-hover:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* The Dropdown Menu */}
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-12 left-0 w-[500px] bg-white shadow-xl rounded-xl border border-gray-100 p-4 grid grid-cols-2 gap-2 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                {appeals.map((item) => (
                  <Link
                    key={item._id}
                    to={`/appeals/${item.slug}`}
                    className="block px-3 py-2 rounded-lg hover:bg-green-50 text-sm font-medium text-gray-700 hover:text-[#0B4D26] transition-colors"
                  >
                    {item.appeal}
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. REST OF LINKS (Activities, Gallery, etc.) */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold transition-colors hover:text-[#0B4D26] ${
                  isActive(link.path)
                    ? "text-[#0B4D26] border-b-2 border-[#0B4D26]"
                    : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions (Desktop Only) */}
          <div className="hidden xl:flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button
                onClick={() => changeLanguage("bn")}
                className={`px-3 py-1 text-sm rounded-md transition-all ${i18n.language === "bn" ? "bg-white shadow text-[#0B4D26] font-bold" : "text-gray-500 hover:text-gray-700"}`}
              >
                বা
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className={`px-3 py-1 text-sm rounded-md transition-all ${i18n.language === "en" ? "bg-white shadow text-[#0B4D26] font-bold" : "text-gray-500 hover:text-gray-700"}`}
              >
                EN
              </button>
            </div>

            <button className="bg-orange-100 text-orange-800 p-2 rounded-md hover:bg-orange-200 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <Link
              to="/donation"
              className="bg-[#0B4D26] hover:bg-green-800 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              {t("menu.donate")}
            </Link>
          </div>

          {/* Mobile Right Side (Donate + Menu) */}
          <div className="xl:hidden flex items-center space-x-3">
            <Link
              to="/donation"
              className="bg-[#0B4D26] text-white px-4 py-1.5 rounded-md text-sm font-medium"
            >
              {t("menu.donate")}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 hover:text-[#0B4D26] focus:outline-none p-1"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-gray-100 rounded-b-xl shadow-lg absolute w-full left-0 top-full max-h-[80vh] overflow-y-auto">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {/* 1. MOBILE HOME LINK */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:text-[#0B4D26] hover:bg-green-50"
              >
                {t("menu.home")}
              </Link>

              {/* 2. MOBILE APPEALS ACCORDION */}
              <div>
                <button
                  onClick={() => setIsMobileAppealsOpen(!isMobileAppealsOpen)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:bg-green-50 hover:text-[#0B4D26]"
                >
                  <span>{t("menu.appeals")}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isMobileAppealsOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isMobileAppealsOpen && (
                  <div className="pl-6 space-y-1 mt-1 border-l-2 border-green-100 ml-3">
                    {appeals.map((item) => (
                      <Link
                        key={item._id}
                        to={`/appeals/${item.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-[#0B4D26] hover:bg-gray-50 rounded-md"
                      >
                        {item.appeal}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. REST OF MOBILE LINKS */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-gray-700 hover:text-[#0B4D26] hover:bg-green-50"
                >
                  {link.name}
                </Link>
              ))}

              {/* Language toggle */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between px-3">
                <span className="text-gray-600 font-medium">Language</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => changeLanguage("bn")}
                    className={`px-4 py-1.5 border rounded-md font-bold ${i18n.language === "bn" ? "bg-green-50 border-[#0B4D26] text-[#0B4D26]" : "text-gray-500"}`}
                  >
                    বা
                  </button>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`px-4 py-1.5 border rounded-md font-bold ${i18n.language === "en" ? "bg-green-50 border-[#0B4D26] text-[#0B4D26]" : "text-gray-500"}`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
