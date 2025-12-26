import { supabaseAuth, supabaseDb } from "./supabaseClient";
import api, { authApi, handleApiError } from "./api";

// Authentication service that works with both Supabase and custom backend
class AuthService {
  constructor() {
    this.useSupabase = import.meta.env.VITE_USE_SUPABASE === "true";
    this.currentUser = null;
    this.isInitialized = false;
  }

  // Initialize the auth service
  async initialize() {
    if (this.isInitialized) return;

    try {
      if (this.useSupabase) {
        const session = await supabaseAuth.getSession();
        this.currentUser = session?.user || null;

        // Listen for auth state changes
        supabaseAuth.onAuthStateChange((event, session) => {
          this.currentUser = session?.user || null;
          this.handleAuthStateChange(event, session);
        });
      } else {
        // For custom backend, check if token exists and is valid
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            await this.verifyToken();
          } catch (error) {
            console.warn("Token verification failed:", error);
            this.clearAuthData();
          }
        }
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize auth service:", error);
      throw error;
    }
  }

  // Handle auth state changes
  handleAuthStateChange(event, session) {
    switch (event) {
      case "SIGNED_IN":
        console.log("User signed in");
        this.syncUserProfile(session.user);
        break;
      case "SIGNED_OUT":
        console.log("User signed out");
        this.clearAuthData();
        break;
      case "TOKEN_REFRESHED":
        console.log("Token refreshed");
        break;
      case "USER_UPDATED":
        console.log("User updated");
        this.syncUserProfile(session.user);
        break;
    }
  }

  // Sign up a new user
  async signUp(email, password, userData = {}) {
    try {
      if (this.useSupabase) {
        const result = await supabaseAuth.signUp(email, password, userData);

        // Create user profile
        if (result.user) {
          await this.createUserProfile(result.user, userData);
        }

        return {
          user: result.user,
          session: result.session,
          needsEmailConfirmation: !result.session,
        };
      } else {
        const response = await authApi.register({
          email,
          password,
          ...userData,
        });

        if (response.success) {
          this.currentUser = response.data.user;
          this.storeAuthData(response.data);
          return {
            user: response.data.user,
            session: response.data,
            needsEmailConfirmation: false,
          };
        }
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      throw new Error(this.formatAuthError(error));
    }
  }

  // Sign in user
  async signIn(email, password, remember = false) {
    try {
      if (this.useSupabase) {
        const result = await supabaseAuth.signIn(email, password);
        this.currentUser = result.user;

        return {
          user: result.user,
          session: result.session,
        };
      } else {
        const response = await authApi.login(email, password, remember);

        if (response.success) {
          this.currentUser = response.data.user;
          this.storeAuthData(response.data);
          return {
            user: response.data.user,
            session: response.data,
          };
        }
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      throw new Error(this.formatAuthError(error));
    }
  }

  // Sign in with OAuth provider
  async signInWithProvider(provider) {
    if (!this.useSupabase) {
      throw new Error("OAuth sign-in is only available with Supabase");
    }

    try {
      const result = await supabaseAuth.signInWithProvider(provider);
      return result;
    } catch (error) {
      console.error(`${provider} sign-in failed:`, error);
      throw new Error(this.formatAuthError(error));
    }
  }

  // Sign out user
  async signOut() {
    try {
      if (this.useSupabase) {
        await supabaseAuth.signOut();
      } else {
        await authApi.logout();
      }

      this.currentUser = null;
      this.clearAuthData();
    } catch (error) {
      console.error("Sign out failed:", error);
      // Even if server sign-out fails, clear local data
      this.currentUser = null;
      this.clearAuthData();
      throw new Error("Sign out failed");
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Get user role
  getUserRole() {
    if (!this.currentUser) return null;

    if (this.useSupabase) {
      return this.currentUser.user_metadata?.role || "user";
    } else {
      return this.currentUser.role || "user";
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      if (this.useSupabase) {
        const result = await supabaseAuth.updateUser(updates);
        this.currentUser = result.user;

        // Also update the profile table
        await supabaseDb.profiles.update(this.currentUser.id, updates);

        return result.user;
      } else {
        const response = await api.put("/user/profile", updates);

        if (response.success) {
          this.currentUser = { ...this.currentUser, ...response.data };
          this.updateStoredUser(this.currentUser);
          return this.currentUser;
        }
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      throw new Error(this.formatAuthError(error));
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      if (this.useSupabase) {
        // Supabase requires re-authentication for password change
        await supabaseAuth.signIn(this.currentUser.email, currentPassword);
        await supabaseAuth.updatePassword(newPassword);
      } else {
        await authApi.changePassword(currentPassword, newPassword);
      }
    } catch (error) {
      console.error("Password change failed:", error);
      throw new Error(this.formatAuthError(error));
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      if (this.useSupabase) {
        await supabaseAuth.resetPassword(email);
      } else {
        await authApi.forgotPassword(email);
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      throw new Error(this.formatAuthError(error));
    }
  }

  // Verify token (for custom backend)
  async verifyToken() {
    if (this.useSupabase) return true;

    try {
      const response = await authApi.verifyToken();
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Create user profile in database
  async createUserProfile(user, additionalData = {}) {
    if (!this.useSupabase) return;

    try {
      const profile = {
        id: user.id,
        email: user.email,
        full_name: additionalData.fullName || "",
        role: additionalData.role || "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...additionalData,
      };

      await supabaseDb.profiles.create(profile);
    } catch (error) {
      console.error("Failed to create user profile:", error);
      // Don't throw error as sign-up was successful
    }
  }

  // Sync user profile from database
  async syncUserProfile(user) {
    if (!this.useSupabase) return;

    try {
      const profile = await supabaseDb.profiles.get(user.id);
      if (profile) {
        this.currentUser = { ...user, ...profile };
      }
    } catch (error) {
      console.error("Failed to sync user profile:", error);
    }
  }

  // Store authentication data (for custom backend)
  storeAuthData(data) {
    if (this.useSupabase) return;

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));

    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
  }

  // Update stored user data
  updateStoredUser(user) {
    if (this.useSupabase) return;
    localStorage.setItem("userData", JSON.stringify(user));
  }

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberMe");
  }

  // Format authentication errors
  formatAuthError(error) {
    if (this.useSupabase) {
      switch (error?.message) {
        case "Invalid login credentials":
          return "Invalid email or password";
        case "Email not confirmed":
          return "Please check your email and click the confirmation link";
        case "Too many signup requests":
          return "Too many signup attempts. Please try again later";
        case "User already registered":
          return "An account with this email already exists";
        default:
          return error?.message || "Authentication failed";
      }
    } else {
      return handleApiError(error);
    }
  }

  // Get authentication headers for API calls
  getAuthHeaders() {
    if (this.useSupabase) {
      // Supabase client handles auth headers automatically
      return {};
    } else {
      const token = localStorage.getItem("authToken");
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
  }

  // Get user progress
  async getUserProgress() {
    try {
      if (this.useSupabase) {
        return await supabaseDb.progress.get(this.currentUser?.id);
      } else {
        const response = await api.get("/user/progress");
        return response.success ? response.data : null;
      }
    } catch (error) {
      console.error("Failed to get user progress:", error);
      return null;
    }
  }

  // Update user progress
  async updateUserProgress(progressData) {
    try {
      if (this.useSupabase) {
        return await supabaseDb.progress.upsert({
          user_id: this.currentUser?.id,
          ...progressData,
          updated_at: new Date().toISOString(),
        });
      } else {
        const response = await api.put("/user/progress", progressData);
        return response.success ? response.data : null;
      }
    } catch (error) {
      console.error("Failed to update user progress:", error);
      throw error;
    }
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
