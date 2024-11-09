import { render } from 'solid-js/web';
import ColorPicker from '../components/ColorPicker';


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
  
  // Only set background color if there's no background image
  if (!document.body.style.backgroundImage || document.body.style.backgroundImage === 'none') {
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

export const safariumCommands = {
  'faestro.safarium.background.set.image': () => {
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
  
  'faestro.safarium.background.reset': () => {
    document.body.style.backgroundImage = 'none';
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    document.body.style.backgroundColor = accentColor;
    return "Background reset to accent color";
  },

  'faestro.safarium.background.wallpaper_gallery': () => {
    const existingGallery = document.querySelector('.wallpaper-gallery');
    if (existingGallery) {
      existingGallery.remove();
      return;
    }

    const gallery = document.createElement('div');
    gallery.className = 'wallpaper-gallery-container';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';

    const galleryContent = document.createElement('div');
    galleryContent.className = 'wallpaper-gallery';

    const header = document.createElement('div');
    header.className = 'gallery-header';

    const title = document.createElement('h2');
    title.textContent = 'Wallpaper Gallery';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'gallery-close';
    closeBtn.innerHTML = '<i class="ri-close-circle-line"></i>';
    closeBtn.onclick = () => gallery.remove();

    const grid = document.createElement('div');
    grid.className = 'wallpaper-grid';

    const wallpapers = Array.from({length: 8}, (_, i) => ({
      url: `/wallpapers/example${i + 1}.jpg`,
      name: `Example ${i + 1}`
    }));

    wallpapers.forEach(wp => {
      const item = document.createElement('div');
      item.className = 'wallpaper-item';
      
      const img = document.createElement('img');
      img.src = wp.url;
      img.alt = wp.name;
      
      item.onclick = () => {
        document.body.style.backgroundImage = `url(${wp.url})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        gallery.remove();
      };

      item.appendChild(img);
      grid.appendChild(item);
    });

    header.appendChild(title);
    header.appendChild(closeBtn);
    galleryContent.appendChild(header);
    galleryContent.appendChild(grid);
    gallery.appendChild(overlay);
    gallery.appendChild(galleryContent);
    document.body.appendChild(gallery);

    return "Wallpaper gallery opened";
  },

  'faestro.safarium.accent_color.set': () => {
    const existingPalette = document.querySelector('.color-palette');
    if (existingPalette) {
        existingPalette.remove();
    }

    const colorPalette = document.createElement('div');
    colorPalette.className = 'color-palette';

    const colors = [
        { hex: '#6b7280', name: 'Default Gray' },
        { hex: '#64748b', name: 'Slate' },
        { hex: '#71717a', name: 'Zinc' },
        { hex: '#737373', name: 'Neutral' },
        { hex: '#78716c', name: 'Stone' },
        { hex: '#custom', name: 'Custom' }
    ];

    colors.forEach(({ hex, name }) => {
        const colorButton = document.createElement('button');
        colorButton.className = 'color-button';
        colorButton.setAttribute('title', name);
        
        if (hex === '#custom') {
            colorButton.className += ' custom';
            colorButton.textContent = '+';
            
            colorButton.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const existingPicker = document.querySelector('.color-picker-wrapper');
                if (existingPicker) {
                    existingPicker.remove();
                    return;
                }

                const pickerWrapper = document.createElement('div');
                pickerWrapper.className = 'color-picker-wrapper';
                
                const buttonRect = colorButton.getBoundingClientRect();
                pickerWrapper.style.position = 'absolute';
                pickerWrapper.style.left = `${buttonRect.left}px`;
                pickerWrapper.style.top = `${buttonRect.top - 240}px`;
                
                const pickerContainer = document.createElement('div');
                pickerContainer.id = 'custom-color-picker';
                pickerWrapper.appendChild(pickerContainer);

                document.body.appendChild(pickerWrapper);

                const handleColorChange = (color) => {
                    setThemeColor(color);
                };

                const handleOutsideClick = () => {
                    pickerWrapper.remove();
                };

                render(() => ColorPicker({
                  initialColor: "#6b7280",
                  onChange: handleColorChange,
                  onOutsideClick: handleOutsideClick
                }), pickerContainer);
            });
        } else {
            colorButton.style.backgroundColor = hex;
            colorButton.setAttribute('data-color', hex);
            
            colorButton.addEventListener('click', () => {
                setThemeColor(hex);
                colorPalette.remove();
            });
        }
        
        colorPalette.appendChild(colorButton);
    });

    const closeButton = document.createElement('button');
    closeButton.className = 'color-palette-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        colorPalette.remove();
    });
    colorPalette.appendChild(closeButton);

    const handleClickOutside = (event) => {
        if (!colorPalette.contains(event.target)) {
            colorPalette.remove();
            document.removeEventListener('click', handleClickOutside);
        }
    };

    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 100);

    document.body.appendChild(colorPalette);
    return "Color palette opened. Click a color to set the accent.";
  },

  'faestro.safarium.accent_color.reset': () => {
    const defaultColor = '#6b7280';
    setThemeColor(defaultColor);
    return "Accent color reset to default.";
  }
};

export default safariumCommands;