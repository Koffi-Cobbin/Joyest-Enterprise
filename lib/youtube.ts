/** Extract a YouTube video ID from common URL shapes; undefined if not a YouTube link */
export const getYouTubeId = (url: string): string | undefined => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match?.[1];
};
