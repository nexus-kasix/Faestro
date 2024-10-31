// src/components/Welcome.jsx
import { createSignal, Show } from "solid-js";

const Welcome = ({ onComplete }) => {
  const [step, setStep] = createSignal(0);
  const [deviceType, setDeviceType] = createSignal("");
  const [accentColor, setAccentColor] = createSignal("#6b7280");
  const [hasBackground, setHasBackground] = createSignal(false);

  const steps = [
    {
      title: "Добро пожаловать в Faestro!",
      content: "Давайте настроим Faestro перед началом его использования.",
      action: () => setStep(1)
    },
    {
        title: "Выберите тип устройства",
        content: (
          <div class="device-selection">
            <button 
              onClick={() => {
                setDeviceType("pc");
                setStep(2);
              }}
              class="device-button"
            >
              <i class="ri-computer-line"></i>
              <span>Компьютер</span>
            </button>
            <button 
              onClick={() => {
                if (window.confirm("Внимание: интерфейс на мобильных устройствах может быть ужасным. Продолжить?")) {
                  setDeviceType("mobile");
                  setStep(2);
                }
              }}
              class="device-button"
            >
              <i class="ri-smartphone-line"></i>
              <span>Мобильное устройство</span>
            </button>
          </div>
        )
      },
      {
        title: "Выберите цвет акцента",
        content: (
          <div class="color-selection">
            <div 
              style={{ 
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                margin: '20px 0'
              }}
            >
              {[
                { hex: '#6b7280', name: 'Default' },
                { hex: '#64748b', name: 'Slate' },
                { hex: '#71717a', name: 'Zinc' },
                { hex: '#737373', name: 'Neutral' },
                { hex: '#78716c', name: 'Stone' }
              ].map(({ hex, name }) => (
                <button
                  onClick={() => {
                    setAccentColor(hex);
                    document.documentElement.style.setProperty('--accent-color', hex);
                  }}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: 'none',
                    background: hex,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: accentColor() === hex ? 
                      `0 0 0 3px white, 0 0 0 6px ${hex}` : 
                      '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = `0 0 0 3px white, 0 0 0 6px ${hex}`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = accentColor() === hex ? 
                      `0 0 0 3px white, 0 0 0 6px ${hex}` : 
                      '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                  title={name}
                />
              ))}
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'color';
                  input.value = accentColor();
                  input.addEventListener('change', (e) => {
                    const newColor = e.target.value;
                    setAccentColor(newColor);
                    document.documentElement.style.setProperty('--accent-color', newColor);
                  });
                  input.click();
                }}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'linear-gradient(45deg, #6b7280, #4b5563)',
                  color: 'white',
                  fontSize: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px white, 0 0 0 6px #4b5563';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
                title="Custom Color"
              >
                +
              </button>
            </div>
            <button 
              onClick={() => setStep(3)}
              class="next-button"
              style={{ 
                backgroundColor: accentColor(),
                marginTop: '20px'
              }}
            >
              Продолжить
            </button>
          </div>
        )
      }
      ,
    {
      title: "Настройка фона",
      content: (
        <div class="background-selection">
          <button 
            onClick={() => {
              setHasBackground(true);
              setStep(4);
            }}
            class="option-button"
          >
            <i class="ri-image-add-line"></i>
            <span>Выбрать фон</span>
          </button>
          <button 
            onClick={() => {
              setHasBackground(false);
              setStep(4);
            }}
            class="option-button"
          >
            <i class="ri-close-circle-line"></i>
            <span>Пропустить</span>
          </button>
        </div>
      )
    },
    {
      title: "Всё готово!",
      content: (
        <div class="finish-setup">
          <p>Настройка завершена. Можно начинать работу!</p>
          <button 
            onClick={() => onComplete({
              deviceType: deviceType(),
              accentColor: accentColor(),
              hasBackground: hasBackground()
            })}
            class="start-button"
          >
            Начать
          </button>
        </div>
      )
    }
  ];

  return (
    <div class="welcome-overlay">
      <div class="welcome-container">
        <h2 class="welcome-title">{steps[step()].title}</h2>
        <div class="welcome-content">
          {typeof steps[step()].content === 'string' 
            ? <p>{steps[step()].content}</p> 
            : steps[step()].content
          }
        </div>
        <Show when={step() === 0}>
          <button 
            onClick={steps[step()].action}
            class="start-button"
          >
            Начать настройку
          </button>
        </Show>
        <div class="step-indicator">
          {steps.map((_, index) => (
            <div 
              class="step-dot" 
              classList={{ active: index === step() }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
