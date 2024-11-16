import { render } from 'solid-js/web';

// Выносим функцию создания настроек отдельно
const createSettings = (onClose) => {
  const container = document.createElement('div');
  container.id = 'safarium-settings-container';
  document.body.appendChild(container);
  
  // Динамический импорт компонента SafariumSettings
  import('../components/settings/SafariumSettings').then(module => {
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
  }
};

export default safariumCommands;