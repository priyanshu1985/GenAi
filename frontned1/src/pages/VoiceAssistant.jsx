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
  const messageIdRef = useRef(0);

  // Define addMessage first (before useEffect that uses it)
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
  }, []);

  // Play audio - handles both browser TTS and generated audio
  const playAudio = useCallback((audioResponse) => {
    console.log("🔊 AUDIO PLAYBACK: Starting audio player...");

    try {
      setIsPlaying(true);

      if (!audioResponse) {
        console.warn("⚠️ AUDIO: No audio data provided");
        setIsPlaying(false);
        return;
      }

      // Handle object-based audio response from backend
      if (typeof audioResponse === "object") {
        console.log("🎵 AUDIO TYPE:", audioResponse.tts_type || "Unknown");

        if (audioResponse.tts_type === "browser") {
          const utterance = new SpeechSynthesisUtterance(audioResponse.text);
          utterance.lang = audioResponse.language_tag || "hi-IN";

          if (audioResponse.voice_config) {
            utterance.rate = audioResponse.voice_config.rate || 1.0;
            utterance.pitch = audioResponse.voice_config.pitch || 1.0;
            utterance.volume = audioResponse.voice_config.volume || 1.0;
          }

          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);

          speechSynthesis.speak(utterance);
          return;
        } else if (audioResponse.tts_type === "generated" && audioResponse.audio_base64) {
          const format = audioResponse.audio_format || "flac";
          const audio = new Audio(`data:audio/${format};base64,${audioResponse.audio_base64}`);
          audioRef.current = audio;

          audio.onended = () => setIsPlaying(false);
          audio.onerror = () => setIsPlaying(false);

          audio.play().catch(() => setIsPlaying(false));
          return;
        }
      }

      // Fallback: treat as direct base64 string
      if (typeof audioResponse === "string") {
        const audio = new Audio(`data:audio/mp3;base64,${audioResponse}`);
        audioRef.current = audio;

        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);

        audio.play().catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(false);
      }
    } catch (err) {
      setIsPlaying(false);
      console.error("❌ AUDIO EXCEPTION:", err.message || err);
    }
  }, []);

  // Process text input (from speech or typing) through AI pipeline
  const processTextInput = useCallback(
    async (inputText) => {
      if (!inputText || inputText.trim() === "") {
        setError("No text to process. Please speak or type something.");
        return;
      }

      if (!childId) {
        setError("Please select a child profile");
        return;
      }

      setIsProcessing(true);
      addMessage("user", inputText.trim());

      try {
        const response = await aiAPI.interactWithText(inputText.trim(), childId);

        if (response.data) {
          const aiText =
            response.data.ai_text_response ||
            response.data.response ||
            "I didn't understand that. Could you try again?";
          const audioResponse = response.data.audio_response;

          addMessage("assistant", aiText, audioResponse);

          if (audioResponse) {
            playAudio(audioResponse);
          }
        } else {
          addMessage("assistant", "I'm having trouble processing your request. Please try again.");
        }
      } catch (err) {
        console.error("❌ TEXT API FAILED:", err.message);

        let userFriendlyMessage = "Failed to process your request";
        if (err.status === 429 || err.response?.status === 429) {
          userFriendlyMessage = "Too many requests. Please wait a moment and try again.";
        } else if (err.status === 500 || err.response?.status === 500) {
          userFriendlyMessage = "Server error. Please try again later.";
        } else if (!navigator.onLine) {
          userFriendlyMessage = "No internet connection. Please check your network.";
        }

        setError(userFriendlyMessage);
      } finally {
        setIsProcessing(false);
      }
    },
    [childId, addMessage, playAudio]
  );

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "hi-IN";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      processTextInput(transcript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      let errorMessage = "Speech recognition failed";
      switch (event.error) {
        case "no-speech":
          errorMessage = "No speech detected. Please speak clearly and try again.";
          break;
        case "audio-capture":
          errorMessage = "Microphone not accessible. Please check permissions.";
          break;
        case "not-allowed":
          errorMessage = "Microphone access denied. Please allow microphone permissions.";
          break;
        case "network":
          errorMessage = "Network error. Please check your internet connection.";
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      setError(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [processTextInput]);

  // Load children profiles
  const loadChildren = useCallback(async () => {
    try {
      const response = await aiAPI.getChildren();
      if (response.data?.children) {
        setChildren(response.data.children);
      } else if (Array.isArray(response.data)) {
        setChildren(response.data);
      }
    } catch (err) {
      console.error("❌ Could not load children profiles:", err.message);
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    // Check for Web Speech API support
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setSpeechSupported(true);
      initializeSpeechRecognition();
    } else {
      setSpeechSupported(false);
      setError("Speech recognition not supported. Please use Chrome or Safari.");
    }

    loadChildren();

    // Add initial greeting
    addMessage(
      "assistant",
      "Hi there! I'm your learning buddy. You can talk to me by pressing the microphone button or type your message below. What would you like to learn today?"
    );
  }, [initializeSpeechRecognition, loadChildren, addMessage]);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Start speech recognition
  const startListening = () => {
    if (!speechSupported) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      setError("Speech recognition not initialized. Please refresh the page.");
      return;
    }

    try {
      setError("");
      recognitionRef.current.start();
    } catch {
      setError("Could not start speech recognition. Please try again.");
    }
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // Handle text input submission
  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim() || isProcessing) return;

    const userText = textInput.trim();
    setTextInput("");
    await processTextInput(userText);
  };

  // Stop audio playback
  const stopAudio = () => {
    try {
      if (typeof speechSynthesis !== "undefined" && speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    } catch {
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
            className={`va-mic-btn ${isListening ? "listening" : ""} ${!speechSupported ? "disabled" : ""}`}
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing || !speechSupported}
            title={speechSupported ? (isListening ? "Stop listening" : "Start speech recognition") : "Speech recognition not supported"}
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
              {isProcessing ? <FaSpinner className="spinning" /> : <FaPaperPlane />}
            </button>
          </form>

          {/* Stop Audio Button */}
          {isPlaying && (
            <button className="va-stop-audio-btn" onClick={stopAudio} title="Stop Audio Playback">
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
