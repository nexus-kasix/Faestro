export const commands = {
  'faestro.clear': () => "Console cleared",
  'faestro.version': () => "Faestro SE 1.0 (based on Faestro M 1.0)",
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
Version: Faestro SE 1.0 (based on Faestro M 1.0)
© 2024 Nexus Projects.`
};
