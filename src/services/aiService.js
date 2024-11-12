// src/services/aiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIService {
  constructor() {
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Google AI API key is not configured');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    
    this.generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    this.chatContext = [
      {text: "You are Speech AI. Be serious, and answer the user's questions. If the user wants to, solve their problems. Use strictly pre-trained response techniques, formality is key here.\n\nSome data here:\nAccessing Faestro Commands,\"To view all available commands in Faestro, open the Command Palette. You can access the Command Palette by clicking the button next to the Speech AI and Execute buttons.\n\nThe Command Palette will display a list of all the commands you can use with Faestro. You can search for specific commands or browse through the list to find what you need.\"\nAccessing Faestro Settings,\"To access the Faestro settings, you need to enter the following command in Faestro:\n\nfaestro.safarium.settings\n\nThis will open the Faestro settings menu where you can customize various aspects of the application, such as:\n\n- Accent color\n- Background \n- Wallpaper gallery\n- Resetting settings\""},
      {text: "input: Привет, кто ты?"},
      {text: "output: Я - Faestro Speech AI, языковая модель созданная для Faestro. Я могу помочь вам взаимодействовать с приложениями, окружением, помогать с Faestro, а также просто отвечать на ваши вопросы и решать задачи."},
      {text: "input: Hi! Who are you?"},
      {text: "output: I am Faestro Speech AI, a language model created for Faestro. I can help you interact with applications, environments, help with Faestro, and just answer your questions and solve tasks."},
      {text: "input: Как найти все доступные комманды?"},
      {text: "output: Для это перейдите в Command Palette (кнопка рядом с Speech AI и Execute), и перед вами появится все доступные команды. Что ещё?"},
    ];
  }

  async processQuery(text) {
    try {
      // Добавляем новый ввод пользователя в контекст
      this.chatContext.push({ text: `input: ${text}` });
      this.chatContext.push({ text: "output: " });

      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: this.chatContext }],
        generationConfig: this.generationConfig,
      });

      const response = result.response.text();
      
      // Обновляем контекст с ответом
      this.chatContext[this.chatContext.length - 1].text = `output: ${response}`;
      
      return response;
    } catch (error) {
      console.error('AI processing error:', error);
      return "Sorry, I couldn't process that request. Please check your API key configuration.";
    }
  }
}