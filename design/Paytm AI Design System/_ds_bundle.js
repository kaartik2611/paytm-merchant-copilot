/* @ds-bundle: {"format":3,"namespace":"PaytmAIDesignSystem_ea0928","components":[{"name":"AIActionCard","sourcePath":"components/ai/AIActionCard.jsx"},{"name":"AIAvatar","sourcePath":"components/ai/AIAvatar.jsx"},{"name":"AIExplainabilityPanel","sourcePath":"components/ai/AIExplainabilityPanel.jsx"},{"name":"AIInsightCard","sourcePath":"components/ai/AIInsightCard.jsx"},{"name":"AIRecommendationCard","sourcePath":"components/ai/AIRecommendationCard.jsx"},{"name":"AIRiskAlert","sourcePath":"components/ai/AIRiskAlert.jsx"},{"name":"ConfidenceMeter","sourcePath":"components/ai/ConfidenceMeter.jsx"},{"name":"CopilotChat","sourcePath":"components/copilot/CopilotChat.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconCircle","sourcePath":"components/core/IconCircle.jsx"},{"name":"SectionHeader","sourcePath":"components/core/SectionHeader.jsx"},{"name":"VoiceAssistant","sourcePath":"components/voice/VoiceAssistant.jsx"}],"sourceHashes":{"components/ai/AIActionCard.jsx":"c9184c20c4f0","components/ai/AIAvatar.jsx":"9fee7795bf06","components/ai/AIExplainabilityPanel.jsx":"f2c616c75008","components/ai/AIInsightCard.jsx":"6703b878a425","components/ai/AIRecommendationCard.jsx":"1834f610341b","components/ai/AIRiskAlert.jsx":"38e8afdf3c4d","components/ai/ConfidenceMeter.jsx":"8c49f59e75d0","components/copilot/CopilotChat.jsx":"250ae1fc06d4","components/core/Avatar.jsx":"b44da7c2c476","components/core/Badge.jsx":"c9e66f099323","components/core/Button.jsx":"e7508414b99c","components/core/Chip.jsx":"09aae24976b0","components/core/Icon.jsx":"0483f4e198eb","components/core/IconCircle.jsx":"0327d1626dca","components/core/SectionHeader.jsx":"121152969e13","components/voice/VoiceAssistant.jsx":"ae4887109109","ui_kits/consumer/ConsumerHome.jsx":"ac9951a262ed","ui_kits/consumer/PayConfirm.jsx":"b461ead659a3","ui_kits/consumer/app.jsx":"537269269da9","ui_kits/merchant/MerchantDashboard.jsx":"5867f2c8f35e","ui_kits/merchant/app.jsx":"1918a3c89b94"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PaytmAIDesignSystem_ea0928 = window.PaytmAIDesignSystem_ea0928 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/ai/ConfidenceMeter.jsx
try { (() => {
const LEVELS = {
  high: {
    label: "High confidence",
    color: "var(--confidence-high)",
    pct: 90
  },
  medium: {
    label: "Medium confidence",
    color: "var(--confidence-med)",
    pct: 62
  },
  low: {
    label: "Low confidence",
    color: "var(--confidence-low)",
    pct: 32
  }
};

/**
 * ConfidenceMeter — communicates how sure the model is. Two styles:
 * a thin progress track (default) or a 5-bar signal. Accepts a level
 * preset ("high"|"medium"|"low") or an explicit `value` 0–100.
 */
