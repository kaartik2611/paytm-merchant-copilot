import * as React from "react";
import { IconName } from "../core/Icon";

export interface AIAction {
  title: string;
  sub?: string;
  icon?: IconName;
  /** "primary" fills blue, "danger" tints red on hover, default is neutral. */
  tone?: "primary" | "danger" | "neutral";
  onClick?: () => void;
}

export interface AIActionCardProps {
  title?: string;
  actions: AIAction[];
  /** Lay actions out in a row instead of a stack. */
  row?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** A set of clear decisions in response to AI output (block / proceed / …). */
export function AIActionCard(props: AIActionCardProps): React.JSX.Element;
