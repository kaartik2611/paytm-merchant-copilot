import React from "react";

const LEVELS = {
  high: { label: "High confidence", color: "var(--confidence-high)", pct: 90 },
  medium: { label: "Medium confidence", color: "var(--confidence-med)", pct: 62 },
  low: { label: "Low confidence", color: "var(--confidence-low)", pct: 32 },
};

/**
 * ConfidenceMeter — communicates how sure the model is. Two styles:
 * a thin progress track (default) or a 5-bar signal. Accepts a level
 * preset ("high"|"medium"|"low") or an explicit `value` 0–100.
 */
export function ConfidenceMeter({ level = "high", value, variant = "track", showLabel = true, label, className = "", style = {} }) {
  const preset = LEVELS[level] || LEVELS.high;
  const pct = value != null ? value : preset.pct;
  const color = preset.color;
  const text = label != null ? label : (value != null ? `${value}% confidence` : preset.label);

  if (variant === "bars") {
    const on = Math.round((pct / 100) * 5);
    return (
      <span className={["ai-conf", "ai-conf--bars", className].filter(Boolean).join(" ")} style={style}>
        <span className="ai-conf__bars" style={{ "--_c": color }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <b key={i} className={i < on ? "on" : ""} style={{ height: 8 + i * 3 }} />
          ))}
        </span>
        {showLabel && <span className="ai-conf__label">{text}</span>}
      </span>
    );
  }
  return (
    <span className={["ai-conf", className].filter(Boolean).join(" ")} style={style}>
      <span className="ai-conf__track"><span className="ai-conf__fill" style={{ width: `${pct}%`, background: color }} /></span>
      {showLabel && <span className="ai-conf__label">{text}</span>}
    </span>
  );
}
