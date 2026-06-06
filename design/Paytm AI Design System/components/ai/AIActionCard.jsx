import React from "react";
import { Icon } from "../core/Icon.jsx";

/**
 * AIActionCard — a set of clear decisions the user can take in response
 * to AI output (block / proceed / contact support / accept). Renders a
 * vertical list of tappable actions; one can be marked primary, one
 * destructive.
 */
export function AIActionCard({ title, actions = [], row = false, className = "", style = {} }) {
  return (
    <div className={className} style={style}>
      {title && <div className="ai-card__eyebrow" style={{ marginBottom: 10 }}>{title}</div>}
      <div className={["ai-actions", row ? "ai-actions--row" : ""].filter(Boolean).join(" ")}>
        {actions.map((a, i) => {
          const cls = [
            "ai-action",
            a.tone === "primary" ? "ai-action--primary" : "",
            a.tone === "danger" ? "ai-action--danger" : "",
          ].filter(Boolean).join(" ");
          const iconTint = a.tone === "primary"
            ? { background: "rgba(255,255,255,.18)", color: "#fff" }
            : a.tone === "danger"
            ? { background: "var(--danger-tint)", color: "var(--danger)" }
            : { background: "var(--paytm-blue-100)", color: "var(--paytm-navy-800)" };
          return (
            <button key={i} className={cls} onClick={a.onClick} style={{ flex: row ? 1 : undefined }}>
              {a.icon && <span className="ai-action__icon" style={iconTint}><Icon name={a.icon} size={17} /></span>}
              <span className="ai-action__text">
                <span className="ai-action__title">{a.title}</span>
                {a.sub && <span className="ai-action__sub">{a.sub}</span>}
              </span>
              {!row && a.tone !== "primary" && <Icon name="chevron-right" size={16} style={{ color: "var(--ink-300)" }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
