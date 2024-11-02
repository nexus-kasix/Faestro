// src/components/LoadingScreen.jsx
import { createSignal, onMount, For } from "solid-js";
import { RESOURCES } from "../utils/loader";

const LoadingScreen = () => {
  const [isHidden, setIsHidden] = createSignal(false);
  const initialStates = Object.values(RESOURCES).reduce((acc, resource) => {
    acc[resource] = { 
      loaded: false,
      animated: false,
      animationComplete: false // Add new flag
    };
    return acc;
  }, {});
  const [resourceStates, setResourceStates] = createSignal(initialStates);

  onMount(() => {
    const handleResourceLoaded = (e) => {
      const resource = e.detail.resource;

      if (!resourceStates()[resource].loaded) {
        // First mark as loaded
        setResourceStates(prev => ({
          ...prev,
          [resource]: { 
            ...prev[resource],
            loaded: true 
          }
        }));

        // Start animation after a short delay
        setTimeout(() => {
          setResourceStates(prev => ({
            ...prev,
            [resource]: {
              ...prev[resource],
              animated: true
            }
          }));

          // Mark animation as complete after duration
          setTimeout(() => {
            setResourceStates(prev => ({
              ...prev,
              [resource]: {
                ...prev[resource],
                animationComplete: true
              }
            }));
          }, 500); // Animation duration
        }, 150);
      }
    };

    window.addEventListener('resourceLoaded', handleResourceLoaded);

    // Clean up the event listener
    return () => {
      window.removeEventListener('resourceLoaded', handleResourceLoaded);
    };
  });

  return (
    <div class={`loading-screen${isHidden() ? ' hidden' : ''}`}>
      <div class="loading-content">
        <div class="logo-container">
          <img src="/icon.svg" alt="Faestro Logo" />
        </div>
        <div class="loading-states">
          <For each={Object.entries(resourceStates())}>
            {([resource, state]) => (
              <div class={`loading-state ${state.loaded ? 'loaded' : ''}`}>
                <span class="resource-name">{resource}</span>
                <i class={`loading-indicator
                  ${state.loaded ? "ri-checkbox-circle-fill" : "ri-loader-4-line"}
                  ${state.animated && !state.animationComplete ? 'animate-loading' : ''}
                  ${state.animationComplete ? 'animate-complete' : ''}`}
                ></i>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;