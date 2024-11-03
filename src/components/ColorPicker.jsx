// src/components/ColorPicker.jsx
import { HexColorPicker } from "solid-colorful";
import { createSignal, onCleanup, onMount } from "solid-js";

const ColorPicker = (props) => {
  const [color, setColor] = createSignal(props.initialColor || "#6b7280");
  let wrapperRef;

  const handleColorChange = (newColor) => {
    setColor(newColor);
    props.onChange && props.onChange(newColor);
  };

  const handleOutsideClick = (e) => {
    if (wrapperRef && !wrapperRef.contains(e.target) && props.onOutsideClick) {
      props.onOutsideClick();
    }
  };

  onMount(() => {
    document.addEventListener('click', handleOutsideClick);
  });

  onCleanup(() => {
    document.removeEventListener('click', handleOutsideClick);
  });

  return (
    <div 
      ref={wrapperRef}
      class="color-picker-wrapper"
    >
      <HexColorPicker 
        color={color()}
        onChange={handleColorChange}
      />
    </div>
  );
};

export default ColorPicker;
