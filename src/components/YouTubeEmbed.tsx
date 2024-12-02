import React from 'react';

const YouTubeEmbed: React.FC<{ videoId: string }> = ({ videoId }) => (
    <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
    ></iframe>
);

export default YouTubeEmbed;