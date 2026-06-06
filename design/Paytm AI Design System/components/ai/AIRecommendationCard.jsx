import React from "react";
import { AIAvatar } from "./AIAvatar.jsx";
import { ConfidenceMeter } from "./ConfidenceMeter.jsx";
import { IconCircle } from "../core/IconCircle.jsx";
import { Button } from "../core/Button.jsx";

/**
 * AIRecommendationCard — a suggested action the user can take (save
 * money, improve cash flow, increase sales, optimize inventory). Leads
 * with an icon, a benefit-led title, the projected impact, and a
 * primary accept + secondary dismiss.
 */
export function AIRecommendationCard({
  icon = "piggy-bank",
  iconBg = "var(--success-tint)",
  iconColor = "var(--success)",
  title,
  body,
  impact,               // e.g. "Save ~₹450 / month"
  confidence = "high",
  acceptLabel = "Do it",
  onAccept,
  onDismiss,
  className = "",
  style = {},
}) {
  return (
    <div className={["ai-card", className].filter(Boolean).join(" ")} style={style}>
      <div className="ai-card__head" style={{ marginBottom: 12 }}>
        <AIAvatar size={26} soft />
        <span className="ai-card__eyebrow">AI Recommendation</span>
        <ConfidenceMeter level={confidence} variant="bars" showLabel={false} className="ai-card__spacer" />
      </div>
      <div className="ai-reco">
        <IconCircle className="ai-reco__icon" icon={icon} size={44} bg={iconBg} color={iconColor} />
        <div>
          <div className="ai-card__title" style={{ marginBottom: 5 }}>{title}</div>
          <div className="ai-card__body">{body}</div>
          {impact && (
            <div style={{ marginTop: 10 }}>
              <span className="ai-reco__impact">{impact}</span>
            </div>
          )}
        </div>
      </div>
      <div className="ai-card__foot">
        <Button variant="primary" size="md" onClick={onAccept}>{acceptLabel}</Button>
        <Button variant="ghost" size="md" onClick={onDismiss}>Not now</Button>
      </div>
    </div>
  );
}
