import * as React from "react";

export type IconName =
  | "sparkles" | "sparkle" | "arrow-right" | "arrow-left" | "chevron-right"
  | "chevron-down" | "arrow-up-right" | "send" | "mic" | "message-circle"
  | "check" | "check-circle" | "x" | "info" | "alert-triangle" | "shield-check"
  | "shield-alert" | "trending-up" | "trending-down" | "bar-chart" | "wallet"
  | "indian-rupee" | "piggy-bank" | "scan" | "store" | "lightbulb" | "search"
  | "clock" | "package" | "user" | "headset" | "plus";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /** Icon name from the curated Lucide-style set. */
  name: IconName;
  /** Pixel size (width = height). Default 20. */
  size?: number;
  /** Stroke width. Default 2. */
  strokeWidth?: number;
}

/** Curated line-icon set in the Lucide style, matching Paytm's thin navy glyphs. */
export function Icon(props: IconProps): React.JSX.Element;
