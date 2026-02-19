import { Link } from 'react-router-dom';

const Notice = () => {
  return (
    <div className="min-h-[80vh] w-full bg-gray-50 flex flex-col items-center justify-center px-4 pt-24 pb-12">
      
      {/* 1. Animated Icon Container */}
      <div className="bg-white p-6 rounded-full shadow-xl mb-8 border border-green-50">
        <svg 
          className="w-20 h-20 text-[#0B4D26] animate-pulse" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>

      {/* 2. Main Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center font-bengali">
        Feature Coming Soon
      </h1>
      
      {/* 3. Subtext */}
      <p className="text-lg text-gray-600 mb-10 text-center max-w-lg leading-relaxed">
        We are currently working on the <span className="font-bold text-[#0B4D26]">Notice Board</span> page. 
        <br className="hidden md:block"/> 
        It will be available very soon. Please stay tuned!
      </p>

      {/* 4. 'Back to Home' Button */}
      <Link 
        to="/" 
        className="group relative inline-flex items-center gap-2 px-8 py-3 bg-[#0B4D26] text-white font-bold rounded-lg hover:bg-[#093d1e] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
      >
        <svg 
          className="w-5 h-5 transition-transform group-hover:-translate-x-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>

    </div>
  );
};

export default Notice;