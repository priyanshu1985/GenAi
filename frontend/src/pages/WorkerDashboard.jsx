import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/learning/ProgressBar";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";

const WorkerDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockData = async () => {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockSessions = [
        {
          id: 1,
          studentName: "Alice Johnson",
          lessonTitle: "Numbers 1-10",
          completedAt: "2024-12-13T10:30:00Z",
          duration: 15,
          score: 85,
          status: "completed",
          recordings: 8,
        },
        {
          id: 2,
          studentName: "Bob Smith",
          lessonTitle: "Colors and Shapes",
          completedAt: "2024-12-13T14:15:00Z",
          duration: 22,
          score: 92,
          status: "completed",
          recordings: 12,
        },
        {
          id: 3,
          studentName: "Carol Davis",
          lessonTitle: "Simple Words",
          completedAt: null,
          duration: 8,
          score: 0,
          status: "in-progress",
          recordings: 4,
        },
        {
          id: 4,
          studentName: "David Wilson",
          lessonTitle: "Numbers 1-10",
          completedAt: "2024-12-12T16:45:00Z",
          duration: 18,
          score: 78,
          status: "completed",
          recordings: 10,
        },
      ];

      const mockStudents = [
        {
          id: 1,
          name: "Alice Johnson",
          totalSessions: 12,
          averageScore: 87,
          lastSession: "2024-12-13T10:30:00Z",
          progressLevel: "Intermediate",
        },
        {
          id: 2,
          name: "Bob Smith",
          totalSessions: 8,
          averageScore: 91,
          lastSession: "2024-12-13T14:15:00Z",
          progressLevel: "Advanced",
        },
        {
          id: 3,
          name: "Carol Davis",
          totalSessions: 5,
          averageScore: 73,
          lastSession: "2024-12-13T11:20:00Z",
          progressLevel: "Beginner",
        },
        {
          id: 4,
          name: "David Wilson",
          totalSessions: 15,
          averageScore: 82,
          lastSession: "2024-12-12T16:45:00Z",
          progressLevel: "Intermediate",
        },
      ];

      const mockAnalytics = {
        totalSessions: 40,
        activeStudents: 4,
        averageScore: 83,
        completionRate: 87,
        totalRecordings: 156,
        weeklyGrowth: 12,
      };

      setSessions(mockSessions);
      setStudents(mockStudents);
      setAnalytics(mockAnalytics);
      setIsLoading(false);
    };

    mockData();
  }, []);

  const filteredSessions = sessions.filter((session) => {
    if (selectedFilter === "all") return true;
    return session.status === selectedFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "In progress";
    return (
      new Date(dateString).toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="large" message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Worker Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor student progress and session analytics
              </p>
            </div>
            <div className="flex space-x-4">
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Button>Export Report</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.activeStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Sessions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalSessions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Score
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.averageScore}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Recordings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalRecordings}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sessions */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Sessions
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedFilter("all")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      selectedFilter === "all"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedFilter("completed")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      selectedFilter === "completed"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setSelectedFilter("in-progress")}
                    className={`px-3 py-1 text-sm rounded-md ${
                      selectedFilter === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    In Progress
                  </button>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <div key={session.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {session.studentName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {session.lessonTitle}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        session.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-1 font-medium">
                        {session.duration}m
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Score:</span>
                      <span
                        className={`ml-1 font-medium ${getScoreColor(
                          session.score
                        )}`}
                      >
                        {session.score > 0 ? `${session.score}%` : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Recordings:</span>
                      <span className="ml-1 font-medium">
                        {session.recordings}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(session.completedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Student Overview */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Students Overview
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {student.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.progressLevel === "Advanced"
                          ? "bg-green-100 text-green-800"
                          : student.progressLevel === "Intermediate"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {student.progressLevel}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Sessions:</span>
                      <span className="font-medium">
                        {student.totalSessions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Score:</span>
                      <span
                        className={`font-medium ${getScoreColor(
                          student.averageScore
                        )}`}
                      >
                        {student.averageScore}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Session:</span>
                      <span className="font-medium">
                        {new Date(student.lastSession).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <ProgressBar
                    current={student.averageScore}
                    total={100}
                    showLabel={false}
                    showPercentage={false}
                    color={
                      student.averageScore >= 90
                        ? "green"
                        : student.averageScore >= 75
                        ? "blue"
                        : "yellow"
                    }
                    size="small"
                    className="mt-3"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
