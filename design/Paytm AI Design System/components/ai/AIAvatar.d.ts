import * as React from "react";

export interface AIAvatarProps {
  size?: number;
  /** Low-emphasis tinted version for light surfaces. */
  soft?: boolean;
  /** Rounded-square instead of circle. */
  square?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** The Paytm AI mark — sparkle on the sanctioned cyan→blue→navy sheen. */
export function AIAvatar(props: AIAvatarProps): React.JSX.Element;
