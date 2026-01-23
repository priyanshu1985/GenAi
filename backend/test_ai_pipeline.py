"""
Test Script for AI Pipeline
Run this to verify all AI components are working correctly.

Usage:
    python test_ai_pipeline.py
"""

import os
import sys

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()


# Emoji icons for better visualization
ICONS = {
    "pass": "✅",
    "fail": "❌",
    "skip": "⏭️",
    "info": "ℹ️",
    "warn": "⚠️",
    "run": "🔄",
    "config": "⚙️",
    "profile": "👶",
    "stt": "🎤",
    "llm": "🧠",
    "tts": "🔊",
    "pipeline": "🔗",
    "api": "🌐",
    "test": "🧪",
    "success": "🎉",
    "error": "💥",
    "clock": "⏱️",
    "key": "🔑",
    "speaker": "📢",
    "mic": "🎙️",
    "child": "💒",
    "teacher": "👩‍🏫",
    "book": "📚",
    "star": "⭐",
    "rocket": "🚀",
}


def print_banner():
    """Print a fancy banner"""
    print("\n")
    print("╔" + "═" * 58 + "╗")
    print("║" + " " * 58 + "║")
    print("║" + f"  {ICONS['rocket']} AI PIPELINE TEST SUITE {ICONS['test']}".center(56) + "║")
    print("║" + "  Voice-First Learning Assistant for Children".center(58) + "║")
    print("║" + " " * 58 + "║")
    print("╚" + "═" * 58 + "╝")


def print_header(title: str, icon: str = "test"):
    """Print a formatted section header"""
    emoji = ICONS.get(icon, "🔹")
    print("\n┌" + "─" * 58 + "┐")
    print(f"│  {emoji} {title}".ljust(60) + "│")
    print("└" + "─" * 58 + "┘")


def print_result(label: str, value, success: bool = True, icon: str = None):
    """Print a test result with icon"""
    if icon:
        status_icon = ICONS.get(icon, "•")
    else:
        status_icon = ICONS["pass"] if success else ICONS["fail"]

    # Truncate long values
    value_str = str(value)
    if len(value_str) > 40:
        value_str = value_str[:37] + "..."

    print(f"  {status_icon} {label}: {value_str}")


def print_subitem(text: str, icon: str = "info"):
    """Print a sub-item"""
    emoji = ICONS.get(icon, "•")
    print(f"      {emoji} {text}")


def test_config():
    """Test 1: Check configuration and API keys"""
    print_header("Configuration Check", "config")

    from config import validate_config, get_config_summary

    # Validate config
    validation = validate_config()
    print_result("Config Valid", validation["valid"], validation["valid"])

    if not validation["valid"]:
        print_result("Missing Keys", validation['missing_keys'], False)
        return False

    # Show config summary
    summary = get_config_summary()
    print_result("Hugging Face API", "Connected" if summary["hf_configured"] else "Missing", summary["hf_configured"], "key")
    print_result("OpenRouter API", "Connected" if summary["openrouter_configured"] else "Missing", summary["openrouter_configured"], "key")
    print_result("AI Mode", summary["ai_mode"], icon="info")

    return True


def test_profiles():
    """Test 2: Check child profiles"""
    print_header("Child Profiles", "profile")

    from AI.profiles import get_child_profile, get_profile_context, CHILD_PROFILES

    # List all profiles
    print_result("Profiles Loaded", f"{len(CHILD_PROFILES)} children", icon="child")

    print("\n  📋 Available Children:")
    for child_id, profile in CHILD_PROFILES.items():
        lang_flag = {"hindi": "🇮🇳", "english": "🇬🇧", "tamil": "🇮🇳", "telugu": "🇮🇳"}.get(profile.preferred_language, "🌍")
        print(f"      {ICONS['child']} {profile.name} (Age {profile.age}) - {lang_flag} {profile.preferred_language.title()}")

    # Test profile lookup
    test_profile = get_child_profile("child_001")
    if test_profile:
        print_result("Profile Lookup", f"Found: {test_profile.name}", True, "pass")
    else:
        print_result("Profile Lookup", "Not found", False)
        return False

    # Test context generation
    context = get_profile_context("child_001")
    print_result("Context Generation", f"{len(context)} characters", icon="book")

    return True


