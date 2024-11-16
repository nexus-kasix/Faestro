import { createSignal, onMount, onCleanup } from "solid-js";
import ColorPicker from "./ColorPicker";
import WallpaperGallery from "./WallpaperGallery";
import { commands } from "../../commands/console";

const SafariumSettings = ({ onClose }) => {
  const [activeSection, setActiveSection] = createSignal(null);
  const [activeSubSection, setActiveSubSection] = createSignal(null);
  const [showColorPicker, setShowColorPicker] = createSignal(false);
  const [showWallpaperGallery, setShowWallpaperGallery] = createSignal(false);
  const [speechAIEnabled, setSpeechAIEnabled] = createSignal(localStorage.getItem('faestro-speech-ai-enabled') === 'true');

  const handleColorChange = (color) => {
    if (!color) return;
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('faestro-accent-color', color);
    
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

  const handleOutsideClick = (event) => {
    const settingsContainer = document.querySelector('.settings-container');
    const colorPicker = document.querySelector('.color-picker-container');
    const wallpaperGallery = document.querySelector('.wallpaper-gallery');

    if (settingsContainer && !settingsContainer.contains(event.target)) {
      onClose();
    }

    if (colorPicker && !colorPicker.contains(event.target) && 
        !event.target.closest('[data-action="toggle-color-picker"]')) {
      setShowColorPicker(false);
    }

    if (wallpaperGallery && !wallpaperGallery.contains(event.target) && 
        !event.target.closest('[data-action="toggle-wallpaper"]')) {
      setShowWallpaperGallery(false);
    }
  };

  onMount(() => {
    document.addEventListener('mousedown', handleOutsideClick);
  });

  onCleanup(() => {
    document.removeEventListener('mousedown', handleOutsideClick);
  });

  const sections = [
    {
      id: 'system',
      title: 'System',
      icon: 'ri-settings-3-line',
      items: [
        {
          id: 'appearance',
          title: 'Appearance',
          icon: 'ri-palette-line',
          hasChildren: true,
          children: [
            {
              id: 'accent-color',
              title: 'Accent Color',
              icon: 'ri-drop-line',
              keepOpen: true,
              hasColorPicker: true,
              action: () => setShowColorPicker(prev => !prev)
            },
            {
              id: 'wallpaper-divider',
              type: 'divider',
              title: 'Wallpaper'
            },
            {
              id: 'gallery',
              title: 'Wallpaper Gallery',
              icon: 'ri-gallery-line',
              action: () => setShowWallpaperGallery(true)
            },
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
        },
        {
          id: 'interface',
          title: 'Interface',
          icon: 'ri-layout-line',
          hasChildren: true,
          children: [
            {
              id: 'device-type',
              title: 'Device Type',
              icon: 'ri-device-line',
              hasChildren: true,
              children: [
                {
                  id: 'pc',
                  title: 'PC',
                  icon: 'ri-computer-line',
                  action: () => {
                    setDeviceType('PC');
                    document.body.classList.remove('mobile-device');
                  }
                },
                {
                  id: 'mobile',
                  title: 'Mobile',
                  icon: 'ri-smartphone-line',
                  action: () => {
                    if (window.confirm("Warning: interface on mobile devices might be terrible. Continue?")) {
                      setDeviceType('Mobile');
                      document.body.classList.add('mobile-device');
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'speech-ai',
      title: 'Speech AI',
      icon: 'ri-robot-line',
      items: [
        {
          id: 'speech-ai-toggle',
          title: 'Enable Speech AI',
          icon: 'ri-toggle-line',
          hasToggle: true,
          action: (checked) => {
            setSpeechAIEnabled(checked);
            localStorage.setItem('faestro-speech-ai-enabled', checked);
            const currentSettings = JSON.parse(localStorage.getItem('faestro-settings') || '{}');
            currentSettings.speechAIEnabled = checked;
            localStorage.setItem('faestro-settings', JSON.stringify(currentSettings));
            
            const speechButton = document.getElementById('console-speech');
            if (speechButton) {
              speechButton.style.display = checked ? 'flex' : 'none';
            }
          },
          value: () => speechAIEnabled()
        },
        {
          id: 'mistral-api-key',
          title: 'Mistral API Key',
          icon: 'ri-key-line',
          action: () => {
            const currentKey = localStorage.getItem('faestro-mistral-api-key') || '';
            const newKey = prompt('Enter your Mistral API key:', currentKey);
            if (newKey !== null) {
              localStorage.setItem('faestro-mistral-api-key', newKey);
              window.location.reload();
            }
          },
          value: () => {
            const key = localStorage.getItem('faestro-mistral-api-key');
            return key ? '••••' + key.slice(-4) : 'Not configured';
          }
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
          value: () => `Faestro ${import.meta.env.VITE_FAESTRO_VERSION}`
        },
        {
          id: 'reset',
          title: 'Reset All Settings',
          icon: 'ri-refresh-line',
          isDangerous: true,
          action: () => {
            if (confirm('Are you sure you want to reset all settings? This cannot be undone.')) {
              // Clear all localStorage items
              localStorage.clear();
              
              // Reset accent color to default
              document.documentElement.style.setProperty('--accent-color', '#6366f1');
              document.body.style.backgroundImage = 'none';
              document.body.style.backgroundColor = '#6366f1';
              
              // Reset speech AI
              localStorage.setItem('faestro-speech-ai-enabled', 'false');
              const speechButton = document.getElementById('console-speech');
              if (speechButton) {
                speechButton.style.display = 'none';
              }
              
              window.location.reload();
            }
          }
        }
      ]
    }
  ];

  const renderDetailContent = (children) => (
    <div class="detail-content">
      {children.map(child => (
        <>
          {child.type === 'divider' ? (
            <div class="settings-divider">
              <span>{child.title}</span>
            </div>
          ) : (
            <div 
              class="detail-item"
              data-action={child.hasColorPicker ? "toggle-color-picker" : 
                          child.id === 'gallery' ? "toggle-wallpaper" : null}
              onClick={(e) => {
                e.stopPropagation();
                if (child.hasChildren) {
                  setActiveSubSection({
                    parentId: child.id,
                    children: child.children
                  });
                } else if (!child.hasToggle && child.action) {
                  child.action();
                  if (!child.keepOpen) {
                    setActiveSubSection(null);
                  }
                }
              }}
            >
              <div class="item-icon">
                <i class={child.icon}></i>
              </div>
              <div class="item-content">
                <div class="item-title">{child.title}</div>
                {child.value && !child.hasToggle && <div class="item-value">{child.value()}</div>}
              </div>
              {child.hasToggle && (
                <div 
                  class={`settings-checkbox ${child.value() ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const currentValue = child.value();
                    child.action(!currentValue);
                  }}
                />
              )}
              {child.hasChildren && <i class="ri-arrow-right-s-line"></i>}
            </div>
          )}
          {child.hasColorPicker && showColorPicker() && (
            <div 
              class="color-picker-container"
              onClick={(e) => e.stopPropagation()}
            >
              <ColorPicker
                initialColor={getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim()}
                onChange={handleColorChange}
              />
            </div>
          )}
        </>
      ))}
    </div>
  );

  const renderContent = () => {
    if (showWallpaperGallery()) {
      return (
        <WallpaperGallery 
          onClose={() => setShowWallpaperGallery(false)}
          onSelect={(wallpaper) => {
            document.body.style.backgroundImage = `url(${wallpaper})`;
            localStorage.setItem('faestro-background', wallpaper);
            setShowWallpaperGallery(false);
          }}
        />
      );
    }

    if (activeSubSection()) {
      // Находим родительский элемент
      const parentItem = sections
        .flatMap(s => s.items)
        .find(i => i.id === activeSubSection().parentId);

      // Находим прямых детей этого элемента
      const children = parentItem?.children || 
                      parentItem?.items?.find(i => i.id === activeSubSection().childId)?.children || 
                      activeSubSection().children;

      if (!children) return null;

      return (
        <div class="settings-detail">
          <div class="detail-header">
            <button onClick={() => setActiveSubSection(null)} class="back-button">
              <i class="ri-arrow-left-s-line"></i>
              Back
            </button>
            <h3>{parentItem?.title || 'Settings'}</h3>
          </div>
          {renderDetailContent(children)}
        </div>
      );
    }

    if (activeSection()) {
      const section = sections.find(s => s.id === activeSection());
      if (!section) return null;

      return (
        <div class="settings-detail">
          <div class="detail-header">
            <button onClick={() => setActiveSection(null)} class="back-button">
              <i class="ri-arrow-left-s-line"></i>
              Back
            </button>
            <h3>{section.title}</h3>
          </div>
          {renderDetailContent(section.items)}
        </div>
      );
    }

    return (
      <div class="settings-sections">
        {sections.map(section => (
          <div 
            class="settings-section" 
            onClick={() => setActiveSection(section.id)}
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

        {/* Color Picker Overlay */}
        {showColorPicker() && (
          <div class="modal-overlay">
            <div class="modal-content" onClick={e => e.stopPropagation()}>
              <ColorPicker
                initialColor={getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim()}
                onChange={handleColorChange}
              />
            </div>
          </div>
        )}

        {/* Wallpaper Gallery Overlay */}
        {showWallpaperGallery() && (
          <div class="modal-overlay">
            <div class="modal-content" onClick={e => e.stopPropagation()}>
              <WallpaperGallery 
                onClose={() => setShowWallpaperGallery(false)}
                onSelect={(wallpaper) => {
                  document.body.style.backgroundImage = `url(${wallpaper})`;
                  document.body.style.backgroundSize = 'cover';
                  document.body.style.backgroundPosition = 'center';
                  localStorage.setItem('faestro-background', wallpaper);
                  setShowWallpaperGallery(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafariumSettings;
