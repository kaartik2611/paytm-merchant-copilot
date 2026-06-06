import * as React from "react";
import { IconName } from "./Icon";

/**
 * @startingPoint section="Core" subtitle="Paytm pill button — all variants & sizes" viewport="700x150"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "navy" | "danger" | "success" | "neutral";
  size?: "sm" | "md" | "lg";
  /** Stretch to full width. */
  block?: boolean;
  /** Leading icon name. */
  icon?: IconName;
  /** Trailing icon name. */
  iconRight?: IconName;
  children?: React.ReactNode;
}

/** The Paytm pill button. */
export function Button(props: ButtonProps): React.JSX.Element;
