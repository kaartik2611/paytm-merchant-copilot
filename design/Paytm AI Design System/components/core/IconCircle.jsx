import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * IconCircle — round tinted container for a line icon. Used across
 * service tiles, list rows and AI cards. Pass a `bg`/`color` to tint.
 */
export function IconCircle({ icon, size = 40, bg, color, iconSize, className = "", style = {}, children }) {
  const s = { width: size, height: size, background: bg, color, ...style };
  return (
    <span className={["pt-iconcircle", className].filter(Boolean).join(" ")} style={s}>
      {icon ? <Icon name={icon} size={iconSize || Math.round(size * 0.5)} /> : children}
    </span>
  );
}
