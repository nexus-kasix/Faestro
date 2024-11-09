// src/components/Welcome.jsx
import { createSignal, Show, onMount, onCleanup } from "solid-js";
import ColorPicker from "./ColorPicker";

const Welcome = ({ onComplete }) => {
  const [step, setStep] = createSignal(0);
  const [deviceType, setDeviceType] = createSignal("");
  const [accentColor, setAccentColor] = createSignal("#6b7280");
  const [hasBackground, setHasBackground] = createSignal(false);
  const [showColorPicker, setShowColorPicker] = createSignal(false);

  const handleBackgroundSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          try {
            document.body.style.backgroundImage = `url(${imageUrl})`;
            localStorage.setItem('faestro-background', `url(${imageUrl})`);
            setHasBackground(true);
            setStep(4);
          } catch (error) {
            console.error('Failed to save background:', error);
            alert('Failed to save background. Please try again.');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleClickOutside = (event) => {
    const colorPickerContainer = document.querySelector('.color-picker-container');
    const colorPickerButton = document.querySelector('.color-selection-button');
    
    if (showColorPicker() && 
        colorPickerContainer && 
        !colorPickerContainer.contains(event.target) &&
        !colorPickerButton.contains(event.target)) {
      setShowColorPicker(false);
    }
  };

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);
    onCleanup(() => {
      document.removeEventListener('mousedown', handleClickOutside);
    });
  });

  const handleDeviceSelect = (type) => {
    setDeviceType(type);
    if (type === "mobile") {
      document.body.classList.add('mobile-device');
      localStorage.setItem('faestro-device-type', 'mobile');
    } else {
      document.body.classList.remove('mobile-device');
      localStorage.setItem('faestro-device-type', 'pc');
    }
    setStep(2);
  };

  const steps = [
    {
      title: "Welcome to Faestro!",
      content: "Let's set up Faestro before we start using it.",
      action: () => setStep(1)
    },
    {
      title: "Choose device type",
      content: (
        <div class="device-selection">
          <button 
            onClick={() => handleDeviceSelect("pc")}
            class="device-button"
          >
            <i class="ri-computer-line"></i>
            <span>Computer</span>
          </button>
          <button 
            onClick={() => {
              if (window.confirm("Warning: interface on mobile devices might be terrible. Continue?")) {
                handleDeviceSelect("mobile");
              }
            }}
            class="device-button"
          >
            <i class="ri-smartphone-line"></i>
            <span>Mobile device</span>
          </button>
        </div>
      )
    },
    {
      title: "Choose accent color",
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
                  document.documentElement.style.setProperty('--accent-dark', hex);
                  document.body.style.backgroundColor = hex;
                }}
                class="color-selection-button"
                classList={{ selected: accentColor() === hex }}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: accentColor() === hex ? `2px solid ${hex}` : '2px solid var(--border-color)',
                  background: hex,
                  cursor: 'pointer',
                  transition: 'all 0.3s var(--transition-bezier)',
                  transform: accentColor() === hex ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: accentColor() === hex ? 
                    `0 0 0 2px white, 0 0 0 4px ${hex}` : 
                    'none'
                }}
                title={name}
              />
            ))}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowColorPicker(!showColorPicker())} 
                class="color-selection-button"
                style={{
                  width: '40px',
                  height: '40px',
                  'border-radius': '50%',
                  border: '2px solid var(--border-color)',
                  background: accentColor(),
                  cursor: 'pointer',
                  transition: 'all 0.3s var(--transition-bezier)'
                }}
              >
                <i class="ri-add-line" style={{ color: '#fff' }}></i>
              </button>

              {showColorPicker() && (
                <div
                  class="color-picker-container"
                  style={{
                    position: 'absolute',
                    zIndex: 2,
                    top: '50px',
                    left: '0px'
                  }}
                >
                  <ColorPicker
                    color={accentColor()}
                    onChange={(color) => {
                      setAccentColor(color);
                      document.documentElement.style.setProperty('--accent-color', color);
                      document.documentElement.style.setProperty('--accent-dark', color);
                      document.body.style.backgroundColor = color;
                    }}
                    onClose={() => setShowColorPicker(false)}
                  />
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => setStep(3)}
            class="next-button"
            style={{ 
              backgroundColor: accentColor(),
              marginTop: '20px'
            }}
          >
            Continue
          </button>
        </div>
      )
    },
    {
      title: "Background setup",
      content: (
        <div class="background-selection">
          <button 
            onClick={handleBackgroundSelect}
            class="option-button"
          >
            <i class="ri-image-add-line"></i>
            <span>Choose background</span>
          </button>
          <button 
            onClick={() => {
              setHasBackground(false);
              document.body.style.backgroundImage = 'none';
              setStep(4);
            }}
            class="option-button"
          >
            <i class="ri-close-circle-line"></i>
            <span>Skip</span>
          </button>
        </div>
      )
    },
    {
      title: "All set!",
      content: (
        <div class="finish-setup">
          <p>Setup complete. Ready to start!</p>
          <button 
            onClick={() => onComplete({
              deviceType: deviceType(),
              accentColor: accentColor(),
              hasBackground: hasBackground()
            })}
            class="start-button"
          >
            Start
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
            Start setup
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
