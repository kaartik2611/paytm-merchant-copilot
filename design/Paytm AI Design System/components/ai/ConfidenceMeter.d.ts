import * as React from "react";

export interface ConfidenceMeterProps {
  /** Preset level. Ignored if `value` is set. */
  level?: "high" | "medium" | "low";
  /** Explicit 0–100 confidence. */
  value?: number;
  /** Thin progress track, or a 5-bar signal. */
  variant?: "track" | "bars";
  showLabel?: boolean;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Communicates how sure the model is — track or signal-bars. */
export function ConfidenceMeter(props: ConfidenceMeterProps): React.JSX.Element;
