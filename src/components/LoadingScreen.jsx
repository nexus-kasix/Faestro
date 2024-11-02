// src/components/LoadingScreen.jsx
import { createSignal, onMount } from "solid-js";
import { RESOURCES } from "../utils/loader";

const LoadingScreen = () => {
  const [isHidden, setIsHidden] = createSignal(false);
  const [loadingStates, setLoadingStates] = createSignal(
    Object.values(RESOURCES).reduce((acc, resource) => {
      acc[resource] = false;
      return acc;
    }, {})
  );

  onMount(() => {
    // Слушаем изменения состояний загрузки
    window.addEventListener('resourceLoaded', (e) => {
      setLoadingStates(prev => ({
        ...prev,
        [e.detail.resource]: true
      }));

      // Проверяем, загружено ли всё
      if (Object.values(loadingStates()).every(state => state)) {
        setTimeout(() => setIsHidden(true), 500);
      }
    });
  });

  return (
    <div class={`loading-screen${isHidden() ? ' hidden' : ''}`}>
      <div class="loading-content">
        <div class="logo-container">
          <img src="/icon.svg" alt="Faestro Logo" />
        </div>
        <div class="loading-states">
          {Object.entries(loadingStates()).map(([resource, isLoaded]) => (
            <div class={`loading-state ${isLoaded ? 'loaded' : ''}`}>
              <span class="resource-name">{resource}</span>
              <span class="loading-indicator"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;