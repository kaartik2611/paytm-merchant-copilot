import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * Badge — small status pill. tone: neutral | info | success | warning
 * | danger | brand | ai. Optional leading dot or icon.
 */
export function Badge({ children, tone = "neutral", dot = false, icon, className = "", ...rest }) {
  const cls = ["pt-badge", `pt-badge--${tone}`, className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      {dot && <span className="pt-badge__dot" />}
      {icon && <Icon name={icon} size={12} strokeWidth={2.4} />}
      {children}
    </span>
  );
}
