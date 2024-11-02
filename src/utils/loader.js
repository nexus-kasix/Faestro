export const RESOURCES = {
  COMMANDS: 'commands',
  INTERFACE: 'interface',
  SETTINGS: 'settings',
  WELCOME: 'welcome',
  THEMES: 'themes',
  BACKGROUNDS: 'backgrounds',
  ICON: 'icon' // Добавляем новый тип ресурса
};

// В loader.js
const loadWithTimeout = (promise, timeout = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]).catch(error => {
    console.warn('Resource loading timeout:', error);
    return null; // Продолжаем работу даже при таймауте
  });
};

export const loadingStates = new Map();

const dispatchLoadingEvent = (resource) => {
  window.dispatchEvent(
    new CustomEvent('resourceLoaded', { 
      detail: { resource } 
    })
  );
};

export const loadAppResources = async () => {
  Object.values(RESOURCES).forEach(resource => {
    loadingStates.set(resource, false);
  });

  try {
    // Load commands
    await Promise.all([
      loadWithTimeout(import('../commands/console.js')),
      loadWithTimeout(import('../commands/safarium.js'))
    ]);
    loadingStates.set(RESOURCES.COMMANDS, true);
    dispatchLoadingEvent(RESOURCES.COMMANDS);

    // Load interface
    await Promise.all([
      loadWithTimeout(import('../components/Main.jsx')),
      loadWithTimeout(import('../components/Welcome.jsx')),
      loadWithTimeout(import('../style/App.css'))
    ]);
    loadingStates.set(RESOURCES.INTERFACE, true);
    dispatchLoadingEvent(RESOURCES.INTERFACE);

    await new Promise(resolve => setTimeout(resolve, 2000));
    // Load saved settings
    const settings = localStorage.getItem('faestro-settings');
    if (settings) {
      const { accentColor, deviceType, background } = JSON.parse(settings);
      if (accentColor) document.documentElement.style.setProperty('--accent-color', accentColor);
      if (background) document.body.style.backgroundImage = `url(${background})`;
    }
    loadingStates.set(RESOURCES.SETTINGS, true);
    dispatchLoadingEvent(RESOURCES.SETTINGS);

    // Initialize welcome screen
    const hasCompletedWelcome = localStorage.getItem('faestro-welcome-completed');
    if (!hasCompletedWelcome) {
      await import('../components/Welcome.jsx');
    }
    loadingStates.set(RESOURCES.WELCOME, true);
    dispatchLoadingEvent(RESOURCES.WELCOME);

    // Load theme data
    const themes = [
      { hex: '#6b7280', name: 'Default' },
      { hex: '#64748b', name: 'Slate' },
      { hex: '#71717a', name: 'Zinc' },
      { hex: '#737373', name: 'Neutral' },
      { hex: '#78716c', name: 'Stone' }
    ];
    localStorage.setItem('faestro-themes', JSON.stringify(themes));
    loadingStates.set(RESOURCES.THEMES, true);
    dispatchLoadingEvent(RESOURCES.THEMES);

    // Load wallpapers
    const wallpapers = Array.from({length: 8}, (_, i) => `/wallpapers/example${i + 1}.jpg`);
    await Promise.all(wallpapers.map(url => 
      loadWithTimeout(new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      }))
    ));
    loadingStates.set(RESOURCES.BACKGROUNDS, true);
    dispatchLoadingEvent(RESOURCES.BACKGROUNDS);

    // Load icon
    await loadWithTimeout(new Promise((resolve, reject) => {
      const icon = new Image();
      icon.onload = resolve;
      icon.onerror = reject;
      icon.src = '/icon.svg';
    }));
    loadingStates.set(RESOURCES.ICON, true);
    dispatchLoadingEvent(RESOURCES.ICON);

    // Добавляем задержку после загрузки всех ресурсов
    await loadWithTimeout(new Promise(resolve => setTimeout(resolve, 2000)), 5000);

    return true;

  } catch (error) {
    console.error('Error loading resources:', error);
    return false;
  }
};