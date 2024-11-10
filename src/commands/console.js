import safariumCommands from './safarium';

export const commands = {
  'faestro.clear': () => "Console cleared",
  'faestro.version': () => "Faestro version 1.8 Q3 'Just say it'",
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

Version: Faestro version 1.8 Q3 'Just say it'
© 2024 Nexus Projects.`,
  'faestro.return': (...args) => {
    if (args.length === 0) return "Usage: faestro.return <text>";
    return args.join(" ");
  },
  'faestro.reset': () => {
    localStorage.removeItem('faestro-settings');
    localStorage.removeItem('faestro-background');
    document.body.style.backgroundImage = 'none';
    window.location.reload();
    return "Settings reset. Reloading application...";
  },
  'faestro.anospeech.help': () => `Доступные голосовые команды / Available voice commands:

Очистка консоли / Console clearing:
• "Очисти" / "Clear"
• "Очисти все" / "Clear all"
• "Очисти всё"

Настройки / Settings:
• "Открой настройки" / "Open settings"
• "Настройки" / "Settings"

Версия / Version:
• "Версия" / "Version"
• "Какая версия" / "What version"

Обои / Wallpapers:
• "Хочу новые обои" / "I want new wallpapers"
• "Поменять обои" / "Change wallpaper"
• "Галерея обоев" / "Wallpaper gallery"
• "Открой галерею" / "Open gallery"
• "Обои" / "Wallpapers"

Информация / Information:
• "Покажи авторов" / "Show authors"
• "Авторы" / "Authors"
• "Создатели" / "Creators"

Сброс / Reset:
• "Сброс настроек" / "Reset settings"
• "Сбросить настройки" / "Reset"
• "Перезагрузить" / "Reboot"

Справка / Help:
• "Помощь" / "Help"
• "Справка" / "Guide"
• "Что ты умеешь" / "What can you do"
• "Покажи команды" / "Show commands"
• "Список команд" / "Command list"
• "Голосовые команды" / "Voice commands"
• "Что нового" / "What's new"
• "Что ты можешь"
• "Возможности" / "Capabilities"
• "Какие есть команды"
• "Расскажи о себе"
• "Все команды" / "All commands"`,
  ...safariumCommands
};
