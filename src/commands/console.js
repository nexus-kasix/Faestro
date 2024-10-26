export const commands = {
  clear: () => "Console cleared",
  help: () => "Available commands: greet, clear, faestro.save.log, faestro.version, faestro.link, faestro.credits",
  'faestro.save.log': () => "Not implemented yet", // Placeholder, actual implementation depends on your logging setup
  'faestro.version': () => "Faestro version 1.3",
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
  'faestro.credits': () => "Thanks to: [solid.js](https://www.solidjs.com/), artificial intelligence, and the world for making this project possible.",
'faestro.theme_engine.background.set.image': () => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imagePath = e.target.result;
          document.body.style.backgroundImage = `url(${imagePath})`;
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundPosition = 'center';
          resolve(`Background image set to: ${file.name}`);
        };
        reader.readAsDataURL(file);
      } else {
        resolve("No image selected.");
      }
    };
    
    input.click();
  });
},
  'faestro.theme_engine.background.set.example.1': () => {
    const exampleImage = '/wallpapers/example1.jpg';
    document.body.style.backgroundImage = `url(${exampleImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    return `Background image set to example: ${exampleImage}`;
  },
  'faestro.theme_engine.background.set.example.2': () => {
    const exampleImage = '/wallpapers/example2.jpg';
    document.body.style.backgroundImage = `url(${exampleImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    return `Background image set to example: ${exampleImage}`;
  },
};
