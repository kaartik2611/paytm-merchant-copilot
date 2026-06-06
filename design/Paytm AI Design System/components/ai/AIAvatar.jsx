import React from "react";
import { Icon } from "../core/Icon.jsx";

/**
 * AIAvatar — the Paytm AI mark: a sparkle on the sanctioned cyan→blue
 * →navy sheen. The single place the AI gradient is allowed. Use `soft`
 * for a low-emphasis tinted version on light surfaces.
 */
export function AIAvatar({ size = 36, soft = false, square = false, className = "", style = {} }) {
  const cls = [
    "ai-mark",
    soft ? "ai-mark--soft" : "",
    square ? "ai-mark--square" : "",
    className,
  ].filter(Boolean).join(" ");
  return (
    <span className={cls} style={{ width: size, height: size, ...style }}>
      <Icon name="sparkles" size={Math.round(size * 0.56)} strokeWidth={2} />
    </span>
  );
}
