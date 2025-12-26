import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import LessonCard from "../components/learning/LessonCard";

const Home = () => {
  // Mock data - in real app, this would come from props/context/API
  const featuredLessons = [
    {
      id: 1,
      title: "Introduction to Numbers",
      description:
        "Learn basic numbers from 1 to 10 with interactive voice exercises.",
      duration: "15 min",
      difficulty: "easy",
      topics: ["Numbers", "Counting", "Basic Math"],
      thumbnail: "/images/numbers-lesson.jpg",
    },
    {
      id: 2,
      title: "Colors and Shapes",
      description:
        "Discover different colors and basic shapes through fun activities.",
      duration: "20 min",
      difficulty: "easy",
      topics: ["Colors", "Shapes", "Visual Learning"],
      thumbnail: "/images/colors-lesson.jpg",
    },
    {
      id: 3,
      title: "Simple Words",
      description:
        "Build vocabulary with common everyday words and pronunciation practice.",
      duration: "25 min",
      difficulty: "medium",
      topics: ["Vocabulary", "Pronunciation", "Language"],
      thumbnail: "/images/words-lesson.jpg",
    },
  ];

  const handleStartLesson = (lesson) => {
    console.log("Starting lesson:", lesson);
    // Navigation would happen here
  };

  const handleContinueLesson = (lesson) => {
    console.log("Continuing lesson:", lesson);
    // Navigation would happen here
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <div
        className="text-white py-5"
        style={{
          background: "linear-gradient(to right, #0d6efd, #6f42c1)",
        }}
      >
        <div className="container py-5">
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-4">Welcome to Learning Hub</h1>
            <p className="lead mb-4 mx-auto" style={{ maxWidth: "700px", opacity: 0.9 }}>
              Interactive learning with voice recognition technology. Perfect
              for children and adult learners alike.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link to="/child-session">
                <Button
                  size="large"
                  variant="secondary"
                  className="bg-white text-primary border-0"
                  style={{ minWidth: "200px" }}
                >
                  Start Child Session
                </Button>
              </Link>
              <Link to="/worker-dashboard">
                <Button
                  size="large"
                  variant="outline"
                  className="border-white text-white"
                  style={{ minWidth: "200px" }}
                >
                  Worker Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="h2 fw-bold text-dark mb-3">Why Choose Our Platform?</h2>
          <p className="lead text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Designed with cutting-edge technology to make learning engaging and
            accessible for everyone.
          </p>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="text-center p-4">
              <div
                className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "64px", height: "64px" }}
              >
                <svg
                  style={{ width: "32px", height: "32px" }}
                  className="text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h5 className="fw-semibold text-dark mb-2">Voice Recognition</h5>
              <p className="text-muted">
                Advanced voice technology that understands and responds to
                learners.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="text-center p-4">
              <div
                className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "64px", height: "64px" }}
              >
                <svg
                  style={{ width: "32px", height: "32px" }}
                  className="text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h5 className="fw-semibold text-dark mb-2">Offline Support</h5>
              <p className="text-muted">
                Continue learning even without internet connection.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="text-center p-4">
              <div
                className="bg-purple bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "64px", height: "64px", backgroundColor: "rgba(111, 66, 193, 0.1)" }}
              >
                <svg
                  style={{ width: "32px", height: "32px", color: "#6f42c1" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h5 className="fw-semibold text-dark mb-2">Progress Tracking</h5>
              <p className="text-muted">
                Monitor learning progress with detailed analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Lessons */}
        <div className="mb-5">
          <div className="text-center mb-4">
            <h2 className="h2 fw-bold text-dark mb-3">Featured Lessons</h2>
            <p className="lead text-muted">
              Start with these popular learning modules
            </p>
          </div>

          <div className="row g-4">
            {featuredLessons.map((lesson) => (
              <div key={lesson.id} className="col-md-6 col-lg-4">
                <LessonCard
                  lesson={lesson}
                  onStart={handleStartLesson}
                  onContinue={handleContinueLesson}
                  progress={lesson.id === 2 ? 45 : 0}
                  isCompleted={lesson.id === 1}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="card shadow-sm">
          <div className="card-body text-center p-5">
            <h2 className="h4 fw-bold text-dark mb-3">Ready to Start Learning?</h2>
            <p className="text-muted mb-4 mx-auto" style={{ maxWidth: "600px" }}>
              Join thousands of learners who have improved their skills with our
              interactive platform.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link to="/child-session">
                <Button size="large" style={{ minWidth: "200px" }}>
                  Start Learning Now
                </Button>
              </Link>
              <Link to="/login">
                <Button size="large" variant="outline" style={{ minWidth: "200px" }}>
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
