// src/components/LoadingScreen.jsx
import { createSignal, onMount, For } from "solid-js";
import { RESOURCES } from "../services/loader";

const LoadingScreen = () => {
  const [isHidden, setIsHidden] = createSignal(false);
  const initialStates = Object.values(RESOURCES).reduce((acc, resource) => {
    acc[resource] = { 
      loaded: false,
      animated: false,
      animationComplete: false
    };
    return acc;
  }, {});
  const [resourceStates, setResourceStates] = createSignal(initialStates);

  onMount(() => {
    const handleResourceLoaded = (e) => {
      const resource = e.detail.resource;

      if (!resourceStates()[resource].loaded) {
        setResourceStates(prev => ({
          ...prev,
          [resource]: { 
            ...prev[resource],
            loaded: true 
          }
        }));

        setTimeout(() => {
          setResourceStates(prev => ({
            ...prev,
            [resource]: {
              ...prev[resource],
              animated: true
            }
          }));

          setTimeout(() => {
            setResourceStates(prev => ({
              ...prev,
              [resource]: {
                ...prev[resource],
                animationComplete: true
              }
            }));
          }, 500);
        }, 150);
      }
    };

    window.addEventListener('resourceLoaded', handleResourceLoaded);
    return () => window.removeEventListener('resourceLoaded', handleResourceLoaded);
  });

  return (
    <div class={`loading-screen${isHidden() ? ' hidden' : ''}`}>
      <div class="logo-container">
        <img src="/icon.svg" alt="Faestro Logo" />
      </div>
    </div>
  );
};

export default LoadingScreen;