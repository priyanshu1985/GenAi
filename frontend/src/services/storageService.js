import { supabaseStorage } from "./supabaseClient";
import api, { voiceApi } from "./api";

// Storage service that works with both Supabase Storage and custom backend
class StorageService {
  constructor() {
    this.useSupabase = import.meta.env.VITE_USE_SUPABASE === "true";
    this.buckets = {
      recordings: "voice-recordings",
      profiles: "user-profiles",
      lessons: "lesson-content",
      exports: "data-exports",
    };
  }

  // Upload audio recording
  async uploadRecording(audioBlob, metadata = {}) {
    try {
      if (this.useSupabase) {
        const { userId, sessionId, lessonId, timestamp } = metadata;
        const fileName = this.generateRecordingFileName(
          userId,
          sessionId,
          lessonId,
          timestamp
        );

        const uploadResult = await supabaseStorage.upload(
          this.buckets.recordings,
          fileName,
          audioBlob,
          {
            contentType: "audio/wav",
            cacheControl: "3600",
          }
        );

        const publicUrl = supabaseStorage.getPublicUrl(
          this.buckets.recordings,
          fileName
        );

        return {
          path: uploadResult.path,
          url: publicUrl,
          fileName: fileName,
          size: audioBlob.size,
        };
      } else {
        const response = await voiceApi.uploadRecording(audioBlob, metadata);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to upload recording:", error);
      throw new Error("Failed to upload audio recording");
    }
  }

  // Upload user avatar
  async uploadAvatar(userId, imageFile) {
    try {
      if (this.useSupabase) {
        const fileName = `${userId}/avatar_${Date.now()}.${this.getFileExtension(
          imageFile.name
        )}`;

        const uploadResult = await supabaseStorage.upload(
          this.buckets.profiles,
          fileName,
          imageFile,
          {
            contentType: imageFile.type,
            cacheControl: "3600",
            upsert: true,
          }
        );

        const publicUrl = supabaseStorage.getPublicUrl(
          this.buckets.profiles,
          fileName
        );

        return {
          path: uploadResult.path,
          url: publicUrl,
          fileName: fileName,
        };
      } else {
        const formData = new FormData();
        formData.append("avatar", imageFile);

        const response = await api.upload("/user/avatar", formData);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      throw new Error("Failed to upload avatar image");
    }
  }

  // Download file
  async downloadFile(bucket, path) {
    try {
      if (this.useSupabase) {
        const blob = await supabaseStorage.download(bucket, path);
        return blob;
      } else {
        const response = await api.download(`/files/${bucket}/${path}`);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to download file:", error);
      throw new Error("Failed to download file");
    }
  }

  // Delete file
  async deleteFile(bucket, path) {
    try {
      if (this.useSupabase) {
        await supabaseStorage.remove(bucket, [path]);
      } else {
        await api.delete(`/files/${bucket}/${path}`);
      }
      return true;
    } catch (error) {
      console.error("Failed to delete file:", error);
      throw new Error("Failed to delete file");
    }
  }

  // List files in a directory
  async listFiles(bucket, path = "", options = {}) {
    try {
      if (this.useSupabase) {
        return await supabaseStorage.list(bucket, path, options);
      } else {
        const response = await api.get(`/files/${bucket}`, {
          path,
          ...options,
        });
        return response.data;
      }
    } catch (error) {
      console.error("Failed to list files:", error);
      throw new Error("Failed to list files");
    }
  }

  // Get public URL for a file
  getPublicUrl(bucket, path) {
    if (this.useSupabase) {
      return supabaseStorage.getPublicUrl(bucket, path);
    } else {
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
      return `${baseUrl}/files/${bucket}/${path}`;
    }
  }

  // Upload lesson content (for admin/worker use)
  async uploadLessonContent(lessonId, files) {
    try {
      const results = [];

      for (const file of files) {
        const fileName = `${lessonId}/${file.name}`;

        if (this.useSupabase) {
          const uploadResult = await supabaseStorage.upload(
            this.buckets.lessons,
            fileName,
            file,
            {
              contentType: file.type,
              cacheControl: "3600",
            }
          );

          const publicUrl = supabaseStorage.getPublicUrl(
            this.buckets.lessons,
            fileName
          );

          results.push({
            path: uploadResult.path,
            url: publicUrl,
            fileName: fileName,
            originalName: file.name,
            type: file.type,
            size: file.size,
          });
        } else {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("lessonId", lessonId);

          const response = await api.upload("/lessons/content", formData);
          results.push(response.data);
        }
      }

      return results;
    } catch (error) {
      console.error("Failed to upload lesson content:", error);
      throw new Error("Failed to upload lesson content");
    }
  }

  // Export data (for analytics/reports)
  async exportData(exportType, data, format = "csv") {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `export_${exportType}_${timestamp}.${format}`;

      let blob;
      if (format === "csv") {
        blob = new Blob([this.convertToCSV(data)], { type: "text/csv" });
      } else if (format === "json") {
        blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
      } else {
        throw new Error("Unsupported export format");
      }

      if (this.useSupabase) {
        const uploadResult = await supabaseStorage.upload(
          this.buckets.exports,
          fileName,
          blob,
          {
            contentType: blob.type,
            cacheControl: "3600",
          }
        );

        const publicUrl = supabaseStorage.getPublicUrl(
          this.buckets.exports,
          fileName
        );

        return {
          path: uploadResult.path,
          url: publicUrl,
          fileName: fileName,
        };
      } else {
        const formData = new FormData();
        formData.append("file", blob, fileName);
        formData.append("type", exportType);

        const response = await api.upload("/exports", formData);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to export data:", error);
      throw new Error("Failed to export data");
    }
  }

  // Save data locally for offline use
  saveLocalData(key, data) {
    try {
      const storageData = {
        data,
        timestamp: new Date().toISOString(),
        version: 1,
      };

      localStorage.setItem(`local_${key}`, JSON.stringify(storageData));
      return true;
    } catch (error) {
      console.error("Failed to save data locally:", error);
      return false;
    }
  }

  // Get locally saved data
  getLocalData(key) {
    try {
      const stored = localStorage.getItem(`local_${key}`);
      if (!stored) return null;

      const parsed = JSON.parse(stored);

      // Check if data is too old (older than 24 hours)
      const ageMs = Date.now() - new Date(parsed.timestamp).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (ageMs > maxAge) {
        localStorage.removeItem(`local_${key}`);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error("Failed to get local data:", error);
      return null;
    }
  }

  // Clear local data
  clearLocalData(key) {
    try {
      if (key) {
        localStorage.removeItem(`local_${key}`);
      } else {
        // Clear all local data
        const keys = Object.keys(localStorage).filter((k) =>
          k.startsWith("local_")
        );
        keys.forEach((k) => localStorage.removeItem(k));
      }
    } catch (error) {
      console.error("Failed to clear local data:", error);
    }
  }

  // Cache management for offline support
  async cacheFile(url, key) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      // Store in IndexedDB for larger files
      if (blob.size > 5 * 1024 * 1024) {
        // 5MB threshold
        return await this.storeInIndexedDB(key, blob);
      } else {
        // Store in localStorage for smaller files
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            try {
              localStorage.setItem(`cache_${key}`, reader.result);
              resolve(true);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch (error) {
      console.error("Failed to cache file:", error);
      return false;
    }
  }

  // Get cached file
  async getCachedFile(key) {
    try {
      // Try localStorage first
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        return cached;
      }

      // Try IndexedDB
      return await this.getFromIndexedDB(key);
    } catch (error) {
      console.error("Failed to get cached file:", error);
      return null;
    }
  }

  // Helper methods
  generateRecordingFileName(userId, sessionId, lessonId, timestamp) {
    const now = timestamp || new Date().toISOString().replace(/[:.]/g, "-");
    return `${userId}/${sessionId || "session"}/${
      lessonId || "lesson"
    }/recording_${now}.wav`;
  }

  getFileExtension(filename) {
    return filename.split(".").pop().toLowerCase();
  }

  convertToCSV(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return "";
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape commas and quotes in CSV
            if (
              typeof value === "string" &&
              (value.includes(",") || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    return csvContent;
  }

  // IndexedDB helpers for large file caching
  async storeInIndexedDB(key, blob) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("FileCache", 1);

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files", { keyPath: "key" });
        }
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(["files"], "readwrite");
        const store = transaction.objectStore("files");

        store.put({
          key: key,
          blob: blob,
          timestamp: Date.now(),
        });

        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
      };
    });
  }

  async getFromIndexedDB(key) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("FileCache", 1);

      request.onerror = () => reject(request.error);

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(["files"], "readonly");
        const store = transaction.objectStore("files");
        const getRequest = store.get(key);

        getRequest.onsuccess = () => {
          const result = getRequest.result;
          if (result) {
            // Check if cached file is too old (older than 7 days)
            const ageMs = Date.now() - result.timestamp;
            const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

            if (ageMs > maxAge) {
              // Remove expired cache
              store.delete(key);
              resolve(null);
            } else {
              resolve(result.blob);
            }
          } else {
            resolve(null);
          }
        };

        getRequest.onerror = () => reject(getRequest.error);
      };
    });
  }
}

// Create singleton instance
const storageService = new StorageService();

export default storageService;
