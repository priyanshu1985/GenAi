import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component (to be used in App.jsx)
export const AuthProvider = ({ children }) => {
  const auth = useAuthState();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Main useAuth hook
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // If used outside of AuthProvider, return a standalone version
    return useAuthState();
  }
  return context;
};

// Core authentication state logic
const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
          const user = JSON.parse(userData);

          // Verify token is still valid
          const isValid = await verifyToken(token);

          if (isValid) {
            setUser(user);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
          }
        }
      } catch (err) {
        console.error("Failed to initialize auth state:", err);
        setError("Failed to restore session");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Verify token validity
  const verifyToken = async (token) => {
    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.ok;
    } catch (err) {
      console.error("Token verification failed:", err);
      return false;
    }
  };

  // Login function
  const login = useCallback(async (email, password, remember = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const { token, user: userData, expiresIn } = data;

      // Store authentication data
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));

      if (remember) {
        localStorage.setItem("rememberMe", "true");
      }

      // Set auth state
      setUser(userData);
      setIsAuthenticated(true);
      setError(null);

      // Set up token refresh if needed
      if (expiresIn) {
        scheduleTokenRefresh(expiresIn);
      }

      return userData;
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const { token, user: newUser } = data;

      // Store authentication data
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(newUser));

      // Set auth state
      setUser(newUser);
      setIsAuthenticated(true);
      setError(null);

      return newUser;
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        // Notify server about logout
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (err) {
      console.error("Logout API call failed:", err);
      // Continue with local logout even if server call fails
    } finally {
      // Clear local storage and state
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("rememberMe");

      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setIsLoading(false);

      // Clear any scheduled token refreshes
      if (window.tokenRefreshTimer) {
        clearTimeout(window.tokenRefreshTimer);
      }
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(
    async (updates) => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch("/api/auth/profile", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Profile update failed");
        }

        const updatedUser = { ...user, ...data.user };

        // Update stored user data
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUser(updatedUser);

        return updatedUser;
      } catch (err) {
        console.error("Profile update failed:", err);
        setError(err.message || "Profile update failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  // Change password
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password change failed");
      }

      return true;
    } catch (err) {
      console.error("Password change failed:", err);
      setError(err.message || "Password change failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Schedule token refresh
  const scheduleTokenRefresh = useCallback(
    (expiresIn) => {
      // Refresh token 5 minutes before expiration
      const refreshTime = (expiresIn - 300) * 1000;

      window.tokenRefreshTimer = setTimeout(async () => {
        try {
          const token = localStorage.getItem("authToken");

          const response = await fetch("/api/auth/refresh", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const { token: newToken, expiresIn: newExpiresIn } =
              await response.json();
            localStorage.setItem("authToken", newToken);

            if (newExpiresIn) {
              scheduleTokenRefresh(newExpiresIn);
            }
          } else {
            // Token refresh failed, logout user
            logout();
          }
        } catch (err) {
          console.error("Token refresh failed:", err);
          logout();
        }
      }, refreshTime);
    },
    [logout]
  );

  // Get auth header for API calls
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    getAuthHeader,
    clearError: () => setError(null),
  };
};

export default useAuth;
