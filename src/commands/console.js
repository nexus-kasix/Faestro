export const commands = {
  greet: (name) => `Hello, ${name}!`,
  clear: () => "Console cleared",
  help: () => "Available commands: greet, clear, faestro.save.log, faestro.version, faestro.link, faestro.credits",
  'faestro.save.log': () => "Not implemented yet", // Placeholder, actual implementation depends on your logging setup
  'faestro.version': () => "Faestro version 1.0",
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
  'faestro.credits': () => "Thanks to: solid.js, artificial intelligence, and the world for making this project possible.",
  'secret.memory': () => "Dreams©️ and LBP are my favorite creations. How can you not love them?",
  'secret.think': () => "It may seem to you that I am thinking, but in fact it is not so.. practically.",
  'secret.note': () => "This is a much bigger step than you might think, and I'm really not kidding. This is indeed a very important step for Nexus Projects.",
  'secret.what': () => "Not everything is so clear, well, you already understand that I will not reveal all the cards right away. Here you can just guess.. if there is a way.."
};
