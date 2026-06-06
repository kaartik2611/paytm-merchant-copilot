import * as React from "react";

export interface AvatarProps {
  /** Image URL. When omitted, initials are shown. */
  src?: string;
  /** Initials fallback, e.g. "SR". */
  initials?: string;
  /** Diameter in px. Default 36. */
  size?: number;
  bg?: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Circular user / merchant avatar with initials fallback. */
export function Avatar(props: AvatarProps): React.JSX.Element;
