// src/components/ColorPicker.jsx
import { HexColorPicker } from "react-colorful";
import { createSignal } from "solid-js";

const ColorPicker = (props) => {
  const [color, setColor] = createSignal(props.initialColor || "#6b7280");

  const handleColorChange = (newColor) => {
    setColor(newColor);
    if (props.onChange) {
      props.onChange(newColor);
    }
  };

  return (
    <div class="color-picker-wrapper">
      <HexColorPicker 
        color={color()} 
        onChange={handleColorChange}
      />
    </div>
  );
};

export default ColorPicker;  // Using default export
