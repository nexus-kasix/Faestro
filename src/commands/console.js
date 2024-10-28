export const commands = {
  clear: () => "Console cleared",
  cd: () => "Not inplemented yet",
  help: () => "Available commands: faestro.save.log, faestro.version, faestro.link, faestro.theme_engine.background.set.image, faestro.theme_engine.background.set.example.",
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
  'faestro.theme_engine.accent_color.set': () => {
    const colorPalette = document.createElement('div');
    colorPalette.className = 'color-palette';

    // Более приглушенные цвета
    const colors = [
      '#6b7280', // Default gray
      '#64748b', // Slate
      '#71717a', // Zinc
      '#737373', // Neutral
      '#78716c', // Stone
      '#custom'  // Custom color option
    ];

    colors.forEach(color => {
      const colorButton = document.createElement('button');
      colorButton.className = 'color-button';
      
      if (color === '#custom') {
        colorButton.className += ' custom';
        colorButton.textContent = '+';
        colorButton.addEventListener('click', () => {
          const input = document.createElement('input');
          input.type = 'color';
          input.value = '#6b7280';
          input.addEventListener('change', (e) => {
            setThemeColor(e.target.value);
            colorPalette.remove();
          });
          input.click();
        });
      } else {
        colorButton.style.backgroundColor = color;
        colorButton.addEventListener('click', () => {
          setThemeColor(color);
          colorPalette.remove();
        });
      }
      
      colorPalette.appendChild(colorButton);
    });

    document.body.appendChild(colorPalette);
    return "Color palette opened. Click a color to set the accent.";
  },

  'faestro.theme_engine.accent_color.reset': () => {
    const defaultColor = '#6b7280';
    setThemeColor(defaultColor);
    return "Accent color reset to default.";
  },
  'faestro.javascript': (...args) => {
    if (window.kernel.user == window.kernel.rootuser) {
      const cmd = args.join(" ")
      eval(cmd);
      // return "Erm how i can get"+cmd;
      return "Your Code Executed";
    } else {
      return "faestro.javascript: You must be superuser";
    }
  },
  'faestro.su': (acc,pass) => {
    window.kernel.chuser(acc,pass)
    if (acc == window.kernel.user){
      return "Your account changed to "+acc;
    } else {
      return "Wrong password or wrong username!";
    }
    
  },
};

function setThemeColor(color) {
  // Основной акцентный цвет
  document.documentElement.style.setProperty('--accent-color', color);
  
  // Вариации цвета для разных компонентов
  const rgb = hexToRgb(color);
  if (rgb) {
    // Более светлый вариант для hover эффектов
    document.documentElement.style.setProperty(
      '--accent-light', 
      `rgba(${rgb.r + 20}, ${rgb.g + 20}, ${rgb.b + 20}, 1)`
    );
    
    // Более темный вариант для активных состояний
    document.documentElement.style.setProperty(
      '--accent-dark', 
      `rgba(${rgb.r - 20}, ${rgb.g - 20}, ${rgb.b - 20}, 1)`
    );
    
    // Прозрачный вариант для фонов
    document.documentElement.style.setProperty(
      '--accent-transparent', 
      `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`
    );
  }
  
  // Если фон - это цвет, применяем акцентный цвет и к нему
  const currentBg = getComputedStyle(document.body).backgroundColor;
  if (currentBg.includes('rgb') && !document.body.style.backgroundImage) {
    document.body.style.backgroundColor = color;
  }
}

// Вспомогательная функция для конвертации HEX в RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