function ConfidenceMeter({
  level = "high",
  value,
  variant = "track",
  showLabel = true,
  label,
  className = "",
  style = {}
}) {
  const preset = LEVELS[level] || LEVELS.high;
  const pct = value != null ? value : preset.pct;
  const color = preset.color;
  const text = label != null ? label : value != null ? `${value}% confidence` : preset.label;
  if (variant === "bars") {
    const on = Math.round(pct / 100 * 5);
    return /*#__PURE__*/React.createElement("span", {
      className: ["ai-conf", "ai-conf--bars", className].filter(Boolean).join(" "),
      style: style
    }, /*#__PURE__*/React.createElement("span", {
      className: "ai-conf__bars",
      style: {
        "--_c": color
      }
    }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("b", {
      key: i,
      className: i < on ? "on" : "",
      style: {
        height: 8 + i * 3
      }
    }))), showLabel && /*#__PURE__*/React.createElement("span", {
      className: "ai-conf__label"
    }, text));
  }
  return /*#__PURE__*/React.createElement("span", {
    className: ["ai-conf", className].filter(Boolean).join(" "),
    style: style
  }, /*#__PURE__*/React.createElement("span", {
    className: "ai-conf__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ai-conf__fill",
    style: {
      width: `${pct}%`,
      background: color
    }
  })), showLabel && /*#__PURE__*/React.createElement("span", {
    className: "ai-conf__label"
  }, text));
}
Object.assign(__ds_scope, { ConfidenceMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/ConfidenceMeter.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
/**
 * Avatar — circular user/merchant avatar. Renders an image when `src`
 * is given, otherwise initials on a colored background.
 */
function Avatar({
  src,
  initials,
  size = 36,
  bg = "#F26464",
  color = "#fff",
  className = "",
  style = {}
}) {
  const s = {
    width: size,
    height: size,
    background: src ? "transparent" : bg,
    color,
    fontSize: Math.round(size * 0.38),
    ...style
  };
  return /*#__PURE__*/React.createElement("span", {
    className: ["pt-avatar", className].filter(Boolean).join(" "),
    style: s
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: initials || "avatar"
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon — curated line-icon set in the Lucide style (24×24, 2px stroke,
 * round caps) to match Paytm's thin-stroke navy glyphs. Inherits color
 * via `currentColor` and sizes via the `size` prop.
 */
const PATHS = {
  // AI / brand
  sparkles: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M9.94 4.5 12 9l4.5 2.06L12 13.1 9.94 17.6 7.88 13.1 3.38 11.06 7.88 9 9.94 4.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 5v3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.5 6.5h3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 16v2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M17 17h2"
  })),
  sparkle: /*#__PURE__*/React.createElement("path", {
    d: "M12 3 14.09 9.26 20.5 11.5 14.09 13.74 12 20 9.91 13.74 3.5 11.5 9.91 9.26 12 3Z"
  }),
  // arrows / chevrons
  "arrow-right": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m12 5 7 7-7 7"
  })),
  "arrow-left": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M19 12H5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m12 19-7-7 7-7"
  })),
  "chevron-right": /*#__PURE__*/React.createElement("path", {
    d: "m9 18 6-6-6-6"
  }),
  "chevron-down": /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }),
  "arrow-up-right": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M7 17 17 7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 7h10v10"
  })),
  // chat / voice
  send: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "m22 2-7 20-4-9-9-4Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 2 11 13"
  })),
  mic: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "2",
    width: "6",
    height: "12",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 10v1a7 7 0 0 0 14 0v-1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 18v4"
  })),
  "message-circle": /*#__PURE__*/React.createElement("path", {
    d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z"
  }),
  // status
  check: /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }),
  "check-circle": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 12 2 2 4-4"
  })),
  x: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m6 6 12 12"
  })),
  info: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16v-4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8h.01"
  })),
  "alert-triangle": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 9v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 17h.01"
  })),
  "shield-check": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m9 12 2 2 4-4"
  })),
  "shield-alert": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16h.01"
  })),
  // finance / data
  "trending-up": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M16 7h6v6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m22 7-8.5 8.5-5-5L2 17"
  })),
  "trending-down": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M16 17h6v-6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m22 17-8.5-8.5-5 5L2 7"
  })),
  "bar-chart": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 3v18h18"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "7",
    y: "11",
    width: "3",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "12",
    y: "7",
    width: "3",
    height: "10",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "17",
    y: "13",
    width: "3",
    height: "4",
    rx: "1"
  })),
  wallet: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 12h.01"
  })),
  "indian-rupee": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M6 3h12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 8h12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m6 13 8.5 8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 13h3a5 5 0 0 0 0-10"
  })),
  "piggy-bank": /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M19 11a8 8 0 0 0-7-4H9a6 6 0 0 0-6 6 5 5 0 0 0 2 4v3h3v-2h4v2h3v-3a6 6 0 0 0 2-4Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 11h.01"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 9v2"
  })),
  scan: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 7V5a2 2 0 0 1 2-2h2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M17 3h2a2 2 0 0 1 2 2v2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 17v2a2 2 0 0 1-2 2h-2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 21H5a2 2 0 0 1-2-2v-2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 12h18"
  })),
  store: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M3 9 4.5 4h15L21 9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 9h18"
  })),
  lightbulb: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M9 18h6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 22h4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 14a5 5 0 1 1 8 0c-.7.9-1 1.5-1 3H9c0-1.5-.3-2.1-1-3Z"
  })),
  search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m21 21-4.3-4.3"
  })),
  clock: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v5l3 2"
  })),
  package: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "m7.5 4.3 9 5.2v9L7.5 13.4Z",
    opacity: "0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2 3 7v10l9 5 9-5V7Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m3 7 9 5 9-5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 22V12"
  })),
  user: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 21a8 8 0 0 1 16 0"
  })),
  headset: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 14v-2a8 8 0 0 1 16 0v2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18 19a2 2 0 0 1-2 2h-2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "13",
    width: "4",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "18",
    y: "13",
    width: "4",
    height: "6",
    rx: "1"
  })),
  plus: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }))
};
function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  className,
  style,
  ...rest
}) {
  const path = PATHS[name];
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: style,
    "aria-hidden": "true"
  }, rest), path || null);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/ai/AIActionCard.jsx
