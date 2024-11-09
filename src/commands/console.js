import safariumCommands from './safarium';

export const commands = {
  'faestro.clear': () => "Console cleared",
  'faestro.version': () => "Faestro version 1.8 Q2",
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

Version: Faestro version 1.8 Q2
© 2024 Nexus Projects.`,
  'faestro.reset': () => {
    localStorage.removeItem('faestro-settings');
    localStorage.removeItem('faestro-background');
    document.body.style.backgroundImage = 'none';
    window.location.reload();
    return "Settings reset. Reloading application...";
  },
  ...safariumCommands
};
