import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * Chip — tappable pill for suggested prompts / quick actions / filters.
 * variant: default | ai.
 */
export function Chip({ children, variant = "default", icon, onClick, className = "", ...rest }) {
  const cls = ["pt-chip", variant === "ai" ? "pt-chip--ai" : "", className].filter(Boolean).join(" ");
  return (
    <button type="button" className={cls} onClick={onClick} {...rest}>
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  );
}
