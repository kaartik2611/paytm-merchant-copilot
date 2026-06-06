import * as React from "react";
import { IconName } from "./Icon";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "info" | "success" | "warning" | "danger" | "brand" | "ai";
  /** Show a leading status dot. */
  dot?: boolean;
  /** Optional leading icon. */
  icon?: IconName;
  children?: React.ReactNode;
}

/** Small status pill. */
export function Badge(props: BadgeProps): React.JSX.Element;
