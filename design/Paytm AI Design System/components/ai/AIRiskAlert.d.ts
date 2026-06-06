import * as React from "react";

/**
 * @startingPoint section="AI" subtitle="Fraud / risk warning with severity & actions" viewport="360x270"
 */
export interface AIRiskAlertProps {
  severity?: "critical" | "high" | "medium" | "low";
  title: string;
  body: string;
  confidence?: "high" | "medium" | "low";
  primaryLabel?: string;
  secondaryLabel?: string;
  /** Override the primary button variant (defaults to danger for high+). */
  primaryVariant?: "primary" | "danger" | "navy" | "success";
  onPrimary?: () => void;
  onSecondary?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** Fraud / scam / unusual-activity / revenue-risk alert with clear actions. */
export function AIRiskAlert(props: AIRiskAlertProps): React.JSX.Element;
