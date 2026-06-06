import React from "react";
import { AIAvatar } from "./AIAvatar.jsx";
import { ConfidenceMeter } from "./ConfidenceMeter.jsx";
import { Icon } from "../core/Icon.jsx";

const ACCENT = {
  insight: "var(--cat-insight)",
  save: "var(--cat-save)",
  growth: "var(--cat-growth)",
  risk: "var(--cat-risk)",
};

/**
 * AIInsightCard — a generated insight (spending, usage, revenue, trend)
 * with a headline metric, optional delta, mini sparkline and an
 * AI provenance footer (confidence + "Why").
 */
export function AIInsightCard({
  eyebrow = "AI Insight",
  title,
  value,
  delta,                 // { dir: "up"|"down", text: "12% vs last month" }
  trend,                 // array of numbers → sparkline
  category = "insight",
  confidence = "high",
  onWhy,
  footnote,
  className = "",
  style = {},
}) {
  const accent = ACCENT[category] || ACCENT.insight;
  const peak = trend ? Math.max(...trend) : 0;
  const max = peak || 1;
  return (
    <div className={["ai-card", "ai-card--rail", className].filter(Boolean).join(" ")} style={{ "--_accent": accent, ...style }}>
      <div className="ai-card__head">
        <AIAvatar size={30} soft />
        <span className="ai-card__eyebrow">{eyebrow}</span>
        {delta && (
          <span className={`ai-card__spacer ai-insight__delta ai-insight__delta--${delta.dir}`}>
            <Icon name={delta.dir === "up" ? "trending-up" : "trending-down"} size={14} strokeWidth={2.4} />
            {delta.text}
          </span>
        )}
      </div>
      <div className="ai-card__title">{title}</div>
      {value != null && (
        <div className="ai-insight__metric">
          <span className="ai-insight__value tnum">{value}</span>
        </div>
      )}
      {trend && (
        <div className="ai-insight__spark">
          {trend.map((v, i) => (
            <i key={i} className={v === peak ? "is-peak" : ""} style={{ height: `${Math.max(12, (v / max) * 100)}%` }} />
          ))}
        </div>
      )}
      {footnote && <div className="ai-card__body" style={{ marginTop: 10 }}>{footnote}</div>}
      <div className="ai-card__foot">
        <ConfidenceMeter level={confidence} variant="bars" />
        <span className="ai-card__spacer pt-section__action" onClick={onWhy} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          Why this? <Icon name="chevron-right" size={14} />
        </span>
      </div>
    </div>
  );
}
