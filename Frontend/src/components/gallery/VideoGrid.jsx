const VideoGrid = ({ videos }) => {
  console.log("Rendering VideoGrid with videos:", videos);
  function convertToEmbedURL(videoLink) {
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;
  const match = videoLink.match(regExp);

  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  return null; // invalid link
}
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((vid) => (
        <div key={vid.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="relative pt-[56.25%] bg-black">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={convertToEmbedURL(vid.video_link)}
              title={vid.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-800 line-clamp-2">{vid.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;