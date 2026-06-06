import * as React from "react";
import { IconName } from "../core/Icon";

/**
 * @startingPoint section="AI" subtitle="Suggested action with projected impact" viewport="360x240"
 */
export interface AIRecommendationCardProps {
  icon?: IconName;
  iconBg?: string;
  iconColor?: string;
  title: string;
  body: string;
  /** Projected benefit, e.g. "Save ~₹450 / month". */
  impact?: string;
  confidence?: "high" | "medium" | "low";
  acceptLabel?: string;
  onAccept?: () => void;
  onDismiss?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** A suggested action (save money, improve cash flow, increase sales…). */
export function AIRecommendationCard(props: AIRecommendationCardProps): React.JSX.Element;
