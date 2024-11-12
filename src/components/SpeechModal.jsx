// SpeechModal.jsx
import { createSignal } from "solid-js";
import { AIService } from '../services/aiService';

const SpeechModal = ({ onClose, onCommand }) => {
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [aiResponse, setAiResponse] = createSignal('');
  const aiService = new AIService();
  const [isRecording, setIsRecording] = createSignal(false);
  const [recognition, setRecognition] = createSignal(null);
  const [textInput, setTextInput] = createSignal('');
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

  const processWithAI = async (text) => {
    setIsProcessing(true);
    try {
      const response = await aiService.processQuery(text);
      setAiResponse(response);
      // If response contains a command, execute it
      if (response.startsWith('command:')) {
        onCommand(response.substring(8));
      }
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (textInput().trim()) {
      await processWithAI(textInput());
      setTextInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div class="faestro-speech">
      <div class="faestro-speech-header">
        <div class="faestro-speech-title">
          <i class="ri-robot-line"></i>
          <span>Faestro Speech</span>
        </div>
        <button onClick={onClose} class="faestro-speech-close">
          <i class="ri-close-line"></i>
        </button>
      </div>
      <div class="faestro-speech-input-container">
        <div class="faestro-speech-ai-icon">
          <i class={`ri-brain-${isProcessing() ? 'fill' : 'line'}`}></i>
        </div>
        <input
          type="text"
          placeholder={isProcessing() ? 'Processing...' : 'Ask Faestro...'}
          value={textInput()}
          onInput={(e) => setTextInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isProcessing()}
        />
        <button 
          onClick={handleSubmit}
          class={`faestro-speech-action ${isProcessing() ? 'processing' : ''}`}
          disabled={isProcessing()}
        >
          <i class={`ri-${isProcessing() ? 'loader-4-line' : textInput() ? 'send-plane-fill' : 'mic-line'}`}></i>
        </button>
      </div>
      <Show when={aiResponse()}>
        <div class="faestro-speech-response">
          <p>{aiResponse()}</p>
        </div>
      </Show>
      <div class="faestro-speech-footer">
        <select value={selectedLanguage()} onChange={(e) => setSelectedLanguage(e.target.value)}>
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
};

export default SpeechModal;