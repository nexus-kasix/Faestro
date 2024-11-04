// src/components/Main.jsx
import { createSignal, For } from "solid-js";
import { commands } from "/src/commands/console.js";

function ConsoleLogEntry({ text }) {
  return (
    <div class="console-log-entry">
      <span class="console-prompt">❯</span>
      <span class="console-text">{text}</span>
    </div>
  );
}

function Main() {
  const [logs, setLogs] = createSignal([]);
  const [command, setCommand] = createSignal("");
  const [isClearing, setIsClearing] = createSignal(false);
  const [isMoreOpen, setIsMoreOpen] = createSignal(false);

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
          }, 0);
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
          <div class="more-button-container">
            <button 
              id="console-more" 
              onClick={() => setIsMoreOpen(!isMoreOpen())}
              aria-label="More options"
            >
              <i class="ri-slash-commands-2"></i>
            </button>
            {isMoreOpen() && (
              <div class="more-menu">
                <div class="menu-item" onClick={() => executeCommand("faestro.clear")}>Clear</div>
                <div class="menu-item" onClick={() => executeCommand("faestro.version")}>Version</div>
                <div class="menu-item" onClick={() => executeCommand("faestro.credits")}>Credits</div>
              </div>
            )}
          </div>
          <button 
            id="console-execute" 
            onClick={() => executeCommand(command())}
            aria-label="Execute command"
          >
            <i class="ri-arrow-right-s-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Main;