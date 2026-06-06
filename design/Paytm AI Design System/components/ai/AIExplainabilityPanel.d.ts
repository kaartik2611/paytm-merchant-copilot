import * as React from "react";

export interface ExplainFactor {
  name: string;
  /** Relative weight 0–100 for the bar. */
  weight: number;
}

export interface AIExplainabilityPanelProps {
  title?: string;
  /** Plain-language reason this was surfaced. */
  reason?: string;
  factors?: ExplainFactor[];
  /** Footer provenance line. */
  confidenceLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** The transparent "why" behind a recommendation or alert. */
export function AIExplainabilityPanel(props: AIExplainabilityPanelProps): React.JSX.Element;
