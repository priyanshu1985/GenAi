const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic API request handler
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (email, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: ({ email, password, role, name }) =>
    apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, role, name }),
    }),

  getCurrentUser: () => apiRequest("/auth/me"),
};

// User API (role-based endpoints)
export const userAPI = {
  getParentData: () => apiRequest("/api/parent-data"),
  getTeacherData: () => apiRequest("/api/teacher-data"),
  getAdminData: () => apiRequest("/api/admin-data"),
};

// AI API
export const aiAPI = {
  // Voice interaction - send audio file
  interact: async (audioBlob, childId) => {
    console.log(
      "🎤 VOICE API: Sending audio...",
      `(${(audioBlob.size / 1024).toFixed(1)} KB)`
    );

    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("child_id", childId);

    const startTime = Date.now();

    try {
      const response = await fetch(`${API_BASE_URL}/ai/interact`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      const timeMs = Date.now() - startTime;

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ detail: "Request failed" }));
        console.log(`❌ VOICE API FAILED: ${response.status} (${timeMs}ms)`);
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data?.transcribed_text) {
        console.log(`✅ VOICE API SUCCESS (${timeMs}ms)`);
        console.log(`   📝 You said: "${data.data.transcribed_text}"`);
        console.log(`   🤖 AI says: "${data.data.ai_text_response}"`);
        console.log(
          `   🔊 Audio: ${data.data.audio_response?.tts_type || "none"}`
        );
      } else {
        console.log(`⚠️ VOICE API: No transcription (${timeMs}ms)`);
      }

      return data;
    } catch (err) {
      console.log("❌ VOICE API ERROR:", err.message);
      throw err;
    }
  },

  // Text-only interaction (no audio) - using new method name for Web Speech API
  interactWithText: async (text, childId) => {
    console.log("💬 TEXT API: Sending...", `"${text}"`);

    const startTime = Date.now();

    try {
      const response = await fetch(`${API_BASE_URL}/ai/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ text, child_id: childId }),
      });

      const timeMs = Date.now() - startTime;

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ detail: "Request failed" }));
        console.log(`❌ TEXT API FAILED: ${response.status} (${timeMs}ms)`);
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log(`✅ TEXT API SUCCESS (${timeMs}ms)`);
        console.log(
          `   🤖 AI says: "${data.data.ai_text_response || data.data.response}"`
        );
        console.log(
          `   🔊 Audio: ${data.data.audio_response ? "available" : "none"}`
        );
      } else {
        console.log(`⚠️ TEXT API: Failed (${timeMs}ms)`);
      }

      return data;
    } catch (err) {
      console.log("❌ TEXT API ERROR:", err.message);
      throw err;
    }
  },

  // Text-only interaction (no audio)
  textInteract: async (text, childId) => {
    console.log("💬 TEXT API: Sending...", `"${text}"`);

    const startTime = Date.now();

    try {
      const response = await fetch(`${API_BASE_URL}/ai/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ text, child_id: childId }),
      });

      const timeMs = Date.now() - startTime;

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ detail: "Request failed" }));
        console.log(`❌ TEXT API FAILED: ${response.status} (${timeMs}ms)`);
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log(`✅ TEXT API SUCCESS (${timeMs}ms)`);
        console.log(`   🤖 AI says: "${data.data.ai_text_response}"`);
        console.log(
          `   🔊 Audio: ${data.data.audio_response?.tts_type || "none"}`
        );
      } else {
        console.log(`⚠️ TEXT API: Failed (${timeMs}ms)`);
      }

      return data;
    } catch (err) {
      console.log("❌ TEXT API ERROR:", err.message);
      throw err;
    }
  },

  // Get greeting for a child
  getGreeting: (childId) => apiRequest(`/ai/greeting/${childId}`),

  // Post greeting request
  postGreeting: (childId) =>
    apiRequest("/ai/greeting", {
      method: "POST",
      body: JSON.stringify({ child_id: childId }),
    }),

  // Get all children profiles
  getChildren: () => apiRequest("/ai/children"),

  // Get specific child profile
  getChild: (childId) => apiRequest(`/ai/child/${childId}`),

  // Health check
  health: () => apiRequest("/ai/health"),
};

// Health check
export const healthAPI = {
  check: () => apiRequest("/health"),
  root: () => apiRequest("/"),
};

export default {
  auth: authAPI,
  user: userAPI,
  ai: aiAPI,
  health: healthAPI,
};
