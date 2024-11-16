// src/components/Main.jsx

import { createSignal, onMount, Show, For } from "solid-js";
import { commands } from "../commands/console.js";
import Welcome from './Welcome';
import LoadingScreen from './LoadingScreen'; 
import { loadAppResources } from "../services/loader.js";
import SpeechModal from "./speech_ai/SpeechModal";

function Main() {
  const [logs, setLogs] = createSignal([]);
  const [command, setCommand] = createSignal("");
  const [isClearing, setIsClearing] = createSignal(false);
  const [isMoreOpen, setIsMoreOpen] = createSignal(false);
  const [showWelcome, setShowWelcome] = createSignal(true);
  const [isLoading, setIsLoading] = createSignal(true);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [showSpeechModal, setShowSpeechModal] = createSignal(false);

  onMount(async () => {
    await loadAppResources();
    
    const savedAccentColor = localStorage.getItem('faestro-accent-color');
    if (savedAccentColor) {
      document.documentElement.style.setProperty('--accent-color', savedAccentColor);
    }

    const savedBackground = localStorage.getItem('faestro-background');
    if (savedBackground) {
      document.body.style.backgroundImage = `url(${savedBackground})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    }

    const savedSettings = localStorage.getItem('faestro-settings');
    if (savedSettings) {
      setShowWelcome(false);
    }
    setIsLoading(false);
  });

  const executeCommand = async (cmd) => {
    const [commandName, ...args] = cmd.split(" ");
    let result = `Command not found: ${commandName}`;
    
    if (commands[commandName]) {
      try {
        result = await commands[commandName](...args);
        if (commandName === "faestro.clear") {
          setIsClearing(true);
          setTimeout(() => {
            setLogs([]);
            setIsClearing(false);
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

  const filteredCommands = () => {
    const query = searchQuery().toLowerCase();
    return Object.keys(commands)
      .filter(cmd => !query || cmd.toLowerCase().includes(query))
      .sort();
  };

  const isSpeechAIEnabled = () => {
    return localStorage.getItem('faestro-speech-ai-enabled') !== 'false';
  };

  return (
    <>
      <Show when={isLoading()}>
        <LoadingScreen />
      </Show>
      <Show when={showWelcome()}>
        <Welcome onComplete={(settings) => {
          localStorage.setItem('faestro-settings', JSON.stringify(settings));
          setShowWelcome(false);
        }} />
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
            <Show when={isSpeechAIEnabled()}>
              <button 
                id="console-speech" 
                onClick={() => setShowSpeechModal(true)}
                aria-label="AI Assistant"
              >
                <i class="ri-robot-line"></i>
              </button>
            </Show>
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
        <SpeechModal 
          onClose={() => setShowSpeechModal(false)} 
          onCommand={executeCommand} 
        />
      </Show>
    </>
  );
}

function ConsoleLogEntry({ text }) {
  const [isAnimated, setIsAnimated] = createSignal(true);
  const textString = () => (typeof text === 'string' ? text : String(text));

  onMount(() => {
    setTimeout(() => setIsAnimated(false), textString().split(" ").length * 200 + 500);
  });

  return (
    <div class="console-log-entry">
      <Show when={isAnimated()} fallback={<span>{textString()}</span>}>
        {textString().split(" ").map((word, index) => (
          <span
            class="console-log-char"
            style={{ "animation-delay": `${index * 0.2}s` }}
          >
            {word}&nbsp;
          </span>
        ))}
      </Show>
    </div>
  );
}

export default Main;