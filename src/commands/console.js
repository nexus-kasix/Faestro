import safariumCommands from './safarium';

export const commands = {
  'faestro.clear': () => "Console cleared",
  'faestro.version': () => `Faestro version ${import.meta.env.VITE_FAESTRO_VERSION}`,
  'faestro.link': (link) => {
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      link = 'https://' + link;
    }
    
    try {
      window.open(link, '_blank');
      return `Opening ${link} in a new tab...`;
    } catch (error) {
      return `Error opening ${link}: ${error.message}`;
    }
  },
  'faestro.credits': () => `Special thanks to:
• SolidJS - The reactive JavaScript framework.
• RemixIcon - Beautiful open-source icons.
• Vite - Next Generation Frontend Tooling.
• The open-source community.
• Everyone who contributed to making Faestro possible.
• Artificial Intelligence & LLMs.

Version: Faestro version ${import.meta.env.VITE_FAESTRO_VERSION}
© 2024 Nexus Projects.`,
  'faestro.return': (...args) => {
    if (args.length === 0) return "Usage: faestro.return <text>";
    return args.join(" ");
  },
  'faestro.reset': () => {
    localStorage.removeItem('faestro-settings');
    localStorage.removeItem('faestro-background');
    document.body.style.backgroundImage = 'none';
    window.location.reload();
    // Reset speech AI
    localStorage.setItem('faestro-speech-ai-enabled', 'false');
    const speechButton = document.getElementById('console-speech');
    if (speechButton) {
      speechButton.style.display = 'none';
    }
    return "Settings reset. Reloading application...";
  },
  'faestro.clock': () => {
    const now = new Date();
    return `Current time is ${now.toLocaleTimeString()}`;
  },
  ...safariumCommands
};
