// src/components/Main.jsx

import { createSignal, onMount, Show, For } from "solid-js";
import { commands } from "/src/commands/console.js";
import Welcome from './Welcome';
import LoadingScreen from './LoadingScreen';
import { loadAppResources } from "../utils/loader";
import SpeechModal from "./SpeechModal";

function Main() {
  const [logs, setLogs] = createSignal([]);
  const [command, setCommand] = createSignal("");
  const [isClearing, setIsClearing] = createSignal(false);
  const [isMoreOpen, setIsMoreOpen] = createSignal(false);
  const [showWelcome, setShowWelcome] = createSignal(true);
  const [deviceType, setDeviceType] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(true);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [showSpeechModal, setShowSpeechModal] = createSignal(false);

  onMount(async () => {
    await loadAppResources();
    
    // Проверяем сохраненные настройки
    const savedSettings = localStorage.getItem('faestro-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);

      if (settings.accentColor) {
        document.documentElement.style.setProperty('--accent-color', settings.accentColor);
      }

      if (settings.deviceType) {
        setDeviceType(settings.deviceType);
        if (settings.deviceType === "mobile") {
          document.body.classList.add('mobile-device');
          const viewport = document.querySelector('meta[name=viewport]');
          if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
          }
        }
      }

      if (settings.background) {
        document.body.style.backgroundImage = `url(${settings.background})`;
      }

      // Пропускаем Welcome окно
      setShowWelcome(false);
    }
    setIsLoading(false);
  });

  const handleWelcomeComplete = (settings) => {
    try {
      // Сохраняем основные настройки отдельно от фона
      const basicSettings = {
        deviceType: settings.deviceType,
        accentColor: settings.accentColor
      };
      
      localStorage.setItem('faestro-settings', JSON.stringify(basicSettings));
      localStorage.setItem('faestro-welcome-completed', 'true');
      
      setShowWelcome(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save some settings. The application may not work as expected.');
    }
  };

  const executeCommand = async (cmd) => {
    const [commandName, ...args] = cmd.split(" ");
    let result = `Command not found: ${commandName}`;
    
    if (commands[commandName]) {
      try {
        result = await commands[commandName](...args);
        if (commandName === "faestro.clear") {
          setIsClearing(true);
          const logElements = document.querySelectorAll('.console-log-entry');
          logElements.forEach(el => el.classList.add('clearing'));
          document.getElementById('console-logs').classList.add('clearing');
          
          setTimeout(() => {
            setLogs([]);
            setIsClearing(false);
            document.getElementById('console-logs').classList.remove('clearing');
          }, 300);
          return;
        }
      } catch (error) {
        result = `Error executing command: ${error.message}`;
      }
    }
    setLogs([...logs(), { text: result }]);
    setCommand("");
  };

  const handleVoiceCommand = (voiceCommand) => {
    const commandMap = {
      // Russian commands
      'очисти': 'faestro.clear',
      'очисти все': 'faestro.clear',
      'очисти всё': 'faestro.clear',
      'открой настройки': 'faestro.safarium.settings',
      'настройки': 'faestro.safarium.settings',
      'версия': 'faestro.version',
      'какая версия': 'faestro.version',
      'хочу новые обои': 'faestro.safarium.settings',
      'поменять обои': 'faestro.safarium.settings',
      'галерея обоев': 'faestro.safarium.settings',
      'открой галерею': 'faestro.safarium.settings',
      'обои': 'faestro.safarium.settings',
      'покажи авторов': 'faestro.credits',
      'авторы': 'faestro.credits',
      'создатели': 'faestro.credits',
      'сброс настроек': 'faestro.reset',
      'сбросить настройки': 'faestro.reset',
      'перезагрузить': 'faestro.reset',
      'все комманды': '',

      // Help commands in Russian
      'помощь': 'faestro.anospeech.help',
      'справка': 'faestro.anospeech.help',
      'что ты умеешь': 'faestro.anospeech.help',
      'покажи команды': 'faestro.anospeech.help',
      'список команд': 'faestro.anospeech.help',
      'голосовые команды': 'faestro.anospeech.help',

      // English commands
      'clear': 'faestro.clear',
      'clear all': 'faestro.clear',
      'open settings': 'faestro.safarium.settings',
      'settings': 'faestro.safarium.settings',
      'version': 'faestro.version',
      'what version': 'faestro.version',
      'i want new wallpapers': 'faestro.safarium.background.wallpaper_gallery',
      'change wallpaper': 'faestro.safarium.background.wallpaper_gallery',
      'wallpaper gallery': 'faestro.safarium.background.wallpaper_gallery',
      'open gallery': 'faestro.safarium.background.wallpaper_gallery',
      'wallpapers': 'faestro.safarium.background.wallpaper_gallery',
      'show authors': 'faestro.credits',
      'authors': 'faestro.credits',
      'creators': 'faestro.credits',
      'reset settings': 'faestro.reset',
      'reset': 'faestro.reset',
      'reboot': 'faestro.reset',
      'all commands': '',

      // Help commands in English
      'help': 'faestro.anospeech.help',
      'guide': 'faestro.anospeech.help',
      'what can you do': 'faestro.anospeech.help',
      'show commands': 'faestro.anospeech.help',
      'command list': 'faestro.anospeech.help',
      'voice commands': 'faestro.anospeech.help',

      // Wallpaper commands (исправленные)

      // New commands for AnoSpeech capabilities
      'что нового': 'faestro.anospeech.help',
      'что ты можешь': 'faestro.anospeech.help',
      'возможности': 'faestro.anospeech.help',
      'какие есть команды': 'faestro.anospeech.help',
      'расскажи о себе': 'faestro.anospeech.help',
    };

    // Нормализуем голосовую команду (убираем лишние пробелы, приводим к нижнему регистру)
    const normalizedVoiceCommand = voiceCommand.toLowerCase().trim();

    // Находим наиболее подходящую команду
    let bestMatch = null;
    let bestMatchScore = 0;

    Object.entries(commandMap).forEach(([voicePhrase, consoleCmd]) => {
      // Используем алгоритм похожести строк (можно использовать levenshtein distance)
      const similarity = calculateSimilarity(normalizedVoiceCommand, voicePhrase);
      if (similarity > bestMatchScore && similarity > 0.7) { // Порог схожести 70%
        bestMatch = consoleCmd;
        bestMatchScore = similarity;
      }
    });

    if (bestMatch) {
      executeCommand(bestMatch);
    } else {
      setLogs([...logs(), { text: `Неизвестная команда: ${voiceCommand}` }]);
    }
    setShowSpeechModal(false);
  };

  // Простая функция для расчета похожести строк
  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Точное совпадение
    if (s1 === s2) return 1;
    // Содержит как подстроку
    if (s1.includes(s2) || s2.includes(s1)) return 0.9;
    
    // Подсчет общих слов
    const words1 = s1.split(' ');
    const words2 = s2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(command());
    }
  };

  const filteredCommands = () => {
    const query = searchQuery().toLowerCase();
    return Object.keys(commands)
      .filter(cmd => 
        !query || cmd.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        // Exact matches first
        const aExact = a.toLowerCase() === query;
        const bExact = b.toLowerCase() === query;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then starts with matches
        const aStarts = a.toLowerCase().startsWith(query);
        const bStarts = b.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        // Finally alphabetical
        return a.localeCompare(b);
      });
  };

  return (
    <>
      <Show when={isLoading()}>
        <LoadingScreen />
      </Show>
      <Show when={showWelcome()}>
        <Welcome onComplete={handleWelcomeComplete} />
      </Show>
      <div class="console-container">
        <div class="console-wrapper">
          <div id="console-logs">
            <For each={logs()}>
              {(log) => <ConsoleLogEntry text={log.text} isClearing={isClearing()} />}
            </For>
          </div>
          <div id="console-input">
            <input
              id="console-command"
              type="text"
              value={command()}
              onInput={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command..."
            />
            <button 
              id="console-speech" 
              onClick={() => setShowSpeechModal(true)}
              aria-label="Speech Recognition"
            >
              <i class="ri-mic-line"></i>
            </button>
            <button 
              id="console-more" 
              onClick={() => setIsMoreOpen(!isMoreOpen())}
              aria-label="More options"
            >
              <i class="ri-slash-commands-2"></i>
            </button>
            <button 
              id="console-execute" 
              onClick={() => executeCommand(command())}
              aria-label="Execute command"
            >
              <i class="ri-send-plane-fill"></i>
            </button>
          </div>
          {isMoreOpen() && (
            <div class="context-menu">
              <div class="command-search">
                <i class="ri-search-line"></i>
                <input
                  type="text"
                  placeholder="Search commands..."
                  value={searchQuery()}
                  onInput={(e) => setSearchQuery(e.target.value)}
                  autofocus
                />
              </div>
              <div class="command-list">
                {filteredCommands().map((cmd) => (
                  <button 
                    class="command-option"
                    onClick={() => {
                      setCommand(cmd);
                      setIsMoreOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Show when={showSpeechModal()}>
        <SpeechModal onClose={() => setShowSpeechModal(false)} onCommand={handleVoiceCommand} />
      </Show>
    </>
  );
}

function ConsoleLogEntry({ text }) {
  const [isAnimated, setIsAnimated] = createSignal(true);
  const textString = () => (typeof text === 'string' ? text : String(text));

  onMount(() => {
    const totalAnimationTime = textString().split(" ").length * 200 + 500;
    setTimeout(() => {
      setIsAnimated(false);
    }, totalAnimationTime);
  });

  return (
    <div class="console-log-entry">
      <Show when={isAnimated()} fallback={<span>{textString()}</span>}>
        {textString().split(" ").map((word, index) => (
          <span
            class="console-log-char"
            style={{ "animation-delay": `${index * 0.2}s`, display: "inline-block" }}
          >
            {word}&nbsp;
          </span>
        ))}
      </Show>
    </div>
  );
}

export default Main;