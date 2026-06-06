import React from "react";
import { Icon } from "../core/Icon.jsx";
import { ConfidenceMeter } from "./ConfidenceMeter.jsx";
import { Button } from "../core/Button.jsx";

const SEV = {
  critical: { icon: "shield-alert", label: "Critical" },
  high:     { icon: "shield-alert", label: "High risk" },
  medium:   { icon: "alert-triangle", label: "Medium" },
  low:      { icon: "info", label: "Heads up" },
};

/**
 * AIRiskAlert — fraud / scam / unusual-activity / revenue-risk warning.
 * Carries a severity level, confidence score and clear next actions.
 * Tinted by severity; never alarmist red unless severity is high+.
 */
export function AIRiskAlert({
  severity = "high",
  title,
  body,
  confidence = "high",
  primaryLabel = "Block transaction",
  secondaryLabel = "It's safe",
  onPrimary,
  onSecondary,
  primaryVariant,
  className = "",
  style = {},
}) {
  const s = SEV[severity] || SEV.high;
  const isDanger = severity === "critical" || severity === "high";
  return (
    <div className={["ai-risk", `ai-risk--${severity}`, className].filter(Boolean).join(" ")} style={style}>
      <div className="ai-risk__head">
        <span className="ai-risk__icon"><Icon name={s.icon} size={19} strokeWidth={2.2} /></span>
        <div style={{ flex: 1 }}>
          <span className="ai-risk__sev">{s.label}</span>
          <div className="ai-risk__title">{title}</div>
        </div>
      </div>
      <p className="ai-risk__body">{body}</p>
      <div style={{ marginTop: 12 }}>
        <ConfidenceMeter level={confidence} variant="track" />
      </div>
      <div className="ai-risk__actions">
        <Button variant={primaryVariant || (isDanger ? "danger" : "primary")} size="md" onClick={onPrimary}>{primaryLabel}</Button>
        {secondaryLabel && <Button variant="secondary" size="md" onClick={onSecondary}>{secondaryLabel}</Button>}
      </div>
    </div>
  );
}
