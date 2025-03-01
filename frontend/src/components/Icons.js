import React from "react";
import { Image } from "react-native";

export const Icons = {
  Custom: Image,
};

const Icon = ({ type, name, color, size = 24, style }) => {
  const fontSize = 24;
  const Tag = type;

  // Check if the type is Custom
  if (type === Icons.Custom) {
    return (
      <Image
        source={name}
        style={{ width: size, height: size, tintColor: color, ...style }}
      />
    );
  }
};

export default Icon;
