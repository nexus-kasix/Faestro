let safariumCommands = {};

try {
  const module = await import('./safarium.js');
  safariumCommands = module.safariumCommands || {};
} catch (error) {
  console.warn('Safarium module not found or failed to load:', error);
}

export const commands = {
  'faestro.clear': () => "Console cleared",
  'faestro.version': () => "Faestro version 1.6 'Feather Fix'",
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

Version: Faestro 1.6 'Feather Fix'
© 2024 Nexus Projects.`,
  ...safariumCommands
};

function setThemeColor(color) {
  document.documentElement.style.setProperty('--accent-color', color);
  
  const rgb = hexToRgb(color);
  if (rgb) {
    document.documentElement.style.setProperty(
      '--accent-light', 
      `rgba(${rgb.r + 20}, ${rgb.g + 20}, ${rgb.b + 20}, 1)`
    );
    
    document.documentElement.style.setProperty(
      '--accent-dark', 
      `rgba(${rgb.r - 20}, ${rgb.g - 20}, ${rgb.b - 20}, 1)`
    );
    
    document.documentElement.style.setProperty(
      '--accent-transparent', 
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
    );
  }
  
  const currentBg = getComputedStyle(document.body).backgroundColor;
  if (currentBg.includes('rgb') && !document.body.style.backgroundImage) {
    document.body.style.backgroundColor = color;
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
