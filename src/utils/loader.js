// src/utils/loader.js 

export const RESOURCES = {
  SETTINGS: 'User Configuration',
  COMMANDS: 'Core Commands', 
  INTERFACE: 'User Interface',
  THEMES: 'Color Themes',
  BACKGROUNDS: 'Wallpapers',
  WELCOME: 'Setup Assistant',
  ICON: 'Application Icon'
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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const loadCommands = async () => {
  await Promise.all([
    loadWithTimeout(import('../commands/console.js')),
    loadWithTimeout(import('../commands/safarium.js'))
  ]);
  loadingStates.set(RESOURCES.COMMANDS, true);
  dispatchLoadingEvent(RESOURCES.COMMANDS);
};

const loadInterface = async () => {
  await Promise.all([
    loadWithTimeout(import('../components/Main.jsx')),
    loadWithTimeout(import('../components/Welcome.jsx')),
    loadWithTimeout(import('../style/App.css'))
  ]);
  loadingStates.set(RESOURCES.INTERFACE, true);
  dispatchLoadingEvent(RESOURCES.INTERFACE);
};

const loadThemes = async () => {
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
};

const loadBackgrounds = async () => {
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
};

const loadWelcome = async () => {
  const hasCompletedWelcome = localStorage.getItem('faestro-welcome-completed');
  if (!hasCompletedWelcome) {
    await import('../components/Welcome.jsx');
  }
  loadingStates.set(RESOURCES.WELCOME, true);
  dispatchLoadingEvent(RESOURCES.WELCOME);
};

const loadIcon = async () => {
  await loadWithTimeout(new Promise((resolve, reject) => {
    const icon = new Image();
    icon.onload = resolve;
    icon.onerror = reject;
    icon.src = '/icon.svg';
  }));
  loadingStates.set(RESOURCES.ICON, true);
  dispatchLoadingEvent(RESOURCES.ICON);
};

export const loadAppResources = async () => {
  Object.values(RESOURCES).forEach(resource => {
    loadingStates.set(resource, false);
  });

  try {
    // Загружаем базовые настройки
    const settings = localStorage.getItem('faestro-settings');
    if (settings) {
      const { accentColor, deviceType } = JSON.parse(settings);
      if (accentColor) document.documentElement.style.setProperty('--accent-color', accentColor);
      
      // Отдельно загружаем фон, только если есть сохраненные настройки
      const backgroundImage = localStorage.getItem('faestro-background');
      if (backgroundImage) {
        document.body.style.backgroundImage = backgroundImage;
      } else {
        document.body.style.backgroundImage = 'none'; // Явно сбрасываем фон если его нет
      }
      
      localStorage.setItem('faestro-welcome-completed', 'true');
    } else {
      // Если нет настроек, явно сбрасываем фон
      document.body.style.backgroundImage = 'none';
    }
    await delay(100);
    loadingStates.set(RESOURCES.SETTINGS, true);
    dispatchLoadingEvent(RESOURCES.SETTINGS);

    // Загружаем остальные ресурсы
    await loadCommands();
    await delay(100);
    
    await loadInterface();
    await delay(100);
    
    await loadThemes();
    await delay(100);
    
    await loadBackgrounds();
    await delay(100);
    
    // Welcome загружаем только если нет настроек
    if (!settings) {
      await loadWelcome();
      await delay(100);
    } else {
      loadingStates.set(RESOURCES.WELCOME, true);
      dispatchLoadingEvent(RESOURCES.WELCOME);
    }
    
    await loadIcon();
    
    // Финальная задержка
    await delay(500);

    return true;
  } catch (error) {
    console.error('Error loading resources:', error);
    return false;
  }
};
