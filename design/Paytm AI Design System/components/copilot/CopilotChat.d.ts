import * as React from "react";

export interface ChatMessage {
  from: "assistant" | "user";
  text: string;
}

export interface CopilotQuickAction {
  icon: string;
  label: string;
}

/**
 * @startingPoint section="AI Copilot" subtitle="Conversational assistant — mobile or web" viewport="380x720"
 */
export interface CopilotChatProps {
  title?: string;
  subtitle?: string;
  /** Full-height mobile sheet, or a rounded web side-panel. */
  surface?: "mobile" | "web";
  initialMessages?: ChatMessage[];
  suggestedPrompts?: string[];
  quickActions?: CopilotQuickAction[];
  /** Map a user message to an assistant reply string. Swap for a real call. */
  getReply?: (question: string) => string;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/** The Paytm AI Copilot conversation surface (mobile sheet / web panel). */
export function CopilotChat(props: CopilotChatProps): React.JSX.Element;