def test_stt_mock():
    """Test 3: Speech-to-Text (Mock mode)"""
    print_header("Speech-to-Text (Mock)", "stt")

    # Force mock mode for this test
    os.environ["AI_MODE"] = "mock"

    # Reload module to pick up mock mode
    from AI import stt
    import importlib
    importlib.reload(stt)

    print_result("Mode", "Mock (no API call)", icon="info")

    # Test with dummy audio bytes
    dummy_audio = b"dummy audio bytes for testing"
    text, language = stt.speech_to_text(dummy_audio)

    print_result("Transcribed Text", text, bool(text), "mic")
    print_result("Detected Language", language, icon="info")

    return bool(text)


def test_llm_mock():
    """Test 4: LLM Reasoning (Mock mode)"""
    print_header("LLM Reasoning (Mock)", "llm")

    os.environ["AI_MODE"] = "mock"

    from AI import llm
    import importlib
    importlib.reload(llm)

    print_result("Mode", "Mock (no API call)", icon="info")

    # Test text generation
    response = llm.generate_text("मुझे गिनती सिखाओ", child_id="child_001")

    print_result("Input", "मुझे गिनती सिखाओ", icon="mic")
    print_result("LLM Response", response, bool(response), "teacher")

    return bool(response)


def test_tts_mock():
    """Test 5: Text-to-Speech (Mock mode)"""
    print_header("Text-to-Speech (Mock)", "tts")

    os.environ["AI_MODE"] = "mock"

    from AI import tts
    import importlib
    importlib.reload(tts)

    print_result("Mode", "Mock (no API call)", icon="info")

    # Test TTS
    result = tts.text_to_speech("नमस्ते बच्चों!", language="hindi")

    print_result("TTS Type", result.get("tts_type"), icon="speaker")
    print_result("Language", result.get("language"), icon="info")
    print_result("Language Tag", result.get("language_tag", "N/A"), icon="info")

    return result.get("tts_type") is not None


def test_pipeline_mock():
    """Test 6: Complete Pipeline (Mock mode)"""
    print_header("Complete Pipeline (Mock)", "pipeline")

    os.environ["AI_MODE"] = "mock"

    from AI import pipeline
    import importlib
    importlib.reload(pipeline)

    print_result("Mode", "Mock (no API call)", icon="info")
    print(f"\n  {ICONS['run']} Running: STT → LLM → TTS")

    # Test complete pipeline
    dummy_audio = b"dummy audio bytes"
    result = pipeline.voice_to_voice(dummy_audio, child_id="child_001")

    print(f"\n  📊 Results:")
    print_result("Pipeline Success", result.get("success"), result.get("success", False))
    print_result("Transcribed", result.get("transcribed_text", "")[:30], icon="mic")
    print_result("AI Response", result.get("ai_text_response", "")[:30], icon="teacher")
    print_result("Audio Type", result.get("audio_response", {}).get("tts_type"), icon="speaker")

    return result.get("success", False)


def test_llm_live():
    """Test 7: LLM Reasoning (Live API call)"""
    print_header("LLM Reasoning (LIVE API)", "api")

    os.environ["AI_MODE"] = "live"

    from AI import llm
    import importlib
    importlib.reload(llm)

    print_result("Mode", "LIVE - Using OpenRouter API", icon="warn")
    print(f"  {ICONS['clock']} Making API call...")

    try:
        response = llm.generate_text(
            "Say hello to a 5-year-old child in Hindi. Keep it short.",
            child_id="child_001"
        )

        print_result("API Status", "Success", True, "api")
        print_result("Response", response, bool(response), "teacher")
        return bool(response) and len(response) > 10

    except Exception as e:
        print_result("API Call", str(e), False, "error")
        return False


def test_stt_live():
    """Test 8: Speech-to-Text (Live API call) - Requires audio file"""
    print_header("Speech-to-Text (LIVE API)", "api")

    # Check if test audio file exists
    test_audio_path = "test_audio.wav"

    if not os.path.exists(test_audio_path):
        print_result("Status", "Skipped - No test audio file", icon="skip")
        print(f"      {ICONS['info']} To test: Create a WAV file named 'test_audio.wav'")
        return None  # Skip, not fail

    os.environ["AI_MODE"] = "live"

    from AI import stt
    import importlib
    importlib.reload(stt)

    print_result("Mode", "LIVE - Using Hugging Face Whisper", icon="warn")
    print(f"  {ICONS['clock']} Making API call...")

    try:
        with open(test_audio_path, "rb") as f:
            audio_bytes = f.read()

        text, language = stt.speech_to_text(audio_bytes)

        print_result("API Status", "Success", True, "api")
        print_result("Transcribed", text, icon="mic")
        print_result("Language", language, icon="info")
        return bool(text)

    except Exception as e:
        print_result("API Call", str(e), False, "error")
        return False


