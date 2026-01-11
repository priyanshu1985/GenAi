import { useState, useRef, useEffect, useCallback } from "react";
import { aiAPI } from "../services/api";
import {
  FaMicrophone,
  FaStop,
  FaPaperPlane,
  FaVolumeUp,
  FaSpinner,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../styles/VoiceAssistant.css";

function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [childId, setChildId] = useState("child_001");
  const [children, setChildren] = useState([]);
  const [error, setError] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize Web Speech API and load children
  useEffect(() => {
    // Check for Web Speech API support
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setSpeechSupported(true);
      console.log("✅ Web Speech API supported");
      initializeSpeechRecognition();
    } else {
      setSpeechSupported(false);
      console.warn("❌ Web Speech API not supported in this browser");
      setError(
        "Speech recognition not supported. Please use Chrome or Safari."
      );
    }

    loadChildren();
    // Add initial greeting
    addMessage(
      "assistant",
      "Hi there! I'm your learning buddy. You can talk to me by pressing the microphone button or type your message below. What would you like to learn today?"
    );
  }, [addMessage, initializeSpeechRecognition]);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const loadChildren = async () => {
    try {
      console.log("📋 Loading children profiles...");
      const response = await aiAPI.getChildren();
      console.log("✅ API SUCCESS: Children profiles loaded", response.data);

      // Response structure: { success: true, data: { children: [...], count: n } }
      if (response.data?.children) {
        setChildren(response.data.children);
        console.log(
          "👦 Found",
          response.data.children.length,
          "child profiles"
        );
      } else if (Array.isArray(response.data)) {
        setChildren(response.data);
        console.log("👦 Found", response.data.length, "child profiles");
      }
    } catch (err) {
      console.error(
        "❌ API FAILED: Could not load children profiles",
        err.message
      );
    }
  };

  const initializeSpeechRecognition = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure speech recognition
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "hi-IN"; // Hindi by default, can be changed
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Speech recognition started");
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("🗣️ Speech recognized:", transcript);
      setIsListening(false);
      processTextInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);
      setIsListening(false);

      let errorMessage = "Speech recognition failed";
      switch (event.error) {
        case "no-speech":
          errorMessage =
            "No speech detected. Please speak clearly and try again.";
          break;
        case "audio-capture":
          errorMessage = "Microphone not accessible. Please check permissions.";
          break;
        case "not-allowed":
          errorMessage =
            "Microphone access denied. Please allow microphone permissions.";
          break;
        case "network":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;
        case "aborted":
          errorMessage = "Speech recognition was stopped.";
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      setError(errorMessage);
    };

    recognition.onend = () => {
      console.log("🔊 Speech recognition ended");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [processTextInput]);

  // Counter for unique message IDs
  const messageIdRef = useRef(0);

  const addMessage = useCallback((role, text, audioBase64 = null) => {
    messageIdRef.current += 1;
    const uniqueId = `${Date.now()}-${messageIdRef.current}`;
    setConversation((prev) => [
      ...prev,
      {
        id: uniqueId,
        role,
        text,
        audioBase64,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }, []); // Added missing useCallback closing and dependencies

  // Start speech recognition
  const startListening = () => {
    if (!speechSupported) {
      setError(
        "Speech recognition not supported in this browser. Please use Chrome or Safari."
      );
      return;
    }

    if (!recognitionRef.current) {
      setError("Speech recognition not initialized. Please refresh the page.");
      return;
    }

    try {
      console.log("🎤 Starting speech recognition...");
      setError("");
      recognitionRef.current.start();
    } catch (err) {
      console.error("❌ Failed to start speech recognition:", err);
      setError("Could not start speech recognition. Please try again.");
    }
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      console.log("⏹️ Stopping speech recognition...");
      recognitionRef.current.stop();
    }
  };

  // Process text input (from speech or typing) through AI pipeline
  const processTextInput = useCallback(
    async (inputText) => {
      console.log("🔄 Processing text input:", inputText);
      console.log("👦 Child profile:", childId);

      // Validate inputs
      if (!inputText || inputText.trim() === "") {
        console.error("❌ VALIDATION ERROR: No text to process");
        setError("No text to process. Please speak or type something.");
        return;
      }

      if (!childId) {
        console.error("❌ VALIDATION ERROR: No child profile selected");
        setError("Please select a child profile");
        return;
      }

      setIsProcessing(true);

      // Add user message
      addMessage("user", inputText.trim());
      addMessage("assistant", "...", null); // Placeholder while processing

      try {
        console.log(
          "🚀 💬 TEXT API CALL: Sending text to backend AI service..."
        );
        console.log("📊 TEXT DETAILS: Length=" + inputText.length + " chars");
        console.log("🕐 TIMESTAMP: " + new Date().toISOString());

        const startTime = Date.now();
        // Send text directly instead of audio
        const response = await aiAPI.interactWithText(
          inputText.trim(),
          childId
        );
        const endTime = Date.now();

        console.log(
          "✅ API SUCCESS: Text processing complete in " +
            (endTime - startTime) +
            "ms"
        );
        console.log("📋 FULL RESPONSE:", JSON.stringify(response, null, 2));
        console.log("🔍 RESPONSE SUCCESS:", response.success);
        console.log("🔍 RESPONSE DATA:", response.data);

        // Validate response structure
        if (!response.data) {
          console.warn("⚠️ WARNING: No data in API response");
          setError("Invalid response from server. Please try again.");
          setConversation((prev) => prev.filter((m) => m.text !== "..."));
          return;
        }

        setConversation((prev) => {
          const updated = [...prev];
          // Remove the "..." placeholder
          const filtered = updated.filter((m) => m.text !== "...");
          return filtered;
        });

        // Add AI response
        if (response.data) {
          const aiText =
            response.data.ai_text_response ||
            response.data.response ||
            "I didn't understand that. Could you try again?";
          const audioResponse = response.data.audio_response;

          console.log("🤖 AI replied:", aiText);
          console.log("🔊 Audio available:", !!audioResponse);

          addMessage("assistant", aiText, audioResponse);

          // Auto-play audio response if available
          if (audioResponse) {
            console.log("▶️ Playing AI response audio");
            playAudio(audioResponse);
          } else {
            console.log("🔇 No audio to play");
          }
        } else {
          console.warn("⚠️ No response data received");
          addMessage(
            "assistant",
            "I'm having trouble processing your request. Please try again."
          );
        }
      } catch (err) {
        console.error("❌ 💬 TEXT API FAILED: Text processing error");
        console.error("📊 ERROR OBJECT:", err);
        console.error("💥 ERROR MESSAGE:", err.message);
        console.error("📟 ERROR STATUS:", err.status || err.response?.status);
        console.error(
          "📄 ERROR RESPONSE:",
          err.response?.data || "No response data"
        );
        console.error(
          "🌐 API URL:",
          `${
            import.meta.env.VITE_API_BASE_URL ||
            "https://genai-7j5d.onrender.com"
          }/ai/text`
        );
        console.error("📤 REQUEST PAYLOAD:", {
          text: inputText.trim(),
          child_id: childId,
        });

        let userFriendlyMessage = "Failed to process your request";

        // Check for specific error types
        if (
          err.status === 429 ||
          err.response?.status === 429 ||
          (err.message && err.message.includes("429"))
        ) {
          userFriendlyMessage =
            "Too many requests. Please wait a moment and try again.";
        } else if (err.status === 500 || err.response?.status === 500) {
          userFriendlyMessage = "Server error. Please try again later.";
        } else if (!navigator.onLine) {
          userFriendlyMessage =
            "No internet connection. Please check your network and try again.";
        }

        setError(userFriendlyMessage);
        console.error("🔧 USER MESSAGE: " + userFriendlyMessage);

        // Remove placeholder message
        setConversation((prev) => prev.filter((m) => m.text !== "..."));
      } finally {
        setIsProcessing(false);
      }
    },
    [childId, addMessage]
  ); // Dependencies for useCallback

  // Handle text input submission
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim() || isProcessing) return;

    const userText = textInput.trim();
    setTextInput("");

    await processTextInput(userText);
  };

  // Play audio - handles both browser TTS and generated audio
  const playAudio = (audioResponse) => {
    console.log("🔊 AUDIO PLAYBACK: Starting audio player...");

    try {
      setIsPlaying(true);

      // Check if it's browser TTS or generated audio
      if (!audioResponse) {
        console.warn("⚠️ AUDIO: No audio data provided");
        setIsPlaying(false);
        return;
      }

      // Handle object-based audio response from backend
      if (typeof audioResponse === "object") {
        console.log("🎵 AUDIO TYPE:", audioResponse.tts_type || "Unknown");
        console.log(
          "🌍 LANGUAGE:",
          audioResponse.language_tag || "Not specified"
        );

        if (audioResponse.tts_type === "browser") {
          console.log("🗣️ PLAYBACK: Using Browser Speech Synthesis");
          // Use Web Speech API
          const utterance = new SpeechSynthesisUtterance(audioResponse.text);
          utterance.lang = audioResponse.language_tag || "hi-IN";

          if (audioResponse.voice_config) {
            utterance.rate = audioResponse.voice_config.rate || 1.0;
            utterance.pitch = audioResponse.voice_config.pitch || 1.0;
            utterance.volume = audioResponse.voice_config.volume || 1.0;
            console.log(
              "🎚️ VOICE CONFIG: Applied custom settings - Rate:",
              utterance.rate,
              "Pitch:",
              utterance.pitch,
              "Volume:",
              utterance.volume
            );
          }

          utterance.onstart = () =>
            console.log("▶️ SPEECH: Playback started successfully");
          utterance.onend = () => {
            console.log("✅ SPEECH: Playback completed successfully");
            setIsPlaying(false);
          };
          utterance.onerror = (e) => {
            console.error("❌ SPEECH ERROR: Synthesis failed -", e.error);
            setIsPlaying(false);
          };

          console.log("🎤 SPEECH TEXT:", audioResponse.text);
          speechSynthesis.speak(utterance);
          return;
        } else if (
          audioResponse.tts_type === "generated" &&
          audioResponse.audio_base64
        ) {
          console.log("🎵 PLAYBACK: Using generated audio file");
          // Use generated audio file
          const format = audioResponse.audio_format || "flac";
          console.log("📁 AUDIO FORMAT:", format);
          const audio = new Audio(
            `data:audio/${format};base64,${audioResponse.audio_base64}`
          );
          audioRef.current = audio;

          audio.onended = () => {
            console.log("✅ AUDIO: Playback completed successfully");
            setIsPlaying(false);
          };
          audio.onerror = (e) => {
            console.error("❌ AUDIO ERROR: Playback failed -", e.message || e);
            setIsPlaying(false);
          };

          console.log("▶️ AUDIO: Starting generated audio playback");
          audio.play().catch((playError) => {
            console.error(
              "❌ AUDIO PLAY ERROR:",
              playError.message || playError
            );
            setIsPlaying(false);
          });
          return;
        } else {
          console.warn(
            "⚠️ AUDIO WARNING: Unknown or unsupported audio format received"
          );
        }
      }

      // Fallback: treat as direct base64 string
      if (typeof audioResponse === "string") {
        console.log("📄 FALLBACK: Playing base64 audio string as MP3");
        const audio = new Audio(`data:audio/mp3;base64,${audioResponse}`);
        audioRef.current = audio;

        audio.onended = () => {
          console.log("✅ AUDIO: Fallback playback completed");
          setIsPlaying(false);
        };
        audio.onerror = (e) => {
          console.error(
            "❌ AUDIO ERROR: Fallback playback failed -",
            e.message || e
          );
          setIsPlaying(false);
        };

        console.log("▶️ AUDIO: Starting fallback playback");
        audio.play().catch((playError) => {
          console.error("❌ AUDIO PLAY ERROR:", playError.message || playError);
          setIsPlaying(false);
        });
      } else {
        console.error(
          "❌ AUDIO ERROR: Cannot play audio - unsupported format type:",
          typeof audioResponse
        );
        setIsPlaying(false);
      }
    } catch (err) {
      setIsPlaying(false);
      console.error("❌ AUDIO EXCEPTION: Playback error -", err.message || err);
    }
  };

  // Stop audio playback
  const stopAudio = () => {
    console.log("⏹️ AUDIO STOP: Stopping all audio playback...");

    try {
      // Stop Web Speech API
      if (typeof speechSynthesis !== "undefined" && speechSynthesis.speaking) {
        speechSynthesis.cancel();
        console.log("🗣️ SPEECH: Browser speech synthesis stopped");
      }

      // Stop audio element
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        console.log("🎵 AUDIO: Audio element stopped and reset");
      }

      setIsPlaying(false);
      console.log("✅ AUDIO: All playback stopped successfully");
    } catch (error) {
      console.error("❌ AUDIO STOP ERROR:", error.message || error);
      // Ensure state is reset even if stopping fails
      setIsPlaying(false);
    }
  };

  return (
    <div className="voice-assistant-page">
      <Navbar />

      <div className="voice-assistant-container">
        {/* Header */}
        <div className="va-header">
          <div className="va-avatar">
            <span>🦉</span>
          </div>
          <div className="va-header-info">
            <h1>Learning Buddy</h1>
            <p>Ask me anything! I'm here to help you learn.</p>
          </div>
          <div className="va-child-select">
            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="child-dropdown"
            >
              {children.length > 0 ? (
                children.map((child) => (
                  <option key={child.child_id} value={child.child_id}>
                    {child.name} ({child.preferred_language})
                  </option>
                ))
              ) : (
                <>
                  <option value="child_001">Aarav (Hindi)</option>
                  <option value="child_002">Priya (Hindi)</option>
                  <option value="child_003">Ravi (Tamil)</option>
                  <option value="child_005">Kiran (English)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="va-error">
            <span>{error}</span>
            <button onClick={() => setError("")}>Dismiss</button>
          </div>
        )}

        {/* Chat Area */}
        <div className="va-chat-area">
          {conversation.map((msg) => (
            <div key={msg.id} className={`va-message ${msg.role}`}>
              <div className="va-message-avatar">
                {msg.role === "assistant" ? "🦉" : "👤"}
              </div>
              <div className="va-message-content">
                <p>{msg.text}</p>
                <div className="va-message-footer">
                  <span className="va-message-time">{msg.timestamp}</span>
                  {msg.audioBase64 && (
                    <div className="va-audio-controls">
                      <button
                        className="va-play-btn"
                        onClick={() => playAudio(msg.audioBase64)}
                        disabled={isPlaying}
                      >
                        <FaVolumeUp /> Play
                      </button>
                      {isPlaying && (
                        <button className="va-stop-btn" onClick={stopAudio}>
                          <FaStop /> Stop
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="va-message assistant">
              <div className="va-message-avatar">🦉</div>
              <div className="va-message-content">
                <div className="va-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="va-input-area">
          {/* Voice Recognition Button */}
          <button
            className={`va-mic-btn ${isListening ? "listening" : ""} ${
              !speechSupported ? "disabled" : ""
            }`}
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || !speechSupported}
            title={
              speechSupported
                ? isListening
                  ? "Stop listening"
                  : "Start speech recognition"
                : "Speech recognition not supported"
            }
          >
            {isListening ? (
              <>
                <FaStop />
                <span className="listening-pulse"></span>
              </>
            ) : (
              <FaMicrophone />
            )}
          </button>

          {/* Text Input */}
          <form onSubmit={handleTextSubmit} className="va-text-form">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isListening || isProcessing}
              className="va-text-input"
            />
            <button
              type="submit"
              className="va-send-btn"
              disabled={!textInput.trim() || isProcessing || isListening}
            >
              {isProcessing ? (
                <FaSpinner className="spinning" />
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </form>

          {/* Stop Audio Button */}
          {isPlaying && (
            <button
              className="va-stop-audio-btn"
              onClick={stopAudio}
              title="Stop Audio Playback"
            >
              <FaStop /> Stop Audio
            </button>
          )}
        </div>

        {/* Listening Indicator */}
        {isListening && (
          <div className="va-listening-overlay">
            <div className="va-listening-indicator">
              <div className="listening-waves">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Listening...</p>
              <button onClick={stopListening} className="va-stop-btn">
                <FaStop /> Stop Listening
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceAssistant;
