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
          placeholder="Enter command..."
        />
        <button id="console-execute" onClick={executeCommand}>
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
    // Длительность анимации = (количество символов * задержка между ними) + длительность анимации одного символа
    const totalAnimationTime = text.length * 50 + 500; // В миллисекундах
    setTimeout(() => {
      setIsAnimated(false);
    }, totalAnimationTime);
  });

  return (
    <div class="console-log-entry">
      <Show when={isAnimated()} fallback={<span>{text}</span>}>
        {text.split("").map((char, index) => (
          <span
            class="console-log-char"
            style={{ "animation-delay": `${index * 0.05}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </Show>
    </div>
  );
}

export default Main;
