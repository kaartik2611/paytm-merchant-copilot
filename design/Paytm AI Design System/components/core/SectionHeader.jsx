import React from "react";

/**
 * SectionHeader — bold section title with an optional right-aligned
 * action link (e.g. "View All").
 */
export function SectionHeader({ title, action, onAction, className = "", ...rest }) {
  return (
    <div className={["pt-section", className].filter(Boolean).join(" ")} {...rest}>
      <span className="pt-section__title">{title}</span>
      {action && <span className="pt-section__action" onClick={onAction}>{action}</span>}
    </div>
  );
}
