// src/components/SpeechModal.jsx

import { createSignal } from "solid-js";

const SpeechModal = (props) => {
  const [isListening, setIsListening] = createSignal(false);
  const [recognition, setRecognition] = createSignal(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = 'ru-RU';
    recog.onresult = (event) => {
      const command = event.results[0][0].transcript;
      props.onCommand(command);
      stopListening();
    };
    recog.onerror = (event) => {
      console.error(event.error);
      stopListening();
    };
    recog.start();
    setRecognition(recog);
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognition()) {
      recognition().stop();
      setRecognition(null);
    }
    setIsListening(false);
  };

  return (
    <div class="speech-modal">
      <div class="speech-modal-header">
        <span>Я, AnoSpeech. Слушаю вашу команду</span>
        <button onClick={props.onClose}>
          <i class="ri-close-line"></i>
        </button>
      </div>
      <div class="speech-modal-controls">
        <button 
          onClick={isListening() ? stopListening : startListening}
          classList={{ recording: isListening() }}
        >
          <i class={isListening() ? "ri-mic-fill" : "ri-mic-line"}></i>
        </button>
      </div>
    </div>
  );
};

export default SpeechModal;