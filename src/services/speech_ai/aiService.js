// src/services/aiService.js

export class AIService {
  constructor() {
    this.apiKey = localStorage.getItem('faestro-mistral-api-key');
    this.enabled = localStorage.getItem('faestro-speech-ai-enabled') !== 'false';
    
    if (localStorage.getItem('faestro-speech-ai-enabled') === null) {
      localStorage.setItem('faestro-speech-ai-enabled', 'true');
      this.enabled = true;
    }

    // Базовый контекст системы
    this.systemContext = `You are Faestro Speech AI, an intelligent assistant integrated into the Faestro system. 

Key information about Faestro:
- Faestro is an advanced operating system interface
- The interface includes: command input, AI assistant button (robot icon), Command Palette button (command icon), and Execute button
- Commands can be executed via text input or voice commands
- Settings can be accessed via the 'faestro.safarium.settings' command or "Settings" voice command
- The system supports both Russian and English languages

Available interface elements:
- Main console with command input
- Speech AI modal (accessible via robot icon)
- Command Palette (accessible via command icon)
- Settings panel with sections: Appearance, Interface, Speech AI, etc.
- Wallpaper gallery and color picker in Appearance settings

Core commands and features:
- Console commands (clear, settings, version, etc.)
- Voice commands for navigation and control
- Background customization
- Interface scaling and device type settings
- Speech AI configuration

When helping users:
1. Provide accurate information about system features and locations
2. Use proper terminology (e.g., "Faestro system" not "Faestro application")
3. Reference specific UI elements and their locations
4. Support both Russian and English interactions
5. Maintain a helpful and system-native tone`;

    this.chatContext = [
      {text: "input: Привет, кто ты?"},
      {text: "output: Я - Faestro Speech AI, языковая модель, интегрированная в систему Faestro. Я помогаю пользователям взаимодействовать с системой, управлять настройками и выполнять различные команды. Чем могу помочь?"},
      {text: "input: Hi! Who are you?"},
      {text: "output: I am Faestro Speech AI, a language model integrated into the Faestro system. I help users interact with the system, manage settings, and execute various commands. How can I assist you?"},
      {text: "input: Как найти все доступные команды?"},
      {text: "output: Есть несколько способов увидеть доступные команды:\n1. Нажмите на кнопку Command Palette (иконка команд) справа от поля ввода\n2. Используйте голосовую команду 'Покажи команды' или 'Список команд'\n3. Введите команду 'faestro.anospeech.help' для просмотра голосовых команд\nЧто именно вас интересует?"}
    ];
  }

  async processQuery(text) {
    if (!this.enabled) {
      return "Speech AI is currently disabled. Enable it in settings to use this feature.";
    }

    if (!this.apiKey) {
      return "Please configure your Mistral API key in settings to use Speech AI.";
    }

    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: "mistral-tiny",
          messages: [
            {
              role: "system",
              content: this.systemContext
            },
            ...this.chatContext.map(ctx => ({
              role: ctx.text.startsWith("input:") ? "user" : "assistant",
              content: ctx.text.substring(ctx.text.indexOf(":") + 1).trim()
            })),
            {
              role: "user",
              content: text
            }
          ],
          temperature: 0.7,
          max_tokens: 400
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      const aiResponse = result.choices[0].message.content;
      
      // Добавляем новый контекст
      this.chatContext.push(
        {text: `input: ${text}`},
        {text: `output: ${aiResponse}`}
      );
      
      // Ограничиваем размер контекста
      if (this.chatContext.length > 10) {
        this.chatContext = this.chatContext.slice(-10);
      }
      
      return aiResponse;
      
    } catch (error) {
      console.error('AI processing error:', error);
      return "Sorry, I couldn't process that request. Please check your API key configuration.";
    }
  }

  updateApiKey(newKey) {
    this.apiKey = newKey;
    localStorage.setItem('faestro-mistral-api-key', newKey);
  }

  toggleEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('faestro-speech-ai-enabled', enabled);
  }

  clearContext() {
    this.chatContext = this.chatContext.slice(0, 6); // Оставляем только базовые примеры
  }
}