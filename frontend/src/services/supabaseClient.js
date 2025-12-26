import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not found. Please check your environment variables."
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Authentication helpers
export const supabaseAuth = {
  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData, // Additional user metadata
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign in with OAuth provider (Google, GitHub, etc.)
  signInWithProvider: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Get current user
  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // Update user profile
  updateUser: async (updates) => {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
  },

  // Reset password
  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  // Update password
  updatePassword: async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    if (error) throw error;
    return data;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helpers
export const supabaseDb = {
  // User profiles
  profiles: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },

    create: async (profile) => {
      const { data, error } = await supabase
        .from("profiles")
        .insert(profile)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    update: async (userId, updates) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  // Learning sessions
  sessions: {
    getAll: async (userId, options = {}) => {
      let query = supabase
        .from("learning_sessions")
        .select("*")
        .eq("user_id", userId);

      if (options.limit) query = query.limit(options.limit);
      if (options.orderBy)
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending,
        });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    get: async (sessionId) => {
      const { data, error } = await supabase
        .from("learning_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) throw error;
      return data;
    },

    create: async (session) => {
      const { data, error } = await supabase
        .from("learning_sessions")
        .insert(session)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    update: async (sessionId, updates) => {
      const { data, error } = await supabase
        .from("learning_sessions")
        .update(updates)
        .eq("id", sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    delete: async (sessionId) => {
      const { error } = await supabase
        .from("learning_sessions")
        .delete()
        .eq("id", sessionId);

      if (error) throw error;
    },
  },

  // Voice recordings
  recordings: {
    getAll: async (userId, options = {}) => {
      let query = supabase
        .from("voice_recordings")
        .select("*")
        .eq("user_id", userId);

      if (options.sessionId) query = query.eq("session_id", options.sessionId);
      if (options.limit) query = query.limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    create: async (recording) => {
      const { data, error } = await supabase
        .from("voice_recordings")
        .insert(recording)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    update: async (recordingId, updates) => {
      const { data, error } = await supabase
        .from("voice_recordings")
        .update(updates)
        .eq("id", recordingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  // Progress tracking
  progress: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },

    upsert: async (progressData) => {
      const { data, error } = await supabase
        .from("user_progress")
        .upsert(progressData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  // Lessons
  lessons: {
    getAll: async (options = {}) => {
      let query = supabase.from("lessons").select("*");

      if (options.category) query = query.eq("category", options.category);
      if (options.difficulty)
        query = query.eq("difficulty", options.difficulty);
      if (options.limit) query = query.limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    get: async (lessonId) => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();

      if (error) throw error;
      return data;
    },
  },
};

// Storage helpers
export const supabaseStorage = {
  // Upload file
  upload: async (bucket, path, file, options = {}) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        ...options,
      });

    if (error) throw error;
    return data;
  },

  // Download file
  download: async (bucket, path) => {
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) throw error;
    return data;
  },

  // Get public URL
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return data.publicUrl;
  },

  // Delete file
  remove: async (bucket, paths) => {
    const { data, error } = await supabase.storage.from(bucket).remove(paths);

    if (error) throw error;
    return data;
  },

  // List files
  list: async (bucket, path = "", options = {}) => {
    const { data, error } = await supabase.storage.from(bucket).list(path, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
      ...options,
    });

    if (error) throw error;
    return data;
  },

  // Upload audio recording
  uploadRecording: async (userId, sessionId, audioBlob) => {
    const timestamp = new Date().toISOString();
    const fileName = `${userId}/${sessionId}/${timestamp}.wav`;

    const { data, error } = await supabase.storage
      .from("recordings")
      .upload(fileName, audioBlob, {
        cacheControl: "3600",
        upsert: false,
        contentType: "audio/wav",
      });

    if (error) throw error;

    // Return the file path and public URL
    return {
      path: fileName,
      url: supabaseStorage.getPublicUrl("recordings", fileName),
    };
  },
};

// Real-time subscriptions
export const supabaseRealtime = {
  // Subscribe to table changes
  subscribe: (table, callback, options = {}) => {
    return supabase
      .channel(`public:${table}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
          ...options,
        },
        callback
      )
      .subscribe();
  },

  // Subscribe to user-specific changes
  subscribeToUser: (userId, table, callback) => {
    return supabase
      .channel(`user:${userId}:${table}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  // Unsubscribe from channel
  unsubscribe: (subscription) => {
    return supabase.removeChannel(subscription);
  },
};

// Utility functions
export const supabaseUtils = {
  // Check if user is authenticated
  isAuthenticated: async () => {
    const session = await supabaseAuth.getSession();
    return !!session?.user;
  },

  // Get user role
  getUserRole: async () => {
    const user = await supabaseAuth.getCurrentUser();
    return user?.user_metadata?.role || "user";
  },

  // Handle auth errors
  handleAuthError: (error) => {
    switch (error?.message) {
      case "Invalid login credentials":
        return "Invalid email or password";
      case "Email not confirmed":
        return "Please check your email and click the confirmation link";
      case "Too many signup requests":
        return "Too many signup attempts. Please try again later";
      default:
        return error?.message || "An authentication error occurred";
    }
  },

  // Format error message
  formatError: (error) => {
    if (error?.code === "PGRST301") {
      return "Database connection error";
    }
    return error?.message || "An unexpected error occurred";
  },
};

export default supabase;
