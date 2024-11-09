import { render } from 'solid-js/web';

// Выносим функцию создания настроек отдельно
const createSettings = (onClose) => {
  const container = document.createElement('div');
  container.id = 'safarium-settings-container';
  document.body.appendChild(container);
  
  // Динамический импорт компонента SafariumSettings
  import('../components/SafariumSettings').then(module => {
    const SafariumSettings = module.default;
    render(() => SafariumSettings({ onClose }), container);
  });
};

export const safariumCommands = {
  'faestro.safarium.settings': () => {
    const existingSettings = document.querySelector('.safarium-settings');
    if (existingSettings) {
      existingSettings.remove();
      return "Settings closed";
    }

    createSettings(() => {
      const container = document.getElementById('safarium-settings-container');
      if (container) container.remove();
    });
    
    return "Settings opened";
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
  }
};

export default safariumCommands;