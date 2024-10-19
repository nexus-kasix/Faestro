import { createSignal, onMount, Show } from "solid-js";
import { commands } from "/src/commands/console.js";

function Main() {
  const [logs, setLogs] = createSignal([]);
  const [command, setCommand] = createSignal("");

  const executeCommand = () => {
    const cmd = command().split(" ")[0];
    const args = command().split(" ").slice(1);
    let result = `Command not found: ${cmd}`;
    if (commands[cmd]) {
      result = commands[cmd](...args);
    }
    setLogs([...logs(), { text: result }]);
    setCommand(""); // Очистить инпут после выполнения команды
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand();
    }
  };


  return (
    <div class="console-wrapper">
      <div id="console-logs">
        <For each={logs()}>
          {(log) => <ConsoleLogEntry text={log.text} />}
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
          id="console-execute" 
          onClick={executeCommand} 
        >
          Execute
        </button>
      </div>
    </div>
  );
}

function ConsoleLogEntry({ text }) {
  const [isAnimated, setIsAnimated] = createSignal(true);

  // После определенного времени заменить анимированный текст на обычный
  onMount(() => {
    const totalAnimationTime = text.split(" ").length * 200 + 500; // В миллисекундах
    setTimeout(() => {
      setIsAnimated(false);
    }, totalAnimationTime);
  });

  return (
    <div class="console-log-entry">
      <Show when={isAnimated()} fallback={<span>{text}</span>}>
        {text.split(" ").map((word, index) => (
          <span
            class="console-log-char"
            style={{ "animation-delay": `${index * 0.2}s`, display: "inline-block" }} // Добавлено для корректной работы пробелов
          >
            {word}&nbsp; {/* Пробел между словами */}
          </span>
        ))}
      </Show>
    </div>
  );
}

export default Main;
