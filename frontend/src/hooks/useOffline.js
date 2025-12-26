import { useState, useEffect, useCallback } from "react";

const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  // Update online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        console.log("Connection restored");
        // You could show a toast notification here
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      console.log("Connection lost");
      // You could show an offline indicator here
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  // Function to check if we can reach the server
  const checkConnectivity = useCallback(async () => {
    if (!navigator.onLine) {
      return false;
    }

    try {
      // Try to fetch a small resource from your server
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-cache",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      return response.ok;
    } catch (error) {
      console.warn("Connectivity check failed:", error);
      return false;
    }
  }, []);

  // Function to queue operations while offline
  const queueOperation = useCallback((operation) => {
    const queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
    const queueItem = {
      id: Date.now() + Math.random(),
      operation,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };

    queue.push(queueItem);
    localStorage.setItem("offlineQueue", JSON.stringify(queue));

    return queueItem.id;
  }, []);

  // Function to process queued operations when back online
  const processQueue = useCallback(async () => {
    const queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]");

    if (queue.length === 0) {
      return { processed: 0, failed: 0 };
    }

    let processed = 0;
    let failed = 0;
    const remainingQueue = [];

    for (const item of queue) {
      try {
        // Process the queued operation
        await item.operation();
        processed++;
        console.log(`Processed queued operation ${item.id}`);
      } catch (error) {
        console.error(`Failed to process queued operation ${item.id}:`, error);

        // Retry logic
        item.retryCount = (item.retryCount || 0) + 1;
        if (item.retryCount < 3) {
          remainingQueue.push(item);
        } else {
          failed++;
          console.error(`Giving up on operation ${item.id} after 3 retries`);
        }
      }
    }

    // Update the queue with remaining items
    localStorage.setItem("offlineQueue", JSON.stringify(remainingQueue));

    return { processed, failed, remaining: remainingQueue.length };
  }, []);

  // Function to save data locally while offline
  const saveLocally = useCallback((key, data) => {
    try {
      const localData = JSON.parse(localStorage.getItem("offlineData") || "{}");
      localData[key] = {
        data,
        timestamp: new Date().toISOString(),
        synced: false,
      };
      localStorage.setItem("offlineData", JSON.stringify(localData));
      return true;
    } catch (error) {
      console.error("Failed to save data locally:", error);
      return false;
    }
  }, []);

  // Function to get locally saved data
  const getLocalData = useCallback((key) => {
    try {
      const localData = JSON.parse(localStorage.getItem("offlineData") || "{}");
      return localData[key] || null;
    } catch (error) {
      console.error("Failed to get local data:", error);
      return null;
    }
  }, []);

  // Function to sync local data when back online
  const syncLocalData = useCallback(async (syncFunction) => {
    try {
      const localData = JSON.parse(localStorage.getItem("offlineData") || "{}");
      const unsyncedData = Object.entries(localData).filter(
        ([_, item]) => !item.synced
      );

      if (unsyncedData.length === 0) {
        return { synced: 0, failed: 0 };
      }

      let synced = 0;
      let failed = 0;

      for (const [key, item] of unsyncedData) {
        try {
          await syncFunction(key, item.data);

          // Mark as synced
          localData[key].synced = true;
          synced++;
        } catch (error) {
          console.error(`Failed to sync data for key ${key}:`, error);
          failed++;
        }
      }

      // Update local storage
      localStorage.setItem("offlineData", JSON.stringify(localData));

      return { synced, failed };
    } catch (error) {
      console.error("Failed to sync local data:", error);
      return { synced: 0, failed: 0 };
    }
  }, []);

  // Auto-process queue when coming back online
  useEffect(() => {
    if (isOnline && wasOffline) {
      const timer = setTimeout(() => {
        processQueue().then((result) => {
          if (result.processed > 0) {
            console.log(`Processed ${result.processed} queued operations`);
          }
          if (result.failed > 0) {
            console.warn(`Failed to process ${result.failed} operations`);
          }
        });
      }, 1000); // Wait 1 second after coming online

      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline, processQueue]);

  return {
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    checkConnectivity,
    queueOperation,
    processQueue,
    saveLocally,
    getLocalData,
    syncLocalData,
  };
};

export default useOffline;
