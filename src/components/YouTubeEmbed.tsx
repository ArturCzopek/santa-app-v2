import React from 'react';

// Keeps 16:9 at any width instead of a fixed 315 px height.
const YouTubeEmbed: React.FC<{ videoId: string; title?: string }> = ({
  videoId,
  title = 'YouTube',
}) => (
  <iframe
    style={{
      display: 'block',
      width: '100%',
      aspectRatio: '16 / 9',
      border: 0,
      borderRadius: 6,
    }}
    // No cookies until the video is played.
    src={`https://www.youtube-nocookie.com/embed/${videoId}`}
    title={title}
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
);

export default YouTubeEmbed;
