import React from "react";

/**
 * Avatar — circular user/merchant avatar. Renders an image when `src`
 * is given, otherwise initials on a colored background.
 */
export function Avatar({ src, initials, size = 36, bg = "#F26464", color = "#fff", className = "", style = {} }) {
  const s = { width: size, height: size, background: src ? "transparent" : bg, color, fontSize: Math.round(size * 0.38), ...style };
  return (
    <span className={["pt-avatar", className].filter(Boolean).join(" ")} style={s}>
      {src ? <img src={src} alt={initials || "avatar"} /> : initials}
    </span>
  );
}
