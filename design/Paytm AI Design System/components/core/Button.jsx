import React from "react";
import { Icon } from "./Icon.jsx";

/**
 * Button — Paytm pill button. Primary (blue), secondary (outline),
 * ghost, navy, danger, success, neutral. Sizes sm/md/lg.
 */
export function Button({
  children,
  variant = "primary",
  size = "lg",
  block = false,
  icon,
  iconRight,
  disabled = false,
  className = "",
  ...rest
}) {
  const cls = [
    "pt-btn",
    `pt-btn--${variant}`,
    `pt-btn--${size}`,
    block ? "pt-btn--block" : "",
    className,
  ].filter(Boolean).join(" ");
  const isz = size === "sm" ? 16 : 18;
  return (
    <button className={cls} disabled={disabled} {...rest}>
      {icon && <Icon name={icon} size={isz} />}
      {children}
      {iconRight && <Icon name={iconRight} size={isz} />}
    </button>
  );
}
