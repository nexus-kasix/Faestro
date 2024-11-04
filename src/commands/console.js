export const commands = {
  'faestro.clear': () => "Console cleared",
  'faestro.version': () => "Faestro Mini 1.0 (based on Faestro 1.7)",
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
Version: Faestro Mini 1.0 (based on Faestro 1.7)
© 2024 Nexus Projects.`
};
