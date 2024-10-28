import "../style/App.css";  // Import Tailwind and any global styles
import { createSignal, onMount, Show, For } from "solid-js";
import { commands } from "/src/commands/console.js";
function Main() {
  console.log = function(message) {
    setLogs([...logs(), { text: message }]);
  };
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
        if (commandName === "clear") {
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
    document.getElementById("console-user").innerHTML = window.kernel.user+"@faestro";
    setLogs([...logs(), { text: result }]);
    setCommand("");
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeCommand(command());
    }
  };
  setLogs([...logs(), { text: "To became superuser (root) use command: faestro.su root root (faestro.su username password)" }]);
  return (
    <div class="console-container">
      <div class="console-wrapper">
        <div id="console-logs">
          <For each={logs()}>
            {(log) => <ConsoleLogEntry text={log.text} isClearing={isClearing()} />}
          </For>
        </div>
        <div id="console-input">
        <div id="console-user">user@faestro</div>
        {/* <div id="console-dir">NO DIR</div> -- Я сделал файловую систему - но у вас нит документов*/}
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
  );
  
}


function ConsoleLogEntry({ text }) {
  const [isAnimated, setIsAnimated] = createSignal(true);

  // Convert text to string if it's not already
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
