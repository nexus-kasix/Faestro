// src/components/SpeechModal.jsx

import { createSignal } from "solid-js";

const SpeechModal = ({ onClose, onCommand }) => {
  const [isRecording, setIsRecording] = createSignal(false);
  const [recognition, setRecognition] = createSignal(null);
  const [selectedLanguage, setSelectedLanguage] = createSignal('ru');

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = selectedLanguage();
    recog.onresult = (event) => {
      const command = event.results[0][0].transcript;
      onCommand(command);
      stopListening();
    };
    recog.onerror = (event) => {
      console.error(event.error);
      stopListening();
    };
    recog.start();
    setRecognition(recog);
    setIsRecording(true);
  };

  const stopListening = () => {
    if (recognition()) {
      recognition().stop();
      setRecognition(null);
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording()) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div class="speech-modal">
      <div class="speech-modal-header">
        <span>Я, AnoSpeech. Слушаю вашу команду</span>
        <button onClick={onClose}>
          <i class="ri-close-line"></i>
        </button>
      </div>
      <div class="speech-modal-controls">
        <button 
          onClick={toggleRecording}
          class={isRecording() ? 'recording' : ''}
        >
          <i class={`ri-${isRecording() ? 'mic-fill' : 'mic-line'}`}></i>
        </button>
        <select value={selectedLanguage()} onChange={(e) => setSelectedLanguage(e.target.value)}>
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
};

export default SpeechModal;