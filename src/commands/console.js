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
  'secret.what': () => "Not everything is so clear, well, you already understand that I will not reveal all the cards right away. Here you can just guess.. if there is a way..",
  'secret.hacker.rist': () => "Honestly, I didn't expect Hacer Rist to react to the launch of Faestro like this. I understand that it may be a bit of a joke, but I also understand that he wants to do something like this. But it doesn't mean that Faestro is bad now. Anyway, I don't want to sound like a hater, but I don't think he will have the same presentation, realization and cover as we have in Nexus. We approach every detail with heart. How Hacer Rist does it, I don't know.",
  'secret.found': () => "Different message hidden here. Why say them in our channel? Just find them).",
  'secret.ch': () => "LFXXKIDDNBSWC5DFOIQSAT3OEB2GQZJAN52GQZLSEBUGC3TEFQQGS5BHOMQHK3TEMVZHG5DBNZSGCYTMMUQPBH5EW7RIBDPCTGBO7OEPFYQEC3TZN5XGKIDDMFXCA3DPN5VSA2LOEB2GQZJAM5UXI2DVMIXA====",
  'secret.01': () => {
    const url = "https://www.kinopoisk.ru/film/1115685/?utm_referrer=www.google.com";
    window.open(url, '_blank');
    return `01 is here!`;
  },
};
