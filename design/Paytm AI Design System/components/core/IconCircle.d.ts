import * as React from "react";
import { IconName } from "./Icon";

export interface IconCircleProps {
  /** Icon name to render centered. */
  icon?: IconName;
  /** Diameter in px. Default 40. */
  size?: number;
  /** Background tint (CSS color or var()). */
  bg?: string;
  /** Icon color. */
  color?: string;
  /** Override icon size. */
  iconSize?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/** Round tinted container for a line icon. */
export function IconCircle(props: IconCircleProps): React.JSX.Element;
