import * as React from "react";

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  /** Right-aligned action label, e.g. "View All". */
  action?: string;
  onAction?: () => void;
}

/** Bold section title with optional right-aligned action link. */
export function SectionHeader(props: SectionHeaderProps): React.JSX.Element;
