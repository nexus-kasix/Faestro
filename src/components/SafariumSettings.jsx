import { createSignal, Show } from "solid-js";
import ColorPicker from "./ColorPicker";
import { commands } from "../commands/console";

const SafariumSettings = ({ onClose }) => {
  const [activeSection, setActiveSection] = createSignal(null);
  const [activeSubSection, setActiveSubSection] = createSignal(null);
  const [showColorPicker, setShowColorPicker] = createSignal(false);

  const handleColorChange = (color) => {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('faestro-accent-color', color);
    
    // Если нет фона, меняем цвет фона на акцентный
    if (!document.body.style.backgroundImage || document.body.style.backgroundImage === 'none') {
      document.body.style.backgroundColor = color;
    }
  };

  const setDeviceType = (type) => {
    localStorage.setItem('faestro-device-type', type);
    
    const currentSettings = JSON.parse(localStorage.getItem('faestro-settings') || '{}');
    
    currentSettings.deviceType = type;
    
    localStorage.setItem('faestro-settings', JSON.stringify(currentSettings));
    
    document.documentElement.setAttribute('data-device', type.toLowerCase());
    
    if (type.toLowerCase() === 'mobile') {
      document.documentElement.style.setProperty('--scale-factor', '0.8');
      document.body.classList.add('mobile-device');
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      }
    } else {
      document.documentElement.style.setProperty('--scale-factor', '1');
      document.body.classList.remove('mobile-device');
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0';
      }
    }
    
    setActiveSubSection(null);
  };

  const sections = [
    {
      id: 'appearance',
      title: 'Appearance',
      icon: 'ri-palette-line',
      items: [
        {
          id: 'accent-color',
          title: 'Accent Color',
          icon: 'ri-drop-line',
          action: () => setShowColorPicker(true)
        },
        {
          id: 'background',
          title: 'Background',
          icon: 'ri-image-line',
          hasChildren: true,
          children: [
            {
              id: 'upload-background',
              title: 'Upload Image',
              icon: 'ri-upload-2-line',
              action: () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const imageUrl = e.target.result;
                      document.body.style.backgroundImage = `url(${imageUrl})`;
                      localStorage.setItem('faestro-background', imageUrl);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }
            },
            {
              id: 'gallery',
              title: 'Wallpaper Gallery',
              icon: 'ri-gallery-line',
              action: () => {
                onClose();
                commands['faestro.safarium.background.wallpaper_gallery']();
              }
            },
            {
              id: 'reset-background',
              title: 'Reset Background',
              icon: 'ri-close-circle-line',
              action: () => {
                document.body.style.backgroundImage = 'none';
                const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
                document.body.style.backgroundColor = accentColor;
                localStorage.removeItem('faestro-background');
              }
            }
          ]
        }
      ]
    },
    {
      id: 'interface',
      title: 'Interface',
      icon: 'ri-layout-line',
      items: [
        {
          id: 'device-type',
          title: 'Device Type',
          icon: 'ri-smartphone-line',
          hasChildren: true,
          children: [
            {
              id: 'pc',
              title: 'PC',
              icon: 'ri-computer-line',
              action: () => {
                setDeviceType('PC');
                document.body.classList.remove('mobile-device');
                const viewport = document.querySelector('meta[name=viewport]');
                if (viewport) {
                  viewport.content = 'width=device-width, initial-scale=1.0';
                }
              }
            },
            {
              id: 'mobile',
              title: 'Mobile',
              icon: 'ri-smartphone-line',
              action: () => {
                setDeviceType('Mobile');
                document.body.classList.add('mobile-device');
                const viewport = document.querySelector('meta[name=viewport]');
                if (viewport) {
                  viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: 'about',
      title: 'About',
      icon: 'ri-information-line',
      items: [
        {
          id: 'version',
          title: 'Version',
          icon: 'ri-code-line',
          value: () => 'Faestro 1.8 Q1'
        },
        {
          id: 'reset',
          title: 'Reset All Settings',
          icon: 'ri-refresh-line',
          isDangerous: true,
          action: () => {
            if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
              localStorage.clear();
              window.location.reload();
            }
          }
        }
      ]
    }
  ];

  const renderContent = () => {
    if (activeSubSection()) {
      const section = activeSection();
      const item = section.items.find(i => i.id === activeSubSection().parentId);
      return (
        <div class="settings-detail">
          <div class="detail-header">
            <button onClick={() => setActiveSubSection(null)} class="back-button">
              <i class="ri-arrow-left-s-line"></i>
              Back
            </button>
            <h3>{item.title}</h3>
          </div>
          <div class="detail-content">
            {item.children.map(child => (
              <div 
                class="detail-item"
                onClick={() => child.action && child.action()}
              >
                <div class="item-icon">
                  <i class={child.icon}></i>
                </div>
                <div class="item-content">
                  <div class="item-title">{child.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeSection()) {
      return (
        <div class="settings-detail">
          <div class="detail-header">
            <button onClick={() => setActiveSection(null)} class="back-button">
              <i class="ri-arrow-left-s-line"></i>
              Back
            </button>
            <h3>{activeSection().title}</h3>
          </div>
          <div class="detail-content">
            {activeSection().items.map(item => (
              <div 
                class={`detail-item${item.isDangerous ? ' dangerous' : ''}`}
                onClick={() => {
                  if (item.hasChildren) {
                    setActiveSubSection({ parentId: item.id, children: item.children });
                  } else if (item.action) {
                    item.action();
                  }
                }}
              >
                <div class="item-icon">
                  <i class={item.icon}></i>
                </div>
                <div class="item-content">
                  <div class="item-title">{item.title}</div>
                  {item.value && (
                    <div class="item-value">{item.value()}</div>
                  )}
                </div>
                {item.hasToggle && (
                  <div class="item-toggle">
                    <input 
                      type="checkbox" 
                      checked={item.value()} 
                      onChange={(e) => item.action(e.target.checked)}
                    />
                  </div>
                )}
                {item.hasChildren && <i class="ri-arrow-right-s-line"></i>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div class="settings-sections">
        {sections.map(section => (
          <div 
            class="settings-section" 
            onClick={() => setActiveSection(section)}
          >
            <div class="section-icon">
              <i class={section.icon}></i>
            </div>
            <div class="section-content">
              <div class="section-title">{section.title}</div>
            </div>
            <i class="ri-arrow-right-s-line"></i>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div class="safarium-settings">
      <div class="settings-overlay" onClick={onClose} />
      <div class="settings-container">
        <div class="settings-header">
          <h2>Settings</h2>
          <button onClick={onClose} class="settings-close">
            <i class="ri-close-line"></i>
          </button>
        </div>
        {renderContent()}
        <Show when={showColorPicker()}>
          <div class="color-picker-container">
            <ColorPicker
              initialColor={getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim()}
              onChange={handleColorChange}
              onOutsideClick={() => setShowColorPicker(false)}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};

export default SafariumSettings;
