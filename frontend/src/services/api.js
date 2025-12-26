// Base API configuration and utilities
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
const API_TIMEOUT = 10000; // 10 seconds

// API Response types
class ApiResponse {
  constructor(data, status, message = "") {
    this.data = data;
    this.status = status;
    this.message = message;
    this.success = status >= 200 && status < 300;
  }
}

class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Request interceptor to add auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    timeout: API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  // Add timeout support
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);
  config.signal = controller.signal;

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    let data;
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        data
      );
    }

    return new ApiResponse(data, response.status, data.message);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(error.message || "Network error occurred", 0, error);
  }
};

// API methods
const api = {
  // GET request
  get: (endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return apiRequest(url, {
      method: "GET",
    });
  },

  // POST request
  post: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // PUT request
  put: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // PATCH request
  patch: (endpoint, data = {}) => {
    return apiRequest(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  delete: (endpoint) => {
    return apiRequest(endpoint, {
      method: "DELETE",
    });
  },

  // Upload files
  upload: (endpoint, formData) => {
    return apiRequest(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...getAuthHeaders(),
      },
    });
  },

  // Download files
  download: async (endpoint, filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new ApiError(
          `Download failed: ${response.statusText}`,
          response.status
        );
      }

      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename || "download";

      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return new ApiResponse({ success: true }, 200, "Download completed");
    } catch (error) {
      throw new ApiError(error.message || "Download failed", error.status || 0);
    }
  },
};

// Specific API endpoints
export const authApi = {
  login: (email, password, remember = false) =>
    api.post("/auth/login", { email, password, remember }),

  register: (userData) => api.post("/auth/register", userData),

  logout: () => api.post("/auth/logout"),

  refreshToken: () => api.post("/auth/refresh"),

  verifyToken: () => api.post("/auth/verify"),

  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),

  resetPassword: (token, password) =>
    api.post("/auth/reset-password", { token, password }),

  changePassword: (currentPassword, newPassword) =>
    api.put("/auth/change-password", { currentPassword, newPassword }),
};

export const userApi = {
  getProfile: () => api.get("/user/profile"),

  updateProfile: (userData) => api.put("/user/profile", userData),

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.upload("/user/avatar", formData);
  },

  getProgress: () => api.get("/user/progress"),

  updateProgress: (progressData) => api.put("/user/progress", progressData),
};

export const lessonApi = {
  getAllLessons: (params = {}) => api.get("/lessons", params),

  getLesson: (id) => api.get(`/lessons/${id}`),

  getLessonContent: (id) => api.get(`/lessons/${id}/content`),

  recordProgress: (lessonId, progressData) =>
    api.post(`/lessons/${lessonId}/progress`, progressData),

  submitCompletion: (lessonId, completionData) =>
    api.post(`/lessons/${lessonId}/complete`, completionData),
};

export const voiceApi = {
  uploadRecording: (audioBlob, metadata = {}) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("metadata", JSON.stringify(metadata));
    return api.upload("/voice/analyze", formData);
  },

  getAnalysis: (recordingId) => api.get(`/voice/analysis/${recordingId}`),

  getFeedback: (recordingId) => api.get(`/voice/feedback/${recordingId}`),
};

export const sessionApi = {
  createSession: (sessionData) => api.post("/sessions", sessionData),

  getSession: (id) => api.get(`/sessions/${id}`),

  updateSession: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),

  getAllSessions: (params = {}) => api.get("/sessions", params),

  getSessionAnalytics: (id) => api.get(`/sessions/${id}/analytics`),
};

export const analyticsApi = {
  getDashboard: () => api.get("/analytics/dashboard"),

  getStudentProgress: (studentId) =>
    api.get(`/analytics/students/${studentId}`),

  getSessionReport: (params = {}) => api.get("/analytics/sessions", params),

  exportData: (type, params = {}) =>
    api.download(`/analytics/export/${type}`, `${type}-report.csv`),
};

// Error handler utility
export const handleApiError = (error) => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        // Unauthorized - redirect to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        window.location.href = "/login";
        return "Session expired. Please log in again.";

      case 403:
        return "You do not have permission to access this resource.";

      case 404:
        return "The requested resource was not found.";

      case 408:
        return "Request timeout. Please check your connection and try again.";

      case 429:
        return "Too many requests. Please wait a moment and try again.";

      case 500:
        return "Internal server error. Please try again later.";

      default:
        return error.message || "An unexpected error occurred.";
    }
  }

  return "Network error. Please check your connection and try again.";
};

// Request queue for offline support
class RequestQueue {
  constructor() {
    this.queue = this.loadQueue();
  }

  loadQueue() {
    try {
      return JSON.parse(localStorage.getItem("apiRequestQueue") || "[]");
    } catch {
      return [];
    }
  }

  saveQueue() {
    localStorage.setItem("apiRequestQueue", JSON.stringify(this.queue));
  }

  add(request) {
    this.queue.push({
      id: Date.now() + Math.random(),
      ...request,
      timestamp: new Date().toISOString(),
    });
    this.saveQueue();
  }

  async processQueue() {
    const results = { processed: 0, failed: 0 };
    const remainingQueue = [];

    for (const request of this.queue) {
      try {
        await api[request.method](request.endpoint, request.data);
        results.processed++;
      } catch (error) {
        console.error(`Failed to process queued request ${request.id}:`, error);
        results.failed++;
        remainingQueue.push(request);
      }
    }

    this.queue = remainingQueue;
    this.saveQueue();

    return results;
  }

  clear() {
    this.queue = [];
    this.saveQueue();
  }
}

export const requestQueue = new RequestQueue();

// Export main api object
export default api;
