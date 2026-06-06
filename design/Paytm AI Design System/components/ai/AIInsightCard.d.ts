import * as React from "react";

export interface InsightDelta {
  dir: "up" | "down";
  text: string;
}

/**
 * @startingPoint section="AI" subtitle="Generated insight with metric, trend & confidence" viewport="360x230"
 */
export interface AIInsightCardProps {
  eyebrow?: string;
  title: string;
  /** Headline metric, pre-formatted (e.g. "₹18,240"). */
  value?: string;
  delta?: InsightDelta;
  /** Numbers rendered as a mini sparkline. */
  trend?: number[];
  category?: "insight" | "save" | "growth" | "risk";
  confidence?: "high" | "medium" | "low";
  footnote?: string;
  onWhy?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** An AI-generated insight card (spending, usage, revenue, trends). */
export function AIInsightCard(props: AIInsightCardProps): React.JSX.Element;
