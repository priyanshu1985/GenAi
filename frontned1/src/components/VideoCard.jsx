import React from "react";

// ============================================================
// VIDEO CARD COMPONENT
// YouTube-like thumbnail card for video selection
// Uses official YouTube thumbnail API (no external navigation)
// ============================================================
const VideoCard = ({ video, isActive, onClick }) => {
  // YouTube provides multiple thumbnail sizes:
  // - default.jpg: 120x90
  // - mqdefault.jpg: 320x180 (medium quality - best for cards)
  // - hqdefault.jpg: 480x360
  // - maxresdefault.jpg: 1280x720 (not always available)
  const thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;

  return (
    <div
      className={`video-card ${isActive ? "video-card-active" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        // Accessibility: Allow Enter/Space to select
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Play ${video.title}`}
      aria-pressed={isActive}
    >
      {/* Thumbnail Container */}
      <div className="video-card-thumbnail">
        <img
          src={thumbnailUrl}
          alt={video.title}
          loading="lazy"
          onError={(e) => {
            // Fallback if thumbnail fails to load
            e.target.src = "https://via.placeholder.com/320x180?text=Video";
          }}
        />
        {/* Play icon overlay */}
        <div className="play-overlay">
          <span className="play-icon">▶</span>
        </div>
        {/* Now Playing indicator */}
        {isActive && (
          <div className="now-playing">
            <span>Now Playing</span>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="video-card-info">
        <h3 className="video-card-title">{video.title}</h3>
        <span className="video-card-category">{video.category}</span>
      </div>
    </div>
  );
};

export default VideoCard;
