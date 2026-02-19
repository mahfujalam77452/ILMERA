const Lightbox = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/90 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button 
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
        onClick={onClose}
      >
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img 
        src={image} 
        alt="Full View" 
        className="max-w-full max-h-full object-contain rounded-md shadow-2xl cursor-pointer"
        onClick={(e) => e.stopPropagation()} 
      />
    </div>
  );
};

export default Lightbox;