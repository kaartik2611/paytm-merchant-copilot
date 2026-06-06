import * as React from "react";
import { IconName } from "./Icon";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ai";
  icon?: IconName;
  children?: React.ReactNode;
}

/** Tappable pill for suggested prompts, quick actions and filters. */
export function Chip(props: ChipProps): React.JSX.Element;