try { (() => {
/**
 * AIActionCard — a set of clear decisions the user can take in response
 * to AI output (block / proceed / contact support / accept). Renders a
 * vertical list of tappable actions; one can be marked primary, one
 * destructive.
 */
function AIActionCard({
  title,
  actions = [],
  row = false,
  className = "",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: className,
    style: style
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "ai-card__eyebrow",
    style: {
      marginBottom: 10
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    className: ["ai-actions", row ? "ai-actions--row" : ""].filter(Boolean).join(" ")
  }, actions.map((a, i) => {
    const cls = ["ai-action", a.tone === "primary" ? "ai-action--primary" : "", a.tone === "danger" ? "ai-action--danger" : ""].filter(Boolean).join(" ");
    const iconTint = a.tone === "primary" ? {
      background: "rgba(255,255,255,.18)",
      color: "#fff"
    } : a.tone === "danger" ? {
      background: "var(--danger-tint)",
      color: "var(--danger)"
    } : {
      background: "var(--paytm-blue-100)",
      color: "var(--paytm-navy-800)"
    };
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      className: cls,
      onClick: a.onClick,
      style: {
        flex: row ? 1 : undefined
      }
    }, a.icon && /*#__PURE__*/React.createElement("span", {
      className: "ai-action__icon",
      style: iconTint
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: a.icon,
      size: 17
    })), /*#__PURE__*/React.createElement("span", {
      className: "ai-action__text"
    }, /*#__PURE__*/React.createElement("span", {
      className: "ai-action__title"
    }, a.title), a.sub && /*#__PURE__*/React.createElement("span", {
      className: "ai-action__sub"
    }, a.sub)), !row && a.tone !== "primary" && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevron-right",
      size: 16,
      style: {
        color: "var(--ink-300)"
      }
    }));
  })));
}
Object.assign(__ds_scope, { AIActionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AIActionCard.jsx", error: String((e && e.message) || e) }); }

// components/ai/AIAvatar.jsx
try { (() => {
/**
 * AIAvatar — the Paytm AI mark: a sparkle on the sanctioned cyan→blue
 * →navy sheen. The single place the AI gradient is allowed. Use `soft`
 * for a low-emphasis tinted version on light surfaces.
 */
function AIAvatar({
  size = 36,
  soft = false,
  square = false,
  className = "",
  style = {}
}) {
  const cls = ["ai-mark", soft ? "ai-mark--soft" : "", square ? "ai-mark--square" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", {
    className: cls,
    style: {
      width: size,
      height: size,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "sparkles",
    size: Math.round(size * 0.56),
    strokeWidth: 2
  }));
}
Object.assign(__ds_scope, { AIAvatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AIAvatar.jsx", error: String((e && e.message) || e) }); }

// components/ai/AIExplainabilityPanel.jsx
try { (() => {
/**
 * AIExplainabilityPanel — the "why" behind a recommendation or alert.
 * Shows a plain-language reason, the weighted supporting factors, and
 * an overall confidence read-out. Builds trust through transparency.
 */
function AIExplainabilityPanel({
  title = "Why you're seeing this",
  reason,
  factors = [],
  // [{ name, weight: 0–100 }]
  confidenceLabel = "Based on 6 months of your activity",
  className = "",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["ai-explain", className].filter(Boolean).join(" "),
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-explain__head"
  }, /*#__PURE__*/React.createElement(__ds_scope.AIAvatar, {
    size: 26,
    soft: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "ai-explain__title"
  }, title)), reason && /*#__PURE__*/React.createElement("p", {
    className: "ai-explain__why"
  }, reason), /*#__PURE__*/React.createElement("div", {
    className: "ai-explain__factors"
  }, factors.map((f, i) => /*#__PURE__*/React.createElement("div", {
    className: "ai-factor",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "ai-factor__name"
  }, f.name), /*#__PURE__*/React.createElement("span", {
    className: "ai-factor__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ai-factor__fill",
    style: {
      width: `${f.weight}%`
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "ai-factor__pct tnum"
  }, f.weight, "%")))), confidenceLabel && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      marginTop: 14,
      color: "var(--ink-500)",
      fontSize: "var(--fs-xs)",
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "shield-check",
    size: 14
  }), confidenceLabel));
}
Object.assign(__ds_scope, { AIExplainabilityPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AIExplainabilityPanel.jsx", error: String((e && e.message) || e) }); }

// components/ai/AIInsightCard.jsx
try { (() => {
const ACCENT = {
  insight: "var(--cat-insight)",
  save: "var(--cat-save)",
  growth: "var(--cat-growth)",
  risk: "var(--cat-risk)"
};

/**
 * AIInsightCard — a generated insight (spending, usage, revenue, trend)
 * with a headline metric, optional delta, mini sparkline and an
 * AI provenance footer (confidence + "Why").
 */
function AIInsightCard({
  eyebrow = "AI Insight",
  title,
  value,
  delta,
  // { dir: "up"|"down", text: "12% vs last month" }
  trend,
  // array of numbers → sparkline
  category = "insight",
  confidence = "high",
  onWhy,
  footnote,
  className = "",
  style = {}
}) {
  const accent = ACCENT[category] || ACCENT.insight;
  const peak = trend ? Math.max(...trend) : 0;
  const max = peak || 1;
  return /*#__PURE__*/React.createElement("div", {
    className: ["ai-card", "ai-card--rail", className].filter(Boolean).join(" "),
    style: {
      "--_accent": accent,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-card__head"
  }, /*#__PURE__*/React.createElement(__ds_scope.AIAvatar, {
    size: 30,
    soft: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "ai-card__eyebrow"
  }, eyebrow), delta && /*#__PURE__*/React.createElement("span", {
    className: `ai-card__spacer ai-insight__delta ai-insight__delta--${delta.dir}`
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: delta.dir === "up" ? "trending-up" : "trending-down",
    size: 14,
    strokeWidth: 2.4
  }), delta.text)), /*#__PURE__*/React.createElement("div", {
    className: "ai-card__title"
  }, title), value != null && /*#__PURE__*/React.createElement("div", {
    className: "ai-insight__metric"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ai-insight__value tnum"
  }, value)), trend && /*#__PURE__*/React.createElement("div", {
    className: "ai-insight__spark"
  }, trend.map((v, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    className: v === peak ? "is-peak" : "",
    style: {
      height: `${Math.max(12, v / max * 100)}%`
    }
  }))), footnote && /*#__PURE__*/React.createElement("div", {
    className: "ai-card__body",
    style: {
      marginTop: 10
    }
  }, footnote), /*#__PURE__*/React.createElement("div", {
    className: "ai-card__foot"
  }, /*#__PURE__*/React.createElement(__ds_scope.ConfidenceMeter, {
    level: confidence,
    variant: "bars"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ai-card__spacer pt-section__action",
    onClick: onWhy,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4
    }
  }, "Why this? ", /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 14
  }))));
}
Object.assign(__ds_scope, { AIInsightCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AIInsightCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — small status pill. tone: neutral | info | success | warning
 * | danger | brand | ai. Optional leading dot or icon.
 */
function Badge({
  children,
  tone = "neutral",
  dot = false,
  icon,
  className = "",
  ...rest
}) {
  const cls = ["pt-badge", `pt-badge--${tone}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "pt-badge__dot"
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12,
    strokeWidth: 2.4
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — Paytm pill button. Primary (blue), secondary (outline),
 * ghost, navy, danger, success, neutral. Sizes sm/md/lg.
 */
function Button({
  children,
  variant = "primary",
  size = "lg",
  block = false,
  icon,
  iconRight,
  disabled = false,
  className = "",
  ...rest
}) {
  const cls = ["pt-btn", `pt-btn--${variant}`, `pt-btn--${size}`, block ? "pt-btn--block" : "", className].filter(Boolean).join(" ");
  const isz = size === "sm" ? 16 : 18;
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    disabled: disabled
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: isz
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: isz
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/ai/AIRiskAlert.jsx
try { (() => {
const SEV = {
  critical: {
    icon: "shield-alert",
    label: "Critical"
  },
  high: {
    icon: "shield-alert",
    label: "High risk"
  },
  medium: {
    icon: "alert-triangle",
    label: "Medium"
  },
  low: {
    icon: "info",
    label: "Heads up"
  }
};

/**
 * AIRiskAlert — fraud / scam / unusual-activity / revenue-risk warning.
 * Carries a severity level, confidence score and clear next actions.
 * Tinted by severity; never alarmist red unless severity is high+.
 */
function AIRiskAlert({
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
  style = {}
}) {
  const s = SEV[severity] || SEV.high;
  const isDanger = severity === "critical" || severity === "high";
  return /*#__PURE__*/React.createElement("div", {
    className: ["ai-risk", `ai-risk--${severity}`, className].filter(Boolean).join(" "),
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-risk__head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ai-risk__icon"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: s.icon,
    size: 19,
    strokeWidth: 2.2
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ai-risk__sev"
  }, s.label), /*#__PURE__*/React.createElement("div", {
    className: "ai-risk__title"
  }, title))), /*#__PURE__*/React.createElement("p", {
    className: "ai-risk__body"
  }, body), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ConfidenceMeter, {
    level: confidence,
    variant: "track"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ai-risk__actions"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: primaryVariant || (isDanger ? "danger" : "primary"),
    size: "md",
    onClick: onPrimary
  }, primaryLabel), secondaryLabel && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary",
    size: "md",
    onClick: onSecondary
  }, secondaryLabel)));
}
Object.assign(__ds_scope, { AIRiskAlert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AIRiskAlert.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Chip — tappable pill for suggested prompts / quick actions / filters.
 * variant: default | ai.
 */
function Chip({
  children,
  variant = "default",
  icon,
  onClick,
  className = "",
  ...rest
}) {
  const cls = ["pt-chip", variant === "ai" ? "pt-chip--ai" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    onClick: onClick
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 15
  }), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/copilot/CopilotChat.jsx
try { (() => {
function Typing() {
  return /*#__PURE__*/React.createElement("span", {
    className: "ai-typing"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null));
}

/**
 * CopilotChat — the Paytm AI Copilot conversation surface. Works as a
 * full-height mobile sheet or a web side-panel (`surface`). Renders
 * conversation history, a typing indicator, suggested prompts and the
 * composer. Replies are simulated via `getReply` (swap for a real call).
 */
function CopilotChat({
  title = "Paytm AI",
  subtitle = "Your money assistant",
  surface = "mobile",
  // "mobile" | "web"
  initialMessages,
  suggestedPrompts = ["Where did my money go this month?", "Pay my electricity bill", "Did I get my refund?"],
  quickActions = [{
    icon: "scan",
    label: "Scan"
  }, {
    icon: "indian-rupee",
    label: "Pay"
  }, {
    icon: "wallet",
    label: "Balance"
  }],
  getReply,
  onClose,
  className = "",
  style = {}
}) {
  const [messages, setMessages] = React.useState(initialMessages || [{
    from: "assistant",
    text: "Hi Sahil 👋 I can help you pay, track spending or spot anything unusual. What's on your mind?"
  }]);
  const [draft, setDraft] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const streamRef = React.useRef(null);
  React.useEffect(() => {
    const el = streamRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);
  const fallbackReply = q => "Here's what I found. You spent ₹8,420 on food this month — about 18% more than last month. Want me to set a budget?";
  function send(text) {
    const t = (text != null ? text : draft).trim();
    if (!t) return;
    setMessages(m => [...m, {
      from: "user",
      text: t
    }]);
    setDraft("");
    setThinking(true);
    const reply = getReply ? getReply(t) : fallbackReply(t);
    setTimeout(() => {
      setThinking(false);
      setMessages(m => [...m, {
        from: "assistant",
        text: reply
      }]);
    }, 900);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: ["ai-chat", className].filter(Boolean).join(" "),
    style: {
      borderRadius: surface === "web" ? "var(--r-lg)" : 0,
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "14px 16px",
      background: "#fff",
      boxShadow: "0 1px 0 var(--line-200)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.AIAvatar, {
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-md)",
      fontWeight: 700,
      color: "var(--ink-900)",
      lineHeight: 1.2
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--fs-xs)",
      color: "var(--success)",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "var(--success)"
    }
  }), " ", subtitle)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      border: 0,
      background: "var(--line-100)",
      width: 32,
      height: 32,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
      color: "var(--ink-600)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ai-chat__stream",
    ref: streamRef
  }, messages.map((m, i) => m.from === "assistant" ? /*#__PURE__*/React.createElement("div", {
    className: "ai-bubble__row",
    key: i
  }, /*#__PURE__*/React.createElement(__ds_scope.AIAvatar, {
    size: 26,
    soft: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "ai-bubble ai-bubble--assistant"
  }, m.text)) : /*#__PURE__*/React.createElement("div", {
    className: "ai-bubble ai-bubble--user",
    key: i
  }, m.text)), thinking && /*#__PURE__*/React.createElement("div", {
    className: "ai-bubble__row"
  }, /*#__PURE__*/React.createElement(__ds_scope.AIAvatar, {
    size: 26,
    soft: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "ai-bubble ai-bubble--assistant"
  }, /*#__PURE__*/React.createElement(Typing, null)))), messages.length <= 1 && /*#__PURE__*/React.createElement("div", {
    className: "ai-chat__prompts"
  }, suggestedPrompts.map((p, i) => /*#__PURE__*/React.createElement(__ds_scope.Chip, {
    key: i,
    variant: "ai",
    icon: i === 0 ? "sparkle" : undefined,
    onClick: () => send(p)
  }, p))), /*#__PURE__*/React.createElement("div", {
    className: "ai-chat__composer"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "Voice",
    style: {
      border: 0,
      background: "transparent",
      color: "var(--paytm-blue)",
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
      width: 28
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "mic",
    size: 22
  })), /*#__PURE__*/React.createElement("input", {
    className: "ai-chat__input",
    placeholder: "Ask Paytm AI anything\u2026",
    value: draft,
    onChange: e => setDraft(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") send();
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "ai-chat__send",
    disabled: !draft.trim(),
    onClick: () => send(),
    "aria-label": "Send"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up-right",
    size: 20
  }))));
}
Object.assign(__ds_scope, { CopilotChat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/copilot/CopilotChat.jsx", error: String((e && e.message) || e) }); }

// components/core/IconCircle.jsx
try { (() => {
/**
 * IconCircle — round tinted container for a line icon. Used across
 * service tiles, list rows and AI cards. Pass a `bg`/`color` to tint.
 */
function IconCircle({
  icon,
  size = 40,
  bg,
  color,
  iconSize,
  className = "",
  style = {},
  children
}) {
  const s = {
    width: size,
    height: size,
    background: bg,
    color,
    ...style
  };
  return /*#__PURE__*/React.createElement("span", {
    className: ["pt-iconcircle", className].filter(Boolean).join(" "),
    style: s
  }, icon ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: iconSize || Math.round(size * 0.5)
  }) : children);
}
Object.assign(__ds_scope, { IconCircle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconCircle.jsx", error: String((e && e.message) || e) }); }

// components/ai/AIRecommendationCard.jsx
try { (() => {
/**
 * AIRecommendationCard — a suggested action the user can take (save
 * money, improve cash flow, increase sales, optimize inventory). Leads
 * with an icon, a benefit-led title, the projected impact, and a
 * primary accept + secondary dismiss.
 */
function AIRecommendationCard({
  icon = "piggy-bank",
  iconBg = "var(--success-tint)",
  iconColor = "var(--success)",
  title,
  body,
  impact,
  // e.g. "Save ~₹450 / month"
  confidence = "high",
  acceptLabel = "Do it",
  onAccept,
  onDismiss,
  className = "",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["ai-card", className].filter(Boolean).join(" "),
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-card__head",
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.AIAvatar, {
    size: 26,
    soft: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "ai-card__eyebrow"
  }, "AI Recommendation"), /*#__PURE__*/React.createElement(__ds_scope.ConfidenceMeter, {
    level: confidence,
    variant: "bars",
    showLabel: false,
    className: "ai-card__spacer"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ai-reco"
  }, /*#__PURE__*/React.createElement(__ds_scope.IconCircle, {
    className: "ai-reco__icon",
    icon: icon,
    size: 44,
    bg: iconBg,
    color: iconColor
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ai-card__title",
    style: {
      marginBottom: 5
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "ai-card__body"
  }, body), impact && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ai-reco__impact"
  }, impact)))), /*#__PURE__*/React.createElement("div", {
    className: "ai-card__foot"
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "md",
    onClick: onAccept
  }, acceptLabel), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "md",
    onClick: onDismiss
  }, "Not now")));
}
Object.assign(__ds_scope, { AIRecommendationCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/ai/AIRecommendationCard.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SectionHeader — bold section title with an optional right-aligned
 * action link (e.g. "View All").
 */
function SectionHeader({
  title,
  action,
  onAction,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["pt-section", className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "pt-section__title"
  }, title), action && /*#__PURE__*/React.createElement("span", {
    className: "pt-section__action",
    onClick: onAction
  }, action));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/voice/VoiceAssistant.jsx
try { (() => {
const COPY = {
  idle: {
    status: "Tap to speak",
    hint: "Try \"Send ₹500 to Mom\" or \"What's my balance?\""
  },
  listening: {
    status: "Listening…",
    hint: "Speak now — tap again to stop"
  },
  processing: {
    status: "Working on it…",
    hint: "Understanding your request"
  },
  responding: {
    status: "Here you go",
    hint: ""
  }
};
function Wave({
  active
}) {
  const bars = [10, 18, 26, 16, 22, 12, 20, 14];
  return /*#__PURE__*/React.createElement("div", {
    className: "ai-voice__wave",
    "aria-hidden": "true"
  }, bars.map((h, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      height: active ? h : 4,
      transition: "height .3s var(--ease-standard)",
      opacity: active ? 1 : .4
    }
  })));
}

/**
 * VoiceAssistant — voice-first surface for both consumer (send money,
 * balance, transaction search) and merchant (sales / inventory / business
 * questions). Drives four states: idle, listening, processing, responding.
 * Uncontrolled by default — tap the orb to walk the demo cycle; pass
 * `state` + `onStateChange` to control it.
 */
function VoiceAssistant({
  state: controlled,
  onStateChange,
  transcript,
  response,
  audience = "consumer",
  className = "",
  style = {}
}) {
  const [internal, setInternal] = React.useState("idle");
  const state = controlled || internal;
  const copy = COPY[state] || COPY.idle;
  const demoTranscript = transcript || (audience === "merchant" ? "How were my sales yesterday?" : "Send ₹500 to Mom");
  const demoResponse = response || (audience === "merchant" ? "You made ₹24,380 across 96 orders yesterday — 12% up on Tuesday." : "Ready to send ₹500 to Mom from your KVB account. Confirm?");
  function setState(s) {
    if (onStateChange) onStateChange(s);
    if (!controlled) setInternal(s);
  }
  function cycle() {
    const next = {
      idle: "listening",
      listening: "processing",
      processing: "responding",
      responding: "idle"
    }[state];
    setState(next);
    if (state === "listening") setTimeout(() => setState("responding"), 1100);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: ["ai-voice", className].filter(Boolean).join(" "),
    style: style
  }, /*#__PURE__*/React.createElement("button", {
    onClick: cycle,
    "aria-label": copy.status,
    className: ["ai-orb", state === "listening" ? "ai-orb--listening" : "", state === "processing" ? "ai-orb--processing" : ""].filter(Boolean).join(" "),
    style: {
      border: 0,
      background: "transparent",
      cursor: "pointer",
      padding: 0
    }
  }, state === "listening" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "ai-orb__ring"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ai-orb__ring r2"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ai-orb__core"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: state === "responding" ? "check" : "mic",
    size: 40,
    strokeWidth: 2
  }))), (state === "listening" || state === "processing") && /*#__PURE__*/React.createElement(Wave, {
    active: state === "listening"
  }), (state === "listening" || state === "responding") && /*#__PURE__*/React.createElement("div", {
    className: "ai-voice__transcript"
  }, state === "responding" ? demoResponse : demoTranscript), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ai-voice__status"
  }, copy.status), copy.hint && /*#__PURE__*/React.createElement("div", {
    className: "ai-voice__hint",
    style: {
      marginTop: 6
    }
  }, copy.hint)));
}
Object.assign(__ds_scope, { VoiceAssistant });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/voice/VoiceAssistant.jsx", error: String((e && e.message) || e) }); }

// ui_kits/consumer/ConsumerHome.jsx
try { (() => {
// ConsumerHome — Paytm consumer app home with the AI layer woven in.
// Recreates the real Paytm home language (gradient header, UPI money-
// transfer card, service tiles, hairline cards) and adds an "AI for you"
// section + a Copilot FAB. Uses the brand asset PNGs copied from the
// source Figma file. Component primitives are in global scope.

function HomeHeader({
  onSearch
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(180deg, var(--paytm-header-from), var(--paytm-header-to))",
      padding: "12px 14px",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: "SR",
    bg: "#F26464",
    size: 34
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/paytm-logo.png",
    alt: "Paytm",
    style: {
      height: 22,
      filter: "brightness(0) invert(1)",
      margin: "0 auto"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onSearch,
    "aria-label": "Search",
    style: {
      border: 0,
      background: "rgba(255,255,255,.25)",
      width: 30,
      height: 30,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      color: "#fff",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 17
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      background: "rgba(255,255,255,.25)",
      width: 30,
      height: 30,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "message-circle",
    size: 17
  })));
}
function MoneyTransfer() {
  const items = [{
    icon: "scan",
    label: "Scan & Pay"
  }, {
    icon: "indian-rupee",
    label: "To Mobile"
  }, {
    icon: "user",
    label: "To Self"
  }, {
    icon: "wallet",
    label: "To Bank"
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "pt-cardshell",
    style: {
      padding: 14,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "UPI Money Transfer",
    action: "History"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 8,
      marginTop: 14
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.label,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(IconCircle, {
    icon: it.icon,
    size: 46,
    bg: "var(--paytm-blue-050)",
    color: "var(--paytm-navy-800)",
    style: {
      boxShadow: "inset 0 0 0 1px var(--paytm-blue-100)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 500,
      color: "var(--ink-800)",
      marginTop: 6
    }
  }, it.label)))));
}
function ConsumerHome({
  onOpenCopilot,
  onPay
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-page)"
    }
  }, /*#__PURE__*/React.createElement(HomeHeader, {
    onSearch: onOpenCopilot
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 14,
      paddingBottom: 80
    }
  }, /*#__PURE__*/React.createElement(MoneyTransfer, null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: "6px 2px 12px"
    }
  }, /*#__PURE__*/React.createElement(AIAvatar, {
    size: 24,
    soft: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, "AI for you"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontSize: 11,
      fontWeight: 600,
      color: "var(--paytm-blue)"
    }
  }, "See all")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(AIInsightCard, {
    title: "Food spends are up this month",
    value: "\u20B98,420",
    delta: {
      dir: "up",
      text: "18% vs last month"
    },
    trend: [5, 7, 6, 9, 8, 12, 14],
    confidence: "high",
    onWhy: onOpenCopilot
  }), /*#__PURE__*/React.createElement(AIRecommendationCard, {
    icon: "piggy-bank",
    title: "Move \u20B95,000 to a Fixed Deposit",
    body: "Your balance has stayed above \u20B920,000 for 3 months. Earn more without locking everything in.",
    impact: "Earn ~\u20B9375 / year",
    confidence: "medium",
    acceptLabel: "Open FD",
    onAccept: onPay
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onPay,
    className: "pt-btn pt-btn--secondary pt-btn--md pt-btn--block"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "indian-rupee",
    size: 16
  }), " Simulate a risky payment"))), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenCopilot,
    "aria-label": "Open Paytm AI",
    style: {
      position: "absolute",
      right: 16,
      bottom: 74,
      width: 56,
      height: 56,
      borderRadius: "50%",
      border: 0,
      background: "var(--ai-sheen)",
      boxShadow: "var(--elev-fab)",
      color: "#fff",
      display: "grid",
      placeItems: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 58,
      background: "#fff",
      boxShadow: "0 -1px 0 var(--line-200)",
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      alignItems: "center"
    }
  }, [["wallet", "Balance"], ["scan", "Scan"], ["bar-chart", "History"], ["user", "Profile"]].map(([ic, l], i) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      textAlign: "center",
      color: i === 0 ? "var(--paytm-blue)" : "var(--ink-500)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 20
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      marginTop: 2
    }
  }, l)))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/consumer/ConsumerHome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/consumer/PayConfirm.jsx
try { (() => {
// PayConfirm — a payment confirmation that the AI flags as risky. Shows
// the AIRiskAlert, an explainability panel and decision actions. Demonstrates
// the trust layer in a real UPI confirmation context.

function PayConfirm({
  onClose,
  onBlocked
}) {
  const [decision, setDecision] = React.useState(null); // null | "blocked" | "proceeded"

  if (decision) {
    const blocked = decision === "blocked";
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        background: "#fff",
        display: "flex",
        flexDirection: "column"
      }
    }, /*#__PURE__*/React.createElement(FlowHeader, {
      title: "Payment",
      onBack: onClose
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement(IconCircle, {
      icon: blocked ? "shield-check" : "check-circle",
      size: 72,
      bg: blocked ? "var(--success-tint)" : "var(--paytm-blue-050)",
      color: blocked ? "var(--success)" : "var(--paytm-blue)",
      iconSize: 36
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 700,
        color: "var(--ink-900)"
      }
    }, blocked ? "Payment blocked" : "Payment sent"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        color: "var(--ink-600)",
        maxWidth: 260,
        lineHeight: 1.5
      }
    }, blocked ? "We stopped this transfer and reported the payee. Your ₹4,000 is safe." : "₹4,000 sent. We'll keep an eye on this payee for you."), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      onClick: onClose,
      style: {
        marginTop: 8
      }
    }, "Done")));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      background: "var(--bg-page)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(FlowHeader, {
    title: "Confirm payment",
    onBack: onClose
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 16,
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-cardshell",
    style: {
      padding: 16,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    initials: "RK",
    bg: "#E75555",
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: "var(--ink-900)"
    }
  }, "Rohit Kumar"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--ink-500)"
    }
  }, "rohitk@paytm \xB7 new payee")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: "var(--ink-900)"
    },
    className: "tnum"
  }, "\u20B94,000")), /*#__PURE__*/React.createElement(AIRiskAlert, {
    severity: "high",
    title: "This looks like a scam request",
    body: "This payee was reported 14 times this week. Paytm never asks you to pay to receive a refund or prize.",
    confidence: "high",
    primaryLabel: "Block & report",
    secondaryLabel: "Proceed anyway",
    onPrimary: () => setDecision("blocked"),
    onSecondary: () => setDecision("proceeded")
  }), /*#__PURE__*/React.createElement(AIExplainabilityPanel, {
    reason: "We flagged this because the payee is new to you and the request matches a known refund-scam pattern.",
    factors: [{
      name: "Payee reported by others",
      weight: 88
    }, {
      name: "First time paying this number",
      weight: 64
    }, {
      name: "Matches refund-scam wording",
      weight: 71
    }],
    confidenceLabel: "Based on community reports & your history"
  })));
}
function FlowHeader({
  title,
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 16px",
      background: "#fff",
      boxShadow: "0 1px 0 var(--line-200)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    "aria-label": "Back",
    style: {
      border: 0,
      background: "transparent",
      cursor: "pointer",
      color: "var(--ink-800)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, title));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/consumer/PayConfirm.jsx", error: String((e && e.message) || e) }); }

// ui_kits/consumer/app.jsx
try { (() => {
// app — orchestrates the consumer kit: home, a sliding Copilot sheet, and
// the risky-payment flow. Mounted by index.html.

function ConsumerApp() {
  const [copilot, setCopilot] = React.useState(false);
  const [screen, setScreen] = React.useState("home"); // "home" | "pay"

  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      background: "var(--bg-page)"
    }
  }, screen === "home" && /*#__PURE__*/React.createElement(ConsumerHome, {
    onOpenCopilot: () => setCopilot(true),
    onPay: () => setScreen("pay")
  }), screen === "pay" && /*#__PURE__*/React.createElement(PayConfirm, {
    onClose: () => setScreen("home")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(10,14,26,.38)",
      opacity: copilot ? 1 : 0,
      pointerEvents: copilot ? "auto" : "none",
      transition: "opacity var(--dur-normal) var(--ease-standard)",
      zIndex: 20
    },
    onClick: () => setCopilot(false)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "86%",
      transform: copilot ? "translateY(0)" : "translateY(100%)",
      transition: "transform var(--dur-slow) var(--ease-out)",
      zIndex: 21,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      overflow: "hidden",
      boxShadow: "var(--elev-3)"
    }
  }, /*#__PURE__*/React.createElement(CopilotChat, {
    surface: "mobile",
    onClose: () => setCopilot(false)
  })));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/consumer/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/merchant/MerchantDashboard.jsx
try { (() => {
// MerchantDashboard — "Paytm for Business" web dashboard with the AI layer.
// Shows today's collections, AI business insights & recommendations, a voice
// query, and a docked Copilot web panel. Demonstrates the AI system on the
// merchant / business surface. Component primitives are in global scope.

function TopBar({
  onVoice
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "0 22px",
      height: 58,
      background: "#fff",
      boxShadow: "0 1px 0 var(--line-200)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/paytm-logo.png",
    alt: "Paytm",
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "var(--ink-700)",
      borderLeft: "1px solid var(--line-200)",
      paddingLeft: 14
    }
  }, "for Business"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "md",
    icon: "mic",
    onClick: onVoice
  }, "Ask by voice"), /*#__PURE__*/React.createElement(Avatar, {
    initials: "BK",
    bg: "#E75555",
    size: 34
  })));
}
function Stat({
  label,
  value,
  delta,
  dir
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "pt-cardshell",
    style: {
      padding: 16,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: "var(--ink-500)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 700,
      color: "var(--ink-900)",
      marginTop: 6
    },
    className: "tnum"
  }, value), delta && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 12,
      fontWeight: 600,
      color: dir === "up" ? "var(--success)" : "var(--danger)",
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: dir === "up" ? "trending-up" : "trending-down",
    size: 14,
    strokeWidth: 2.4
  }), " ", delta));
}
function MerchantDashboard({
  onOpenCopilot,
  onVoice
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-page)"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    onVoice: onVoice
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, "Good morning, Burger King"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--ink-500)"
    }
  }, "Connaught Place \xB7 Today, 5 Jun")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "md",
    icon: "sparkles",
    onClick: onOpenCopilot,
    style: {
      marginLeft: "auto"
    }
  }, "Ask Paytm AI")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Today's collections",
    value: "\u20B924,380",
    delta: "12% vs Tue",
    dir: "up"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Orders",
    value: "96",
    delta: "9% vs Tue",
    dir: "up"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Avg. order",
    value: "\u20B9254",
    delta: "3% vs Tue",
    dir: "down"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Settlement",
    value: "\u20B91,18,900"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: "4px 2px 12px"
    }
  }, /*#__PURE__*/React.createElement(AIAvatar, {
    size: 24,
    soft: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: "var(--ink-900)"
    }
  }, "AI for your business")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(AIInsightCard, {
    eyebrow: "Business insight",
    title: "Fridays are your peak \u2014 staff up",
    value: "\u20B938,200",
    delta: {
      dir: "up",
      text: "Fri avg vs ₹24k weekday"
    },
    trend: [6, 7, 8, 7, 12, 14, 9],
    category: "growth",
    confidence: "high",
    onWhy: onOpenCopilot
  }), /*#__PURE__*/React.createElement(AIRecommendationCard, {
    icon: "package",
    iconBg: "var(--warning-tint)",
    iconColor: "var(--warning)",
    title: "Reorder buns before the weekend",
    body: "At current pace you'll run out of buns by Saturday lunch \u2014 your busiest slot.",
    impact: "Avoid ~\u20B96,000 in missed orders",
    confidence: "high",
    acceptLabel: "Add to reorder"
  }), /*#__PURE__*/React.createElement(AIRecommendationCard, {
    icon: "trending-up",
    iconBg: "var(--success-tint)",
    iconColor: "var(--success)",
    title: "Run a combo offer at 7\u20139 PM",
    body: "Evening footfall is high but average order dips. A combo could lift it.",
    impact: "Lift avg order ~\u20B940",
    confidence: "medium",
    acceptLabel: "Create offer"
  }), /*#__PURE__*/React.createElement(AIRiskAlert, {
    severity: "medium",
    title: "3 settlements are delayed",
    body: "\u20B918,400 across 3 orders is pending from your bank longer than usual. We're tracking it.",
    confidence: "medium",
    primaryLabel: "View details",
    secondaryLabel: "Remind me later"
  }))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/merchant/MerchantDashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/merchant/app.jsx
try { (() => {
// app — merchant kit orchestration: dashboard with a docked Copilot web
// panel and a voice-query overlay. Mounted by index.html.

function MerchantApp() {
  const [copilot, setCopilot] = React.useState(false);
  const [voice, setVoice] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(MerchantDashboard, {
    onOpenCopilot: () => setCopilot(true),
    onVoice: () => setVoice(true)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: copilot ? 380 : 0,
      transition: "width var(--dur-slow) var(--ease-out)",
      overflow: "hidden",
      flex: "none",
      boxShadow: copilot ? "-8px 0 24px rgba(20,51,102,.10)" : "none",
      background: "#fff"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 380,
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(CopilotChat, {
    surface: "web",
    title: "Paytm AI",
    subtitle: "Business assistant",
    onClose: () => setCopilot(false),
    suggestedPrompts: ["How were sales this week?", "Which item is running low?", "Show pending settlements"],
    initialMessages: [{
      from: "assistant",
      text: "Hi! Ask me about your sales, settlements or inventory and I'll pull it up."
    }],
    getReply: q => "Sales this week: ₹1,84,200 across 612 orders — up 9% on last week. Fridays are your peak day; evenings are your peak hours."
  }))), /*#__PURE__*/React.createElement("div", {
    onClick: () => setVoice(false),
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(10,14,26,.4)",
      zIndex: 30,
      display: voice ? "grid" : "none",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 380,
      background: "#fff",
      borderRadius: 20,
      boxShadow: "var(--elev-3)",
      padding: "8px 8px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setVoice(false),
    "aria-label": "Close",
    style: {
      border: 0,
      background: "var(--line-100)",
      width: 32,
      height: 32,
      borderRadius: "50%",
      cursor: "pointer",
      color: "var(--ink-600)",
      display: "grid",
      placeItems: "center",
      margin: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 18
  }))), /*#__PURE__*/React.createElement(VoiceAssistant, {
    audience: "merchant"
  }))));
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/merchant/app.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AIActionCard = __ds_scope.AIActionCard;

__ds_ns.AIAvatar = __ds_scope.AIAvatar;

__ds_ns.AIExplainabilityPanel = __ds_scope.AIExplainabilityPanel;

__ds_ns.AIInsightCard = __ds_scope.AIInsightCard;

__ds_ns.AIRecommendationCard = __ds_scope.AIRecommendationCard;

__ds_ns.AIRiskAlert = __ds_scope.AIRiskAlert;

__ds_ns.ConfidenceMeter = __ds_scope.ConfidenceMeter;

__ds_ns.CopilotChat = __ds_scope.CopilotChat;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconCircle = __ds_scope.IconCircle;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.VoiceAssistant = __ds_scope.VoiceAssistant;

})();
