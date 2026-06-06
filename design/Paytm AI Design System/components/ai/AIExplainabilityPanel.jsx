import React from "react";
import { AIAvatar } from "./AIAvatar.jsx";
import { Icon } from "../core/Icon.jsx";

/**
 * AIExplainabilityPanel — the "why" behind a recommendation or alert.
 * Shows a plain-language reason, the weighted supporting factors, and
 * an overall confidence read-out. Builds trust through transparency.
 */
export function AIExplainabilityPanel({
  title = "Why you're seeing this",
  reason,
  factors = [],          // [{ name, weight: 0–100 }]
  confidenceLabel = "Based on 6 months of your activity",
  className = "",
  style = {},
}) {
  return (
    <div className={["ai-explain", className].filter(Boolean).join(" ")} style={style}>
      <div className="ai-explain__head">
        <AIAvatar size={26} soft />
        <span className="ai-explain__title">{title}</span>
      </div>
      {reason && <p className="ai-explain__why">{reason}</p>}
      <div className="ai-explain__factors">
        {factors.map((f, i) => (
          <div className="ai-factor" key={i}>
            <span className="ai-factor__name">{f.name}</span>
            <span className="ai-factor__track"><span className="ai-factor__fill" style={{ width: `${f.weight}%` }} /></span>
            <span className="ai-factor__pct tnum">{f.weight}%</span>
          </div>
        ))}
      </div>
      {confidenceLabel && (
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 14, color: "var(--ink-500)", fontSize: "var(--fs-xs)", fontWeight: 500 }}>
          <Icon name="shield-check" size={14} />
          {confidenceLabel}
        </div>
      )}
    </div>
  );
}
