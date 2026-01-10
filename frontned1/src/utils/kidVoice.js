export const speakLikeKid = (text) => {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();

  const softVoice =
    voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("google"))
    ) || voices[0];

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = softVoice;
  utterance.pitch = 1.6; // 👧 higher pitch
  utterance.rate = 0.6;  // 🐢 slow & clear
  utterance.volume = 1;

  synth.cancel();
  synth.speak(utterance);
};
