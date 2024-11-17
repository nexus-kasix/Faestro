// SpeechModal.jsx
import { createSignal, Show } from "solid-js";
import { AIService } from '../../services/speech_ai/aiService';

const SpeechModal = ({ onClose, onCommand }) => {
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [aiResponse, setAiResponse] = createSignal('');
  const [textInput, setTextInput] = createSignal('');
  const [isListening, setIsListening] = createSignal(false);
  const [recognition, setRecognition] = createSignal(null);
  const [showLangSelect, setShowLangSelect] = createSignal(false);
  const [selectedLang, setSelectedLang] = createSignal('ru-RU');
  const aiService = new AIService();

  // Add new state signals
  const [showHistory, setShowHistory] = createSignal(false);
  const [chatHistory, setChatHistory] = createSignal([]);
  
  // Инициализация и настройка распознавания речи
  const createSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const instance = new SpeechRecognition();
    instance.continuous = false;
    instance.interimResults = true;
    instance.lang = selectedLang();

    instance.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setTextInput(transcript);
    };

    instance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      stopListening();
    };

    instance.onend = () => {
      setIsListening(false);
      setShowLangSelect(false);
    };

    return instance;
  };

  // Управление распознаванием речи
  const startListening = () => {
    try {
      const recognitionInstance = recognition() || createSpeechRecognition();
      if (!recognitionInstance) {
        alert("Speech recognition is not supported in your browser.");
        return;
      }

      setRecognition(recognitionInstance);
      recognitionInstance.start();
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      stopListening();
    }
  };

  const stopListening = () => {
    try {
      const currentRecognition = recognition();
      if (currentRecognition) {
        currentRecognition.stop();
        setRecognition(null);
      }
      setIsListening(false);
      setShowLangSelect(false);
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
  };

  // Обработка ввода и отправки
  const handleSubmit = async () => {
    const text = textInput().trim();
    if (!text) return;

    setIsProcessing(true);
    try {
      const response = await aiService.processQuery(text);
      setAiResponse(response);
      
      // Add to chat history
      setChatHistory([...chatHistory(), { query: text, response }]);
      
      // Проверяем, является ли ответ командой
      if (response.toLowerCase().includes('command:')) {
        const command = response.split('command:')[1].trim();
        onCommand?.(command);
      }
    } catch (error) {
      console.error('AI Error:', error);
      setAiResponse('Sorry, an error occurred while processing your request.');
    } finally {
      setIsProcessing(false);
      setTextInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isProcessing()) {
      handleSubmit();
    }
  };

  const handleActionButton = () => {
    if (textInput().trim()) {
      handleSubmit();
    } else {
      if (isListening()) {
        stopListening();
      } else {
        setShowLangSelect(true); // Показываем выбор языка перед началом з��писи
      }
    }
  };

  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
    setShowLangSelect(false);
    startListening();
  };

  // Add new handlers
  const handleNewChat = () => {
    setChatHistory([]);
    setAiResponse('');
    setTextInput('');
  };

  // Получение состояния и иконки кнопки действия
  const getActionButtonState = () => {
    if (isProcessing()) return { icon: 'loader-4-line', class: 'processing' };
    if (isListening()) return { icon: 'mic-fill', class: 'listening' };
    if (textInput().trim()) return { icon: 'send-plane-fill', class: '' };
    return { icon: 'mic-line', class: '' };
  };

  const getInputPlaceholder = () => {
    if (isProcessing()) return 'Processing...';
    if (isListening()) return 'Listening...';
    return 'Ask Faestro...';
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
          placeholder={getInputPlaceholder()}
          value={textInput()}
          onInput={(e) => setTextInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isProcessing() || isListening()}
        />
        <div class="faestro-speech-controls">
          <Show when={showLangSelect()}>
            <div class="language-select">
              <button onClick={() => handleLanguageSelect('ru-RU')}>RU</button>
              <button onClick={() => handleLanguageSelect('en-US')}>EN</button>
              <button 
                onClick={() => setShowLangSelect(false)} 
                class="language-select-cancel"
                title="Cancel"
              >
                <i class="ri-close-line"></i>
              </button>
            </div>
          </Show>
          <button 
            onClick={handleActionButton}
            class={`faestro-speech-action ${getActionButtonState().class}`}
            disabled={isProcessing()}
            title={isProcessing() ? 'Processing...' : isListening() ? 'Stop listening' : textInput().trim() ? 'Send message' : 'Start listening'}
          >
            <i class={`ri-${getActionButtonState().icon}`}></i>
          </button>
        </div>
      </div>

      <div class="faestro-speech-actions">
        <button 
          onClick={() => setShowHistory(!showHistory())} 
          class="faestro-history-btn"
          title={showHistory() ? "Hide Context" : "Show Context"}
        >
          <i class="ri-history-line"></i>
          {showHistory() ? "Hide Context" : "Show Context"}
        </button>
        <button 
          onClick={handleNewChat} 
          class="faestro-new-chat-btn"
          title="Start New Chat"
        >
          <i class="ri-add-line"></i>
          New Chat
        </button>
        <a 
          href="https://o6c3udfvdn1.typeform.com/to/vaOM1E4w" 
          target="_blank" 
          class="faestro-report-btn"
          title="Report an Issue"
        >
          <i class="ri-flag-line"></i>
          Report
        </a>
      </div>

      <Show when={showHistory()}>
        <div class="faestro-chat-history">
          {chatHistory().map((chat, index) => (
            <div class="history-item" key={index}>
              <div class="history-query">
                <i class="ri-user-line"></i>
                <p>{chat.query}</p>
              </div>
              <div class="history-response">
                <i class="ri-robot-line"></i>
                <p>{chat.response}</p>
              </div>
            </div>
          ))}
        </div>
      </Show>

      <Show when={aiResponse()}>
        <div class="faestro-speech-response">
          <p>{aiResponse()}</p>
        </div>
      </Show>

    <div class="faestro-speech-disclaimer">
      <p class="preview-notice">⚠️ Speech AI is currently in Preview (Experimental)</p>
      <p>AI responses do not represent the views of Nexus Projects and may contain errors.</p>
    </div>
  </div>
  );
};

export default SpeechModal;