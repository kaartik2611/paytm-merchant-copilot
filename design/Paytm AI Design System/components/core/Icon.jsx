import React from "react";

/**
 * Icon — curated line-icon set in the Lucide style (24×24, 2px stroke,
 * round caps) to match Paytm's thin-stroke navy glyphs. Inherits color
 * via `currentColor` and sizes via the `size` prop.
 */
const PATHS = {
  // AI / brand
  sparkles: <><path d="M9.94 4.5 12 9l4.5 2.06L12 13.1 9.94 17.6 7.88 13.1 3.38 11.06 7.88 9 9.94 4.5Z"/><path d="M18 5v3"/><path d="M16.5 6.5h3"/><path d="M18 16v2"/><path d="M17 17h2"/></>,
  sparkle: <path d="M12 3 14.09 9.26 20.5 11.5 14.09 13.74 12 20 9.91 13.74 3.5 11.5 9.91 9.26 12 3Z"/>,
  // arrows / chevrons
  "arrow-right": <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
  "arrow-left": <><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>,
  "chevron-right": <path d="m9 18 6-6-6-6"/>,
  "chevron-down": <path d="m6 9 6 6 6-6"/>,
  "arrow-up-right": <><path d="M7 17 17 7"/><path d="M7 7h10v10"/></>,
  // chat / voice
  send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1"/><path d="M12 18v4"/></>,
  "message-circle": <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>,
  // status
  check: <path d="M20 6 9 17l-5-5"/>,
  "check-circle": <><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></>,
  x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>,
  "alert-triangle": <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>,
  "shield-check": <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
  "shield-alert": <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></>,
  // finance / data
  "trending-up": <><path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/></>,
  "trending-down": <><path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/></>,
  "bar-chart": <><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6" rx="1"/><rect x="12" y="7" width="3" height="10" rx="1"/><rect x="17" y="13" width="3" height="4" rx="1"/></>,
  wallet: <><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5"/><path d="M18 12h.01"/></>,
  "indian-rupee": <><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3a5 5 0 0 0 0-10"/></>,
  "piggy-bank": <><path d="M19 11a8 8 0 0 0-7-4H9a6 6 0 0 0-6 6 5 5 0 0 0 2 4v3h3v-2h4v2h3v-3a6 6 0 0 0 2-4Z"/><path d="M16 11h.01"/><path d="M2 9v2"/></>,
  scan: <><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M3 12h18"/></>,
  store: <><path d="M3 9 4.5 4h15L21 9"/><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M3 9h18"/></>,
  lightbulb: <><path d="M9 18h6"/><path d="M10 22h4"/><path d="M8 14a5 5 0 1 1 8 0c-.7.9-1 1.5-1 3H9c0-1.5-.3-2.1-1-3Z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  package: <><path d="m7.5 4.3 9 5.2v9L7.5 13.4Z" opacity="0"/><path d="M12 2 3 7v10l9 5 9-5V7Z"/><path d="m3 7 9 5 9-5"/><path d="M12 22V12"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M18 19a2 2 0 0 1-2 2h-2"/><rect x="2" y="13" width="4" height="6" rx="1"/><rect x="18" y="13" width="4" height="6" rx="1"/></>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
};

export function Icon({ name, size = 20, strokeWidth = 2, className, style, ...rest }) {
  const path = PATHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      {...rest}
    >
      {path || null}
    </svg>
  );
}
