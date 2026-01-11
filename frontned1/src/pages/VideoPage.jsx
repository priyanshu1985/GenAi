import React, { useState, useEffect } from "react";
import VideoPlayer from "../components/VideoPlayer";
import VideoCard from "../components/VideoCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/VideoPage.css";

// ============================================================
// DEMO DATA: Curated educational videos for children (2-7 years)
// Sources: Cocomelon, Sesame Street, PBS KIDS, ChuChu TV, Peekaboo Kidz
// All video IDs verified and working as of 2024
// ============================================================
const DEMO_VIDEOS = [
  // === COCOMELON (Official Channel) ===
  {
    id: "1",
    videoId: "lrAbrdqsKhU", // Cocomelon - Wheels on the Bus (3B+ views)
    title: "Wheels on the Bus - Cocomelon",
    category: "Rhymes",
  },
  {
    id: "2",
    videoId: "71hiByoZ_3M", // Cocomelon - Bath Song
    title: "Bath Song - Cocomelon",
    category: "Rhymes",
  },
  {
    id: "3",
    videoId: "ystdFo3SwxQ", // Cocomelon - ABC Song
    title: "ABC Song - Cocomelon",
    category: "Alphabets",
  },
  {
    id: "4",
    videoId: "0j6k_DVz7-o", // Cocomelon - 123 Numbers Song
    title: "123 Song - Cocomelon",
    category: "Numbers",
  },
  // === CHUCHU TV ===
  {
    id: "5",
    videoId: "hq3yfQnllfQ", // ChuChu TV - Phonics Song
    title: "Phonics Song with Two Words - ChuChu TV",
    category: "Alphabets",
  },
  {
    id: "6",
    videoId: "HjXgLy-5lCE", // ChuChu TV - Rain Rain Go Away
    title: "Rain Rain Go Away - ChuChu TV",
    category: "Rhymes",
  },
  {
    id: "7",
    videoId: "LFrKYjrIDs8", // ChuChu TV - Johny Johny Yes Papa
    title: "Johny Johny Yes Papa - ChuChu TV",
    category: "Rhymes",
  },
  {
    id: "8",
    videoId: "ZC7yZ69lxMs", // ChuChu TV - Learn Colors
    title: "Learn Colors for Children - ChuChu TV",
    category: "Colors",
  },
  // === SUPER SIMPLE SONGS ===
  {
    id: "9",
    videoId: "XqZsoesa55w", // Baby Shark Original
    title: "Baby Shark - Super Simple Songs",
    category: "Rhymes",
  },
  {
    id: "10",
    videoId: "K6DSMZ8b3LE", // Twinkle Twinkle Little Star
    title: "Twinkle Twinkle Little Star - Super Simple",
    category: "Rhymes",
  },
  {
    id: "11",
    videoId: "fe4fZoGS1V4", // Head Shoulders Knees and Toes
    title: "Head Shoulders Knees & Toes - Super Simple",
    category: "Rhymes",
  },
  // === PEEKABOO KIDZ (Dr. Binocs) ===
  {
    id: "12",
    videoId: "RG4rFiG9PFs", // Peekaboo Kidz - Solar System
    title: "Solar System - Dr. Binocs",
    category: "Science",
  },
  {
    id: "13",
    videoId: "b6rkXGikuNA", // Peekaboo Kidz - Water Cycle
    title: "Water Cycle - Dr. Binocs",
    category: "Science",
  },
  {
    id: "14",
    videoId: "pMHsNRNuWLM", // Peekaboo Kidz - Digestive System
    title: "Digestive System - Dr. Binocs",
    category: "Science",
  },
  // === SESAME STREET ===
  {
    id: "15",
    videoId: "lYIRO97dhII", // Sesame Street - Elmo's Song
    title: "Elmo's Song - Sesame Street",
    category: "Rhymes",
  },
  {
    id: "16",
    videoId: "8LGDQ4JrSgo", // Sesame Street - ABCs
    title: "ABC Cookie Monster - Sesame Street",
    category: "Alphabets",
  },
  {
    id: "17",
    videoId: "GElOFFz_pI0", // Sesame Street - Counting
    title: "Count with the Count - Sesame Street",
    category: "Numbers",
  },
];

// ============================================================
// API Configuration
// ============================================================
const API_BASE_URL = "https://genai-7j5d.onrender.com/api";

// ============================================================
// API Service: Fetch approved videos from backend
// Falls back to demo data if API is unavailable
// ============================================================
const fetchApprovedVideos = async () => {
  try {
    // Try fetching from backend API first
    const response = await fetch(`${API_BASE_URL}/videos`);
    if (response.ok) {
      const data = await response.json();
      // API returns { videos: [...], total: N }
      return data.videos || [];
    }
    throw new Error("API unavailable");
  } catch (error) {
    console.log("Using demo videos (API unavailable):", error.message);
    // Fallback to demo data if API fails
    return DEMO_VIDEOS;
  }
};

// ============================================================
// MAIN VIDEO PAGE COMPONENT
// YouTube-like layout with safe, curated content
// ============================================================
const VideoPage = () => {
  // Currently selected video (shown in main player)
  const [selectedVideo, setSelectedVideo] = useState(null);
  // All approved videos from backend
  const [videos, setVideos] = useState([]);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Active category filter
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch approved videos on mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const approvedVideos = await fetchApprovedVideos();
        setVideos(approvedVideos);
        // Auto-select first video
        if (approvedVideos.length > 0) {
          setSelectedVideo(approvedVideos[0]);
        }
      } catch (error) {
        console.error("Failed to load videos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  // Get unique categories for filter buttons
  const categories = ["All", ...new Set(videos.map((v) => v.category))];

  // Filter videos by category
  const filteredVideos =
    activeCategory === "All"
      ? videos
      : videos.filter((v) => v.category === activeCategory);

  // Handle video selection
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    // Scroll to top when video changes (for mobile)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="video-page">
          <div className="loading-state">
            <span className="loading-emoji">📺</span>
            <p>Loading fun videos...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="video-page">
        {/* Page Header */}
        <header className="video-header">
          <h1>📺 Fun Learning Videos</h1>
          <p>Watch and learn with safe, teacher-approved videos!</p>
        </header>

        {/* Main Video Player Section */}
        <section className="player-section">
          {selectedVideo ? (
            <>
              <VideoPlayer videoId={selectedVideo.videoId} />
              <div className="video-info">
                <h2>{selectedVideo.title}</h2>
                <span className="category-badge">{selectedVideo.category}</span>
              </div>
            </>
          ) : (
            <div className="no-video">
              <p>Select a video to watch!</p>
            </div>
          )}
        </section>

        {/* Category Filter Buttons */}
        <section className="category-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Video Grid (YouTube-like cards) */}
        <section className="video-grid">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isActive={selectedVideo?.id === video.id}
              onClick={() => handleVideoSelect(video)}
            />
          ))}
        </section>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="empty-state">
            <span>🎬</span>
            <p>No videos in this category yet!</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default VideoPage;