def test_tts_live():
    """Test 9: Text-to-Speech (Live mode)"""
    print_header("Text-to-Speech (LIVE)", "api")

    os.environ["AI_MODE"] = "live"

    from AI import tts
    import importlib
    importlib.reload(tts)

    print_result("Mode", "Browser TTS (Recommended)", icon="info")

    try:
        result = tts.text_to_speech(
            "नमस्ते! आज हम गिनती सीखेंगे।",
            language="hindi",
            return_type="base64"
        )

        tts_type = result.get("tts_type")
        has_config = result.get("voice_config") is not None

        print_result("TTS Type", tts_type, icon="speaker")
        print_result("Language Tag", result.get("language_tag", "N/A"), icon="info")

        if result.get("voice_config"):
            config = result.get("voice_config")
            print(f"\n  🎛️ Voice Config:")
            print(f"      Rate: {config.get('rate', 'N/A')} | Pitch: {config.get('pitch', 'N/A')} | Volume: {config.get('volume', 'N/A')}")

        # Browser TTS is a valid success
        return tts_type in ["browser", "generated"]

    except Exception as e:
        print_result("TTS", str(e), False, "error")
        return False


def print_summary(results: dict):
    """Print final summary with emojis"""
    print("\n╔" + "═" * 58 + "╗")
    print("║" + f"  {ICONS['star']} TEST SUMMARY".ljust(58) + "║")
    print("╚" + "═" * 58 + "╝")

    passed = 0
    failed = 0
    skipped = 0

    for test_name, result in results.items():
        if result is None:
            status = f"{ICONS['skip']} SKIP"
            skipped += 1
        elif result:
            status = f"{ICONS['pass']} PASS"
            passed += 1
        else:
            status = f"{ICONS['fail']} FAIL"
            failed += 1

        print(f"  {status}  {test_name}")

    # Summary bar
    total = len(results)
    print("\n  " + "─" * 40)
    print(f"  📊 Total: {total} | {ICONS['pass']} Passed: {passed} | {ICONS['fail']} Failed: {failed} | {ICONS['skip']} Skipped: {skipped}")
    print("  " + "─" * 40)

    # Final message
    if failed == 0:
        print(f"\n  {ICONS['success']} All tests passed! Pipeline is ready to use.")
        print(f"  {ICONS['rocket']} Start the server: uvicorn main:app --reload")
    else:
        print(f"\n  {ICONS['error']} {failed} test(s) failed. Check errors above.")

    return failed == 0


def run_all_tests():
    """Run all tests and show summary"""
    print_banner()

    results = {}

    # Mock tests (no API calls)
    print(f"\n{ICONS['test']} MOCK TESTS (No API credits used)")
    print("─" * 45)

    results["1. Config"] = test_config()
    results["2. Profiles"] = test_profiles()
    results["3. STT (Mock)"] = test_stt_mock()
    results["4. LLM (Mock)"] = test_llm_mock()
    results["5. TTS (Mock)"] = test_tts_mock()
    results["6. Pipeline (Mock)"] = test_pipeline_mock()

    # Ask user about live tests
    print(f"\n\n{ICONS['api']} LIVE API TESTS")
    print("─" * 45)
    print(f"  {ICONS['warn']} These tests make actual API calls")
    print(f"  {ICONS['info']} This will use your API credits")

    run_live = input(f"\n  {ICONS['run']} Run live API tests? (y/n): ").strip().lower()

    if run_live == 'y':
        results["7. LLM (Live)"] = test_llm_live()
        results["8. STT (Live)"] = test_stt_live()
        results["9. TTS (Live)"] = test_tts_live()
    else:
        print(f"  {ICONS['skip']} Skipping live API tests.")

    # Print summary
    success = print_summary(results)

    return success


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
