// src/components/Main.jsx
import { createSignal, onMount, Show, For } from "solid-js";
import { commands } from "/src/commands/console.js";
import Welcome from './Welcome';
import LoadingScreen from './LoadingScreen';
import { loadAppResources } from "../utils/loader";

function Main() {
  const [logs, setLogs] = createSignal([]);
  const [command, setCommand] = createSignal("");
  const [isClearing, setIsClearing] = createSignal(false);
  const [isMoreOpen, setIsMoreOpen] = createSignal(false);
  const [showWelcome, setShowWelcome] = createSignal(true);
  const [deviceType, setDeviceType] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    await loadAppResources();
    
    // Проверяем сохраненные настройки
    const savedSettings = localStorage.getItem('faestro-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      // Применяем настройки
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
    // Применяем настройки
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
    
    // Сохраняем настройки в localStorage
    localStorage.setItem('faestro-settings', JSON.stringify({
      deviceType: settings.deviceType,
      accentColor: settings.accentColor,
      background: document.body.style.backgroundImage.slice(4, -1).replace(/"/g, '') // Сохраняем URL фона
    }));
    
    setShowWelcome(false);
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(command());
    }
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
            <div id="more-options" class="context-menu">
              {Object.keys(commands).map((cmd) => (
                <button 
                  class="command-option" 
                  onClick={() => {
                    setCommand(cmd);
                    setIsMoreOpen(false);
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
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
