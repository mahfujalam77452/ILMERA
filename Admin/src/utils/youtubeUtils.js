export const extractYouTubeId = (url) => {
  if (!url) return null;

  const patterns = [
    /youtu.be\/([a-zA-Z0-9_-]{11})/,
    /youtube.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

export const getEmbedUrl = (youtubeUrl) => {
  const videoId = extractYouTubeId(youtubeUrl);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};

export const isValidYouTubeUrl = (url) => {
  return extractYouTubeId(url) !== null;
};
