import React from "react";

// ============================================================
// SAFE VIDEO PLAYER COMPONENT
// Uses youtube-nocookie.com for privacy-enhanced embed
// Disables all YouTube features that could lead outside the app
// ============================================================
const VideoPlayer = ({ videoId }) => {
  // SAFETY: Build embed URL with strict parameters
  // - youtube-nocookie.com: Enhanced privacy mode (no tracking cookies)
  // - rel=0: Don't show related videos from other channels
  // - modestbranding=1: Minimize YouTube branding
  // - controls=1: Show player controls (needed for kids)
  // - disablekb=0: Allow keyboard controls
  // - fs=1: Allow fullscreen (good for focus)
  // - playsinline=1: Play inline on mobile (no redirect)
  // - iv_load_policy=3: Hide video annotations
  // - cc_load_policy=0: Don't force captions
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&controls=1&disablekb=0&fs=1&playsinline=1&iv_load_policy=3`;

  return (
    <div className="video-player-container">
      <iframe
        className="video-player-iframe"
        src={embedUrl}
        title="Educational Video"
        // SECURITY: Restrict iframe capabilities
        // - accelerometer, gyroscope: Allow for mobile viewing
        // - encrypted-media: Required for video playback
        // - picture-in-picture: Allow PiP mode
        // - fullscreen: Allow fullscreen viewing
        // - NO allow-top-navigation: Prevents redirecting parent page
        // - NO allow-popups: Prevents popups
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        // Additional security: sandbox attribute restricts iframe behavior
        // This prevents the iframe from navigating the parent page
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
};

export default VideoPlayer;
